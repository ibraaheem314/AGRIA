# AGRIA

**Préparer sa campagne agricole au Sénégal, comprendre ses contraintes et avancer avec un accompagnement adapté.**

Statut au **11 octobre 2026** : prototype logiciel existant ; nouvelle spécification de préparation accompagnée d'une campagne, à valider sur le terrain. Aucun partenaire de pilote, client payant ou résultat agronomique n'est établi dans les éléments disponibles.

## Notre trajectoire

Un territoire, une filière, un problème, un type de client, une décision à améliorer.

1. Comprendre la préparation des débutants avec un projet concret et des producteurs actifs peu accompagnés.
2. Choisir une zone, une culture candidate et un parcours commun, ou un seul groupe si leurs besoins divergent.
3. Tester manuellement quelques dossiers avec un conseiller : **contexte → vérifications → démarches → relecture → décision**.
4. Construire les six fonctions du produit initial après un premier signal d'utilité, puis mesurer usage, qualité et coûts.

La vision à terme couvre préparation, suivi et bilan de campagne. La première version couvre seulement la préparation. Le maraîchage est candidat, sans culture ni zone encore choisies. Capteurs, météo et IA ne sont pas requis au lancement.

**Prochain jalon : éprouver une fiche de préparation avec les deux profils et identifier un conseiller ainsi que des participants au Sénégal.** L'ancien choix irrigation/conservation est supersédé, pas ajouté comme seconde gamme.

## Lire et décider

| Document de référence | Rôle |
|---|---|
| [Produit : vision et fonctions initiales](docs/PRODUIT.md) | Écrans, six fonctions indispensables, exclusions et recette |
| [Stratégie produit](docs/STRATEGIE.md) | Objectif, cible, proposition de valeur et critères de choix |
| [Roadmap](ROADMAP.md) | Ordre de travail, responsables fonctionnels, dépendances et critères de passage |
| [Plan de refonte](docs/PLAN_REFONTE.md) | Garder, retirer, refondre ou polir ; travaux techniques vérifiables |
| [Enquête et protocole de pilote](docs/VALIDATION_TERRAIN.md) | Entretiens, fiche de préparation et test manuel du service |
| [Architecture](docs/ARCHITECTURE.md) | État actuel et cible conditionnelle, explicitement séparés |
| [Registre des décisions](docs/DECISIONS.md) | Arbitrages, inconnues et règles de changement de cap |
| [Repères de marché](docs/MARCHE_SENEGAL.md) | Sources publiques, limites de preuve et questions à vérifier |

Les dates et statuts d'exécution font foi dans la roadmap. Les décisions produit font foi dans la stratégie et leur historique dans le registre. Les guides techniques décrivent le code observé ; ils ne prouvent pas l'achèvement de la refonte.

## Ce qui existe aujourd'hui

| Composant | Réalité observée |
|---|---|
| React / TypeScript / Vite / Tailwind | Interface réutilisable et routage |
| Assistant | Appel OpenRouter depuis le navigateur ; secours par textes prédéfinis |
| Météo | Appels OpenWeather depuis le navigateur ; simulations dans certains cas |
| Authentification Flask | Comptes en mémoire et mécanisme JWT de prototype |
| Profil, contact et newsletter | Plusieurs opérations simulent une réussite sans persistance ou envoi |
| Boutique et consultants | Données de démonstration |
| Parcelles historiques | Écrans supprimés du dossier de travail ; exemples examinés fondés sur des données fictives |
| Capteurs / pilote | Aucune chaîne de capteurs ni validation terrain établie |

Le dépôt contient un refactor important non commité. Préserver et examiner cet état avant toute suppression de code.

### Limites avant usage réel

- Les clés OpenRouter et OpenWeather configurées localement ont été retrouvées dans le bundle existant lors de l'audit ; rotation et migration serveur restent à faire.
- Le profil peut annoncer un changement de mot de passe qui n'a pas eu lieu.
- Les chiffres commerciaux affichés ne sont pas étayés dans le dépôt.
- La présence d'un JWT ou d'une route React protégée ne garantit pas la sécurité serveur.
- La simulation et les conseils prédéfinis ne sont pas des mesures ni une validation agronomique.

**Ce dépôt ne constitue pas un service prêt pour un pilote réel.** Voir les tâches P0 et le jalon de préparation dans la [roadmap](ROADMAP.md).

## Travailler sur le prototype

Consulter la [configuration](CONFIGURATION_API.md) avant tout lancement : Vite charge les fichiers d'environnement existants. Ne pas lui fournir de secret de fournisseur.

Avec les dépendances déjà installées, depuis la racine :

```powershell
npm.cmd run dev -- --host 127.0.0.1
npm.cmd run lint
.\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.app.json
```

Pour une installation reproductible du frontend, utiliser `npm.cmd ci` après vérification de la configuration locale. L'installation propre n'a pas été validée dans cet audit.

La commande `npm.cmd run build` existe mais écrit dans `dist/` et peut embarquer les secrets encore référencés par le frontend. Son succès ne vaut ni validation TypeScript ni autorisation de déploiement. Le backend a des dépendances à remettre en cohérence avant de documenter un démarrage reproductible.

Guides : [frontend](README_FRONTEND.md), [backend](api/README.md), [configuration](CONFIGURATION_API.md), [interface](COULEURS_MINIMALISTES.md).

## Dernière vérification connue

Audit du 11 octobre 2026, avant la refonte documentaire :

- Build Vite : réussi avec les dépendances locales, sortie temporaire.
- TypeScript : échec.
- ESLint avec `--quiet` : 52 erreurs.
- Services externes avec clés réelles, installation backend propre et validation terrain : non testés.

La présente refonte met à jour la documentation. Elle n'annonce pas la réalisation des corrections applicatives.
