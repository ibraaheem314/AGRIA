from django.db import transaction
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from budget import calc, services, suggestions
from budget.models import BudgetEvent, BudgetLine
from dossiers.access import campaign_for_owner_write, campaign_for_read
from dossiers.presenters import person

RULES = [
    "Montants en francs CFA entiers.",
    "Montant d'un poste = quantité × prix unitaire, arrondi au franc le plus proche "
    "(le demi-franc est arrondi au franc supérieur).",
    "Les totaux additionnent les montants déjà arrondis des postes.",
    "Un poste sans quantité ou sans prix n'entre dans aucun total : le budget reste incomplet.",
    "Le matériel ou les ressources déjà détenus sont listés mais exclus des totaux.",
    "Aucune recette, marge ou rentabilité n'est calculée.",
]


def line_payload(line: BudgetLine) -> dict:
    data = services.snapshot(line)
    return {
        "id": line.pk,
        **data,
        "unit_label": calc.UNITS[line.unit],
        "category_label": calc.CATEGORIES[line.category],
        "price_status_label": calc.PRICE_STATUSES[line.price_status],
        "row_version": line.row_version,
        "updated_at": line.updated_at,
    }


def suggestions_payload(lines) -> list[dict]:
    added = {line.suggestion_key for line in lines if line.suggestion_key}
    return [
        {
            "key": s["key"],
            "label": s["label"],
            "help": s["help"],
            "category_label": calc.CATEGORIES[s["category"]],
            "added": s["key"] in added,
        }
        for s in suggestions.SUGGESTIONS
    ]


def budget_payload(campaign) -> dict:
    lines = list(services.active_lines(campaign))
    apport = campaign.facts.filter(key="apport").first()
    return {
        "budget_version": campaign.budget_version,
        "lines": [line_payload(line) for line in lines],
        "totals": services.budget_summary(campaign),
        "apport": (
            {"status": apport.status, "montant": (apport.value or {}).get("montant")}
            if apport
            else {"status": "non_renseigne", "montant": None}
        ),
        "rules": RULES,
        "suggestions": suggestions_payload(lines),
        "choices": {
            "categories": [{"value": k, "label": v} for k, v in calc.CATEGORIES.items()],
            "units": [{"value": k, "label": v} for k, v in calc.UNITS.items()],
            "price_statuses": [{"value": k, "label": v} for k, v in calc.PRICE_STATUSES.items()],
        },
    }


class LineSerializer(serializers.Serializer):
    """Forme seulement ; les règles métier sont dans services.clean."""

    category = serializers.CharField()
    label = serializers.CharField(allow_blank=True)
    quantity = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    unit = serializers.CharField()
    unit_price = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    price_status = serializers.CharField()
    source = serializers.CharField(required=False, allow_blank=True, default="")
    price_date = serializers.DateField(required=False, allow_null=True, default=None)
    already_owned = serializers.BooleanField(required=False, default=False)
    notes = serializers.CharField(required=False, allow_blank=True, default="", max_length=1000)


class CreateSerializer(LineSerializer):
    request_id = serializers.UUIDField()


class UpdateSerializer(LineSerializer):
    expected_version = serializers.IntegerField(min_value=1)


@api_view(["GET", "POST"])
def budget(request, campaign_id: int):
    if request.method == "GET":
        return Response(budget_payload(campaign_for_read(request.user, campaign_id)))
    data = CreateSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    values = dict(data.validated_data)
    request_id = values.pop("request_id")
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        line, created = services.create_line(
            campaign=campaign, data=values, request_id=request_id, author=request.user
        )
    return Response(
        line_payload(line), status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )


class SuggestionSerializer(serializers.Serializer):
    request_id = serializers.UUIDField()


@api_view(["POST"])
def budget_suggestion(request, campaign_id: int, key: str):
    data = SuggestionSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        line, created = services.add_suggestion(
            campaign=campaign, key=key, request_id=data.validated_data["request_id"],
            author=request.user,
        )  # fmt: skip
    return Response(
        line_payload(line), status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )


def _locked_line(user, campaign_id, line_id):
    campaign = campaign_for_owner_write(user, campaign_id, lock=True)
    line = BudgetLine.objects.select_for_update().filter(campaign=campaign, pk=line_id).first()
    if line is None:
        raise NotFound("Poste introuvable.")
    line.campaign = campaign
    return line


@api_view(["PUT"])
def budget_line(request, campaign_id: int, line_id: int):
    data = UpdateSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    values = dict(data.validated_data)
    expected = values.pop("expected_version")
    with transaction.atomic():
        line = _locked_line(request.user, campaign_id, line_id)
        line, changed = services.update_line(
            line=line, data=values, expected_version=expected, author=request.user
        )
    return Response({"changed": changed, **line_payload(line)})


class RemoveSerializer(serializers.Serializer):
    expected_version = serializers.IntegerField(min_value=1)


@api_view(["POST"])
def budget_line_remove(request, campaign_id: int, line_id: int):
    data = RemoveSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    with transaction.atomic():
        line = _locked_line(request.user, campaign_id, line_id)
        line, changed = services.remove_line(
            line=line, expected_version=data.validated_data["expected_version"], author=request.user
        )
    return Response({"changed": changed})


@api_view(["GET"])
def budget_history(request, campaign_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    events = (
        BudgetEvent.objects.filter(line__campaign=campaign)
        .select_related("author", "line")
        .order_by("-budget_version")
    )
    return Response(
        [
            {
                "budget_version": e.budget_version,
                "line_id": e.line_id,
                "kind": e.kind,
                "snapshot": e.snapshot,
                "author": person(e.author),
                "created_at": e.created_at,
            }
            for e in events
        ]
    )
