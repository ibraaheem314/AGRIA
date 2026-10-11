"""Brique 2 : projet, campagne, informations, permissions et historique."""

import os
import subprocess
import sys
import uuid
from pathlib import Path

import pytest
from django.db import connection

from dossiers.models import AdvisorAssignment, Campaign, Fact, FactRevision, Project
from tests.conftest import new_project

pytestmark = pytest.mark.django_db


def info_url(dossier, key):
    return f"/api/dossiers/{dossier['id']}/informations/{key}"


def put_info(sess, dossier, key, status, value=None, source="", expected=0):
    return sess.put(
        info_url(dossier, key),
        {"status": status, "value": value, "source": source, "expected_version": expected},
    )


def state(sess, dossier, key):
    data = sess.get(f"/api/dossiers/{dossier['id']}").json()
    return next(f["state"] for f in data["facts"] if f["key"] == key)


# --- Création et reprise -------------------------------------------------------------------


def test_creation_projet_cree_la_campagne_sans_aucune_information_preremplie(porteur, dossier):
    assert dossier["label"] == "Campagne 2027"
    assert dossier["role"] == "porteur"
    assert dossier["project"]["is_demo"] is False
    assert {f["state"]["status"] for f in dossier["facts"]} == {"non_renseigne"}
    assert Fact.objects.count() == 0


def test_reprise_de_la_meme_creation_ne_cree_pas_de_doublon(porteur):
    payload = {
        "name": "Maraîchage",
        "profile": "producteur",
        "campaign_label": "Contre-saison",
        "request_id": str(uuid.uuid4()),
    }
    first = porteur.post("/api/projects", payload)
    second = porteur.post("/api/projects", payload)
    assert (first.status_code, second.status_code) == (201, 200)
    assert first.json()["id"] == second.json()["id"]
    assert Project.objects.count() == 1
    assert Campaign.objects.count() == 1


def test_meme_identifiant_de_requete_chez_deux_comptes_reste_independant(porteur, autre):
    request_id = str(uuid.uuid4())
    for sess in (porteur, autre):
        response = sess.post(
            "/api/projects",
            {
                "name": "Projet",
                "profile": "debutant",
                "campaign_label": "C1",
                "request_id": request_id,
            },
        )
        assert response.status_code == 201
    assert Project.objects.count() == 2


def test_nouvelle_campagne_pour_un_projet_existant(porteur, dossier):
    project_id = dossier["project"]["id"]
    payload = {"label": "Saison des pluies 2028", "request_id": str(uuid.uuid4())}
    first = porteur.post(f"/api/projects/{project_id}/campaigns", payload)
    again = porteur.post(f"/api/projects/{project_id}/campaigns", payload)
    assert (first.status_code, again.status_code) == (201, 200)
    assert Campaign.objects.filter(project_id=project_id).count() == 2


def test_profils_distincts_un_seul_type_de_dossier(porteur):
    debutant = new_project(porteur, profile="debutant")
    producteur = new_project(porteur, profile="producteur")
    keys_d = {f["key"] for f in debutant["facts"]}
    keys_p = {f["key"] for f in producteur["facts"]}
    assert keys_d < keys_p and keys_p - keys_d == {"changements"}
    label = {f["key"]: f["label"] for f in producteur["facts"]}["experience"]
    assert label == "Vos campagnes précédentes"


# --- Informations : états et validation ----------------------------------------------------


def test_je_ne_sais_pas_est_enregistre_sans_valeur(porteur, dossier):
    response = put_info(porteur, dossier, "eau", "inconnu")
    assert response.status_code == 200
    assert state(porteur, dossier, "eau")["status"] == "inconnu"
    assert Fact.objects.get(key="eau").value is None


def test_je_ne_sais_pas_avec_une_valeur_est_refuse(porteur, dossier):
    response = put_info(porteur, dossier, "eau", "inconnu", {"source": "puits"})
    assert response.status_code == 400


def test_valeur_obligatoire_sauf_je_ne_sais_pas(porteur, dossier):
    response = put_info(porteur, dossier, "eau", "declare", {})
    assert response.status_code == 400
    assert "source" in response.json()["error"]["fields"]["value"]


def test_verifie_exige_une_source(porteur, dossier):
    response = put_info(porteur, dossier, "eau", "verifie", {"source": "forage"})
    assert response.status_code == 400
    assert "source" in response.json()["error"]["fields"]
    ok = put_info(porteur, dossier, "eau", "verifie", {"source": "forage"}, "Visite du 3 mars")
    assert ok.status_code == 200


