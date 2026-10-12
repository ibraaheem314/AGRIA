"""Brique 4 : API du budget provisoire."""

import datetime as dt
import uuid

import pytest
from django.utils import timezone

from budget.models import BudgetEvent, BudgetLine
from dossiers.models import AdvisorAssignment

pytestmark = pytest.mark.django_db

TODAY = dt.date.today().isoformat()


def url(dossier, suffix=""):
    return f"/api/dossiers/{dossier['id']}/budget{suffix}"


def poste(**overrides):
    data = {
        "category": "campagne",
        "label": "Semences",
        "quantity": "2",
        "unit": "kg",
        "unit_price": "15 000",
        "price_status": "connu",
        "source": "Devis boutique de Pout",
        "price_date": timezone.localdate().isoformat(),
        "request_id": str(uuid.uuid4()),
    }
    data.update(overrides)
    return data


def get_budget(sess, dossier):
    response = sess.get(url(dossier))
    assert response.status_code == 200
    return response.json()


def test_poste_connu_calcule_par_le_serveur(porteur, dossier):
    response = porteur.post(url(dossier), poste(quantity="2,5", unit_price="15 000"))
    assert response.status_code == 201
    assert response.json()["amount"] == 37500
    totals = get_budget(porteur, dossier)["totals"]["overall"]
    assert totals["status"] == "complet"
    assert totals["known_total"] == 37500


def test_budget_incomplet_jamais_presente_comme_complet(porteur, dossier):
    porteur.post(url(dossier), poste())
    porteur.post(
        url(dossier),
        poste(
            label="Main-d'œuvre",
            unit="jour",
            quantity="10",
            unit_price=None,
            price_status="manquant",
            source="",
        ),
    )
    data = get_budget(porteur, dossier)
    overall = data["totals"]["overall"]
    assert overall["status"] == "incomplet"
    assert overall["complete"] is False
    assert overall["incomplete"] == 1
    assert overall["priced_total"] == 30000
    missing = next(line for line in data["lines"] if line["label"] == "Main-d'œuvre")
    assert missing["amount"] is None
    assert missing["state"] == "incomplet"


def test_budget_vide(porteur, dossier):
    assert get_budget(porteur, dossier)["totals"]["overall"]["status"] == "vide"


@pytest.mark.parametrize(
    "overrides, champ",
    [
        ({"source": ""}, "source"),
        ({"price_date": None}, "price_date"),
        ({"price_status": "manquant"}, "unit_price"),  # prix saisi mais déclaré manquant
        ({"unit_price": None}, "unit_price"),  # connu sans prix
        ({"price_status": "estime", "source": ""}, "source"),
        ({"quantity": "-2"}, "quantity"),
        ({"unit_price": "12,5"}, "unit_price"),
        ({"unit": "boisseau"}, "unit"),
        ({"category": "recette"}, "category"),
        ({"label": " "}, "label"),
        ({"price_date": "2999-01-01"}, "price_date"),
    ],
)
def test_poste_invalide_refuse_avec_le_champ_en_cause(porteur, dossier, overrides, champ):
    response = porteur.post(url(dossier), poste(**overrides))
    assert response.status_code == 400
    assert champ in response.json()["error"]["fields"]
    assert BudgetLine.objects.count() == 0


def test_estimation_sans_date_acceptee(porteur, dossier):
    response = porteur.post(
        url(dossier), poste(price_status="estime", price_date=None, source="Prix vu au marché")
    )
    assert response.status_code == 201


def test_reprise_de_creation_sans_doublon(porteur, dossier):
    data = poste()
    first = porteur.post(url(dossier), data)
    again = porteur.post(url(dossier), data)
    assert (first.status_code, again.status_code) == (201, 200)
    assert BudgetLine.objects.count() == 1
    assert BudgetEvent.objects.count() == 1


