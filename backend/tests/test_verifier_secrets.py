"""Non-régression du contrôle de secrets, avec des valeurs exclusivement fictives."""

import importlib.util
import subprocess
from pathlib import Path

import pytest


@pytest.fixture
def scanner(tmp_path, monkeypatch):
    path = Path(__file__).resolve().parents[2] / "scripts" / "verifier_secrets.py"
    spec = importlib.util.spec_from_file_location("verifier_secrets", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    monkeypatch.setattr(module, "ROOT", tmp_path)
    monkeypatch.setattr("sys.argv", [str(path)])
    return module


def test_toutes_les_valeurs_homonymes_restent_detectables(scanner, tmp_path):
    current = tmp_path / "backend" / ".env"
    archive = tmp_path / ".local-archive" / "prototype" / ".env"
    current.parent.mkdir(parents=True)
    archive.parent.mkdir(parents=True)
    samples = ["fictif-premier-secret", "fictif-second-secret", "fictif-ancien-secret"]
    current.write_text(f"SAMPLE_KEY={samples[0]}\nSAMPLE_KEY={samples[1]}\n", encoding="utf-8")
    archive.write_text(f"SAMPLE_KEY={samples[2]}\n", encoding="utf-8")

    values = scanner.known_values()
    assert len(values) == 3
    for sample in samples:
        findings = []
        scanner.scan_blob("fichier-suivi", sample.encode(), values, findings)
        assert len(findings) == 1  # même nom de fichier et variable, ou ligne répétée
        assert "SAMPLE_KEY" in findings[0]
        assert sample not in findings[0]


@pytest.mark.parametrize("exposed", [True, False])
def test_code_de_sortie_et_rapport_sans_valeur(scanner, tmp_path, capsys, exposed):
    config = tmp_path / "backend" / ".env"
    config.parent.mkdir()
    sample = "secret-fictif-pour-le-test"
    config.write_text(f"SAMPLE_KEY={sample}\n", encoding="utf-8")
    tracked = tmp_path / "application.txt"
    tracked.write_text(sample if exposed else "contenu-public", encoding="utf-8")
    for args in (["init", "--quiet"], ["add", "application.txt"]):
        subprocess.run(["git", *args], cwd=tmp_path, capture_output=True, check=True)  # noqa: S603,S607

    assert scanner.main() == (1 if exposed else 0)
    output = capsys.readouterr().out
    assert sample not in output
    assert "Build frontend absent" in output
    assert "ne garantit pas l'absence" in output
    assert ("Aucun secret détecté dans le périmètre bloquant analysé" in output) is not exposed
