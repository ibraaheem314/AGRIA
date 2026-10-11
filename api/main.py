# Importation des modules nécessaires
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import requests
import json
import logging
from datetime import datetime, timedelta
import random
import jwt  # Pour la gestion des JWT

# Configuration du logging structuré avec encodage UTF-8
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Importer le blueprint d'authentification
from auth import auth_bp, token_required

# Importer la configuration des clés API
try:
    from config import CONFIG
    logger.info("Configuration chargée depuis config.py")
    # Utiliser les clés de config.py
    OPENWEATHER_API_KEY = CONFIG.get("OPENWEATHER_API_KEY", "")
    OPENWEATHER_BASE_URL = CONFIG.get("OPENWEATHER_BASE_URL", "https://api.openweathermap.org/data/2.5")
    AGROMONITORING_BASE_URL = CONFIG.get("AGROMONITORING_BASE_URL", "https://api.agromonitoring.com/agro/1.0")
    OPEN_ROUTER_KEY = CONFIG.get("OPEN_ROUTER_KEY", "")
    USE_REAL_DATA = CONFIG.get("USE_REAL_DATA", True)
except ImportError:
    logger.warning("Fichier config.py non trouvé, utilisation des variables d'environnement")
    # Clés API depuis variables d'environnement (supporte VITE_ et sans VITE_)
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY') or os.environ.get('VITE_OPENWEATHER_API_KEY')
    OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
    AGROMONITORING_BASE_URL = "https://api.agromonitoring.com/agro/1.0"
    OPEN_ROUTER_KEY = os.environ.get('OPEN_ROUTER_KEY') or os.environ.get('VITE_OPEN_ROUTER_KEY')
    USE_REAL_DATA = True

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_agritech')
CORS(app, supports_credentials=True)

# Enregistrer le blueprint d'authentification
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Classes d'erreurs personnalisées
class APIError(Exception):
    """Exception de base pour les erreurs API"""
    def __init__(self, message, code="API_ERROR", status_code=500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)

class ValidationError(APIError):
    """Erreur de validation des données"""
    def __init__(self, message, field=None):
        super().__init__(message, "VALIDATION_ERROR", 400)
        self.field = field

class ExternalServiceError(APIError):
    """Erreur de service externe"""
    def __init__(self, message, service=None):
        super().__init__(message, "EXTERNAL_SERVICE_ERROR", 503)
        self.service = service

class RateLimitError(APIError):
    """Erreur de limite de taux"""
    def __init__(self, message="Trop de requêtes, veuillez patienter"):
        super().__init__(message, "RATE_LIMIT_ERROR", 429)

# Gestionnaire d'erreurs global
@app.errorhandler(APIError)
def handle_api_error(error):
    logger.error(f"API Error: {error.code} - {error.message}")
    response = {
        "error": error.message,
        "code": error.code,
        "timestamp": datetime.now().isoformat()
    }
    
    # Ajouter des détails spécifiques selon le type d'erreur
    if isinstance(error, ValidationError) and hasattr(error, 'field'):
        response["field"] = error.field
    elif isinstance(error, ExternalServiceError) and hasattr(error, 'service'):
        response["service"] = error.service
    
    return jsonify(response), error.status_code

@app.errorhandler(404)
def handle_not_found(error):
    logger.warning(f"Endpoint non trouvé: {request.url}")
    return jsonify({
        "error": "Endpoint non trouvé",
        "code": "NOT_FOUND",
        "timestamp": datetime.now().isoformat()
    }), 404

@app.errorhandler(500)
def handle_internal_error(error):
    logger.error(f"Erreur interne: {str(error)}")
    return jsonify({
        "error": "Erreur interne du serveur",
        "code": "INTERNAL_ERROR",
        "timestamp": datetime.now().isoformat()
    }), 500

# Gestion de la mémoire des conversations du chatbot
def get_chat_memory():
    if "agribot_memory" not in session:
        session["agribot_memory"] = [
            {"role": "system", "content": "Tu es AgriBot, un assistant agricole francophone expert en IA, en climat et en agriculture durable. Réponds de manière naturelle, polie et utile."}
        ]
    return session["agribot_memory"]

@app.route('/api/agribot', methods=['POST'])
def agribot():
    try:
        data = request.json
        
        # Validation des données d'entrée
        if not data:
            raise ValidationError("Corps de requête JSON requis")
        
        user_input = data.get("question", "").strip()
        
        # Validation de la question
        if not user_input:
            raise ValidationError("Le champ 'question' est requis et ne peut pas être vide", "question")
        
        if len(user_input) > 1000:
            raise ValidationError("La question ne peut pas dépasser 1000 caractères", "question")
        
        logger.info(f"Requête chatbot reçue: {user_input[:50]}...")
        
        # Si la clé OpenRouter est configurée, utiliser ce service
        if OPEN_ROUTER_KEY and OPEN_ROUTER_KEY != "your_openrouter_key_here":
            response = handle_openrouter_chat(user_input)
        else:
            # Sinon, utiliser un système de réponse local basé sur des règles
            logger.info("Utilisation du chatbot local (clé API manquante)")
            response = handle_local_chat(user_input)
            
        return jsonify({
            "response": response,
            "timestamp": datetime.now().isoformat()
        })
        
    except ValidationError as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur dans l'API chatbot: {str(e)}")
        raise APIError("Erreur lors du traitement de votre question")

