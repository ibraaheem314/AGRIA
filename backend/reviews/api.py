import json

from django.db import transaction
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from rest_framework.utils.encoders import JSONEncoder

from dossiers.access import (
    campaign_for_advisor_write,
    campaign_for_owner_write,
    campaign_for_participant_write,
    campaign_for_read,
    role_on,
)
from dossiers.presenters import person
from reviews import sections, services
from reviews.models import (
    COMMENT_KINDS,
    DECISIONS,
    SECTIONS,
    TARGETS,
    VERDICTS,
    Comment,
    Decision,
    Review,
    ReviewRequest,
)


def created_status(created: bool) -> int:
    return status.HTTP_201_CREATED if created else status.HTTP_200_OK


def comment_payload(c: Comment, viewer_role: str | None = None) -> dict:
    return {
        "id": c.pk,
        "kind": c.kind,
        "kind_label": COMMENT_KINDS[c.kind],
        "author": person(c.author),
        "author_role": "porteur" if c.author_id == c.campaign.project.owner_id else "conseiller",
        "target_type": c.target_type,
        "target_ref": c.target_ref,
        "target_label": c.target_label,
        "body": c.body,
        "resolved_at": c.resolved_at,
        "resolved_by": person(c.resolved_by),
        "created_at": c.created_at,
        "replies": [comment_payload(r) for r in c.replies.all()],
        "state": (
            sections.question_state(c, viewer_role, c.campaign.project.owner_id)
            if viewer_role and c.parent_id is None
            else None
        ),
    }


def advisors_payload(campaign) -> list[dict]:
    return [
        {"id": a.advisor_id, "display_name": a.advisor.display_name, "since": a.started_at}
        for a in campaign.assignments.filter(ended_at__isnull=True).select_related("advisor")
    ]


def relecture_payload(campaign, user) -> dict:
    versions = sections.current_versions(campaign)
    reviews = Review.objects.filter(campaign=campaign).select_related("advisor")
    requests = list(ReviewRequest.objects.filter(campaign=campaign).select_related("requested_by"))
    last_review_at = reviews[0].created_at if reviews else None
    threads = (
        Comment.objects.filter(campaign=campaign, parent__isnull=True)
        .select_related("author", "resolved_by", "campaign__project")
        .prefetch_related("replies__author", "replies__campaign__project")
    )
    return {
        "role": role_on(user, campaign),
        "can_review": campaign.assignments.filter(advisor=user, ended_at__isnull=True).exists(),
        "status": sections.dossier_status(campaign, versions),
        "versions": versions,
        "advisors": advisors_payload(campaign),
        "requests": [
            {
                "id": r.pk,
                "requested_by": person(r.requested_by),
                "note": r.note,
                "created_at": r.created_at,
                "answered": last_review_at is not None and last_review_at >= r.created_at,
            }
            for r in requests
        ],
        "reviews": [sections.review_payload(r, versions) for r in reviews],
        "decisions": [
            {
                "id": d.pk,
                "choice": d.choice,
                "choice_label": DECISIONS[d.choice],
                "reason": d.reason,
                "author": person(d.author),
                "created_at": d.created_at,
                "versions": d.versions,
            }
            for d in Decision.objects.filter(campaign=campaign).select_related("author")
        ],
        "threads": [comment_payload(c, role_on(user, campaign)) for c in threads],
        "choices": {
            "sections": [{"value": k, "label": v} for k, v in SECTIONS.items()],
            "verdicts": [{"value": k, "label": v} for k, v in VERDICTS.items()],
            "decisions": [{"value": k, "label": v} for k, v in DECISIONS.items()],
            "targets": [{"value": k, "label": v} for k, v in TARGETS.items()],
        },
    }


