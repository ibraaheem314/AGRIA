from flask import Blueprint, request, jsonify
import hashlib
import secrets
import time
import re
import jwt
from datetime import datetime, timedelta

# Configuration
SECRET_KEY = "dev_secret_key_for_auth_tokens"  # À changer en production
TOKEN_EXPIRATION = 24 * 60 * 60  # 24 heures en secondes

# Simuler une base de données utilisateurs (à remplacer par une vraie DB)
users_db = {}
# Ajouter un utilisateur de test
test_user = {
    "id": "1",
    "email": "test@example.com",
    "name": "Test User",
    "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
    "role": "user",
    "createdAt": datetime.now().isoformat(),
    "farms": []
}
users_db[test_user["email"]] = test_user

# Créer un blueprint pour les routes d'authentification
auth_bp = Blueprint('auth', __name__)

# Fonction pour générer un token JWT
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': int(time.time()) + TOKEN_EXPIRATION,
        'iat': int(time.time())
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Fonction pour vérifier un token JWT
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

# Fonction pour valider un email
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# Fonction pour créer une représentation sécurisée d'un utilisateur
def sanitize_user(user):
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
    data = request.json
    
    # Vérifier les champs requis
    if not data or not all(k in data for k in ('name', 'email', 'password')):
        return jsonify({"message": "Les champs name, email et password sont requis"}), 400
    
    # Valider l'email
    if not is_valid_email(data['email']):
        return jsonify({"message": "Format d'email invalide"}), 400
    
    # Vérifier si l'email existe déjà
    if data['email'] in users_db:
        return jsonify({"message": "Cet email est déjà utilisé"}), 409
    
    # Vérifier la longueur du mot de passe
    if len(data['password']) < 8:
        return jsonify({"message": "Le mot de passe doit contenir au moins 8 caractères"}), 400
    
    # Créer un nouvel utilisateur
    user_id = secrets.token_hex(4)  # Générer un ID unique
    hashed_password = hashlib.sha256(data['password'].encode()).hexdigest()
    
    new_user = {
        "id": user_id,
        "email": data['email'],
        "name": data['name'],
        "password_hash": hashed_password,
        "role": "user",  # Rôle par défaut
        "createdAt": datetime.now().isoformat(),
        "farms": []
    }
    
    # Ajouter l'utilisateur à la "base de données"
    users_db[data['email']] = new_user
    
    # Générer un token d'authentification
    token = generate_token(user_id)
    
    # Retourner les données utilisateur (sans mot de passe) et le token
    return jsonify({
        "user": sanitize_user(new_user),
        "token": token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Vérifier les champs requis
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({"message": "L'email et le mot de passe sont requis"}), 400
    
    # Vérifier si l'utilisateur existe
    if data['email'] not in users_db:
        return jsonify({"message": "Identifiants invalides"}), 401
    
    user = users_db[data['email']]
    
    # Vérifier le mot de passe
    hashed_password = hashlib.sha256(data['password'].encode()).hexdigest()
    if hashed_password != user['password_hash']:
        return jsonify({"message": "Identifiants invalides"}), 401
    
    # Générer un token d'authentification
    token = generate_token(user['id'])
    
    # Retourner les données utilisateur (sans mot de passe) et le token
    return jsonify({
        "user": sanitize_user(user),
        "token": token
    }), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    # Récupérer le token du header Authorization
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Token d'authentification manquant"}), 401
    
    token = auth_header.split(' ')[1]
    
    # Vérifier le token
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"message": "Token invalide ou expiré"}), 401
    
    # Trouver l'utilisateur par son ID
    for user in users_db.values():
        if user['id'] == user_id:
            # Retourner les données utilisateur
            return jsonify({
                "user": sanitize_user(user)
            }), 200
    
    return jsonify({"message": "Utilisateur non trouvé"}), 404

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Note: côté serveur, nous ne faisons rien avec le token
    # Le client doit simplement supprimer le token localement
    return jsonify({"message": "Déconnexion réussie"}), 200

# Fonction middleware pour protéger les routes
def token_required(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Token d'authentification manquant"}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({"message": "Token invalide ou expiré"}), 401
        
        # Trouver l'utilisateur et l'ajouter à la requête
        for user in users_db.values():
            if user['id'] == user_id:
                return f(user, *args, **kwargs)
        
        return jsonify({"message": "Utilisateur non trouvé"}), 404
    
    decorated.__name__ = f.__name__
    return decorated 