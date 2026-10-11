"""Calculs du budget provisoire. Fonctions pures, déterministes, sans flottant.

Règles (documentées dans l'interface) :
- Montants en francs CFA (XOF), entiers : la monnaie n'a pas de subdivision.
- Montant d'une ligne = quantité × prix unitaire, arrondi au franc le plus proche
  (demi-franc arrondi vers le haut, ROUND_HALF_UP).
- Un total est la somme des montants de lignes déjà arrondis.
- Une ligne sans quantité ou sans prix est « incomplète » : elle n'entre dans aucun total
  et rend le budget incomplet. Un budget incomplet n'a pas de « total » : seulement un
  total des postes chiffrés.
- Une ressource déjà détenue est listée mais exclue des totaux (pas de double compte).
- Aucune recette, marge ou rentabilité n'est calculée.
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation

CATEGORIES = {
    "investissement": "Investissement (matériel durable, aménagement)",
    "campagne": "Dépense de la campagne",
}
PRICE_STATUSES = {"connu": "Prix connu", "estime": "Prix estimé", "manquant": "Prix manquant"}
UNITS = {
    "unite": "unité",
    "kg": "kg",
    "tonne": "tonne",
    "sac": "sac",
    "litre": "litre",
    "metre": "mètre",
    "m2": "m²",
    "ha": "hectare",
    "heure": "heure",
    "jour": "jour",
    "mois": "mois",
    "forfait": "forfait",
}
MAX_QUANTITY = Decimal("10000000")
MAX_UNIT_PRICE = 10_000_000_000


@dataclass(frozen=True)
class LineInput:
    category: str
    quantity: Decimal | None
    unit_price: int | None
    price_status: str
    already_owned: bool


def parse_quantity(raw) -> Decimal | None:
    """« 2,5 » ou 2.5 → Decimal('2.5'). Trois décimales au plus, strictement positive."""
    if raw is None or (isinstance(raw, str) and not raw.strip()):
        return None
    try:
        value = Decimal(_clean_number(raw))
    except InvalidOperation:
        raise ValueError("Quantité invalide.") from None
    if not value.is_finite() or value <= 0:
        raise ValueError("La quantité doit être supérieure à zéro.")
    if value > MAX_QUANTITY:
        raise ValueError("Quantité trop grande.")
    if value != value.quantize(Decimal("0.001")):
        raise ValueError("Trois décimales au plus.")
    return value


def parse_price(raw) -> int | None:
    """Prix unitaire en FCFA entiers (« 15 000 » accepté). Zéro autorisé (don, gratuit)."""
    if raw is None or (isinstance(raw, str) and not raw.strip()):
        return None
    try:
        value = Decimal(_clean_number(raw))
    except InvalidOperation:
        raise ValueError("Prix invalide.") from None
    if not value.is_finite() or value < 0:
        raise ValueError("Le prix ne peut pas être négatif.")
    if value != value.to_integral_value():
        raise ValueError("Prix en francs CFA entiers (pas de centimes).")
    if value > MAX_UNIT_PRICE:
        raise ValueError("Prix trop grand.")
    return int(value)


def _clean_number(raw) -> str:
    text = str(raw).strip()
    for space in (" ", " ", " "):
        text = text.replace(space, "")
    return text.replace(",", ".")


def line_amount(line: LineInput) -> int | None:
    if line.quantity is None or line.unit_price is None:
        return None
    return int((line.quantity * line.unit_price).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def line_state(line: LineInput) -> str:
    if line.already_owned:
        return "detenu"
    if line_amount(line) is None:
        return "incomplet"
    return line.price_status  # connu | estime


def _empty_totals() -> dict:
    return {
        "lines": 0,
        "owned": 0,
        "incomplete": 0,
        "estimated_lines": 0,
        "known_total": 0,
        "estimated_total": 0,
        "priced_total": 0,
    }


def _status(totals: dict) -> str:
    if totals["lines"] == totals["owned"]:
        return "vide"
    if totals["incomplete"]:
        return "incomplet"
    return "complet_estime" if totals["estimated_lines"] else "complet"


def summarize(lines: list[LineInput]) -> dict:
    """Totaux globaux et par catégorie. `complete` n'est vrai que sans aucune ligne incomplète."""
    overall = _empty_totals()
    by_category = {key: _empty_totals() for key in CATEGORIES}
    for line in lines:
        state = line_state(line)
        amount = line_amount(line)
        for totals in (overall, by_category[line.category]):
            totals["lines"] += 1
            if state == "detenu":
                totals["owned"] += 1
            elif state == "incomplet":
                totals["incomplete"] += 1
            elif state == "connu":
                totals["known_total"] += amount
                totals["priced_total"] += amount
            else:
                totals["estimated_lines"] += 1
                totals["estimated_total"] += amount
                totals["priced_total"] += amount
    for totals in (overall, *by_category.values()):
        totals["status"] = _status(totals)
        totals["complete"] = totals["status"] in {"complet", "complet_estime"}
    return {"overall": overall, "by_category": by_category}
