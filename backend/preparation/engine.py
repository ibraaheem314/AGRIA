"""Calcul des points à vérifier à partir du contexte et du modèle de préparation.

Fonction pure et déterministe : mêmes informations + même modèle => mêmes points.
Les points ne sont pas stockés (ils ne peuvent donc pas devenir incohérents avec le
contexte) ; les démarches qu'ils ont fait naître, elles, sont conservées.
"""

from __future__ import annotations

from dossiers import facts

LEVEL_LABELS = {
    "a_completer": "À compléter dans le dossier",
    "a_clarifier": "À clarifier",
    "a_verifier": "À vérifier",
}


def _matches(rule: dict, status: str, value: dict | None) -> bool:
    if "states" in rule and status not in rule["states"]:
        return False
    if "value" in rule:
        if value is None:
            return False
        for field_name, allowed in rule["value"].items():
            if value.get(field_name) not in allowed:
                return False
    return True


def compute_checks(content: dict, profile: str, fact_states: dict[str, tuple[str, dict | None]]):
    """`fact_states` : {clé: (état, valeur)} ; une clé absente vaut « non renseigné »."""
    results = []
    for check in content["checks"]:
        definition = facts.BY_KEY[check["fact"]]
        if profile not in definition.profiles:
            continue
        status, value = fact_states.get(check["fact"], ("non_renseigne", None))
        rule = next((r for r in check["rules"] if _matches(r, status, value)), None)
        if rule is None:
            continue
        results.append(
            {
                "key": check["key"],
                "fact_key": check["fact"],
                "fact_label": definition.label_for(profile),
                "fact_status": status,
                "level": rule["level"],
                "level_label": LEVEL_LABELS[rule["level"]],
                "blocking": bool(rule.get("blocking")),
                "message": rule["message"],
                "why": check["why"],
                "action_key": rule.get("action"),
            }
        )
    return results
