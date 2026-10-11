from flask import Blueprint, request, jsonify
import hashlib
import secrets
import time
import re
import jwt
import os
from datetime import datetime, timedelta

# Configuration sécurisée
# Génération automatique d'une clé secrète si pas définie
def get_secret_key():
    """Génère ou récupère une clé secrète sécurisée"""
    secret = os.environ.get('SECRET_KEY')
    if not secret or secret == 'dev_secret_key_for_auth_tokens':
        # Génération automatique pour dev (ATTENTION: ne pas utiliser en production cluster)
        secret = secrets.token_hex(32)
        print("⚠️  ATTENTION: Clé secrète générée automatiquement. Définissez SECRET_KEY en production!")
    return secret

SECRET_KEY = get_secret_key()
TOKEN_EXPIRATION = int(os.environ.get('TOKEN_EXPIRATION', 24 * 60 * 60))  # 24 heures par défaut

# Base de données simulée sécurisée (à remplacer par une vraie DB en production)
users_db = {}

# Initialisation sécurisée d'un utilisateur de test
def init_test_user():
    """Initialise un utilisateur de test avec des paramètres sécurisés"""
    if not users_db:  # Seulement si aucun utilisateur existe
        test_password = os.environ.get('TEST_USER_PASSWORD', 'SecureTest123!')
        test_user = {
            "id": secrets.token_hex(8),  # ID aléatoire sécurisé
            "email": "test@agria.com",
            "name": "Utilisateur Test",
            "password_hash": hashlib.sha256(test_password.encode()).hexdigest(),
            "role": "user",
            "createdAt": datetime.now().isoformat(),
            "farms": []
        }
        users_db[test_user["email"]] = test_user
        print(f"👤 Utilisateur de test créé: {test_user['email']} / {test_password}")

# Initialiser l'utilisateur de test
init_test_user()

# Créer un blueprint pour les routes d'authentification
auth_bp = Blueprint('auth', __name__)

