#!/bin/bash

# Installer les dépendances si nécessaire
pip install -r requirements.txt

# Exporter les variables d'environnement depuis .env si le fichier existe
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Démarrer le serveur Flask
python main.py 