#!/usr/bin/env python
"""Outils de développement AGRIA (Windows, Linux, macOS).

    python scripts/dev.py env            crée backend/.env avec une clé secrète aléatoire
    python scripts/dev.py db-init        crée une instance PostgreSQL propre au projet (.devdb/)
    python scripts/dev.py db-start       démarre cette instance (127.0.0.1:5444)
    python scripts/dev.py db-stop        l'arrête
    python scripts/dev.py db-status      indique si elle tourne
    python scripts/dev.py db-backup      sauvegarde la base dans backups/
    python scripts/dev.py db-restore F   restaure la sauvegarde F dans une base séparée (--into NOM)
    python scripts/dev.py e2e-server     recrée la base agria_e2e et lance Django (Playwright)
    python scripts/dev.py check          lance tous les contrôles (ruff, pytest, eslint, tsc, build)

L'instance de développement n'écoute que sur 127.0.0.1 avec authentification « trust » :
elle n'est pas destinée à contenir des données réelles. Les binaires PostgreSQL sont
cherchés dans PG_BIN, puis dans le PATH, puis dans « C:/Program Files/PostgreSQL/<n>/bin ».
"""

from __future__ import annotations

import argparse
import datetime as dt
import glob
import os
import re
import secrets
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
DEVDB = ROOT / ".devdb"
PGDATA = DEVDB / "data"
PGLOG = DEVDB / "postgres.log"
BACKUPS = ROOT / "backups"
DB_PORT = "5444"
DB_HOST = "127.0.0.1"
DB_USER = "agria"
DB_NAME = "agria"
EXE = ".exe" if os.name == "nt" else ""


def fail(message: str) -> None:
    print(f"ERREUR : {message}", file=sys.stderr)
    sys.exit(1)


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    print("$ " + " ".join(str(c) for c in cmd))
    return subprocess.run(cmd, check=False, **kwargs)  # noqa: S603 (commandes fixes du projet)


def pg_bin() -> Path:
    env = os.environ.get("PG_BIN")
    if env:
        path = Path(env)
        if not (path / f"pg_ctl{EXE}").exists():
            fail(f"PG_BIN={env} ne contient pas pg_ctl.")
        return path
    found = shutil.which("pg_ctl")
    if found:
        return Path(found).parent
    candidates = glob.glob("C:/Program Files/PostgreSQL/*/bin/pg_ctl.exe")

    def major(p: str) -> int:
        match = re.search(r"PostgreSQL[/\\](\d+)", p)
        return int(match.group(1)) if match else 0

    if candidates:
        return Path(max(candidates, key=major)).parent
    fail("Binaires PostgreSQL introuvables. Installez PostgreSQL 16+ ou définissez PG_BIN.")
    raise AssertionError  # pour l'analyse statique


def tool(name: str) -> str:
    if not os.environ.get("PG_BIN"):
        found = shutil.which(name)  # ex. paquet postgresql-client en CI (sans pg_ctl)
        if found:
            return found
    return str(pg_bin() / f"{name}{EXE}")


