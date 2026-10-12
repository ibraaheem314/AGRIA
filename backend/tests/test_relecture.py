"""Brique 5 : conseiller, relecture, échanges, décisions et synthèse."""

import json
import uuid

import pytest
from django.utils import timezone

from dossiers.models import AdvisorAssignment
from preparation import content as content_store
from reviews.models import Comment, Review
from tests.conftest import new_project

pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def contenu(db):
    content_store.load_all()


@pytest.fixture
def conseiller_user(make_user):
    return make_user("conseil@example.sn", advisor=True, name="Mme Conseil")


@pytest.fixture
def conseiller(conseiller_user, session, dossier):
    AdvisorAssignment.objects.create(campaign_id=dossier["id"], advisor=conseiller_user)
    return session(conseiller_user)


def base(dossier):
    return f"/api/dossiers/{dossier['id']}"


def put_info(sess, dossier, key, status, value=None, source=""):
    data = sess.get(base(dossier)).json()
    expected = next(f for f in data["facts"] if f["key"] == key)["state"]["row_version"]
    response = sess.put(
        f"{base(dossier)}/informations/{key}",
        {"status": status, "value": value, "source": source, "expected_version": expected},
    )
    assert response.status_code == 200, response.content
    return response


def relecture(sess, dossier):
    response = sess.get(f"{base(dossier)}/relecture")
    assert response.status_code == 200, response.content
    return response.json()


def give_review(sess, dossier, *, scope=("contexte",), verdict="avec_reserves", seen=None,
                reservations="Accès à l'eau à confirmer par écrit."):  # fmt: skip
    seen = seen if seen is not None else relecture(sess, dossier)["versions"]
    return sess.post(
        f"{base(dossier)}/avis",
        {
            "scope": list(scope),
            "verdict": verdict,
            "opinion": "Le projet est cohérent sur le périmètre relu.",
            "reservations": reservations,
            "seen_versions": seen,
            "request_id": str(uuid.uuid4()),
        },
    )


# --- Absence de conseiller -----------------------------------------------------------------


def test_sans_conseiller_l_absence_est_explicite(porteur, dossier):
    data = relecture(porteur, dossier)
    assert data["advisors"] == []
    assert data["reviews"] == []
    assert data["status"]["code"] == "brouillon"
    synth = porteur.get(f"{base(dossier)}/synthese").json()
    assert synth["advisors"] == [] and synth["reviews"] == []


def test_demande_sans_conseiller_ne_passe_pas_en_revue(porteur, dossier):
    porteur.post(f"{base(dossier)}/demandes-relecture", {"request_id": str(uuid.uuid4())})
    assert relecture(porteur, dossier)["status"]["code"] != "en_revue"


# --- Accès du conseiller -------------------------------------------------------------------


def test_conseiller_voit_uniquement_ses_dossiers(porteur, autre, conseiller, dossier):
    autre_dossier = new_project(autre, name="Dossier d'un autre")
    ids = [d["id"] for d in conseiller.get("/api/dossiers").json()]
    assert ids == [dossier["id"]]
    assert conseiller.get(f"{base(autre_dossier)}/relecture").status_code == 404
    assert conseiller.get(f"{base(autre_dossier)}/synthese").status_code == 404
    assert give_review(conseiller, autre_dossier, seen={}).status_code == 404


def test_un_porteur_ne_peut_pas_donner_d_avis(porteur, dossier):
    assert give_review(porteur, dossier).status_code == 403


def test_conseiller_non_attribue_ne_peut_pas_donner_d_avis(make_user, session, dossier):
    other = session(make_user("autre-conseil@example.sn", advisor=True))
    assert give_review(other, dossier, seen={}).status_code == 404


def test_attribution_close_ne_permet_plus_d_avis(conseiller_user, conseiller, dossier):
    AdvisorAssignment.objects.filter(advisor=conseiller_user).update(ended_at=timezone.now())
    assert give_review(conseiller, dossier, seen={}).status_code == 404


# --- Avis traçables ------------------------------------------------------------------------


def test_avis_trace_auteur_date_perimetre_version_et_reserves(porteur, conseiller, dossier):
    put_info(porteur, dossier, "eau", "declare", {"source": "puits"})
    response = give_review(conseiller, dossier, scope=("contexte", "budget"))
    assert response.status_code == 201
    review = relecture(porteur, dossier)["reviews"][0]
    assert review["advisor"]["display_name"] == "Mme Conseil"
    assert review["scope"] == ["contexte", "budget"]
    assert review["versions"]["contexte"] == 1
    assert review["reservations"] == "Accès à l'eau à confirmer par écrit."
    assert review["current"] is True
    assert relecture(porteur, dossier)["status"]["code"] == "revu_avec_reserves"
    detail = porteur.get(f"{base(dossier)}/avis/{review['id']}").json()
    eau = next(f for f in detail["snapshot"]["contexte"]["facts"] if f["key"] == "eau")
    assert eau["value"] == {"source": "puits"}


