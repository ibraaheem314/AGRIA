"""Représentations JSON partagées entre modules (sans dépendance vers les vues)."""

from dossiers.models import Fact


def person(user) -> dict | None:
    return {"id": user.pk, "display_name": user.display_name} if user else None


def fact_state(fact: Fact | None) -> dict:
    if fact is None:
        return {"status": "non_renseigne", "value": None, "source": "", "row_version": 0,
                "updated_at": None, "updated_by": None}  # fmt: skip
    return {
        "status": fact.status,
        "value": fact.value,
        "source": fact.source,
        "row_version": fact.row_version,
        "updated_at": fact.updated_at,
        "updated_by": person(fact.updated_by),
    }