def test_choix_hors_liste_et_champ_inconnu_refuses(porteur, dossier):
    assert put_info(porteur, dossier, "eau", "declare", {"source": "oasis"}).status_code == 400
    response = put_info(porteur, dossier, "eau", "declare", {"source": "puits", "debit": 3})
    assert response.status_code == 400


def test_nombres_conserves_sans_flottant(porteur, dossier):
    value = {"situation": "accord", "surface": "0,75", "surface_unite": "ha"}
    assert put_info(porteur, dossier, "acces_terrain", "estime", value).status_code == 200
    assert Fact.objects.get(key="acces_terrain").value["surface"] == "0.75"


def test_surface_sans_unite_refusee(porteur, dossier):
    value = {"situation": "accord", "surface": "2"}
    assert put_info(porteur, dossier, "acces_terrain", "declare", value).status_code == 400


def test_periode_fin_avant_debut_refusee(porteur, dossier):
    value = {"debut": "2027-03", "fin": "2027-01"}
    response = put_info(porteur, dossier, "periode", "declare", value)
    assert response.status_code == 400
    assert "fin" in response.json()["error"]["fields"]["value"]


def test_information_reservee_au_producteur_refusee_pour_un_debutant(porteur, dossier):
    value = {"description": "Plus de goutte-à-goutte"}
    assert put_info(porteur, dossier, "changements", "declare", value).status_code == 409


def test_information_inconnue_du_registre(porteur, dossier):
    assert put_info(porteur, dossier, "rendement", "declare", {"x": 1}).status_code == 404


# --- Historique, version, concurrence et reprise -------------------------------------------


def test_modification_conserve_l_historique_et_incremente_la_version(porteur, dossier):
    put_info(porteur, dossier, "eau", "inconnu")
    second = put_info(porteur, dossier, "eau", "declare", {"source": "puits"}, expected=1)
    assert second.status_code == 200
    assert second.json()["context_version"] == 2
    history = porteur.get(info_url(dossier, "eau") + "/historique").json()
    assert [h["status"] for h in history] == ["declare", "inconnu"]
    assert FactRevision.objects.count() == 2


def test_modification_concurrente_produit_un_conflit_explicite(porteur, dossier):
    put_info(porteur, dossier, "eau", "declare", {"source": "puits"})  # version 1
    # Deux onglets ont lu la version 1 ; le premier enregistre, le second doit être refusé.
    a = put_info(porteur, dossier, "eau", "declare", {"source": "forage"}, expected=1)
    b = put_info(porteur, dossier, "eau", "declare", {"source": "reseau"}, expected=1)
    assert a.status_code == 200
    assert b.status_code == 409
    assert b.json()["error"]["code"] == "conflit"
    assert Fact.objects.get(key="eau").value == {"source": "forage"}


def test_reprise_d_un_envoi_deja_enregistre_ne_double_pas(porteur, dossier):
    first = put_info(porteur, dossier, "eau", "declare", {"source": "puits"}, expected=0)
    # La réponse s'est perdue : l'interface renvoie exactement la même requête.
    retry = put_info(porteur, dossier, "eau", "declare", {"source": "puits"}, expected=0)
    assert first.status_code == retry.status_code == 200
    assert retry.json()["changed"] is False
    assert FactRevision.objects.count() == 1


# --- Permissions ---------------------------------------------------------------------------


def test_un_autre_compte_ne_voit_ni_ne_modifie_le_dossier(porteur, autre, dossier):
    put_info(porteur, dossier, "eau", "declare", {"source": "puits"})
    base = f"/api/dossiers/{dossier['id']}"
    assert autre.get(base).status_code == 404
    assert autre.get(info_url(dossier, "eau") + "/historique").status_code == 404
    assert put_info(autre, dossier, "eau", "inconnu", expected=1).status_code == 404
    assert autre.get("/api/dossiers").json() == []
    assert autre.get("/api/projects").json() == []
    payload = {"label": "Intrusion", "request_id": str(uuid.uuid4())}
    response = autre.post(f"/api/projects/{dossier['project']['id']}/campaigns", payload)
    assert response.status_code == 404
    assert Fact.objects.get(key="eau").status == "declare"


def test_administrateur_technique_sans_attribution_n_a_pas_acces(make_user, session, dossier):
    staff = session(make_user("admin@example.sn", staff=True))
    assert staff.get(f"/api/dossiers/{dossier['id']}").status_code == 404


