# Cadrage produit : de la préparation à l'accompagnement d'une campagne

Version du **13 octobre 2026**, après la livraison UX3-A. **Statut : proposition à décider par le fondateur.** Aucun choix de public, de culture ou de zone n'est arrêté par ce document. Rien n'y est validé sur le terrain.

Documents liés : [benchmark](BENCHMARK.md) · [scénario de campagne](SCENARIO_CAMPAGNE.md) · [matrice de fiabilité](MATRICE_FIABILITE.md) · [première version proposée](PREMIERE_VERSION.md) · [protocole de validation](PROTOCOLE_VALIDATION.md) · [roadmap](../ROADMAP.md) · [décisions](DECISIONS.md) (D-052 à D-055).

Conventions : **Fait** = établi par le code, les tests ou une source citée. **Hypothèse** = plausible, non vérifiée. **Recommandation** = proposition à décider.

## 1. La vision précisée

Vision donnée par le fondateur le 13/10/2026 (D-052) : un accompagnement agricole accessible de façon autonome, qui aide à préparer une campagne, accompagne pendant la culture (prochaines actions, observations, arrosage, fertilisation, difficultés, dans le périmètre pris en charge), répond par un assistant conversationnel qui utilise le contexte de la campagne, s'appuie éventuellement sur des photos, et suit la culture jusqu'à la récolte et au bilan. Le conseiller humain apporte une expertise sur certains cas ; sa présence n'est pas une condition systématique. L'autonomie n'autorise pas une réponse certaine quand les données ou les connaissances manquent.

**Ce qui change par rapport aux documents du 11 et du 12 octobre :** la préparation d'une campagne, jusqu'ici décrite comme la totalité de la première version ([PRODUIT.md](PRODUIT.md) §1), devient une composante d'un cycle complet. L'historique est conservé : les documents antérieurs décrivent fidèlement le cap de leur date.

## 2. L'existant, classé

### 2.1 Réellement présent (vérifié par des tests logiciels, pas par des utilisateurs)

| Fonction | Où | Preuve |
|---|---|---|
| Projet et campagne persistants ; informations à cinq états (non renseigné, je ne sais pas, déclaré, estimé, vérifié avec source) et historique complet | `backend/dossiers`, D-021 | Tests pytest, parcours e2e |
| Points à vérifier **calculés** à partir d'un contenu versionné, immuable, avec statut de relecture affiché | `backend/preparation`, D-025, D-026 | Tests ; contenu v1 et v2 « non relus » |
| Démarches de préparation : statut, blocage motivé, prérequis, échéance, résultat avec issue (favorable, défavorable, incertaine), historique ; aucune écriture automatique dans les informations | D-048 | Tests, e2e |
| Budget prévisionnel calculé côté serveur, incomplet tant qu'un poste n'est pas chiffré | `backend/budget`, D-028 | Tests |
| Conseiller attribué : questions, réponses, avis lié aux versions lues, demande de relecture, décisions du porteur | `backend/reviews`, D-030, D-031 | Tests, e2e |
| Synthèse imprimable et export JSON ; archivage ; nouvelle campagne avec reprise du lieu « à revérifier » | D-032, D-038, D-045 | Tests, e2e |
| Premières questions, synthèse courte, lecture par sujet (UX3-A) | `frontend/src/features/dossiers` | 79 parcours e2e réussis le 13/10/2026 |
| Écritures fiables : concurrence optimiste, reprise sans doublon, protection des saisies | D-023, D-044 | Tests, e2e |

### 2.2 Annoncé ou supposé, non vérifié

- La compréhension et l'utilité des écrans pour les publics visés : aucun entretien, aucun essai (ROADMAP, « Validation terrain : non réalisée »).
- La justesse des contenus de préparation : v1 et v2 rédigés par l'équipe, **non relus** (D-027).
- L'accompagnement par un conseiller : la fonction existe, aucun conseiller n'est engagé.
- Le fonctionnement sur les téléphones et réseaux des participants : seuls des navigateurs de bureau et une émulation Pixel 7 ont servi.
- La CI distante (jamais exécutée), la restauration sur un environnement cible (aucun hébergement).

### 2.3 Absent

