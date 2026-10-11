"""Brique 3 : contenu versionné, points à vérifier et plan d'action."""

import copy
import datetime as dt
import json
import uuid

import pytest
from django.core.management import call_command
from django.utils import timezone

from dossiers.models import AdvisorAssignment, Project
from preparation import content as content_store
from preparation.models import Action, ActionEvent, CampaignPlan, PreparationTemplate
from tests.conftest import new_project

pytestmark = pytest.mark.django_db

SOURCE = content_store.CONTENT_DIR / "preparation-generique.v1.json"


@pytest.fixture(autouse=True)
def contenu(db):
    content_store.load_all()


def put_info(sess, dossier, key, status, value=None, source="", expected=None):
    if expected is None:
        data = sess.get(f"/api/dossiers/{dossier['id']}").json()
        expected = next(f for f in data["facts"] if f["key"] == key)["state"]["row_version"]
    response = sess.put(
        f"/api/dossiers/{dossier['id']}/informations/{key}",
        {"status": status, "value": value, "source": source, "expected_version": expected},
    )
    assert response.status_code == 200, response.content
    return response


def prep(sess, dossier):
    response = sess.get(f"/api/dossiers/{dossier['id']}/preparation")
    assert response.status_code == 200, response.content
    return response.json()


def action(data, key):
    return next(a for a in data["actions"] if a["definition_key"] == key)


def patch(sess, dossier, act, **changes):
    return sess.patch(
        f"/api/dossiers/{dossier['id']}/actions/{act['id']}",
        {"expected_version": act["row_version"], **changes},
    )


# --- Contenu versionné ---------------------------------------------------------------------


def base_content():
    return json.loads(SOURCE.read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    "alteration, message",
    [
        (lambda c: c["actions"][0]["prerequisites"].append("inexistante"), "Prérequis inconnu"),
        (lambda c: c["checks"][0].update(fact="rendement"), "Information inconnue"),
        (lambda c: c["checks"][0]["rules"][0].update(action="preciser-lieu"), "sans démarche"),
        (lambda c: c["review"].update(status="relu"), "relecteur"),
        (lambda c: c["checks"][0].update(why=""), "justification"),
    ],
)
def test_contenu_incoherent_refuse(alteration, message):
    content = base_content()
    alteration(content)
    with pytest.raises(content_store.ContentError, match=message):
        content_store.validate(content)


def test_cycle_de_prerequis_refuse():
    content = base_content()
    by_key = {a["key"]: a for a in content["actions"]}
    by_key["choisir-culture"]["prerequisites"].append("fixer-periode")
    with pytest.raises(content_store.ContentError, match="Cycle"):
        content_store.validate(content)


def test_version_publiee_non_modifiable(tmp_path):
    content = base_content()
    content["actions"][0]["title"] = "Titre modifié sans changer de version"
    altered = tmp_path / "modifie.json"
    altered.write_text(json.dumps(content), encoding="utf-8")
    with pytest.raises(content_store.ContentError, match="nouvelle version"):
        content_store.load_file(altered)
    # Recharger le fichier publié tel quel est sans effet.
    _, created = content_store.load_file(SOURCE)
    assert created is False
    assert PreparationTemplate.objects.count() == 1


def test_commande_load_content_idempotente():
    call_command("load_content")
    assert PreparationTemplate.objects.count() == 1


# --- Points à vérifier ---------------------------------------------------------------------


def test_nouveau_dossier_lie_au_modele_et_sans_demarche(porteur, dossier):
    data = prep(porteur, dossier)
    assert data["template"]["code"] == "preparation-generique"
    assert data["template"]["review_status"] == "non_relu"
    assert data["template"]["review_label"] == "Non relu par un spécialiste"
    assert {c["level"] for c in data["checks"]} == {"a_completer"}
    assert len(data["checks"]) == 11  # débutant : pas de « changements envisagés »
    assert data["actions"] == []


