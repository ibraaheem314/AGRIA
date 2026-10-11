import uuid

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

PASSWORD = "Mot-de-passe-test-2026"


@pytest.fixture(autouse=True)
def _vider_cache():
    # Les limites de tentatives de connexion utilisent le cache : un test n'hérite pas du précédent.
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def make_user(db, django_user_model):
    def _make(email, *, advisor=False, staff=False, name=None):
        return django_user_model.objects.create_user(
            email=email,
            password=PASSWORD,
            display_name=name or email.split("@")[0],
            is_advisor=advisor,
            is_staff=staff,
        )

    return _make


class Session:
    """Client HTTP qui se comporte comme le navigateur : cookie de session + jeton CSRF."""

    def __init__(self, user=None):
        self.client = APIClient(enforce_csrf_checks=True)
        self.user = user
        self.client.get("/api/auth/me")
        if user is not None:
            response = self.post("/api/auth/login", {"email": user.email, "password": PASSWORD})
            assert response.status_code == 200, response.content

    def _csrf(self):
        token = self.client.cookies.get("csrftoken")
        return {"HTTP_X_CSRFTOKEN": token.value} if token else {}

    def get(self, path):
        return self.client.get(path)

    def post(self, path, data=None):
        return self.client.post(path, data or {}, format="json", **self._csrf())

    def put(self, path, data):
        return self.client.put(path, data, format="json", **self._csrf())

    def patch(self, path, data):
        return self.client.patch(path, data, format="json", **self._csrf())

    def delete(self, path):
        return self.client.delete(path, **self._csrf())


@pytest.fixture
def session():
    return Session


def new_project(sess, *, name="Projet test", profile="debutant", label="Campagne 2027"):
    response = sess.post(
        "/api/projects",
        {
            "name": name,
            "profile": profile,
            "campaign_label": label,
            "request_id": str(uuid.uuid4()),
        },
    )
    assert response.status_code == 201, response.content
    return response.json()


@pytest.fixture
def porteur(make_user, session):
    user = make_user("awa@example.sn", name="Awa")
    return session(user)


@pytest.fixture
def autre(make_user, session):
    user = make_user("moussa@example.sn", name="Moussa")
    return session(user)


@pytest.fixture
def dossier(porteur):
    return new_project(porteur)
