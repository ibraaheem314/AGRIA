"""Versions, instantanés des sections du dossier et statut calculé du dossier.

Une même fonction (`section_content`) produit l'instantané conservé dans un avis et le
contenu de la synthèse : ce que le conseiller a relu et ce que la synthèse affiche
sont donc construits de la même façon.
"""

from __future__ import annotations

from budget import services as budget_services
from budget.calc import CATEGORIES, UNITS
from dossiers import facts
from dossiers.models import Campaign
from preparation import services as preparation
from preparation.models import ACTION_STATUSES, RESULT_OUTCOMES, Action, CampaignPlan
from reviews.models import SECTIONS, VERDICTS, Decision, Review, ReviewRequest

STATUS_LABELS = {
    "archive": "Archivé",
    "differe": "Différé",
    "revu_sans_reserve": "Revu sans réserve sur le périmètre examiné",
    "revu_avec_reserves": "Revu avec réserves",
    "en_revue": "En revue",
    "a_completer": "À compléter",
    "pret_relecture": "Prêt pour une relecture",
    "brouillon": "Brouillon",
}


def current_versions(campaign: Campaign) -> dict[str, int]:
    plan = CampaignPlan.objects.filter(campaign=campaign).only("plan_version").first()
    return {
        "contexte": campaign.context_version,
        "plan": plan.plan_version if plan else 0,
        "budget": campaign.budget_version,
    }


def stale_sections(review: Review, versions: dict[str, int]) -> list[str]:
    """Sections relues qui ont changé depuis l'avis (vide = avis à jour)."""
    return [s for s in review.scope if versions.get(s) != review.versions.get(s)]


def section_content(campaign: Campaign, section: str) -> dict:
    if section == "contexte":
        profile = campaign.project.profile
        current = {f.key: f for f in campaign.facts.all()}
        items = []
        for d in facts.definitions_for(profile):
            f = current.get(d.key)
            items.append(
                {
                    "key": d.key,
                    "label": d.label_for(profile),
                    "status": f.status if f else "non_renseigne",
                    "status_label": facts.STATUSES.get(f.status) if f else "Non renseigné",
                    "value": f.value if f else None,
                    "source": f.source if f else "",
                }
            )
        return {"profile": profile, "profile_label": facts.PROFILES[profile], "facts": items}
    if section == "plan":
        plan = preparation.ensure_plan(campaign)
        checks = preparation.checks_for(campaign, plan) if plan else []
        actions = Action.objects.filter(campaign=campaign)
        return {
            "template": (
                {
                    "code": plan.template.code,
                    "version": plan.template.version,
                    "review_status": plan.template.review_status,
                }
                if plan
                else None
            ),
            "checks": [
                {k: c[k] for k in ("key", "fact_label", "level", "blocking", "message")}
                for c in checks
            ],
            "actions": [
                {
                    "id": a.pk,
                    "title": a.title,
                    "status": a.status,
                    "status_label": ACTION_STATUSES[a.status],
                    "blocked_reason": a.blocked_reason,
                    "result_text": a.result_text,
                    "result_date": a.result_date.isoformat() if a.result_date else None,
                    "result_outcome": RESULT_OUTCOMES.get(a.result_outcome),
                    "due_date": a.due_date.isoformat() if a.due_date else None,
                }
                for a in actions
            ],
        }
    if section == "budget":
        lines = budget_services.active_lines(campaign)
        return {
            "lines": [
                {
                    **budget_services.snapshot(line),
                    "unit_label": UNITS[line.unit],
                    "category_label": CATEGORIES[line.category],
                }
                for line in lines
            ],
            "totals": budget_services.budget_summary(campaign),
        }
    raise ValueError(section)


def snapshot(campaign: Campaign, scope: list[str]) -> dict:
    return {section: section_content(campaign, section) for section in scope}


def review_payload(review: Review, versions: dict[str, int], *, with_snapshot=False) -> dict:
    stale = stale_sections(review, versions)
    data = {
        "id": review.pk,
        "advisor": {"id": review.advisor_id, "display_name": review.advisor.display_name},
        "created_at": review.created_at,
        "scope": review.scope,
        "scope_labels": [SECTIONS[s] for s in review.scope],
        "versions": review.versions,
        "verdict": review.verdict,
        "verdict_label": VERDICTS[review.verdict],
        "opinion": review.opinion,
        "reservations": review.reservations,
        "current": not stale,
        "stale_sections": [SECTIONS[s] for s in stale],
    }
    if with_snapshot:
        data["snapshot"] = review.snapshot
    return data


def dossier_status(campaign: Campaign, versions: dict[str, int] | None = None) -> dict:
    """Statut affiché du dossier. « Revu » ne veut dire ni faisable, ni rentable."""
    versions = versions or current_versions(campaign)
    code = _status_code(campaign, versions)
    return {"code": code, "label": STATUS_LABELS[code]}


def _status_code(campaign: Campaign, versions: dict[str, int]) -> str:
    if campaign.archived_at is not None:
        return "archive"
    last_decision = Decision.objects.filter(campaign=campaign).first()
    if last_decision and last_decision.choice == "differer":
        return "differe"
    reviews = list(Review.objects.filter(campaign=campaign).select_related("advisor"))
    current = [r for r in reviews if not stale_sections(r, versions)]
    if current:
        return (
            "revu_avec_reserves" if current[0].verdict == "avec_reserves" else "revu_sans_reserve"
        )
    last_request = ReviewRequest.objects.filter(campaign=campaign).first()
    if last_request and campaign.assignments.filter(ended_at__isnull=True).exists():
        answered = any(r.created_at >= last_request.created_at for r in reviews)
        if not answered:
            return "en_revue"
    if not campaign.facts.exists():
        return "brouillon"
    plan = preparation.ensure_plan(campaign)
    checks = preparation.checks_for(campaign, plan) if plan else []
    if any(c["level"] in {"a_completer", "a_clarifier"} for c in checks):
        return "a_completer"
    return "pret_relecture"


def pending_items(campaign: Campaign) -> dict:
    """Ce qui attend une réponse : questions non résolues, demande de relecture sans avis."""
    from reviews.models import Comment

    last_request = ReviewRequest.objects.filter(campaign=campaign).first()
    last_review = Review.objects.filter(campaign=campaign).first()
    return {
        "open_questions": Comment.objects.filter(
            campaign=campaign, kind="question", resolved_at__isnull=True
        ).count(),
        "review_requested": bool(
            last_request
            and (last_review is None or last_review.created_at < last_request.created_at)
        ),
    }
