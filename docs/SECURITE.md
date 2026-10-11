# Sécurité : incident de clés et règles du dépôt

Mise à jour : 11 octobre 2026 (brique 0). Aucune valeur secrète n'est reproduite dans ce document.

## 1. Constats vérifiés

| Constat | Méthode | Résultat |
|---|---|---|
| Visibilité du dépôt GitHub `ibraaheem314/AGRIA` | `gh repo view` | **Public** |
| Clé OpenWeather dans l'historique Git | Recherche de la valeur exacte dans `git log --all -p` | **Présente** : écrite en dur dans `lib/config.ts` et `src/pages/WeatherPage.tsx`, commits `667d772` (29/04/2025) et `1f598fc` (01/05/2025) |
| Clé Agromonitoring dans l'historique Git | Même méthode | **Présente** : `lib/config.ts`, commit `1f598fc` |
| Clés OpenRouter, AirVisual, HuggingFace, mot de passe email réel | Même méthode | Absentes de l'historique et des fichiers suivis |
| Clés OpenRouter et OpenWeather dans le build local `dist/` | Recherche des valeurs dans le bundle | Présentes ; `dist/` n'était pas suivi par Git et a été supprimé |
| Déploiements GitHub / GitHub Pages | API GitHub | Aucun déploiement, aucune page |
| Autres hébergements du bundle (Netlify, Vercel, serveur personnel…) | — | **Non vérifiable depuis ce poste** |
| Correspondance « mot de passe email » dans `api/auth.py` | Comparaison des valeurs | Valeur du compte de test par défaut, pas le mot de passe réel |

## 2. Ce qui est fait, et ce qui ne l'est pas

**Fait (dans le dépôt) :**

- Plus aucun code ne lit de clé fournisseur ; la refonte ne dépend d'aucun service externe.
- Les fichiers `.env` contenant les clés ont été retirés du projet et placés dans `.local-archive/prototype/`, dossier ignoré par Git.
- Le build contenant les clés a été supprimé.
- `.gitignore` refuse tout `.env` sauf les fichiers `*.example`.

**Non fait : une clé retirée du code n'est pas une clé révoquée.** Les clés restent valides tant que le titulaire du compte ne les a pas révoquées. L'historique public de GitHub n'a pas été réécrit : cela demande une autorisation explicite, et une réécriture ne supprime ni les copies ni les clones existants. **La révocation est la seule correction efficace.**

## 3. Actions externes à effectuer par le titulaire des comptes

Par ordre de priorité :

1. **OpenWeather** : révoquer la clé utilisée par le prototype (exposée publiquement), puis consulter l'usage du compte.
2. **Agromonitoring** : révoquer la clé (exposée publiquement).
3. **OpenRouter** : révoquer la clé (présente dans un bundle local, éventuellement déployé ailleurs) ; vérifier l'historique de consommation et la facturation.
4. **AirVisual, HuggingFace (trois jetons)** : révoquer par précaution. Ces valeurs figuraient dans des variables `VITE_*`, que Vite intègre au bundle dès qu'elles sont référencées.
5. **Compte email** dont le mot de passe figurait dans `.env` (variable `VITE_EMAIL_PASS`) : changer le mot de passe. Pour un envoi applicatif futur, utiliser un mot de passe d'application dédié.
6. Une fois ces actions faites, supprimer `.local-archive/prototype/*.env`.
7. Si le prototype a été hébergé ailleurs que sur GitHub : retirer ce déploiement.

À consigner ici une fois réalisé : date, fournisseur, « révoquée/remplacée », anomalies d'usage constatées. Ne jamais noter la valeur.

## 4. Règles pour la refonte

- Le frontend ne reçoit **aucun secret**. Il n'a besoin d'aucune variable d'environnement : en développement, il passe par le proxy Vite vers l'API.
- Les secrets serveur sont dans `backend/.env`, ignoré par Git ; `backend/.env.example` liste les noms sans valeur réelle.
- Le serveur refuse de démarrer hors mode développement si `DJANGO_SECRET_KEY` est absente ou si c'est la valeur d'exemple.
- Avant chaque commit touchant la configuration : `git diff --cached` ne doit contenir aucune valeur de `backend/.env`.
- Pas de compte de démonstration avec mot de passe connu dans le code : les comptes sont créés par commande, avec un mot de passe saisi ou aléatoire.
