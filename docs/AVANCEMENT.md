# État d'avancement de la reconstruction

Branche de travail : `refonte/fondations`. Archive du prototype : `archive/prototype-2026-10-11` (`fba4f93`).

Légende des niveaux de preuve, à ne pas confondre :

- **Implémenté** : le code existe.
- **Vérifié** : un test ou un scénario exécuté l'a constaté, avec la commande indiquée.
- **Validé par un spécialiste** : un conseiller ou un agronome a relu le contenu. *Aucun contenu ne l'est à ce jour.*
- **Utilité démontrée** : constatée avec de vrais utilisateurs. *Rien ne l'est à ce jour.*

| Brique | Statut | Preuve |
|---|---|---|
| 0 — Préserver et établir la base | Terminée | Ci-dessous |
| 1 — Socle exécutable | Terminée | Ci-dessous |
| 2 — Identité, projet, campagne | Terminée | Ci-dessous |
| 3 — Vérifications et plan d'action | À faire | |
| 4 — Budget transparent | À faire | |
| 5 — Conseiller, relecture, synthèse | À faire | |
| 6 — Parcours complet et polissage | À faire | |
| 7 — Recette et passation | À faire | |

## Brique 0 — Préserver et établir la base (11/10/2026)

**Fonctionne :**

- L'état récupérable existe : commit `fba4f93`. Il contient 24 fichiers modifiés et 26 entrées non suivies (dont `docs/`, `ROADMAP.md`, les nouvelles pages), ainsi que les suppressions présentes dans le dossier de travail. Après le commit, `git status` était vide.
- Les secrets ignorés ont été déplacés dans `.local-archive/prototype/` (ignoré par Git). `dist/` et `node_modules/` ont été supprimés.
- L'ancien code est retiré de la branche de refonte. L'inventaire est dans [INVENTAIRE.md](INVENTAIRE.md).

**Vérifications exécutées :**

- Recherche des 13 valeurs secrètes des `.env` dans tout l'historique Git et dans les fichiers à archiver ; seuls les noms de variables ont été affichés. Résultat : clés OpenWeather et Agromonitoring présentes dans l'historique public. Aucune valeur secrète dans les fichiers archivés.
- Liste des fichiers ignorés avant le commit : `.env`, `api/.env`, `api/api.log`, `dist/`, `node_modules/` (exclus comme prévu).

**Reste incomplet :** révocation des clés chez les fournisseurs (action externe, voir [SECURITE.md](SECURITE.md) §3).

**Décisions :** archive sur une branche plutôt qu'un stash, plus visible et poussable sur demande. Pas de réécriture de l'historique (non autorisée).

## Brique 1 — Socle exécutable et reproductible (11/10/2026)

**Fonctionne :**

- `backend/` : Django 5.2 + DRF + PostgreSQL. Modèle de compte personnalisé (email comme identifiant, indicateur conseiller), hachage Argon2, sessions serveur, CSRF, erreurs JSON uniformes (`{"error": {code, message, fields}}`), transaction par requête.
- Configuration lue dans l'environnement. Une clé secrète absente, trop courte ou égale à l'exemple, un booléen invalide ou des hôtes manquants en production arrêtent le démarrage.
- `/api/health` interroge réellement la base et l'état des migrations : 200 seulement si tout est à jour, 503 sinon.
- Base injoignable : 503 explicite sur toute route `/api/`, jamais un faux « ok ».
- `frontend/` : Vite + React + Tailwind, client API commun (CSRF, erreurs réseau distinguées, identifiants de requête stables pour les reprises).
- `scripts/dev.py` : base locale, `.env`, sauvegarde/restauration, contrôles, serveur de parcours.
- CI GitHub Actions écrite (`.github/workflows/ci.yml`), **non exécutée** : aucun envoi vers GitHub n'a été fait.

**Vérifications exécutées :**

| Vérification | Résultat |
|---|---|
| Installation Python dans un environnement vierge depuis `requirements-dev.txt`, puis `pip check` et pytest | OK, 8/8 tests (avant l'ajout du 9e) |
| `npm ci` après suppression de `node_modules` | 179 paquets installés |
| `python scripts/dev.py check --e2e` | Tout passe : ruff, format, migrations à jour, pytest 9/9, eslint, tsc, build, Playwright 2/2 (ordinateur, téléphone) |
| Cycle `db-init` (idempotent) / `db-stop` / `db-start` / `db-status` | OK |

**Reste incomplet :** CI non exécutée ; admin Django non servi hors mode développement (aucun déploiement prévu) ; sauvegarde/restauration écrites mais testées en brique 7.

**Décisions :** D-016 à D-020, D-006 en partie ([DECISIONS.md](DECISIONS.md)).

## Brique 2 — Identité, projet et campagne (11/10/2026)

**Fonctionne :**

- Inscription, connexion et déconnexion par session Django. CSRF imposé à toute écriture, y compris la connexion. 10 tentatives par minute et par adresse IP. Message identique, que le compte existe ou non.
- Création d'un projet et de sa première campagne en une seule transaction ; ajout d'une autre campagne à un projet existant.
- 11 informations (12 pour un producteur actif) : localisation, accès au terrain, eau, culture et période envisagées, temps, main-d'œuvre, matériel, somme disponible, débouchés, expérience (et changements envisagés). Chacune a un état, une source et un historique complet.
- Interface : Connexion, Inscription, Aujourd'hui (information à compléter), Mon projet (éléments connus par section), fiche d'information (formulaire, historique), Mes dossiers, Aide.

**Vérifications exécutées :**

| Vérification | Résultat |
|---|---|
| `pytest` (backend) | 45/45 : comptes (CSRF, limite de tentatives, mot de passe faible, compte désactivé, inscription fermée) ; dossiers (états, validation, conflit 409, reprise sans doublon, historique) ; permissions (autre compte 404, conseiller non attribué 404, attribué en lecture seule 403, attribution close, administrateur sans accès, dossier archivé) |
| Persistance au redémarrage | Test `test_les_donnees_survivent_a_un_nouveau_processus_serveur` : écriture par l'API, relecture par un autre processus Python |
| Playwright, 8/8 (ordinateur et téléphone) | Parcours débutant complet avec reconnexion ; refus d'un « vérifié » sans source, saisie conservée ; coupure réseau avec réponse perdue : pas de faux succès, saisie conservée, une seule révision après reprise ; un autre compte voit « Dossier introuvable » |

**Reste incomplet :** pas de récupération de mot de passe (pas d'envoi d'email configuré ; réinitialisation possible par l'administration) ; le navigateur affiche « Mon plan » seulement à partir de la brique 3.

**Décisions :** D-021 à D-024.
