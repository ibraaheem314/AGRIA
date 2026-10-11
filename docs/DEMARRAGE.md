# Guide de démarrage

Commandes testées le 11 octobre 2026 sous Windows 11 (PowerShell et Git Bash), avec Python 3.10.0, Node 22.15.0, npm 11.9.0 et PostgreSQL 18 (binaires). Aucune clé de service externe n'est nécessaire.

## Prérequis

- Python 3.10 ou plus récent. **Attention :** Python 3.10 arrive en fin de support en octobre 2026. Préférer 3.12+ pour un nouvel environnement ; la CI teste 3.10 et 3.12.
- Node 22.12 ou plus récent.
- Les binaires PostgreSQL 16+ (`initdb`, `pg_ctl`, `psql`, `pg_dump`, `pg_restore`). Sous Windows, ils sont trouvés automatiquement dans `C:\Program Files\PostgreSQL\<version>\bin` ; sinon, définir `PG_BIN`.

## Première installation

Depuis la racine du dépôt (PowerShell) :

```powershell
# 1. Configuration serveur : crée backend/.env avec une clé secrète aléatoire
python scripts/dev.py env

# 2. Base de développement propre au projet : .devdb/, 127.0.0.1:5444, n'interfère avec aucun service existant
python scripts/dev.py db-init

# 3. Backend
python -m venv backend/.venv
backend\.venv\Scripts\python -m pip install -r backend/requirements-dev.txt
cd backend
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py load_content        # modèles de préparation (idempotent)
cd ..

# 4. Frontend
cd frontend
npm ci
cd ..
```

Sous Linux et macOS, remplacer `backend\.venv\Scripts\python` par `backend/.venv/bin/python`.

## Lancer l'application

Deux terminaux :

```powershell
# Terminal 1 : API Django sur http://127.0.0.1:8000
python scripts/dev.py db-start
cd backend; .venv\Scripts\python manage.py runserver 127.0.0.1:8000

# Terminal 2 : interface sur http://127.0.0.1:5173
cd frontend; npm run dev
```

Ouvrir http://127.0.0.1:5173. L'interface relaie `/api` vers Django (même origine : cookies de session et CSRF, sans CORS).

Pour essayer depuis un téléphone du même réseau : `npm run dev -- --host 0.0.0.0`, puis ajouter l'adresse IP du poste à `DJANGO_ALLOWED_HOSTS`. La connexion n'est alors **pas chiffrée** : à réserver à des données de test.

## Comptes et données d'exemple

```powershell
cd backend
.venv\Scripts\python manage.py createsuperuser                                   # accès à /admin (attribution des conseillers)
.venv\Scripts\python manage.py create_account --email c@exemple.sn --name "Nom" --advisor --random-password
.venv\Scripts\python manage.py assign_advisor --dossier 12 --email c@exemple.sn   # attribuer (--end pour clore)
.venv\Scripts\python manage.py seed_demo                                         # dossier fictif, compte demonstration@agria.invalid
```

L'attribution d'un dossier à un conseiller se fait par `assign_advisor` ou dans l'administration Django (http://127.0.0.1:5173/admin/, fiche de la campagne). Les modèles de contenu, les informations et les démarches n'y sont qu'en lecture.

## Contrôles

```powershell
python scripts/dev.py check          # ruff, format, migrations à jour, pytest, eslint, tsc, build
python scripts/dev.py check --e2e    # + parcours Playwright (ordinateur et téléphone)
python scripts/recette.py            # redémarrage réel du serveur, sauvegarde puis restauration (bases dédiées)
```

Les parcours Playwright recréent une base séparée `agria_e2e` et utilisent les ports 8001 et 5174 : la base de travail n'est pas touchée. En local, ils utilisent le Chrome installé ; en CI, le Chromium de Playwright.

## Base de données

```powershell
python scripts/dev.py db-status
python scripts/dev.py db-stop
python scripts/dev.py db-backup                                   # écrit backups/agria-<date>.dump
python scripts/dev.py db-restore backups/agria-<date>.dump        # restaure dans la base séparée agria_restauration
python scripts/dev.py db-restore backups/<f>.dump --into agria --replace   # remplace la base de travail
```

L'instance de développement accepte toute connexion locale sans mot de passe (`trust`, sur 127.0.0.1 uniquement). Elle n'est pas faite pour des données réelles.

## Configuration

| Variable (backend/.env) | Rôle |
|---|---|
| `DJANGO_SECRET_KEY` | Obligatoire, ≥ 32 caractères, jamais la valeur d'exemple |
| `DJANGO_DEBUG` | `true` en local uniquement |
| `DJANGO_ALLOWED_HOSTS` | Obligatoire si `DJANGO_DEBUG=false` |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Connexion PostgreSQL |
| `AGRIA_ALLOW_SIGNUP` | Autorise l'inscription libre par email |
| `AGRIA_AUTH_RATE` | Tentatives de connexion/inscription par IP (défaut `10/min`) |

Toute valeur invalide arrête le démarrage avec un message explicite. Le frontend n'a **aucune** variable secrète.
