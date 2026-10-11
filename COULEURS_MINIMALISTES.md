# Guide d'interface AGRIA

Mise à jour : 11 octobre 2026. Le nom du fichier est conservé pour maintenir les liens existants.

## Objectif

Permettre au porteur ou au producteur de préparer une campagne, comprendre ses prochaines démarches et retrouver les retours de son conseiller sur téléphone.

Les performances, l'accessibilité et les contrastes ne sont pas déclarés validés. Ils doivent être vérifiés sur les parcours livrés.

## Conserver et simplifier

Réutiliser Button, Card, Badge et les composants de layout lorsque cela réduit le travail. Privilégier une hiérarchie claire, des surfaces simples et un nombre limité d'actions.

Réduire animations décoratives, effets de transparence et compteurs sans lien avec la décision agricole. Aucune refonte de marque n'est nécessaire pour l'enquête.

Les couleurs effectives se trouvent dans [tailwind.config.js](tailwind.config.js) et [src/index.css](src/index.css). Ce document n'invente pas une seconde palette parallèle.

## États indispensables

| État | Présentation attendue |
|---|---|
| Mesure récente utilisable | Valeur, unité, source et date |
| Mesure ancienne | Dernière valeur connue et ancienneté visible |
| Mesure suspecte | Motif et besoin de vérification |
| Donnée absente | Absence explicite ; jamais remplacer par zéro |
| Simulation | Mention visible sur le parcours concerné |
| Envoi en attente | Action locale non encore confirmée |
| Enregistrement confirmé | Succès après confirmation réelle |
| Échec | Explication et moyen de reprendre sans perdre la saisie |
| Recommandation | Justification et validité ; distincte d'une action effectuée |

La couleur accompagne un texte ou une icône compréhensible ; elle ne porte pas seule le statut. La présence d'une clé ne justifie pas un badge « connecté ».

## Parcours minimal F1–F6

Navigation : Aujourd'hui, Mon projet, Mon plan, Aide. Budget dans le projet et explications dans les actions ; pas de menus supplémentaires par technologie.

- Retrouver sa campagne en préparation.
- Comprendre les informations connues et les points à vérifier.
- Réaliser la prochaine démarche ou signaler un blocage.
- Consulter le budget provisoire et ses postes manquants.
- Lire le retour du conseiller et retrouver la synthèse.

Voir le [cahier des charges et la structure d'écran](docs/PRODUIT.md). Les états de mesure ci-dessus ne concernent qu'une future intégration environnementale ; la première version utilise surtout les états de saisie, de relecture et d'enregistrement.

Langue, unités, format de date et canal suivent l'enquête. Ne pas remplacer automatiquement les exemples français par des exemples sénégalais fictifs présentés comme données utilisateur.

## Critères de polissage — T8

- Texte lisible, contraste vérifié et zoom utilisable.
- Navigation clavier, focus visible et libellés de champs explicites.
- Boutons adaptés au téléphone ; absence d'action uniquement au survol.
- Saisie conservée après erreur et prévention des doublons lors d'une reprise.
- État du réseau et de la synchronisation compréhensible.
- Chargement testé sur une connexion représentative du pilote.
- Aucun chiffre, témoignage ou résultat non prouvé ; un dossier complet n'est pas une garantie de faisabilité.
- Vérification avec au moins un utilisateur du parcours cible, avec limites de l'essai consignées.

Le polissage suit les corrections de sécurité et la réalisation d'une boucle utile. Il ne remplace pas une preuve terrain.

Références : [stratégie](docs/STRATEGIE.md), [plan de refonte](docs/PLAN_REFONTE.md), [frontend](README_FRONTEND.md).