def handle_openrouter_chat(user_input):
    # Obtenir la mémoire des conversations
    messages = get_chat_memory()
    
    # Ajouter le message de l'utilisateur
    messages.append({"role": "user", "content": user_input})
    
    try:
        logger.info("Appel à l'API OpenRouter")
        # Appel à l'API OpenRouter avec timeout
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPEN_ROUTER_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "anthropic/claude-3-haiku",  # Modèle économique et rapide
                "messages": messages
            },
            timeout=30  # Timeout de 30 secondes
        )
        
        response.raise_for_status()  # Lever une exception pour les codes d'erreur HTTP
        response_data = response.json()
        
        if not response_data.get("choices") or not response_data["choices"][0].get("message"):
            raise ExternalServiceError("Réponse invalide de l'API OpenRouter", "OpenRouter")
        
        assistant_message = response_data["choices"][0]["message"]["content"]
        
        # Ajouter la réponse de l'assistant à la mémoire
        messages.append({"role": "assistant", "content": assistant_message})
        
        # Limiter la taille de la mémoire (garder le système + 10 derniers messages)
        if len(messages) > 11:
            messages = [messages[0]] + messages[-10:]
            
        # Mettre à jour la session
        session["agribot_memory"] = messages
        
        logger.info("Réponse OpenRouter traitée avec succès")
        return assistant_message
        
    except requests.exceptions.Timeout:
        logger.error("Timeout de l'API OpenRouter")
        raise ExternalServiceError("Le service IA met trop de temps à répondre", "OpenRouter")
    except requests.exceptions.ConnectionError:
        logger.error("Erreur de connexion à OpenRouter")
        raise ExternalServiceError("Impossible de contacter le service IA", "OpenRouter")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            logger.error("Rate limit OpenRouter atteint")
            raise RateLimitError("Service IA temporairement surchargé")
        elif e.response.status_code == 401:
            logger.error("Clé API OpenRouter invalide")
            raise ExternalServiceError("Configuration du service IA incorrecte", "OpenRouter")
        else:
            logger.error(f"Erreur HTTP OpenRouter: {e.response.status_code}")
            raise ExternalServiceError("Erreur du service IA", "OpenRouter")
    except Exception as e:
        logger.error(f"Erreur OpenRouter inattendue: {str(e)}")
        # Fallback sur le système local
        return handle_local_chat(user_input)

def handle_local_chat(user_input):
    """Système de chatbot local avec réponses intelligentes"""
    user_lower = user_input.lower()
    
    # Réponses basées sur les mots-clés agricoles
    if any(word in user_lower for word in ['irrigation', 'arrosage', 'eau']):
        return "IRRIGATION: Pour l'irrigation optimale, je recommande d'arroser tôt le matin ou en soirée pour éviter l'évaporation. Vérifiez l'humidité du sol avant d'arroser et privilégiez l'irrigation goutte-à-goutte pour économiser l'eau."
    
    elif any(word in user_lower for word in ['engrais', 'fertilisant', 'nutriment']):
        return "ENGRAIS: Pour les engrais naturels, utilisez du compost, du fumier bien décomposé, ou des engrais verts. L'analyse de sol vous aidera à déterminer les besoins spécifiques en NPK de vos cultures."
    
    elif any(word in user_lower for word in ['maladie', 'parasites', 'ravageur']):
        return "PROTECTION: Pour lutter contre les maladies et ravageurs naturellement, privilégiez la rotation des cultures, les plantes compagnes, et les traitements préventifs à base de purin d'ortie ou de savon noir."
    
    elif any(word in user_lower for word in ['plantation', 'semis', 'planter']):
        return "PLANTATION: Le timing de plantation dépend de votre région et du type de culture. Consultez le calendrier lunaire et respectez les périodes de gel. Préparez bien le sol avec du compost avant la plantation."
    
    elif any(word in user_lower for word in ['sol', 'terre', 'ph']):
        return "SOL: Un sol sain est la base d'une agriculture durable. Testez le pH (idéal entre 6-7), ajoutez de la matière organique régulièrement, et évitez le travail du sol quand il est trop humide."
    
    elif any(word in user_lower for word in ['météo', 'climat', 'température']):
        return "METEO: Surveillez les prévisions météo pour planifier vos activités agricoles. Protégez vos cultures des gelées tardives et adaptez l'irrigation selon les précipitations prévues."
    
    else:
        return "AGRIBOT: Merci pour votre question ! Je suis là pour vous aider avec vos pratiques agricoles durables. N'hésitez pas à me poser des questions spécifiques sur l'irrigation, les engrais naturels, la protection des cultures, ou la gestion du sol."

