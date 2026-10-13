# Solutions existantes : comparaison sourcée

Recherche du **13 octobre 2026**, dans le cadre du cadrage produit ([CADRAGE_PRODUIT.md](CADRAGE_PRODUIT.md)). Sources officielles privilégiées ; une source secondaire est signalée comme telle.

**Aucune de ces solutions n'a été essayée.** Toutes les colonnes décrivent ce que les éditeurs ou des tiers **annoncent** ; les chiffres d'usage, de précision ou d'impact sont ceux des sources, non vérifiés par nous. Une case « non documenté » signifie que la source consultée n'en dit rien, pas que la fonction est absente.

## 1. Sources consultées

| Solution | Source | Nature | Consultée le |
|---|---|---|---|
| Plantix | [plantix.net/en](https://plantix.net/en/) ; [API Toolkit](https://plantix.net/en/plantix-intelligence/api-toolkit/) | Éditeur | 13/10/2026 |
| Plantix | [FAO AgriTech Observatory, fiche « Plantix Crop Doctor »](https://agritechobservatory.review.fao.org/en/plantix-crop-doctor) | Fiche d'observatoire (chiffres fournis par l'éditeur) | 13/10/2026 |
| FarmerChat (Digital Green) | [digitalgreen.org/farmerchat](https://digitalgreen.org/farmerchat/) ; [farmer.chat](https://farmer.chat/) | Éditeur (compteurs d'usage non affichés lors de la consultation) | 13/10/2026 |
| FarmerChat | [Singh et al., arXiv 2409.08916 (v2, 8 octobre 2024)](https://arxiv.org/abs/2409.08916v2) | Article des auteurs du service (Digital Green, Microsoft Research) | 13/10/2026 |
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
| **FarmerChat** | Conseil « adapté aux sols, cultures et climat locaux » via la localisation | **Mémoire du contexte de l'exploitant non documentée** ; seule la localisation est mentionnée | Oui : texte, voix, photo ; IA générative | Photo des feuilles : « dit ce qui ne va pas et comment le corriger » | Question, localisation | Application Android ; langues du menu : anglais, hindi, kannada, amharique, afaan oromoo, haoussa, portugais, espagnol ; pas de wolof ni de français listés | « Pour un problème sérieux, demandez à un expert local » | Gratuit pour l'exploitant ; Digital Green est une organisation à but non lucratif (financement non détaillé sur la page) |
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
- Les assistants conversationnels agricoles existent (FarmerChat, PlantVillage AI en bêta, Jokalante). Aucune des pages consultées ne décrit une **mémoire de la campagne** (ce qui a été prévu, observé et fait) utilisée dans les réponses.
- Les outils dont la recommandation est **validée par des essais** (RiceAdvice, AKILIMO) couvrent une décision précise (surtout la fertilisation), pour une culture, avec des données d'entrée définies, et passent souvent par un prestataire.
- Au Sénégal, l'information agricole circule déjà par la voix, les langues locales et WhatsApp (Jokalante, groupes de producteurs, ANCAR). Un service écrit en français part avec un désavantage d'accès.
- Les outils de suivi existants (Farmforce, gestion de coopérative de Jokalante) servent d'abord la **structure** (traçabilité, conformité, gestion des membres), pas la décision du producteur au champ.

**Non établi :** l'usage réel de ces outils par les publics visés au Sénégal, leur satisfaction, leur effet sur les rendements dans ce contexte, leur couverture des cultures maraîchères locales, et l'absence d'une offre équivalente à celle proposée ici. Les chiffres d'impact publiés par les éditeurs (rendement, revenu, adoption) ne sont pas transférables à AGRIA.

## 4. Positionnement à tester

**Proposition, non validée.** AGRIA serait **le carnet de campagne qui accompagne** : pour une culture et une zone prises en charge, il garde la mémoire de ce qui a été prévu, observé et réellement fait, propose la prochaine action à partir de références locales relues, répond aux questions en s'appuyant sur cette mémoire, et dit clairement quand il ne sait pas ou quand un avis humain est nécessaire.

Pourquoi quelqu'un l'utiliserait plutôt qu'une alternative, **hypothèses à vérifier** :

| Alternative | Ce qu'elle fait bien | Ce qu'AGRIA chercherait à apporter en plus | Ce qui pourrait rendre AGRIA inutile |
|---|---|---|---|
| Voisins, famille, vendeur d'intrants, groupes WhatsApp | Disponibles, oraux, gratuits, en langue locale, connaissance locale | Réponse rattachée à sa propre campagne, trace de ce qui a été fait, bilan comparable d'une campagne à l'autre | Si la mémoire écrite n'aide à aucune décision, ou si l'effort de saisie dépasse le bénéfice |
| Plantix, FarmerChat | Réponse immédiate, photo, gratuit | Continuité (avant, pendant, après), références locales relues, incertitude explicite, culture et zone limitées mais suivies | Si les producteurs visés n'ont besoin que de diagnostics ponctuels et s'en contentent |
| Jokalante | Voix, langues locales, coopératives, alertes | Suivi individuel d'une campagne et réponses contextuelles ; complément possible plutôt que concurrent | Si Jokalante ou un acteur comparable offre déjà ce suivi aux mêmes publics |
| RiceAdvice, AKILIMO | Recommandation validée par essais | Intégration d'une décision validée dans un suivi complet (ces outils montrent la méthode à suivre) | Si aucune recommandation locale validée n'existe pour la culture retenue |
| Conseil public ou d'une structure | Expertise, présence terrain | Préparer et documenter les cas avant l'intervention humaine ; réserver l'humain aux cas qui l'exigent | Si la structure n'a pas besoin d'un dossier ou refuse un outil supplémentaire |

Il n'est ni démontré qu'AGRIA serait unique, ni qu'il serait supérieur, ni qu'il serait rentable. Une conséquence pratique de cette comparaison : **avant de construire, vérifier si un partenariat** (contenu, canal vocal, API de diagnostic) couvre une partie du besoin à moindre coût.
