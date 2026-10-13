# Roadmap AGRIA

Mise à jour : 13 octobre 2026 (cadrage après la vision précisée par le fondateur). Promesse à tester, **proposition** : *AGRIA accompagne une campagne agricole de la préparation au bilan, pour une culture et une zone prises en charge, en gardant la mémoire de ce qui a été prévu, observé et fait, et en disant quand il ne sait pas.*

**Cap produit :** Sénégal d'abord. Vision précisée le 13/10/2026 (D-052) : accompagnement autonome sur tout un cycle cultural (préparation, suivi, problèmes, récolte, bilan), assistant conversationnel utilisant le contexte de la campagne, photos pour documenter un problème, conseiller humain en recours et non en condition systématique. **Proposition à décider** ([CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md)) : une première version sur un cycle complet mais très limitée en diversité (D-054), sous des règles de fiabilité strictes (D-055). Public, culture, zone et payeur restent à valider sur le terrain.

*Historique : jusqu'au 12/10/2026, le cap était la préparation accompagnée d'une campagne seule (D-013, [PRODUIT.md](docs/PRODUIT.md)) ; ce cap a produit le socle F1–F6 et UX3-A, conservés.*

## Où en est le projet

| Niveau | État | Preuve ou référence |
|---|---|---|
| Fondations techniques (F1–F6) | **Livrées** sur `refonte/fondations` | [AVANCEMENT.md](docs/AVANCEMENT.md), briques 0 à 7 |
| Parcours débutant (pas à pas, démarche reliée à l'information, budget guidé) | **Livré et vérifié techniquement** ; compréhension **à tester** | [AVANCEMENT.md](docs/AVANCEMENT.md), « Parcours débutant » ; D-048 à D-050 |
| Expérience cible et frontend | UX1 livré (prototype isolé) ; UX2 terminé (direction retenue, sans étude utilisateur) ; **UX3-A livré le 13/10/2026** (premières questions, synthèse, sujets, démarche, actualisation sur les API réelles) ; **UX3-B suspendu** en attendant les décisions du cadrage | [AVANCEMENT.md](docs/AVANCEMENT.md), « UX3-A » ; D-051 |
| Cadrage de la vision complète | **Proposé le 13/10/2026**, en attente des décisions du fondateur | [CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md), [BENCHMARK.md](docs/BENCHMARK.md), [SCENARIO_CAMPAGNE.md](docs/SCENARIO_CAMPAGNE.md), [MATRICE_FIABILITE.md](docs/MATRICE_FIABILITE.md), [PREMIERE_VERSION.md](docs/PREMIERE_VERSION.md), [PROTOCOLE_VALIDATION.md](docs/PROTOCOLE_VALIDATION.md) |
| Suivi de campagne, calendrier, problèmes, photos, assistant, bilan | **Absents du code** | [CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md) §2.3 |
| Contrôles exécutés | **Locaux uniquement** ; Python 3.14.8 | [AVANCEMENT.md](docs/AVANCEMENT.md) |
| CI GitHub | Configurée, **jamais exécutée** | [RESUME_PR.md](docs/RESUME_PR.md) |
| Préparation du terrain | Kit G1 et protocole G2 prêts ; protocole d'accompagnement de campagne proposé ; **rien d'exécuté** | [VALIDATION_TERRAIN.md](docs/VALIDATION_TERRAIN.md), [PROTOCOLE_VALIDATION.md](docs/PROTOCOLE_VALIDATION.md) |
| Validation terrain et agronomique | **Non réalisée** : aucun entretien, participant, référent ni contenu relu | — |
| Mise en service | **Non réalisée** : aucun hébergement, aucun accès à distance | [SECURITE.md](docs/SECURITE.md) §5 |
| Sécurité | Clés exposées publiquement ; **aucune révocation confirmée** | [SECURITE.md](docs/SECURITE.md) §1–2 |

## Décisions attendues du fondateur

Détail et arguments : [CADRAGE_PRODUIT.md](docs/CADRAGE_PRODUIT.md) §8.

1. Adopter ou amender la vision précisée et ses conséquences sur les décisions antérieures (D-052 ; première version D-054).
2. Premier public à éprouver (proposition D-053 : producteurs maraîchers actifs via une structure).
3. Référent agronomique : qui, à quelles conditions.
4. Ordre entre essai « concierge » sans code et premier développement.
5. Accès à distance pour l'essai outillé (hébergement, plafond).
6. Sort d'UX3-B (proposition : ne pas le lancer tel quel).

## Trois voies, à ne pas confondre

Un document de cadrage n'est pas un essai ; un essai n'est pas une validation de marché ; un développement vérifié par des tests n'est pas une validation terrain.

### Cadrage (sans code, sans participants)

| # | Étape | Responsable | Dépendances | Sortie |
|---|---|---|---|---|
| C0 | Cadrage produit de la vision complète | Équipe | — | **Fait le 13/10/2026** (documents ci-dessus), à décider |
| C1 | Préparer l'essai « concierge » : module d'entretien, fiche de campagne prévu/observé/réalisé, grille de notation des réponses, consentement photos, liste de questions et de problèmes pour une culture candidate | Équipe, puis fondateur | Décisions 1 et 2 | Kit prêt à l'emploi ; **prochaine mission recommandée** |
| C2 | Décisions de cadrage consignées (D-052 à D-055 tranchées, D-014 provisoire) | Fondateur | C0 | Registre des décisions à jour |
| C3 | Trouver un référent agronomique ; réunir les références de la culture et de la zone candidates | Fondateur | C2 | Référent engagé par écrit ; fiches à relire (V0 du protocole) |

### Essais (avec participants)

| # | Étape | Responsable | Dépendances | Sortie |
|---|---|---|---|---|
| T0 | Entretiens étendus (G1 + module suivi de campagne) | Fondateur | E4 (plafonds, J0), C1 | Fiche de décision : public, culture, zone ; D-014 consigné (ancien E5–E6) |
| T1 | Essai « concierge » sur un cycle réel | Fondateur, référent, participants | T0, C3 | Corpus de questions et de cas ; notes de justesse ; mesures d'effort et de retour (V2) |
| T2 | Essai outillé sur un cycle | Fondateur, référent, participants | T1, D1–D4 selon les capacités retenues, E9 si accès distant | Décision par capacité (V3) |
| T3 | Bilan | Fondateur | T2 | Poursuivre, modifier ou abandonner, hypothèse par hypothèse (V4) |

L'ancien G2 (environ trois dossiers de préparation accompagnés, VALIDATION_TERRAIN §7) reste disponible si le fondateur garde d'abord la préparation seule.

### Développement (seulement ce que les décisions justifient)

| # | Lot | Dépendances | Condition de sortie |
|---|---|---|---|
| D0 | Réserves UX3-A : messages de sauvegarde ambigus ; chargement du contenu v2 dans les environnements concernés | — | Corrigé avec le premier lot qui touche ces écrans ; `load_content` lancé par le fondateur sur ses bases |
| D1 | **Journal de campagne sans IA** : opérations prévues et réalisées, observations datées, photos en pièce jointe privée ; historique en ajout seul ; rien d'automatique sur les faits | Décisions 1 à 3 | Parcours vérifiés ordinateur et téléphone ; aucune donnée réelle avant l'essai |
| D2 | **Plan daté** à partir d'une fiche relue (fenêtres recalées sur les dates réelles), format de contenu étendu | D1, fiche relue (C3) | Fiche relue chargée ; écarts prévu/réalisé visibles |
| D3 | **Signalement de problème guidé** par les fiches relues d'une liste fermée ; transmission d'un cas au recours humain | D1, fiches relues | Banc de cas noté par le référent |
| D4 | **Assistant limité** au dossier et au contenu relu, côté serveur, avec provenance, refus et journalisation ; banc d'évaluation | D1–D3, corpus de T1 | Aucune réponse dangereuse sur le banc ; seuils de [MATRICE_FIABILITE.md](docs/MATRICE_FIABILITE.md) atteints |
| D5 | **Récolte et bilan** (prévu/réalisé, problèmes et issues, dépenses déclarées) | D1 | Bilan relu avec un participant de l'essai |
| D6 | Accès à distance (ancien E9) | E1, D-006, décision 5 | SECURITE §5 coché ; restauration testée sur l'environnement cible |

Capacités **non engagées** tant que la matrice de fiabilité ne le permet pas : suggestion automatique sur photo, volumes d'arrosage, doses de fertilisation, produits de traitement.

## Exploitation et prérequis conservés

| # | Étape | Responsable | État |
|---|---|---|---|
| E1 | Révoquer les clés exposées et changer le mot de passe email | Propriétaire des comptes | À faire, urgent ([SECURITE.md](docs/SECURITE.md) §2) |
| E2 | Maintenir le runtime à jour, `dev.py check --e2e` et `recette.py` | Technique | Courant |
| E3 | Décider d'envoyer la branche et faire tourner la CI | Propriétaire | À décider |
| E4 | Fixer J0, seuils et plafonds de temps et de dépenses (D-011) | Fondateur | À faire avant T0 |
| E5–E6 | Enquête G1 et décision | Fondateur | Remplacés par T0 |
| E7 | Relecture du contenu et publication d'une version relue | Référent, puis technique | Élargi par C3 (préparation **et** fiches de culture) |
| E8 | Mode de données de l'essai | Fondateur | Avant T1 |
| E9 | Mise en service, seulement si nécessaire | Technique et propriétaire | Devient D6 si l'essai outillé est à distance |
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

Noter l'étape en cours par voie (cadrage, essais, développement), les preuves nouvelles, le temps et les dépenses, les risques, la prochaine action avec son responsable et son échéance, et les décisions. Limiter le travail en parallèle à une étape de terrain et une tâche produit ou technique directement utile. Au 13/10/2026 : cadrage C0 proposé ; décisions du fondateur attendues ; aucune voie d'essai engagée.

Références : [cadrage](docs/CADRAGE_PRODUIT.md), [produit (11/10/2026)](docs/PRODUIT.md), [stratégie](docs/STRATEGIE.md), [terrain](docs/VALIDATION_TERRAIN.md), [décisions](docs/DECISIONS.md), [avancement](docs/AVANCEMENT.md).