@app.route('/api/weather', methods=['GET'])
def get_weather():
    try:
        # Validation des paramètres
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            raise ValidationError("Les paramètres 'lat' et 'lon' sont requis")
        
        try:
            lat = float(lat)
            lon = float(lon)
        except ValueError:
            raise ValidationError("Les coordonnées doivent être des nombres valides")
        
        # Validation des limites géographiques
        if not (-90 <= lat <= 90):
            raise ValidationError("La latitude doit être entre -90 et 90")
        if not (-180 <= lon <= 180):
            raise ValidationError("La longitude doit être entre -180 et 180")
        
        logger.info(f"Requête météo pour lat={lat}, lon={lon}")
        
        # Vérifier si la clé API est disponible
        if not OPENWEATHER_API_KEY or OPENWEATHER_API_KEY == "your_openweather_api_key_here":
            logger.warning("Clé API OpenWeather manquante, utilisation de données simulées")
            return jsonify(get_simulated_weather_data(lat, lon))
        
        # Appel à l'API OpenWeather
        url = f"{OPENWEATHER_BASE_URL}/weather"
        params = {
            'lat': lat,
            'lon': lon,
            'units': 'metric',
            'appid': OPENWEATHER_API_KEY,
            'lang': 'fr'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        logger.info("Données météo récupérées avec succès")
        
        return jsonify({
            "temperature": data['main']['temp'],
            "humidity": data['main']['humidity'],
            "windSpeed": data['wind']['speed'],
            "description": data['weather'][0]['description'],
            "cityName": data['name'],
            "country": data['sys']['country'],
            "timestamp": datetime.now().isoformat()
        })
        
    except ValidationError as e:
        raise e
    except requests.exceptions.Timeout:
        logger.error("Timeout de l'API OpenWeather")
        raise ExternalServiceError("Le service météo met trop de temps à répondre", "OpenWeather")
    except requests.exceptions.ConnectionError:
        logger.error("Erreur de connexion à OpenWeather")
        raise ExternalServiceError("Impossible de contacter le service météo", "OpenWeather")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            logger.error("Clé API OpenWeather invalide")
            raise ExternalServiceError("Configuration du service météo incorrecte", "OpenWeather")
        elif e.response.status_code == 429:
            logger.error("Rate limit OpenWeather atteint")
            raise RateLimitError("Service météo temporairement surchargé")
        else:
            logger.error(f"Erreur HTTP OpenWeather: {e.response.status_code}")
            raise ExternalServiceError("Erreur du service météo", "OpenWeather")
    except Exception as e:
        logger.error(f"Erreur météo inattendue: {str(e)}")
        # Fallback sur des données simulées
        return jsonify(get_simulated_weather_data(lat, lon))

def get_simulated_weather_data(lat, lon):
    """Génère des données météo simulées réalistes"""
    import random
    
    # Ajuster la température selon la latitude (plus froid aux pôles)
    base_temp = 20 - abs(lat) * 0.5
    temperature = base_temp + random.uniform(-10, 15)
    
    return {
        "temperature": round(temperature, 1),
        "humidity": random.randint(30, 90),
        "windSpeed": round(random.uniform(0, 15), 1),
        "description": random.choice([
            "ensoleillé", "partiellement nuageux", "nuageux", 
            "légèrement pluvieux", "brouillard"
        ]),
        "cityName": f"Ville {lat:.1f}N {lon:.1f}E",
        "country": "Demo",
        "timestamp": datetime.now().isoformat(),
        "simulated": True
    }

# Route simplifiée pour les statistiques utilisateur (remplace les anciennes routes complexes)
@app.route('/api/user-stats', methods=['GET'])
def get_user_stats():
    """Statistiques simplifiées pour le profil utilisateur"""
    try:
        stats = {
            "aiQuestions": random.randint(40, 60),
            "weatherChecks": random.randint(140, 180),
            "daysActive": random.randint(20, 30),
            "lastActivity": datetime.now().isoformat()
        }
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des stats: {str(e)}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

# Endpoint de vérification de santé de l'API
@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de santé avec diagnostics détaillés"""
    try:
        # Vérifier les services essentiels (version simplifiée)
        services_status = {
            "weather": OPENWEATHER_API_KEY is not None and OPENWEATHER_API_KEY != "your_openweather_api_key_here",
            "chatbot": OPEN_ROUTER_KEY is not None and OPEN_ROUTER_KEY != "your_openrouter_key_here",
            "auth": True
        }
        
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "services": services_status,
            "uptime": "N/A"  # Pourrait être calculé avec un timestamp de démarrage
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans health check: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug_mode = os.environ.get('FLASK_ENV', 'production') == 'development'
    
    logger.info(f"Démarrage du serveur AGRIA sur le port {port}")
    logger.info(f"Mode debug: {debug_mode}")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode) 