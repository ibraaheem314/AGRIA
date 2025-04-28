# AgriTech - Plateforme d'Agriculture Durable

## À propos du projet

AgriTech est une plateforme web moderne dédiée à l'agriculture durable, offrant aux agriculteurs des outils intelligents pour optimiser leurs pratiques agricoles, réduire leur impact environnemental et améliorer leurs rendements.

La plateforme combine différentes sources de données en temps réel (météo, qualité de l'air, données climatiques) et utilise l'intelligence artificielle pour fournir des analyses et des recommandations personnalisées.

## Fonctionnalités principales

- **Tableau de bord interactif** avec indicateurs de performance et scores de durabilité
- **Suivi météorologique et climatique** en temps réel avec visualisation des données
- **Assistant IA (AgriBot)** pour répondre aux questions sur l'agriculture durable
- **Analyse de sol et recommandations** basées sur les données de terrain
- **Suivi des ressources** (eau, énergie, empreinte carbone)
- **Planification de tâches** avec priorisation intelligente
- **Marketplace** pour l'achat de produits et services agricoles durables

## Technologies utilisées

### Frontend
- React avec TypeScript
- React Router pour la navigation
- Framer Motion pour les animations
- TailwindCSS pour le styling
- Lucide React pour les icônes

### Backend
- API Python avec serveur HTTP natif
- Intégration avec diverses APIs externes:
  - OpenWeather pour les données météorologiques
  - AirVisual pour la qualité de l'air
  - Agromonitoring pour les données climatiques agricoles
  - OpenAI pour l'assistant agricole intelligent

## Installation et démarrage

### Prérequis
- Node.js (v14+)
- Python (v3.8+)
- Clés API pour les services externes (référez-vous au fichier `.env.example`)

### Configuration
1. Clonez le dépôt
   ```bash
   git clone https://github.com/votre-username/agritech.git
   cd agritech
   ```

2. Installez les dépendances frontend
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec vos clés API:
   ```
   VITE_OPEN_ROUTER_KEY=votre_clé_openrouter
   VITE_HUGGING_FACE_TOKEN_1=votre_clé_huggingface_1
   VITE_HUGGING_FACE_TOKEN_2=votre_clé_huggingface_2
   VITE_HUGGING_FACE_TOKEN_3=votre_clé_huggingface_3
   VITE_OPENWEATHER_API_KEY=votre_clé_openweather
   VITE_AIRVISUAL_API_KEY=votre_clé_airvisual
   VITE_AGROMONITORING_API_KEY=votre_clé_agromonitoring
   ```

4. Installez les dépendances Python (si nécessaire)
   ```bash
   pip install numpy
   ```

### Démarrage
1. Lancez le serveur backend Python
   ```bash
   cd api
   chmod +x run_server.sh
   ./run_server.sh
   ```

2. Dans un autre terminal, lancez l'application frontend
   ```bash
   npm run dev
   ```

3. Accédez à l'application via `http://localhost:5173`

## Structure du projet

```
agritech/
├── api/                # Backend Python
│   └── main.py         # Serveur HTTP et endpoints API
├── lib/                # Bibliothèques partagées
│   ├── api/            # Services API pour la communication avec les APIs externes
│   │   ├── weather.ts  # Service météo
│   │   ├── climate.ts  # Service climat
│   │   ├── airQuality.ts # Service qualité de l'air
│   │   └── chatbot.ts  # Service assistant IA
│   └── config.ts       # Configuration (clés API, URLs)
├── hooks/              # Hooks React personnalisés
│   ├── useWeather.ts   # Hook pour les données météo
│   ├── useClimate.ts   # Hook pour les données climatiques
│   ├── useChatbot.ts   # Hook pour l'assistant IA
│   └── usePythonApi.ts # Hook pour l'API Python
├── src/
│   ├── components/     # Composants React
│   │   ├── ai/         # Composants liés à l'IA
│   │   ├── layout/     # Layouts et navigation
│   │   ├── marketplace/# Composants du marketplace
│   │   ├── resources/  # Composants ressources et articles
│   │   ├── sustainability/ # Composants liés à la durabilité
│   │   ├── tasks/      # Gestion des tâches
│   │   ├── ui/         # Composants UI réutilisables
│   │   └── weather/    # Composants météo
│   ├── pages/          # Pages de l'application
│   │   ├── Dashboard.tsx # Tableau de bord principal
│   │   ├── WeatherPage.tsx # Page météo et climat
│   │   └── Home.tsx    # Page d'accueil
│   ├── utils/          # Utilitaires
│   └── App.tsx         # Point d'entrée React avec routes
└── env.d.ts            # Définitions TypeScript pour les variables d'environnement
```

## APIs utilisées

- **OpenWeather API**: Fournit des données météorologiques en temps réel
- **AirVisual API**: Fournit des données sur la qualité de l'air
- **Agromonitoring API**: Fournit des données climatiques et agricoles
- **OpenRouter/OpenAI API**: Alimente l'assistant IA pour les conseils agricoles

## Déploiement

Pour le déploiement en production:

1. Construisez l'application React
   ```bash
   npm run build
   ```

2. Configurez votre serveur web (Apache/Nginx) pour servir le contenu de `dist/`

3. Configurez votre serveur Python avec gunicorn ou un autre serveur WSGI

## Contribuer

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
