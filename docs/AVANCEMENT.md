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
| 5 — Conseiller, relecture, synthèse | Terminée | Ci-dessous |
| 6 — Parcours complet et polissage | Terminée | Ci-dessous |
| 7 — Recette et passation | Terminée | Ci-dessous |

## Brique 0 — Préserver et établir la base (11/10/2026)

**Fonctionne :**

- L'état récupérable existe : commit `fba4f93`. Il contient 24 fichiers modifiés et 26 entrées non suivies (dont `docs/`, `ROADMAP.md`, les nouvelles pages), ainsi que les suppressions présentes dans le dossier de travail. Après le commit, `git status` était vide.
- Les secrets ignorés ont été déplacés dans `.local-archive/prototype/` (ignoré par Git). `dist/` et `node_modules/` ont été supprimés.
- L'ancien code est retiré de la branche de refonte. L'inventaire est dans [INVENTAIRE.md](INVENTAIRE.md).

**Vérifications exécutées :**

- Recherche des 13 valeurs secrètes des `.env` dans tout l'historique Git et dans les fichiers à archiver ; seuls les noms de variables ont été affichés. Résultat : clés OpenWeather et Agromonitoring présentes dans l'historique public. Aucune valeur secrète dans les fichiers archivés.
- Liste des fichiers ignorés avant le commit : `.env`, `api/.env`, `api/api.log`, `dist/`, `node_modules/` (exclus comme prévu).

**Reste incomplet :** révocation des clés chez les fournisseurs (action externe, voir [SECURITE.md](SECURITE.md) §2).

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

## Brique 5 — Conseiller, relecture et synthèse (11/10/2026)

**Fonctionne :**

- Attribution explicite d'un dossier à un conseiller (commande `assign_advisor` ou administration), clôture traçable.
- Demande de relecture par le porteur. Avis du conseiller : auteur, date, périmètre (contexte, plan, budget), versions examinées, conclusion, réserves (obligatoires si « avec réserves »), instantané consultable. Avis refusé si le dossier a changé depuis la lecture ; avis « à réexaminer » après toute modification d'une section relue.
- Questions et commentaires, rattachés au dossier, à une information, à une démarche ou à un poste de budget ; réponses ; résolution des questions.
- Décisions (poursuivre, modifier, différer), motifs obligatoires. Archivage (lecture seule ensuite).
- Statut du dossier calculé, affiché sur l'accueil et dans « Mes dossiers » ; pour le conseiller, demandes et questions en attente.
- Écrans : Relecture et échanges ; Synthèse imprimable et téléchargeable ; carte « Dernier retour du conseiller » sur l'accueil ; liens « Poser une question » depuis une information, une démarche ou un poste.
- Sans conseiller attribué : « Aucun conseiller n'est attribué », sans avis ni disponibilité inventés.

**Vérifications exécutées :**

| Vérification | Résultat |
|---|---|
| `pytest` | 145/145, dont 22 pour la brique 5 : absence de conseiller, conseiller limité à ses dossiers, porteur et conseiller non attribué sans droit d'avis, attribution close, avis traçable avec instantané, réserves obligatoires, périmètre vide refusé, avis refusé si le dossier a changé pendant la lecture, avis à réexaminer sans effacement, modification hors périmètre sans effet, reprise sans doublon, statuts successifs, question liée à une démarche avec réponse et résolution, cible d'un autre dossier refusée, décision « différer » et archivage, synthèse fidèle (inconnues, budget incomplet, réserves, contenu non relu), export à accès contrôlé, commande `assign_advisor` |
| Playwright | 16/16 (ordinateur et téléphone), dont le parcours porteur + conseiller complet et la connexion sans cookie CSRF préalable |
| `python scripts/dev.py check --e2e` | Tout passe |

**Défaut trouvé et corrigé :** connexion refusée (403 CSRF) si elle était envoyée avant l'arrivée du cookie. Corrigé côté client (D-033) et couvert par un parcours.

**Reste incomplet :** aucune notification (email ou SMS) : le conseiller voit ses demandes en se connectant ; pas de PDF généré par le serveur (impression du navigateur).

**Décisions :** D-030 à D-034.

## Brique 6 — Parcours complet et polissage (11/10/2026)

**Fonctionne :**

