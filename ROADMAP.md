# Roadmap AGRIA

Mise à jour : 11 octobre 2026 (préparation du pilote). Promesse à tester : *AGRIA aide une personne à préparer sa prochaine campagne agricole, identifier ce qui lui manque et organiser ses démarches avec un conseiller.*

## Où en est le projet

| Niveau | État | Preuve ou référence |
|---|---|---|
| Fondations techniques (F1–F6) | **Livrées** sur `refonte/fondations` | [AVANCEMENT.md](docs/AVANCEMENT.md), briques 0 à 7 |
| Contrôles exécutés | **Locaux uniquement** ; runtime courant Python 3.14.8, résultats détaillés dans le rapport | [AVANCEMENT.md](docs/AVANCEMENT.md), lots et corrections après revue |
| CI GitHub | Configurée, **jamais exécutée** (aucun envoi) | [RESUME_PR.md](docs/RESUME_PR.md) |
| Préparation du terrain | **Kit G1 et protocole G2 prêts**, non exécutés | [VALIDATION_TERRAIN.md](docs/VALIDATION_TERRAIN.md) |
| Validation terrain | **Non réalisée** : aucun entretien, participant, conseiller ni contenu relu | — |
| Mise en service | **Non réalisée** : aucun hébergement, aucun accès à distance | [SECURITE.md](docs/SECURITE.md) §5 |
| Sécurité | Clés exposées publiquement ; **aucune révocation confirmée** | [SECURITE.md](docs/SECURITE.md) §1–2 |

**Le pilote n'est pas prêt à démarrer** : il manque les révocations, les résultats de G1, un conseiller, un contenu relu et les plafonds de G2. Le kit permet de commencer G1 dès que le fondateur fixe J0.

## Prochaines étapes

**Recette technique de la version locale fermée le 12/10/2026** ([AVANCEMENT.md](docs/AVANCEMENT.md), « Clôture de la version locale ») : version démontrable pour un usage accompagné. Restent hors code : révocations (E1), CI distante (E3), enquête G1 (E4–E6), contenu relu (E7) et, seulement si nécessaire, mise en service (E9).

Suivre les dépendances du tableau, pas une séquence obligatoire de E1 à E10. La révocation des clés est urgente ; l'enquête G1 (E4–E6) peut avancer en parallèle des travaux techniques (E2–E3). Ni une fusion GitHub, ni un hébergement, ni la suppression d'un ancien environnement Python ne sont nécessaires aux entretiens.

| # | Étape et objectif | Responsable | Dépendances | Preuve attendue | Condition de sortie |
|---|---|---|---|---|---|
| E1 | Révoquer les clés exposées et changer le mot de passe email | Propriétaire des comptes | Aucune | Registre de [SECURITE.md](docs/SECURITE.md) §2 rempli (date, fournisseur, action), sans valeur | Toutes les lignes « à effectuer » sont confirmées par le propriétaire |
| E2 | Maintenir le runtime du projet à jour et vérifier son fonctionnement | Technique | Aucune | Version corrective consignée ; `dev.py check --e2e` et `recette.py` réussis sur le poste | Environnement courant validé. Nettoyage des anciens environnements facultatif, sans bloquer le terrain |
| E3 | Décider d'envoyer la branche et faire tourner la CI | Propriétaire | E1 recommandé ; `verifier_secrets.py` réussi | Exécution GitHub des trois jobs | Trois jobs verts. Fusion selon [RESUME_PR.md](docs/RESUME_PR.md), conflit README résolu |
| E4 | Fixer J0, les seuils de G1 et les plafonds de temps et de dépenses de G1 | Fondateur | Aucune | D-011 renseigné pour G1 ; seuils écrits dans VALIDATION §6 | Valeurs G1 consignées avant le premier contact ; plafonds G2 à fixer avant E10 |
| E5 | Enquête G1 : recrutement et entretiens | Fondateur | E4 | Fiches d'entretien privées ; tableau de suivi anonymisé ; synthèse sans données personnelles | Objectif indicatif atteint (5 débutants, 5 producteurs, 2 conseillers), ou arrêt motivé selon la règle fixée en E4 |
| E6 | Décision de fin de G1 | Fondateur, avec l'avis d'un conseiller | E5 | Fiche §6 remplie avec des identifiants d'entretien ; D-014 consigné | « Poursuivre », « recentrer » ou « arrêter » consigné avec sa date de réexamen |
| E7 | Relecture du contenu et publication de la v2 relue | Conseiller ou relecteur désigné, puis technique | E6 (zone, culture) | `preparation-generique.v2.json` avec relecteur et date ; `load_content` et tests réussis | v2 chargée ; dossiers réels créés seulement ensuite (D-042) |
| E8 | Choisir le mode de données de G2 | Fondateur | E6 | Décision consignée : papier ou application locale supervisée (prérequis de VALIDATION §7.5 vérifiés) | Mode consigné avant le premier dossier |
| E9 | *(Seulement si un accès à distance est indispensable)* Mise en service | Technique et propriétaire | E1, D-006, décision d'hébergement et de budget | Liste de [SECURITE.md](docs/SECURITE.md) §5 cochée ; restauration testée sur l'environnement cible | Accès à distance autorisé par une décision consignée |
| E10 | G2 : environ trois dossiers réels accompagnés | Fondateur, conseiller, participants | E6, E7, E8 (et E9 si distant) | Journal de temps et de coûts, indicateurs de VALIDATION §8, synthèses remises aux participants | Bilan et décision selon VALIDATION §7.7 |

