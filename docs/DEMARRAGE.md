# Guide de démarrage

Runtime retenu le 11 octobre 2026 sous Windows 11 : **Python 3.14.8**, Node 22.15.0, npm 11.9.0 et PostgreSQL 18 (binaires). Preuves des contrôles dans [AVANCEMENT.md](AVANCEMENT.md). Aucune clé de service externe n'est nécessaire.

## Prérequis

- **Python 3.14.8 ou un correctif 3.14 plus récent** (version retenue, D-043). Le serveur et les scripts refusent de démarrer avec une version antérieure à 3.14.8.
  - Windows, sans droits d'administrateur : `winget install --id Python.Python.3.14 --exact --scope user`, ou l'installateur de python.org en mode « pour moi seul ». Il s'installe dans `%LOCALAPPDATA%\Programs\Python\Python314`.
  - Linux : installer Python 3.14.8 ou un correctif 3.14 plus récent depuis une distribution maintenue ; vérifier `python3.14 --version`.
- Node 22.12 ou plus récent.
- Les binaires PostgreSQL 16+ (`initdb`, `pg_ctl`, `psql`, `pg_dump`, `pg_restore`). Sous Windows, ils sont trouvés automatiquement dans `C:\Program Files\PostgreSQL\<version>\bin` ; sinon, définir `PG_BIN`.

Après l'étape 1, **toutes les commandes Python passent par `backend\.venv`**, jamais par le `python` du PATH, qui peut être une autre version.

## Première installation

Depuis la racine du dépôt (PowerShell) :

```powershell
# 1. Environnement Python 3.14 du projet (première installation seulement)
& "$env:LOCALAPPDATA\Programs\Python\Python314\python.exe" -m venv backend\.venv   # ou : py -3.14 -m venv backend\.venv
backend\.venv\Scripts\python -m pip install -r backend\requirements-dev.txt

# 2. Configuration serveur : crée backend/.env avec une clé secrète aléatoire
backend\.venv\Scripts\python scripts\dev.py env

# 3. Base de développement propre au projet : .devdb/, 127.0.0.1:5444, n'interfère avec aucun service existant
backend\.venv\Scripts\python scripts\dev.py db-init

# 4. Schéma et contenu
cd backend
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py load_content        # modèles de préparation (idempotent)
cd ..

# 5. Frontend
cd frontend
npm ci
cd ..
```

Sous Linux et macOS : `python3.14 -m venv backend/.venv`, puis remplacer `backend\.venv\Scripts\python` par `backend/.venv/bin/python`.

### Environnements précédents et retour arrière

L'environnement courant est `backend/.venv` (Python 3.14.8). Les environnements 3.10 et 3.12 sont conservés respectivement dans `backend/.venv-py310` et `backend/.venv-py312`, ignorés par Git. Ils ne sont pas à utiliser avec le code courant. Pour diagnostiquer une régression, utiliser un checkout isolé de la révision précédente avec le runtime correspondant et une base de test séparée ; ne pas réinitialiser la branche de travail. Leur suppression ultérieure est un nettoyage facultatif. Elle ne conditionne ni les entretiens ni la validation de l'environnement courant. La base de travail n'a pas été déplacée.

## Lancer l'application

Deux terminaux :

```powershell
# Terminal 1 : API Django sur http://127.0.0.1:8000
backend\.venv\Scripts\python scripts\dev.py db-start
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
backend\.venv\Scripts\python scripts\dev.py check          # ruff, format, migrations à jour, pytest, eslint, tsc, build
backend\.venv\Scripts\python scripts\dev.py check --e2e    # + parcours Playwright (ordinateur et téléphone)
backend\.venv\Scripts\python scripts\recette.py            # redémarrage réel du serveur, sauvegarde puis restauration (bases dédiées)
```

Les parcours Playwright recréent une base séparée `agria_e2e` et utilisent les ports 8001 et 5174 : la base de travail n'est pas touchée. En local, ils utilisent le Chrome installé ; en CI, le Chromium de Playwright.

## Base de données

```powershell
backend\.venv\Scripts\python scripts\dev.py db-status
backend\.venv\Scripts\python scripts\dev.py db-stop
backend\.venv\Scripts\python scripts\dev.py db-backup                                   # écrit backups/agria-<date>.dump
backend\.venv\Scripts\python scripts\dev.py db-restore backups/agria-<date>.dump        # restaure dans la base séparée agria_restauration
backend\.venv\Scripts\python scripts\dev.py db-restore backups/<f>.dump --into agria --replace   # remplace la base de travail
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