def test_avec_reserves_exige_des_reserves(conseiller, dossier):
    response = give_review(conseiller, dossier, reservations="")
    assert response.status_code == 400
    assert "reservations" in response.json()["error"]["fields"]


def test_perimetre_vide_refuse(conseiller, dossier):
    assert give_review(conseiller, dossier, scope=()).status_code == 400


def test_avis_refuse_si_le_dossier_a_change_depuis_la_lecture(porteur, conseiller, dossier):
    seen = relecture(conseiller, dossier)["versions"]
    put_info(porteur, dossier, "eau", "inconnu")  # modification pendant la lecture
    response = give_review(conseiller, dossier, seen=seen)
    assert response.status_code == 409
    assert Review.objects.count() == 0


def test_modification_apres_avis_le_rend_a_reexaminer_sans_l_effacer(porteur, conseiller, dossier):
    give_review(conseiller, dossier, scope=("contexte",), verdict="sans_reserve", reservations="")
    assert relecture(porteur, dossier)["status"]["code"] == "revu_sans_reserve"

    put_info(porteur, dossier, "eau", "declare", {"source": "forage"})
    data = relecture(porteur, dossier)
    review = data["reviews"][0]
    assert review["current"] is False
    assert review["stale_sections"] == ["Contexte du projet"]
    assert data["status"]["code"] != "revu_sans_reserve"
    # L'avis et son instantané restent consultables tels quels.
    detail = porteur.get(f"{base(dossier)}/avis/{review['id']}").json()
    eau = next(f for f in detail["snapshot"]["contexte"]["facts"] if f["key"] == "eau")
    assert eau["status"] == "non_renseigne"


def test_modification_hors_perimetre_ne_perime_pas_l_avis(porteur, conseiller, dossier):
    give_review(conseiller, dossier, scope=("budget",), verdict="sans_reserve", reservations="")
    put_info(porteur, dossier, "experience", "declare", {"description": "Jardin familial"})
    # Le contexte a changé ; le plan aussi a pu changer, mais pas le budget relu.
    assert relecture(porteur, dossier)["reviews"][0]["current"] is True


def test_avis_rejoue_sans_doublon(conseiller, dossier):
    seen = relecture(conseiller, dossier)["versions"]
    payload = {
        "scope": ["contexte"],
        "verdict": "sans_reserve",
        "opinion": "Cohérent.",
        "seen_versions": seen,
        "request_id": str(uuid.uuid4()),
    }
    first = conseiller.post(f"{base(dossier)}/avis", payload)
    again = conseiller.post(f"{base(dossier)}/avis", payload)
    assert (first.status_code, again.status_code) == (201, 200)
    assert Review.objects.count() == 1


def test_demande_puis_avis_statuts_successifs(porteur, conseiller, dossier):
    porteur.post(
        f"{base(dossier)}/demandes-relecture", {"note": "Merci", "request_id": str(uuid.uuid4())}
    )
    data = relecture(porteur, dossier)
    assert data["status"]["code"] == "en_revue"
    assert conseiller.get("/api/dossiers").json()[0]["pending"]["review_requested"] is True
    give_review(conseiller, dossier)
    assert relecture(porteur, dossier)["requests"][0]["answered"] is True
    assert conseiller.get("/api/dossiers").json()[0]["pending"]["review_requested"] is False


# --- Messages -------------------------------------------------------------------------------


