# Architecture : reconstruire les fondations du produit

Version du 11 octobre 2026. Cible recommandée pour F1–F6 du [produit](PRODUIT.md).
Cette architecture n'est pas implémentée par la documentation.

## 1. Situation actuelle

```text
React/Vite
  ├─ AuthContext → Flask → comptes en mémoire
  ├─ AIService → OpenRouter directement
  └─ WeatherPage → OpenWeather directement
```

Le backend possède aussi des chemins fournisseurs parallèles. Aucun dossier agricole durable, contenu local versionné, budget persistant ou circuit de relecture n'est établi. La dépendance Supabase et DATABASE_URL ne constituent pas une base intégrée.

## 2. Choix techniques proposés

- Conserver React, TypeScript, Vite et Tailwind pour réutiliser les compétences et composants.
- Un backend Python unique organisé par domaine. Flask peut rester après remise en état ; pas de migration de framework par principe.
- PostgreSQL pour les données relationnelles, avec migrations versionnées.
- Authentification gérée plutôt que hachage/JWT maison ; fournisseur à trancher en D-006.
- Accès métier via l'API, contrôlé à chaque requête ; un seul chemin d'écriture.
- Aucune dépendance nécessaire à un LLM, à la météo ou à des capteurs pour F1–F6.
- Fichiers justificatifs privés uniquement si le pilote en a besoin ; pas de stockage public par défaut.

Une reconstruction « comme de zéro » signifie définir les contrats métier et les responsabilités avant de recycler les écrans. Elle n'impose pas de jeter les composants utiles ni de changer toute la stack.

## 3. Organisation cible

```text
src/
  app/                 # routage, session, erreurs globales
  features/
    projects/
    campaigns/
    readiness/
    actions/
    budget/
    reviews/
  shared/              # interface, client API, formats
api/
  modules/
    identity/
    projects/
    campaigns/
    readiness/
    actions/
    budget/
    reviews/
    content/
  integrations/        # auth, stockage et fournisseurs futurs
  jobs/                # seulement si besoin asynchrone établi
db/
  migrations/
tests/
  integration/
  journeys/
```

Ne pas créer des services indépendants par dossier. Les modules appartiennent à une seule application. Un domaine possède son code et ses tests, sans trois versions dans pages, features et lib.

## 4. Modèle métier minimal

```text
Compte → Espace personnel ou d'accompagnement → Membres et droits
                         │
                       Projet
                         │
                       Campagne
                         ├─ Informations et conditions à vérifier
                         ├─ Plan versionné → Actions → Résultats des actions
                         ├─ Budget → Postes sourcés
                         ├─ Questions et retours du conseiller
                         └─ Historique des décisions et relectures
```

Un projet peut avoir plusieurs campagnes dans le modèle ; le pilote suit une campagne par dossier. L'accès au terrain peut être envisagé plutôt que confirmé, avec statut explicite.

Le producteur accompagné et le compte utilisateur sont distincts : un dossier peut être saisi avec assistance. Le propriétaire du projet conserve la visibilité et l'accès convenus. L'interface n'a pas besoin d'exposer toute la structure interne d'organisation.

### Contrats de données

| Objet | Données essentielles |
|---|---|
| Projet | Propriétaire/espace, localisation et précision, accès au terrain, expérience, contexte |
| Campagne | Culture envisagée, période envisagée, statut, version du contexte |
| Information | Valeur, unité, origine, date, état déclaré/estimé/vérifié/inconnu |
| Modèle de contenu | Zone/culture concernées, source, auteur/relecteur, version, date et conditions d'application |
| Action | But, explication, prérequis, échéance éventuelle, statut, résultat et auteur |
| Poste budgétaire | Catégorie, quantité, unité, prix, devise, source/date, état d'estimation |
| Relecture | Conseiller, périmètre, version examinée, avis, réserves et date |
| Question | Dossier/objet associé, texte, auteur, état et réponses |
| Décision | Poursuivre/modifier/différer, auteur, motif et éléments disponibles |

Ne pas stocker les inconnues comme zéro ou comme valeurs réalistes par défaut. Un résultat agricole futur n'est pas déduit du remplissage du dossier.

