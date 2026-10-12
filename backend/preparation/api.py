from django.db import transaction
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from dossiers import facts
from dossiers.access import campaign_for_owner_write, campaign_for_read
from dossiers.models import Campaign
from dossiers.presenters import person
from preparation import services
from preparation.models import (
    ACTION_STATUSES,
    RESULT_OUTCOMES,
    REVIEW_STATUSES,
    Action,
    ActionEvent,
    CampaignPlan,
)


def template_payload(template) -> dict:
    content = template.content
    return {
        "code": template.code,
        "version": template.version,
        "title": template.title,
        "review_status": template.review_status,
        "review_label": REVIEW_STATUSES[template.review_status],
        "review_note": content["review"].get("note"),
        "reviewer": content["review"].get("reviewer"),
        "review_date": content["review"].get("date"),
        "source": content["source"],
        "scope": content["scope"],
    }


def action_facts(content: dict) -> dict[str, str]:
    """Information du dossier concernée par chaque démarche du modèle (d'après ses règles)."""
    related = {}
    for check in content["checks"]:
        for rule in check["rules"]:
            if rule.get("action"):
                related.setdefault(rule["action"], check["fact"])
    return related


def action_payload(
    action: Action,
    by_key: dict[str, Action],
    active_checks: dict,
    related_facts: dict[str, str] | None = None,
    profile: str = "debutant",
) -> dict:
    prerequisites = []
    for key in action.prerequisites:
        other = by_key.get(key)
        if other is not None:  # un prérequis absent du plan ne s'applique pas
            prerequisites.append(
                {"id": other.pk, "title": other.title, "done": other.status == "terminee"}
            )
    linked = active_checks.get(action.definition_key) if action.definition_key else None
    fact_key = (related_facts or {}).get(action.definition_key) if action.definition_key else None
    return {
        "id": action.pk,
        "definition_key": action.definition_key or None,
        "custom": not action.definition_key,
        "title": action.title,
        "goal": action.goal,
        "explanation": action.explanation,
        "steps": action.steps,
        "prerequisites": prerequisites,
        "prerequisites_met": all(p["done"] for p in prerequisites),
        "status": action.status,
        "status_label": ACTION_STATUSES[action.status],
        "blocked_reason": action.blocked_reason,
        "result_text": action.result_text,
        "result_date": action.result_date,
        "result_outcome": action.result_outcome or None,
        "result_outcome_label": RESULT_OUTCOMES.get(action.result_outcome),
        "due_date": action.due_date,
        "origin": action.origin,
        "row_version": action.row_version,
        "created_at": action.created_at,
        "updated_at": action.updated_at,
        # Point qui justifie encore cette démarche (None : il n'est plus signalé).
        "linked_check": (
            {
                "key": linked["key"],
                "message": linked["message"],
                "level": linked["level"],
                "fact_key": linked["fact_key"],
            }
            if linked
            else None
        ),
        # Information du dossier que cette démarche aide à établir (None : démarche personnelle).
        "related_fact": (
            {"key": fact_key, "label": facts.BY_KEY[fact_key].label_for(profile)}
            if fact_key
            else None
        ),
    }


def preparation_payload(campaign) -> dict:
    plan = services.ensure_plan(campaign)
    if plan is None:
        return {
            "template": None,
            "plan_version": 0,
            "checks": [],
            "actions": [],
            "next_action_id": None,
        }
    checks = services.checks_for(campaign, plan)
    actions = list(Action.objects.filter(campaign=campaign))
    by_key = {a.definition_key: a for a in actions if a.definition_key}
    active_by_action = {c["action_key"]: c for c in checks if c["action_key"]}
    related = action_facts(plan.template.content)
    profile = campaign.project.profile
    payloads = [action_payload(a, by_key, active_by_action, related, profile) for a in actions]
    for check in checks:
        linked = by_key.get(check["action_key"]) if check["action_key"] else None
        check["action"] = (
            {"id": linked.pk, "title": linked.title, "status": linked.status} if linked else None
        )
    in_progress = [a for a in payloads if a["status"] == "en_cours"]
    ready = [a for a in payloads if a["status"] == "a_faire" and a["prerequisites_met"]]
    nxt = (in_progress or ready or [None])[0]
    return {
        "template": template_payload(plan.template),
        "plan_version": plan.plan_version,
        "context_version": campaign.context_version,
        "checks": checks,
        "actions": payloads,
        "next_action_id": nxt["id"] if nxt else None,
    }


@api_view(["GET"])
def preparation(request, campaign_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    if not CampaignPlan.objects.filter(campaign=campaign).exists():
        # Dossier antérieur au plan d'action : initialisation unique, sous verrou.
        with transaction.atomic():
            locked = (
                Campaign.objects.select_for_update().select_related("project").get(pk=campaign.pk)
            )
            services.sync_plan(locked, None)
    return Response(preparation_payload(campaign))


class CustomActionSerializer(serializers.Serializer):
    title = serializers.CharField(min_length=3, max_length=200)
    goal = serializers.CharField(required=False, allow_blank=True, max_length=1000, default="")
    request_id = serializers.UUIDField()


@api_view(["POST"])
def actions(request, campaign_id: int):
    data = CustomActionSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        action, created = services.create_custom_action(
            campaign=campaign,
            title=data.validated_data["title"].strip(),
            goal=data.validated_data["goal"].strip(),
            request_id=data.validated_data["request_id"],
            author=request.user,
        )
    return Response(
        {"id": action.pk}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )


class ActionUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=list(ACTION_STATUSES.items()), required=False)
    blocked_reason = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    result_text = serializers.CharField(required=False, allow_blank=True, max_length=4000)
    result_date = serializers.DateField(required=False, allow_null=True)
    result_outcome = serializers.ChoiceField(
        choices=list(RESULT_OUTCOMES.items()), required=False, allow_blank=True
    )
    due_date = serializers.DateField(required=False, allow_null=True)
    expected_version = serializers.IntegerField(min_value=1)


@api_view(["PATCH"])
def action_detail(request, campaign_id: int, action_id: int):
    data = ActionUpdateSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        action = Action.objects.select_for_update().filter(campaign=campaign, pk=action_id).first()
        if action is None:
            raise NotFound("Démarche introuvable.")
        action.campaign = campaign
        values = dict(data.validated_data)
        expected = values.pop("expected_version")
        action, changed = services.update_action(
            action=action, data=values, expected_version=expected, author=request.user
        )
    return Response(
        {"changed": changed, "row_version": action.row_version, "status": action.status}
    )


@api_view(["GET"])
def action_history(request, campaign_id: int, action_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    action = Action.objects.filter(campaign=campaign, pk=action_id).first()
    if action is None:
        raise NotFound("Démarche introuvable.")
    events = ActionEvent.objects.filter(action=action).select_related("author")
    return Response(
        [
            {
                "plan_version": e.plan_version,
                "from_status": e.from_status or None,
                "to_status": e.to_status,
                "blocked_reason": e.blocked_reason,
                "result_text": e.result_text,
                "result_date": e.result_date,
                "result_outcome": e.result_outcome or None,
                "note": e.note,
                "author": person(e.author),
                "created_at": e.created_at,
            }
            for e in events
        ]
    )
