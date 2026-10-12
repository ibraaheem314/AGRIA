from django.db import transaction
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from dossiers import facts, services
from dossiers.access import (
    campaign_for_owner_write,
    campaign_for_read,
    own_projects,
    role_on,
    visible_campaigns,
)
from dossiers.models import Campaign, FactRevision
from dossiers.presenters import fact_state, person
from reviews.sections import dossier_status, pending_items


def campaign_summary(campaign: Campaign, user) -> dict:
    project = campaign.project
    return {
        "id": campaign.pk,
        "label": campaign.label,
        "archived": campaign.archived_at is not None,
        "archived_at": campaign.archived_at,
        "role": role_on(user, campaign),
        "created_at": campaign.created_at,
        "updated_at": campaign.updated_at,
        "project": {
            "id": project.pk,
            "name": project.name,
            "profile": project.profile,
            "profile_label": facts.PROFILES[project.profile],
            "is_demo": project.is_demo,
            "owner": person(project.owner),
        },
        "status": dossier_status(campaign),
        "pending": pending_items(campaign, role_on(user, campaign)),
    }


def dossier_payload(campaign: Campaign, user) -> dict:
    profile = campaign.project.profile
    current = {f.key: f for f in campaign.facts.select_related("updated_by")}
    definitions = facts.definitions_for(profile)
    return {
        **campaign_summary(campaign, user),
        "context_version": campaign.context_version,
        "statuses": [
            {"value": k, "label": v, "help": facts.STATUS_HELP[k]}
            for k, v in facts.STATUSES.items()
        ],
        "sections": [{"key": k, "label": v} for k, v in facts.SECTIONS.items()],
        "facts": [
            {**d.as_dict(profile), "state": fact_state(current.get(d.key))} for d in definitions
        ],
    }


# --- Projets -------------------------------------------------------------------------------


class ProjectCreateSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=120)
    profile = serializers.ChoiceField(choices=list(facts.PROFILES.items()))
    campaign_label = serializers.CharField(min_length=2, max_length=120)
    request_id = serializers.UUIDField()


@api_view(["GET", "POST"])
def projects(request):
    if request.method == "GET":
        items = own_projects(request.user).prefetch_related("campaigns")
        return Response(
            [
                {
                    "id": p.pk,
                    "name": p.name,
                    "profile": p.profile,
                    "is_demo": p.is_demo,
                    "campaigns": [{"id": c.pk, "label": c.label} for c in p.campaigns.all()],
                }
                for p in items
            ]
        )
    data = ProjectCreateSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    v = data.validated_data
    project, created = services.create_project(
        owner=request.user,
        name=v["name"].strip(),
        profile=v["profile"],
        campaign_label=v["campaign_label"].strip(),
        request_id=v["request_id"],
    )
    campaign = project.campaigns.order_by("created_at").first()
    return Response(
        dossier_payload(campaign, request.user),
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


class CampaignCreateSerializer(serializers.Serializer):
    label = serializers.CharField(min_length=2, max_length=120)
    request_id = serializers.UUIDField()
    copy_from = serializers.IntegerField(required=False, allow_null=True)


@api_view(["POST"])
def project_campaigns(request, project_id: int):
    project = own_projects(request.user).filter(pk=project_id).first()
    if project is None:
        raise NotFound("Projet introuvable.")
    data = CampaignCreateSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    copy_from = None
    if data.validated_data.get("copy_from"):
        copy_from = project.campaigns.filter(pk=data.validated_data["copy_from"]).first()
        if copy_from is None:
            raise serializers.ValidationError({"copy_from": "Campagne introuvable dans ce projet."})
    with transaction.atomic():
        campaign, created = services.create_campaign(
            project=project,
            label=data.validated_data["label"].strip(),
            request_id=data.validated_data["request_id"],
            copy_from=copy_from,
            author=request.user,
        )
    return Response(
        dossier_payload(campaign, request.user),
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


# --- Dossiers ------------------------------------------------------------------------------


@api_view(["GET"])
def dossiers(request):
    """Dossiers visibles : les siens, et pour un conseiller ceux qui lui sont attribués."""
    campaigns = visible_campaigns(request.user).order_by("-updated_at")
    return Response([campaign_summary(c, request.user) for c in campaigns])


@api_view(["GET"])
def dossier(request, campaign_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    return Response(dossier_payload(campaign, request.user))


class FactWriteSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=list(facts.STATUSES.items()))
    value = serializers.JSONField(required=False, allow_null=True)
    source = serializers.CharField(required=False, allow_blank=True, max_length=1000, default="")
    expected_version = serializers.IntegerField(min_value=0)


@api_view(["PUT"])
def fact(request, campaign_id: int, key: str):
    if key not in facts.BY_KEY:
        raise NotFound("Information inconnue.")
    data = FactWriteSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    v = data.validated_data
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        saved, changed = services.save_fact(
            campaign=campaign,
            key=key,
            status=v["status"],
            value=v.get("value"),
            source=v["source"],
            expected_version=v["expected_version"],
            author=request.user,
        )
    return Response(
        {
            "state": fact_state(saved),
            "changed": changed,
            "context_version": campaign.context_version,
        }
    )


@api_view(["GET"])
def fact_history(request, campaign_id: int, key: str):
    campaign = campaign_for_read(request.user, campaign_id)
    revisions = FactRevision.objects.filter(campaign=campaign, key=key).select_related("author")
    return Response(
        [
            {
                "context_version": r.context_version,
                "status": r.status,
                "value": r.value,
                "source": r.source,
                "author": person(r.author),
                "created_at": r.created_at,
            }
            for r in revisions
        ]
    )
