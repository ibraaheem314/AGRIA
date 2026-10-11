# Plan de refonte du dépôt

Date : 11 octobre 2026. Périmètre de cette livraison : documentation et spécification F1–F6 du [produit](PRODUIT.md).

**Les suppressions et corrections ci-dessous sont planifiées, pas exécutées.** Le dépôt contient déjà des modifications et suppressions non commitées. Ne pas les confondre avec cette livraison.

## Ordre de priorité

- **P0** : secret exposé, faux succès ou information trompeuse susceptible d'être utilisée.
- **P1** : fiabilité, accès aux données, persistance et possibilité de livrer le pilote.
- **P2** : maintenance, lisibilité, performances et confort.

Le polissage P2 ne doit pas retarder P0 ou servir de substitution à l'enquête G1.

## Garder, retirer, refondre, polir

| Élément | Décision | Travail attendu | Priorité |
|---|---|---|---|
| React, TypeScript, Vite, Tailwind | Garder | Réutiliser les fondations ; corriger les contrôles qualité | P1 |
| Composants Button, Card, Badge et layout | Garder et polir | États, lisibilité, clavier et usage sur téléphone | P2 |
| Python | Garder comme orientation | Réutiliser pour API et traitement de données ; pas de migration gratuite | P1 |
| Flask actuel | Refondre progressivement | Dépendances, config, contrôles d'accès, modules et tests utiles | P1 |
| Authentification maison | Remplacer ou reconstruire sur une solution éprouvée | Comptes persistants, secrets stables, retrait du compte de test, permissions | P1 |
| Accès fournisseurs depuis le navigateur | Supprimer | Appels nécessaires côté serveur, quotas et erreurs explicites | P0 |
| Secrets exposés | Révoquer/remplacer | Audit de l'usage et retrait des anciens artefacts accessibles | P0 |
| Chiffres, témoignages et bénéfices sans preuve | Retirer | Publication uniquement après preuve documentée | P0 |
| Sauvegarde, mot de passe, contact, newsletter simulés | Retirer ou rendre explicitement démonstratifs | Un succès signifie une opération réellement confirmée | P0 |
| Boutique et annuaire de consultants | Retirer du produit initial | Retirer routes et navigation, puis fichiers/deps devenus inutiles | P1 |
| Interface de chat | Conserver comme référence facultative | Hors parcours initial ; réutilisation uniquement si le pilote la justifie | P2 |
| Assistant généraliste et secours prescriptifs | Retirer du service initial | Pas de conseil réel issu de textes génériques cachant une panne | P0 |
| Météo | Différer l'interface, garder le savoir-faire | Ajouter seulement si une décision de suivi le justifie ; pas de dépendance pour F1–F6 | P2 |
| Profil détaillé fictif | Refondre | Informations minimales utiles au rôle et au site | P1 |
| Animations décoratives, statistiques d'impact | Réduire / retirer | Priorité à la compréhension et au coût de chargement | P2 |
| Anciennes pages de parcelles | Ne pas restaurer en bloc | Reconstruire un dossier projet/campagne minimal, sans données fictives | P1 |
| Doublons lib et anciens hooks | Consolider après analyse des imports | Un seul chemin de configuration et de service par responsabilité | P2 |
| .venv et __pycache__ suivis par Git | Retirer du suivi après sauvegarde | Corriger les exclusions ; préserver les environnements locaux utiles | P1 |
| Dépendances sans usage | Retirer après vérification | Mettre package.json et package-lock.json à jour ensemble | P2 |
| README et guides historiques | Remplacer | Nouvelle documentation cohérente ; réalisé dans cette livraison | Livré |

Le recours à un conseiller humain reste possible au pilote ; il ne nécessite pas de construire une marketplace.

## Backlog exécutable

Toutes les tâches T0 à T8 sont **à faire**. Les preuves de l'audit sont des constats, pas des preuves de correction.