## 5. Règles métier et versionnement

- Les contrôles de préparation sont explicables et proviennent d'un modèle local relu.
- Le plan conserve la version du modèle et du contexte utilisés.
- Modifier une donnée significative signale une relecture nécessaire ; l'ancien avis reste dans l'historique.
- Une tâche terminée n'est pas recréée silencieusement lors d'une mise à jour.
- Une action modifiée simultanément depuis deux sessions produit un conflit explicite, pas un écrasement invisible.
- Les envois réessayés utilisent une clé stable ou un mécanisme équivalent pour éviter les doublons.
- Un état « enregistré » correspond à une écriture serveur confirmée.

Le circuit de relecture est un besoin du produit, pas un système de certification de faisabilité ou de rentabilité.

## 6. Budget

Calculs déterministes sur données validées. Utiliser une représentation monétaire précise et des règles d'arrondi documentées ; ne pas additionner des chaînes ou déléguer les calculs à un modèle de langage.

Distinguer total renseigné et budget complet. Séparer investissement, charges de campagne, ressources déjà détenues et éventuelles hypothèses de recettes. Fixer les unités pour éviter quantité × prix incompatible.

Le budget est un outil de préparation ; pas de module comptable complet, paiement ni scoring de crédit.

## 7. Accès et sécurité

Rôles minimaux : propriétaire/participant du projet, conseiller explicitement attribué et administration technique restreinte.

- Autoriser sur chaque objet côté serveur ; la route React ne protège pas les données.
- Le conseiller n'obtient pas automatiquement accès à tous les projets d'une organisation.
- Contrôler aussi questions, synthèses, exports et éventuelles pièces jointes.
- Choisir une session adaptée à l'authentification retenue ; ne pas recopier le JWT localStorage actuel sans analyse.
- Identifiants fournisseurs, secrets et données privées absents des bundles et logs.
- Sauvegarde et restauration vérifiées ; suppression/archivage et conservation des données définis.
- Prévenir les double-envois et limiter la taille/fréquence des requêtes.
- Si des cookies sont retenus, définir les protections de session et de requêtes associées.

## 8. Réseau et interface

Version initiale : serveur requis pour confirmer une écriture. Conserver la saisie pendant une erreur, indiquer l'échec et proposer une reprise sans doublon.

L'accès hors connexion complet est un chantier distinct : cache de données privées, synchronisation et conflits. Ne pas le promettre avant choix du canal et essais terrain. Si la connexion rend le pilote impraticable, réviser ce choix avant G3.

## 9. Qualité de contenu

Sources identifiables, domaine d'application, date et responsable de relecture. Les conseils critiques restent soumis à une expertise locale.

Commencer avec un seul modèle de préparation validé pour le pilote et un moyen interne simple de le maintenir. Ne pas construire un CMS généraliste.

Un LLM éventuel reformule un contenu ou structure une saisie confirmée. Il ne calcule pas le budget, ne crée pas de valeurs manquantes et ne prononce pas seul la faisabilité.

## 10. Futurs modules conditionnels

Journal de campagne et dépenses réelles après validation du besoin ; météo ou observations environnementales pour une action identifiée ensuite. Ajouter alors les contrats de mesure : source, unité, date de mesure/réception, qualité et calibration.

Pas de plateforme IoT, de base de séries temporelles spécialisée ni de moteur satellite dans les fondations initiales.

## 11. Vérifications avant usage partagé

- Installation reproductible, lint, typecheck et build.
- Deux comptes et un conseiller : accès autorisés et refusés, y compris exports.
- Données retrouvées après redémarrage ; restauration d'une sauvegarde.
- Budget incomplet, unités et arrondis.
- Changement de contexte invalidant un avis courant sans effacer l'historique.
- Erreur réseau et reprise sans faux succès ni doublon.
- Recette F1–F6 sur téléphone avec des utilisateurs du pilote.

Les choix d'hébergement, d'authentification et de versions seront arrêtés en D-006 avant implémentation partagée. Aucun déploiement ou achat n'est effectué par ce document.
