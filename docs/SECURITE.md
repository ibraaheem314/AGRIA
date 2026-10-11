# Sécurité : incident de clés et règles du dépôt

Mise à jour : 11 octobre 2026 (préparation du pilote, lot 1). Aucune valeur secrète n'est reproduite dans ce document ni dans les sorties des outils.

Vérification reproductible : `python scripts/verifier_secrets.py` (ajouter `--historique` pour tout l'historique Git). L'outil compare les valeurs des fichiers `.env` locaux et des motifs génériques de clés avec les fichiers suivis, chaque branche locale et distante récupérée, et le build `frontend/dist`. Il n'affiche que des noms de variables et des emplacements.

## 1. Classement des expositions

Dernière analyse : 11/10/2026, après `git fetch` (lecture seule) du dépôt public `ibraaheem314/AGRIA`.

| Élément | Statut | Où | Révocation |
|---|---|---|---|
| Clé OpenWeather | **Exposition confirmée, publique** | Version **actuelle** de `lib/config.ts` sur `master` et `origin/master` (branche publique par défaut), et historique (`667d772`, `1f598fc`) | **À effectuer** — aucune confirmation du propriétaire |
| Clé Agromonitoring | **Exposition confirmée, publique** | Version actuelle de `lib/config.ts` sur `origin/master`, historique (`1f598fc`) | **À effectuer** |
| Clé OpenRouter | Exposition confirmée **locale** (build `dist/` de l'ancien prototype, supprimé) ; publication **non établie** | Absente de Git | **À effectuer** par précaution |
| Clé OpenWeather (build) | Même situation que ci-dessus pour le build local | — | Couverte par la ligne OpenWeather |
| Clé AirVisual, trois jetons HuggingFace | **Exposition non établie** : jamais trouvés dans Git ni dans un build conservé | `.env` locaux uniquement | À effectuer par précaution (variables `VITE_*`, intégrables au navigateur) |
| Mot de passe du compte email (`.env` racine) | **Exposition non établie** : absent de Git et des builds analysés | `.env` local uniquement | Changement du mot de passe recommandé |
| Email et mot de passe du compte de test de l'ancien prototype | Valeurs de démonstration, pas des identifiants réels | `api/auth.py` sur `master` et sur l'archive | Aucune (ne protègent rien en service) |

**Révocations confirmées par le propriétaire : aucune à ce jour.** Une clé absente du code n'est pas une clé révoquée. La validité des anciennes clés n'a pas été testée auprès des fournisseurs, et ne le sera pas.

Branche `refonte/fondations` (courante), fichiers suivis et build actuel : **aucun secret trouvé**.

L'historique Git n'a pas été réécrit et les archives locales n'ont pas été supprimées. Une réécriture ne retirerait d'ailleurs ni les copies ni les clones existants : seule la révocation corrige l'exposition.

## 2. Actions restant au propriétaire

1. **OpenWeather** et **Agromonitoring** : révoquer les clés dans chaque compte fournisseur, puis consulter l'historique d'usage du compte.
2. **OpenRouter** : révoquer la clé ; vérifier la consommation et la facturation.
3. **AirVisual** et **HuggingFace** (trois jetons) : révoquer par précaution.
4. **Compte email** : changer le mot de passe qui figurait dans `.env`.
5. Si l'ancien prototype a été hébergé ailleurs que sur GitHub (Netlify, Vercel, serveur…) : retirer ce déploiement. Ce n'est pas vérifiable depuis ce poste.
6. Consigner ci-dessous, pour chaque ligne : date, fournisseur, « révoquée » ou « remplacée », anomalie d'usage constatée. **Ne jamais noter la valeur.**
7. Seulement ensuite : supprimer `.local-archive/prototype/*.env`, puis décider s'il faut remplacer `lib/config.ts` sur `master` (cela ne retire pas l'historique).

| Date | Élément | Action confirmée par le propriétaire | Anomalie constatée |
|---|---|---|---|
| — | — | Aucune à ce jour | — |

## 3. Ce que le dépôt garantit déjà

- Le code de la refonte ne lit aucune clé fournisseur et ne dépend d'aucun service externe.
- Les anciens `.env` sont dans `.local-archive/prototype/`, ignoré par Git. Le build qui contenait des clés a été supprimé.
- `.gitignore` refuse tout `.env` sauf les fichiers `*.example`.
- `scripts/verifier_secrets.py` est à lancer avant tout envoi vers GitHub ; il renvoie un code d'erreur si la branche courante ou le build contiennent un secret.

## 4. Règles pour la refonte

- Le frontend ne reçoit **aucun secret**. Il n'a besoin d'aucune variable d'environnement : en développement, il passe par le proxy Vite vers l'API.
- Les secrets serveur sont dans `backend/.env`, ignoré par Git ; `backend/.env.example` liste les noms sans valeur réelle.
- Le serveur refuse de démarrer, dans tous les modes, si `DJANGO_SECRET_KEY` est absente, trop courte ou égale à la valeur d'exemple.
- Avant chaque commit touchant la configuration : `git diff --cached` ne doit contenir aucune valeur de `backend/.env`.
- Pas de compte de démonstration avec mot de passe connu dans le code : les comptes sont créés par commande, avec un mot de passe saisi ou aléatoire.

## 5. Avant tout usage réel (hébergement non décidé)

Aucun déploiement n'a été fait. Liste de contrôle minimale à vérifier sur l'environnement choisi :

- `DJANGO_DEBUG=false`, `DJANGO_SECRET_KEY` propre à l'environnement, `DJANGO_ALLOWED_HOSTS` et `DJANGO_CSRF_TRUSTED_ORIGINS` renseignés ; `python manage.py check --deploy` sans alerte bloquante.
- HTTPS obligatoire (cookies `Secure` activés hors développement). L'interface et l'API servies sur la même origine (proxy inverse).
- Base PostgreSQL avec mot de passe, non exposée publiquement ; sauvegardes automatiques **et restauration testée** (`scripts/recette.py` montre la méthode).
- Limite de tentatives de connexion partagée entre processus : configurer un cache commun (Redis ou base de données) si plusieurs processus serveur.
- Fichiers statiques de l'administration servis par le proxy (`collectstatic`).
- Comptes : inscription libre fermée (`AGRIA_ALLOW_SIGNUP=false`) tant que le pilote n'est pas défini ; comptes créés par `create_account`.
- Données personnelles : informer les participants, définir la durée de conservation et l'accès (D-011, VALIDATION_TERRAIN §2).
