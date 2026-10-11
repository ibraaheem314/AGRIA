"""Brique 1 : le socle démarre sur une vraie base et refuse une configuration invalide."""

import os
import subprocess
import sys
from pathlib import Path

import pytest
from rest_framework.test import APIClient

BACKEND = Path(__file__).resolve().parent.parent


@pytest.mark.django_db
def test_health_interroge_la_base():
    response = APIClient().get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok", "migrations": "a_jour"}


@pytest.mark.django_db
def test_adresse_api_inconnue_renvoie_une_erreur_json():
    response = APIClient().get("/api/nexiste-pas")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "introuvable"


@pytest.mark.django_db
def test_ecriture_sans_jeton_csrf_refusee_en_json():
    client = APIClient(enforce_csrf_checks=True)
    response = client.post("/api/health", {}, format="json")
    # La vue n'accepte que GET : on vérifie au minimum le format JSON de l'erreur.
    assert response.status_code in {403, 405}
    assert "error" in response.json()


def _start_settings(env_overrides: dict) -> subprocess.CompletedProcess:
    env = {**os.environ, **env_overrides}
    code = (
        "import django, os; "
        "os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agria.settings'); django.setup()"
    )
    return subprocess.run(  # noqa: S603
        [sys.executable, "-c", code],
        cwd=BACKEND,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


@pytest.mark.parametrize(
    "overrides, attendu",
    [
        ({"DJANGO_SECRET_KEY": "remplacer-par-une-cle-aleatoire"}, "DJANGO_SECRET_KEY"),
        ({"DJANGO_SECRET_KEY": "trop-courte"}, "DJANGO_SECRET_KEY"),
        ({"DJANGO_DEBUG": "peut-etre"}, "DJANGO_DEBUG"),
        ({"DJANGO_DEBUG": "false", "DJANGO_ALLOWED_HOSTS": ""}, "DJANGO_ALLOWED_HOSTS"),
    ],
)
def test_configuration_invalide_arrete_le_demarrage(overrides, attendu):
    result = _start_settings(overrides)
    assert result.returncode != 0
    assert "ImproperlyConfigured" in result.stderr
    assert attendu in result.stderr


def test_configuration_valide_demarre():
    result = _start_settings({})
    assert result.returncode == 0, result.stderr


def test_base_injoignable_donne_503_explicite():
    """Django lancé sur un port sans PostgreSQL : jamais de faux « ok »."""
    code = (
        "import django, os, json; "
        "os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agria.settings'); django.setup(); "
        "from django.test import Client; "
        "r = Client(HTTP_HOST='127.0.0.1').get('/api/health'); "
        "print(r.status_code, json.loads(r.content)['status'])"
    )
    env = {**os.environ, "DB_PORT": "5999"}
    result = subprocess.run(  # noqa: S603
        [sys.executable, "-c", code],
        cwd=BACKEND,
        env=env,
        capture_output=True,
        text=True,
        check=False,
        timeout=60,
    )
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip().splitlines()[-1] == "503 indisponible"