- Accueil conforme au cahier des charges : prochaine démarche, points bloquants, état du dossier, dernier retour du conseiller (ou absence de conseiller), budget.
- Titre d'onglet par page ; focus sur le contenu après navigation ; lien d'évitement ; bandeau hors connexion ; message actionnable en cas de session expirée ; message exact en cas de mauvais mot de passe.
- Niveaux de titres corrigés sur la synthèse (seule remarque d'axe, modérée).

**Vérifications exécutées :**

| Vérification | Résultat |
|---|---|
| axe-core sur 14 écrans (dont un dossier rempli), largeur 360 px | Aucune violation grave ou critique ; aucun défilement horizontal. Sur 8 écrans, toutes catégories confondues : une seule remarque modérée (ordre des titres), corrigée |
| Clavier seul (ordinateur) | Lien d'évitement, connexion, choix d'un état, enregistrement, focus après navigation : OK |
| Hors connexion réel (`setOffline`) | Bandeau, échec immédiat et explicite, saisie conservée, reprise au retour du réseau : OK |
| Session expirée pendant une saisie | Message clair, saisie conservée, reconnexion dans un autre onglet, enregistrement réussi : OK |
| `python scripts/dev.py check --e2e` | Tout passe : 145 tests pytest, 25 parcours Playwright (et 1 ignoré volontairement : le clavier physique sur téléphone) |

**Défauts trouvés et corrigés :** mise en pause silencieuse des écritures hors ligne, puis renvoi automatique (D-035) ; message de connexion erroné (D-036) ; focus mal placé au premier affichage en développement (effet exécuté deux fois en mode strict).

**Reste incomplet :** aucun essai avec des utilisateurs réels, un lecteur d'écran ou une connexion lente représentative du terrain ; pas de mode hors connexion (non promis).

**Décisions :** D-035 à D-037. Guide d'interface réécrit : [INTERFACE.md](INTERFACE.md).

## Brique 7 — Recette et passation (11/10/2026)

**Ajouté pendant la recette :** préparation d'une nouvelle campagne pour un projet existant (scénario « exploitant »), avec reprise facultative des informations du lieu, à revérifier (D-038). Script `scripts/recette.py` : redémarrage et restauration en conditions réelles.

### Rapport de recette — scénarios du cahier des charges

Tous les scénarios ont été exécutés le 11/10/2026 sur le poste de développement (Windows 11, PostgreSQL 18, Chrome). Ce sont des **tests logiciels** : ils ne valent ni validation terrain ni preuve d'utilité.

| # | Scénario | Preuves exécutées | Résultat |
|---|---|---|---|
| 1 | Débutant avec informations manquantes | Parcours `dossier.spec` (débutant, « je ne sais pas », reconnexion) et `plan.spec` (inconnue → point expliqué → démarche) ; tests `test_information_inconnue_produit_une_verification_expliquee_et_une_demarche`, `test_je_ne_sais_pas_est_enregistre_sans_valeur` | OK |
| 2 | Exploitant préparant une nouvelle campagne | Parcours `recette.spec` (profil producteur, nouvelle campagne, lieu repris « à revérifier », campagne précédente intacte) ; tests `test_nouvelle_campagne_reprend_le_lieu_a_reverifier_sans_resultats`, `test_copie_depuis_une_campagne_d_un_autre_projet_refusee` | OK |
| 3 | Compte non autorisé | Tests de permissions de chaque module (dossier, plan, budget, relecture, export : 404) ; parcours « un autre compte ne peut pas ouvrir le dossier » et refus d'export à un tiers | OK |
| 4 | Conseiller non attribué | Tests `test_conseiller_non_attribue_ne_voit_rien`, `test_conseiller_voit_uniquement_ses_dossiers`, `test_attribution_close_*` ; parcours `recette.spec` (liste vide, accès direct et API refusés) | OK |
| 5 | Budget incomplet | 53 tests du budget ; parcours `budget.spec` (« Budget incomplet… ce n'est pas le coût total ») ; synthèse avec statut « incomplet » | OK |
| 6 | Contexte modifié après relecture | Tests `test_modification_apres_avis_le_rend_a_reexaminer_sans_l_effacer`, `test_avis_refuse_si_le_dossier_a_change_depuis_la_lecture` ; parcours `relecture.spec` (« À réexaminer », instantané consultable) | OK |
| 7 | Erreur réseau | Réponse perdue puis reprise sans doublon (information, poste de budget) ; hors connexion réel ; session expirée ; refus CSRF transitoire | OK |
| 8 | Redémarrage | `scripts/recette.py` : arrêt complet puis relance du serveur, données identiques par HTTP ; test de relecture par un autre processus | OK |
| 9 | Export contrôlé | Test `test_export_telechargeable_a_acces_controle` (porteur et conseiller attribué : 200, autre compte : 404, `no-store`) ; parcours `relecture.spec` | OK |
| 10 | Restauration d'une sauvegarde | `scripts/recette.py` : `pg_dump` → modification → `pg_restore` dans une base neuve → serveur démarré dessus : état sauvegardé retrouvé, modification postérieure absente. Commandes `dev.py db-backup` / `db-restore` vérifiées, avec refus d'écraser la base de travail sans `--replace` | OK |

### Dernière exécution complète

| Commande | Résultat |
|---|---|
| `python scripts/dev.py check --e2e` | ruff, format, migrations à jour, **147 tests pytest**, eslint, TypeScript, build : OK. Playwright : **29 exécutions réussies** (15 scénarios × 2 vues ; 1 ignorée volontairement : le clavier physique sur téléphone) |
| `python scripts/recette.py` | Redémarrage, restauration, session et CSRF par HTTP réel : OK |

### Passation

- Point d'entrée : [README](../README.md) ; installation et commandes vérifiées : [DEMARRAGE.md](DEMARRAGE.md) ; fonctionnement : [ARCHITECTURE.md](ARCHITECTURE.md) et [INTERFACE.md](INTERFACE.md).
- Commits relisibles, un par brique, sur `refonte/fondations` ; rien n'a été poussé ni déployé.

### Limites restantes (à traiter avant un pilote)

1. **Révocation des clés** exposées : action externe du titulaire des comptes ([SECURITE.md](SECURITE.md) §2).
2. **Contenu non relu** : le modèle de préparation doit être relu par un conseiller, puis publié en v2 avec relecteur et date.
3. **Hébergement non décidé** (D-006) : HTTPS, sauvegardes automatiques, cache partagé pour la limite de tentatives ([SECURITE.md](SECURITE.md) §5).
4. **Aucune validation terrain** : enquête G1, choix de zone, culture et conseiller, consentement et conservation des données.
5. Fonctions absentes, non promises : notifications, récupération de mot de passe par email, mode hors connexion, langues autres que le français.
6. CI GitHub écrite mais jamais exécutée (aucun envoi vers GitHub n'a été fait).

---

# Préparation du pilote terrain (à partir du 11/10/2026)

Ces lots ne modifient pas le périmètre fonctionnel. Ils sécurisent l'environnement et préparent le terrain. **Aucune validation terrain ni mise en service n'est réalisée.**

## Lot 1 — Sécuriser les conditions de travail (11/10/2026)

- `scripts/verifier_secrets.py` analyse les fichiers suivis, toutes les branches locales et distantes récupérées, le build et, en option, l'historique. Il n'affiche jamais une valeur.
- Résultat : branche courante et build sans secret. Clés OpenWeather et Agromonitoring présentes dans la **version actuelle** de `lib/config.ts` sur `origin/master` (branche publique par défaut), en plus de l'historique.
- Aucune révocation confirmée par le propriétaire. Actions restantes : [SECURITE.md](SECURITE.md) §2.

## Lot 2 — Runtime Python 3.12 (11/10/2026)

| Vérification (avec `backend/.venv` en Python 3.12.10) | Résultat |
|---|---|
| Installation de Python 3.12.10 (installateur python.org, signature PSF vérifiée, utilisateur seul, sans élévation) | OK |
| `pip install -r requirements-dev.txt` puis `pip check` | OK ; mêmes versions qu'en 3.10, hors `exceptiongroup` et `tomli` (inutiles en 3.12) |
| `scripts/dev.py check --e2e` | ruff, format, migrations, **147 pytest**, eslint, TypeScript, build : OK ; Playwright **29 réussis**, 1 ignoré (clavier sur téléphone) |
| `scripts/recette.py` | Redémarrage, restauration, session et CSRF par HTTP : OK ; bases dédiées supprimées, base de travail intacte |
| Refus d'un Python 3.10 (scripts et `django.setup()`) | Message explicite, arrêt |

Obstacles rencontrés et levés : l'installateur attendait une élévation UAC pour le lanceur `py.exe` global (installation relancée sans ce lanceur) ; Git Bash convertissait `/quiet` en chemin (installateur relancé depuis PowerShell) ; `cmd.exe` refusait le chemin relatif du Python dans la configuration Playwright (chemin absolu).

Retour arrière possible : `backend/.venv-py310` conservé jusqu'à validation par le propriétaire ([DEMARRAGE.md](DEMARRAGE.md)). CI GitHub : configurée sur 3.12, **non exécutée**.

## Lot 3 — Préparer la vérification distante (11/10/2026)

- CI : actions passées de v4/v5 (exécutées sous Node 20, en fin de vie depuis avril 2026) à v6 (Node 24, version éprouvée) ; droits en lecture seule ; délais maximaux par job ; analyse des motifs de secrets ajoutée au job backend. YAML validé localement.
- Cohérence avec le local : mêmes contrôles que `scripts/dev.py check --e2e`. Aucune base de travail ni aucun secret métier n'est nécessaire (147 tests réussis avec une base de travail inexistante ; aucun secret GitHub référencé).
- Résumé de PR : [RESUME_PR.md](RESUME_PR.md). **CI distante non exécutée.**

## Lot 4 — Kit G1 (11/10/2026) — préparé, non exécuté

- [VALIDATION_TERRAIN.md](VALIDATION_TERRAIN.md) §0–6 : règles (données privées hors dépôt, consentement, pas de présentation du produit avant la fin de l'entretien), critères de recrutement (débutant, producteur, conseiller), canaux possibles (non engagés), brouillons de contact à envoyer par le fondateur, guide d'entretien participant et variante conseiller, fiche d'entretien, fiche de décision de fin de G1 (toutes valeurs « à déterminer »).
- Modèle vierge de tableau de suivi : `docs/terrain/suivi-recrutement-modele.csv` ; `terrain-prive/` et `*.prive.*` ignorés par Git (vérifié avec `git check-ignore`).
- [MARCHE_SENEGAL.md](MARCHE_SENEGAL.md) : 7 repères datés (ANCAR, ISRA/CDH, ANIDA, CNCR, DER/FJ, mLouma, FAO), avec la source, le fait établi et les incertitudes. Site officiel de la DER/FJ inaccessible ; activité actuelle de mLouma non établie. Aucun partenaire supposé.
- Aucun contact n'a été pris, aucun entretien réalisé.

## Lot 5 — Protocole G2 (11/10/2026) — préparé, non exécuté

- [VALIDATION_TERRAIN.md](VALIDATION_TERRAIN.md) §7–10 : conditions d'entrée issues de G1, relecture et publication du contenu, rôles, durée et plafonds (à fixer), trois modes de données (accès à distance bloqué), pratique initiale de comparaison, critères de suite, indicateurs avec définitions (intérêt verbal, engagement écrit et paiement distingués), économie du service.
- Versionnement du contenu **vérifié par un test** : une v2 relue ne touche pas les dossiers existants (règles, statut « non relu », démarches et historique conservés) et s'applique aux nouveaux dossiers. Aucune migration automatique. Décisions D-041 et D-042.

## Lot 6 — Documentation alignée et transmission (11/10/2026)

- README et ROADMAP distinguent : fondations livrées, contrôles exécutés en local, CI distante non exécutée, préparation du terrain prête, validation terrain non réalisée, mise en service non réalisée. La roadmap donne pour chaque étape (E1 à E10) l'objectif, le responsable, les dépendances, la preuve attendue et la condition de sortie, ainsi que la liste des idées différées.
- Consignes devenues fausses corrigées : cible « confirmée » devenue « retenue, à comparer » (STRATEGIE), renvois vers SECURITE §2, plan de refonte marqué comme historique.
- **Défaut documentaire corrigé :** 5 sections de DECISIONS.md (décisions à ne pas rouvrir, registre des inconnues, historique du changement de cap, format de décision, revue) avaient été supprimées par erreur lors de la brique 2 (`bae79c1`). Elles sont restaurées, avec un registre des inconnues à jour. Aucun autre document n'est touché (titres de section comparés à l'archive).

### Contrôles finaux (11/10/2026, Python 3.12.10)

| Commande | Résultat |
|---|---|
| `backend\.venv\Scripts\python scripts\dev.py check --e2e` | ruff, format, migrations à jour, **148 pytest**, eslint, TypeScript, build ; Playwright **29 réussis**, 1 ignoré (clavier sur téléphone) |
| `backend\.venv\Scripts\python scripts\recette.py` | Redémarrage, restauration, session et CSRF par HTTP : OK |
| `backend\.venv\Scripts\python scripts\verifier_secrets.py` (après build) | Aucun secret détecté avec les valeurs connues et motifs du scanner dans les fichiers suivis, la branche courante et le build ; ne garantit pas l'absence de secrets inconnus |

**Ce n'est pas un état « prêt pour le pilote »** : voir les étapes E1 à E10 de la [roadmap](../ROADMAP.md).

## Corrections après revue (11/10/2026)

- Scanner : toutes les valeurs homonymes sont conservées, entre fichiers de même nom et entre lignes d'un même fichier. Trois tests couvrent cette régression, les codes de sortie et l'absence de valeurs dans les rapports. La conclusion porte sur le périmètre bloquant ; les autres branches et l'historique sont signalés séparément. Les limites sont explicites dans SECURITE.
- Runtime : **Python 3.14.8** installé pour le compte Windows courant, sans modifier le PATH ni le lanceur. Installateur python.org, signature PSF valide et SHA-256 comparé à la publication officielle. Environnement neuf `backend/.venv`, dépendances applicatives conservées ; `pip check` réussi. Ancien environnement conservé en `.venv-py312`, en plus de `.venv-py310`, tous deux ignorés par Git.
- Serveur, scripts et métadonnées exigent au minimum 3.14.8. La CI est configurée sur cette version ; le job frontend analyse également son build après compilation. **Aucune exécution distante** n'est revendiquée.
- Documentation : D-039 remplacé par D-043, suppression de la mention erronée « testé en CI ». Toutes les sections du registre ont été conservées (43 décisions). G1 peut avancer indépendamment de la fusion, de l'hébergement et du nettoyage des anciens environnements. Les plafonds de G1 sont fixés avant les contacts ; ceux de G2 avant les dossiers accompagnés.

### Vérifications sur Python 3.14.8

| Contrôle | Résultat |
|---|---|
| Backend : migrations, pytest | Pas de migration manquante ; **151 tests réussis**, dont les 3 tests du scanner |
| Frontend : ESLint, TypeScript, build | Réussis |
| Playwright (via `dev.py check --e2e`) | **29 réussis**, 1 ignoré intentionnellement (clavier physique sur téléphone) |
| Ruff : lint et format sur backend et scripts | Réussis après correction d'une ligne trop longue |
| `scripts/recette.py` | Redémarrage, sauvegarde puis restauration : état conservé, modification postérieure absente après restauration |
| `scripts/verifier_secrets.py --historique` | Aucun secret détecté dans le périmètre bloquant avec les valeurs connues et motifs définis ; clés historiques et autres branches toujours signalées, sans afficher leurs valeurs |
| Test ciblé du scanner après clarification finale du rapport | 3 réussis ; lint et format réussis |

Le lancement global initial de `check --e2e` a renvoyé un code 1 pour le lint/format d'une ligne du message de version Python. Cette ligne a été reformattée ; les contrôles Ruff complets ont ensuite été relancés et réussis. Les 151 tests backend et les 29 parcours navigateur de ce lancement ont réussi. Aucun échec fonctionnel n'a été observé pendant ces contrôles.

La base de travail n'a pas été réinitialisée. Aucun secret révoqué par l'agent, aucun contact externe, aucun entretien, aucun push ni déploiement. Révocations par le propriétaire et démarrage de G1 restent à effectuer ; le pilote G2 reste conditionné aux preuves prévues dans la roadmap.

## Revue de complétude technique (12/10/2026)

**Conclusion au moment de la revue : socle fonctionnel testé, clôture de la version locale encore ouverte.** *Mise à jour : clôture réalisée le 12/10/2026, voir « Clôture de la version locale » ci-dessous.* Cette revue ciblée ne constitue pas un audit exhaustif. Elle distingue les défauts reproduits, les écarts de produit constatés dans le code, les limites volontaires du pilote et les conditions de mise en service. La priorité demandée par le fondateur est la finition technique, avant les prises de contact.

### Constats à traiter ou à arbitrer

| ID | Constat et preuve | Conséquence et critère de fermeture |
|---|---|---|
| T-01 | **Reproduit au navigateur** : créer un projet, ouvrir « Culture envisagée », choisir « Déclaré », saisir « Oignon » sans enregistrer, cliquer « Mon plan », puis revenir. La saisie est vide, sans avertissement. `FactEditPage.tsx` conserve le formulaire dans l'état du composant ; aucune protection de navigation n'est présente. | Finition UX manquante, distincte de la reprise après erreur réseau déjà testée. Protéger les modifications non enregistrées par un mécanisme cohérent, puis vérifier navigation interne, retour navigateur et rechargement. Ne pas annoncer une sauvegarde serveur pour un simple brouillon local. Examiner aussi budget, démarches et échanges. |
| T-02 | **Reproduit au navigateur** : déclarer l'eau inconnue, archiver depuis la synthèse, revenir à « Aujourd'hui ». Le bandeau « archivé » coexiste avec « Ma prochaine action — Identifier une source d'eau utilisable ». `TodayPage.tsx` conditionne cette carte au rôle porteur, sans tenir compte de l'archivage. | Affichage incohérent, sans contournement des permissions observé. Présenter l'archive comme consultation ; conserver l'historique et l'accès aux éléments sans suggérer une prochaine étape exécutable dans ce dossier. Vérifier aussi l'état différé et le choix de campagne à l'accueil. |
| T-03 | **Constaté dans le code, à arbitrer avec le cahier des charges** : la différence de profil porte surtout sur les libellés, l'expérience, le champ « Changements envisagés » et la reprise de campagne. Les explications des démarches sont communes. Pourtant PRODUIT §2 et le champ expérience annoncent une adaptation des explications. | Définir et démontrer le niveau d'accompagnement attendu : explications d'initiation accessibles au débutant, parcours direct pour le producteur, sans double moteur métier ni prescription inventée. Adapter l'interface ou préciser honnêtement la promesse si la distinction actuelle suffit au périmètre retenu. |
| T-04 | **Limite volontaire** : pas de récupération autonome de mot de passe ; attribution du conseiller par administration ou commande (D-024, D-034). | Acceptable pour une version locale accompagnée si le processus d'exploitation est démontré et documenté. À traiter avant un accès autonome si ce mode est choisi ; ne pas ajouter automatiquement email, SMS ou annuaire. |
| T-05 | **Preuve distante absente** : CI GitHub jamais exécutée ; aucun environnement hébergé validé. | N'empêche pas une recette locale. Empêche de qualifier l'application de prête pour la mise en service. Dépendances et contrôles décrits dans SECURITE ; aucun push ni déploiement autorisé par cette revue. |

### Vérifications réalisées pendant cette revue

- Lecture du cahier des charges, des routes, formulaires, parcours de relecture, du moteur de préparation et des limites documentées.
- Deux reproductions ciblées avec Playwright/Chrome sur la base dédiée `agria_e2e`, via les serveurs de test existants. T-01 et T-02 confirmés ; elles ne constituent pas des tests de non-régression des comportements souhaités.
- Inspection d'une capture de l'accueil archivé à 390 px. Capture locale ignorée : `.local-archive/revue-technique-2026-10-12/dossier-archive.png`.
- Le script temporaire de reproduction a été retiré ; aucune modification applicative ni correction de T-01/T-02 n'a été effectuée pendant cette revue. Suite complète non relancée : les changements conservés sont documentaires.
- Base de travail préservée, aucune prise de contact ni publication.

### Conditions de clôture de la version locale

1. Matrice F1–F6 : exigence, écran/API, preuve, écart, priorité et critère d'acceptation ; distinguer défaut, finition, limite volontaire et dépendance externe.
2. T-01/T-02 corrigés avec tests pertinents ; T-03 explicitement traité ou arbitré. Revue des parcours débutant, producteur et conseiller, états vides, erreurs, droits et dossiers archivés/différés.
3. Parcours complets observés au navigateur sur ordinateur et petit écran : création, préparation, budget, conseil, décision, synthèse et reprise de campagne. Vérifier les textes, la priorité de l'action proposée, les confirmations et les sorties d'erreur.
4. Un lancement final de `dev.py check --e2e` réussi sur la révision livrée, puis recette de redémarrage/restauration si les changements affectent la persistance ou les opérations. Pas de revendication de CI distante sans exécution réelle.
5. Démonstration reproductible pour le fondateur : données fictives identifiées, comptes et attribution conseiller préparés sans identifiants publiés, commandes de démarrage, étapes et limites connues.

Une clôture locale ne valide ni le contenu agronomique, ni l'utilité commerciale, ni l'hébergement. Elle donne une version démontrable et un périmètre explicite pour la suite.

## Clôture de la version locale (12/10/2026)

**Verdict : version locale finalisée et démontrable** pour un usage accompagné, sur le périmètre F1–F6. Cela ne vaut ni validation du contenu agronomique, ni utilité terrain démontrée, ni mise en service (voir les limites plus bas).

### Matrice de complétude F1–F6

Classes d'écart : **défaut** (fonctionnement), **finition** (parcours), **limite volontaire** (acceptable en usage accompagné), **dépendance externe**, **hors périmètre**.

| F | Exigence | Écran / API | Preuve | Écart constaté | Classe | Priorité | Critère de fermeture et état |
|---|---|---|---|---|---|---|---|
| F1 | Dossier persistant, « je ne sais pas », états, reprise, réutilisation par le producteur, droits | Nouveau projet, Mon projet, fiche d'information ; `/api/projects`, `/api/dossiers/{id}/informations` | `test_dossiers`, `dossier.spec`, `recette.spec`, `recette.py` | T-01 : saisie perdue sans avertissement en quittant la page | Finition | Haute | Confirmation avant toute navigation, retour du navigateur, déconnexion ; avertissement au rechargement ; aucun brouillon local. **Fermé** (`finition.spec`) |
| F1 | Isolation d'un dossier à l'autre | Mise en page du dossier | `recette.spec` | État d'un formulaire conservé d'un dossier à l'autre (formulaire « nouvelle campagne » resté ouvert) | Défaut | Haute | Pages réinitialisées à chaque dossier. **Fermé** (`recette.spec`, `finition.spec`) |
| F2 | Points à vérifier expliqués, pas de note universelle | Mon plan ; `/preparation` | `test_preparation`, `plan.spec` | T-03 : promesse d'explications adaptées au profil plus forte que le produit ; texte « Expérience » inexact | Finition | Moyenne | Présentation détaillée (débutant, conseiller) ou directe (producteur), même contenu, même moteur ; textes corrigés (D-047). **Fermé** (`finition.spec`) |
| F2 | Contenu relu pour la zone et la culture | Modèle `preparation-generique` | `test_publication_d_une_version_relue…` | Contenu non relu | Dépendance externe | — | Relecture par un spécialiste (ROADMAP E7). **Ouvert** |
| F3 | Démarches avec objectif, étapes, prérequis, statut, résultat | Mon plan, fiche démarche | `test_preparation`, `plan.spec` | T-02 : sur un dossier archivé, « Ma prochaine action » et « Poser une question » restaient proposés | Défaut | Haute | Accueil de consultation, liens d'action retirés, protections serveur inchangées. **Fermé** |
| F4 | Budget transparent | Budget provisoire ; `/budget` | `test_budget*`, `budget.spec` | Phrase « totalisent 0 FCFA » sans aucun poste chiffré ; « poste(s) » | Finition | Basse | Phrase exacte, pluriels accordés. **Fermé** |
| F5 | Conseiller attribué, questions, avis versionnés | Relecture ; `/relecture`, `/avis`, `/messages` | `test_relecture`, `relecture.spec` | T-04 : attribution et récupération de compte par l'exploitation, sans autonomie | Limite volontaire | — | Opérations démontrées : `create_account`, `assign_advisor`, `assist_account`. **Accepté** pour l'usage accompagné |
| F5 | Retours visibles | Accueil | `relecture.spec` | Libellé « Dernier retour du conseiller » affiché au conseiller lui-même | Finition | Basse | « Dernier avis donné » côté conseiller. **Fermé** |
| F6 | Statuts, décisions, synthèse, archivage | Accueil, Mes dossiers, Synthèse | `test_relecture`, `finition.spec` | Dossier différé non signalé ; dossier archivé rouvert automatiquement ; impossible de préparer la saison suivante depuis un projet archivé ; badges en double | Défaut et finition | Haute | Décision et motif à l'accueil ; archivés rangés à part ; nouvelle campagne possible depuis un projet archivé. **Fermé** |
| — | Preuve distante, hébergement | CI GitHub | — | T-05 : CI jamais exécutée, aucun environnement hébergé | Dépendance externe | — | Envoi et décision d'hébergement par le propriétaire (E3, E9). **Ouvert** |
| — | Hors connexion, notifications, PDF serveur | — | — | Absents | Hors périmètre ou limite volontaire | — | Liste des idées différées de la ROADMAP |

### Parcours réellement observés au navigateur

Script d'exploration temporaire (Chrome, captures hors dépôt, script supprimé après usage), en vues 1280 px et 390 px :

1. **Débutant :** création → eau inconnue → démarche → saisie non enregistrée puis navigation (boîte de confirmation) → budget avec un poste sans prix → question → demande de relecture → décision « différer » → synthèse → archivage → accueil de consultation → retour à l'accueil général.
2. **Producteur :** campagne précédente avec eau vérifiée → nouvelle campagne → eau reprise « déclarée », à revérifier → accueil et plan en vue directe.
3. **Conseiller :** attribution par `assign_advisor` → liste avec « relecture demandée » → accueil conseiller → avis avec réserves → modification par le porteur → avis « à réexaminer ».

L'inspection visuelle a révélé les finitions corrigées plus haut : pluriels, phrase de budget, libellés de navigation qui passaient sur deux lignes à 390 px, badges en double, libellé du conseiller. Les captures pleine page montrent la barre de navigation fixe au milieu de l'image : c'est un artefact de capture, pas un défaut.

### Démonstration

`dev.py demo-init` puis `demo-server` (base dédiée `agria_demo`) : trois comptes fictifs, connexion vérifiée au navigateur pour chacun en 1280 et 390 px. Opérations du mode accompagné démontrées : création de compte (`create_account`), attribution (`assign_advisor`), compte bloqué (`assist_account --status`, `--reset-password`, `--reactivate`). Procédure dans [DEMARRAGE.md](DEMARRAGE.md).

### Vérifications finales

| Commande (Python 3.14.8, révision `af39144`) | Résultat |
|---|---|
| `backend\.venv\Scripts\python scripts\dev.py check --e2e` | ruff, format, migrations à jour, **153 pytest**, eslint, TypeScript, build ; Playwright **43 réussis**, 1 ignoré (clavier physique sur téléphone) |
| `backend\.venv\Scripts\python scripts\recette.py` | Redémarrage, restauration, session et CSRF par HTTP : OK |

Nouveaux tests de non-régression : `e2e/finition.spec.ts` (T-01 navigation interne, retour du navigateur, fermeture et rechargement, budget, messages et déconnexion ; T-02 archivé et différé ; T-03 profils), `test_dossier_archive_expose_sa_date_et_reste_consultable`, `test_assistance_reinitialisation_et_reactivation`, test de démonstration élargi.

Commits : `0e816a7` (corrections), `af39144` (démonstration et assistance), puis la documentation.

### Limites restantes

- **Contenu agronomique : non validé** (aucune relecture par un spécialiste).
- **Utilité terrain : non démontrée** (aucun entretien ni dossier réel).
- **Mise en service : non réalisée** (CI distante jamais exécutée, aucun hébergement, révocations de clés non confirmées).
- Une saisie en cours est perdue si le navigateur se ferme malgré l'avertissement : aucun brouillon local, par choix (D-044).
- Pas de notification ni de récupération autonome du mot de passe : l'assistance passe par l'exploitation (D-024, D-034, D-046).
- La présentation détaillée ou directe dépend du profil du projet ; il n'existe pas de réglage individuel.

Les serveurs de développement lancés par le fondateur sur les ports 8000 et 5173 pendant cette mission n'ont pas été touchés. La démonstration a utilisé les ports 8002 et 5175.

# Parcours débutant (12/10/2026)

Mission : améliorer le parcours débutant à partir des difficultés observées à l'essai (créer un projet → premières informations → comprendre les vérifications → réaliser une démarche → actualiser le dossier → préparer le budget). Essais sur la base e2e et des données fictives uniquement ; la base de travail et le dossier d'essai du fondateur n'ont pas été touchés.

| Lot | Livré | Commit |
|---|---|---|
| 1. États vides et sens des statuts | Trois états distincts sur Mon plan (informations insuffisantes, points ouverts, rien de signalé par les règles disponibles, jamais une validation) ; « Vérifié (source indiquée) », jamais en vert ; ligne « Situation : point encore ouvert » sous une information, même vérifiée | `ceda138` |
| 2. Démarche terminée reliée à l'information | Issue obligatoire (favorable, défavorable, incertaine) ; carte « Et maintenant » et bouton « Mettre à jour : [information] » ; résultat rappelé pendant la mise à jour sans rien préremplir ; message de recalcul après l'enregistrement ; cas démarche personnelle, point disparu, archivé, conseiller (D-048) | `c31f935` |
| 3. Premiers pas du débutant | Page « Renseigner mon projet pas à pas » ; report local distinct de « Je ne sais pas » ; reprise sur les données enregistrées ; entrées depuis l'accueil, Mon projet et Mon plan ; producteur inchangé (D-049) | `6c8b83d` |
| 4. Premier budget guidé | Postes à examiner sans quantité ni prix, sans doublon (contrainte en base), « laisser de côté » réversible ; explication montant chiffré / à chiffrer / moyens / limites (D-050) | `7e4559d` |
| 5. Présentation et documentation | Action principale mise en avant (pas-à-pas, mise à jour), informations vides bloquantes regroupées à l'accueil, version du contenu repliée, plus de chemin de fichier dans la source affichée, radios de taille constante, message de démarche affiché avec l'état relu ; registre des décisions corrigé (D-043 Python, D-047 présentation par profil, lignes replacées dans le bon tableau) | ce lot |

### Ce qui est livré, vérifié, à valider

| Niveau | Contenu |
|---|---|
| **Vérifié techniquement** | Tests serveur et navigateur listés dans la recette ci-dessous |
| **À tester avec des utilisateurs** | Compréhension des statuts et de « Situation : point encore ouvert » ; utilité du pas-à-pas et du report ; lecture du message de recalcul ; usage réel des postes à examiner |
| **À relire par un spécialiste** | Ordre de saisie proposé ; liste et libellés des postes à examiner ; textes d'aide des issues |

Avant de relancer le serveur sur la base de travail : `manage.py migrate` (migrations `preparation 0002_issue_du_resultat`, `budget 0002_postes_a_examiner`).

### Recette (lot 6)

Tests ciblés ajoutés :

| Comportement | Preuve |
|---|---|
| Dossier vide : seules des informations à compléter, jamais « rien à signaler » | `test_dossier_vide_ne_signale_que_des_informations_a_completer` |
| Information vérifiée décrivant une situation non réglée : point toujours ouvert | `test_information_verifiee_decrivant_une_situation_non_reglee_reste_un_point_ouvert` |
| Issue obligatoire ; une démarche terminée (favorable, défavorable, incertaine) ne modifie jamais l'information | `test_terminer_exige_l_issue_du_resultat`, `test_demarche_terminee_ne_modifie_jamais_l_information` (3 issues) |
| Mise à jour explicite et recalcul ; démarche personnelle sans information liée | `test_actualisation_explicite_recalcule_le_point`, `test_demarche_personnelle_sans_information_liee`, `e2e/plan.spec.ts` (3 scénarios : incertain, favorable sans « vérifié » automatique puis point disparu, défavorable + démarche personnelle + vue conseiller + dossier archivé) |
| Pas-à-pas : reprise, report distinct de « Je ne sais pas », protection de saisie, focus ; producteur direct | `e2e/pas-a-pas.spec.ts` |
| Postes à examiner : sans prix ni quantité, sans doublon, retrait puis rajout, permissions et archive | 5 tests `test_poste_a_examiner_*` / `test_postes_a_examiner_*`, `e2e/budget.spec.ts` |
| Source du contenu sans chemin de fichier | assertion ajoutée dans `test_preparation` |
| Accessibilité et 360 px, page pas-à-pas comprise | `e2e/qualite.spec.ts` |

Parcours observé au navigateur (script temporaire supprimé après usage, captures hors dépôt, vues ordinateur 1280 px et téléphone Pixel 7, base `agria_e2e`, données fictives) : création du compte et du projet débutant → pas-à-pas (lieu déclaré, terrain « en discussion », eau remise à plus tard, culture « Je ne sais pas ») → déconnexion, reconnexion et reprise à « Période envisagée » → Mon projet et Mon plan → démarche « Confirmer l'accès au terrain » terminée avec un résultat incertain → « Mettre à jour : Accès au terrain » (résultat rappelé, rien de prérempli) → enregistrement : « Point encore ouvert » → budget partiel (deux postes à chiffrer, un laissé de côté) → synthèse (issue « incertain » affichée). Corrections issues de cette observation : radio « Vérifié » rétrécie, message « démarche terminée » affiché avant l'état relu, aide de l'issue « incertain » inexacte, titres « Mettre à jour » en double, informations vides répétées à l'accueil.

Parcours producteur (accès direct, pas de pas-à-pas imposé) et conseiller (lecture seule de la démarche, mise à jour réservée au porteur) : vérifiés par `pas-a-pas.spec`, `plan.spec`, `finition.spec` et `relecture.spec`.

| Commande (Python 3.14.8) | Résultat |
|---|---|
| `backend\.venv\Scripts\python scripts\dev.py check --e2e` | ruff, format, migrations à jour, **166 pytest**, eslint, TypeScript, build ; Playwright **53 réussis**, 1 ignoré (clavier physique sur téléphone) |
| `backend\.venv\Scripts\python scripts\recette.py` | Redémarrage, restauration, session et CSRF par HTTP : OK |

Un premier passage complet a échoué sur le test clavier (`parcours.spec`), qui tabulait avant l'affichage de la page de l'information ; il passait isolément. Le test attend désormais le titre et le formulaire ; le passage complet suivant est entièrement réussi.

### Limites restantes

- **Compréhension non testée avec de vrais utilisateurs** : statuts, « Situation : point encore ouvert », message de recalcul, pas-à-pas.
- **Ordre de saisie, liste des postes à examiner et aides des issues : non relus par un spécialiste.**
- Le report « à plus tard » et les postes « laissés de côté » sont propres au navigateur : ils ne suivent pas la personne sur un autre appareil (l'information reste simplement non renseignée).
- Les démarches terminées avant cette version n'ont pas d'issue enregistrée.
- Base de travail et base de démonstration **non migrées** pendant la mission : `manage.py migrate` (travail) et `dev.py demo-init --reset` (démonstration) restent à lancer par le fondateur.
