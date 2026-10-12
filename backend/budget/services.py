"""Écritures du budget. Un seul chemin d'écriture ; chaque changement est historisé."""

from __future__ import annotations

from django.utils import timezone
from rest_framework.exceptions import NotFound, ValidationError

from agria.errors import Conflict
from budget import calc, suggestions
from budget.models import BudgetEvent, BudgetLine
from dossiers.models import Campaign

FIELDS = (
    "category", "label", "quantity", "unit", "unit_price", "price_status",
    "source", "price_date", "already_owned", "notes",
)  # fmt: skip


def clean(data: dict) -> dict:
    """Valide un poste complet. Lève ValidationError({champ: message})."""
    errors: dict[str, str] = {}
    out = {
        "category": data.get("category"),
        "label": (data.get("label") or "").strip(),
        "unit": data.get("unit"),
        "price_status": data.get("price_status"),
        "source": (data.get("source") or "").strip(),
        "price_date": data.get("price_date"),
        "already_owned": bool(data.get("already_owned", False)),
        "notes": (data.get("notes") or "").strip(),
    }
    if out["category"] not in calc.CATEGORIES:
        errors["category"] = "Choisissez investissement ou dépense de la campagne."
    if len(out["label"]) < 2:
        errors["label"] = "Nommez le poste (2 caractères au moins)."
    elif len(out["label"]) > 200:
        errors["label"] = "200 caractères au maximum."
    if out["unit"] not in calc.UNITS:
        errors["unit"] = "Unité invalide."
    if out["price_status"] not in calc.PRICE_STATUSES:
        errors["price_status"] = "Indiquez si le prix est connu, estimé ou manquant."
    if len(out["source"]) > 300:
        errors["source"] = "300 caractères au maximum."
    try:
        out["quantity"] = calc.parse_quantity(data.get("quantity"))
    except ValueError as exc:
        errors["quantity"] = str(exc)
    try:
        out["unit_price"] = calc.parse_price(data.get("unit_price"))
    except ValueError as exc:
        errors["unit_price"] = str(exc)

    status = out["price_status"]
    if "unit_price" not in errors:
        if status == "manquant" and out["unit_price"] is not None:
            errors["unit_price"] = "Un prix est saisi : choisissez « connu » ou « estimé »."
        if status in {"connu", "estime"} and out["unit_price"] is None:
            errors["unit_price"] = "Indiquez le prix unitaire, ou choisissez « prix manquant »."
    if status in {"connu", "estime"} and not out["source"]:
        errors["source"] = (
            "Indiquez d'où vient ce prix (devis, vendeur, marché…)."
            if status == "connu"
            else "Indiquez sur quoi repose l'estimation."
        )
    if status == "connu" and not out["price_date"]:
        errors["price_date"] = "Indiquez la date du prix (devis ou relevé)."
    if out["price_date"] and out["price_date"] > timezone.localdate():
        errors["price_date"] = "La date du prix ne peut pas être dans le futur."
    if errors:
        raise ValidationError(errors)
    return out


def snapshot(line: BudgetLine) -> dict:
    inp = to_input(line)
    return {
        "category": line.category,
        "label": line.label,
        "quantity": None if line.quantity is None else format(line.quantity.normalize(), "f"),
        "unit": line.unit,
        "unit_price": line.unit_price,
        "price_status": line.price_status,
        "source": line.source,
        "price_date": line.price_date.isoformat() if line.price_date else None,
        "already_owned": line.already_owned,
        "notes": line.notes,
        "amount": calc.line_amount(inp),
        "state": calc.line_state(inp),
        "removed": line.removed_at is not None,
    }


def to_input(line: BudgetLine) -> calc.LineInput:
    return calc.LineInput(
        category=line.category,
        quantity=line.quantity,
        unit_price=line.unit_price,
        price_status=line.price_status,
        already_owned=line.already_owned,
    )


def _bump(campaign: Campaign) -> int:
    campaign.budget_version += 1
    campaign.save(update_fields=["budget_version", "updated_at"])
    return campaign.budget_version


def _record(line: BudgetLine, kind: str, author) -> None:
    BudgetEvent.objects.create(
        line=line, budget_version=_bump(line.campaign), kind=kind, snapshot=snapshot(line),
        author=author,
    )  # fmt: skip


def create_line(*, campaign: Campaign, data: dict, request_id, author) -> tuple[BudgetLine, bool]:
    """`campaign` verrouillée par l'appelant. Rejouer la même requête ne crée rien."""
    existing = BudgetLine.objects.filter(campaign=campaign, client_request_id=request_id).first()
    if existing:
        return existing, False
    values = clean(data)
    line = BudgetLine.objects.create(
        campaign=campaign, client_request_id=request_id, created_by=author, **values
    )
    _record(line, "ajout", author)
    return line, True


def add_suggestion(*, campaign: Campaign, key: str, request_id, author) -> tuple[BudgetLine, bool]:
    """Ajoute un poste « à examiner », sans quantité ni prix. `campaign` verrouillée.

    Sans doublon : si un poste actif existe déjà pour cet élément, il est renvoyé tel quel.
    """
    suggestion = suggestions.BY_KEY.get(key)
    if suggestion is None:
        raise NotFound("Élément inconnu.")
    existing = (
        BudgetLine.objects.filter(
            campaign=campaign, suggestion_key=key, removed_at__isnull=True
        ).first()
        or BudgetLine.objects.filter(campaign=campaign, client_request_id=request_id).first()
    )
    if existing:
        return existing, False
    values = clean(
        {
            "category": suggestion["category"],
            "label": suggestion["label"],
            "unit": "forfait",
            "price_status": "manquant",
        }
    )
    line = BudgetLine.objects.create(
        campaign=campaign, client_request_id=request_id, suggestion_key=key, created_by=author,
        **values,
    )  # fmt: skip
    _record(line, "ajout", author)
    return line, True


def _same(line: BudgetLine, values: dict) -> bool:
    return all(getattr(line, key) == value for key, value in values.items())


def update_line(*, line: BudgetLine, data: dict, expected_version: int, author):
    if line.removed_at is not None:
        raise Conflict("Ce poste a été retiré du budget.")
    values = clean(data)
    if expected_version != line.row_version:
        if _same(line, values):
            return line, False
        raise Conflict("Ce poste a été modifié entre-temps. Rechargez-le avant de réessayer.")
    if _same(line, values):
        return line, False
    for key, value in values.items():
        setattr(line, key, value)
    line.row_version += 1
    line.save()
    _record(line, "modif", author)
    return line, True


def remove_line(*, line: BudgetLine, expected_version: int, author):
    if line.removed_at is not None:
        return line, False  # reprise d'un retrait déjà fait
    if expected_version != line.row_version:
        raise Conflict("Ce poste a été modifié entre-temps. Rechargez-le avant de le retirer.")
    line.removed_at = timezone.now()
    line.row_version += 1
    line.save()
    _record(line, "retrait", author)
    return line, True


def active_lines(campaign: Campaign):
    return BudgetLine.objects.filter(campaign=campaign, removed_at__isnull=True)


def budget_summary(campaign: Campaign) -> dict:
    return calc.summarize([to_input(line) for line in active_lines(campaign)])
