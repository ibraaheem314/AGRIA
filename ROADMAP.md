# Roadmap AGRIA

Mise à jour : 13 octobre 2026 (cadrage corrigé, démonstration de suivi, kit des premiers contacts). Promesse à tester, **proposition** : *AGRIA aide à savoir quoi faire ensuite dans sa campagne, à comprendre ce qui arrive à sa culture et à suivre l'effet de ce qu'on a fait, de la préparation au bilan, avec une aide qui tient compte de ce qui a réellement été fait et observé et qui dit quand elle ne sait pas.*

**Cap produit :** Sénégal d'abord. Vision précisée le 13/10/2026 (D-052) : accompagnement autonome sur tout un cycle cultural (préparation, suivi, problèmes, récolte, bilan), assistant conversationnel utilisant le contexte de la campagne, photos pour documenter un problème, conseiller humain en recours et non en condition systématique. **Proposition à décider** ([CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md)) : une première version sur un cycle complet mais très limitée en diversité (D-054), sous des règles de fiabilité strictes (D-055). Public, culture, zone et payeur restent à valider sur le terrain.

*Historique : jusqu'au 12/10/2026, le cap était la préparation accompagnée d'une campagne seule (D-013, [PRODUIT.md](docs/PRODUIT.md)) ; ce cap a produit le socle F1–F6 et UX3-A, conservés.*

## Où en est le projet

