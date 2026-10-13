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

**Changer de rôle :** se déconnecter (« Se déconnecter ») avant de se connecter avec un autre compte, ou utiliser des **profils de navigateur distincts** (ou deux navigateurs différents). Plusieurs fenêtres privées d'un même navigateur partagent souvent la même session : la dernière connexion remplace alors la précédente dans toutes ces fenêtres. Les dossiers portent le bandeau « Exemple de démonstration ».

### Parcours de dix minutes

| Temps | Rôle | Étapes | Résultat attendu |
|---|---|---|---|
| 0–3 min | Débutant | Ouvrir le dossier « Exemple fictif — maraîchage », lire la synthèse (espace « Projet ») | Une seule carte « À faire maintenant » (démarche « Confirmer l'accès au terrain pour toute la campagne ») ; « Aussi possible » : renseigner les informations restantes pas à pas ; « Échanges et relecture » : une question en attente d'une réponse du conseiller, relecture demandée sans avis reçu |
| | | Démarches → démarche « Identifier une source d'eau utilisable » | Terminée, résultat « incertain » ; « Et maintenant : mettre le dossier à jour » : rien n'a changé automatiquement |
| | | « Mettre à jour : Accès à l'eau » → « Déclaré », source « Puits » → Enregistrer | Le résultat de la démarche est rappelé sans rien préremplir ; retour à la démarche avec « Point encore ouvert : Disponibilité de l'eau déclarée mais non vérifiée » |
| | | Budget (navigation) | « Budget incomplet… ce n'est pas le coût total » ; postes à examiner, sans prix |
| 3–6 min | Conseiller | Se déconnecter, se connecter en conseiller. Mes dossiers | Badges « 1 question attend votre réponse » et « Relecture demandée » |
| | | Ouvrir le dossier | Bandeau nommant le porteur, le projet et la campagne ; « À faire maintenant » : répondre à la question du porteur ; « Aussi possible » : examiner le dossier et rédiger un avis ; navigation « Projet · Plan » |
| | | Plan → titre « Plan du projet » ; liens « Consulter l'information » ; ouvrir « Accès au terrain » → « Poser une question sur cette information » → envoyer | Aucun lien « Compléter » ou « Mettre à jour » ; « À propos de : Information « Accès au terrain » » puis « Message envoyé. » |
| | | Relecture : répondre à la question du porteur, puis « Rédiger un avis » → Contexte du projet, « Revu avec réserves », avis et réserves → enregistrer | « Avis enregistré. » ; la question du porteur passe à « Vous avez répondu, question ouverte » |
| 6–9 min | Débutant | Se déconnecter, se reconnecter en débutant. Synthèse (« Projet ») | « À faire maintenant · Une réponse est attendue de vous » ; « Échanges et relecture » : réponse reçue à votre question (encore ouverte), dernier avis « Revu avec réserves » « À jour » |
| | | « Répondre au conseiller » → répondre. Puis sujet « Le lieu et le terrain » → Accès au terrain → modifier les précisions → Enregistrer | La page s'ouvre sur les échanges ; réponse visible sous la question |
| | | Conseiller → décision « Modifier le projet » avec un motif → Enregistrer, puis Projet et la synthèse imprimable | Avis « À réexaminer » ; à l'accueil, « Dernière décision du porteur : Modifier le projet » avec auteur, date et motif ; la synthèse reprend informations, démarches, budget incomplet, avis et décision |
| 9–10 min | Producteur | Se déconnecter, se connecter en producteur. Mes dossiers | Campagne active et « Dossiers archivés (consultation) » séparés |
| | | Ouvrir « Prochaine contre-saison (exemple) » → Toutes les informations | Lieu et eau repris « Déclaré », « à revérifier pour cette campagne » ; budget vide ; aucune démarche ni résultat repris ; accès direct à chaque information |

Facultatif : pour voir les premières questions depuis le début, suivre la démonstration UX3-A ci-dessous.

Les dossiers de démonstration existants restent rattachés au contenu v1 (voir AVANCEMENT, « Contenu de préparation v2 »).

### Démonstration UX3-A en cinq minutes (premières questions sur les API réelles)

Sur la base de démonstration (inscription fermée), avec un compte d'essai créé en ligne de commande. Ces deux commandes ajoutent le contenu v2 et un compte ; elles ne modifient ni les comptes ni les dossiers existants. À lancer par le fondateur, s'il le souhaite :

```powershell
cd backend; $env:DB_NAME="agria_demo"
.venv\Scripts\python manage.py load_content     # charge la v2 « Pluie seulement » ; dossiers existants inchangés
.venv\Scripts\python manage.py create_account --email essai-ux3@agria.invalid --name "Awa (essai)" --random-password
Remove-Item Env:DB_NAME; cd ..
```

| Temps | Faire | Observer |
|---|---|---|
| 0–2 min | Se connecter avec le compte d’essai → « Commencer un projet » → « Je prépare ma première campagne » → Créer | Arrivée sur « Préparez votre première campagne » ; « Commencer » |
| | Culture « Oignon », mois de début → « Enregistrer et continuer » ; région, terrain « En discussion » → continuer ; eau « Pluie seulement » → continuer | « Étape … enregistrée dans votre dossier » après chaque étape, jamais avant la réponse du serveur |
| | Vente : écrire un début de réponse, puis « Se déconnecter » | Confirmation « Modifications non enregistrées » ; « Quitter sans enregistrer » |
| 2–3 min | Se reconnecter | La synthèse s'ouvre : culture, lieu, eau conservés ; « À faire maintenant · Terminer les premières questions (1 sans réponse) » → reprise à « La vente » |
| | « Répondre plus tard » → « Enregistrer et vérifier mes réponses » → « Voir ma première synthèse » | « Votre point de départ » ; vente « à répondre plus tard » ; sujet « L'eau » : « Eau de pluie seulement : disponibilité à examiner localement » |
| 3–5 min | Sujet « L'eau » → « Faire examiner localement une campagne qui dépend de la pluie » → « Terminer et indiquer le résultat », résultat **Incertain** | Aucune étape n'invite à interroger un gestionnaire ; « Et maintenant : mettre le dossier à jour » |
| | « Mettre à jour : Accès à l'eau » → source « Puits », précisions → Enregistrer ; se déconnecter puis se reconnecter | Résultat rappelé sans rien préremplir ; « Point encore ouvert : … » (recalcul du serveur) ; après reconnexion, « Accès à l'eau : Puits » dans la synthèse et la démarche « Terminée · résultat incertain » dans le sujet |

Sans `load_content`, un nouveau dossier de la base de démonstration reste rattaché à la v1 : l'eau « Pluie seulement » y propose encore « Confirmer la disponibilité de l'eau ». Même remarque pour la base de travail (`manage.py load_content` sans `DB_NAME`).

### Reprendre ou arrêter

- **Arrêter :** `Ctrl+C` dans les deux terminaux. Les données de démonstration restent dans `agria_demo`.
- **Reprendre :** relancer les deux commandes `demo-server --port 8002` et `npx vite --port 5175` ; les comptes et les saisies sont conservés.
- **Repartir des exemples d'origine :** `dev.py demo-init --reset` (nouveaux mots de passe affichés une fois).

### Questions pour recueillir un retour

À poser après le parcours, sans commenter les réponses ; noter les réponses telles qu'elles sont données.

1. En une phrase, à quoi sert ce produit, et pour qui ?
2. Sur la synthèse du débutant, quelle serait la prochaine chose à faire, et qu'est-ce qui vous l'a indiqué ?
3. Pour une même information, que signifient pour vous « Déclaré », « Vérifié (source indiquée) » et « Situation : point encore ouvert » ?
4. Après la démarche terminée avec un résultat « incertain », qu'est-ce qui a changé dans le dossier et qu'est-ce qui n'a pas changé ?
5. Que vous apprend le budget affiché sur le coût du projet, et que ne vous apprend-il pas ?

## Prototype UX1 (proposition, données fictives)

Application séparée de l'application livrée : aucune API, aucune base, aucun compte. Elle peut tourner en même temps que le développement (8000/5173) et la démonstration (8002/5175).

```powershell
cd frontend
npm run prototype          # http://127.0.0.1:5176
npm run test:prototype     # vérification Playwright (1280 et 390 px) sur un serveur isolé (port 5177) :
                           # n'arrête ni ne reprend le prototype ouvert sur 5176
```

- **Rôle :** liste « Voir comme » du bandeau noir (Awa débutante, Modou producteur, Mme Ndiaye conseillère). C'est un outil de démonstration, pas une fonction du produit.
- **Persistance :** les changements restent dans le stockage de ce navigateur, rien n'est envoyé. « Outils de démonstration » → « Réinitialiser la démonstration » revient au jeu de départ.
- **Arrêter :** `Ctrl+C`. Relancer reprend l'état laissé dans le navigateur ; les données créées avec la version précédente restent utilisables.

### Scénario d'essai de dix minutes

| Temps | Rôle | Faire | Observer |
|---|---|---|---|
| 0–4 min | Awa | « Commencer » → culture ; période : « Je ne sais pas encore » → région, terrain « En discussion » → eau : « Je ne sais pas encore » → vente : « Répondre plus tard » → récapitulatif (phrase facultative) → « Voir ma première synthèse » | Quatre courtes étapes ; « Votre point de départ » en quelques lignes ; une seule action « À faire maintenant », visible sans défiler sur téléphone ; la vente reste « à répondre plus tard » |
| | | Ouvrir le sujet « L'eau », puis la démarche mise en avant : « Commencer », « Noter le résultat » (résultat **Incertain**) → « Mettre à jour : Accès au terrain » → préciser, « Je l'affirme », Enregistrer | Rien ne change automatiquement ; le résultat est rappelé pendant la mise à jour ; message « Point encore à éclaircir » |
| | | Budget : « Préparer mes premières dépenses » → ajouter « Semences ou plants », puis un poste avec un prix estimé | Montant chiffré, « 1 poste à chiffrer : le coût total n'est pas connu » |
| | | Conseiller : « Préparer une question » → « Enregistrer ma question », demander une relecture | « Question enregistrée dans votre dossier… Aucun conseiller ne la reçoit pour l'instant » ; rien n'est promis |
| 4–7 min | Outils | « Attribuer Mme Ndiaye au dossier d'Awa », puis « Voir comme » Mme Ndiaye | File « À traiter » avec les raisons ; « Votre intervention » ; aucun lien de modification |
| | Mme Ndiaye | « Votre intervention » (en tête) : répondre ; sujet « L'eau » → « Poser une question au porteur » → « Partager avec le porteur » ; « Rédiger un avis » avec réserves | « Déclaré par le porteur » dans le contexte ; « partagée dans le dossier », sans email ni SMS ; avis enregistré sur la version actuelle |
| 7–9 min | Awa | « À faire maintenant » : répondre à la conseillère ; modifier « Accès à l'eau » ; onglet Conseiller : avis « À réexaminer » ; décision « Modifier le projet » | La décision est celle du porteur, distincte de l'avis |
| 9–10 min | Modou | « Créer et voir ce qui est repris » → « Toujours vrai cette saison » sur deux informations, « A changé » sur l'eau, noter un changement → Projet ; puis Campagnes → campagne 2026 | Pas de parcours d'initiation ; résultats 2026 présentés comme historique ; aucun conseiller attribué à la nouvelle campagne |

## Démonstration du suivi de campagne (fictive, réponses scénarisées)

Route `/suivi` du prototype : trois situations reliées dans une même campagne fictive (où en est la culture ; problème sur les feuilles ; action réalisée et suivi de son résultat), avec journal et aperçu du bilan. Aucune IA, aucune analyse d'image, aucun appel réseau, aucune base ; état gardé dans le navigateur sous une clé distincte du prototype UX1/UX2. La culture et le lieu sont des supports d'illustration, pas un choix de marché.

```powershell
cd frontend
npm run prototype          # puis ouvrir http://127.0.0.1:5176/suivi
```

**Parcours de cinq minutes**

| Temps | Faire | Observer |
|---|---|---|
| 0–1 min | Lire « Où en est ma culture ? » | Contexte court ; une chose à vérifier maintenant et pourquoi ; « Aucun arrosage déclaré… ce n'est pas la preuve qu'il n'a pas eu lieu » ; repiquage réalisé 5 jours après la fenêtre ; plan « Prévu » distinct du « Réalisé » |
| 1–3 min | « J'observe un problème sur les feuilles » → image d'exemple → quatre questions → « Ce que votre journal dit déjà » (seul l'arrosage manquant est demandé) → réponse scénarisée | Aucune cause ni traitement ; ce qu'il est utile de faire ; rien n'entre au journal avant « Confirmer et enregistrer l'observation » |
| 3–4 min | Déclarer « Retrait de feuilles ou de plants » → vérifier → « Confirmer : je l'ai fait » → « Faire l'observation de suivi » → « C'est stable », continuer à suivre | Date future refusée ; lien avec le problème ; « une amélioration ne prouve pas que l'action en est la cause » ; le cas revient en tête de « Ma campagne » |
| 4–5 min | Journal, puis Bilan ; « Demander » : « Combien d'engrais dois-je mettre ? » puis une question hors sujet | Faits déclarés sans causalité ; refus explicite de dose ; réponse « hors scénario » |
| Facultatif | « Noter une observation » → « Prêt à récolter » | Contradiction à clarifier par la personne : corriger la date (le plan est recalé, les opérations restent), corriger l'observation, ou « je vérifierai » |

« Recommencer » (bandeau) revient au début. Vérification : `npm run test:prototype` (serveur isolé sur 5177).

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
