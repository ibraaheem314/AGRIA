# Configuration et traitement des secrets

Mise à jour : 11 octobre 2026. Ce document remplace les anciennes instructions qui recommandaient des clés fournisseurs dans VITE_*.

## État actuel

[src/lib/config.ts](src/lib/config.ts) lit VITE_OPEN_ROUTER_KEY et VITE_OPENWEATHER_API_KEY. Leur utilisation dans le frontend expose leurs valeurs au navigateur.

Lors de l'audit, les valeurs locales OpenRouter et OpenWeather ont été retrouvées dans le bundle dist existant, sans être affichées. Le fait qu'un fichier .env soit ignoré par Git ne protège pas les valeurs intégrées au JavaScript.

La mise à jour de ce guide ne révoque aucune clé et ne modifie aucun appel applicatif.

## Actions P0 — T1

1. Identifier si le bundle a été partagé, hébergé ou distribué.
2. Révoquer/remplacer les clés exposées dans les comptes fournisseurs et examiner leur usage. Ne jamais consigner les valeurs dans le dépôt.
3. Retirer les secrets des entrées de build frontend ; supprimer les références correspondantes dans le code.
4. Faire passer les seuls appels utiles par le backend avec authentification, autorisation, quotas et délais.
5. Produire un nouveau bundle après correction et contrôler l'absence des anciennes et nouvelles valeurs secrètes, sans les imprimer.
6. Traiter les anciens artefacts accessibles et consigner ce qui a pu être vérifié.

Déplacer les anciennes clés sans les révoquer ne clôt pas l'incident.

## Configuration publique du frontend

La variable VITE_API_URL désigne l'adresse du backend ; c'est une configuration publique. Exemple local :

```dotenv
VITE_API_URL=http://127.0.0.1:8000/api
```

Aucun secret de fournisseur, mot de passe SMTP ou token privé ne doit avoir un usage côté frontend.

Les fichiers env.example existants sont historiques et n'ont pas été corrigés par cette livraison documentaire. **Ne pas les copier tels quels.** Vite lit aussi les fichiers .env, .env.local et variantes de mode ; revoir toutes les entrées de build, y compris l'environnement du processus.

Retirer les clés du frontend actuel désactive les appels réels mais laisse des simulations : cela ne suffit pas à rendre la démonstration honnête. T2 traite séparément leur présentation.

## Configuration serveur visée

Les noms ci-dessous sont des noms de variables, sans valeur secrète :

| Variable | Fonction | Limite actuelle |
|---|---|---|
| SECRET_KEY | Signature / sessions, stable et fournie explicitement | Utilisation non centralisée |
| OPEN_ROUTER_KEY | Accès IA uniquement si le cas choisi le justifie | Pas de quotas utilisateur implémentés |
| OPENWEATHER_API_KEY | Météo si nécessaire au pilote | Frontend non migré |
| DATABASE_URL | Connexion à la persistance retenue | Variable sans intégration effective |
| CORS_ORIGINS | Origines prévues | Configuration non appliquée dans main.py |
| PORT | Port d'écoute | Le lancement actuel utilise 0.0.0.0 |
| TOKEN_EXPIRATION | Durée JWT | Ne remplace pas les permissions et la gestion de session |

Créer un fichier .env ne charge pas automatiquement ces variables dans le lancement Python actuel. Définir une procédure explicite et testée en T3.

Les secrets déployés devront être gérés par l'environnement serveur choisi. Les fichiers locaux restent privés et non suivis. Le fournisseur cloud n'est pas encore choisi.

## Vérifications avant usage partagé

- Aucun secret dans sources client, bundle, source maps, logs ou captures.
- Compte de test automatique et journalisation de mot de passe retirés.
- Configuration serveur absente ou invalide : arrêt clair ou fonctionnalité indisponible explicitement.
- Une erreur fournisseur ne produit pas une observation fictive présentée comme réelle.
- Endpoints authentifiés, accès contrôlé et coûts limités.
- Origines CORS effectives vérifiées ; CORS ne remplace pas l'autorisation.
- Données et droits testés après redémarrage.

Le choix d'un modèle IA, ses tarifs et les quotas météo seront vérifiés au moment où le pilote en aura besoin. Ce guide ne reprend pas les anciennes estimations commerciales non maintenues.

Voir [T1 à T4](docs/PLAN_REFONTE.md) et [les décisions ouvertes](docs/DECISIONS.md).
