"""Écritures de la relecture : demandes, avis, messages, décisions, archivage."""

from __future__ import annotations

from django.utils import timezone
from rest_framework.exceptions import ValidationError

from agria.errors import BusinessRuleViolation, Conflict
from budget.models import BudgetLine
from dossiers import facts
from dossiers.models import Campaign
from preparation.models import Action
from reviews import sections
from reviews.models import SECTIONS, Comment, Decision, Review, ReviewRequest


def request_review(*, campaign: Campaign, note: str, request_id, author):
    existing = ReviewRequest.objects.filter(campaign=campaign, client_request_id=request_id).first()
    if existing:
        return existing, False
    return (
        ReviewRequest.objects.create(
            campaign=campaign,
            requested_by=author,
            note=note,
            versions=sections.current_versions(campaign),
            client_request_id=request_id,
        ),
        True,
    )


def give_review(*, campaign: Campaign, advisor, data: dict, request_id):
    """Avis d'un conseiller attribué. Refusé si le dossier a changé depuis sa lecture."""
    existing = Review.objects.filter(campaign=campaign, client_request_id=request_id).first()
    if existing:
        return existing, False
    scope = data["scope"]
    if not scope or len(set(scope)) != len(scope) or not set(scope) <= set(SECTIONS):
        raise ValidationError({"scope": "Choisissez au moins une section relue."})
    opinion = data["opinion"].strip()
    reservations = (data.get("reservations") or "").strip()
    errors = {}
    if not opinion:
        errors["opinion"] = "Rédigez votre avis."
    if data["verdict"] == "avec_reserves" and not reservations:
        errors["reservations"] = "Précisez vos réserves."
    if errors:
        raise ValidationError(errors)
    versions = sections.current_versions(campaign)
    seen = data["seen_versions"]
    if any(seen.get(s) != versions[s] for s in scope):
        raise Conflict(
            "Le dossier a été modifié depuis votre lecture. Relisez la version actuelle avant "
            "de donner votre avis."
        )
    ordered = [s for s in SECTIONS if s in scope]
    review = Review.objects.create(
        campaign=campaign,
        advisor=advisor,
        scope=ordered,
        versions=versions,
        verdict=data["verdict"],
        opinion=opinion,
        reservations=reservations,
        snapshot=sections.snapshot(campaign, ordered),
        client_request_id=request_id,
    )
    return review, True


def _target_label(campaign: Campaign, target_type: str, target_ref: str) -> str:
    if target_type == "dossier":
        return ""
    if target_type == "information":
        definition = facts.BY_KEY.get(target_ref)
        if definition and campaign.project.profile in definition.profiles:
            return definition.label_for(campaign.project.profile)
    elif target_ref.isdigit():
        model = Action if target_type == "demarche" else BudgetLine
        obj = model.objects.filter(campaign=campaign, pk=int(target_ref)).first()
        if obj is not None:
            return obj.title if target_type == "demarche" else obj.label
    raise ValidationError({"target_ref": "Élément introuvable dans ce dossier."})


def post_comment(*, campaign: Campaign, author, data: dict, request_id):
    existing = Comment.objects.filter(campaign=campaign, client_request_id=request_id).first()
    if existing:
        return existing, False
    body = data["body"].strip()
    if not body:
        raise ValidationError({"body": "Le message est vide."})
    parent = None
    if data.get("parent_id"):
        parent = Comment.objects.filter(
            campaign=campaign, pk=data["parent_id"], parent__isnull=True
        ).first()
        if parent is None:
            raise ValidationError({"parent_id": "Message introuvable dans ce dossier."})
        kind, target_type, target_ref, label = (
            "reponse", parent.target_type, parent.target_ref, parent.target_label,
        )  # fmt: skip
    else:
        kind = data["kind"]
        if kind not in {"question", "commentaire"}:
            raise ValidationError({"kind": "Question ou commentaire."})
        target_type = data.get("target_type") or "dossier"
        target_ref = (data.get("target_ref") or "").strip()
        label = _target_label(campaign, target_type, target_ref)
    comment = Comment.objects.create(
        campaign=campaign,
        author=author,
        kind=kind,
        target_type=target_type,
        target_ref=target_ref,
        target_label=label,
        parent=parent,
        body=body,
        client_request_id=request_id,
    )
    return comment, True


def resolve_question(*, comment: Comment, author):
    if comment.kind != "question":
        raise BusinessRuleViolation("Seule une question peut être marquée comme résolue.")
    if comment.resolved_at is not None:
        return comment, False
    comment.resolved_at = timezone.now()
    comment.resolved_by = author
    comment.save(update_fields=["resolved_at", "resolved_by"])
    return comment, True


def record_decision(*, campaign: Campaign, author, choice: str, reason: str, request_id):
    existing = Decision.objects.filter(campaign=campaign, client_request_id=request_id).first()
    if existing:
        return existing, False
    reason = reason.strip()
    if not reason:
        raise ValidationError({"reason": "Indiquez les motifs de la décision."})
    return (
        Decision.objects.create(
            campaign=campaign,
            author=author,
            choice=choice,
            reason=reason,
            versions=sections.current_versions(campaign),
            client_request_id=request_id,
        ),
        True,
    )


def archive(*, campaign: Campaign):
    if campaign.archived_at is not None:
        return False
    campaign.archived_at = timezone.now()
    campaign.save(update_fields=["archived_at", "updated_at"])
    return True