def test_question_liee_a_une_demarche_reponse_et_resolution(porteur, conseiller, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    action = porteur.get(f"{base(dossier)}/preparation").json()["actions"][0]
    q = porteur.post(
        f"{base(dossier)}/messages",
        {
            "kind": "question",
            "body": "Qui contacter pour le forage ?",
            "target_type": "demarche",
            "target_ref": str(action["id"]),
            "request_id": str(uuid.uuid4()),
        },
    )
    assert q.status_code == 201
    r = conseiller.post(
        f"{base(dossier)}/messages",
        {
            "parent_id": q.json()["id"],
            "body": "Le comité de gestion du forage.",
            "request_id": str(uuid.uuid4()),
        },
    )
    assert r.status_code == 201
    assert conseiller.get("/api/dossiers").json()[0]["pending"]["open_questions"] == 1
    assert conseiller.post(f"{base(dossier)}/messages/{q.json()['id']}/resoudre").status_code == 200
    thread = relecture(porteur, dossier)["threads"][0]
    assert thread["target_label"] == action["title"]
    assert thread["replies"][0]["author_role"] == "conseiller"
    assert thread["resolved_by"]["display_name"] == "Mme Conseil"


def test_message_vers_un_element_d_un_autre_dossier_refuse(porteur, dossier):
    other = new_project(porteur, name="Autre projet")
    porteur.post(f"{base(other)}/budget", {
        "category": "campagne", "label": "Semences", "quantity": "1", "unit": "kg",
        "price_status": "manquant", "request_id": str(uuid.uuid4()),
    })  # fmt: skip
    line_id = porteur.get(f"{base(other)}/budget").json()["lines"][0]["id"]
    response = porteur.post(
        f"{base(dossier)}/messages",
        {"kind": "question", "body": "?", "target_type": "poste", "target_ref": str(line_id),
         "request_id": str(uuid.uuid4())},
    )  # fmt: skip
    assert response.status_code == 400
    assert Comment.objects.count() == 0


def test_autre_compte_ne_peut_ni_lire_ni_ecrire_de_message(porteur, autre, dossier):
    payload = {"kind": "commentaire", "body": "Intrusion", "request_id": str(uuid.uuid4())}
    assert autre.post(f"{base(dossier)}/messages", payload).status_code == 404
    assert autre.get(f"{base(dossier)}/relecture").status_code == 404


# --- Décisions, archivage, synthèse --------------------------------------------------------


def test_decision_differer_et_archivage(porteur, conseiller, dossier):
    response = porteur.post(
        f"{base(dossier)}/decisions",
        {
            "choice": "differer",
            "reason": "Eau non garantie en saison sèche",
            "request_id": str(uuid.uuid4()),
        },
    )
    assert response.status_code == 201
    assert relecture(porteur, dossier)["status"]["code"] == "differe"
    assert conseiller.post(f"{base(dossier)}/decisions", {
        "choice": "poursuivre", "reason": "x", "request_id": str(uuid.uuid4()),
    }).status_code == 403  # fmt: skip
    assert conseiller.post(f"{base(dossier)}/archiver").status_code == 403
    assert porteur.post(f"{base(dossier)}/archiver").json()["changed"] is True
    assert porteur.post(f"{base(dossier)}/archiver").json()["changed"] is False
    assert relecture(porteur, dossier)["status"]["code"] == "archive"
    put = porteur.put(f"{base(dossier)}/informations/eau",
                      {"status": "inconnu", "value": None, "expected_version": 0})  # fmt: skip
    assert put.status_code == 403
    assert give_review(conseiller, dossier).status_code == 403


def test_decision_sans_motif_refusee(porteur, dossier):
    response = porteur.post(
        f"{base(dossier)}/decisions",
        {"choice": "poursuivre", "reason": " ", "request_id": str(uuid.uuid4())},
    )
    assert response.status_code == 400


def test_synthese_fidele_inconnues_budget_incomplet_et_reserves(porteur, conseiller, dossier):
    put_info(porteur, dossier, "eau", "inconnu", source="Demander au chef de village")
    porteur.post(f"{base(dossier)}/budget", {
        "category": "campagne", "label": "Main-d'œuvre", "quantity": "10", "unit": "jour",
        "price_status": "manquant", "request_id": str(uuid.uuid4()),
    })  # fmt: skip
    give_review(conseiller, dossier, scope=("contexte", "plan", "budget"))
    synth = porteur.get(f"{base(dossier)}/synthese").json()
    eau = next(f for f in synth["contexte"]["facts"] if f["key"] == "eau")
    assert (eau["status"], eau["value"], eau["source"]) == (
        "inconnu",
        None,
        "Demander au chef de village",
    )
    assert any(f["status"] == "non_renseigne" for f in synth["contexte"]["facts"])
    assert synth["budget"]["totals"]["overall"]["status"] == "incomplet"
    assert synth["reviews"][0]["reservations"] == "Accès à l'eau à confirmer par écrit."
    assert synth["plan"]["template"]["review_status"] == "non_relu"
    assert "ne garantit ni la faisabilité ni la rentabilité" in synth["notice"]


def test_export_telechargeable_a_acces_controle(porteur, autre, conseiller, dossier):
    response = porteur.get(f"{base(dossier)}/synthese?telecharger=1")
    assert response.status_code == 200
    assert response["Content-Disposition"].startswith("attachment;")
    assert response["Cache-Control"] == "no-store"
    assert json.loads(response.content)["dossier"]["id"] == dossier["id"]
    assert conseiller.get(f"{base(dossier)}/synthese?telecharger=1").status_code == 200
    assert autre.get(f"{base(dossier)}/synthese?telecharger=1").status_code == 404


def test_commande_assign_advisor(porteur, conseiller_user, dossier, session):
    from django.core.management import CommandError, call_command

    call_command("assign_advisor", dossier=dossier["id"], email="conseil@example.sn")
    call_command("assign_advisor", dossier=dossier["id"], email="conseil@example.sn")  # idempotent
    assert AdvisorAssignment.objects.filter(ended_at__isnull=True).count() == 1
    assert session(conseiller_user).get(f"{base(dossier)}/relecture").status_code == 200
    call_command("assign_advisor", dossier=dossier["id"], email="conseil@example.sn", end=True)
    assert session(conseiller_user).get(f"{base(dossier)}/relecture").status_code == 404
    with pytest.raises(CommandError):
        call_command(
            "assign_advisor", dossier=dossier["id"], email="awa@example.sn"
        )  # pas conseiller


def test_dossier_archive_expose_sa_date_et_reste_consultable(porteur, dossier):
    assert porteur.get(base(dossier)).json()["archived_at"] is None
    porteur.post(f"{base(dossier)}/archiver")
    data = porteur.get(base(dossier)).json()
    assert data["archived"] is True and data["archived_at"] is not None
    assert porteur.get(f"{base(dossier)}/preparation").status_code == 200
    assert porteur.get(f"{base(dossier)}/synthese").status_code == 200
    # Une nouvelle campagne du même projet reste possible (saison suivante).
    response = porteur.post(
        f"/api/projects/{dossier['project']['id']}/campaigns",
        {"label": "Saison suivante", "request_id": str(uuid.uuid4()), "copy_from": dossier["id"]},
    )
    assert response.status_code == 201


# --- Qui doit agir dans un échange --------------------------------------------------------------


def post(sess, dossier, body, parent=None):
    data = {"body": body, "request_id": str(uuid.uuid4())}
    data.update({"parent_id": parent} if parent else {"kind": "question"})
    response = sess.post(f"{base(dossier)}/messages", data)
    assert response.status_code == 201
    return response.json()["id"]


def pending(sess):
    return sess.get("/api/dossiers").json()[0]["pending"]


def state(sess, dossier):
    return relecture(sess, dossier)["threads"][0]["state"]


def test_question_du_conseiller_relances_et_reponse_qui_ne_clot_pas(porteur, conseiller, dossier):
    q = post(conseiller, dossier, "Le terrain est-il loué ?")
    assert (state(porteur, dossier), state(conseiller, dossier)) == (
        "a_repondre", "en_attente_reponse",
    )  # fmt: skip
    assert pending(porteur)["to_answer"] == 1
    assert (pending(conseiller)["to_answer"], pending(conseiller)["awaiting_reply"]) == (0, 1)

    post(porteur, dossier, "Prêté, sans écrit.", parent=q)
    # Une réponse ne clôt pas la question : elle reste ouverte, sans tâche pour le porteur.
    assert (state(porteur, dossier), state(conseiller, dossier)) == ("repondu", "reponse_recue")
    assert pending(porteur)["to_answer"] == 0
    assert pending(conseiller)["replies_received"] == 1
    assert pending(conseiller)["open_questions"] == 1

    # Relance du conseiller : la réponse est de nouveau attendue du porteur.
    post(conseiller, dossier, "Pour combien de temps ?", parent=q)
    assert state(porteur, dossier) == "a_repondre"
    assert pending(porteur)["to_answer"] == 1

    conseiller.post(f"{base(dossier)}/messages/{q}/resoudre")
    assert (state(porteur, dossier), state(conseiller, dossier)) == ("close", "close")
    assert pending(porteur)["to_answer"] == pending(conseiller)["open_questions"] == 0


def test_question_du_porteur_attend_le_conseiller(porteur, conseiller, dossier):
    q = post(porteur, dossier, "Qui contacter pour l'eau ?")
    assert pending(conseiller)["to_answer"] == 1
    assert pending(porteur)["awaiting_reply"] == 1
    post(conseiller, dossier, "Le comité du forage.", parent=q)
    assert pending(conseiller)["to_answer"] == 0
    assert state(porteur, dossier) == "reponse_recue"
    # Un commentaire n'est jamais une tâche.
    porteur.post(
        f"{base(dossier)}/messages",
        {"kind": "commentaire", "body": "Merci.", "request_id": str(uuid.uuid4())},
    )
    assert pending(conseiller)["to_answer"] == 0


def test_avis_a_reexaminer_signale(porteur, conseiller, dossier):
    assert pending(conseiller)["review_stale"] is False
    give_review(conseiller, dossier)
    assert pending(conseiller)["review_stale"] is False
    put_info(porteur, dossier, "eau", "inconnu")
    assert pending(conseiller)["review_stale"] is True
    assert pending(porteur)["review_stale"] is True