| Niveau | État | Preuve ou référence |
|---|---|---|
| Fondations techniques (F1–F6) | **Livrées** sur `refonte/fondations` | [AVANCEMENT.md](docs/AVANCEMENT.md), briques 0 à 7 |
| Parcours débutant (pas à pas, démarche reliée à l'information, budget guidé) | **Livré et vérifié techniquement** ; compréhension **à tester** | [AVANCEMENT.md](docs/AVANCEMENT.md), « Parcours débutant » ; D-048 à D-050 |
| Expérience cible et frontend | UX1 livré (prototype isolé) ; UX2 terminé (direction retenue, sans étude utilisateur) ; **UX3-A livré le 13/10/2026** (premières questions, synthèse, sujets, démarche, actualisation sur les API réelles) ; **UX3-B suspendu** en attendant les décisions du cadrage | [AVANCEMENT.md](docs/AVANCEMENT.md), « UX3-A » ; D-051 |
| Cadrage de la vision complète | **Proposé et corrigé le 13/10/2026** (positionnement, concurrence, public, conditions d'avancement, validation) | [CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md), [BENCHMARK.md](docs/BENCHMARK.md), [SCENARIO_CAMPAGNE.md](docs/SCENARIO_CAMPAGNE.md), [MATRICE_FIABILITE.md](docs/MATRICE_FIABILITE.md), [PREMIERE_VERSION.md](docs/PREMIERE_VERSION.md), [PROTOCOLE_VALIDATION.md](docs/PROTOCOLE_VALIDATION.md) |
| Suivi de campagne, calendrier, problèmes, photos, assistant, bilan | **Absents de l'application** ; **démonstration fictive** dans le prototype (`/suivi`, réponses scénarisées, aucune IA ni analyse d'image) | [CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md) §2.3 ; [DEMARRAGE.md](docs/DEMARRAGE.md) |
| Premiers contacts terrain | **Kit prêt, non utilisé** : guide court, script de test de la démonstration, fiche de relevé, messages, pistes de structures | [KIT_PREMIERS_CONTACTS.md](docs/terrain/KIT_PREMIERS_CONTACTS.md) |
| Contrôles exécutés | **Locaux uniquement** ; Python 3.14.8 | [AVANCEMENT.md](docs/AVANCEMENT.md) |
| CI GitHub | Configurée, **jamais exécutée** | [RESUME_PR.md](docs/RESUME_PR.md) |
| Préparation du terrain | Kit G1 et protocole G2 prêts ; protocole d'accompagnement de campagne proposé ; **rien d'exécuté** | [VALIDATION_TERRAIN.md](docs/VALIDATION_TERRAIN.md), [PROTOCOLE_VALIDATION.md](docs/PROTOCOLE_VALIDATION.md) |
| Validation terrain et agronomique | **Non réalisée** : aucun entretien, participant, référent ni contenu relu | — |
| Mise en service | **Non réalisée** : aucun hébergement, aucun accès à distance | [SECURITE.md](docs/SECURITE.md) §5 |
| Sécurité | Clés exposées publiquement ; **aucune révocation confirmée** | [SECURITE.md](docs/SECURITE.md) §1–2 |

## Décisions encore indispensables

La vision (D-052) est exprimée par le fondateur et n'est pas à reconfirmer. Détail : [CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md) §10.

1. Référent agronomique : qui, à quelles conditions (conditionne tout conseil destiné à être appliqué, pas les entretiens ni la démonstration).
2. Plafonds et date de départ des premiers contacts (D-011).
3. Accès à distance, seulement quand un lot sera prêt à être essayé hors séance supervisée.

Public, culture et zone se choisiront sur les retours des premiers contacts (D-056). UX3-B reste suspendu.

## Trois voies, à ne pas confondre

Un document de cadrage n'est pas un essai ; une démonstration fictive n'est pas une validation ; un développement vérifié par des tests n'est pas une validation terrain.

### Cadrage et préparation (sans participants)

| # | Étape | Responsable | Sortie |
|---|---|---|---|
| C0 | Cadrage produit de la vision complète | Équipe | **Fait et corrigé le 13/10/2026** |
| C1 | Démonstration interactive du suivi et kit des premiers contacts | Équipe | **Fait le 13/10/2026** : `/suivi` dans le prototype ; [kit](docs/terrain/KIT_PREMIERS_CONTACTS.md) |
| C2 | Trouver une personne compétente pour relire les connaissances | Fondateur | Référent engagé par écrit (V0 du [protocole](docs/PROTOCOLE_VALIDATION.md)) |

### Essais (avec participants)

| # | Étape | Responsable | Dépendances | Sortie |
|---|---|---|---|---|
| T0 | **Premiers contacts** : entretiens courts et test de la démonstration (V1–V2) | Fondateur | E4 (plafonds, date) | Fiches de relevé ; besoin prioritaire ; pistes de public, culture, zone |
| T1 | Essai court du lot choisi (V3) | Fondateur, participants, référent si conseil appliqué | T0 et le lot correspondant | Décision sur la capacité essayée |
| T2 | Suivi longitudinal sur une campagne (V4) | Fondateur, participants, référent | T1 | Réutilisation, effort, justesse sur des cas réels, bilan |
| T3 | Bilan (V5) | Fondateur | T2 | Poursuivre, modifier ou abandonner, hypothèse par hypothèse |

L'ancien G2 (dossiers de préparation accompagnés, VALIDATION_TERRAIN §7) reste disponible si l'intérêt se concentre sur la préparation.

### Développement (choisi après les premiers retours)

Le premier lot n'est **pas fixé d'avance** : il est choisi d'après T0, selon l'aide qu'il apporte à une décision de l'utilisateur ([CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md) §9). Candidats :

| Lot candidat | Aide apportée | Condition |
|---|---|---|
| Signalement guidé d'un problème, avec photo jointe et suivi de son évolution | « Que regarder, et faut-il demander de l'aide ? » | Questions d'observation sans référent ; causes possibles seulement avec des fiches relues |
| Plan de campagne recalé sur les dates réelles | « Que faire cette semaine ? » | Fiche relue pour la culture et la zone |
| Action déclarée et suivi de son résultat | « Ce que j'ai fait a-t-il changé quelque chose ? » | Faits déclarés seulement |
| Assistant limité au dossier et au contenu relu | Réponse immédiate en contexte | Évaluation propre réussie avant activation ([MATRICE_FIABILITE.md](docs/MATRICE_FIABILITE.md)) |

Toujours possible sans attendre : **D0** — réserves UX3-A (messages de sauvegarde ambigus ; `load_content` de la v2 sur les bases du fondateur), corrigées avec le premier lot qui touche ces écrans. L'accès à distance (ancien E9) n'est engagé que pour un essai qui l'exige.

Capacités **non engagées** tant que la matrice de fiabilité ne le permet pas : suggestion automatique sur photo, volumes d'arrosage, doses de fertilisation, produits de traitement. Leur report n'est pas un abandon.

## Exploitation et prérequis conservés

| # | Étape | Responsable | État |
|---|---|---|---|
| E1 | Révoquer les clés exposées et changer le mot de passe email | Propriétaire des comptes | À faire, urgent ([SECURITE.md](docs/SECURITE.md) §2) |
| E2 | Maintenir le runtime à jour, `dev.py check --e2e` et `recette.py` | Technique | Courant |
| E3 | Décider d'envoyer la branche et faire tourner la CI | Propriétaire | À décider |
| E4 | Fixer J0, seuils et plafonds de temps et de dépenses (D-011) | Fondateur | À faire avant T0 |
| E5–E6 | Enquête G1 et décision | Fondateur | Remplacés par T0 (premiers contacts) |
| E7 | Relecture du contenu et publication d'une version relue | Référent, puis technique | Élargi par C2 (préparation **et** connaissances de la culture) |
| E8 | Mode de données de l'essai | Fondateur | Avant T1 |
| E9 | Mise en service, seulement si nécessaire | Technique et propriétaire | Seulement pour un essai hors séance supervisée |
| E10 | G2 (dossiers de préparation accompagnés) | Fondateur, conseiller, participants | Conservé comme option (voir Essais) |

## Conception de l'expérience (historique)

| # | Étape | État |
|---|---|---|
| UX1 | Prototype navigable isolé du parcours de préparation | Livré le 12/10/2026 |
| UX2 | Évaluation par le fondateur et choix d'une direction | Terminé le 13/10/2026 (sans étude utilisateur) |
| UX3-A | Intégration du parcours débutant aux API réelles | Livré le 13/10/2026 |
| UX3-B | Budget guidé, échanges et avis, reprise producteur, retrait des écrans remplacés | **Suspendu** : seuls les éléments utiles au cycle retenu seront repris ([PREMIERE_VERSION.md](docs/PREMIERE_VERSION.md) §5) |

## Idées différées

Aucune n'est à développer maintenant. Chacune se réexamine sur preuve, avec une décision consignée.

| Idée | Problème visé | Preuve nécessaire pour la réexaminer |
|---|---|---|
| Notifications (SMS, email, WhatsApp) et rappels | Une opération ou une question reste sans suite faute d'alerte | Essai T1 ou T2 montrant des oublis dus à l'absence d'alerte |
| Connexion par numéro de téléphone | Des participants n'ont pas d'email | Entretiens T0 ou difficultés en essai |
| Récupération du mot de passe par email | Comptes bloqués | Cas répétés malgré l'assistance |
| Mode hors connexion | Saisie impossible au champ | Essai T2 interrompu par le réseau |
| Voix, wolof et autres langues nationales | Écrit difficile ou incompris | Entretiens et observations ; c'est le mode dominant des solutions locales ([BENCHMARK.md](docs/BENCHMARK.md)) |
| Suggestion automatique sur photo (composant existant) | Description difficile d'un symptôme | Jeu d'images locales étiqueté ; évaluation sur ce jeu |
| Volumes d'arrosage calculés | Arrosage mal ajusté | Méthode validée par le référent sur des cas réels |
| Météo ou données environnementales | Une décision de campagne dépend d'une donnée climatique | Cas observés en essai |
| Vue d'une structure sur ses producteurs (rôle « organisation ») | Animation de plusieurs producteurs | Structure engagée comme canal ou payeur (D-022 à réexaminer) |
| Migration explicite d'un dossier vers une nouvelle version du contenu | Dossier en cours bloqué sur une version obsolète | Cas réel ; outil explicite et tracé |
| Conversion entre unités | Quantités exprimées dans d'autres unités | Erreurs de saisie observées |

## Hors périmètre

Chatbot **généraliste** (sans rapport avec la campagne ni avec un contenu relu), diagnostic présenté comme certain, entraînement d'un modèle propre au lancement, capteurs ou plateforme IoT, automatisation d'irrigation, marketplace, paiement, crédit ou assurance, prévision de rendement ou de revenu, application mobile native, architecture distribuée, extension multi-filières ou multi-pays avant preuve locale.

## Revue hebdomadaire

Noter l'étape en cours par voie (cadrage, essais, développement), les preuves nouvelles, le temps et les dépenses, les risques, la prochaine action avec son responsable et son échéance, et les décisions. Limiter le travail en parallèle à une étape de terrain et une tâche produit ou technique directement utile. Au 13/10/2026 : cadrage corrigé, démonstration et kit prêts ; prochaine action : premiers contacts (T0) ; aucun essai engagé.

Références : [cadrage](docs/CADRAGE_PRODUIT.md), [produit (11/10/2026)](docs/PRODUIT.md), [stratégie](docs/STRATEGIE.md), [terrain](docs/VALIDATION_TERRAIN.md), [décisions](docs/DECISIONS.md), [avancement](docs/AVANCEMENT.md).
