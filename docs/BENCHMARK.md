# Solutions existantes : comparaison sourcée

Recherche du **13 octobre 2026**, dans le cadre du cadrage produit ([CADRAGE_PRODUIT.md](CADRAGE_PRODUIT.md)), **complétée le même jour** : page FarmerChat de Digital Green Trust, article de l'équipe FarmerChat lu en détail, pages publiques de Plantix, et examen de deux parcours (§5). Sources officielles privilégiées ; une source secondaire est signalée comme telle.

**Aucune de ces solutions n'a été essayée.** Toutes les colonnes décrivent ce que les éditeurs ou des tiers **annoncent** ; les chiffres d'usage, de précision ou d'impact sont ceux des sources, non vérifiés par nous. Une case « non documenté » signifie que la source consultée n'en dit rien, pas que la fonction est absente.

## 1. Sources consultées

| Solution | Source | Nature | Consultée le |
|---|---|---|---|
| Plantix | [plantix.net/en](https://plantix.net/en/) ; [API Toolkit](https://plantix.net/en/plantix-intelligence/api-toolkit/) | Éditeur | 13/10/2026 |
| Plantix | [FAO AgriTech Observatory, fiche « Plantix Crop Doctor »](https://agritechobservatory.review.fao.org/en/plantix-crop-doctor) | Fiche d'observatoire (chiffres fournis par l'éditeur) | 13/10/2026 |
| FarmerChat (Digital Green) | [digitalgreen.org/farmerchat](https://digitalgreen.org/farmerchat/) ; [farmer.chat](https://farmer.chat/) | Éditeur (compteurs d'usage non affichés lors de la consultation) | 13/10/2026 |
| FarmerChat | [Singh et al., arXiv 2409.08916 (v2, 8 octobre 2024)](https://arxiv.org/html/2409.08916v2) | Article des auteurs du service (Digital Green, Microsoft Research), lu jusqu'à la section 6.3.2 | 13/10/2026 |
| FarmerChat (Inde) | [digitalgreentrust.org/farmerchat](https://www.digitalgreentrust.org/farmerchat) | Éditeur (Digital Green Trust, Inde) ; compteurs partiellement non affichés | 13/10/2026 |
| Plantix | [Bibliothèque publique, fiche « Early Blight »](https://plantix.net/en/library/plant-diseases/100321/early-blight/) ; [Plantix Vision API (fr)](https://plantix.net/fr/business/plantix-vision-api) | Éditeur ; page consultée sans compte | 13/10/2026 |
| PlantVillage, Nuru | [plantvillage.psu.edu](https://plantvillage.psu.edu/) ; [IITA, 24 juin 2018](https://iita.org/news-item/african-farmers-get-new-help-against-cassava-diseases-nuru-their-artificially-intelligent-assistant/) | Éditeur, partenaire | 13/10/2026 |
| PlantVillage Nuru | [Mrisho et al., Frontiers in Plant Science, 18 décembre 2020](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2020.590889/full) | Article évalué par les pairs | 13/10/2026 |
| RiceAdvice (AfricaRice) | [africarice.org/riceadvice](https://africarice.org/riceadvice) | Éditeur (page datée © 2020) | 13/10/2026 |
| AKILIMO (IITA) | [APNI, 3 septembre 2020](https://www.apni.net/2020/09/03/new-agronomic-advice-tool-akilimo-is-showing-high-returns-for-cassava-farmers/) ; [rapport final CGIAR](https://repo.mel.cgiar.org/items/73074fc1-13fd-4f1b-bc93-ad201d4ad548/full) | Source secondaire et rapport de projet, non relus en détail | 13/10/2026 |
| Jokalante (Sénégal) | [jokalante.com/solutions](https://jokalante.com/solutions) ; [Le Soleil](https://lesoleil.sn/actualites/economie/ces-startups-qui-se-distinguent-jokalante-simplifie-lacces-aux-informations/) | Éditeur ; presse | 13/10/2026 |
| Farmforce | [farmforce.com](https://www.farmforce.com/) | Éditeur | 13/10/2026 |
| Notes vocales WhatsApp, ANCAR | [Rest of World, 3 juillet 2023](https://restofworld.org/2023/whatsapp-voice-notes-farming-senegal/) | Reportage | 13/10/2026 |
| FAO Crop Calendar | [API publique](https://api-cropcalendar.apps.fao.org/api/v1/countries/SN/aez?language=fr) (interrogée en lecture) | Référence institutionnelle | 13/10/2026 |

## 2. Comparaison

| | Préparation, personnalisation | Continuité du suivi | Questions conversationnelles | Photos | Données demandées | Langues, connexion, canal | Recours humain | Modèle économique public |
|---|---|---|---|---|---|---|---|---|
| **Plantix** | Diagnostic au cas par cas ; la FAO cite aussi un calculateur d'engrais et des alertes | Non documentée sur les pages consultées | Communauté d'« agri-experts » annoncée | Cœur du service : diagnostic et suggestions de traitement « en quelques secondes ». API : **57 cultures, 970 problèmes**, « ~73–74 % de précision sur des images de terrain (~95 % sur un jeu de test choisi) », méthode non décrite | Photo, culture | 19 langues de contenu de traitement (API) ; la FAO cite 18 langues dont 10 indiennes ; **80 % des utilisateurs en Inde** (février 2022–2023) ; français et langues ouest-africaines non trouvés | Communauté | Application gratuite ; revenus par l'API et des services aux entreprises d'intrants ; place de marché en Inde |
| **FarmerChat** | Conseil « adapté aux sols, cultures et climat locaux » via la localisation ; « personnalisé par les profils des producteurs et les usages répétés » (Digital Green Trust) | Historique de conversation utilisé pour reformuler les questions ; questions de suivi suggérées ; **suivi structuré d'une campagne non documenté** (voir §3) | Oui : texte, voix, photo ; IA générative | Photo des feuilles : « dit ce qui ne va pas et comment le corriger » | Question, localisation | Application Android ; langues du menu : anglais, hindi, kannada, amharique, afaan oromoo, haoussa, portugais, espagnol ; pas de wolof ni de français listés | « Pour un problème sérieux, demandez à un expert local » | Gratuit pour l'exploitant ; Digital Green est une organisation à but non lucratif (financement non détaillé sur la page) |
| **PlantVillage Nuru** | Non | Données synchronisées vers des tableaux de bord | Assistant « PlantVillage AI » en bêta (culture, lieu, date de semis) | Détection des symptômes du manioc (mosaïque, striure brune, acariens) et dégâts de chenille légionnaire sur maïs, **hors connexion** | Photo | Swahili, français, anglais, twi (2018) ; Android ; hors connexion | Agents de vulgarisation PlantVillage annoncés dans 12 pays | Application gratuite, organisation de recherche |
| **RiceAdvice** | **Oui, pour une décision** : quel engrais, combien, quand, pour une parcelle de riz, à partir d'un entretien de 5 à 10 minutes et d'un rendement visé | Non | Non | Non | Environnement, pratiques, rendement actuel, prix des engrais | Anglais, français ; **hors connexion** ; Sénégal parmi 13 pays pilotes ; souvent utilisé par un **prestataire** | Prestataires de service formés | Application gratuite ; des prestataires privés peuvent facturer le service |
| **AKILIMO** | **Oui** : conseil engrais, plantation, désherbage, récolte (manioc, puis pomme de terre) selon sol, météo, pratiques, prix | Non documentée | Non | Non | Sol, météo, pratiques, prix, objectif | Application, guides imprimables, messages vocaux (selon source secondaire) | Partenaires de diffusion | Non documenté ici |
| **Jokalante** | Conseil « IA en langue locale », alertes météo (dont ANACIM) | Identité numérique du producteur, géolocalisation de parcelle ; gestion de coopérative (FlowAgri) | Canaux vocaux et IA conversationnelle annoncés (« Saaytu Mbay ») | Non documenté | Inscription par la coopérative | **Wolof, pulaar, sérère, diola, mandingue, soninké** ; SMS, WhatsApp, voix/IVR, USSD ; fonctionne sans internet (IVR) | Coopératives, programmes | Gratuit pour la gestion de coopérative ; offre par campagne (alertes et conseil IA) ; abonnement ; sur devis |
| **Farmforce** | Non (outil de gestion) | Registre des producteurs, cartographie, activités du personnel, traçabilité | Non | Non documenté | Collecte par le personnel de la structure | Web et mobile | La structure elle-même | Logiciel en ligne vendu aux coopératives, ONG, exportateurs |
| **Notes vocales WhatsApp** (pratique) | Non | Non, mais conversation suivie dans un groupe | Oui, entre pairs, conseillers, ONG | Photos échangées dans les groupes | Aucune | Oral, langues locales, réseau intermittent toléré | Oui : réseau de 32 groupes (environ 15 000 membres) relié à des conseillers ; l'ANCAR a diffusé des notes vocales dans au moins 40 groupes (2023) | Gratuit hors coût de la donnée mobile |

Repère de contexte, rapporté et non vérifié : environ **un conseiller agricole pour 10 000 producteurs** au Sénégal (chercheur cité par Rest of World, 2023).

## 3. Ce que la comparaison établit, et ce qu'elle n'établit pas

**Établi, à partir des sources :**

- Le diagnostic par photo existe, gratuit et à grande échelle (Plantix), avec une précision annoncée sensiblement plus basse sur des images de terrain que sur un jeu de test choisi (73–74 % contre ~95 %, méthode non publiée). Une étude évaluée par les pairs sur Nuru a mesuré **65 %** de bonnes identifications pour trois atteintes du manioc, mieux que les agents de vulgarisation testés (40–58 %) et que les producteurs (18–31 %) ; la précision montait à **74–88 %** en examinant six feuilles par plant. Une photo isolée est donc une source d'erreur connue.
- Les assistants conversationnels agricoles existent (FarmerChat, PlantVillage AI en bêta, Jokalante) et certains annoncent une **personnalisation** (profil, localisation, usages répétés, historique de conversation) : voir le tableau ci-dessous. Les sources consultées ne décrivent pas de **mémoire structurée d'une campagne** (prévu, observé, réalisé) ni d'adaptation des réponses aux opérations et observations enregistrées. « Non documenté » ne veut pas dire « absent » : seul un essai ou une documentation plus complète permettrait de conclure.
- FarmerChat publie une évaluation de ses propres réponses (article de l'équipe, 2024) : environ **75 %** des questions reçoivent une réponse, les autres surtout faute de contenu (66 % des non-réponses) ; « fidélité » au contenu jugée élevée pour près de 80 % des requêtes ; pertinence élevée pour 67 %. Mesures internes, méthode décrite par les auteurs, non reproduites par nous. Le diagnostic par photo y est confié à Plantix.
- Les outils dont la recommandation est **validée par des essais** (RiceAdvice, AKILIMO) couvrent une décision précise (surtout la fertilisation), pour une culture, avec des données d'entrée définies, et passent souvent par un prestataire.
- Au Sénégal, l'information agricole circule déjà par la voix, les langues locales et WhatsApp (Jokalante, groupes de producteurs, ANCAR). Un service écrit en français part avec un désavantage d'accès.
- Les outils de suivi existants (Farmforce, gestion de coopérative de Jokalante) servent d'abord la **structure** (traçabilité, conformité, gestion des membres), pas la décision du producteur au champ.

**Non établi :** l'usage réel de ces outils par les publics visés au Sénégal, leur satisfaction, leur effet sur les rendements dans ce contexte, leur couverture des cultures maraîchères locales, et l'absence d'une offre équivalente à celle proposée ici. Les chiffres d'impact publiés par les éditeurs (rendement, revenu, adoption) ne sont pas transférables à AGRIA.

### Mémoire et personnalisation : quatre niveaux à distinguer

| Niveau | FarmerChat | Plantix | PlantVillage | Jokalante |
|---|---|---|---|---|
| Historique de conversation | **Documenté** : les questions sont reformulées à partir de l'historique (article, §4.1) ; persistance d'une session à l'autre non précisée | Non documenté | Non documenté | Non documenté |
| Profil du producteur | **Annoncé** : « personnalisé par les profils des producteurs et les usages répétés » ; parcours d'accueil catégorie puis culture ; localisation | Culture choisie pour le diagnostic | Culture, lieu, date de semis (assistant en bêta) | Identité numérique, parcelle géolocalisée |
| Mémoire structurée d'une campagne (opérations, observations) | Non documentée : les calendriers culturaux sont cités comme contenu à ajouter, pas comme suivi individuel | Non documentée | La date de semis est demandée ; suivi des opérations non documenté | Non documentée (outils orientés coopérative et filière) |
| Adaptation aux opérations et observations enregistrées | Non documentée | Non documentée | Non documentée | Non documentée |

Aucun de ces niveaux n'est présenté ici comme une exclusivité d'AGRIA ; le troisième et le quatrième sont ceux qu'AGRIA chercherait à rendre utiles, et dont l'utilité reste à démontrer.

## 4. Positionnement à tester

**Proposition, non validée.** Pour l'utilisateur : *savoir quoi faire ensuite dans sa campagne, comprendre ce qui arrive à sa culture et suivre l'effet de ce qu'il a fait, avec une aide qui tient compte de ce qu'il a réellement fait et observé, et qui dit quand elle ne sait pas.* Ce qui le rendrait possible : une mémoire structurée de la campagne consultée avant chaque réponse, et des connaissances adaptées à la culture et à la zone, relues avant d'être appliquées.

Pourquoi quelqu'un l'utiliserait plutôt qu'une alternative, **hypothèses à vérifier** :

| Alternative | Ce qu'elle fait bien | Ce qu'AGRIA chercherait à apporter en plus | Ce qui pourrait rendre AGRIA inutile |
|---|---|---|---|
| Voisins, famille, vendeur d'intrants, groupes WhatsApp | Disponibles, oraux, gratuits, en langue locale, connaissance locale | Réponse rattachée à sa propre campagne, trace de ce qui a été fait, bilan comparable d'une campagne à l'autre | Si la mémoire écrite n'aide à aucune décision, ou si l'effort de saisie dépasse le bénéfice |
| Plantix, FarmerChat | Réponse immédiate, photo, gratuit | Continuité (avant, pendant, après), références locales relues, incertitude explicite, culture et zone limitées mais suivies | Si les producteurs visés n'ont besoin que de diagnostics ponctuels et s'en contentent |
| Jokalante | Voix, langues locales, coopératives, alertes | Suivi individuel d'une campagne et réponses contextuelles ; complément possible plutôt que concurrent | Si Jokalante ou un acteur comparable offre déjà ce suivi aux mêmes publics |
| RiceAdvice, AKILIMO | Recommandation validée par essais | Intégration d'une décision validée dans un suivi complet (ces outils montrent la méthode à suivre) | Si aucune recommandation locale validée n'existe pour la culture retenue |
| Conseil public ou d'une structure | Expertise, présence terrain | Préparer et documenter les cas avant l'intervention humaine ; réserver l'humain aux cas qui l'exigent | Si la structure n'a pas besoin d'un dossier ou refuse un outil supplémentaire |

Il n'est ni démontré qu'AGRIA serait unique, ni qu'il serait supérieur, ni qu'il serait rentable. Une conséquence pratique de cette comparaison : **avant de construire, vérifier si un partenariat** (contenu, canal vocal, API de diagnostic) couvre une partie du besoin à moindre coût.

## 5. Deux parcours examinés (13/10/2026)

Méthode : démonstrations publiques, documentation et pages accessibles **sans compte**. Aucun compte n'a été créé, aucune application installée, aucun service payé. Trois niveaux sont distingués : **annoncé** (dit par l'éditeur), **observé** (vu sur une page publique), **essayé** (utilisé par nous) ; **rien n'a été essayé**.

### 5.1 Assistant conversationnel : FarmerChat

| | |
|---|---|
| Parcours examiné | Un producteur veut savoir pourquoi les feuilles jaunissent. Sur [farmer.chat](https://farmer.chat/) : 1) télécharger l'application Android, 2) poser la question en texte, voix ou photo, 3) recevoir un conseil « à appliquer le jour même » |
| Informations demandées (annoncé) | Langue ; catégorie puis culture lors de l'accueil ; localisation « utilisée seulement pour le conseil local » ; la question |
| Réponse (observé) | Deux exemples de réponses publiés sur la page : choix entre compost et fumier pour le chou (conseil général : incorporer en sol humide, arroser) ; signes d'une vache malade, avec renvoi au vétérinaire ou à l'agent d'élevage si les signes persistent. Exemples de questions affichés, dont « Pourquoi mes feuilles jaunissent-elles ? », sans réponse publiée |
| Contextualisation | Annoncé : sol, météo et saison selon la localisation ; profil et usages répétés ; météo et marchés en direct. Documenté par l'article : historique de conversation pour reformuler, contenu vérifié par des experts (guides, manuels, vidéos), suggestions de questions de suivi (plus de 45 % des interactions aux pics d'usage) |
| Suivi | Pas de suivi d'une action ni d'un problème décrit ; recours : « pour un problème sérieux, demandez à un expert local » |
| Limites publiées par l'équipe | Questions sans réponse surtout faute de contenu ; difficulté de nombreux utilisateurs à formuler leurs questions et leurs questions de suivi ; scepticisme quand le conseil contredit la pratique ; coût des données et accès au smartphone |
| Inaccessible ou incertain | Le comportement réel face à une question hors contenu, la persistance du profil, le déroulé exact d'un échange : **non essayés** (application à installer, accès non tenté). Langues du site : anglais, hindi, kannada, amharique, afaan oromoo, haoussa, portugais, espagnol ; ni français ni langue nationale sénégalaise |

### 5.2 Aide par photo : Plantix

| | |
|---|---|
| Parcours examiné | Un producteur photographie une feuille tachée. Annoncé : photo prise avec n'importe quel téléphone, diagnostic et traitement « en quelques secondes ». Observé : la bibliothèque publique, par exemple la fiche « Early Blight » ([lien](https://plantix.net/en/library/plant-diseases/100321/early-blight/)) |
| Informations demandées | La photo (annoncé) ; aucune question sur la situation de l'utilisateur dans la fiche publique (observé) |
| Réponse (observé, fiche publique) | Sections : en bref, cultures hôtes, symptômes, recommandations « contrôle biologique » et « contrôle chimique » (matières actives citées), cause, mesures préventives. La section chimique ne mentionne pas l'homologation locale des produits ; elle rappelle le délai avant récolte. Encadré « Prendre une photo · Voir le diagnostic · Obtenir le traitement » renvoyant à l'application |
| Contextualisation | Annoncé (API) : diagnostic, **indice de confiance** et plan de traitement en 19 langues ; 57 cultures et 970 problèmes ; « ~73–74 % de précision sur des images de terrain (~95 % sur un jeu de test choisi) », méthode non publiée. Pas de prise en compte documentée des opérations déjà faites ni du stade |
| Suivi | Non documenté (pas de revue de l'évolution après traitement décrite) |
| Inaccessible ou incertain | Comportement face à une image floue, une culture non couverte ou des symptômes ambigus : **non documenté** sur les pages consultées ; diagnostic par photo **non essayé** (application à installer). Usage au Sénégal inconnu ; 80 % des utilisateurs en Inde en 2022–2023 selon la FAO |

### 5.3 Ce que ces deux parcours apprennent pour AGRIA

- Une réponse immédiate et un diagnostic en quelques secondes sont l'attente installée : une aide qui pose d'abord des questions doit montrer vite sa valeur (à tester avec la démonstration).
- Les deux solutions documentent leurs **contenus** (fiches, sources vérifiées) davantage que leur **suivi** d'un cas dans le temps.
- La fiche publique de Plantix cite des matières actives sans rappel d'homologation locale : c'est précisément ce que les règles d'AGRIA interdisent sans référence relue ([MATRICE_FIABILITE](MATRICE_FIABILITE.md)).
- FarmerChat montre qu'un contenu vérifié par des experts laisse encore environ un quart des questions sans réponse, surtout faute de contenu : la couverture des connaissances est un travail en soi.

### 5.4 Hypothèses de valeur d'AGRIA restant à tester

1. Une aide qui part de ce que la personne a fait et observé dans sa campagne lui est plus utile qu'une réponse générale ou qu'un diagnostic ponctuel, au moment d'une décision réelle.
2. Le suivi d'un problème (observation, action, évolution) aide à décider de la suite (continuer, changer, demander de l'aide).
3. L'effort de recueillir observations et opérations est acceptable au regard de cette aide, en particulier par la voix ou la photo.
4. Une réponse qui dit « je ne sais pas » et indique quoi observer est acceptée plutôt que rejetée.
5. Ces apports justifient un usage répété et, pour quelqu'un, un paiement.

Aucune de ces hypothèses n'est démontrée ; aucune supériorité sur les solutions examinées n'est affirmée.
