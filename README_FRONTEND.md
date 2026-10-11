# Frontend AGRIA

État du code observé au 11 octobre 2026. Ce guide décrit le prototype ; la cible est dans [Architecture](docs/ARCHITECTURE.md).

## Technologies présentes

React 18, TypeScript, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion et Lucide. Les versions exactes installées sont déterminées par package-lock.json.

Aucun service worker ni chaîne de synchronisation hors connexion n'a été identifié dans le périmètre examiné. Ne pas présenter le frontend comme une PWA opérationnelle.

## Organisation actuelle

```text
src/
  App.tsx
  components/
    auth/
    layout/
    ui/
  contexts/
  hooks/
  lib/
    config.ts
    services/
  pages/
lib/
  api/
  config.ts
```

Les deux dossiers lib coexistent. Ne pas supprimer celui de la racine sans analyser les imports : le contrôle TypeScript atteint notamment lib/api/weather.ts.

## Parcours actuels

[App.tsx](src/App.tsx) définit les pages publiques et les routes protégées par le composant React ProtectedRoute.

- Pages publiques : accueil, connexion, inscription, à propos, FAQ et contact.
- Routes protégées dans l'interface : météo, consultants, marketplace, chat, dashboard et profil.
- La route dashboard affiche le chat ; ce n'est pas un tableau de bord métier.

ProtectedRoute contrôle la navigation. Les permissions sur les données doivent être vérifiées côté serveur.

## Flux réels

| Module | Comportement |
|---|---|
| AuthContext | Appelle Flask, conserve le JWT dans localStorage |
| AIService | Appelle directement OpenRouter ; textes de secours si configuration manquante ou erreur |
| WeatherPage | Appelle directement OpenWeather ; recherche et géolocalisation ; Paris comme valeur initiale |
| ChatPage | Messages dans l'état React ; aucun historique serveur persistant démontré |
| Profile | Informations fictives et plusieurs réussites simulées |
| Contact / newsletter | Interface de formulaire sans preuve d'envoi/persistance |
| Consultants / marketplace | Données locales de démonstration |

Le badge de connexion IA vérifie la présence de configuration ; il ne valide pas une connexion au fournisseur.

## Travailler localement

Lire [Configuration](CONFIGURATION_API.md) avant de démarrer. Les fichiers .env existants peuvent contenir des secrets exposables ; ne pas recopier les exemples historiques sans revue.

Commandes existantes depuis la racine, avec les dépendances installées :

```powershell
npm.cmd run dev -- --host 127.0.0.1
npm.cmd run lint
.\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.app.json
```

`npm.cmd ci` est la commande d'installation à privilégier avec package-lock.json. Cette livraison n'a pas validé une nouvelle installation propre.

`npm.cmd run build` produit dist/. Vite transpile le code sans remplacer le contrôle TypeScript ci-dessus. Éviter de régénérer ou diffuser un bundle tant que la configuration des secrets n'est pas assainie.

## Résultats connus et limites

Audit antérieur à la refonte documentaire, le 11 octobre 2026 :

- build Vite réussi avec les dépendances locales ;
- TypeScript en échec : éléments inutilisés et erreurs de nullabilité, notamment ;
- ESLint --quiet : 52 erreurs ;
- comportement sur appareils terrain, accessibilité complète et services externes : non validés.

Ces résultats ne sont pas une validation de production.

## Direction de refonte

Conserver les composants réutilisables. Retirer les fonctions hors périmètre ; reconstruire le parcours de préparation décrit dans [Produit](docs/PRODUIT.md), après le service manuel G2. Navigation proposée : Aujourd'hui, Mon projet, Mon plan et Aide.

Afficher explicitement : informations déclarées/vérifiées/inconnues, budget incomplet, version des avis, demandes en attente et confirmation réelle des actions. Les états de mesure et la synchronisation complète seront ajoutés si un besoin ultérieur le justifie. Le statut « simulation » doit être visible lorsqu'une démonstration est conservée.

Les critères visuels sont dans [Guide d'interface](COULEURS_MINIMALISTES.md). Les tâches et leur ordre sont dans [Plan de refonte](docs/PLAN_REFONTE.md).
