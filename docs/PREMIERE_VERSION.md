# Première version proposée : un cycle complet, peu de situations

Version du **13 octobre 2026**, corrigée le même jour. **Proposition à décider (D-054)** ; elle ne choisit définitivement ni public, ni culture, ni zone. Elle décrit la première version **visée**, pas un lot à construire d'un bloc : le premier lot est choisi après les premiers retours, selon l'aide qu'il apporte à une décision de l'utilisateur ([CADRAGE_PRODUIT](CADRAGE_PRODUIT.md) §9). Contexte : [CADRAGE_PRODUIT.md](CADRAGE_PRODUIT.md) ; conditions de fiabilité : [MATRICE_FIABILITE.md](MATRICE_FIABILITE.md).

## 1. Principe

Garder **la profondeur du cycle** (préparer → planter → suivre → résoudre un problème → récolter → faire le bilan) et **limiter la diversité** : un public, une culture, une zone, un mode de production, une liste fermée de conseils et de problèmes. Élargir ensuite la diversité, pas l'inverse : une préparation seule ne permet pas d'éprouver la vision, et un cycle « toutes cultures » ne peut pas être fiable.

La valeur visée est l'aide à la décision (savoir quoi faire ensuite, comprendre une difficulté, suivre l'effet d'une action). La mémoire de la campagne en est le moyen : elle n'est construite que dans la mesure où une aide en a besoin.

## 2. Critères de choix

| Élément | Critères | Candidats à examiner (non choisis) |
|---|---|---|
| Premier public | Décisions fréquentes pendant la campagne ; besoin d'aide exprimé ; accessible pour un essai ; payeur plausible | Producteurs actifs et débutants avec un projet concret, **comparés** ([CADRAGE](CADRAGE_PRODUIT.md) §4, D-056) ; une structure est un canal ou un payeur potentiel |
| Culture | Cycle assez court pour qu'un essai observe une récolte ; importance pour le public ; références locales existantes et relisibles ; **petit nombre de problèmes fréquents, distinguables** ; référent compétent disponible ; risque d'erreur gérable | Une culture maraîchère irriguée courante (par exemple oignon, tomate ou chou, présents dans le calendrier FAO pour le Sénégal) ; l'oignon est une spécialité citée par l'ISRA/CDH ([MARCHE_SENEGAL](MARCHE_SENEGAL.md)) ; la tomate offre plus de problèmes visibles, donc plus d'intérêt pour la photo, mais plus de risques |
| Zone | Concentration du public ; accès du fondateur ; référent connaissant la zone ; couverture réseau ; existence d'une zone agro-écologique documentée | Niayes (la description FAO de la zone lui attribue environ 80 % de la production horticole du pays) ; Vallée du fleuve |
| Mode de production | Un seul mode, irrigué, petite surface, plein champ ; source d'eau identifiée | Maraîchage irrigué de contre-saison, arrosage manuel ou goutte-à-goutte : à préciser selon les participants |
| Conseils couverts | Fondés sur une référence relue, utiles à une décision fréquente, vérifiables pendant l'essai | Calendrier en fenêtres ; repères qualitatifs d'arrosage ; rappel des apports prévus par la fiche ; liste fermée de problèmes fréquents (nombre fixé avec le référent) |

**Condition de validation de ces choix :** entretiens montrant le besoin (G1 étendu), un référent qui accepte de relire les fiches de la culture et de la zone, au moins quelques participants avec une campagne dans la fenêtre de l'essai ([PROTOCOLE_VALIDATION](PROTOCOLE_VALIDATION.md)). Un essai sur un cycle dépend de la saison de la culture : une fenêtre manquée décale tout d'une saison.

## 3. Périmètre

### Indispensable au premier essai