| Domaine de la vision | État |
|---|---|
| Suivi pendant la culture : opérations prévues et réalisées, stades observés, observations | **Absent** (aucun modèle de données) |
| Calendrier cultural, eau et arrosage, fertilisation | **Absent** ; le contenu actuel exclut toute prescription agronomique |
| Signalement et investigation d'un problème (symptômes) | **Absent** |
| Photos (stockage, pièce jointe, analyse) | **Absent** ; écarté au lancement (PRODUIT §8) |
| Assistant conversationnel | **Absent** ; l'ancien chat a été supprimé (clé dans le navigateur, réponses prédéfinies présentées comme conseils, [INVENTAIRE](INVENTAIRE.md)) |
| Récolte, ventes, dépenses réelles, bilan prévu/réalisé | **Absent** |
| Accès à distance (hébergement, HTTPS, sauvegardes) | **Absent** ; condition de tout suivi au champ hors séance supervisée (D-006, D-041) |
| Voix, langues nationales, connexion par téléphone, notifications, hors connexion | **Absent** ; idées différées |
| Vue d'une structure sur plusieurs producteurs | **Absent** ; exclu par D-022 (pas de rôle « organisation ») |

### 2.4 Décisions anciennes incompatibles ou en tension avec la vision

Elles ne sont **pas réécrites** : chacune reste datée dans son document. Elles sont à trancher (voir §8).

| Décision ou texte | Contenu | Tension | Proposition |
|---|---|---|---|
| PRODUIT §1, D-013 | La première version couvre **seulement** la préparation | Directe | Remplacer par une première version sur un cycle complet, très limitée en diversité (D-054, proposition) |
| PRODUIT §6 | L'IA n'est pas indispensable ; au plus reformuler, résumer, structurer une saisie | Forte | L'assistant devient une composante, sous des règles de fiabilité strictes (D-055, proposition) |
| PRODUIT §8, ROADMAP « Hors périmètre » | Écarte « chatbot agricole ouvert » et « diagnostic photo autonome » | Partielle | Maintenir l'exclusion d'un chatbot **généraliste** et d'un diagnostic **autonome** ; admettre un assistant **limité au périmètre et à la campagne**, et la photo comme **observation documentée** |
| STRATEGIE « Discipline » | Une fonction n'entre que si elle sert F1–F6 | Directe | Élargir le critère au cycle de campagne retenu |
| PRODUIT §2, F5, ROADMAP (promesse) | « Avancer avec un conseiller » au cœur de la promesse | Partielle | Le conseiller devient un recours, pas une condition d'usage ; l'expertise reste indispensable à la **validation du contenu** |
| D-022 | Pas de rôle « organisation » | Si une structure est le payeur ou le canal | Garder D-022 pour le premier essai ; réexaminer seulement si le public C est retenu |
| D-047 | Pas d'explications d'initiation (aucun contenu relu) | Compatible, mais limitante | Inchangée : tout contenu agronomique passe par une relecture datée (D-026) |
| D-008, D-009, D-048 | IA non décisionnaire, distinction démonstration/mesure/preuve, pas de mise à jour automatique | **Compatibles** et structurantes | Conserver et étendre aux réponses de l'IA et aux photos |

## 3. Le problème

