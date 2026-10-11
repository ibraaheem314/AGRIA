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
| 3 — Vérifications et plan d'action | Terminée | Ci-dessous |
| 4 — Budget transparent | Terminée | Ci-dessous |
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

## Brique 3 — Vérifications et plan d'action (11/10/2026)

**Fonctionne :**

- Modèle de contenu `preparation-generique` v1 : 12 vérifications, 14 démarches, source, périmètre (Sénégal, toutes zones et cultures), statut **non relu**. Chargement validé : références, prérequis sans cycle, « relu » impossible sans relecteur ni date.
- Points à vérifier calculés à trois niveaux : à compléter, à clarifier (inconnue ou valeur problématique, par ex. « aucune source d'eau »), à vérifier (déclaré ou estimé). Chacun porte une justification, son caractère bloquant ou non, et un lien vers l'information et la démarche.
- Démarches : objectif, explication, étapes, prérequis, origine, échéance facultative. États : à faire, en cours, bloquée (motif obligatoire), terminée (résultat et date obligatoires, date non future). Rouvrir est possible : le résultat reste dans l'historique. Ajout de démarches personnelles sans doublon.
- Écrans : Mon plan ; fiche de démarche ; Aujourd'hui avec prochaine action, points bloquants et compteurs (présentés comme une mesure d'avancement, pas de réussite).
- `seed_demo` : dossier fictif sur un compte dédié, signalé par un bandeau.

**Vérifications exécutées :**

| Vérification | Résultat |
|---|---|
| `pytest` (total backend) | 70/70, dont 25 pour la brique 3 : contenu incohérent refusé (6 cas), version publiée non modifiable, inconnue → vérification expliquée + démarche, valeur problématique, vérifié → plus de point, résultat et date obligatoires, motif de blocage, prérequis (refus puis succès), prérequis absent ignoré, contexte modifié sans perte ni doublon, réouverture, conflit et reprise, démarche personnelle idempotente, modèle figé par dossier, permissions (autre compte 404, conseiller en lecture seule 403), démonstration séparée |
| Playwright | 10/10 (ordinateur et téléphone), dont le parcours complet de la brique 3 |

**Reste incomplet :** le contenu n'est relu par aucun spécialiste ; aucune notification d'échéance ; un nouveau modèle ne se propage pas aux dossiers existants (choix volontaire, D-026).

**Décisions :** D-025 à D-027.

## Brique 4 — Budget transparent (11/10/2026)

**Fonctionne :**

- Postes : investissement ou dépense de campagne, libellé, quantité (3 décimales au plus, virgule acceptée), unité parmi 12, prix unitaire en FCFA entiers (« 15 000 » accepté), état du prix (connu, estimé, manquant), source, date, « déjà détenu », remarques.
- Règles en base : manquant ⇔ pas de prix ; « connu » ⇒ source et date ; « estimé » ⇒ source ; quantité > 0.
- Synthèse serveur : total des prix connus, des estimations, des postes chiffrés ; nombre de postes incomplets ; statut vide, incomplet, complet avec estimations ou complet ; même découpage par catégorie. La somme disponible du dossier est affichée à côté, sans conclusion.
- Retrait sans effacement, historique complet, reprise et conflit gérés comme pour les autres objets.
- Écran « Budget provisoire » (sous Mon projet), règles de calcul affichées, carte budget sur Mon projet et Aujourd'hui.

**Vérifications exécutées :**

| Vérification | Résultat |
|---|---|
| `pytest` | 123/123, dont 53 pour la brique 4. Calcul pur : 7 cas d'arrondi (dont 2,5 × 3 = 8 et 1,001 × 999 = 1 000, et de très grands montants sans dépassement), somme des montants arrondis, poste incomplet, estimations, poste détenu, budget vide, catégories, saisies valides et invalides. API : 11 refus avec le champ fautif, reprise sans doublon, conflit, retrait historisé, poste retiré non modifiable, permissions |
| Playwright | 12/12 (ordinateur et téléphone). Parcours budget : refus d'un prix connu sans date (saisie conservée), réponse perdue puis reprise (un seul poste), phrase « Budget incomplet… ce n'est pas le coût total », retrait visible dans l'historique |
| `python scripts/dev.py check --e2e` | Tout passe |

**Reste incomplet :** pas de conversion entre unités (chaque prix est exprimé par l'unité de son poste) ; pas d'import de devis ni de pièce jointe ; pas d'hypothèses de recettes (hors périmètre de la version initiale).

**Décisions :** D-028, D-029.
