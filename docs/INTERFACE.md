# Guide d'interface

Mise à jour : 13 octobre 2026 (UX3-A : parcours débutant intégré, navigation par espace, synthèse et sujets). Ce guide décrit les conventions **appliquées dans le code** (`frontend/src`) et la façon dont elles sont vérifiées.

**Conception à venir (D-051) :** UX1 dans [ROADMAP.md](../ROADMAP.md) autorise un prototype navigable distinct pour réexaminer les parcours, la navigation et la composition visuelle. Les conventions ci-dessous décrivent l'existant ; elles ne figent pas la proposition. Les droits, la fidélité des données et l'accessibilité restent des exigences. Distinguer toute proposition de ce qui est effectivement intégré. Proposition UX1 livrée sous forme de prototype séparé (`frontend/prototype`) : organisation par sujet, démarrage en deux étapes, file de travail du conseiller ; **non intégrée**, à évaluer en UX2 ([AVANCEMENT.md](AVANCEMENT.md), « UX1 »).

## Navigation

- Porteur (UX3-A) : **Projet · Démarches · Budget · Conseiller · Aide**. « Projet » ouvre la synthèse (`/d/:id`) ; les sujets (`/d/:id/sujet/:sujet`), les premières questions (`/d/:id/demarrer`) et « Toutes les informations » (`/d/:id/projet`) en relèvent. « Démarches » ouvre `/d/:id/plan`, « Budget » `/d/:id/projet/budget`, « Conseiller » la relecture et les échanges (`/d/:id/relecture`, synthèse imprimable comprise).
- Conseiller : **Aujourd'hui · Projet · Plan · Échanges · Aide** (accueil existant conservé, avec la lecture par sujet ; refonte prévue en UX3-B).
- Les adresses antérieures restent valides (`/projet`, `/projet/pas-a-pas`, `/projet/:information`, `/plan`, `/relecture`, `/synthese`) : seuls les libellés de navigation ont changé.
- Le prototype (`frontend/prototype`) reste isolé : une règle ESLint interdit tout import depuis `src`.
- Sur téléphone, la navigation est en bas de l'écran (cibles de 48 px de haut) ; sur ordinateur, sous l'en-tête.
- Les adresses portent l'identifiant du dossier : un lien envoyé au conseiller ouvre le bon dossier.
- Un lien vers une ancre (`#messages`, `#decisions`, `#donner-avis`) amène à la section et y place le focus une fois la page chargée.

## Vocabulaire selon le rôle

Déduit d'une seule règle, celle du serveur : seul le porteur d'un dossier non archivé modifie les informations, les démarches et le budget (`frontend/src/features/dossiers/roles.ts`). Aucun lien ne promet une modification que sa destination refuse.