def test_conseiller_non_attribue_ne_voit_rien(make_user, session, dossier):
    conseiller = session(make_user("conseil@example.sn", advisor=True))
    assert conseiller.get(f"/api/dossiers/{dossier['id']}").status_code == 404
    assert conseiller.get("/api/dossiers").json() == []


def test_conseiller_attribue_lit_mais_ne_modifie_pas_les_informations(make_user, session, dossier):
    user = make_user("conseil@example.sn", advisor=True)
    AdvisorAssignment.objects.create(campaign_id=dossier["id"], advisor=user)
    conseiller = session(user)
    response = conseiller.get(f"/api/dossiers/{dossier['id']}")
    assert response.status_code == 200
    assert response.json()["role"] == "conseiller"
    assert put_info(conseiller, dossier, "eau", "inconnu").status_code == 403
    assert Fact.objects.count() == 0


def test_attribution_close_retire_l_acces(make_user, session, dossier):
    from django.utils import timezone

    user = make_user("conseil@example.sn", advisor=True)
    AdvisorAssignment.objects.create(
        campaign_id=dossier["id"], advisor=user, ended_at=timezone.now()
    )
    assert session(user).get(f"/api/dossiers/{dossier['id']}").status_code == 404


def test_dossier_archive_n_est_plus_modifiable(porteur, dossier):
    from django.utils import timezone

    Campaign.objects.filter(pk=dossier["id"]).update(archived_at=timezone.now())
    assert put_info(porteur, dossier, "eau", "inconnu").status_code == 403


# --- Persistance au-delà du processus ------------------------------------------------------


@pytest.mark.django_db(transaction=True)
def test_les_donnees_survivent_a_un_nouveau_processus_serveur(make_user, session):
    """Écriture par l'API, puis lecture par un autre processus Python (mémoire vierge)."""
    sess = session(make_user("awa@example.sn"))
    dossier = new_project(sess, name="Projet durable")
    put_info(sess, dossier, "eau", "declare", {"source": "puits"})
    code = (
        "import django, os, json; "
        "os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agria.settings'); django.setup(); "
        "from dossiers.models import Fact; "
        f"f = Fact.objects.get(campaign_id={dossier['id']}, key='eau'); "
        "print(json.dumps([f.campaign.project.name, f.status, f.value]))"
    )
    env = {**os.environ, "DB_NAME": connection.settings_dict["NAME"]}
    result = subprocess.run(  # noqa: S603
        [sys.executable, "-c", code],
        cwd=Path(__file__).resolve().parent.parent,
        env=env,
        capture_output=True,
        text=True,
        check=False,
        timeout=60,
    )
    assert result.returncode == 0, result.stderr
    assert (
        result.stdout.strip().splitlines()[-1]
        == '["Projet durable", "declare", {"source": "puits"}]'
    )


def test_nouvelle_campagne_reprend_le_lieu_a_reverifier_sans_resultats(porteur):
    dossier = new_project(porteur, profile="producteur", label="Contre-saison 2026")
    put_info(porteur, dossier, "eau", "verifie", {"source": "forage"}, "Gestionnaire du forage")
    put_info(porteur, dossier, "localisation", "declare", {"region": "Thiès"})
    put_info(porteur, dossier, "culture", "declare", {"nom": "Oignon"})
    response = porteur.post(
        f"/api/projects/{dossier['project']['id']}/campaigns",
        {
            "label": "Contre-saison 2027",
            "request_id": str(uuid.uuid4()),
            "copy_from": dossier["id"],
        },
    )
    assert response.status_code == 201
    facts = {f["key"]: f["state"] for f in response.json()["facts"]}
    assert facts["eau"]["status"] == "declare"  # « vérifié » redevient « déclaré »
    assert facts["eau"]["value"] == {"source": "forage"}
    assert "à revérifier" in facts["eau"]["source"]
    assert "Gestionnaire du forage" in facts["eau"]["source"]
    assert facts["localisation"]["status"] == "declare"
    assert facts["culture"]["status"] == "non_renseigne"  # hors du lieu : non repris


def test_copie_depuis_une_campagne_d_un_autre_projet_refusee(porteur):
    first = new_project(porteur, name="Premier")
    second = new_project(porteur, name="Second")
    response = porteur.post(
        f"/api/projects/{second['project']['id']}/campaigns",
        {"label": "Nouvelle", "request_id": str(uuid.uuid4()), "copy_from": first["id"]},
    )
    assert response.status_code == 400