# Fonction pour générer un token JWT sécurisé
def generate_token(user_id):
    """Génère un token JWT avec expiration et sécurité renforcée"""
    payload = {
        'user_id': user_id,
        'exp': int(time.time()) + TOKEN_EXPIRATION,
        'iat': int(time.time()),
        'jti': secrets.token_hex(16)  # JWT ID unique pour invalidation
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Fonction pour vérifier un token JWT
def verify_token(token):
    """Vérifie et décode un token JWT de manière sécurisée"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Fonction pour valider un email avec regex renforcée
def is_valid_email(email):
    """Validation d'email avec regex sécurisée"""
    if not email or len(email) > 254:  # RFC 5321 limite
        return False
    pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# Fonction pour valider un mot de passe
def is_valid_password(password):
    """Validation de mot de passe sécurisée"""
    if not password or len(password) < 8 or len(password) > 128:
        return False, "Le mot de passe doit contenir entre 8 et 128 caractères"
    
    # Vérifications de sécurité
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
    
    if not (has_upper and has_lower and has_digit):
        return False, "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    
    return True, "Mot de passe valide"

# Fonction pour créer une représentation sécurisée d'un utilisateur
def sanitize_user(user):
    """Retourne les données utilisateur sans informations sensibles"""
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "createdAt": user["createdAt"],
        "farms": user.get("farms", [])
    }

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint d'inscription sécurisé"""
    try:
        data = request.json
        
        # Validation des données d'entrée
        if not data or not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({"message": "Les champs name, email et password sont requis", "code": "MISSING_FIELDS"}), 400
        
        # Nettoyage et validation des inputs
        name = str(data['name']).strip()
        email = str(data['email']).strip().lower()
        password = str(data['password'])
        
        # Validation du nom
        if not name or len(name) < 2 or len(name) > 50:
            return jsonify({"message": "Le nom doit contenir entre 2 et 50 caractères", "code": "INVALID_NAME"}), 400
        
        # Validation de l'email
        if not is_valid_email(email):
            return jsonify({"message": "Format d'email invalide", "code": "INVALID_EMAIL"}), 400
        
        # Vérifier si l'email existe déjà
        if email in users_db:
            return jsonify({"message": "Cet email est déjà utilisé", "code": "EMAIL_EXISTS"}), 409
        
        # Validation du mot de passe
        is_valid, password_message = is_valid_password(password)
        if not is_valid:
            return jsonify({"message": password_message, "code": "INVALID_PASSWORD"}), 400
        
        # Créer un nouvel utilisateur avec sécurité renforcée
        user_id = secrets.token_hex(8)  # ID sécurisé
        # Hashage du mot de passe avec salt
        salt = secrets.token_hex(16)
        password_with_salt = password + salt
        hashed_password = hashlib.sha256(password_with_salt.encode()).hexdigest()
        
        new_user = {
            "id": user_id,
            "email": email,
            "name": name,
            "password_hash": hashed_password,
            "salt": salt,  # Stocker le salt
            "role": "user",
            "createdAt": datetime.now().isoformat(),
            "farms": []
        }
        
        # Ajouter l'utilisateur à la "base de données"
        users_db[email] = new_user
        
        # Générer un token d'authentification
        token = generate_token(user_id)
        
        return jsonify({
            "user": sanitize_user(new_user),
            "token": token,
            "message": "Inscription réussie"
        }), 201
        
    except Exception as e:
        print(f"Erreur lors de l'inscription: {str(e)}")
        return jsonify({"message": "Erreur interne du serveur", "code": "INTERNAL_ERROR"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de connexion sécurisé"""
    try:
        data = request.json
        
        # Validation des données d'entrée
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({"message": "L'email et le mot de passe sont requis", "code": "MISSING_FIELDS"}), 400
        
        # Nettoyage des inputs
        email = str(data['email']).strip().lower()
        password = str(data['password'])
        
        # Validation de l'email
        if not is_valid_email(email):
            return jsonify({"message": "Format d'email invalide", "code": "INVALID_EMAIL"}), 400
        
        # Vérifier si l'utilisateur existe
        if email not in users_db:
            return jsonify({"message": "Identifiants invalides", "code": "INVALID_CREDENTIALS"}), 401
        
        user = users_db[email]
        
        # Vérification du mot de passe avec salt (rétrocompatibilité)
        if 'salt' in user:
            # Nouveau système avec salt
            password_with_salt = password + user['salt']
            hashed_password = hashlib.sha256(password_with_salt.encode()).hexdigest()
        else:
            # Ancien système sans salt (rétrocompatibilité)
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        if hashed_password != user['password_hash']:
            return jsonify({"message": "Identifiants invalides", "code": "INVALID_CREDENTIALS"}), 401
        
        # Générer un token d'authentification
        token = generate_token(user['id'])
        
        return jsonify({
            "user": sanitize_user(user),
            "token": token,
            "message": "Connexion réussie"
        }), 200
        
    except Exception as e:
        print(f"Erreur lors de la connexion: {str(e)}")
        return jsonify({"message": "Erreur interne du serveur", "code": "INTERNAL_ERROR"}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Endpoint pour récupérer l'utilisateur courant"""
    try:
        # Récupérer le token du header Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Token d'authentification manquant", "code": "MISSING_TOKEN"}), 401
        
        token = auth_header.split(' ')[1]
        
        # Vérifier le token
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"message": "Token invalide ou expiré", "code": "INVALID_TOKEN"}), 401
        
        # Trouver l'utilisateur par son ID
        for user in users_db.values():
            if user['id'] == user_id:
                return jsonify({
                    "user": sanitize_user(user)
                }), 200
        
        return jsonify({"message": "Utilisateur non trouvé", "code": "USER_NOT_FOUND"}), 404
        
    except Exception as e:
        print(f"Erreur lors de la récupération utilisateur: {str(e)}")
        return jsonify({"message": "Erreur interne du serveur", "code": "INTERNAL_ERROR"}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Endpoint de déconnexion"""
    # Note: avec JWT, la déconnexion est gérée côté client
    # En production, on pourrait implémenter une blacklist des tokens
    return jsonify({"message": "Déconnexion réussie"}), 200

# Middleware sécurisé pour protéger les routes
def token_required(f):
    """Décorateur pour protéger les routes avec authentification"""
    def decorated(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Token d'authentification manquant", "code": "MISSING_TOKEN"}), 401
            
            token = auth_header.split(' ')[1]
            user_id = verify_token(token)
            
            if not user_id:
                return jsonify({"message": "Token invalide ou expiré", "code": "INVALID_TOKEN"}), 401
            
            # Trouver l'utilisateur et l'ajouter à la requête
            for user in users_db.values():
                if user['id'] == user_id:
                    return f(user, *args, **kwargs)
            
            return jsonify({"message": "Utilisateur non trouvé", "code": "USER_NOT_FOUND"}), 404
            
        except Exception as e:
            print(f"Erreur dans token_required: {str(e)}")
            return jsonify({"message": "Erreur d'authentification", "code": "AUTH_ERROR"}), 500
    
    decorated.__name__ = f.__name__
    return decorated 