@api_view(["GET"])
def relecture(request, campaign_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    return Response(relecture_payload(campaign, request.user))


class RequestSerializer(serializers.Serializer):
    note = serializers.CharField(required=False, allow_blank=True, max_length=2000, default="")
    request_id = serializers.UUIDField()


@api_view(["POST"])
def review_requests(request, campaign_id: int):
    data = RequestSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        obj, created = services.request_review(
            campaign=campaign,
            note=data.validated_data["note"].strip(),
            request_id=data.validated_data["request_id"],
            author=request.user,
        )
    return Response({"id": obj.pk}, status=created_status(created))


class ReviewSerializer(serializers.Serializer):
    scope = serializers.ListField(child=serializers.ChoiceField(choices=list(SECTIONS)))
    verdict = serializers.ChoiceField(choices=list(VERDICTS.items()))
    opinion = serializers.CharField(allow_blank=True, max_length=8000)
    reservations = serializers.CharField(required=False, allow_blank=True, max_length=8000)
    seen_versions = serializers.DictField(child=serializers.IntegerField(min_value=0))
    request_id = serializers.UUIDField()


@api_view(["POST"])
def reviews(request, campaign_id: int):
    data = ReviewSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    values = dict(data.validated_data)
    request_id = values.pop("request_id")
    with transaction.atomic():
        campaign = campaign_for_advisor_write(request.user, campaign_id)
        review, created = services.give_review(
            campaign=campaign, advisor=request.user, data=values, request_id=request_id
        )
    return Response({"id": review.pk}, status=created_status(created))


@api_view(["GET"])
def review_detail(request, campaign_id: int, review_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    review = (
        Review.objects.filter(campaign=campaign, pk=review_id).select_related("advisor").first()
    )
    if review is None:
        raise NotFound("Avis introuvable.")
    versions = sections.current_versions(campaign)
    return Response(sections.review_payload(review, versions, with_snapshot=True))


class CommentSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=["question", "commentaire"], required=False)
    body = serializers.CharField(allow_blank=True, max_length=4000)
    target_type = serializers.ChoiceField(choices=list(TARGETS), required=False, default="dossier")
    target_ref = serializers.CharField(required=False, allow_blank=True, max_length=80, default="")
    parent_id = serializers.IntegerField(required=False, allow_null=True)
    request_id = serializers.UUIDField()

    def validate(self, attrs):
        if not attrs.get("parent_id") and not attrs.get("kind"):
            raise serializers.ValidationError({"kind": "Question ou commentaire."})
        return attrs


@api_view(["POST"])
def comments(request, campaign_id: int):
    data = CommentSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    values = dict(data.validated_data)
    request_id = values.pop("request_id")
    with transaction.atomic():
        campaign = campaign_for_participant_write(request.user, campaign_id)
        comment, created = services.post_comment(
            campaign=campaign, author=request.user, data=values, request_id=request_id
        )
    return Response({"id": comment.pk}, status=created_status(created))


@api_view(["POST"])
def comment_resolve(request, campaign_id: int, comment_id: int):
    with transaction.atomic():
        campaign = campaign_for_participant_write(request.user, campaign_id)
        comment = Comment.objects.filter(campaign=campaign, pk=comment_id).first()
        if comment is None:
            raise NotFound("Message introuvable.")
        _, changed = services.resolve_question(comment=comment, author=request.user)
    return Response({"changed": changed})


class DecisionSerializer(serializers.Serializer):
    choice = serializers.ChoiceField(choices=list(DECISIONS.items()))
    reason = serializers.CharField(allow_blank=True, max_length=4000)
    request_id = serializers.UUIDField()


@api_view(["POST"])
def decisions(request, campaign_id: int):
    data = DecisionSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    with transaction.atomic():
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        decision, created = services.record_decision(
            campaign=campaign, author=request.user, **data.validated_data
        )
    return Response({"id": decision.pk}, status=created_status(created))


@api_view(["POST"])
def archive(request, campaign_id: int):
    with transaction.atomic():
        campaign = campaign_for_read(request.user, campaign_id)
        if campaign.project.owner_id != request.user.pk:
            raise PermissionDenied("Seul le porteur du projet peut archiver son dossier.")
        if campaign.archived_at is not None:  # reprise d'un archivage déjà fait
            return Response({"changed": False})
        campaign = campaign_for_owner_write(request.user, campaign_id, lock=True)
        changed = services.archive(campaign=campaign)
    return Response({"changed": changed})


def synthese_payload(campaign, user) -> dict:
    versions = sections.current_versions(campaign)
    project = campaign.project
    plan_section = sections.section_content(campaign, "plan")
    return {
        "generated_at": timezone.now(),
        "dossier": {
            "id": campaign.pk,
            "label": campaign.label,
            "project": project.name,
            "owner": person(project.owner),
            "is_demo": project.is_demo,
            "created_at": campaign.created_at,
            "archived_at": campaign.archived_at,
        },
        "status": sections.dossier_status(campaign, versions),
        "versions": versions,
        "advisors": advisors_payload(campaign),
        "contexte": sections.section_content(campaign, "contexte"),
        "plan": plan_section,
        "budget": sections.section_content(campaign, "budget"),
        "reviews": [
            sections.review_payload(r, versions)
            for r in Review.objects.filter(campaign=campaign).select_related("advisor")
        ],
        "decisions": relecture_payload(campaign, user)["decisions"],
        "open_questions": [
            {"id": c.pk, "body": c.body, "author": person(c.author), "target_label": c.target_label}
            for c in Comment.objects.filter(
                campaign=campaign, kind="question", resolved_at__isnull=True
            ).select_related("author")
        ],
        "notice": (
            "Synthèse d'un dossier de préparation. Un dossier complet ou revu ne garantit ni la "
            "faisabilité ni la rentabilité du projet. Les contenus d'AGRIA n'ont pas été relus par "
            "un spécialiste agricole, sauf mention contraire."
        ),
    }


@api_view(["GET"])
def synthese(request, campaign_id: int):
    campaign = campaign_for_read(request.user, campaign_id)
    payload = synthese_payload(campaign, request.user)
    if request.query_params.get("telecharger") == "1":
        body = json.dumps(payload, cls=JSONEncoder, ensure_ascii=False, indent=2)
        response = HttpResponse(body, content_type="application/json; charset=utf-8")
        filename = f"agria-dossier-{campaign.pk}-v{versions_tag(payload['versions'])}.json"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Cache-Control"] = "no-store"
        return response
    return Response(payload)


def versions_tag(versions: dict) -> str:
    return f"{versions['contexte']}.{versions['plan']}.{versions['budget']}"