def test_modification_conflit_et_reprise(porteur, dossier):
    line = porteur.post(url(dossier), poste()).json()
    path = url(dossier, f"/postes/{line['id']}")
    body = {**poste(unit_price="16000"), "expected_version": 1}
    body.pop("request_id")
    first = porteur.put(path, body)
    replay = porteur.put(path, body)
    stale = porteur.put(path, {**body, "unit_price": "17000"})
    assert (first.status_code, replay.status_code, stale.status_code) == (200, 200, 409)
    assert replay.json()["changed"] is False
    assert BudgetLine.objects.get().unit_price == 16000


def test_retrait_exclut_le_poste_et_conserve_l_historique(porteur, dossier):
    line = porteur.post(url(dossier), poste()).json()
    path = url(dossier, f"/postes/{line['id']}/retirer")
    assert porteur.post(path, {"expected_version": 1}).status_code == 200
    assert porteur.post(path, {"expected_version": 1}).json()["changed"] is False  # reprise
    data = get_budget(porteur, dossier)
    assert data["lines"] == []
    assert data["totals"]["overall"]["status"] == "vide"
    history = porteur.get(url(dossier, "/historique")).json()
    assert [h["kind"] for h in history] == ["retrait", "ajout"]
    assert history[1]["snapshot"]["amount"] == 30000
    assert BudgetLine.objects.filter(removed_at__isnull=False).count() == 1


def test_poste_retire_non_modifiable(porteur, dossier):
    line = porteur.post(url(dossier), poste()).json()
    porteur.post(url(dossier, f"/postes/{line['id']}/retirer"), {"expected_version": 1})
    body = {**poste(), "expected_version": 2}
    body.pop("request_id")
    assert porteur.put(url(dossier, f"/postes/{line['id']}"), body).status_code == 409


def test_materiel_detenu_liste_mais_exclu(porteur, dossier):
    porteur.post(
        url(dossier),
        poste(
            label="Arrosoirs",
            already_owned=True,
            category="investissement",
            unit="unite",
            unit_price=None,
            price_status="manquant",
            source="",
        ),
    )
    data = get_budget(porteur, dossier)
    assert data["lines"][0]["state"] == "detenu"
    assert data["totals"]["overall"]["owned"] == 1
    assert data["totals"]["overall"]["status"] == "vide"


def test_somme_disponible_affichee_sans_conclusion(porteur, dossier):
    porteur.put(
        f"/api/dossiers/{dossier['id']}/informations/apport",
        {"status": "estime", "value": {"montant": "200 000"}, "source": "", "expected_version": 0},
    )
    data = get_budget(porteur, dossier)
    assert data["apport"] == {"status": "estime", "montant": 200000}
    assert not any(key in data for key in ("marge", "rentabilite", "solde"))


def test_version_du_budget_incrementee(porteur, dossier):
    porteur.post(url(dossier), poste())
    porteur.post(url(dossier), poste(label="Engrais"))
    assert get_budget(porteur, dossier)["budget_version"] == 2


def test_permissions_budget(porteur, autre, make_user, session, dossier):
    line = porteur.post(url(dossier), poste()).json()
    assert autre.get(url(dossier)).status_code == 404
    assert autre.post(url(dossier), poste()).status_code == 404
    assert autre.get(url(dossier, "/historique")).status_code == 404
    body = {**poste(), "expected_version": 1}
    body.pop("request_id")
    assert autre.put(url(dossier, f"/postes/{line['id']}"), body).status_code == 404

    user = make_user("conseil@example.sn", advisor=True)
    AdvisorAssignment.objects.create(campaign_id=dossier["id"], advisor=user)
    conseiller = session(user)
    assert conseiller.get(url(dossier)).status_code == 200
    assert conseiller.post(url(dossier), poste()).status_code == 403
    assert (
        conseiller.post(
            url(dossier, f"/postes/{line['id']}/retirer"), {"expected_version": 1}
        ).status_code
        == 403
    )
    assert BudgetLine.objects.count() == 1


# Lot 4 : premier budget guidé (postes à examiner).


