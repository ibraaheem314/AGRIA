# AGRIA

**Préparer sa campagne agricole au Sénégal, comprendre ses contraintes et avancer avec un accompagnement adapté.**

AGRIA aide un porteur de projet débutant ou un producteur peu accompagné à préparer sa prochaine campagne, en suivant le parcours : **contexte → points à vérifier → démarches → budget → relecture par un conseiller → décision** (poursuivre, modifier ou différer).

## Où en est le projet (11 octobre 2026)

| Niveau de preuve | État |
|---|---|
| **Implémenté** | Les six fonctions de la première version (F1–F6 du [cahier des charges](docs/PRODUIT.md)) : dossier persistant, points à vérifier, plan d'action, budget transparent, conseil humain rattaché au dossier, synthèse et historique |
| **Vérifié par des tests logiciels** | 147 tests backend ; 15 scénarios de parcours navigateur exécutés en vues ordinateur et téléphone (29 exécutions) ; recette réelle de redémarrage et de restauration. Détail : [AVANCEMENT.md](docs/AVANCEMENT.md) |
| **Validé par un spécialiste** | **Rien.** Le contenu de préparation est générique, sans prescription agronomique, et marqué « non relu » dans l'application |
| **Utilité démontrée** | **Rien.** Aucun utilisateur, conseiller, zone ou culture de pilote n'est encore engagé ([validation terrain](docs/VALIDATION_TERRAIN.md)) |

Le code est sur la branche `refonte/fondations`. L'ancien prototype est archivé sur `archive/prototype-2026-10-11`. Rien n'a été déployé.

### Actions externes en attente

- **Révoquer les clés** OpenWeather et Agromonitoring (visibles publiquement dans `lib/config.ts` sur `master` et dans l'historique), ainsi que les clés OpenRouter, AirVisual et HuggingFace, et changer le mot de passe email qui figurait dans `.env`. Voir [SECURITE.md](docs/SECURITE.md) §3. Seul le titulaire des comptes peut le faire.
- Choisir un hébergement avant tout usage partagé (D-006) ; liste de contrôle dans [SECURITE.md](docs/SECURITE.md) §5.

## Démarrer

Prérequis : Python 3.12, Node 22.12+, binaires PostgreSQL 16+. Aucune clé de service externe.

```powershell
py -3.12 -m venv backend\.venv            # ou le python.exe de Python 3.12 (voir DEMARRAGE)
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
