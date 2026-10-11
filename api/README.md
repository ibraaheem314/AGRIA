# Backend AGRIA

État observé au 11 octobre 2026 : backend Flask de prototype, à remettre en état avant usage réel.

## Fichiers actuels

| Fichier | Responsabilité observée |
|---|---|
| [main.py](main.py) | Application Flask, CORS, endpoints fournisseurs, statistiques et santé |
| [auth.py](auth.py) | Comptes en mémoire, inscription, connexion et JWT |
| [config.py](config.py) | Lecture de variables d'environnement et valeurs de secours |
| [requirements.txt](requirements.txt) | Dépendances déclarées, incomplètes et anciennes |
| [run_server.sh](run_server.sh) | Script historique d'installation, export d'environnement et lancement |

## Routes présentes

| Méthode / route | Comportement et limite |
|---|---|
| POST /api/auth/register | Crée un compte dans un dictionnaire Python |
| POST /api/auth/login | Vérifie les identifiants et renvoie un JWT |
| GET /api/auth/me | Vérifie le bearer token puis recherche le compte en mémoire |
| POST /api/auth/logout | Réponse de succès ; pas de révocation serveur des JWT implémentée |
| POST /api/agribot | Attend un champ question ; fournisseur ou réponse locale prédéfinie |
| GET /api/weather | Attend lat et lon ; fournisseur ou simulation selon le chemin d'erreur/configuration |
| GET /api/user-stats | Produit des chiffres aléatoires |
| GET /api/health | Vérifie surtout la présence de clés ; ne prouve ni une connexion fournisseur ni une base fonctionnelle |

Les routes agribot, weather et user-stats ne portent pas le décorateur token_required dans le code examiné. Le frontend actuel appelle directement les fournisseurs pour le chat et la météo.

Le backend ne conserve pas un dossier agricole persistant. La route agribot reçoit une question ; ne pas annoncer de mémoire conversationnelle serveur durable.

## Problèmes connus

- Comptes perdus au redémarrage et non partagés entre processus.
- Hachage SHA-256 des mots de passe inadapté à une authentification de production.
- Utilisateur de test créé au chargement ; mot de passe écrit dans les logs.
- SECRET_KEY lue séparément dans plusieurs modules ; génération aléatoire dans auth.py si absente ou égale à sa valeur de développement reconnue.
- Clé de session Flask pouvant utiliser une valeur de développement dans main.py.
- CORS configuré largement dans main.py ; la liste configurée n'est pas appliquée à cet appel.
- DATABASE_URL déclarée mais sans persistance associée.
- Dépendance PyJWT importée mais absente de requirements.txt.
- Valeurs de secours et erreurs de configuration pouvant masquer un service indisponible.

Une classe RateLimitError ne constitue pas un limiteur de requêtes. Aucune protection par utilisateur et budget fournisseur n'est démontrée ici.

## Lancement : état réel

Le point d'entrée historique est python main.py depuis api/. Il lie le serveur à 0.0.0.0 ; ne pas le considérer comme limité à la boucle locale.

**Une installation propre n'est pas validée.** Installer requirements.txt tel quel ne garantit pas un démarrage : PyJWT manque et la compatibilité des dépendances doit être traitée en T3. Ne pas contourner cette dette avec une liste de commandes ad hoc non reproductible.

main.py et config.py ne chargent pas directement un fichier .env avec load_dotenv. La présence de python-dotenv dans requirements.txt ne suffit pas. Le script shell possède son propre chargement historique, qui n'est pas un chemin Windows validé.

Après T3, ajouter ici : versions testées, installation isolée reproductible, chargement explicite de l'environnement et démarrage de développement lié à 127.0.0.1. Aucun de ces changements n'est livré par cette refonte documentaire.

## Cible

Une API Python unique, avec modules métier, validation, persistance, autorisation par site et appels fournisseurs nécessaires côté serveur. Maintenir Flask est possible ; choisir un autre framework demande une justification technique.

Avant un pilote, vérifier notamment deux comptes isolés, redémarrage sans perte, refus des accès non autorisés, défaillance fournisseur explicite et restauration d'une sauvegarde.

Références : [configuration](../CONFIGURATION_API.md), [architecture cible](../docs/ARCHITECTURE.md), [plan de refonte](../docs/PLAN_REFONTE.md), [roadmap](../ROADMAP.md).
