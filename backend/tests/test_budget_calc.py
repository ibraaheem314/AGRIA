"""Brique 4 : calculs du budget (fonctions pures, sans base)."""

from decimal import Decimal

import pytest

from budget.calc import LineInput, line_amount, parse_price, parse_quantity, summarize


def line(qty, price, status="connu", category="campagne", owned=False):
    return LineInput(
        category=category,
        quantity=None if qty is None else Decimal(qty),
        unit_price=price,
        price_status=status if price is not None else "manquant",
        already_owned=owned,
    )


@pytest.mark.parametrize(
    "qty, price, attendu",
    [
        ("3", 2500, 7500),
        ("2.5", 3, 8),  # 7,5 → 8 (demi arrondi vers le haut)
        ("0.5", 5, 3),  # 2,5 → 3
        ("0.333", 1000, 333),
        ("1.001", 999, 1000),  # 999,999 → 1 000
        ("10000000", 10_000_000_000, 100_000_000_000_000_000),  # pas de dépassement
        ("1", 0, 0),
    ],
)
def test_montant_arrondi_au_franc(qty, price, attendu):
    assert line_amount(line(qty, price)) == attendu


def test_total_somme_des_montants_arrondis():
    # 3 × (0,5 × 5 = 2,5 → 3) = 9, et non arrondi(7,5) = 8.
    result = summarize([line("0.5", 5), line("0.5", 5), line("0.5", 5)])
    assert result["overall"]["known_total"] == 9


def test_ligne_incomplete_rend_le_budget_incomplet_et_n_entre_dans_aucun_total():
    result = summarize([line("2", 1000), line(None, 500), line("3", None)])
    overall = result["overall"]
    assert overall["status"] == "incomplet"
    assert overall["complete"] is False
    assert overall["incomplete"] == 2
    assert overall["priced_total"] == 2000


def test_estimations_distinguees_des_prix_connus():
    result = summarize([line("1", 1000), line("2", 300, status="estime")])
    overall = result["overall"]
    assert (overall["known_total"], overall["estimated_total"], overall["priced_total"]) == (
        1000,
        600,
        1600,
    )
    assert overall["status"] == "complet_estime"


def test_ressource_detenue_exclue_des_totaux_et_de_la_completude():
    result = summarize([line("1", 1000), line(None, None, owned=True), line("1", 900, owned=True)])
    overall = result["overall"]
    assert overall["priced_total"] == 1000
    assert overall["owned"] == 2
    assert overall["status"] == "complet"


def test_budget_vide_n_est_jamais_complet():
    assert summarize([])["overall"]["status"] == "vide"
    assert summarize([line("1", 5, owned=True)])["overall"]["complete"] is False


def test_investissement_et_campagne_separes():
    result = summarize(
        [line("1", 50000, category="investissement"), line("10", 1500, category="campagne")]
    )
    assert result["by_category"]["investissement"]["priced_total"] == 50000
    assert result["by_category"]["campagne"]["priced_total"] == 15000
    assert result["overall"]["priced_total"] == 65000


@pytest.mark.parametrize(
    "raw, attendu",
    [
        ("2,5", Decimal("2.5")),
        ("1 000", Decimal("1000")),
        (3, Decimal("3")),
        ("", None),
        (None, None),
    ],
)
def test_saisie_de_quantite(raw, attendu):
    assert parse_quantity(raw) == attendu


@pytest.mark.parametrize("raw", ["0", "-1", "abc", "1.0005", "NaN", "Infinity"])
def test_quantite_invalide(raw):
    with pytest.raises(ValueError):
        parse_quantity(raw)


@pytest.mark.parametrize("raw, attendu", [("15 000", 15000), ("15 000", 15000), ("0", 0)])
def test_saisie_de_prix(raw, attendu):
    assert parse_price(raw) == attendu


@pytest.mark.parametrize("raw", ["-5", "12,50", "abc"])
def test_prix_invalide(raw):
    with pytest.raises(ValueError):
        parse_price(raw)
