# Produit AGRIA : vision, première version et critères de livraison

Version du 11 octobre 2026, après clarification de la cible par le fondateur.
**Statut : spécification proposée pour la reconstruction ; application non implémentée.**
Le maraîchage est une filière candidate. Culture, zone pilote, canal d'accès et payeur restent à valider.

## 1. Promesse

AGRIA aide un porteur de projet ou un producteur peu accompagné à préparer sa prochaine campagne agricole, comprendre ce qu'il doit vérifier et avancer avec un conseiller.

La vision à terme couvre la préparation, le suivi de campagne et le bilan. La première version couvre seulement la **préparation accompagnée d'une campagne**. Elle doit permettre de décider de poursuivre, modifier ou différer un projet, sans promettre sa rentabilité.

## 2. Deux entrées, un même dossier

| Profil | Entrée | Informations spécifiques |
|---|---|---|
| Débutant avec projet concret | Je prépare ma première campagne | Accès envisagé au terrain, ressources disponibles, connaissances et vérifications à effectuer |
| Producteur déjà actif, peu accompagné | Je prépare ma prochaine campagne | Pratiques précédentes, difficultés constatées, moyens existants et changements envisagés |

Les explications s'adaptent à l'expérience. Les règles de qualité et les permissions restent identiques. Aucun double produit ni double base de données.

Le premier pilote peut ne retenir qu'un profil si les entretiens révèlent des besoins incompatibles. Les curieux sans démarche concrète ne constituent pas la cible initiale.

## 3. Ce que voit l'utilisateur

Application web pensée pour le téléphone, avec peu d'écrans. Le parcours peut être saisi avec l'aide d'un conseiller.

Navigation initiale : **Aujourd'hui · Mon projet · Mon plan · Aide**.
Le budget est une section du projet, les explications une partie des actions. Ne pas créer une grande bibliothèque de cours ni un menu par technologie.

Exemple de structure de l'accueil, sans données de production :

```text
AGRIA                                 Mon compte

Ma prochaine campagne
[Projet] · [Zone] · Préparation

À vérifier avant de poursuivre
Accès à l'eau : information manquante
[Compléter cette information]

Ma prochaine action
Faire confirmer la disponibilité de l'eau
Pourquoi ? Cette information conditionne la suite.
[Voir les étapes]  [Signaler un blocage]

Mon dossier
[Éléments connus]  [Points à vérifier]
[Voir le budget provisoire]

Dernier retour du conseiller
[Aucun retour pour le moment / commentaire daté]
[Ouvrir la discussion du dossier]
```

L'accueil répond à trois questions : où en est mon projet, quelle est ma prochaine action, sur quoi ai-je besoin d'aide ?
Un compteur de tâches réalisées n'est ni une probabilité de réussite ni une validation agronomique.

## 4. Les six fonctions indispensables de la première version

### F1 — Projet et campagne persistants

Collecte progressive : expérience, localisation, terrain et accès, eau, culture envisagée, période souhaitée, temps disponible, matériel, moyens et débouchés envisagés.

- Autoriser « je ne sais pas » ; transformer l'inconnu utile en vérification.
- Distinguer déclaré, estimé, vérifié et non renseigné.
- Reprendre un brouillon après fermeture et reconnexion.
- Ne demander ni polygone GPS ni analyse de sol complète pour commencer.
- Pour l'exploitant, réutiliser les informations existantes sans recopier ses résultats comme prévisions.

**Acceptation :** les deux profils aboutissent au même type de dossier ; les données survivent au redémarrage ; une autre personne non autorisée ne peut pas les lire.

### F2 — Revue des conditions de préparation

Vérifier les informations requises par le modèle local sélectionné : site, eau, moyens, organisation du travail et débouchés. Présenter les points documentés, les inconnues et les points à faire relire.

