#!/usr/bin/env python
"""Recherche de secrets dans ce qui est (ou pourrait être) publié. N'affiche jamais une valeur.

    python scripts/verifier_secrets.py               # fichiers suivis, branches, build
    python scripts/verifier_secrets.py --historique   # + tout l'historique Git (plus long)

Deux méthodes complémentaires :
1. Valeurs connues : lues dans les fichiers .env locaux (backend/.env, .local-archive/**/*.env),
   recherchées telles quelles. Seul le NOM de la variable est affiché.
2. Motifs génériques de clés (préfixes de fournisseurs, clés privées) : seul le nom du motif
   et l'emplacement sont affichés.

Code de sortie 1 si quelque chose est trouvé dans ce qui partirait avec la branche courante :
fichiers suivis, arbre de la branche courante, build frontend. Les autres branches locales
sont analysées et signalées, sans bloquer.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACEHOLDER = re.compile(
    r"^(votre_|your_|remplacer|xxxx|sqlite|127\.0\.0\.1|localhost|true|false|agria|ci-uniquement)",
    re.IGNORECASE,
)
PATTERNS = {
    "cle_openrouter": re.compile(rb"sk-or-v1-[0-9a-f]{20,}"),
    "cle_openai": re.compile(rb"sk-[A-Za-z0-9]{32,}"),
    "jeton_huggingface": re.compile(rb"hf_[A-Za-z0-9]{30,}"),
    "cle_aws": re.compile(rb"AKIA[0-9A-Z]{16}"),
    "jeton_github": re.compile(rb"gh[pousr]_[A-Za-z0-9]{36,}"),
    "cle_privee": re.compile(rb"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    "appid_en_dur": re.compile(rb"appid=[0-9a-f]{32}"),
}


def known_values() -> list[tuple[str, bytes]]:
    sources = [ROOT / "backend" / ".env", *ROOT.glob(".local-archive/**/*.env")]
    values: list[tuple[str, bytes]] = []
    for source in sources:
        if not source.exists():
            continue
        lines = source.read_text(encoding="utf-8", errors="replace").splitlines()
        for number, line in enumerate(lines, start=1):
            if "=" not in line or line.lstrip().startswith("#"):
                continue
            name, value = line.split("=", 1)
            value = value.strip().strip('"').strip("'")
            if len(value) >= 8 and not PLACEHOLDER.match(value):
                # Conserver aussi les anciennes valeurs d'une variable répétée dans un fichier.
                origin = f"{source.relative_to(ROOT).as_posix()}:{number}:{name.strip()}"
                values.append((origin, value.encode()))
    return values


def git(*args: str) -> bytes:
    return subprocess.run(  # noqa: S603
        ["git", *args],  # noqa: S607 (git du PATH, comme pour tout le projet)
        cwd=ROOT,
        capture_output=True,
        check=True,  # noqa: S607
    ).stdout


def scan_blob(
    label: str, data: bytes, values: list[tuple[str, bytes]], findings: list[str]
) -> None:
    for name, value in values:
        if value in data:
            findings.append(f"{label} : valeur de {name}")
    for name, pattern in PATTERNS.items():
        if pattern.search(data):
            findings.append(f"{label} : motif {name}")


def scan_tree(ref: str, values, findings) -> int:
    files = git("ls-tree", "-r", "--name-only", ref).decode().splitlines()
    for path in files:
        scan_blob(f"{ref}:{path}", git("show", f"{ref}:{path}"), values, findings)
    return len(files)


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--historique", action="store_true", help="analyse aussi git log --all -p")
    args = parser.parse_args()

    values = known_values()
    print(
        f"Valeurs connues chargées : {len(values)} "
        f"(origines et noms seulement : {', '.join(sorted(name for name, _ in values))})"
    )
    findings: list[str] = []

    tracked = git("ls-files", "-z").decode().split("\0")
    for path in filter(None, tracked):
        file = ROOT / path
        if file.is_file():
            scan_blob(f"suivi:{path}", file.read_bytes(), values, findings)
    print(f"Fichiers suivis du dossier de travail : {len(tracked) - 1} analysés")

    current = git("branch", "--show-current").decode().strip()
    others: list[str] = []
    refs = git("for-each-ref", "--format=%(refname:short)", "refs/heads", "refs/remotes").decode()
    for branch in [r for r in refs.split() if not r.endswith("/HEAD") and r != "origin"]:
        count = scan_tree(branch, values, findings if branch == current else others)
        tag = " (courante)" if branch == current else ""
        print(f"Branche {branch}{tag} : {count} fichiers analysés")

    dist = ROOT / "frontend" / "dist"
    if dist.exists():
        files = [f for f in dist.rglob("*") if f.is_file()]
        for file in files:
            scan_blob(f"build:{file.relative_to(ROOT)}", file.read_bytes(), values, findings)
        print(f"Build frontend (frontend/dist) : {len(files)} fichiers analysés")
    else:
        print("Build frontend absent : lancer « npm run build » pour l'inclure")

    history: list[str] = []
    if args.historique:
        scan_blob("historique", git("log", "--all", "-p"), values, history)
        print("Historique Git complet : analysé")

    print()
    for line in sorted(set(findings)):
        print(f"TROUVÉ  {line}")
    for line in sorted(set(others)):
        print(f"AUTRE BRANCHE  {line}")
    for line in sorted(set(history)):
        print(f"HISTORIQUE  {line}")
    if not findings:
        print("Aucun secret détecté dans le périmètre bloquant analysé.")
    print("Les autres branches et l'historique éventuel sont signalés séparément.")
    print(
        "Ce contrôle ne garantit pas l'absence de secrets inconnus ou non couverts par ces motifs."
    )
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
