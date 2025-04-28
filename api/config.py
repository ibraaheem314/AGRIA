"""
Configuration des clés API pour le serveur backend.
Pour les vraies données, nous utilisons principalement la clé OpenWeather qui donne accès à:
- Données météo: https://openweathermap.org/api
- Données agricoles (soil, NDVI): https://agromonitoring.com/
- Données de qualité de l'air: https://openweathermap.org/api/air-pollution
"""

# Configuration file for API keys and settings

# Please replace the placeholder values with your actual API keys

CONFIG = {
    # OpenWeather API key - Required for weather data and agricultural monitoring
    "OPENWEATHER_API_KEY": "your_openweather_api_key_here",
    "OPENWEATHER_BASE_URL": "https://api.openweathermap.org/data/2.5",
    
    # AgroMonitoring API base URL - Uses the OpenWeather API key
    "AGROMONITORING_BASE_URL": "https://api.agromonitoring.com/agro/1.0",
    
    # OpenRouter or other LLM provider
    "OPEN_ROUTER_KEY": "your_openrouter_key_here",
    
    # Use real data instead of simulations
    "USE_REAL_DATA": True,
    
    # AirVisual API for air quality data
    "AIRVISUAL_API_KEY": "your_airvisual_key_here",
    
    # Additional APIs can be configured here
    "TWILIO_ACCOUNT_SID": "your_twilio_sid_here",
    "TWILIO_AUTH_TOKEN": "your_twilio_auth_token_here",
    "TWILIO_PHONE_NUMBER": "your_twilio_phone_number_here",
    
    # Database connection string if needed
    "DATABASE_URL": "",
    
    # Email configuration
    "EMAIL_USER": "",
    "EMAIL_PASS": ""
} 