- Aucune note universelle « projet viable à 87 % ».
- Expliquer pourquoi chaque information compte et quelle vérification est possible.
- Une information bloquante suspend l'étape concernée, pas nécessairement tout le dossier.
- Recommander un avis humain lorsque les données ou le contenu validé ne suffisent pas.
- Distinguer dossier complet et faisabilité réelle.

**Acceptation :** une donnée manquante n'est pas remplacée par une valeur supposée ; le retour contient une action et sa justification ; il ne présente pas un avis automatique comme une expertise terrain.

### F3 — Plan d'action avec apprentissage intégré

Chaque action possède un objectif, des étapes courtes, une explication, une échéance si connue, des prérequis, un statut et un résultat.

- Utiliser un modèle de préparation relu pour la zone/culture du pilote.
- Statuts : à faire, en cours, bloquée, terminée ; le motif d'un blocage peut être saisi.
- Les tâches de préparation sont prioritaires ; pas de calendrier agronomique universel généré à partir d'une seule date.
- Une modification importante du projet signale le besoin de revoir le plan ; elle ne réécrit pas silencieusement les actions terminées.
- L'explication est disponible au moment de faire l'action, sans imposer un cours complet.

**Acceptation :** terminer une action enregistre son résultat ; un envoi échoué ne montre pas de succès ; le conseiller peut comprendre ce qui a réellement été fait.

### F4 — Budget prévisionnel transparent

Liste minimale : poste, quantité, unité, prix unitaire, source/devis, date et état connu ou estimé. Montants en FCFA/XOF au pilote.

- Calculs déterministes sur le serveur, aucune somme confiée au LLM.
- Afficher le total des postes renseignés et les postes manquants.
- Distinguer investissement et dépenses de campagne pour éviter de tout compter comme coût récurrent.
- Éviter le double compte d'un équipement déjà détenu.
- Les hypothèses de recettes, si collectées, restent séparées et non garanties.
- Aucun crédit, paiement, scoring financier ou dossier bancaire automatique.

**Acceptation :** une ligne non chiffrée laisse le budget marqué incomplet ; les unités et arrondis sont définis ; deux envois de la même ligne ne la dupliquent pas.

### F5 — Conseil humain rattaché au dossier

Questions et commentaires associés au projet, à une action ou à une ligne de budget. Interface minimale du conseiller : dossiers attribués, demandes ouvertes, contexte et retours.

- Un conseiller identifié relit les points critiques du pilote.
- Aucune disponibilité ni réponse instantanée fictive.
- Une relecture mentionne auteur, date, périmètre, version et réserves.
- Un changement d'une donnée revue marque les avis affectés comme à réexaminer.
- Le conseiller ne voit pas les projets qui ne lui sont pas attribués.

**Acceptation :** question persistée, statut visible, notification interne ou liste de demandes suffisante au pilote ; aucun annuaire payant ou réservation nécessaire.

### F6 — Synthèse et historique partageables

Une vue relie situation, informations vérifiées/manquantes, budget, actions et retours. Fournir au minimum une vue imprimable ou un export simple à accès contrôlé.

- Statuts du dossier : brouillon, à compléter, en revue, revu avec réserves ou sans réserve sur le périmètre examiné, différé, archivé.
- « Revu » ne signifie pas « projet rentable », « financement obtenu » ou « succès garanti ».
- Conserver les décisions et raisons de poursuivre, modifier ou différer.
- Ne pas créer de lien public par défaut.

**Acceptation :** la synthèse permet au porteur et au conseiller de retrouver la même version, avec dates et inconnues ; l'export n'est pas accessible à un autre compte sans permission.

## 5. Conditions transversales de livraison

Authentification fiable, autorisation côté serveur, sauvegarde durable, restauration testée, erreurs explicites, mise en page téléphone et suivi des versions.

La connexion exacte (email, téléphone, accès assisté) suit les entretiens et le fournisseur retenu. Ne pas exiger plusieurs canaux d'authentification dès le départ.

Première version : connexion requise pour confirmer une sauvegarde. Garder la saisie durant une erreur de requête et proposer une reprise sans doublon. L'accès hors connexion complet et la synchronisation multi-appareils sont différés ; les rendre prioritaires uniquement si le pilote ne peut fonctionner sans eux.

