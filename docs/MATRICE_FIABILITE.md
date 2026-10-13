# Matrice de fiabilité : capacités, données, connaissances, validation

Version du **13 octobre 2026**. **Proposition** ([CADRAGE_PRODUIT.md](CADRAGE_PRODUIT.md) §6, D-055). Elle dit à quelles conditions chaque capacité de la vision peut être activée. **Aucune dose, aucun volume, aucun produit, aucune date de culture n'est donné ici.** Aucune de ces capacités n'existe dans le code au 13/10/2026.

## 1. Synthèse

| Capacité | Données indispensables | Connaissances nécessaires | Rôle de l'IA | Validation avant activation | Proposition pour le premier essai |
|---|---|---|---|---|---|
| Calendrier cultural | Culture, zone, mode (semis direct ou pépinière), dates **réelles** de semis ou repiquage | Fiche relue de la culture pour la zone (fenêtres d'opérations et de stades) | Aucune dans le calcul ; reformuler, répondre « où en suis-je » | Relecture datée de la fiche ; comparaison avec le suivi réel de l'essai | **Oui**, en fenêtres, recalé sur les dates réelles |
| Eau, arrosage | Source, mode d'arrosage, surface, stade | Repères qualitatifs relus ; calcul de besoin (FAO-56) seulement s'il est paramétré localement | Aucune dans un calcul ou un volume | Calcul comparé à l'avis du référent et aux pratiques observées | **Repères qualitatifs seulement** ; pas de volume |
| Fertilisation | Culture, surface, stade, apports déjà faits, produits disponibles | Recommandation locale relue par culture, zone et stade | Aucune dans une dose | Table relue ; méthode d'essai comparable à RiceAdvice ou AKILIMO pour aller plus loin | **Rappel des apports prévus par la fiche relue, sans calcul nouveau** ; sinon recours humain |
| Symptômes | Culture, stade, description structurée (organe, répartition, évolution), événements récents | Fiches de problèmes relues, avec questions qui distinguent les causes et actions associées | Structurer la description, retrouver la fiche, poser ses questions | Banc de cas notés par le référent ; suivi des cas réels de l'essai | **Oui, pour une liste fermée de problèmes** ; hors liste, recours humain |
| Photo | Image exploitable de l'organe atteint, culture connue | Pour une suggestion automatique : un modèle évalué sur des images locales | Décrire l'image ; suggestion automatique seulement après évaluation | Jeu d'images locales étiquetées par un expert | **Pièce jointe et contrôle de qualité** ; pas d'identification automatique |
| Assistant conversationnel | Dossier et journal de la campagne, question | Contenu relu indexé ; règles de refus | Comprendre la question, chercher dans le dossier et le contenu relu, formuler avec provenance | Banc de questions notées ; zéro réponse dangereuse tolérée | **Oui, limité au dossier et au contenu relu** |

## 2. Calendrier cultural

| Élément | Contenu |
|---|---|
| Données indispensables | Culture ; zone ; mode d'implantation ; date réelle de semis, de repiquage ou de plantation |
| Données facultatives | Variété ou durée de cycle si elle est connue ; stade observé ; dates réelles des opérations précédentes |
| Sources adaptées | [FAO Crop Calendar](https://api-cropcalendar.apps.fao.org/api/v1/countries/SN/aez?language=fr) : couvre le Sénégal (110 cultures, dont oignon, tomate, chou, piment, gombo, aubergine, pomme de terre ; six zones agro-écologiques dont les Niayes et la Vallée du fleuve ; interrogé le 13/10/2026) comme point de départ ; itinéraires techniques de l'ISRA/CDH (à obtenir : non trouvés en ligne le 13/10/2026) ; relecture par le référent |
| Règles ou calculs | Fenêtres relatives à la date réelle (« entre `[a]` et `[b]` jours après repiquage ») ; recalage à chaque date réelle déclarée ; le stade **observé** prime sur le stade **estimé** ; aucune opération n'est jamais marquée faite par le calendrier |
| Rôle précis de l'IA | Répondre en langage courant à partir du plan calculé ; ne crée ni ne modifie aucune date |
| Demander une information | Date réelle inconnue ; mode d'implantation inconnu ; observation contradictoire avec l'estimation |
| Pas de recommandation fondée | Culture ou zone hors du contenu relu ; variété au cycle très différent de la fiche ; période hors des fenêtres documentées (afficher alors « hors des références disponibles ») |
| Validation agronomique | Relecture datée de la fiche (mécanisme D-026) ; pendant l'essai, comparer fenêtres proposées et dates réelles des producteurs, et noter avec le référent les écarts qui révèlent une fiche fausse |

## 3. Eau et arrosage

| Élément | Contenu |
|---|---|
| Données indispensables | Source d'eau ; mode d'arrosage (arrosoir, tuyau, goutte-à-goutte, gravitaire) ; surface ; stade |
| Données facultatives | Débit ou contenance de l'équipement ; type de sol déclaré ; salinité connue ; données météo (évapotranspiration de référence) |
| Sources adaptées | [FAO, méthode Penman–Monteith (Bulletin 56)](https://www.fao.org/4/x0490e/x0490e06.htm) pour le besoin théorique ; repères locaux du référent et de l'ISRA/CDH ; pratiques observées pendant l'essai |
| Règles ou calculs | Un besoin théorique (évapotranspiration de la culture) ne devient un volume par arrosage qu'en connaissant surface, équipement, sol et pluie efficace : calcul **déterministe côté serveur**, jamais par l'IA, et **désactivé** tant qu'il n'est pas validé localement |
| Rôle précis de l'IA | Rappeler les repères qualitatifs relus (signes de manque ou d'excès d'eau à observer) ; expliquer pourquoi aucun volume n'est donné |
| Demander une information | Surface ou équipement inconnus ; source d'eau changée ; signes contradictoires (flétrissement malgré arrosage déclaré) |
| Pas de recommandation fondée | Absence de calcul validé ; sol ou salinité inconnus quand la fiche dit qu'ils changent la conduite ; panne ou restriction d'eau (alors : aide à la décision humaine, pas de consigne) |
| Validation agronomique | Comparer le calcul à l'avis du référent sur des cas réels de l'essai ; activer un volume seulement après accord écrit du référent sur sa méthode et ses limites |

## 4. Fertilisation

| Élément | Contenu |
|---|---|
| Données indispensables | Culture ; surface ; stade ; apports déjà faits (organiques et minéraux, tels que déclarés) ; produits réellement disponibles |
| Données facultatives | Analyse de sol ; historique de la parcelle ; objectif de rendement ; prix |
| Sources adaptées | Recommandations locales relues (ISRA/CDH, conseil public, référent) ; les outils validés par essais (RiceAdvice pour le riz, AKILIMO pour le manioc, [BENCHMARK](BENCHMARK.md)) montrent la méthode, pas des valeurs transférables au maraîchage |
| Règles ou calculs | Reprendre **telle quelle** une table relue (culture × zone × stade) ; conversion à la surface déclarée par calcul déterministe ; aucune extrapolation à une autre culture, zone ou forme d'engrais |
| Rôle précis de l'IA | Expliquer la table et l'état des apports du journal ; jamais produire ou ajuster une dose |
| Demander une information | Surface ou apports antérieurs inconnus ; produit disponible absent de la table |
| Pas de recommandation fondée | Aucune table relue pour la culture et la zone ; produit non couvert ; symptôme évoquant une carence non confirmée (renvoyer à la capacité « symptômes ») |
| Validation agronomique | Relecture de la table ; pour toute recommandation propre à AGRIA, essais au champ conduits ou supervisés par un organisme compétent, comme ceux décrits pour RiceAdvice et AKILIMO ; sans cela, pas de dose propre |

## 5. Symptômes et problèmes

| Élément | Contenu |
|---|---|
| Données indispensables | Culture ; stade ; organe atteint ; aspect ; répartition (plantes isolées ou parcelle) ; date d'apparition et évolution ; arrosages, apports et traitements récents |
| Données facultatives | Photos ; météo récente ; cultures voisines ; antécédents de la parcelle |
| Sources adaptées | Fiches relues pour une **liste fermée** de problèmes fréquents de la culture retenue, rédigées ou validées par le référent (sources candidates : ISRA/CDH, conseil public, fiches d'organismes internationaux, à vérifier) |
| Règles ou calculs | Arbre de questions de la fiche ; hypothèses présentées comme « compatibles avec », jamais classées par un pourcentage non évalué ; trois niveaux tenus séparés : **observation** (ce que l'utilisateur voit), **hypothèse** (ce que la fiche rend possible), **diagnostic confirmé** (par un expert, une analyse ou un critère prévu par la fiche) |
| Rôle précis de l'IA | Transformer une description libre en description structurée, à faire confirmer ; retrouver la fiche ; poser ses questions ; rédiger la réponse avec provenance |
| Demander une information | Toute donnée indispensable manquante ; réponses incompatibles entre elles ; plusieurs symptômes mêlés |
| Pas de recommandation fondée | Problème hors liste ; plusieurs causes plausibles que la fiche ne départage pas (carence, maladie, stress hydrique ou salin, dégât d'insecte, phytotoxicité) ; aggravation rapide ; tout cas où une erreur exposerait la santé ou la récolte entière : renvoi au recours humain |
| Traitements | Seulement ceux que cite la fiche relue, avec leurs conditions ; une liste de produits n'est établie que par le référent à partir des autorisations en vigueur (autorité d'homologation à confirmer pour le Sénégal) ; jamais un produit proposé par l'IA |
| Validation agronomique | Banc de cas (descriptions, photos, contexte) noté par le référent ; pendant l'essai, chaque cas réel est revu : hypothèse retenue, action, issue observée |

## 6. Photo

| Élément | Contenu |
|---|---|
| Statuts distincts | **Observation visuelle** (ce que montre l'image, décrit et confirmé par l'utilisateur) ≠ **hypothèse** (ce qui serait compatible) ≠ **diagnostic confirmé** (par un expert ou une analyse). Une suggestion automatique reste une hypothèse |
| Images inutilisables | Floue, trop éloignée, contre-jour, organe atteint absent, plante entière sans détail : signaler et donner un conseil de prise de vue ; ne rien en conclure |
| Cas non pris en charge | Culture hors périmètre ; problème hors liste ; image d'autre chose qu'une plante : le dire explicitement |
| Symptômes ambigus | Plusieurs causes visuellement proches : demander d'autres vues (feuilles jeunes et âgées, face inférieure, plusieurs plantes), puis questions de la fiche |
| Composants existants à examiner avant tout entraînement | **API Plantix** (57 cultures, 970 problèmes annoncés ; « ~73–74 % de précision sur des images de terrain », méthode non publiée) ; modèles **PlantVillage** (Nuru : 65 % sur trois atteintes du manioc en 2020, 74–88 % en examinant six feuilles, étude évaluée par les pairs) ; un modèle multimodal général pour **décrire** une image, pas pour identifier une maladie. Sources : [BENCHMARK](BENCHMARK.md) |
| Entraîner notre propre modèle | **Non proposé** : il faudrait des milliers d'images locales étiquetées par des experts, avec consentement, pour une liste de problèmes ; à réexaminer seulement si les composants existants échouent sur un jeu local et si l'essai a constitué ce jeu |
| Données et vie privée | Photos stockées comme données personnelles du dossier (même accès que le dossier) ; aucune réutilisation pour entraîner un modèle, ni envoi à un service tiers, sans consentement explicite et décision consignée ; envoi à une API externe = transfert de données à évaluer (hébergement, D-006) |
| Score de confiance | Aucun affiché tant qu'il n'a pas été calibré sur un jeu local ; un score fourni par un tiers n'est pas une garantie |
| Validation | Jeu d'images locales étiquetées par le référent ; mesurer bonnes identifications, erreurs graves et refus par problème, **avant** toute activation d'une suggestion automatique |

## 7. Assistant conversationnel

| Élément | Contenu |
|---|---|
| Données indispensables | Le dossier et le journal de la campagne de la personne (et d'aucune autre) ; la question |
| Connaissances | Contenu relu (préparation, calendrier, fiches) indexé avec sa version ; règles de refus |
| Ce qu'il fait | Répond aux questions sur la campagne (« quand ai-je repiqué ? »), explique le plan et les fiches, aide à décrire un problème, prépare la transmission d'un cas au recours humain |
| Ce qu'il ne fait pas | Créer ou modifier un fait, une observation ou une opération ; donner une dose, un volume, un produit ou une date de traitement absents du contenu relu ; recommander une culture « idéale » ; promettre un rendement ; répondre sur un autre dossier |
| Provenance obligatoire | Chaque élément de réponse est rattaché à : votre dossier · une référence relue (nom, version) · une règle de calcul · une connaissance générale **non relue**, signalée comme telle et interdite pour une consigne agronomique |
| Demander une information | Question ambiguë ; donnée indispensable de la capacité concernée absente du dossier |
| Refuser | Hors périmètre ; aucune référence relue ; risque pour la santé ou la récolte ; demande de certitude que les données ne permettent pas |
| Exigences techniques | Appels au fournisseur depuis le serveur seulement (clés jamais dans le navigateur, [SECURITE](SECURITE.md)) ; journalisation des questions, réponses et sources pour la relecture ; fonctionnement du dossier sans l'assistant en cas de panne ; coût par réponse suivi |
| Validation | Banc de questions réelles (issues de l'essai concierge) noté par le référent : exact, applicable, sûr, provenance juste, refus approprié ; **aucune réponse jugée dangereuse** admise avant activation ; nouvelle notation à chaque changement de modèle ou de contenu |

## 8. Méthode générale de validation agronomique

1. **Relecture datée** de chaque contenu (fiches, tables, listes) par un référent identifié, avec périmètre (culture, zone, mode) : mécanisme existant de versions immuables (D-026, D-042).
2. **Bancs d'essai** constitués à partir de cas réels (questions, descriptions, photos), notés par le référent selon une grille fixe ; double notation sur un échantillon pour vérifier la cohérence des notes.
3. **Activation par capacité** : une capacité n'est proposée aux utilisateurs qu'une fois ses critères atteints ; sinon elle reste désactivée et le système le dit.
4. **Suivi pendant l'essai** : chaque décision prise avec AGRIA est rattachée à son issue observée (problème résolu, aggravé, sans suite) ; les écarts reviennent au référent.
5. **Ce qui n'est pas une validation** : une démonstration fictive, des tests logiciels, un taux de précision publié par un tiers, un retour enthousiaste.
