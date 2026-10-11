# Registre des décisions

Mise à jour : 11 octobre 2026, après clarification de la cible par le fondateur.

Ce registre distingue le cap convenu, les recommandations d'architecture et les choix encore ouverts. Une décision documentaire n'est pas une correction livrée.

## Décisions

| ID | Statut | Décision ou question | Motif / condition de révision |
|---|---|---|---|
| D-001 | Acté | Sénégal comme premier marché | Instruction du fondateur ; expansion ultérieure après preuve locale |
| D-002 | Acté | Un problème, une filière, un territoire et un client pour le premier pilote | Réduire la dispersion du prototype généraliste |
| D-003 | Supersédé | Ancien choix H1 irrigation ou H2 conservation | Remplacé par D-012 à D-014 : clarifier le parcours client avant la solution technique |
| D-004 | Acté | Reporter le développement des fonctionnalités généralistes | Priorité à l'enquête et à la boucle du pilote |
| D-005 | Acté (précisé par D-016) | Réutiliser React/Vite/TypeScript ; garder Python pour le serveur et l'analyse | Pas de migration Next.js ; le framework Python retenu est justifié en D-016 |
| D-006 | Partiellement tranché (11/10/2026) | Authentification : module d'authentification de Django (sessions serveur, Argon2, CSRF), auto-hébergé. Stockage : PostgreSQL. **Hébergement : ouvert** | Un fournisseur géré (Supabase, Auth0…) exigeait un compte externe et ne fonctionne pas hors ligne en développement. L'authentification Django est éprouvée et ne demande aucun code de mot de passe maison. Hébergement à décider avant tout usage partagé |
| D-007 | Acté | Capteurs éventuels et laboratoire limité ; aucun achat de flotte engagé | La mesure doit améliorer une décision ou la vérification du résultat |
| D-008 | Acté | Recommandations explicables, validation humaine au pilote | Pas de LLM décisionnaire ni d'actionneur automatique au lancement |
| D-009 | Acté | Distinguer démonstration, mesure, estimation et résultat prouvé | Corriger les faux succès et les allégations non documentées |
| D-010 | Livré — documentation | Remplacer les cinq anciens guides et créer les références produit/techniques | Ne vaut pas réalisation des tâches T0 à T8 |
| D-011 | Ouvert | Date J0, disponibilités et plafonds financiers | À renseigner avant engagement d'un calendrier et de dépenses |
| D-012 | Confirmé par le fondateur | Débutants avec projet concret ET producteurs actifs peu accompagnés dans la vision | Deux entrées possibles, aucun choix automatique de deux produits |
| D-013 | Proposition de produit | Préparation accompagnée d'une campagne ; six fonctions F1–F6 | À éprouver en G1/G2 ; suivi complet, météo et capteurs différés |
| D-014 | Ouvert | Zone, culture, groupe prioritaire et canal du premier pilote | Maraîchage candidat ; ne pas choisir une culture ou servir les deux groupes sans preuve |
| D-015 | Livré — documentation | Cahier des charges et réalignement des références sur D-012/D-013 | Aucun changement applicatif ni validation commerciale implicite |
| D-016 | Acté (11/10/2026) | Backend **Django 5.2 LTS + Django REST Framework** à la place de Flask | Bénéfice précis : authentification, sessions, CSRF, migrations, transactions par requête et interface d'administration (attribution des conseillers, contenus) fournies par un même projet maintenu, avec support jusqu'en avril 2028. Le code Flask ne contenait rien de réutilisable (voir INVENTAIRE). Django 6 exige Python 3.12 : migration possible plus tard sans changement d'architecture |
| D-017 | Acté (11/10/2026) | Frontend : React 19, React Router 7, TanStack Query 5, Vite 8, TypeScript 6.0, Tailwind 4. **Aucune variable d'environnement côté navigateur** | React Router 8 exige Node ≥ 22.22 (poste : 22.15) ; typescript-eslint ne supporte pas encore TypeScript 7. Le proxy Vite garantit la même origine (cookies HttpOnly, CSRF) |
| D-018 | Acté (11/10/2026) | Organisation `backend/` + `frontend/` + `scripts/dev.py` ; une seule application Django découpée en modules métier | Remplace l'arborescence `src/` + `api/` proposée en ARCHITECTURE §3. Pas de services séparés |
| D-019 | Acté (11/10/2026) | Base de développement : instance PostgreSQL propre au projet (`.devdb/`, 127.0.0.1:5444) gérée par `scripts/dev.py` ; Docker non requis | Le démon Docker n'est pas actif sur le poste, et les services PostgreSQL déjà installés (ports 5432 et 5433) ne doivent pas être modifiés |
| D-020 | Acté (11/10/2026) | Parcours de bout en bout avec Playwright sur une base dédiée `agria_e2e`, en vues ordinateur et téléphone | Prouve le comportement réel (proxy, cookies, base) sans toucher les données de travail |
| D-021 | Acté (11/10/2026) | Le « dossier » est une **campagne** d'un projet. Ses informations sont définies dans un registre unique côté serveur (`backend/dossiers/facts.py`), que l'interface lit pour construire ses formulaires. États : non renseigné (pas de ligne), je ne sais pas, déclaré, estimé, vérifié | Un « vérifié » exige une source (contrainte en base). Aucune valeur par défaut. Débutant et producteur partagent le même dossier ; seuls un libellé et l'information « Changements envisagés » diffèrent |
| D-022 | Acté (11/10/2026) | Accès : le propriétaire lit et modifie ; un conseiller lit seulement les dossiers qui lui sont attribués (attribution faite dans l'administration, jamais effacée mais close) ; tout autre compte reçoit 404. `is_staff` ne donne aucun accès par l'API | Pas de rôle « organisation » au lancement : il ouvrirait l'accès à tous les dossiers d'une structure |
| D-023 | Acté (11/10/2026) | Reprise sans doublon : les créations portent un `request_id` choisi par l'interface ; les modifications portent la version lue (`expected_version`). Une version différente avec un contenu identique est reconnue comme une reprise ; avec un contenu différent, c'est un conflit 409 | Couvre la réponse perdue sur un réseau instable sans fusion silencieuse |
| D-024 | Acté (11/10/2026) | Connexion par email et mot de passe. Inscription libre activable (`AGRIA_ALLOW_SIGNUP`) ; sinon comptes créés par la commande `create_account` (accès assisté). Téléphone/SMS différé | La connexion exacte dépend des entretiens (PRODUIT §5) ; un seul canal pour commencer |
| D-025 | Acté (11/10/2026) | Points à vérifier **calculés** (non stockés) depuis les informations et un modèle de contenu ; démarches **stockées**, ajoutées automatiquement quand un point les demande, jamais modifiées ni supprimées par un changement de contexte | Les points ne peuvent pas devenir incohérents ; l'historique du travail réel est protégé |
| D-026 | Acté (11/10/2026) | Modèles de contenu en fichiers JSON versionnés dans Git, validés au chargement (`load_content`), immuables une fois chargés (empreinte SHA-256), figés par dossier. Pas de CMS | La relecture d'un contenu se fait sur un fichier daté. Une correction donne une nouvelle version, sans effet sur les dossiers existants |
| D-027 | Acté (11/10/2026) | Contenu initial `preparation-generique` v1 rédigé par l'équipe, **non relu**, limité à des démarches de préparation sans prescription agronomique | Aucune validation par un spécialiste n'est disponible. Le statut est affiché dans l'interface |
| D-028 | Acté (11/10/2026) | Budget : montants en FCFA entiers ; montant d'un poste = quantité × prix unitaire arrondi au franc (demi vers le haut) ; total = somme des montants arrondis ; poste sans quantité ou sans prix = budget « incomplet », exclu des totaux ; matériel déjà détenu listé mais exclu ; aucune recette ni rentabilité | Calcul pur côté serveur (`budget/calc.py`), jamais dans le navigateur. Un budget incomplet n'affiche qu'un « total des postes chiffrés » |
| D-029 | Acté (11/10/2026) | Un poste de budget n'est jamais effacé : il est retiré (`removed_at`) et chaque changement enregistre l'état complet du poste dans l'historique | Permet de retrouver le budget d'une version relue (brique 5) |
| D-030 | Acté (11/10/2026) | Un avis est lié aux versions (contexte, plan, budget) que le conseiller a lues. Il est refusé si le dossier a changé avant l'envoi. Il conserve un instantané de son périmètre et devient « à réexaminer » dès qu'une section relue change | Toute modification d'une section relue compte, même mineure : mieux vaut trop signaler qu'un avis présenté à tort comme actuel |
| D-031 | Acté (11/10/2026) | Deux conclusions seulement : « revu sans réserve sur le périmètre examiné » et « revu avec réserves » (réserves obligatoires). Statut ajouté au cahier des charges : « prêt pour une relecture » | « Revu » ne veut dire ni faisable ni rentable. Une demande de relecture ne vaut « en revue » que si un conseiller est attribué |
| D-032 | Acté (11/10/2026) | Synthèse : page imprimable (impression ou PDF depuis le navigateur) et export JSON (`?telecharger=1`, `no-store`), soumis aux mêmes droits que la lecture. Aucun lien public | Pas de générateur PDF côté serveur : une dépendance de moins, même rendu |
| D-033 | Acté (11/10/2026) | L'interface obtient le cookie CSRF avant toute écriture et, après un refus CSRF, renouvelle le jeton puis retente une seule fois | Défaut trouvé par les parcours : une connexion envoyée avant l'arrivée du cookie (réseau lent) était refusée. Le refus CSRF intervient avant tout traitement : retenter est sans effet de bord |
| D-034 | Acté (11/10/2026) | Attribution d'un conseiller par l'administration ou la commande `assign_advisor` ; le porteur ne choisit pas son conseiller dans l'application | Pas d'annuaire ni de disponibilité affichée (hors périmètre, et rien ne serait vérifié) |
| D-035 | Acté (11/10/2026) | TanStack Query en `networkMode: 'always'` : hors connexion, une requête échoue immédiatement avec un message, au lieu d'être mise en pause puis envoyée automatiquement au retour du réseau | Défaut trouvé par le parcours hors connexion : bouton bloqué sans explication, puis écriture rejouée sans action de l'utilisateur |
| D-036 | Acté (11/10/2026) | Erreur de connexion dédiée (`identifiants_invalides`, « Email ou mot de passe incorrect. »), distincte de « non connecté » | Défaut trouvé en relecture : le message générique « Connexion requise. » remplaçait le message d'échec |
| D-037 | Acté (11/10/2026) | Contrôles d'accessibilité automatisés avec axe-core (WCAG 2.1 A/AA) et contrôle de largeur à 360 px dans les parcours | Mesure reproductible ; ne remplace pas un essai avec des utilisateurs ni avec un lecteur d'écran |
| D-038 | Acté (11/10/2026) | Nouvelle campagne d'un projet : reprise facultative des seules informations du lieu (localisation, terrain, eau) de la campagne précédente, comme point de départ « à revérifier » : un « vérifié » redevient « déclaré » et la source indique l'origine. Démarches, budget et résultats ne sont jamais recopiés | Réutiliser sans présenter d'anciens résultats comme des prévisions (PRODUIT F1) |
| D-039 | Remplacé par D-043 | Python 3.12.10 avait remplacé 3.10 au lot 2 ; contrôles locaux réussis, CI configurée mais non exécutée | La branche 3.12 reste maintenue, mais son ancien installateur Windows 3.12.10 ne contient pas les correctifs ultérieurs. Un runtime doit être maintenu à son niveau correctif, pas seulement à son numéro de branche |
| D-040 | Acté (11/10/2026) | Données de terrain (identités, téléphones, notes nominatives, fiches remplies) **jamais dans le dépôt** : espace privé du fondateur (`terrain-prive/`, ignoré par Git). Le dépôt ne contient que des modèles vierges et des synthèses anonymisées | Dépôt public ; respect des participants (VALIDATION_TERRAIN §0) |
| D-041 | Acté (11/10/2026) | G2 se déroule sur papier ou dans l'application **locale supervisée** ; tout accès à distance à des données réelles est bloqué tant que SECURITE §5 (hébergement, HTTPS, sauvegardes, restauration) n'est pas rempli | Aucun hébergement décidé (D-006) ; protection des données des participants |
| D-042 | Acté (11/10/2026) | Une version relue du contenu ne s'applique qu'aux dossiers créés après sa publication ; aucune migration automatique. Les dossiers réels du pilote sont créés **après** la publication de la v2 relue | Comportement vérifié par un test ; évite de présenter d'anciennes règles comme relues, ou de réécrire un historique |
| D-043 | Acté (11/10/2026) | Runtime de référence **Python 3.14.8**, minimum identique dans le serveur, les scripts et `requires-python`. CI configurée sur cette version, **non exécutée** | Version corrective avec installateur Windows signé par la PSF ; empreinte SHA-256 vérifiée. Dépendances applicatives conservées. Source : [publication officielle](https://www.python.org/downloads/release/python-3148/). Examiner les correctifs suivants régulièrement ; mettre à jour runtime, minimum requis et CI ensemble, puis relancer les contrôles. Ancien environnement 3.12 conservé pour diagnostic |

## Décisions à ne pas rouvrir par défaut

Le choix du nom AGRIA, du pays initial et l'absence de marketplace au lancement ne nécessitent pas une nouvelle discussion à chaque tâche technique.

Les corrections réversibles et les travaux déjà autorisés peuvent avancer dans le périmètre demandé. Ce document n'ajoute pas de circuit d'approbation à ces travaux.

Une nouvelle dépense, un contact externe, une publication ou un déploiement ne sont pas autorisés par le seul fait de les mentionner ici. Les instructions effectives du fondateur définissent l'autorisation.

## Registre des inconnues

Mis à jour le 11/10/2026. Chaque inconnue renvoie à l'étape de la [roadmap](../ROADMAP.md) qui doit la lever.

| Inconnue | Conséquence | Moyen de résolution |
|---|---|---|
| Profil prioritaire, zone, culture, problème précis | Premier usage non choisi | G1 : entretiens et fiche de décision (E5, E6) |
| Difficulté réelle de préparation | Proposition de valeur non établie | G1 : démarches, blocages et accompagnements actuels documentés |
| Capacité à effectuer les démarches | Risque d'un dossier rempli sans effet | G2 : démarches réellement réalisées, avec preuve (E10) |
| Payeur et disposition à payer | Viabilité commerciale inconnue | G1 (partie H), puis engagement écrit ou paiement en G2 |
| Conseiller et relecteur du contenu | Contenu non relu ; aucun avis possible | G1, puis relecture et publication de la v2 (E7) |
| Plafonds de temps et de dépenses, date J0 | Calendrier et dépenses non engageables | D-011 (E4) |
| Connectivité, langue, équipement des participants | Mode de G2 incertain | G1 (partie G), choix du mode de données (E8) |
| Hébergement | Pas d'accès à distance possible | D-006, seulement si nécessaire (E9) |
| Révocation des clés exposées | Exposition publique confirmée ; **révocation non confirmée** | Propriétaire des comptes (E1, SECURITE §2) |
| Exécution de la CI distante | Contrôles prouvés en local seulement | Envoi de la branche décidé par le propriétaire (E3) |

## Historique du changement de cap

Le premier cadrage partait de l'expertise environnementale du fondateur et comparait irrigation et conservation. Le fondateur a précisé son intention d'aider à la fois des débutants avec projet concret et des exploitants peu accompagnés. Le 11 octobre 2026, D-003 a donc été supersédé : l'enquête valide désormais la préparation d'une campagne et le groupe de lancement. Aucune des anciennes pistes n'est traitée comme un produit supplémentaire à développer.

## Format de décision après enquête

- ID et date :
- Responsable :
- Question :
- Preuves et liens (identifiants d'entretien, jamais de noms) :
- Options comparées, y compris la pratique actuelle :
- Choix et raison :
- Hypothèses restantes :
- Conséquences produit, techniques et budgétaires :
- Condition et date de réexamen :
- Documents mis à jour :

## Revue et idées nouvelles

La revue hebdomadaire suit la [roadmap](../ROADMAP.md). Une idée nouvelle va dans sa liste d'idées différées, avec le problème visé et la preuve nécessaire ; elle n'interrompt pas le travail engagé.

*Note (11/10/2026) : ces sections avaient été supprimées par erreur lors de la brique 2 (commit `bae79c1`), à cause d'un script d'insertion de lignes. Elles sont restaurées depuis `6c57838`, avec un registre des inconnues actualisé.*
