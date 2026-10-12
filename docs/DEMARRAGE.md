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
```

Après chaque récupération de nouvelles révisions, relancer `manage.py migrate` sur la base de travail **avant** de démarrer le serveur. La révision du 12 octobre 2026 (parcours débutant) ajoute deux migrations : `preparation 0002_issue_du_resultat` et `budget 0002_postes_a_examiner`. Sans elles, le serveur répond par des erreurs.

```powershell
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

## Comptes et opérations du mode accompagné

Sur la base de travail (depuis `backend`) :

```powershell
.venv\Scripts\python manage.py createsuperuser                                         # accès à /admin
.venv\Scripts\python manage.py create_account --email c@exemple.sn --name "Nom" --advisor --random-password
.venv\Scripts\python manage.py assign_advisor --dossier 12 --email c@exemple.sn         # --end pour clore
.venv\Scripts\python manage.py assist_account --email c@exemple.sn --status             # compte bloqué ?
.venv\Scripts\python manage.py assist_account --email c@exemple.sn --reset-password     # nouveau mot de passe, affiché une fois
.venv\Scripts\python manage.py assist_account --email c@exemple.sn --reactivate
```

Après trop de tentatives de connexion (10 par minute et par adresse), il suffit d'attendre une minute. L'attribution peut aussi se faire dans l'administration Django, sur la fiche de la campagne.

## Démonstration (base dédiée, données fictives)

La démonstration tourne sur sa propre base, `agria_demo`, et sur des ports distincts de ceux du développement (8000 et 5173), qui peuvent donc rester ouverts. La base de travail n'est jamais touchée.

### Démarrer (deux terminaux, depuis la racine du dépôt)

```powershell
# Terminal 1
backend\.venv\Scripts\python scripts\dev.py db-status                   # l'instance PostgreSQL doit être démarrée (sinon : db-start)
backend\.venv\Scripts\python scripts\dev.py demo-init                   # première fois : crée agria_demo et affiche 3 mots de passe
backend\.venv\Scripts\python scripts\dev.py demo-server --port 8002

# Terminal 2
cd frontend
$env:AGRIA_API_URL="http://127.0.0.1:8002"; npx vite --port 5175 --strictPort
```

Ouvrir **http://127.0.0.1:5175**.

- `demo-init` refuse d'écraser une base `agria_demo` existante. `demo-init --reset` la supprime et la recrée : n'utiliser `--reset` que si rien de ce qu'elle contient n'est à garder (elle ne contient que des exemples).
- Les mots de passe des trois comptes fictifs sont affichés **une seule fois**, dans le terminal : les noter dans un endroit privé, jamais dans le dépôt. Pour en obtenir un nouveau sans recréer la base :

```powershell
cd backend; $env:DB_NAME="agria_demo"
.venv\Scripts\python manage.py assist_account --email demo-debutant@agria.invalid --reset-password
Remove-Item Env:DB_NAME; cd ..
```

| Compte | Ce qu'il montre |
|---|---|
| `demo-debutant@agria.invalid` | Débutant : terrain en discussion, eau inconnue, démarche terminée avec un résultat incertain, budget incomplet, question, relecture demandée |
| `demo-producteur@agria.invalid` | Producteur : campagne précédente archivée, nouvelle campagne au lieu « à revérifier », vue directe |
| `demo-conseiller@agria.invalid` | Conseiller attribué au dossier du débutant |

Utiliser une fenêtre de navigation privée par compte (ou se déconnecter entre deux rôles). Les dossiers portent le bandeau « Exemple de démonstration ».

### Parcours de dix minutes

| Temps | Rôle | Étapes | Résultat attendu |
|---|---|---|---|
| 0–3 min | Débutant | Ouvrir le dossier « Exemple fictif — maraîchage ». Lire Aujourd'hui, puis Mon plan | Carte « Renseigner mon projet pas à pas » (4 informations sur 11), prochaine démarche, points bloquants « Accès au terrain encore en discussion » et « Source d'eau inconnue » ; « Contenu générique — Non relu par un spécialiste » |
| | | Ouvrir la démarche « Identifier une source d'eau utilisable » | Terminée, résultat « incertain » ; carte « Et maintenant : mettre le dossier à jour » : le point reste ouvert, rien n'a changé automatiquement |
| | | « Mettre à jour : Accès à l'eau » → « Déclaré », source « Puits » → Enregistrer | Le résultat de la démarche est rappelé sans rien préremplir. Retour à la démarche avec « Point encore ouvert : Disponibilité de l'eau déclarée mais non vérifiée » |
| | | Mon projet → Voir le budget provisoire | « Budget incomplet : 1 poste sans montant… ce n'est pas le coût total » ; postes à examiner proposés, sans prix |
| 3–6 min | Conseiller | Mes dossiers → dossier du débutant (« Relecture demandée ») | Bandeau « lecture seule » ; navigation « Projet · Plan » |
| | | Projet → Accès au terrain → « Poser une question sur cette information » → envoyer | « À propos de : Information « Accès au terrain » » puis « Message envoyé. » ; aucun bouton d'enregistrement sur les informations |
| | | Relecture : « Rédiger un avis » → Contexte du projet, « Revu avec réserves », avis et réserves → enregistrer | « Avis enregistré. » |
| 6–9 min | Débutant | Aujourd'hui | « Une question du conseiller attend votre réponse : « Accès au terrain » » et l'avis « Revu avec réserves » |
| | | « Répondre au conseiller » → répondre. Puis Mon projet → Accès au terrain → modifier les précisions → Enregistrer | Réponse visible sous la question |
| | | Relecture | L'avis est « À réexaminer » (« Modifié depuis cet avis : Contexte du projet ») |
| | | Décision « Modifier le projet » avec un motif → Enregistrer, puis « Voir la synthèse du dossier » | « Décision enregistrée. » ; la synthèse reprend informations et statuts, démarches et résultat incertain, budget incomplet, avis (à jour ou à réexaminer), questions et décision |
| 9–10 min | Producteur | Mes dossiers | Campagne active et « Dossiers archivés (consultation) » séparés |
| | | Ouvrir « Prochaine contre-saison (exemple) » → Mon projet | Lieu et eau repris « Déclaré », avec « à revérifier pour cette campagne » et la source d'origine ; budget vide ; aucune démarche ni résultat repris ; accès direct à chaque information |

Facultatif : pour voir le pas-à-pas depuis le début, créer un compte (« Créer un compte ») puis un projet « Je prépare ma première campagne ».

### Reprendre ou arrêter

- **Arrêter :** `Ctrl+C` dans les deux terminaux. Les données de démonstration restent dans `agria_demo`.
- **Reprendre :** relancer les deux commandes `demo-server --port 8002` et `npx vite --port 5175` ; les comptes et les saisies sont conservés.
- **Repartir des exemples d'origine :** `dev.py demo-init --reset` (nouveaux mots de passe affichés une fois).

### Questions pour recueillir un retour

À poser après le parcours, sans commenter les réponses ; noter les réponses telles qu'elles sont données.

1. En une phrase, à quoi sert ce produit, et pour qui ?
2. Sur l'écran « Aujourd'hui » du débutant, quelle serait la prochaine chose à faire, et qu'est-ce qui vous l'a indiqué ?
3. Pour une même information, que signifient pour vous « Déclaré », « Vérifié (source indiquée) » et « Situation : point encore ouvert » ?
4. Après la démarche terminée avec un résultat « incertain », qu'est-ce qui a changé dans le dossier et qu'est-ce qui n'a pas changé ?
5. Que vous apprend le budget affiché sur le coût du projet, et que ne vous apprend-il pas ?

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
