# AGRIA

**Préparer sa campagne agricole au Sénégal, comprendre ses contraintes et avancer avec un accompagnement adapté.**

AGRIA aide un porteur de projet débutant ou un producteur peu accompagné à préparer sa prochaine campagne, en suivant le parcours : **contexte → points à vérifier → démarches → budget → relecture par un conseiller → décision** (poursuivre, modifier ou différer).

## Où en est le projet (11 octobre 2026)

| Niveau | État |
|---|---|
| **Fondations techniques** | Livrées : les six fonctions de la première version (F1–F6 du [cahier des charges](docs/PRODUIT.md)) |
| **Clôture de la version locale** | **Ouverte au 12/10/2026** : revue de complétude et corrections de parcours à terminer. Voir [AVANCEMENT.md](docs/AVANCEMENT.md), « Revue de complétude technique ». |
| **Contrôles exécutés** | Résultats locaux et versions exactes dans [AVANCEMENT.md](docs/AVANCEMENT.md). Runtime courant : Python 3.14.8. **CI GitHub jamais exécutée.** |
| **Préparation du terrain** | Kit d'enquête G1 et protocole G2 prêts, non exécutés : [VALIDATION_TERRAIN.md](docs/VALIDATION_TERRAIN.md) |
| **Validation par un spécialiste** | **Aucune.** Le contenu est générique, sans prescription agronomique, et marqué « non relu » dans l'application |
| **Validation terrain, utilité** | **Aucune.** Aucun entretien, participant, conseiller, zone ni culture engagés |
| **Mise en service** | **Aucune.** Ni hébergement ni accès à distance ; utilisation locale seulement |

Le code est sur la branche `refonte/fondations` ; l'ancien prototype est archivé sur `archive/prototype-2026-10-11`. Rien n'a été poussé ni déployé. **Le pilote n'est pas prêt à démarrer** : les étapes et leurs conditions sont dans la [roadmap](ROADMAP.md).

### Actions du propriétaire en attente

- **Révoquer les clés** OpenWeather et Agromonitoring, visibles publiquement dans `lib/config.ts` sur `master` et dans l'historique. Révoquer aussi par précaution les clés OpenRouter, AirVisual et HuggingFace, et changer le mot de passe email qui figurait dans `.env`. Voir [SECURITE.md](docs/SECURITE.md) §2. Aucune révocation n'est confirmée à ce jour.
- Fixer J0, les seuils de G1 et les plafonds de temps et de dépenses (D-011), puis lancer les premiers contacts ([ROADMAP](ROADMAP.md), E4–E5).

## Démarrer

Prérequis : Python 3.14.8 ou correctif 3.14 plus récent, Node 22.12+, binaires PostgreSQL 16+. Aucune clé de service externe.

```powershell
py -3.14 -m venv backend\.venv            # première installation ; voir DEMARRAGE
backend\.venv\Scripts\python -m pip install -r backend\requirements-dev.txt
backend\.venv\Scripts\python scripts\dev.py env       # backend/.env avec une clé secrète aléatoire
backend\.venv\Scripts\python scripts\dev.py db-init   # PostgreSQL propre au projet (127.0.0.1:5444)
cd backend; .venv\Scripts\python manage.py migrate; .venv\Scripts\python manage.py load_content; cd ..
cd frontend; npm ci; cd ..
# Terminal 1 :  cd backend; .venv\Scripts\python manage.py runserver 127.0.0.1:8000
# Terminal 2 :  cd frontend; npm run dev        → http://127.0.0.1:5173
backend\.venv\Scripts\python scripts\dev.py check --e2e   # tous les contrôles
backend\.venv\Scripts\python scripts\recette.py          # redémarrage et restauration en conditions réelles
backend\.venv\Scripts\python scripts\verifier_secrets.py # avant tout envoi vers GitHub
```

Guide complet, comptes conseiller, données de démonstration, sauvegardes : [docs/DEMARRAGE.md](docs/DEMARRAGE.md).

## Architecture en bref

React + TypeScript + Vite + Tailwind (aucun secret côté navigateur) → API Django 5.2 + Django REST Framework (sessions, CSRF, permissions vérifiées par le serveur) → PostgreSQL, avec les invariants métier en contraintes de base. Détail : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Documentation

| Document | Rôle |
|---|---|
| [Cahier des charges](docs/PRODUIT.md) | Vision, six fonctions, exclusions, scénarios de recette |
| [Stratégie](docs/STRATEGIE.md) · [Roadmap](ROADMAP.md) | Cible, proposition de valeur, jalons |
| [Validation terrain](docs/VALIDATION_TERRAIN.md) · [Marché](docs/MARCHE_SENEGAL.md) | Enquête, pilote, sources |
| [Architecture](docs/ARCHITECTURE.md) · [Interface](docs/INTERFACE.md) | Fonctionnement du code livré |
| [Démarrage](docs/DEMARRAGE.md) | Installation, lancement, contrôles, sauvegarde |
| [Avancement](docs/AVANCEMENT.md) | Preuves par brique, rapport de recette |
| [Décisions](docs/DECISIONS.md) | Registre des arbitrages (D-001 à D-038) |
| [Sécurité](docs/SECURITE.md) · [Inventaire](docs/INVENTAIRE.md) · [Plan de refonte](docs/PLAN_REFONTE.md) | Incident de clés, ancien prototype, suivi des tâches |
