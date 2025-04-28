# Importation des modules nécessaires
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import requests
import json
from datetime import datetime, timedelta
import random

# Importer la configuration des clés API
try:
    from config import CONFIG
    print("Configuration chargée depuis config.py")
    # Utiliser les clés de config.py
    OPENWEATHER_API_KEY = CONFIG.get("OPENWEATHER_API_KEY", "")
    OPENWEATHER_BASE_URL = CONFIG.get("OPENWEATHER_BASE_URL", "https://api.openweathermap.org/data/2.5")
    AGROMONITORING_BASE_URL = CONFIG.get("AGROMONITORING_BASE_URL", "https://api.agromonitoring.com/agro/1.0")
    OPEN_ROUTER_KEY = CONFIG.get("OPEN_ROUTER_KEY", "")
    USE_REAL_DATA = CONFIG.get("USE_REAL_DATA", True)
except ImportError:
    print("Fichier config.py non trouvé, utilisation des variables d'environnement")
    # Clés API depuis variables d'environnement (supporte VITE_ et sans VITE_)
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY') or os.environ.get('VITE_OPENWEATHER_API_KEY')
    OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
    AGROMONITORING_BASE_URL = "https://api.agromonitoring.com/agro/1.0"
    OPEN_ROUTER_KEY = os.environ.get('OPEN_ROUTER_KEY') or os.environ.get('VITE_OPEN_ROUTER_KEY')
    USE_REAL_DATA = True

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_agritech')
CORS(app, supports_credentials=True)

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
        user_input = data.get("question", "").strip()
        
        # Vérifier si l'entrée est vide
        if not user_input:
            return jsonify({"response": "Je n'ai pas compris votre question. Pouvez-vous reformuler?"}), 400
        
        # Si la clé OpenRouter est configurée, utiliser ce service
        if OPEN_ROUTER_KEY:
            response = handle_openrouter_chat(user_input)
        else:
            # Sinon, utiliser un système de réponse local basé sur des règles
            response = handle_local_chat(user_input)
            
        return jsonify({"response": response})
    except Exception as e:
        print(f"Erreur dans l'API chatbot: {str(e)}")
        return jsonify({"error": str(e)}), 500

def handle_openrouter_chat(user_input):
    # Obtenir la mémoire des conversations
    messages = get_chat_memory()
    
    # Ajouter le message de l'utilisateur
    messages.append({"role": "user", "content": user_input})
    
    try:
        # Appel à l'API OpenRouter
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPEN_ROUTER_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "anthropic/claude-3-haiku",  # Modèle économique et rapide
                "messages": messages
            }
        )
        
        response_data = response.json()
        assistant_message = response_data["choices"][0]["message"]["content"]
        
        # Ajouter la réponse de l'assistant à la mémoire
        messages.append({"role": "assistant", "content": assistant_message})
        
        # Limiter la taille de la mémoire (garder le système + 10 derniers messages)
        if len(messages) > 11:
            messages = [messages[0]] + messages[-10:]
            
        # Mettre à jour la session
        session["agribot_memory"] = messages
        
        return assistant_message
    except Exception as e:
        print(f"Erreur OpenRouter: {str(e)}")
        # Fallback sur le système local
        return handle_local_chat(user_input)

def handle_local_chat(user_input):
    # Système de réponse local basé sur des mots-clés
    user_input = user_input.lower()
    
    responses = {
        "bonjour": "Bonjour ! Comment puis-je vous aider avec vos cultures aujourd'hui ?",
        "irrigation": "Pour une irrigation optimale, tenez compte de l'humidité du sol, des prévisions météo et des besoins spécifiques de vos cultures. Il est généralement préférable d'arroser moins souvent mais plus abondamment.",
        "engrais": "Les engrais organiques comme le compost sont excellents pour améliorer la structure du sol. Pour les engrais chimiques, assurez-vous de respecter les dosages recommandés et d'analyser régulièrement votre sol.",
        "rotation": "La rotation des cultures est essentielle pour maintenir la santé du sol et réduire les problèmes de ravageurs. Alternez les familles de plantes et incluez des légumineuses qui fixent l'azote.",
        "bio": "L'agriculture biologique favorise la biodiversité et la santé des sols. Elle évite les pesticides et engrais de synthèse, privilégiant des méthodes naturelles de lutte contre les ravageurs et d'amélioration de la fertilité.",
    }
    
    # Chercher des correspondances
    for keyword, response in responses.items():
        if keyword in user_input:
            return response
    
    # Réponse par défaut
    return "Je ne suis pas sûr de comprendre votre question. Pourriez-vous me demander quelque chose sur l'irrigation, les engrais, la rotation des cultures ou l'agriculture biologique ?"

