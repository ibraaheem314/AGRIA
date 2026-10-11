# Guide d'interface

Mise à jour : 11 octobre 2026 (brique 6). Ce guide décrit les conventions **appliquées dans le code** (`frontend/src`) et la façon dont elles sont vérifiées.

## Navigation

- Porteur : **Aujourd'hui · Mon projet · Mon plan · Aide**. Conseiller : Aujourd'hui · Projet · Plan · Aide (même structure, libellés neutres).
- Le budget est une section du projet (`/d/:id/projet/budget`). La relecture et la synthèse sont accessibles depuis l'accueil.
- Sur téléphone, la navigation est en bas de l'écran (cibles de 48 px de haut) ; sur ordinateur, sous l'en-tête.
- Les adresses portent l'identifiant du dossier : un lien envoyé au conseiller ouvre le bon dossier.

## États à toujours distinguer

| État | Présentation |
|---|---|
| Information non renseignée / je ne sais pas / déclarée / estimée / vérifiée | Badge avec le texte de l'état ; la source est affichée si elle existe |
| Point à vérifier | Message, niveau (à compléter, à clarifier, à vérifier), « Bloquant » le cas échéant, « Pourquoi ? » |
| Démarche | À faire, en cours, bloquée (avec motif), terminée (avec résultat et date) |
| Budget | Phrase complète : vide, incomplet (« ce n'est pas le coût total »), complet avec estimations, complet |
| Avis | Conclusion, auteur, date, périmètre, version examinée ; « À jour » ou « À réexaminer » avec les sections modifiées |
| Contenu | « Non relu par un spécialiste » visible sur le plan et dans la synthèse |
| Démonstration | Bandeau « Exemple de démonstration » |
| Envoi en cours | Bouton désactivé avec indicateur ; rien n'est annoncé comme enregistré |
| Enregistrement confirmé | Message de succès **après** la réponse du serveur ; « Aucun changement à enregistrer » si la requête était une reprise |
| Échec | Message compréhensible, saisie conservée, bouton « Réessayer » qui renvoie la même requête |
| Hors connexion | Bandeau : rien ne sera enregistré avant le retour du réseau |
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
| Autres fichiers `e2e/*.spec.ts` | Chaque parcours exécuté en vue ordinateur et en vue téléphone (Pixel 7) |

## Limites

- Aucun test avec un lecteur d'écran réel ni avec des utilisateurs du pilote.
- Pas de mode hors connexion : la saisie en cours est perdue si la page est fermée sans avoir été enregistrée.
- Langue : français uniquement ; le besoin en wolof ou en d'autres langues reste à établir par l'enquête.
- Les performances n'ont pas été mesurées sur une connexion représentative du terrain.