1. **Préparation** (existante, UX3-A), avec un contenu relu pour la culture et la zone.
2. **Plan de campagne daté** à partir des dates **réelles**, en fenêtres issues de la fiche relue ; distinction prévu / observé / réalisé.
3. **Mémoire de la campagne** (journal) : opérations réalisées, observations datées, photos en pièce jointe privée ; elle sert les points 2, 4, 5 et 6, et n'est pas une fin en soi.
4. **Signalement d'un problème** guidé par les fiches relues d'une liste fermée : questions qui distinguent les causes, hypothèses explicites, actions prévues par la fiche, vérification planifiée ; transmission possible au recours humain avec le dossier.
5. **Assistant limité** au dossier de la personne et au contenu relu : provenance affichée, refus quand rien ne fonde une réponse, aucune écriture de fait. Activé seulement après son évaluation ; au premier essai, il peut être remplacé par des réponses préparées ou relues par le référent (essai « concierge »), ce qui éprouve l'utilité du service sans valider l'autonomie de l'IA. Son report n'est pas un abandon ; il en va de même pour l'aide par photo.
6. **Récolte et bilan simple** : dates, quantités dans l'unité de la personne, prévu/réalisé, problèmes et issues, dépenses déclarées.
7. **Accès depuis le téléphone du participant** dès que l'essai sort des séances supervisées : hébergement et SECURITE §5 deviennent alors des prérequis.

### Utile ensuite

Suggestion automatique sur photo (composant existant évalué sur un jeu local) ; calcul de volumes d'arrosage validé ; données météo ; voix et langues nationales, accès par WhatsApp ; rappels ; dépenses réelles rapprochées du budget ; vue d'une structure sur ses producteurs ; reprise de campagne producteur (UX3-B) ; deuxième culture.

### Hors périmètre initial

Autres cultures, zones et modes ; dose, volume ou produit non issus d'une référence relue ; diagnostic présenté comme certain ; chatbot généraliste ; entraînement d'un modèle propre ; capteurs, automatisation d'irrigation ; marketplace, crédit, assurance ; prévision de rendement ou de revenu ; application native.

## 4. Ce qui existe, ce qui évolue, ce qui manque

| Élément | Réutilisable tel quel | Doit évoluer | Manque |
|---|---|---|---|
| Projet, campagne, accès (porteur, conseiller attribué), archivage | Oui | — | Rôle « structure » seulement si le public C est retenu (D-022) |
| Informations à cinq états avec historique | Oui | Registre complété pour la culture (variété, mode d'implantation, équipement d'arrosage) | — |
| Contenu versionné, immuable, statut de relecture (D-026, D-042) | Le mécanisme | Format étendu : fenêtres de calendrier, fiches de problèmes, repères qualitatifs | Le contenu relu lui-même |
| Moteur de points à vérifier | Pour la préparation | Règles sur stades et observations (même principe : calcul pur, rien de stocké) | — |
| Démarches avec issue (D-048) | Pour la préparation | — | **Opérations** (prévues, réalisées) et **observations** : nouveaux objets à historique en ajout seul, distincts des démarches |
| Concurrence optimiste, reprise sans doublon, protection des saisies | Oui | Saisie rapide au champ, éventuellement différée hors connexion (à décider sur preuve) | — |
| Messages et relecture du conseiller | Oui | Transmission d'un cas avec son contexte (problème, photos, hypothèses) | — |
| Budget prévisionnel | Oui | Dépenses réelles déclarées | — |
| Synthèse, sujets, action principale (UX3-A) | Oui | Espace « Suivi » ou « Journal » ; l'action principale tient compte du plan daté | — |
| Photos | — | — | Stockage privé, taille, consentement, conservation |
| Assistant | — | — | Intégration serveur, recherche dans le contenu relu, journalisation, banc d'évaluation |
| Hébergement | — | — | Décision D-006, mise en sécurité SECURITE §5 |

Aucune refonte technique générale n'est nécessaire : Django, PostgreSQL, React et les règles d'écriture fiables portent ces ajouts. Les nouveaux objets suivent les mêmes invariants (historique en ajout seul, rien d'automatique sur les faits, calculs côté serveur).

## 5. UX3-B dans ce cadre

Ne pas lancer UX3-B tel qu'il est découpé. Reprendre seulement ce qui sert le cycle retenu : les échanges et l'avis (« qui reçoit quoi ») servent la transmission d'un cas ; la reprise producteur sert la campagne suivante et le bilan ; le budget guidé et le retrait des anciens écrans attendent. Les deux réserves UX3-A consignées dans [AVANCEMENT](AVANCEMENT.md) se corrigent à l'occasion du premier lot qui touche ces écrans.