@app.route('/api/weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({"error": "Latitude et longitude requises"}), 400
        
    try:
        lat, lon = float(lat), float(lon)
        url = f"{OPENWEATHER_BASE_URL}/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
        
        response = requests.get(url)
        if not response.ok:
            # Si l'API renvoie une erreur, renvoyer l'erreur avec le code HTTP approprié
            return jsonify({"error": f"Erreur OpenWeather: {response.status_code}"}), response.status_code
        
        weather_data = response.json()
        
        # Extraire les données pertinentes
        main = weather_data.get("main", {})
        weather = weather_data.get("weather", [{}])[0]
        wind = weather_data.get("wind", {})
        
        # Formater la réponse
        formatted_data = {
            "temperature": main.get("temp"),
            "feels_like": main.get("feels_like"),
            "humidity": main.get("humidity"),
            "pressure": main.get("pressure"),
            "description": weather.get("description"),
            "icon": weather.get("icon"),
            "windSpeed": wind.get("speed"),
            "windDirection": wind.get("deg"),
            "city": weather_data.get("name"),
            "visibility": weather_data.get("visibility"),
            "clouds": weather_data.get("clouds", {}).get("all"),
            "timestamp": weather_data.get("dt"),
            "timezone": weather_data.get("timezone")
        }
        
        return jsonify(formatted_data)
    except Exception as e:
        return jsonify({"error": f"Erreur: {str(e)}"}), 500

@app.route('/api/airquality', methods=['GET'])
def get_air_quality():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({"error": "Latitude et longitude requises"}), 400
        
    try:
        lat, lon = float(lat), float(lon)
        url = f"{OPENWEATHER_BASE_URL}/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
        
        response = requests.get(url)
        if not response.ok:
            return jsonify({"error": f"Erreur OpenWeather: {response.status_code}"}), response.status_code
        
        air_data = response.json()
        
        # Vérifier que les données sont présentes
        if not air_data.get("list") or len(air_data["list"]) == 0:
            return jsonify({"error": "Données de qualité d'air non disponibles"}), 404
        
        # Extraire les données pertinentes
        pollution = air_data["list"][0]
        aqi = pollution.get("main", {}).get("aqi")
        components = pollution.get("components", {})
        
        # Formater la réponse
        formatted_data = {
            "aqi": aqi,
            "category": get_aqi_category(aqi),
            "components": {
                "co": components.get("co"),
                "no": components.get("no"),
                "no2": components.get("no2"),
                "o3": components.get("o3"),
                "so2": components.get("so2"),
                "pm2_5": components.get("pm2_5"),
                "pm10": components.get("pm10"),
                "nh3": components.get("nh3")
            },
            "timestamp": pollution.get("dt")
        }
        
        # Ajouter des descriptions et recommandations
        if aqi == 1:
            formatted_data["description"] = "Qualité de l'air bonne"
            formatted_data["recommendation"] = "Excellentes conditions pour les activités extérieures."
        elif aqi == 2:
            formatted_data["description"] = "Qualité de l'air correcte"
            formatted_data["recommendation"] = "Conditions favorables pour la plupart des activités extérieures."
        elif aqi == 3:
            formatted_data["description"] = "Qualité de l'air moyenne"
            formatted_data["recommendation"] = "Limitez l'effort prolongé pour les personnes sensibles."
        elif aqi == 4:
            formatted_data["description"] = "Qualité de l'air mauvaise"
            formatted_data["recommendation"] = "Évitez les activités prolongées en extérieur."
        elif aqi == 5:
            formatted_data["description"] = "Qualité de l'air très mauvaise"
            formatted_data["recommendation"] = "Évitez les activités extérieures, particulièrement nocif pour la santé."
        
        return jsonify(formatted_data)
    except Exception as e:
        return jsonify({"error": f"Erreur: {str(e)}"}), 500

def get_aqi_category(aqi):
    categories = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    }
    return categories.get(aqi, "Unknown")

