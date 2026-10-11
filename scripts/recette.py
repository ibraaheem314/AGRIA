#!/usr/bin/env python
"""Recette en conditions réelles : redémarrage du serveur, sauvegarde et restauration.

    python scripts/recette.py

Utilise des bases dédiées (agria_recette, agria_recette_restauree), un vrai serveur Django
(port 8003) et de vraies requêtes HTTP avec session et jeton CSRF. La base de travail
n'est pas touchée. Les bases et la sauvegarde de recette sont supprimées à la fin.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import uuid
from http.cookiejar import CookieJar
from urllib.error import HTTPError, URLError
from urllib.request import HTTPCookieProcessor, Request, build_opener

from dev import BACKEND, BACKUPS, DB_HOST, DB_PORT, DB_USER, ROOT, run, tool, venv_python

DB = "agria_recette"
RESTORED = "agria_recette_restauree"
PORT = "8003"
BASE = f"http://127.0.0.1:{PORT}"
PASSWORD = "Recette-mot-de-passe-2026"  # noqa: S105 (compte jetable, base supprimée)
LOG = ROOT / ".devdb" / "recette-serveur.log"


class Client:
    """Navigateur minimal : cookies de session et jeton CSRF."""

    def __init__(self):
        self.jar = CookieJar()
        self.opener = build_opener(HTTPCookieProcessor(self.jar))

    def csrf(self) -> str:
        return next((c.value for c in self.jar if c.name == "csrftoken"), "")

    def call(self, method: str, path: str, data=None) -> tuple[int, object]:
        body = None if data is None else json.dumps(data).encode()
        request = Request(f"{BASE}/api{path}", data=body, method=method)  # noqa: S310 (local)
        request.add_header("Accept", "application/json")
        if body is not None:
            request.add_header("Content-Type", "application/json")
        if method != "GET":
            request.add_header("X-CSRFToken", self.csrf())
        try:
            with self.opener.open(request, timeout=30) as response:  # noqa: S310 (adresse locale fixe)
                raw = response.read()
                return response.status, json.loads(raw) if raw else None
        except HTTPError as exc:
            raw = exc.read()
            return exc.code, json.loads(raw) if raw else None

    def ok(self, method: str, path: str, data=None):
        status, payload = self.call(method, path, data)
        if status >= 400:
            raise AssertionError(f"{method} {path} → {status} {payload}")
        return payload


def db_env(name: str) -> dict:
    return {
        **os.environ,
        "DB_NAME": name,
        "AGRIA_ALLOW_SIGNUP": "true",
        "PYTHONIOENCODING": "utf-8",
    }


def recreate(name: str) -> None:
    base = ["-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER]
    run([tool("dropdb"), *base, "--if-exists", "--force", name], capture_output=True)
    if run([tool("createdb"), *base, name]).returncode:
        raise SystemExit(f"createdb {name} a échoué")


def drop(name: str) -> None:
    base = ["-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER]
    run([tool("dropdb"), *base, "--if-exists", "--force", name], capture_output=True)


def start_server(name: str) -> subprocess.Popen:
    log = open(LOG, "a", encoding="utf-8")  # noqa: SIM115 (fermé avec le processus)
    proc = subprocess.Popen(  # noqa: S603
        [venv_python(), "manage.py", "runserver", f"127.0.0.1:{PORT}", "--noreload"],
        cwd=BACKEND, env=db_env(name), stdin=subprocess.DEVNULL, stdout=log, stderr=log,
    )  # fmt: skip
    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            status, payload = Client().call("GET", "/health")
            if status == 200:
                return proc
        except URLError:
            pass
        time.sleep(0.5)
    proc.terminate()
    raise SystemExit(f"Le serveur ne démarre pas (voir {LOG})")


def stop_server(proc: subprocess.Popen) -> None:
    proc.terminate()
    proc.wait(timeout=20)
    try:
        Client().call("GET", "/health")
        raise AssertionError("Le serveur répond encore après l'arrêt")
    except URLError:
        pass  # attendu : plus personne n'écoute


def state(client: Client, dossier_id: int) -> dict:
    """Vue comparable du dossier : informations, plan et budget."""
    dossier = client.ok("GET", f"/dossiers/{dossier_id}")
    prep = client.ok("GET", f"/dossiers/{dossier_id}/preparation")
    budget = client.ok("GET", f"/dossiers/{dossier_id}/budget")
    return {
        "projet": dossier["project"]["name"],
        "informations": {
            f["key"]: [f["state"]["status"], f["state"]["value"], f["state"]["source"]]
            for f in dossier["facts"]
        },
        "demarches": sorted((a["title"], a["status"], a["result_text"]) for a in prep["actions"]),
        "budget": sorted(
            (line["label"], line["amount"], line["state"]) for line in budget["lines"]
        ),
        "budget_statut": budget["totals"]["overall"]["status"],
        "versions": [dossier["context_version"], budget["budget_version"], prep["plan_version"]],
    }


def login(email: str) -> Client:
    client = Client()
    client.ok("GET", "/auth/me")
    client.ok("POST", "/auth/login", {"email": email, "password": PASSWORD})
    return client


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    LOG.parent.mkdir(exist_ok=True)
    LOG.write_text("", encoding="utf-8")
    report: list[tuple[str, str]] = []
    dump = BACKUPS / f"recette-{uuid.uuid4().hex[:8]}.dump"
    proc = None
    try:
        print("1. Base de recette neuve, migrations, contenu")
        recreate(DB)
        for command in (["migrate", "--noinput"], ["load_content"]):
            result = subprocess.run(  # noqa: S603
                [venv_python(), "manage.py", *command], cwd=BACKEND, env=db_env(DB),
                capture_output=True, text=True, check=False,
            )  # fmt: skip
            if result.returncode:
                raise SystemExit(result.stderr)

        print("2. Saisie par HTTP : compte, projet, inconnue, démarche terminée, budget incomplet")
        proc = start_server(DB)
        email = f"recette-{uuid.uuid4().hex[:6]}@example.sn"
        client = Client()
        client.ok("GET", "/auth/me")
        client.ok(
            "POST",
            "/auth/register",
            {"email": email, "display_name": "Recette", "password": PASSWORD},
        )
        dossier = client.ok("POST", "/projects", {
            "name": "Projet de recette", "profile": "debutant", "campaign_label": "Campagne 2027",
            "request_id": str(uuid.uuid4()),
        })  # fmt: skip
        did = dossier["id"]
        client.ok("PUT", f"/dossiers/{did}/informations/eau", {
            "status": "inconnu", "value": None, "source": "Chef de village", "expected_version": 0,
        })  # fmt: skip
        action = client.ok("GET", f"/dossiers/{did}/preparation")["actions"][0]
        client.ok("PATCH", f"/dossiers/{did}/actions/{action['id']}", {
            "status": "terminee", "result_text": "Puits repéré",
            "result_date": time.strftime("%Y-%m-%d"), "expected_version": action["row_version"],
        })  # fmt: skip
        client.ok("POST", f"/dossiers/{did}/budget", {
            "category": "campagne", "label": "Semences", "quantity": "2,5", "unit": "kg",
            "unit_price": "15 000", "price_status": "connu", "source": "Devis",
            "price_date": time.strftime("%Y-%m-%d"), "request_id": str(uuid.uuid4()),
        })  # fmt: skip
        client.ok("POST", f"/dossiers/{did}/budget", {
            "category": "investissement", "label": "Motopompe", "quantity": "1", "unit": "unite",
            "price_status": "manquant", "request_id": str(uuid.uuid4()),
        })  # fmt: skip
        before = state(client, did)

        print("3. Arrêt complet du serveur puis redémarrage")
        stop_server(proc)
        proc = start_server(DB)
        after = state(login(email), did)
        assert after == before, f"Différence après redémarrage :\n{before}\n{after}"
        report.append(("Redémarrage du serveur", "données identiques après arrêt et relance"))

        print("4. Sauvegarde (pg_dump), puis modification postérieure")
        BACKUPS.mkdir(exist_ok=True)
        dumped = run([tool("pg_dump"), "-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER, "-d", DB,
                      "-Fc", "--no-owner", "-f", str(dump)])  # fmt: skip
        assert dumped.returncode == 0, "pg_dump a échoué"
        later = login(email)
        later.ok("POST", f"/dossiers/{did}/budget", {
            "category": "campagne", "label": "Ajout après la sauvegarde", "quantity": "1",
            "unit": "forfait", "price_status": "manquant", "request_id": str(uuid.uuid4()),
        })  # fmt: skip
        assert len(state(later, did)["budget"]) == 3

        print("5. Restauration dans une base neuve et démarrage du serveur dessus")
        stop_server(proc)
        proc = None
        recreate(RESTORED)
        restored = run([tool("pg_restore"), "-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER,
                        "-d", RESTORED, "--no-owner", "--exit-on-error", str(dump)])  # fmt: skip
        assert restored.returncode == 0, "pg_restore a échoué"
        proc = start_server(RESTORED)
        recovered = state(login(email), did)
        assert recovered == before, f"Restauration différente :\n{before}\n{recovered}"
        report.append(
            (
                "Restauration d'une sauvegarde",
                "état sauvegardé retrouvé, modification postérieure absente",
            )
        )
        report.append(
            ("Session et CSRF par HTTP réel", "connexion, écritures et lectures acceptées")
        )
    finally:
        if proc is not None:
            proc.terminate()
            proc.wait(timeout=20)
        drop(DB)
        drop(RESTORED)
        dump.unlink(missing_ok=True)

    print("\nRésultat de la recette")
    for name, result in report:
        print(f"  OK  {name} : {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
