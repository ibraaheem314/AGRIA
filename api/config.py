"""
Configuration sécurisée pour le serveur backend AGRIA.
Gestion des variables d'environnement avec validation et valeurs par défaut.
"""
import os
import secrets
import logging
from typing import Dict, Any, Optional

# Configuration du logger pour ce module avec encodage UTF-8
logger = logging.getLogger(__name__)

class SecurityConfig:
    """Configuration de sécurité centralisée"""
    
    @staticmethod
    def get_secret_key() -> str:
        """Récupère ou génère une clé secrète sécurisée"""
        secret = os.environ.get('SECRET_KEY')
        if not secret or secret in ['your_super_secret_key_here', 'dev_secret_key_for_auth_tokens']:
            if os.environ.get('FLASK_ENV') == 'production':
                raise ValueError("SECRET_KEY must be set in production environment!")
            # Génération automatique pour développement uniquement
            secret = secrets.token_hex(32)
            logger.warning("ATTENTION: Clé secrète générée automatiquement pour développement!")
            logger.warning("En production, définissez SECRET_KEY dans les variables d'environnement.")
        return secret
    
    @staticmethod
    def validate_api_key(key: str, service_name: str) -> bool:
        """Valide qu'une clé API n'est pas une valeur par défaut"""
        if not key:
            return False
        
        invalid_patterns = [
            'your_',
            '_key_here',
            'example',
            'test_key',
            'demo_key'
        ]
        
        return not any(pattern in key.lower() for pattern in invalid_patterns)

class APIConfig:
    """Configuration des APIs externes"""
    
    def __init__(self):
        self.openweather_key = self._get_openweather_key()
        self.open_router_key = self._get_open_router_key()
        self.airvisual_key = self._get_airvisual_key()
        
    def _get_openweather_key(self) -> Optional[str]:
        """Récupère la clé OpenWeather avec validation"""
        key = os.environ.get('OPENWEATHER_API_KEY')
        if SecurityConfig.validate_api_key(key, 'OpenWeather'):
            logger.info("[OK] Clé OpenWeather API configurée")
            return key
        else:
            logger.warning("[WARNING] Clé OpenWeather API non configurée - mode simulation activé")
            return None
    
    def _get_open_router_key(self) -> Optional[str]:
        """Récupère la clé OpenRouter avec validation"""
        key = os.environ.get('OPEN_ROUTER_KEY')
        if SecurityConfig.validate_api_key(key, 'OpenRouter'):
            logger.info("[OK] Clé OpenRouter API configurée")
            return key
        else:
            logger.warning("[WARNING] Clé OpenRouter API non configurée - chatbot local activé")
            return None
    
    def _get_airvisual_key(self) -> Optional[str]:
        """Récupère la clé AirVisual avec validation"""
        key = os.environ.get('AIRVISUAL_API_KEY')
        if SecurityConfig.validate_api_key(key, 'AirVisual'):
            logger.info("[OK] Clé AirVisual API configurée")
            return key
        else:
            logger.warning("[WARNING] Clé AirVisual API non configurée - données simulées")
            return None

class DatabaseConfig:
    """Configuration de la base de données"""
    
    @staticmethod
    def get_database_url() -> str:
        """Récupère l'URL de la base de données"""
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            # Base de données SQLite par défaut pour développement
            db_url = 'sqlite:///agria.db'
            logger.info("[INFO] Utilisation de SQLite par défaut pour développement")
        else:
            logger.info("[INFO] Configuration base de données externe détectée")
        return db_url

class ServerConfig:
    """Configuration du serveur"""
    
    @staticmethod
    def get_port() -> int:
        """Récupère le port du serveur"""
        try:
            return int(os.environ.get('PORT', 8000))
        except ValueError:
            logger.warning("Port invalide dans l'environnement, utilisation du port 8000")
            return 8000
    
    @staticmethod
    def is_debug_mode() -> bool:
        """Détermine si le mode debug est activé"""
        flask_env = os.environ.get('FLASK_ENV', 'production').lower()
        return flask_env == 'development'
    
    @staticmethod
    def get_cors_origins() -> list:
        """Récupère les origines autorisées pour CORS"""
        cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173,http://localhost:5174')
        return [origin.strip() for origin in cors_origins.split(',') if origin.strip()]