@app.route('/api/climate', methods=['POST'])
def get_climate():
    try:
        data = request.json
        if not data or not data.get('polygon'):
            return jsonify({"error": "Coordonnées du polygone requises"}), 400
            
        polygon = data.get('polygon')
        
        # Extraire le centre du polygone pour les données météo
        # En calculant la moyenne des coordonnées
        center_lat = sum(point[1] for point in polygon) / len(polygon)
        center_lon = sum(point[0] for point in polygon) / len(polygon)
        
        # Utiliser l'API Agromonitoring avec la clé OpenWeather
        url = f"{AGROMONITORING_BASE_URL}/soil?lat={center_lat}&lon={center_lon}&appid={OPENWEATHER_API_KEY}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Si l'API ne renvoie pas les données au format attendu
            if not isinstance(data, dict):
                # Tenter avec l'API météo comme fallback pour générer des données cohérentes
                return get_climate_from_weather(center_lat, center_lon)
            
            climate_data = {
                "soilMoisture": data.get("moisture", 0),
                "ndvi": data.get("ndvi", 0),
                "precipitation": data.get("precipitation", 0)
            }
            
            return jsonify(climate_data)
        except requests.RequestException as e:
            # Si l'API Agromonitoring échoue, utiliser les données météo
            print(f"Fallback vers données météo: {str(e)}")
            return get_climate_from_weather(center_lat, center_lon)
            
    except Exception as e:
        print(f"Erreur générale: {str(e)}")
        return jsonify({"error": f"Erreur: {str(e)}"}), 500

def get_climate_from_weather(lat, lon):
    """Fallback pour obtenir des données climatiques à partir des données météo"""
    try:
        url = f"{OPENWEATHER_BASE_URL}/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()
        
        # Extraire les données pertinentes
        main = weather_data.get("main", {})
        humidity = main.get("humidity", 50)  # Humidité atmosphérique
        clouds = weather_data.get("clouds", {}).get("all", 0)  # Couverture nuageuse
        
        # Estimer l'humidité du sol basée sur l'humidité atmosphérique
        # et la pression (indicateur approximatif de conditions météo)
        pressure = main.get("pressure", 1013) 
        soil_moisture = max(20, min(70, humidity - 10 + (pressure - 1013) / 10))
        
        # NDVI approximatif basé sur la couverture nuageuse et la saison
        # (très approximatif, juste pour avoir des données)
        current_month = datetime.now().month
        season_factor = 0.8 if 4 <= current_month <= 9 else 0.5  # Été vs hiver
        ndvi = (1 - clouds / 200) * season_factor  # Entre 0 et ~0.8
        
        # Precipitation des dernières 24h (approximation)
        rain_1h = weather_data.get("rain", {}).get("1h", 0)
        rain_3h = weather_data.get("rain", {}).get("3h", 0)
        precipitation = rain_3h if rain_3h > 0 else rain_1h * 3
        
        climate_data = {
            "soilMoisture": round(soil_moisture, 1),
            "ndvi": round(ndvi, 2),
            "precipitation": round(precipitation, 1)
        }
        
        return jsonify(climate_data)
    except Exception as e:
        print(f"Erreur génération données climat: {str(e)}")
        return jsonify({"error": f"Erreur génération données climat: {str(e)}"}), 503