Après E10 : décider s'il faut consolider, corriger, prolonger avec une limite ou arrêter. Le suivi de campagne et toute extension ne s'envisagent qu'après un bilan G2 favorable.

## Idées différées

Aucune n'est à développer maintenant. Chacune se réexamine sur preuve, avec une décision consignée.

| Idée | Problème visé | Preuve nécessaire pour la réexaminer |
|---|---|---|
| Notifications (SMS, email, WhatsApp) | Une demande ou une question reste sans réponse faute d'alerte | Journal G2 montrant des retards de réponse dus à l'absence d'alerte |
| Connexion par numéro de téléphone | Des participants n'ont pas d'email | Entretiens G1 (partie G) ou difficultés notées en G2 |
| Récupération du mot de passe par email | Comptes bloqués | Cas répétés en G2 malgré l'assistance |
| Mode hors connexion | Saisie impossible sur le terrain | Séances G2 interrompues par le réseau, alors que le mode papier ne suffit pas |
| Wolof ou explications audio | Explications écrites incomprises | Entretiens et observations G2 |
| Reformulation assistée par IA d'un contenu relu | Explications trop difficiles | Difficulté constatée en G2 et contenu relu disponible ; jamais pour décider |
| Météo ou données environnementales | Une décision de préparation dépend d'une donnée climatique | Démarche G2 bloquée faute de cette donnée |
| Suivi de campagne (journal, dépenses réelles, bilan) | Écart entre prévu et réalisé | Demandes répétées des participants après G2 |
| Pièces justificatives (photos, devis) | Preuve d'une démarche | Conseiller ne pouvant pas vérifier un résultat en G2 |
| Migration explicite d'un dossier vers une nouvelle version du contenu | Dossier en cours bloqué sur une version obsolète | Cas réel en pilote ; outil explicite et tracé, jamais silencieux |
| Conversion entre unités du budget | Prix exprimés dans d'autres unités | Erreurs de saisie observées en G2 |

## Hors périmètre

Capteurs ou plateforme IoT, chatbot généraliste, marketplace, paiement, crédit ou assurance, prévision de rendement, application mobile native, architecture distribuée, extension géographique ou multi-filières, refonte visuelle générale.

## Revue hebdomadaire

Noter l'étape en cours, les preuves nouvelles, le temps et les dépenses, les risques, la prochaine action avec son responsable et son échéance, et les décisions. Limiter le travail en parallèle à une étape de terrain et une tâche technique directement utile.

Références : [produit](docs/PRODUIT.md), [stratégie](docs/STRATEGIE.md), [terrain](docs/VALIDATION_TERRAIN.md), [décisions](docs/DECISIONS.md), [avancement](docs/AVANCEMENT.md).