def test_information_inconnue_produit_une_verification_expliquee_et_une_demarche(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    data = prep(porteur, dossier)
    check = next(c for c in data["checks"] if c["fact_key"] == "eau")
    assert check["level"] == "a_clarifier"
    assert check["blocking"] is True
    assert check["message"] == "Source d'eau inconnue"
    assert check["why"].startswith("La disponibilité de l'eau")
    act = action(data, "identifier-eau")
    assert check["action"]["id"] == act["id"]
    assert act["status"] == "a_faire"
    assert "Source d'eau inconnue" in act["origin"]
    assert act["linked_check"]["key"] == "eau"
    assert data["next_action_id"] == act["id"]


def test_valeur_problematique_produit_une_verification(porteur, dossier):
    put_info(porteur, dossier, "eau", "verifie", {"source": "aucune"}, "Visite du terrain")
    check = next(c for c in prep(porteur, dossier)["checks"] if c["fact_key"] == "eau")
    assert check["message"] == "Aucune source d'eau identifiée"


def test_information_verifiee_ne_produit_plus_de_verification(porteur, dossier):
    put_info(porteur, dossier, "eau", "verifie", {"source": "forage"}, "Gestionnaire du forage")
    assert all(c["fact_key"] != "eau" for c in prep(porteur, dossier)["checks"])


def test_producteur_a_le_point_changements(porteur):
    dossier = new_project(porteur, profile="producteur")
    assert any(c["fact_key"] == "changements" for c in prep(porteur, dossier)["checks"])


# --- Démarches : résultat, motif, prérequis ------------------------------------------------


def test_terminer_exige_un_resultat_et_une_date_passee(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    response = patch(porteur, dossier, act, status="terminee")
    assert response.status_code == 400
    assert {"result_text", "result_date"} <= set(response.json()["error"]["fields"])
    tomorrow = (timezone.localdate() + dt.timedelta(days=1)).isoformat()
    response = patch(
        porteur, dossier, act, status="terminee", result_text="ok", result_date=tomorrow
    )
    assert response.status_code == 400
    today = timezone.localdate().isoformat()
    response = patch(
        porteur,
        dossier,
        act,
        status="terminee",
        result_text="Puits repéré à 200 m",
        result_date=today,
    )
    assert response.status_code == 200
    saved = action(prep(porteur, dossier), "identifier-eau")
    assert saved["result_text"] == "Puits repéré à 200 m"
    assert saved["result_date"] == today


def test_bloquer_exige_un_motif(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    assert patch(porteur, dossier, act, status="bloquee").status_code == 400
    ok = patch(porteur, dossier, act, status="bloquee", blocked_reason="Gestionnaire absent")
    assert ok.status_code == 200
    assert (
        action(prep(porteur, dossier), "identifier-eau")["blocked_reason"] == "Gestionnaire absent"
    )


def test_prerequis_non_termine_empeche_de_terminer(porteur, dossier):
    put_info(porteur, dossier, "culture", "inconnu")
    put_info(porteur, dossier, "periode", "inconnu")
    data = prep(porteur, dossier)
    periode = action(data, "fixer-periode")
    assert periode["prerequisites"][0]["title"].startswith("Préparer le choix de la culture")
    assert periode["prerequisites_met"] is False
    today = timezone.localdate().isoformat()
    response = patch(
        porteur, dossier, periode, status="terminee", result_text="x", result_date=today
    )
    assert response.status_code == 409
    assert "Préparer le choix de la culture" in response.json()["error"]["message"]

    culture = action(data, "choisir-culture")
    assert (
        patch(
            porteur,
            dossier,
            culture,
            status="terminee",
            result_text="Oignon retenu",
            result_date=today,
        ).status_code
        == 200
    )
    response = patch(
        porteur, dossier, periode, status="terminee", result_text="Nov.–mars", result_date=today
    )
    assert response.status_code == 200


def test_prerequis_absent_du_plan_ne_s_applique_pas(porteur, dossier):
    put_info(porteur, dossier, "culture", "declare", {"nom": "Oignon"})
    put_info(porteur, dossier, "periode", "inconnu")
    periode = action(prep(porteur, dossier), "fixer-periode")
    assert periode["prerequisites"] == []
    assert periode["prerequisites_met"] is True


# --- Historique et changements de contexte --------------------------------------------------


def test_changement_de_contexte_ne_detruit_ni_ne_reecrit_les_demarches(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    today = timezone.localdate().isoformat()
    patch(porteur, dossier, act, status="terminee", result_text="Forage repéré", result_date=today)

    # Le contexte change deux fois ; la démarche terminée reste intacte.
    put_info(porteur, dossier, "eau", "declare", {"source": "forage"})
    put_info(porteur, dossier, "eau", "inconnu")
    data = prep(porteur, dossier)
    kept = action(data, "identifier-eau")
    assert kept["id"] == act["id"]
    assert kept["status"] == "terminee"
    assert kept["result_text"] == "Forage repéré"
    assert Action.objects.filter(definition_key="identifier-eau").count() == 1
    # Le point est de nouveau signalé, relié à la démarche terminée (et non à une copie).
    check = next(c for c in data["checks"] if c["fact_key"] == "eau")
    assert check["action"] == {"id": act["id"], "title": act["title"], "status": "terminee"}
    # « eau déclarée » a ajouté une démarche de confirmation, conservée elle aussi.
    assert action(data, "confirmer-eau")["linked_check"] is None


def test_rouvrir_une_demarche_conserve_le_resultat_dans_l_historique(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    today = timezone.localdate().isoformat()
    patch(porteur, dossier, act, status="terminee", result_text="Puits repéré", result_date=today)
    act = action(prep(porteur, dossier), "identifier-eau")
    assert patch(porteur, dossier, act, status="en_cours").status_code == 200
    reopened = action(prep(porteur, dossier), "identifier-eau")
    assert reopened["result_text"] == ""
    history = porteur.get(f"/api/dossiers/{dossier['id']}/actions/{act['id']}/historique").json()
    assert [h["to_status"] for h in history] == ["en_cours", "terminee", "a_faire"]
    assert history[1]["result_text"] == "Puits repéré"


def test_conflit_et_reprise_sur_une_demarche(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    first = patch(porteur, dossier, act, status="en_cours")
    replay = patch(porteur, dossier, act, status="en_cours")  # même requête renvoyée
    other = patch(porteur, dossier, act, status="bloquee", blocked_reason="x")  # version périmée
    assert (first.status_code, replay.status_code, other.status_code) == (200, 200, 409)
    assert replay.json()["changed"] is False
    assert ActionEvent.objects.filter(action_id=act["id"]).count() == 2  # création + en cours


def test_demarche_personnelle_sans_doublon(porteur, dossier):
    payload = {"title": "Demander un devis de clôture", "request_id": str(uuid.uuid4())}
    first = porteur.post(f"/api/dossiers/{dossier['id']}/actions", payload)
    again = porteur.post(f"/api/dossiers/{dossier['id']}/actions", payload)
    assert (first.status_code, again.status_code) == (201, 200)
    data = prep(porteur, dossier)
    assert [a["title"] for a in data["actions"] if a["custom"]] == ["Demander un devis de clôture"]


def test_modele_fige_pour_un_dossier_existant(porteur, dossier):
    prep(porteur, dossier)
    content = copy.deepcopy(base_content())
    content["version"] = 2
    PreparationTemplate.objects.create(
        code=content["code"], version=2, title=content["title"], review_status="non_relu",
        content=content, content_sha256=content_store.digest(content),
    )  # fmt: skip
    assert prep(porteur, dossier)["template"]["version"] == 1
    assert prep(porteur, new_project(porteur))["template"]["version"] == 2


# --- Permissions ---------------------------------------------------------------------------


def test_permissions_sur_le_plan(porteur, autre, make_user, session, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    base = f"/api/dossiers/{dossier['id']}"
    assert autre.get(f"{base}/preparation").status_code == 404
    assert patch(autre, dossier, act, status="en_cours").status_code == 404
    assert autre.get(f"{base}/actions/{act['id']}/historique").status_code == 404

    user = make_user("conseil@example.sn", advisor=True)
    AdvisorAssignment.objects.create(campaign_id=dossier["id"], advisor=user)
    conseiller = session(user)
    assert conseiller.get(f"{base}/preparation").status_code == 200
    assert patch(conseiller, dossier, act, status="en_cours").status_code == 403
    payload = {"title": "Intrusion", "request_id": str(uuid.uuid4())}
    assert conseiller.post(f"{base}/actions", payload).status_code == 403


def test_demarche_d_un_autre_dossier_introuvable(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    act = action(prep(porteur, dossier), "identifier-eau")
    second = new_project(porteur, name="Second projet")
    response = porteur.patch(
        f"/api/dossiers/{second['id']}/actions/{act['id']}",
        {"expected_version": act["row_version"], "status": "en_cours"},
    )
    assert response.status_code == 404


# --- Démonstration ------------------------------------------------------------------------


def test_demonstration_identifiee_et_separee(porteur, capsys):
    call_command("seed_demo")
    demo = Project.objects.get(is_demo=True)
    assert demo.owner.email.endswith(".invalid")
    assert CampaignPlan.objects.filter(campaign__project=demo).exists()
    assert porteur.get("/api/dossiers").json() == []  # invisible pour un compte réel
    call_command("seed_demo")  # idempotent
    assert Project.objects.filter(is_demo=True).count() == 1