**Hypothèse centrale :** pendant une campagne, un petit producteur ou un débutant prend de nombreuses décisions (quand semer ou repiquer, combien et quand arroser, que faire d'un symptôme, quand récolter) **sans conseil joignable au moment de décider**, et sans trace de ce qui a été fait ; les erreurs se paient en pertes de récolte et en intrants mal employés, et ne servent pas à la campagne suivante.

Faits disponibles qui la rendent plausible, sans la prouver : un ratio rapporté d'environ un conseiller pour 10 000 producteurs (Rest of World, 2023, non vérifié) ; l'usage de notes vocales WhatsApp pour se conseiller entre pairs et avec des conseillers ; l'existence d'outils de diagnostic et d'assistants qui trouvent des utilisateurs ailleurs ([BENCHMARK](BENCHMARK.md)). Aucun entretien n'a encore été mené.

## 4. Publics possibles

Toutes les lignes « situation », « solution actuelle » et « bénéfice » sont des **hypothèses** à vérifier en entretien. Aucun témoignage n'est rapporté ici.

| | A. Première culture | B. Petit producteur actif | C. Structure accompagnant plusieurs producteurs |
|---|---|---|---|
| Situation concrète | Projet concret (terrain familial, ferme aménagée, location), peu ou pas d'expérience | Conduit déjà des campagnes, souvent plusieurs par an en maraîchage irrigué ; décide seul ou en famille | Coopérative, ONG, projet, entreprise contractant des producteurs : peu d'animateurs pour beaucoup de producteurs |
| Difficultés à résoudre | Ne sait ni quoi faire ni quand ; ne reconnaît pas un problème à temps ; budget incertain | Ravageurs et maladies, eau en saison chaude, prix des intrants, vente ; peu de traces pour comparer les campagnes | Savoir qui a quel problème, prioriser les visites, donner un conseil cohérent, rendre compte |
| Décisions où une aide serait utile | Période et préparation ; semis, repiquage, arrosage ; réaction à un symptôme ; récolte | Réaction à un symptôme ; ajustement de l'arrosage ou de la fertilisation ; moment de récolte ; préparation de la campagne suivante | Quels producteurs voir ; quel message diffuser ; quelle alerte traiter |
| Solution actuelle (à vérifier sur le terrain) | Famille, voisins, vendeur d'intrants, formations de programmes, groupes WhatsApp, vidéos | Expérience, pairs, vendeur d'intrants, groupes WhatsApp, peut-être des applications | Visites, téléphone, WhatsApp, tableurs, outils de gestion (Farmforce, Jokalante) |
| Fréquence probable | Forte pendant la campagne, une ou deux campagnes par an | Forte, plusieurs campagnes par an en maraîchage irrigué | Continue |
| Informations que la personne peut raisonnablement fournir | Lieu, culture, dates réelles, source d'eau, surface approximative, observations décrites, photos | Les mêmes, plus ses pratiques habituelles ; analyses de sol rares | Liste des producteurs, zones, cultures ; le détail vient des producteurs |
| Bénéfice attendu | Moins d'erreurs coûteuses, confiance, première trace | Réponse plus rapide aux problèmes, trace utile au bilan | Temps d'animation mieux employé, suivi lisible |
| Utilisateur / bénéficiaire / payeur éventuel | La personne / elle-même / rarement elle au début : programme, ONG, famille | Le producteur / lui-même / lui-même, une coopérative ou un acheteur | L'animateur / les producteurs et la structure / la structure ou son bailleur |
| Risque principal | Elle a le plus besoin d'aide et le moins de moyens de repérer une réponse fausse | Il compare avec son expérience : un conseil faible est vite rejeté | Cycle de vente long ; concurrence d'outils installés ; rôle « organisation » à construire |

### Recommandation de premier public (proposition)

**Petits producteurs maraîchers actifs (B), recrutés et, si possible, appuyés par une structure (C) qui fournit l'accès, une expertise de référence et une hypothèse de payeur.** Le débutant (A) reste dans la vision ; la préparation livrée lui sert déjà, et il serait visé une fois des réponses fiabilisées.

Raisons :

1. **Les décisions pendant la culture sont fréquentes et réelles** chez le producteur actif : l'utilité de l'accompagnement en cours de campagne, cœur de la vision, peut s'y mesurer vite.
2. **Un producteur expérimenté repère mieux une réponse inadaptée** : c'est le public le plus sûr pour éprouver un assistant et des fiches encore jeunes. Le débutant, lui, appliquerait une erreur sans la détecter.
3. **Une structure** facilite le recrutement, porte une expertise agronomique pour relire le contenu, et constitue l'hypothèse de payeur la moins fragile ; elle n'impose pas de conseiller à chaque usage.

Preuves manquantes : un groupe accessible de producteurs avec une campagne à venir ; les décisions de campagne qu'ils jugent difficiles ; leur usage actuel du téléphone, de l'écrit et de la voix ; une structure et un référent agronomique disposés à participer ; un payeur. Condition de révision : si les entretiens montrent que les producteurs actifs n'attendent rien d'un suivi, ou qu'un débutant accompagné par un programme est plus accessible et mieux encadré, réexaminer en faveur de A.

## 5. Positionnement à tester

Voir [BENCHMARK](BENCHMARK.md) §4. En une phrase, **proposition** : *le carnet de campagne qui accompagne : il se souvient de ce qui a été prévu, observé et fait, propose la prochaine action à partir de références locales relues, et dit quand il ne sait pas.*

AGRIA n'est ni présenté comme unique, ni comme supérieur aux solutions existantes. Le partenariat (contenu, canal vocal, diagnostic) est à envisager avant de tout construire.

## 6. Principes de fiabilité retenus pour toute la suite (proposition, D-055)

1. **Trois objets distincts, jamais confondus** : le *prévu* (issu d'une référence), l'*observé* (stade, symptôme, daté, déclaré par l'utilisateur), le *réalisé* (opération déclarée faite). Une date théorique ne fait pas avancer un stade ; une proposition ne devient pas une opération réalisée.
2. **Une réponse de l'IA n'est jamais un fait** : elle ne modifie ni une information, ni une opération, ni une observation. L'utilisateur confirme explicitement, dans un formulaire, ce qu'il a observé ou fait (prolongement de D-048).
3. **Toute proposition porte sa provenance** : le dossier de l'utilisateur, une référence relue (nom, version, relecteur), une règle de calcul, ou une connaissance générale non relue (alors signalée comme telle et jamais utilisée pour une dose ou un traitement).
4. **Refuser plutôt qu'inventer** : sans donnée indispensable, demander ; sans connaissance relue, dire qu'aucune recommandation fondée n'est possible et proposer un recours humain.
5. **Aucune dose, aucun produit, aucune date de traitement** qui ne vienne d'une référence relue pour la culture et la zone ; les calculs sont déterministes côté serveur (prolongement de D-028).
6. **Aucun score de confiance affiché** tant qu'il n'a pas été évalué sur des cas locaux.

Le détail par capacité est dans la [matrice de fiabilité](MATRICE_FIABILITE.md).

## 7. Ce qu'apporte une première version cohérente

Voir [PREMIERE_VERSION](PREMIERE_VERSION.md) : un cycle complet (préparation → plan daté → journal → problème → récolte → bilan) pour **une** culture, **une** zone, **un** mode de production et une **liste fermée** de conseils et de problèmes, avec un assistant limité à la campagne et au contenu relu. La diversité s'élargit ensuite, pas la profondeur du cycle.

## 8. Décisions prioritaires attendues du fondateur

1. **Adopter ou amender la vision précisée et ses conséquences** (D-052 et le tableau §2.4) : en particulier, la première version couvre-t-elle un cycle complet limité, ou d'abord la préparation seule ?
2. **Premier public à éprouver** : producteurs actifs recrutés via une structure (recommandé) ou débutants accompagnés par un programme.
3. **Référent agronomique** : qui peut relire un calendrier, des fiches de problèmes et noter des réponses, à quelles conditions ; sans lui, aucun conseil agronomique ne peut être activé.
4. **Ordre entre essai sans code et développement** : lancer d'abord un essai « concierge » (accompagnement par message, réponses préparées ou relues par le référent) pour constituer le corpus de questions et mesurer l'utilité, ou commencer par le journal de campagne.
5. **Accès à distance** : un suivi au champ suppose un hébergement et la mise en sécurité de SECURITE §5 ; décider s'il est engagé pour l'essai outillé, et avec quel plafond.
6. **UX3-B** : ne pas le lancer tel quel ; retenir seulement ce qui sert le cycle choisi (voir la [roadmap](../ROADMAP.md)).

## 9. Prochaine mission concrète recommandée

**C1 — Préparer l'essai « concierge » de suivi de campagne, sans code** : guide d'entretien G1 étendu au suivi en cours de culture ; fiche de campagne prévu/observé/réalisé (papier ou message) ; grille de notation des réponses par le référent ; liste des questions et problèmes à couvrir pour une culture candidate ; modalités de consentement et de conservation des photos. Elle produit les preuves qui conditionnent toutes les autres décisions, et ne dépend d'aucun hébergement.

Première mission de développement, **une fois les décisions 1 à 3 prises** : **D1 — journal de campagne sans IA** (opérations prévues et réalisées, observations datées, photos en pièce jointe privée), réutilisable quelle que soit la culture retenue. Détail dans la [roadmap](../ROADMAP.md).
