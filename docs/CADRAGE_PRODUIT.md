# Cadrage produit : de la préparation à l'accompagnement d'une campagne

Version du **13 octobre 2026**, après la livraison UX3-A ; **corrigée le même jour** (positionnement, concurrence, premier public, conditions d'avancement, validation) après relecture du fondateur, et complétée par une démonstration interactive et un kit de terrain. **Statut : proposition à décider par le fondateur, sauf la vision, exprimée par lui.** Aucun choix de public, de culture ou de zone n'est arrêté par ce document. Rien n'y est validé sur le terrain.

Documents liés : [benchmark](BENCHMARK.md) · [scénario de campagne](SCENARIO_CAMPAGNE.md) · [matrice de fiabilité](MATRICE_FIABILITE.md) · [première version proposée](PREMIERE_VERSION.md) · [protocole de validation](PROTOCOLE_VALIDATION.md) · [roadmap](../ROADMAP.md) · [décisions](DECISIONS.md) (D-052 à D-057) · démonstration : `npm run prototype`, puis `/suivi` ([DEMARRAGE](DEMARRAGE.md)) · [kit de premiers contacts](terrain/KIT_PREMIERS_CONTACTS.md).

Conventions : **Fait** = établi par le code, les tests ou une source citée. **Hypothèse** = plausible, non vérifiée. **Recommandation** = proposition à décider.

## 1. La vision précisée

Vision donnée par le fondateur le 13/10/2026 (D-052) : un accompagnement agricole accessible de façon autonome, qui aide à préparer une campagne, accompagne pendant la culture (prochaines actions, observations, arrosage, fertilisation, difficultés, dans le périmètre pris en charge), répond par un assistant conversationnel qui utilise le contexte de la campagne, s'appuie éventuellement sur des photos, et suit la culture jusqu'à la récolte et au bilan. Le conseiller humain apporte une expertise sur certains cas ; sa présence n'est pas une condition systématique. L'autonomie n'autorise pas une réponse certaine quand les données ou les connaissances manquent.

**Précision du fondateur, 13/10/2026 (seconde mission) :** AGRIA est un assistant agricole qui accompagne une campagne jusqu'à la récolte et au bilan. Il aide l'utilisateur à savoir quoi faire ensuite, comprendre les difficultés rencontrées, recueillir les observations nécessaires, adapter ses actions au contexte réel de sa campagne et suivre les résultats de ses interventions. **Le journal est la mémoire qui permet cette assistance ; il n'est pas la finalité du produit.** Le conseiller humain construit et valide les connaissances, puis intervient en recours sur certains cas ; l'accès systématique à un conseiller n'est pas une condition d'utilisation. L'assistant conversationnel contextualisé et l'aide par photo font partie de la vision : leur activation dépend de leur évaluation, et leur report au premier essai ne vaut pas abandon.

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

Elles ne sont **pas réécrites** : chacune reste datée dans son document. Elles sont à trancher au fil des décisions (voir §10).

| Décision ou texte | Contenu | Tension | Proposition |
|---|---|---|---|
| PRODUIT §1, D-013 | La première version couvre **seulement** la préparation | Directe | Remplacer par une première version sur un cycle complet, très limitée en diversité (D-054, proposition) |
| PRODUIT §6 | L'IA n'est pas indispensable ; au plus reformuler, résumer, structurer une saisie | Forte | L'assistant devient une composante, sous des règles de fiabilité strictes (D-055, proposition) |
| PRODUIT §8, ROADMAP « Hors périmètre » | Écarte « chatbot agricole ouvert » et « diagnostic photo autonome » | Partielle | Maintenir l'exclusion d'un chatbot **généraliste** et d'un diagnostic **autonome** ; admettre un assistant **limité au périmètre et à la campagne**, et la photo comme **observation documentée** |
| STRATEGIE « Discipline » | Une fonction n'entre que si elle sert F1–F6 | Directe | Élargir le critère au cycle de campagne retenu |
| PRODUIT §2, F5, ROADMAP (promesse) | « Avancer avec un conseiller » au cœur de la promesse | Partielle | L'expertise humaine construit et valide les connaissances, puis intervient en recours sur certains cas ; elle n'est pas une condition d'usage |
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
| Risque principal | Elle a le plus besoin d'aide et dispose de peu de repères pour juger une réponse | Ses habitudes peuvent lui faire rejeter un conseil juste comme accepter un conseil faux : l'expérience ne garantit pas qu'il repère une erreur | Cycle de vente long ; concurrence d'outils installés ; rôle « organisation » à construire |

### Premier public : deux hypothèses à comparer (D-056, remplace D-053)

Aucun public n'est retenu à ce stade. Les entretiens et les essais de la démonstration comparent :

| | Producteurs actifs (B) | Débutants avec un projet concret (A) |
|---|---|---|
| Ce qui plaide pour | Décisions de campagne fréquentes et immédiates ; plusieurs campagnes par an en maraîchage irrigué ; l'utilité en cours de culture peut se mesurer vite | Besoin d'aide le plus large (quoi faire, quand, comment réagir) ; la préparation livrée leur sert déjà ; des programmes les accompagnent |
| Ce qui plaide contre | Habitudes établies, aide déjà disponible chez les pairs ou le vendeur d'intrants ; besoin peut-être limité aux problèmes ponctuels | Moins de repères pour juger une réponse : exige des connaissances relues avant tout conseil appliqué ; accès plus difficile hors programme |
| Ce qu'il faut observer | Décisions récentes difficiles, aide réellement obtenue et délai, usage du téléphone et de la voix, intérêt pour un suivi | Mêmes points, plus la capacité à décrire une observation et le besoin d'être guidé pas à pas |

**Une structure** (coopérative, ONG, programme, entreprise) est un **canal de recrutement ou un payeur potentiel**, pas une ressource acquise : aucune n'a été contactée ni n'a donné son accord ([kit](terrain/KIT_PREMIERS_CONTACTS.md)). Recruter par une structure peut biaiser l'échantillon vers des personnes déjà accompagnées : à noter dans les fiches.

## 5. Positionnement à tester

**Bénéfice pour l'utilisateur, d'abord (proposition) :** *savoir quoi faire ensuite dans sa campagne, comprendre ce qui arrive à sa culture et suivre l'effet de ce qu'il a fait, avec une aide qui tient compte de ce qu'il a réellement fait et observé, et qui dit quand elle ne sait pas.*

**Ce qui le rend possible :** une mémoire structurée de la campagne (prévu, observé, réalisé) que l'assistant consulte avant de répondre, et des connaissances adaptées à la culture et à la zone, relues avant d'être appliquées. La mémoire est le moyen ; l'aide à la décision est la valeur proposée.

Ce que la comparaison des solutions existantes établit et n'établit pas : [BENCHMARK](BENCHMARK.md) §3 et §5. Des concurrents annoncent une personnalisation par profil et usages répétés (FarmerChat) : AGRIA ne revendique aucune exclusivité. La différence à éprouver porte sur l'**adaptation des réponses aux opérations et observations enregistrées d'une campagne**, que les sources consultées ne décrivent pas, sans prouver qu'elle est absente. Le partenariat (contenu, canal vocal, diagnostic) reste à envisager avant de tout construire.

## 6. Principes de fiabilité retenus pour toute la suite (proposition, D-055)

1. **Trois objets distincts, jamais confondus** : le *prévu* (issu d'une référence), l'*observé* (stade, symptôme, daté, déclaré par l'utilisateur), le *réalisé* (opération déclarée faite). Une date théorique ne fait pas avancer un stade ; une proposition ne devient pas une opération réalisée.
2. **Une réponse de l'IA n'est jamais un fait** : elle ne modifie ni une information, ni une opération, ni une observation. L'utilisateur confirme explicitement, dans un formulaire, ce qu'il a observé ou fait (prolongement de D-048).
3. **Toute proposition porte sa provenance** : le dossier de l'utilisateur, une référence relue (nom, version, relecteur), une règle de calcul, ou une connaissance générale non relue (alors signalée comme telle et jamais utilisée pour une dose ou un traitement).
4. **Refuser plutôt qu'inventer** : sans donnée indispensable, demander ; sans connaissance relue, dire qu'aucune recommandation fondée n'est possible et proposer un recours humain.
5. **Aucune dose, aucun produit, aucune date de traitement** qui ne vienne d'une référence relue pour la culture et la zone ; les calculs sont déterministes côté serveur (prolongement de D-028).
6. **Aucun score de confiance affiché** tant qu'il n'a pas été évalué sur des cas locaux.

Le détail par capacité est dans la [matrice de fiabilité](MATRICE_FIABILITE.md).

## 7. Conditions d'avancement (D-057)

Trois catégories de travail, à ne pas confondre :

| Catégorie | Exemples | Condition |
|---|---|---|
| **Possible sans référent agronomique** | Entretiens ; démonstration fictive ; consultation et organisation de l'historique d'une campagne (ce que la personne a déclaré) ; rappels de ce qu'elle a prévu elle-même ; préparation des grilles et des bancs d'évaluation ; développement du recueil des observations et des opérations | Aucun contenu agronomique présenté comme applicable |
| **Conseil agronomique destiné à être appliqué** | Fenêtres d'un calendrier cultural ; repères d'arrosage ; apports ; fiches de problèmes et actions associées | Connaissances adaptées à la culture et à la zone, relues et datées par une personne compétente ([MATRICE_FIABILITE](MATRICE_FIABILITE.md)) |
| **Capacité automatisée** | Réponse générée par un assistant ; suggestion sur photo ; calcul de volume ou de dose | Évaluation propre, sur des cas locaux, avant activation ; un résultat publié par un tiers ne suffit pas |

Le référent agronomique conditionne la deuxième catégorie, pas la première : la démonstration, le kit de terrain et une partie du développement avancent sans lui.

## 8. Ce qu'apporte une première version cohérente

Voir [PREMIERE_VERSION](PREMIERE_VERSION.md) : un cycle complet pour **une** culture, **une** zone, **un** mode de production et une **liste fermée** de conseils et de problèmes, avec un assistant limité à la campagne et au contenu relu. La diversité s'élargit ensuite, pas la profondeur du cycle.

## 9. Préparer la décision suivante

### Hypothèses prioritaires et indices

| Hypothèse | Indices qui la soutiendraient | Indices qui la fragiliseraient |
|---|---|---|
| H1. Pendant la culture, des décisions difficiles se prennent sans aide au bon moment | Cas récents racontés avec leur conséquence ; délai pour obtenir une réponse ; recours au vendeur d'intrants faute d'autre aide | « Je demande à mon voisin et ça suffit » ; aucun cas coûteux récent |
| H2. Une aide qui tient compte de la campagne est comprise et utile tout de suite | Dans le test de la démonstration, la personne trouve seule quoi vérifier, comprend pourquoi, et cite une décision réelle où cela l'aurait aidée | Elle cherche une réponse immédiate (« donne-moi le produit ») et juge les questions inutiles |
| H3. Recueillir observations et opérations est acceptable | Saisie jugée rapide ; préférence exprimée pour la voix ou la photo plutôt que l'écrit, mais pas de refus | « Je n'ai pas le temps de noter » ; abandon dès la deuxième saisie |
| H4. L'aide aux problèmes est le besoin le plus pressant | Problèmes cités en premier ; photos déjà envoyées à quelqu'un | Problèmes rares ou déjà bien couverts |
| H5. La planification (quoi faire et quand) est le besoin le plus pressant | Oublis ou retards d'opérations racontés ; demande de rappels | Calendrier maîtrisé par l'habitude |
| H6. Quelqu'un paierait | Payeur nommé, engagement écrit | Intérêt verbal seulement |

### Informations nécessaires pour choisir public, culture et zone

Les décisions que les personnes trouvent difficiles et leur fréquence ; les cultures réellement conduites et leurs problèmes récurrents ; l'accès aux personnes (canal, langue, téléphone, réseau) ; l'existence de références locales et d'une personne compétente pour les relire ; la saison des campagnes (pour situer un suivi longitudinal) ; un payeur plausible.

### Le plus petit lot fonctionnel après les premiers retours

Il n'est **pas fixé d'avance** : il sera choisi selon l'aide qu'il apporte à une décision de l'utilisateur, d'après les retours.

| Si les retours montrent surtout… | Plus petit lot envisageable | Aide apportée à une décision | Condition |
|---|---|---|---|
| Un besoin d'aide face aux problèmes (H4) | **Signalement guidé d'un problème** : description structurée, photo jointe, questions utiles, suivi de l'évolution, transmission du cas | « Que dois-je regarder, et faut-il demander de l'aide ? » | Questions d'observation génériques sans référent ; hypothèses de cause seulement avec des fiches relues |
| Un besoin de savoir quoi faire et quand (H5) | **Plan de campagne recalé sur les dates réelles**, avec ce qui est à vérifier maintenant | « Que dois-je faire cette semaine ? » | Fenêtres issues d'une fiche relue pour la culture et la zone |
| Un besoin de suivre l'effet de ses actions | **Action déclarée et suivi de son résultat** (observation de suivi, comparaison) | « Ce que j'ai fait a-t-il changé quelque chose ? » | Sans référent, en restant sur des faits déclarés |
| Un besoin d'abord conversationnel | **Assistant limité** au dossier et au contenu relu | Réponse immédiate en contexte | Banc d'évaluation réussi (catégorie « capacité automatisée ») |
| Un besoin hors du suivi (vente, intrants, accès à l'eau) | À recadrer avant tout développement | — | Décision consignée |

Dans tous les cas, l'enregistrement des observations et des opérations n'est construit que dans la mesure où le lot choisi en a besoin : il n'est pas un lot en soi.

## 10. Décisions encore indispensables

1. **Référent agronomique** : qui peut relire les connaissances de la culture et de la zone candidates et noter des réponses, à quelles conditions. Il conditionne tout conseil destiné à être appliqué, pas les entretiens ni la démonstration.
2. **Plafonds et date de départ des premiers contacts** (D-011) : temps, déplacements, éventuel dédommagement.
3. **Accès à distance** pour un essai outillé hors séance supervisée (hébergement, SECURITE §5), seulement quand un lot est prêt à être essayé.

Le choix du public, de la culture et de la zone se fera sur les retours des premiers contacts ; UX3-B reste suspendu.

## 11. Prochaine action concrète

**Pour le fondateur :** utiliser le [kit de premiers contacts](terrain/KIT_PREMIERS_CONTACTS.md) : contacter les premières personnes de l'échantillon exploratoire (producteurs actifs et débutants) et une structure ou un référent, mener les entretiens courts et le test de la démonstration, et remplir les fiches de relevé.

**Pour le développement :** aucun lot n'est engagé avant les premiers retours ; le choix suivra le tableau du §9.