def conn_args(dbname: str = DB_NAME) -> list[str]:
    return ["-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER, "-d", dbname]


def is_running() -> bool:
    if not PGDATA.exists():
        return False
    result = subprocess.run(  # noqa: S603
        [tool("pg_ctl"), "status", "-D", str(PGDATA)],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.returncode == 0


def cmd_env(_args) -> None:
    target = BACKEND / ".env"
    if target.exists():
        print(f"{target} existe déjà : rien à faire.")
        return
    content = (BACKEND / ".env.example").read_text(encoding="utf-8")
    content = content.replace(
        "DJANGO_SECRET_KEY=remplacer-par-une-cle-aleatoire",
        f"DJANGO_SECRET_KEY={secrets.token_urlsafe(50)}",
    )
    target.write_text(content, encoding="utf-8")
    print(f"{target} créé (clé secrète aléatoire, base locale sur le port {DB_PORT}).")


def database_exists(name: str) -> bool:
    if not re.fullmatch(r"[a-z_][a-z0-9_]*", name):
        fail(f"Nom de base invalide : {name!r}")
    query = f"SELECT 1 FROM pg_database WHERE datname = '{name}'"  # noqa: S608 (nom validé)
    result = subprocess.run(  # noqa: S603
        [tool("psql"), *conn_args("postgres"), "-tAc", query],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.stdout.strip() == "1"


def cmd_db_init(_args) -> None:
    """Idempotent : crée l'instance et la base seulement si elles manquent."""
    if PGDATA.exists():
        print(f"{PGDATA} existe déjà.")
    else:
        DEVDB.mkdir(exist_ok=True)
        result = run(
            [
                tool("initdb"),
                "-D",
                str(PGDATA),
                "-U",
                DB_USER,
                "-A",
                "trust",
                "-E",
                "UTF8",
                "--no-locale",
            ]
        )
        if result.returncode != 0:
            fail("initdb a échoué.")
        with open(PGDATA / "postgresql.conf", "a", encoding="utf-8") as conf:
            conf.write(
                f"\n# AGRIA (scripts/dev.py)\nlisten_addresses = '{DB_HOST}'\nport = {DB_PORT}\n"
            )
    cmd_db_start(_args)
    if database_exists(DB_NAME):
        print(f"La base « {DB_NAME} » existe déjà.")
    elif run([tool("createdb"), "-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER, DB_NAME]).returncode:
        fail("createdb a échoué.")
    print(f"Base « {DB_NAME} » prête sur {DB_HOST}:{DB_PORT}.")


def cmd_db_start(_args) -> None:
    if not PGDATA.exists():
        fail("Instance absente : lancer d'abord « python scripts/dev.py db-init ».")
    if is_running():
        print("L'instance tourne déjà.")
        return
    # Sorties redirigées vers NUL : sinon le serveur hérite de la console appelante et
    # la garde ouverte (une commande lancée via un tube ne se terminerait jamais).
    result = run(
        [tool("pg_ctl"), "start", "-D", str(PGDATA), "-l", str(PGLOG), "-w"],
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if result.returncode != 0:
        fail(f"Démarrage impossible ; voir {PGLOG}.")
    print(f"Instance démarrée sur {DB_HOST}:{DB_PORT}.")


def cmd_db_stop(_args) -> None:
    if not is_running():
        print("L'instance n'est pas démarrée.")
        return
    result = run([tool("pg_ctl"), "stop", "-D", str(PGDATA), "-m", "fast", "-w"])
    if result.returncode != 0:
        fail("Arrêt impossible.")


def cmd_db_status(_args) -> None:
    print("démarrée" if is_running() else "arrêtée")


def cmd_db_backup(args) -> None:
    if not is_running():
        fail("L'instance n'est pas démarrée.")
    BACKUPS.mkdir(exist_ok=True)
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    target = Path(args.output) if args.output else BACKUPS / f"agria-{stamp}.dump"
    result = run([tool("pg_dump"), *conn_args(args.db), "-Fc", "--no-owner", "-f", str(target)])
    if result.returncode != 0:
        fail("pg_dump a échoué.")
    print(f"Sauvegarde écrite : {target} ({target.stat().st_size} octets)")


def cmd_db_restore(args) -> None:
    source = Path(args.file)
    if not source.exists():
        fail(f"{source} introuvable.")
    if not is_running():
        fail("L'instance n'est pas démarrée.")
    if args.into == DB_NAME and not args.replace:
        fail(
            f"Restaurer dans « {DB_NAME} » écrase la base de travail : "
            "ajouter --replace pour confirmer, ou choisir --into autre_nom."
        )
    run(
        [
            tool("dropdb"),
            "-h",
            DB_HOST,
            "-p",
            DB_PORT,
            "-U",
            DB_USER,
            "--if-exists",
            "--force",
            args.into,
        ]
    )
    if run([tool("createdb"), "-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER, args.into]).returncode:
        fail("createdb a échoué.")
    result = run(
        [
            tool("pg_restore"),
            *conn_args(args.into),
            "--no-owner",
            "--exit-on-error",
            str(source),
        ]
    )
    if result.returncode != 0:
        fail("pg_restore a échoué.")
    print(f"Sauvegarde restaurée dans la base « {args.into} ».")


def venv_python() -> str:
    candidates = [
        BACKEND / ".venv" / "Scripts" / "python.exe",
        BACKEND / ".venv" / "bin" / "python",
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    fail("Environnement Python absent : voir docs/DEMARRAGE.md (backend/.venv).")
    raise AssertionError


E2E_DB = "agria_e2e"
E2E_SETUP = [["migrate", "--noinput"], ["load_content"]]


def cmd_e2e_server(args) -> None:
    """Recrée la base agria_e2e puis lance Django dessus (utilisé par Playwright)."""
    # Pas d'exigence d'instance locale : en CI, PostgreSQL est un service sur le même port.
    base = ["-h", DB_HOST, "-p", DB_PORT, "-U", DB_USER]
    run([tool("dropdb"), *base, "--if-exists", "--force", E2E_DB])
    if run([tool("createdb"), *base, E2E_DB]).returncode:
        fail("createdb agria_e2e a échoué.")
    # Les parcours enchaînent les connexions depuis 127.0.0.1 : limite relevée pour eux seuls.
    env = {
        **os.environ,
        "DB_NAME": E2E_DB,
        "AGRIA_ALLOW_SIGNUP": "true",
        "AGRIA_AUTH_RATE": "1000/min",
    }
    py = venv_python()
    for command in E2E_SETUP:
        if run([py, "manage.py", *command], cwd=BACKEND, env=env).returncode:
            fail(f"manage.py {' '.join(command)} a échoué.")
    run(
        [py, "manage.py", "runserver", f"127.0.0.1:{args.port}", "--noreload"],
        cwd=BACKEND,
        env=env,
    )


def cmd_check(args) -> None:
    py = venv_python()
    npm = "npm.cmd" if os.name == "nt" else "npm"
    steps: list[tuple[str, list[str], Path]] = [
        ("ruff (lint)", [py, "-m", "ruff", "check", ".", "../scripts"], BACKEND),
        (
            "ruff (format)",
            [py, "-m", "ruff", "format", "--check", ".", "../scripts"],
            BACKEND,
        ),
        (
            "migrations à jour",
            [py, "manage.py", "makemigrations", "--check", "--dry-run"],
            BACKEND,
        ),
        ("pytest", [py, "-m", "pytest"], BACKEND),
        ("eslint", [npm, "run", "lint"], FRONTEND),
        ("typescript", [npm, "run", "typecheck"], FRONTEND),
        ("build", [npm, "run", "build"], FRONTEND),
    ]
    if args.e2e:
        steps.append(("parcours (playwright)", [npm, "run", "test:e2e"], FRONTEND))
    failures = []
    for label, cmd, cwd in steps:
        print(f"\n=== {label} ===")
        if run(cmd, cwd=cwd).returncode != 0:
            failures.append(label)
    print()
    if failures:
        fail("contrôles en échec : " + ", ".join(failures))
    print("Tous les contrôles sont passés.")


def main() -> None:
    if sys.version_info < (3, 14, 8):  # noqa: UP036 (refuse un interpréteur trop ancien)
        fail(
            "Python 3.14.8+ requis : lancer ce script avec backend/.venv (voir docs/DEMARRAGE.md)."
        )
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("env").set_defaults(func=cmd_env)
    sub.add_parser("db-init").set_defaults(func=cmd_db_init)
    sub.add_parser("db-start").set_defaults(func=cmd_db_start)
    sub.add_parser("db-stop").set_defaults(func=cmd_db_stop)
    sub.add_parser("db-status").set_defaults(func=cmd_db_status)
    backup = sub.add_parser("db-backup")
    backup.add_argument("--output", help="fichier de sortie (défaut : backups/agria-<date>.dump)")
    backup.add_argument("--db", default=DB_NAME, help="base à sauvegarder")
    backup.set_defaults(func=cmd_db_backup)
    restore = sub.add_parser("db-restore")
    restore.add_argument("file")
    restore.add_argument("--into", default="agria_restauration", help="base cible (recréée)")
    restore.add_argument("--replace", action="store_true", help="autorise --into agria")
    restore.set_defaults(func=cmd_db_restore)
    e2e = sub.add_parser("e2e-server")
    e2e.add_argument("--port", default="8001")
    e2e.set_defaults(func=cmd_e2e_server)
    check = sub.add_parser("check")
    check.add_argument("--e2e", action="store_true", help="ajoute les parcours Playwright")
    check.set_defaults(func=cmd_check)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