| Contexte | Titres et navigation | Lien vers une information | Actions propres |
|---|---|---|---|
| Porteur, dossier actif | « Projet », « Démarches », « Toutes les informations », retours « ← Projet » et « ← Démarches » | « Compléter », « Répondre » ou « Mettre à jour » | Toutes celles du porteur |
| Porteur, dossier archivé | Mêmes espaces ; synthèse au passé (« Ce qui était indiqué », « Les sujets à l'archivage ») | « Consulter l'information » | Relire la synthèse, préparer une autre campagne |
| Conseiller | « Projet », « Plan », titre « Plan du projet », retours « ← Projet » et « ← Plan du projet » ; bandeau nommant le porteur, le projet et la campagne | « Consulter l'information » | Poser une question, répondre, donner un avis |

## Accueil : une seule action principale

Calculée à un seul endroit (`frontend/src/features/dossiers/priority.ts`) à partir du plan, des informations et des échanges déjà chargés. Une seule carte porte la priorité visuelle ; les autres actions utiles restent listées dessous (« Aussi possible »). Aucune dépendance agronomique n'est inventée : l'ordre est un choix de présentation qui n'interdit aucune action.

Porteur, dans l'ordre d'évaluation :

| Situation observée | Action principale | Actions secondaires | Justification |
|---|---|---|---|
| Données en chargement | Aucune (indicateur) | — | Ne rien affirmer avant d'avoir lu le dossier |
| Plan ou échanges indisponibles | Aucune ; message d'erreur et « Réessayer » | Navigation habituelle | Jamais de faux « rien à faire » ni « aucun retour » |
| Dossier archivé | « Relire la synthèse » (consultation) | Préparer une autre campagne | Plus aucune modification possible |
| Projet différé | Rappel de la décision (auteur, date, motif), puis « Enregistrer une nouvelle décision » pour reprendre | La démarche ou la saisie qui reprendrait, présentée comme « si vous reprenez » | La décision est rappelée avant toute reprise |
| Question du conseiller attendant la réponse du porteur | « Répondre au conseiller » | Démarche ou saisie en cours ; points bloquants toujours affichés | Une personne attend ; répondre la débloque |
| Démarche en cours | « Continuer : [démarche] » | Informations à renseigner, autres démarches | Reprendre ce qui est commencé |
| Information bloquante non renseignée | Renseigner : premières questions puis pas-à-pas (débutant) ou « Compléter : [information] » (producteur) | Démarche disponible, présentée comme pouvant avancer en parallèle | Les règles marquent cette information comme bloquante ; la démarche n'en dépend pas dans le plan |
| Débutant : premières questions sans réponse (hors réponses remises à plus tard) | « Répondre aux premières questions » ou « Reprendre les premières questions » | Démarche disponible, présentée comme pouvant avancer en parallèle | Terminer un démarrage interrompu ; ordre de présentation seulement (UX3-A) |
| Démarche disponible (à faire, préalables terminés) | « Ouvrir la démarche » | Informations encore à renseigner (débutant : pas-à-pas) | Avancer sur un point déjà signalé |
| Seules des démarches bloquées restent | « Faire le point : [démarche bloquée] » | Informations à renseigner | Le blocage est l'élément à traiter |
| Informations non bloquantes à renseigner, aucune démarche | Renseigner (pas-à-pas ou « Compléter ») | Budget, relecture | D'autres points peuvent apparaître |
| Rien de ce qui précède | Aucune action imposée : « Aucune démarche ouverte » | Budget, relecture, synthèse | Ne pas inventer de tâche |

Avis disponible ou à réexaminer, demande de relecture sans avis : affichés dans « Échanges et relecture », jamais comme action principale du porteur (l'avis est une information, pas une tâche).

Conseiller (consultation) :

| Situation observée | Action principale | Actions secondaires | Justification |
|---|---|---|---|
| Dossier archivé | « Relire la synthèse » | — | Consultation seulement |
| Question du porteur attendant sa réponse | « Répondre » (vers l'échange) | Examiner le dossier, rédiger un avis | Une personne attend |
| Relecture demandée sans avis depuis | « Examiner le dossier et rédiger un avis » | Consulter les échanges | Demande explicite du porteur |
| Dernier avis à réexaminer (dossier modifié depuis) | « Réexaminer et rédiger un avis » | Consulter les échanges | L'avis porte sur une version antérieure |
| Rien de ce qui précède | Aucune action imposée : « Aucune intervention attendue » | Consulter le projet, le plan, les échanges | Ne pas inventer de tâche |

## États à toujours distinguer

| État | Présentation |
|---|---|
| Information non renseignée / je ne sais pas / déclarée / estimée / vérifiée | Badge avec le texte de l'état (« Vérifié (source indiquée) », jamais en vert) ; la source est affichée si elle existe |
| Situation encore ouverte | Ligne « Situation : point encore ouvert » sous l'information, même si elle est vérifiée (ex. accès « en discussion ») |
| Vérifications impossibles ou absentes | « Informations insuffisantes pour établir les vérifications » (dossier vide) ; « Aucun point n'est signalé par les règles disponibles… ce n'est pas une validation » |
| Point à vérifier | Message, niveau (à compléter, à clarifier, à vérifier), « Bloquant » le cas échéant, « Pourquoi ? » |
| Démarche | À faire, en cours, bloquée (avec motif), terminée (avec résultat, date et issue : favorable, défavorable, incertaine) |
| Après une démarche terminée | Carte « Et maintenant : mettre le dossier à jour » et bouton « Mettre à jour : [information] » ; pendant la mise à jour, le résultat est rappelé sans rien préremplir ; après l'enregistrement, « Point encore ouvert : … » ou « Plus aucun point n'est signalé… » |
| Premières questions (débutant, `/d/:id/demarrer`) | Quatre courtes étapes (culture et période, lieu et terrain, eau, vente) puis un récapitulatif ; chaque étape est enregistrée sur le serveur par « Enregistrer et continuer », et seulement alors annoncée « enregistrée » ; « Je ne sais pas encore » est enregistré, « Répondre plus tard » n'enregistre rien (repère local D-049) ; une réponse estimée ou vérifiée se modifie dans sa fiche ; reprise à la première étape sans réponse enregistrée ; conflit : « Modification refusée », saisie conservée, « Recharger la version enregistrée » |
| Synthèse (porteur) | « Votre point de départ » (après les premières questions), « Ce que vous avez indiqué » ou « Ce qui était indiqué » (archivé) ; une action principale ; sujets sur une ligne chacun ; un panneau « État du dossier » (informations renseignées, inconnues, pas encore abordées ; démarches ouvertes, bloquées avec motif, terminées ; budget) |
| Sujet | État déduit des statuts enregistrés et des points calculés par le serveur : « Pas encore abordé », « Inconnu pour l'instant », « Point à éclaircir », « Rien de signalé » (jamais une validation) ; au passé pour un dossier archivé ; démarches et questions liées ; le conseiller lit « Déclaré par le porteur » |
| Saisie pas à pas (débutant) | Une information à la fois ; « Enregistrer et continuer », « Remettre à plus tard » (rien n'est enregistré) ; compte de saisie, sans pourcentage ; le focus va au titre de l'information suivante |
| Postes à examiner (budget) | Liste facultative : « Ajouter au budget » (poste à chiffrer, sans quantité ni prix) ou « Laisser de côté » (réversible) |
| Budget | Phrase complète : vide, incomplet (« ce n'est pas le coût total »), complet avec estimations, complet |
| Avis | Conclusion, auteur (conseiller), date, périmètre ; « À jour » ou « À réexaminer » avec les sections modifiées ; version examinée dans « Voir la version examinée » |
| Question (pour la personne connectée) | « Attend votre réponse », « En attente d'une réponse », « Réponse reçue, question ouverte », « Vous avez répondu, question ouverte », « Résolue » : d'après le dernier message du fil ; une réponse ne clôt jamais une question ; aucun « non lu » (pas de suivi de lecture) |
| Relecture | « Relecture demandée — aucun avis reçu depuis » seulement si aucun avis n'est postérieur à la demande ; sans conseiller : « aucune réponse ni aucun avis ne peut être promis » |
| Décision | Dernière décision du porteur (poursuivre, modifier, différer) avec auteur, date et motif, distincte de l'avis ; « Poursuivre » n'est pas une approbation d'AGRIA ; « Le dossier a été modifié depuis cette décision » si ses versions ont changé (aucun statut de validité) |
| Contenu | « Non relu par un spécialiste » visible sur le plan et dans la synthèse |
| Démonstration | Bandeau « Exemple de démonstration » |
| Envoi en cours | Bouton désactivé avec indicateur ; rien n'est annoncé comme enregistré |
| Enregistrement confirmé | Message de succès **après** la réponse du serveur ; « Aucun changement à enregistrer » si la requête était une reprise |
| Échec | Message compréhensible, saisie conservée, bouton « Réessayer » qui renvoie la même requête |
| Hors connexion | Bandeau : rien ne sera enregistré avant le retour du réseau |
| Modifications non enregistrées | Confirmation « Rester sur la page / Quitter sans enregistrer » avant de quitter ; avertissement du navigateur au rechargement |
| Dossier archivé | Consultation seulement : date d'archivage, aucune prochaine action, liens d'écriture retirés ; nouvelle campagne possible depuis le projet |
| Dossier différé | Décision et motif en tête de l'accueil ; préparation toujours possible |
| Profil | Débutant et conseiller : justifications et étapes visibles ; le débutant est conduit aux premières questions (le guide « comment avancer » est retiré en UX3-A) ; producteur : vue directe, explications à déplier |
| Session expirée | « Reconnectez-vous dans un autre onglet, puis réessayez ici : votre saisie est conservée » |

La couleur accompagne toujours un texte : elle ne porte jamais seule un statut.

## Règles d'écriture

- Pas de chiffre, de témoignage ni de promesse de résultat. Les compteurs sont présentés comme une mesure d'avancement, « pas les chances de réussite du projet ».
- « Revu » ne signifie ni faisable ni rentable ; « complet » ne signifie pas faisable.
- Montants : `37 500 FCFA` (espace fine insécable entre les milliers, insécable avant l'unité). Quantités : virgule décimale (`2,5 kg`). Dates : `11 octobre 2026`, fuseau Africa/Dakar.

## Accessibilité

- Lien « Aller au contenu » en premier arrêt de tabulation ; après chaque navigation, le focus est placé sur le contenu principal.
- Titre d'onglet propre à chaque page (« Mon plan — AGRIA »).
- Chaque champ a un libellé relié ; aide et erreur sont annoncées (`aria-describedby`, `aria-invalid`). Les messages d'erreur de formulaire sont en `role="alert"`, les confirmations en `role="status"`.
- Focus visible (contour de 3 px), cibles tactiles de 44 px de haut au moins, texte de 16 px dans les champs (pas de zoom forcé sur iOS).

## Vérifications automatisées (Playwright)

| Fichier | Ce qui est vérifié |
|---|---|
| `e2e/qualite.spec.ts` | axe-core (WCAG 2.1 A/AA) sans violation grave ou critique, et pas de défilement horizontal à 360 px, sur 14 écrans dont un dossier rempli |
| `e2e/parcours.spec.ts` | Clavier seul (ordinateur), hors connexion réel, session expirée, mot de passe erroné |
| `e2e/pas-a-pas.spec.ts` | Saisie pas à pas, report distinct de « Je ne sais pas », reprise, protection de saisie, focus ; producteur en accès direct |
| `e2e/debutant.spec.ts` | Boucle débutant sur les API réelles (UX3-A) : premières questions enregistrées par étape, interruption et reprise après reconnexion, inconnue distincte d'une réponse différée, synthèse et sujets, démarche « pluie seulement » (contenu v2), résultat incertain puis actualisation explicite, coupure réseau sans doublon, conflit, accès refusé, conseiller en lecture, dossier archivé, aucune requête vers le prototype |
| `e2e/accueil.spec.ts` | Une seule action principale (débutant, producteur, démarche en cours puis bloquée), dernière décision, invitation à relire les précisions, erreur de chargement sans faux « rien à faire » |
| `e2e/roles.spec.ts` | Conseiller et dossier archivé : titres de consultation, aucun lien promettant une modification, refus serveur de l'écriture |
| `e2e/echanges.spec.ts` | Qui doit agir : questions dans les deux sens, relances, réponse qui ne clôt pas, relecture demandée, avis à jour puis à réexaminer, destination des liens |
| Autres fichiers `e2e/*.spec.ts` | Chaque parcours exécuté en vue ordinateur et en vue téléphone (Pixel 7) |

## Limites

- Aucun test avec un lecteur d'écran réel ni avec des utilisateurs du pilote.
- Pas de mode hors connexion : la saisie en cours est perdue si la page est fermée sans avoir été enregistrée.
- Langue : français uniquement ; le besoin en wolof ou en d'autres langues reste à établir par l'enquête.
- Les performances n'ont pas été mesurées sur une connexion représentative du terrain.