# Initialisation de la configuration
try:
    # Configuration des APIs
    api_config = APIConfig()
    
    # Configuration consolidée (rétrocompatibilité)
    CONFIG = {
        # Sécurité
        "SECRET_KEY": SecurityConfig.get_secret_key(),
        
        # APIs météo et climat
        "OPENWEATHER_API_KEY": api_config.openweather_key or "",
    "OPENWEATHER_BASE_URL": "https://api.openweathermap.org/data/2.5",
    "AGROMONITORING_BASE_URL": "https://api.agromonitoring.com/agro/1.0",
    
        # IA et chatbot
        "OPEN_ROUTER_KEY": api_config.open_router_key or "",
    
        # Qualité de l'air
        "AIRVISUAL_API_KEY": api_config.airvisual_key or "",
        
        # Base de données
        "DATABASE_URL": DatabaseConfig.get_database_url(),
        
        # Serveur
        "PORT": ServerConfig.get_port(),
        "DEBUG": ServerConfig.is_debug_mode(),
        "CORS_ORIGINS": ServerConfig.get_cors_origins(),
        
        # Configuration application
        "USE_REAL_DATA": os.environ.get('USE_REAL_DATA', 'true').lower() == 'true',
        "API_TIMEOUT": int(os.environ.get('API_TIMEOUT', 30)),
        "TOKEN_EXPIRATION": int(os.environ.get('TOKEN_EXPIRATION', 86400)),  # 24h
        
        # Logging
        "LOG_LEVEL": os.environ.get('LOG_LEVEL', 'INFO').upper(),
        
        # Services optionnels
        "TWILIO_ACCOUNT_SID": os.environ.get('TWILIO_ACCOUNT_SID', ''),
        "TWILIO_AUTH_TOKEN": os.environ.get('TWILIO_AUTH_TOKEN', ''),
        "TWILIO_PHONE_NUMBER": os.environ.get('TWILIO_PHONE_NUMBER', ''),
        "EMAIL_USER": os.environ.get('EMAIL_USER', ''),
        "EMAIL_PASS": os.environ.get('EMAIL_PASS', ''),
    }
    
    # Validation de l'environnement de production
    if not ServerConfig.is_debug_mode():
        logger.info("[PRODUCTION] Mode production détecté - validation de sécurité...")
        
        # Vérifications critiques pour la production
        if CONFIG["SECRET_KEY"] == "dev_key_for_agritech":
            raise ValueError("SECRET_KEY par défaut détectée en production!")
        
        if not api_config.openweather_key:
            logger.warning("[PRODUCTION] Aucune clé API météo configurée")
        
        logger.info("[OK] Validation de sécurité complétée")
    
    # Affichage du résumé de configuration (sans emojis pour compatibilité Windows)
    logger.info("=== Configuration AGRIA ===")
    logger.info(f"Mode: {'Développement' if CONFIG['DEBUG'] else 'Production'}")
    logger.info(f"Port: {CONFIG['PORT']}")
    logger.info(f"API Météo: {'OK' if api_config.openweather_key else 'SIMULATION'}")
    logger.info(f"Assistant IA: {'OK' if api_config.open_router_key else 'LOCAL'}")
    logger.info(f"Qualité air: {'OK' if api_config.airvisual_key else 'SIMULATION'}")
    logger.info(f"Base de données: {CONFIG['DATABASE_URL'][:50]}...")
    logger.info("=== Fin Configuration ===")
    
except Exception as e:
    logger.error(f"[ERROR] Erreur lors de l'initialisation de la configuration: {str(e)}")
    # Configuration minimale de secours
    CONFIG = {
        "SECRET_KEY": secrets.token_hex(32),
        "OPENWEATHER_API_KEY": "",
        "OPENWEATHER_BASE_URL": "https://api.openweathermap.org/data/2.5",
        "AGROMONITORING_BASE_URL": "https://api.agromonitoring.com/agro/1.0",
        "OPEN_ROUTER_KEY": "",
        "AIRVISUAL_API_KEY": "",
        "USE_REAL_DATA": False,
        "PORT": 8000,
        "DEBUG": True,
        "DATABASE_URL": "sqlite:///agria.db",
        "API_TIMEOUT": 30,
        "TOKEN_EXPIRATION": 86400,
        "LOG_LEVEL": "INFO",
        "CORS_ORIGINS": ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]
    }
    logger.warning("[WARNING] Configuration de secours activée")

# Export pour compatibilité
__all__ = ['CONFIG', 'SecurityConfig', 'APIConfig', 'DatabaseConfig', 'ServerConfig'] 