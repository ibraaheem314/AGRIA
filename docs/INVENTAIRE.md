# Inventaire du prototype avant reconstruction

Établi le 11 octobre 2026 (brique 0). L'état complet du dossier de travail est préservé dans le commit `fba4f93`, branche `archive/prototype-2026-10-11`, y compris les fichiers qui n'étaient pas suivis. Les fichiers ignorés contenant des secrets (`.env`, `api/.env`, `api/api.log`) ont été déplacés dans `.local-archive/prototype/`, un dossier ignoré par Git et jamais commité.

Pour retrouver un fichier de l'ancien prototype :

```powershell
git show fba4f93:src/pages/WeatherPage.tsx
git switch archive/prototype-2026-10-11   # consultation complète, sans modifier la refonte
```

## Décisions

| Élément du prototype | Décision | Motif |
|---|---|---|
| Documentation produit (`docs/PRODUIT.md`, `STRATEGIE.md`, `VALIDATION_TERRAIN.md`, `MARCHE_SENEGAL.md`) | **Conserver** | Référence du cap F1–F6 ; statuts d'avancement mis à jour au fil des briques |
| `README.md`, `ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/PLAN_REFONTE.md` | **Réécrire / mettre à jour** | Décrire le code réellement livré et les décisions prises |
| `COULEURS_MINIMALISTES.md` | **Conserver**, déplacé en `docs/INTERFACE.md` | Ses critères d'états et de polissage restent valables |
| Stack React + TypeScript + Vite + Tailwind | **Conserver l'orientation**, code réécrit dans `frontend/` | Versions à jour ; aucun composant ancien ne réduisait réellement le travail (tous couplés à l'ancien thème et à des données fictives) |
| Backend Flask (`api/main.py`, `auth.py`, `config.py`) | **Supprimer** et remplacer par `backend/` | Comptes en mémoire, SHA-256 maison, clé secrète régénérée à chaque démarrage, routes fournisseurs inutilisées, statistiques aléatoires. Rien de réutilisable sans prolonger la mauvaise fondation |
| `AuthContext` (JWT dans `localStorage`, rechargement sur 401) | **Réécrire** | Sessions serveur avec cookie et protection CSRF |
| Chat IA (`ChatPage`, `aiService`, `DemoChat`) | **Supprimer** | Hors périmètre (chatbot généraliste) ; clé fournisseur dans le navigateur ; réponses prédéfinies présentées comme des conseils |
| Météo (`WeatherPage`, `useWeather`, `lib/api/weather.ts`) | **Différer** (code supprimé, consultable dans l'archive) | Non requis par F1–F6 ; clé dans le navigateur ; données simulées |
| Qualité de l'air, Agromonitoring (`lib/api/*`) | **Supprimer** | Hors périmètre, clés dans le navigateur |
| Marketplace, Consultants | **Supprimer** | Hors périmètre ; données de démonstration (personnes, prix, avis inventés) |
| Accueil marketing, `ImpactStats`, FAQ, À propos | **Supprimer** | Chiffres d'impact sans preuve |
| Contact, Newsletter, Profil (changement de mot de passe) | **Supprimer** | Faux succès : aucune opération réelle derrière |
| Dossiers `lib/`, `src/lib/`, `hooks/`, `mon-app/` | **Supprimer** | Doublons et code mort |
| `package.json` racine : supabase, langchain, tremor, nivo, leaflet, chart.js, recharts, axios… | **Supprimer** | Jamais importés ou liés aux fonctions retirées ; nouveau `frontend/package.json` minimal |
| `.venv/` et `__pycache__/` suivis par Git | **Supprimer du suivi** | Environnements générés ; `.gitignore` corrigé |
| `dist/` local | **Supprimé** | Contenait les clés OpenRouter et OpenWeather en clair ; artefact régénérable |
| `node_modules/` racine | **Supprimé** | Régénérable ; ne correspond plus à aucun `package.json` |
| `env.example` racine | **Supprimer** | Invitait à placer des clés fournisseurs dans des variables `VITE_*` |

## Différé, sans code dans la refonte

Météo, IA (reformulation de contenu relu, si un essai est justifié), photos justificatives, mode hors connexion, suivi et bilan de campagne. Chaque ajout exige une décision enregistrée dans [DECISIONS.md](DECISIONS.md).

## Limites de sécurité identifiées

Voir [SECURITE.md](SECURITE.md) : clés présentes dans l'historique public, rotation à effectuer par le titulaire des comptes.
