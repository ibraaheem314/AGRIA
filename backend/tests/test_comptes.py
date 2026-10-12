"""Brique 2 : authentification par session Django."""

import pytest
from django.test import override_settings
from rest_framework.test import APIClient

from tests.conftest import PASSWORD

pytestmark = pytest.mark.django_db


def test_inscription_connecte_et_hache_le_mot_de_passe(session, django_user_model):
    s = session()
    response = s.post(
        "/api/auth/register",
        {"email": "Fatou@Example.SN", "display_name": "Fatou", "password": PASSWORD},
    )
    assert response.status_code == 201
    user = django_user_model.objects.get()
    assert user.email == "fatou@example.sn"
    assert user.password.startswith("argon2$")
    assert s.get("/api/auth/me").json()["user"]["display_name"] == "Fatou"


def test_inscription_refuse_un_mot_de_passe_faible(session):
    response = session().post(
        "/api/auth/register",
        {"email": "a@example.sn", "display_name": "Aminata", "password": "12345678"},
    )
    assert response.status_code == 400
    assert response.json()["error"]["fields"]["password"]


def test_inscription_refuse_un_email_deja_utilise_quelle_que_soit_la_casse(make_user, session):
    make_user("awa@example.sn")
    response = session().post(
        "/api/auth/register",
        {"email": "AWA@example.sn", "display_name": "Awa", "password": PASSWORD},
    )
    assert response.status_code == 400
    assert "email" in response.json()["error"]["fields"]


@override_settings(AGRIA_ALLOW_SIGNUP=False)
def test_inscription_fermee(session):
    response = session().post(
        "/api/auth/register",
        {"email": "a@example.sn", "display_name": "Aminata", "password": PASSWORD},
    )
    assert response.status_code == 403
    assert session().get("/api/auth/me").json()["signup"] is False


def test_connexion_message_identique_compte_existant_ou_non(make_user, session):
    make_user("awa@example.sn")
    wrong = session().post("/api/auth/login", {"email": "awa@example.sn", "password": "faux-mot"})
    missing = session().post("/api/auth/login", {"email": "x@example.sn", "password": "faux-mot"})
    assert wrong.status_code == missing.status_code == 401
    assert wrong.json()["error"] == missing.json()["error"]
    assert wrong.json()["error"] == {
        "code": "identifiants_invalides",
        "message": "Email ou mot de passe incorrect.",
    }


def test_connexion_sans_jeton_csrf_refusee(make_user):
    make_user("awa@example.sn")
    client = APIClient(enforce_csrf_checks=True)
    response = client.post(
        "/api/auth/login", {"email": "awa@example.sn", "password": PASSWORD}, format="json"
    )
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "csrf"


def test_ecriture_connectee_sans_jeton_csrf_refusee(porteur):
    response = porteur.client.post("/api/projects", {}, format="json")  # sans en-tête CSRF
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "csrf"


def test_trop_de_tentatives_de_connexion_bloquees(make_user, session):
    make_user("awa@example.sn")
    s = session()
    codes = [
        s.post("/api/auth/login", {"email": "awa@example.sn", "password": "mauvais"}).status_code
        for _ in range(11)
    ]
    assert codes[:10] == [401] * 10
    assert codes[10] == 429


def test_deconnexion_ferme_la_session(porteur):
    assert porteur.post("/api/auth/logout").status_code == 204
    assert porteur.get("/api/auth/me").json()["user"] is None
    assert porteur.get("/api/dossiers").status_code == 401


def test_api_metier_exige_une_connexion():
    response = APIClient().get("/api/dossiers")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "non_connecte"


def test_compte_desactive_ne_peut_plus_lire(make_user, session):
    user = make_user("awa@example.sn")
    s = session(user)
    user.is_active = False
    user.save()
    assert s.get("/api/dossiers").status_code == 401


def test_assistance_reinitialisation_et_reactivation(make_user, session, capsys):
    from django.core.management import CommandError, call_command

    user = make_user("bloque@example.sn")
    ancienne = session(user)
    call_command("assist_account", email="BLOQUE@example.sn", reset_password=True)
    nouveau = capsys.readouterr().out.strip().splitlines()[-1].split()[-1]
    # L'ancien mot de passe ne marche plus, l'ancienne session est fermée, le nouveau marche.
    assert ancienne.get("/api/dossiers").status_code == 401
    refus = session().post("/api/auth/login", {"email": user.email, "password": PASSWORD})
    assert refus.status_code == 401
    ok = session().post("/api/auth/login", {"email": user.email, "password": nouveau})
    assert ok.status_code == 200

    user.refresh_from_db()  # sans cela, l'ancien mot de passe en mémoire serait réécrit
    user.is_active = False
    user.save(update_fields=["is_active"])
    assert (
        session().post("/api/auth/login", {"email": user.email, "password": nouveau}).status_code
        == 401
    )
    call_command("assist_account", email=user.email, reactivate=True, status=True)
    assert "actif" in capsys.readouterr().out
    assert (
        session().post("/api/auth/login", {"email": user.email, "password": nouveau}).status_code
        == 200
    )
    with pytest.raises(CommandError):
        call_command("assist_account", email="inconnu@example.sn", status=True)
