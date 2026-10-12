"""Écritures du plan d'action. Un seul chemin d'écriture par démarche."""

from __future__ import annotations

from django.utils import timezone
from rest_framework.exceptions import ValidationError

from agria.errors import BusinessRuleViolation, Conflict
from dossiers.models import Campaign
from preparation import content as content_store
from preparation.engine import compute_checks
from preparation.models import Action, ActionEvent, CampaignPlan

CUSTOM_POSITION = 10_000


def fact_states(campaign: Campaign) -> dict:
    return {f.key: (f.status, f.value) for f in campaign.facts.all()}


def checks_for(campaign: Campaign, plan: CampaignPlan) -> list[dict]:
    return compute_checks(plan.template.content, campaign.project.profile, fact_states(campaign))


def ensure_plan(campaign: Campaign) -> CampaignPlan | None:
    """Plan du dossier, lié au modèle actif lors de sa création (puis figé pour ce dossier)."""
    plan = CampaignPlan.objects.filter(campaign=campaign).select_related("template").first()
    if plan:
        return plan
    template = content_store.active_template()
    if template is None:
        return None
    return CampaignPlan.objects.create(campaign=campaign, template=template)


def sync_plan(campaign: Campaign, author) -> list[Action]:
    """Ajoute les démarches demandées par les points actifs et absentes du plan.

    N'efface, ne modifie et ne recrée jamais une démarche existante, quel que soit son état.
    `campaign` doit être verrouillée par l'appelant.
    """
    plan = ensure_plan(campaign)
    if plan is None:
        return []
    content = plan.template.content
    order = {a["key"]: i for i, a in enumerate(content["actions"])}
    definitions = {a["key"]: a for a in content["actions"]}
    existing = set(
        Action.objects.filter(campaign=campaign)
        .exclude(definition_key="")
        .values_list("definition_key", flat=True)
    )
    added = []
    for check in checks_for(campaign, plan):
        key = check["action_key"]
        if not key or key in existing:
            continue
        definition = definitions[key]
        action = Action.objects.create(
            campaign=campaign,
            template=plan.template,
            definition_key=key,
            origin=f"{check['message']} (version {campaign.context_version} du dossier)",
            title=definition["title"],
            goal=definition["goal"],
            explanation=definition["explanation"],
            steps=definition["steps"],
            prerequisites=definition["prerequisites"],
            position=order[key],
            created_at_context_version=campaign.context_version,
            created_by=author,
        )
        existing.add(key)
        added.append(action)
    if added:
        plan.plan_version += 1
        plan.save(update_fields=["plan_version"])
        ActionEvent.objects.bulk_create(
            ActionEvent(
                action=a, plan_version=plan.plan_version, to_status="a_faire",
                note=f"Ajoutée au plan : {a.origin}", author=author,
            )
            for a in added
        )  # fmt: skip
    return added


def _bump(campaign: Campaign) -> int:
    plan = ensure_plan(campaign)
    if plan is None:
        raise BusinessRuleViolation("Aucun modèle de préparation n'est chargé sur ce serveur.")
    plan.plan_version += 1
    plan.save(update_fields=["plan_version"])
    return plan.plan_version


def create_custom_action(*, campaign: Campaign, title: str, goal: str, request_id, author):
    existing = Action.objects.filter(campaign=campaign, client_request_id=request_id).first()
    if existing:
        return existing, False
    action = Action.objects.create(
        campaign=campaign,
        title=title,
        goal=goal,
        origin="Ajoutée par le porteur du projet",
        position=CUSTOM_POSITION,
        created_at_context_version=campaign.context_version,
        client_request_id=request_id,
        created_by=author,
    )
    ActionEvent.objects.create(
        action=action, plan_version=_bump(campaign), to_status="a_faire",
        note="Ajoutée par le porteur du projet", author=author,
    )  # fmt: skip
    return action, True


def unmet_prerequisites(action: Action) -> list[Action]:
    if not action.prerequisites:
        return []
    return list(
        Action.objects.filter(
            campaign_id=action.campaign_id, definition_key__in=action.prerequisites
        ).exclude(status="terminee")
    )


def update_action(
    *, action: Action, data: dict, expected_version: int, author
) -> tuple[Action, bool]:
    """Change l'état d'une démarche (et son échéance). `action` doit être verrouillée.

    - « terminée » exige un résultat et sa date (pas dans le futur), et des prérequis terminés ;
    - « bloquée » exige un motif ;
    - rouvrir une démarche terminée efface le résultat courant, conservé dans l'historique.
    """
    status = data.get("status", action.status)
    target = {
        "status": status,
        "blocked_reason": (data.get("blocked_reason") or "").strip() if status == "bloquee" else "",
        "result_text": (data.get("result_text") or "").strip() if status == "terminee" else "",
        "result_date": data.get("result_date") if status == "terminee" else None,
        "result_outcome": (data.get("result_outcome") or "") if status == "terminee" else "",
        "due_date": data.get("due_date", action.due_date),
    }
    current = {k: getattr(action, k) for k in target}

    if expected_version != action.row_version:
        if current == target:
            return action, False  # reprise d'un envoi déjà appliqué
        raise Conflict(
            "Cette démarche a été modifiée entre-temps. Rechargez-la avant de réessayer."
        )
    if current == target:
        return action, False

    errors = {}
    if status == "bloquee" and not target["blocked_reason"]:
        errors["blocked_reason"] = "Indiquez ce qui bloque."
    if status == "terminee":
        if not target["result_text"]:
            errors["result_text"] = "Indiquez le résultat réel de la démarche."
        if not target["result_date"]:
            errors["result_date"] = "Indiquez la date de réalisation."
        elif target["result_date"] > timezone.localdate():
            errors["result_date"] = "La date de réalisation ne peut pas être dans le futur."
        if not target["result_outcome"]:
            errors["result_outcome"] = (
                "Indiquez si le résultat est favorable, défavorable ou incertain."
            )
    if errors:
        raise ValidationError(errors)
    if status == "terminee" and action.status != "terminee":
        missing = unmet_prerequisites(action)
        if missing:
            names = ", ".join(f"« {m.title} »" for m in missing)
            raise BusinessRuleViolation(f"À terminer d'abord : {names}.")

    previous = action.status
    for key, value in target.items():
        setattr(action, key, value)
    action.row_version += 1
    action.save()
    ActionEvent.objects.create(
        action=action,
        plan_version=_bump(action.campaign),
        from_status=previous,
        to_status=status,
        blocked_reason=action.blocked_reason,
        result_text=action.result_text,
        result_date=action.result_date,
        result_outcome=action.result_outcome,
        note="Échéance modifiée" if previous == status else "",
        author=author,
    )
    return action, True
