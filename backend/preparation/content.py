"""Chargement et validation des modèles de contenu (fichiers JSON versionnés dans Git).

Un modèle chargé est immuable : recharger une même (code, version) avec un contenu
différent est refusé. Toute correction passe par une nouvelle version du fichier.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from dossiers import facts
from preparation.models import REVIEW_STATUSES, PreparationTemplate

CONTENT_DIR = Path(__file__).resolve().parent / "content"
LEVELS = {"a_completer", "a_clarifier", "a_verifier"}
FACT_STATES = {"non_renseigne", *facts.STATUSES}
ACTIVE_CODE = "preparation-generique"


class ContentError(ValueError):
    pass


def validate(content: dict) -> None:
    """Lève ContentError avec un message précis si le contenu est incohérent."""
    for key in ("code", "version", "title", "scope", "source", "review", "checks", "actions"):
        if key not in content:
            raise ContentError(f"Champ « {key} » manquant.")
    if content["review"].get("status") not in REVIEW_STATUSES:
        raise ContentError("review.status invalide.")
    if content["review"]["status"] == "relu" and not (
        content["review"].get("reviewer") and content["review"].get("date")
    ):
        raise ContentError("Un contenu « relu » doit indiquer son relecteur et la date.")

    actions = {}
    for action in content["actions"]:
        for key in ("key", "title", "goal", "explanation", "steps", "prerequisites"):
            if key not in action:
                raise ContentError(f"Démarche sans « {key} » : {action.get('key')}")
        if action["key"] in actions:
            raise ContentError(f"Démarche en double : {action['key']}")
        actions[action["key"]] = action
    for action in actions.values():
        for prereq in action["prerequisites"]:
            if prereq not in actions:
                raise ContentError(f"Prérequis inconnu {prereq} dans {action['key']}")
    _check_no_cycle(actions)

    seen_checks = set()
    for check in content["checks"]:
        if check["key"] in seen_checks:
            raise ContentError(f"Vérification en double : {check['key']}")
        seen_checks.add(check["key"])
        if check["fact"] not in facts.BY_KEY:
            raise ContentError(f"Information inconnue {check['fact']} dans {check['key']}")
        if not check.get("why"):
            raise ContentError(f"Vérification sans justification : {check['key']}")
        definition = facts.BY_KEY[check["fact"]]
        for rule in check["rules"]:
            if rule.get("level") not in LEVELS:
                raise ContentError(f"Niveau invalide dans {check['key']}")
            if not rule.get("message"):
                raise ContentError(f"Règle sans message dans {check['key']}")
            if "states" not in rule and "value" not in rule:
                raise ContentError(f"Règle sans condition dans {check['key']}")
            if not set(rule.get("states", [])) <= FACT_STATES:
                raise ContentError(f"État inconnu dans {check['key']}")
            for field_name in rule.get("value", {}):
                if field_name not in {f.name for f in definition.fields}:
                    raise ContentError(f"Champ inconnu {field_name} dans {check['key']}")
            if rule.get("action") and rule["action"] not in actions:
                raise ContentError(f"Démarche inconnue {rule['action']} dans {check['key']}")
            if rule["level"] == "a_completer" and rule.get("action"):
                raise ContentError(
                    "Une information à compléter se règle dans le dossier, sans démarche."
                )


def _check_no_cycle(actions: dict) -> None:
    state: dict[str, int] = {}

    def visit(key: str) -> None:
        if state.get(key) == 1:
            raise ContentError(f"Cycle de prérequis autour de {key}")
        if state.get(key) == 2:
            return
        state[key] = 1
        for prereq in actions[key]["prerequisites"]:
            visit(prereq)
        state[key] = 2

    for key in actions:
        visit(key)


def digest(content: dict) -> str:
    canonical = json.dumps(content, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def load_file(path: Path) -> tuple[PreparationTemplate, bool]:
    """Charge un fichier. Retourne (modèle, créé). Refuse une version déjà chargée et modifiée."""
    content = json.loads(path.read_text(encoding="utf-8"))
    validate(content)
    sha = digest(content)
    existing = PreparationTemplate.objects.filter(
        code=content["code"], version=content["version"]
    ).first()
    if existing:
        if existing.content_sha256 != sha:
            name = f"{content['code']} v{content['version']}"
            raise ContentError(
                f"{name} est déjà chargé avec un contenu différent. "
                "Un contenu publié ne se modifie pas : créer une nouvelle version."
            )
        return existing, False
    template = PreparationTemplate.objects.create(
        code=content["code"],
        version=content["version"],
        title=content["title"],
        review_status=content["review"]["status"],
        content=content,
        content_sha256=sha,
    )
    return template, True


def load_all() -> list[tuple[PreparationTemplate, bool]]:
    return [load_file(path) for path in sorted(CONTENT_DIR.glob("*.json"))]


def active_template() -> PreparationTemplate | None:
    return PreparationTemplate.objects.filter(code=ACTIVE_CODE).order_by("-version").first()