Les clés fournisseurs restent côté serveur. Aucune donnée d'un autre projet ne doit entrer dans une réponse ou un export.

## 6. Place de l'IA et des données

L'IA n'est pas indispensable à F1–F6. Si un essai est justifié, la limiter à reformuler un contenu relu, résumer le dossier ou aider à structurer une saisie que l'utilisateur confirme.

Elle ne décide pas d'une culture « idéale », ne promet pas de rendement, ne calcule pas le budget et ne remplace pas la relecture locale. Une panne de modèle ne doit pas empêcher d'accéder au dossier et au plan.

Météo et capteurs viennent après validation d'un besoin de suivi pendant la campagne. Chaque ajout doit démontrer l'action qu'il améliore. Une API n'est pas une fonctionnalité client en soi.

## 7. Vision d'évolution, conditionnelle aux preuves

| Horizon | Valeur | Condition préalable |
|---|---|---|
| Version initiale | Préparer une campagne avec un dossier et des actions relus | Modèle de contenu local, conseiller, utilisateurs et critères de test |
| Extension de suivi | Journal terrain, dépenses réelles, observations et adaptations du plan | Utilisation de la préparation et demandes récurrentes de suivi |
| Bilan de campagne | Comparaison prévu/réel et préparation de la suivante | Données de campagne suffisantes et interprétation accompagnée |
| Données environnementales ciblées | Météo ou capteurs pour une décision identifiée | Gain marginal plausible, qualité et maintenance faisables |
| Extension commerciale | Autre groupe ou zone comparable | Service reproductible et coût soutenable |

Ce tableau décrit une direction, pas une liste de fonctionnalités à construire maintenant.

## 8. Ce que nous écartons au lancement

Marketplace, réseau social, plateforme de cours généraliste, chatbot agricole ouvert, diagnostic photo autonome, automatisation d'irrigation, matériel propriétaire, satellite, fintech et toutes cultures/tous pays.

La photo comme justificatif peut être ajoutée si nécessaire au pilote ; elle ne crée pas un service de diagnostic.

## 9. Scénarios de recette du parcours complet

1. Un débutant crée son dossier avec une source d'eau inconnue ; AGRIA propose une vérification et conserve son brouillon.
2. Un producteur décrit son prochain projet sans suivre toutes les explications d'initiation ; les mêmes contrôles de contexte restent appliqués.
3. Un poste non chiffré reste visible et le budget ne se présente pas comme complet.
4. Une action bloquée garde son motif ; une reprise réseau ne crée pas deux actions ou deux dépenses.
5. Un conseiller ne voit que ses dossiers attribués ; le refus est appliqué par l'API.
6. Un avis sur une ancienne version reste consultable mais n'apparaît pas comme actuel après modification des données concernées.
7. Un utilisateur reprend son projet après redémarrage et obtient une synthèse fidèle.
8. Un conseiller absent ou une API externe indisponible produit un état explicite, sans faux avis ni faux succès.

Ces scénarios constituent des critères de future implémentation ; ils ne sont pas des tests déjà exécutés.

## 10. Mesure de valeur

Au pilote : vérifier si les participants passent d'un projet incomplet à une décision documentée et à des démarches réellement effectuées. Mesurer séparément débutants et exploitants actifs.

Indicateurs : dossiers commencés et terminés selon définition fixée, inconnues réellement clarifiées, actions effectuées, temps de conseil, coût par dossier et engagement de poursuite.

Une décision argumentée de différer peut être utile. Ni le nombre d'écrans remplis ni le nombre de messages ne prouvent un revenu amélioré. Un gain économique agricole exige un suivi ultérieur approprié.

Références : [stratégie](STRATEGIE.md), [architecture](ARCHITECTURE.md), [roadmap](../ROADMAP.md), [validation terrain](VALIDATION_TERRAIN.md).