@app.route('/api/soil-analysis', methods=['GET'])
def get_soil_analysis():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({"error": "Latitude et longitude requises"}), 400
        
    # Essayer de récupérer les données complètes
    try:
        # Utiliser l'API OpenWeather pour les données météo
        url = f"{OPENWEATHER_BASE_URL}/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()
        
        # Récupérer les données additionnelles: forecast et air pollution
        forecast_url = f"{OPENWEATHER_BASE_URL}/forecast?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json() if forecast_response.ok else {}
        
        air_url = f"{OPENWEATHER_BASE_URL}/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
        air_response = requests.get(air_url)
        air_data = air_response.json() if air_response.ok else {}
        
        # Créer des données de sol basées sur une combinaison de facteurs
        # météo, prévisions et qualité de l'air
        main = weather_data.get("main", {})
        temp = main.get("temp", 15)
        pressure = main.get("pressure", 1013)
        humidity = main.get("humidity", 50)
        
        # Extraire des facteurs supplémentaires
        wind = weather_data.get("wind", {}).get("speed", 3)
        rain_mm = weather_data.get("rain", {}).get("1h", 0)
        clouds = weather_data.get("clouds", {}).get("all", 0)
        
        # Facteurs de pollution
        pollution = {}
        if "list" in air_data and len(air_data["list"]) > 0:
            pollution = air_data["list"][0].get("components", {})
        
        # Génération de données de sol cohérentes avec les conditions météo
        # Le pH est influencé par les pluies (acidification) et pollution
        ph_base = 6.8
        ph_rain_factor = -0.02 * rain_mm if rain_mm > 0 else 0
        ph_pollution_factor = -0.01 * (pollution.get("so2", 0) / 10)  # SO2 acidifie
        ph_level = round(max(5.5, min(7.5, ph_base + ph_rain_factor + ph_pollution_factor)), 1)
        
        # Azote: influencé par l'humidité, la température
        nitrogen_base = 0.25
        nitrogen_humidity_factor = 0.1 * (humidity / 100)
        nitrogen_temp_factor = 0.05 * ((temp - 10) / 20)  # Activité microbienne
        nitrogen = round(max(0.1, min(0.6, nitrogen_base + nitrogen_humidity_factor + nitrogen_temp_factor)), 2)
        
        # Phosphore: plus stable, mais influencé par pH
        phosphorus_base = 25
        phosphorus_ph_factor = 5 * (1 - abs(ph_level - 6.5) / 2)  # Optimal à pH 6.5
        phosphorus = round(max(10, min(50, phosphorus_base + phosphorus_ph_factor)), 1)
        
        # Potassium: influencé par l'humidité et érosion (vent)
        potassium_base = 150
        potassium_humidity_factor = 20 * (humidity / 100)
        potassium_wind_factor = -5 * (wind / 5)  # Le vent peut causer l'érosion
        potassium = round(max(100, min(300, potassium_base + potassium_humidity_factor + potassium_wind_factor)), 1)
        
        # Matière organique: fonction du climat, de la saison
        month = datetime.now().month
        is_growing_season = 3 <= month <= 10  # Printemps-Été-Automne
        organic_base = 3.0
        organic_season_factor = 0.5 if is_growing_season else -0.5
        organic_matter = round(max(1.5, min(6.0, organic_base + organic_season_factor)), 1)
        
        # Générer des recommandations basées sur ces valeurs
        recommendations = []
        
        if ph_level < 6.0:
            recommendations.append("Le sol est acide, envisager un chaulage pour augmenter le pH")
        elif ph_level > 7.2:
            recommendations.append("Le sol est alcalin, privilégier des cultures adaptées ou des amendements acidifiants")
        
        if nitrogen < 0.2:
            recommendations.append("Niveau d'azote faible, envisager un apport d'engrais azotés ou de légumineuses")
        elif nitrogen > 0.4:
            recommendations.append("Bon niveau d'azote, limiter les apports supplémentaires")
            
        if humidity > 70:
            recommendations.append("Humidité élevée, surveiller les risques de maladies fongiques")
        elif humidity < 40:
            recommendations.append("Conditions sèches, optimiser l'irrigation")
            
        # Limiter à 3 recommandations maximum
        if len(recommendations) > 3:
            recommendations = recommendations[:3]
        elif len(recommendations) < 2:
            recommendations.append("Surveiller les conditions météo et ajuster les pratiques culturales en conséquence")
            
        soil_data = {
            "ph_level": ph_level,
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
            "organic_matter": organic_matter,
            "recommendations": recommendations
        }
            
        return jsonify(soil_data)
    except Exception as e:
        print(f"Erreur analyse de sol: {str(e)}")
        return jsonify({"error": f"Erreur analyse de sol: {str(e)}"}), 503