| ID | Priorité / responsable | Dépendance | Travail et critère de fin |
|---|---|---|---|
| T0 | P0 — technique | Aucune | Préserver un état récupérable des fichiers modifiés et non suivis ; séparer code, artefacts et secrets ; inventaire relu. Aucune commande de reset/clean globale. |
| T1 | P0 — technique + titulaire des comptes fournisseurs | T0 pour modifications ; rotation sans délai inutile | Clés concernées révoquées/remplacées, exposition et usage examinés, secrets absents des nouveaux bundles, anciens artefacts accessibles traités. Noter les contrôles impossibles. |
| T2 | P0 — produit + technique | T0 | Retirer allégations non étayées, faux succès et conseils de secours présentés comme fiables. Vérifier les parcours effectivement accessibles. |
| T3 | P1 — technique | T0 | Dépendances installables dans un environnement propre, PyJWT déclaré, compatibilité Flask/Werkzeug vérifiée, config cohérente et arrêt explicite en cas de config invalide. |
| T4 | P1 — technique | T3, D-006 | Persistance et auth fiables ; deux comptes ne lisent pas les données l'un de l'autre ; accès conseiller limité ; persistance après redémarrage ; retrait des credentials de test et des secrets dans les logs. |
| T5 | P1 — technique | T0 ; peut avancer avec G1 | Retirer code généré du suivi, corriger lint et typecheck, ajouter une CI minimale installation/lint/typecheck/build ; garder un lockfile npm. |
| T6 | P1 — technique + terrain | G2 utile, T3, T4 ; T5 avant usage partagé | Livrer F1–F6 : dossier, vérifications, plan, budget, relecture et synthèse. Erreur réseau explicite, reprise sans doublon et sauvegarde restaurée. |
| T7 | P1/P2 — produit + technique | T2, G1 | Retirer routes hors périmètre ; consolider services et dépendances ; vérifier liens, navigation et absence d'import cassé. |
| T8 | P2 — produit + technique | T6, retours terrain | Polir le parcours de préparation : lisibilité, téléphone, reprise de saisie, enregistrement confirmé et avis à jour. |

T1 ne se limite pas à déplacer les mêmes clés vers Python. La révocation chez les fournisseurs doit être confirmée séparément. Ne jamais inscrire une valeur de secret dans une preuve ou un rapport.

## Décomposition de T6 — fondations avant écrans

| Tranche | Fonctions | Preuve attendue |
|---|---|---|
| Accès et données | F1 | Projet/campagne sauvegardés, session fiable et refus d'accès à un autre dossier |
| Préparation | F2–F3 | Modèle local relu, inconnues explicites, actions et résultats persistants |
| Budget | F4 | Postes sourcés, total renseigné distinct du budget complet, calculs testés |
| Conseil et synthèse | F5–F6 | Attribution limitée, retours versionnés et export contrôlé |

Ne pas construire d'abord six maquettes indépendantes. Livrer une tranche reliée de bout en bout, puis la suivante. Aucun intégrateur IoT ou LLM n'est requis pour terminer T6.

## Preuves locales de l'audit

| Constat | Source |
|---|---|
| Clés utilisées côté navigateur | [config frontend](../src/lib/config.ts), [service IA](../src/lib/services/aiService.ts), [météo](../src/pages/WeatherPage.tsx) |
| Comptes en mémoire, SHA-256, utilisateur de test et mot de passe journalisé | [auth.py](../api/auth.py) |
| Routes fournisseurs sans décorateur d'authentification, statistiques aléatoires | [main.py](../api/main.py) |
| Faux changement de mot de passe / profil | [Profile.tsx](../src/pages/Profile.tsx) |
| Faux envoi de contact / inscription newsletter | [ContactPage.tsx](../src/pages/ContactPage.tsx), [NewsletterSignup.tsx](../src/components/ui/NewsletterSignup.tsx) |
| Chiffres marketing écrits en dur | [Home.tsx](../src/pages/Home.tsx), [ImpactStats.tsx](../src/components/ui/ImpactStats.tsx) |
| Appels directs malgré routes backend existantes | [ChatPage.tsx](../src/pages/ChatPage.tsx), [WeatherPage.tsx](../src/pages/WeatherPage.tsx) |

Le contrôle du bundle existant a confirmé la présence des valeurs locales OpenRouter et OpenWeather sans les afficher. La publication effective du bundle et une éventuelle utilisation par des tiers n'ont pas été établies.

1 751 fichiers sous .venv sont suivis dans l'état Git examiné, avec suppressions déjà présentes dans le dossier de travail. Des fichiers __pycache__ sont également suivis. Ne pas assimiler leur suppression locale au nettoyage achevé du dépôt.

## Définition de terminé pour une tâche technique

- Le comportement demandé est observable, y compris les erreurs pertinentes.
- La preuve est inscrite sous l'ID de tâche : date, commande ou scénario, résultat et limites.
- Les vérifications utiles passent : lint, typecheck, build et scénarios métier affectés.
- Les secrets et données privées ne figurent pas dans les logs, bundles ou preuves.
- La documentation distingue l'état livré et ce qui reste ouvert.
- La tâche n'introduit pas une fonctionnalité hors du produit choisi.

Tests prioritaires : isolation des comptes et conseillers, calcul du budget incomplet, versionnement des avis, reprise sans doublon, confirmation réelle des actions et restauration. Les scénarios F1–F6 du cahier des charges font référence. Ne pas écrire des tests de détail pour chaque retouche visuelle.

## Séquençage des changements Git

Préserver d'abord l'état existant. Réaliser ensuite de petits changements relisibles : exposition des secrets, vérité de l'interface, dépendances, auth/persistance, boucle pilote, nettoyage, polissage.

Éviter un commit qui mélange pivot produit, migration technique, suppression de fichiers et changement graphique. Ne pas réécrire l'historique par défaut. Cette livraison ne crée ni commit ni déploiement.