def suggestion(sess, dossier, key, request_id=None):
    return sess.post(
        url(dossier, f"/a-examiner/{key}"), {"request_id": request_id or str(uuid.uuid4())}
    )


def test_postes_a_examiner_proposes_sans_prix_ni_quantite(porteur, dossier):
    data = get_budget(porteur, dossier)
    assert [s["key"] for s in data["suggestions"]] == [
        "acces_terrain", "eau", "semences", "materiel", "main_oeuvre", "transport",
    ]  # fmt: skip
    assert not any(s["added"] for s in data["suggestions"])
    assert data["lines"] == []  # rien n'est créé tant que le porteur n'ajoute pas

    response = suggestion(porteur, dossier, "semences")
    assert response.status_code == 201
    line = response.json()
    assert line["label"] == "Semences ou plants"
    assert (line["quantity"], line["unit_price"], line["amount"]) == (None, None, None)
    assert line["price_status"] == "manquant"
    assert line["state"] == "incomplet"
    data = get_budget(porteur, dossier)
    # Un poste inconnu ne compte jamais pour zéro : le budget est incomplet, pas « 0 FCFA ».
    assert data["totals"]["overall"]["status"] == "incomplet"
    assert data["totals"]["overall"]["incomplete"] == 1
    assert {s["key"]: s["added"] for s in data["suggestions"]}["semences"] is True


def test_poste_a_examiner_sans_doublon(porteur, dossier):
    first = suggestion(porteur, dossier, "eau").json()
    # Nouvelle visite, nouvel identifiant de requête : le poste existant est renvoyé.
    again = suggestion(porteur, dossier, "eau")
    assert again.status_code == 200
    assert again.json()["id"] == first["id"]
    # Reprise de la même requête : rien de plus.
    rid = str(uuid.uuid4())
    suggestion(porteur, dossier, "transport", rid)
    assert suggestion(porteur, dossier, "transport", rid).status_code == 200
    assert BudgetLine.objects.count() == 2
    assert BudgetEvent.objects.filter(kind="ajout").count() == 2


def test_poste_a_examiner_retire_puis_rajoute(porteur, dossier):
    line = suggestion(porteur, dossier, "materiel").json()
    porteur.post(url(dossier, f"/postes/{line['id']}/retirer"), {"expected_version": 1})
    assert {s["key"]: s["added"] for s in get_budget(porteur, dossier)["suggestions"]}[
        "materiel"
    ] is False
    again = suggestion(porteur, dossier, "materiel")
    assert again.status_code == 201
    assert again.json()["id"] != line["id"]


def test_poste_a_examiner_modifiable_comme_les_autres(porteur, dossier):
    line = suggestion(porteur, dossier, "main_oeuvre").json()
    body = {
        **poste(label="Main-d'œuvre (repiquage)", unit="jour", quantity="4", unit_price=None,
                price_status="manquant", source=""),
        "expected_version": 1,
    }  # fmt: skip
    body.pop("request_id")
    response = porteur.put(url(dossier, f"/postes/{line['id']}"), body)
    assert response.status_code == 200
    assert response.json()["quantity"] == "4"
    # L'élément reste marqué ajouté : il n'est plus proposé.
    assert {s["key"]: s["added"] for s in get_budget(porteur, dossier)["suggestions"]}[
        "main_oeuvre"
    ] is True


def test_poste_a_examiner_permissions_et_archive(porteur, autre, make_user, session, dossier):
    assert suggestion(porteur, dossier, "inconnu").status_code == 404
    assert suggestion(autre, dossier, "eau").status_code == 404
    user = make_user("conseil-budget@example.sn", advisor=True)
    AdvisorAssignment.objects.create(campaign_id=dossier["id"], advisor=user)
    assert suggestion(session(user), dossier, "eau").status_code == 403

    from dossiers.models import Campaign

    Campaign.objects.filter(pk=dossier["id"]).update(archived_at=timezone.now())
    assert suggestion(porteur, dossier, "eau").status_code == 403
    assert BudgetLine.objects.count() == 0