def generate_soil_recommendations():
    recommendations = [
        "Ajouter de l'engrais azoté pour soutenir la croissance des plantes",
        "Maintenir les niveaux actuels de phosphore",
        "Envisager d'ajouter de la matière organique pour améliorer la structure du sol",
        "Surveiller le pH du sol pour assurer une disponibilité optimale des nutriments",
        "Planter des légumineuses pour améliorer naturellement la teneur en azote"
    ]
    
    # Sélectionner 3 recommandations aléatoires
    return random.sample(recommendations, 3)

@app.route('/api/crop-prediction', methods=['GET'])
def get_crop_prediction():
    # Simulation de prédiction de rendement de culture
    crops = {
        "wheat": {
            "yield": random.uniform(4.5, 7.2),  # tonnes/hectare
            "confidence": random.uniform(0.65, 0.95),
            "factors": ["temperature", "rainfall", "soil quality"]
        },
        "corn": {
            "yield": random.uniform(6.5, 12.0),  # tonnes/hectare
            "confidence": random.uniform(0.7, 0.92),
            "factors": ["temperature", "rainfall", "nitrogen"]
        },
        "soybean": {
            "yield": random.uniform(2.5, 4.8),  # tonnes/hectare
            "confidence": random.uniform(0.6, 0.9),
            "factors": ["temperature", "soil pH", "phosphorus"]
        }
    }
    
    return jsonify(crops)

@app.route('/api/optimize-irrigation', methods=['POST'])
def optimize_irrigation():
    # Traitement de la demande d'optimisation de l'irrigation
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Données d'entrée requises"}), 400
            
        field_size = data.get('field_size', 1)  # Taille en hectares
        crop_type = data.get('crop_type', 'wheat')
        soil_type = data.get('soil_type', 'loam')
        
        # Simuler un calcul d'optimisation d'irrigation
        base_water_needs = {
            "wheat": 5.0,  # mm/jour
            "corn": 7.5,
            "soybean": 6.0,
            "tomato": 8.0,
            "potato": 6.5
        }.get(crop_type, 6.0)
        
        soil_factor = {
            "sand": 1.3,  # Drainage rapide
            "loam": 1.0,  # Équilibré
            "clay": 0.8   # Rétention d'eau
        }.get(soil_type, 1.0)
        
        # Calculer les besoins en eau ajustés
        adjusted_water_needs = base_water_needs * soil_factor
        
        # Calculer le volume total
        volume_per_day = adjusted_water_needs * field_size * 10  # en m³/jour
        
        recommendations = [
            f"Besoin quotidien: {round(adjusted_water_needs, 1)} mm/jour",
            f"Volume total: {round(volume_per_day, 1)} m³/jour pour {field_size} hectares",
            "Irriguer tôt le matin pour minimiser l'évaporation"
        ]
        
        if soil_type == "sand":
            recommendations.append("Irrigations plus fréquentes mais moins abondantes recommandées")
        elif soil_type == "clay":
            recommendations.append("Irrigations moins fréquentes mais plus abondantes recommandées")
        
        result = {
            "daily_water_needs": round(adjusted_water_needs, 2),
            "volume_per_day": round(volume_per_day, 2),
            "recommendations": recommendations,
            "efficiency_score": random.randint(65, 95)
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Erreur: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    # Endpoint de vérification de santé de l'API
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "apis": {
            "weather": OPENWEATHER_API_KEY is not None,
            "climate": OPENWEATHER_API_KEY is not None,  # Même clé
            "chatbot": OPEN_ROUTER_KEY is not None
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True) 