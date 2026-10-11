# Résumé de demande de fusion : `refonte/fondations` → `master`

Préparé le 11 octobre 2026. **CI distante non exécutée** : rien n'a été envoyé sur GitHub. Ce texte est prêt à être repris comme description de PR si le propriétaire décide de pousser la branche.

## Objectif

Remplacer le prototype (marketing, chatbot, météo, données fictives, clés dans le navigateur) par les fondations du produit de préparation accompagnée d'une campagne (F1–F6 du [cahier des charges](PRODUIT.md)), puis préparer le pilote terrain.

## Modifications

- 8 commits de fondation (briques 0 à 7) et les lots de préparation du pilote ; détail et preuves dans [AVANCEMENT.md](AVANCEMENT.md).
- Backend Django 5.2 + DRF + PostgreSQL ; frontend React/Vite/Tailwind sans secret ; Python 3.12.
- Ancien prototype supprimé de la branche, conservé sur `archive/prototype-2026-10-11`.

## Preuves locales (poste Windows 11, 11/10/2026)

| Contrôle | Résultat |
|---|---|
| `scripts/dev.py check --e2e` (Python 3.12.10) | ruff, format, migrations à jour, 147 pytest, eslint, TypeScript, build, 29 parcours Playwright (1 ignoré : clavier sur téléphone) |
| `scripts/recette.py` | Redémarrage réel, sauvegarde puis restauration : OK |
| `scripts/verifier_secrets.py` | Aucun secret dans la branche ni dans le build |
| Tests avec une base de travail inexistante (`DB_NAME=agria_inexistante`) | 147 réussis : aucune base de travail ni aucun secret métier n'est nécessaire |
| Workflow `.github/workflows/ci.yml` | YAML validé localement. **Jamais exécuté sur GitHub** |

## Points d'attention pour la fusion

- **Conflit attendu sur `README.md`** : `origin/master` contient un commit (`735381a`, 29/05/2025) modifiant l'ancien README. Garder la version de la branche.
- La fusion retire `lib/config.ts`, et donc les clés OpenWeather et Agromonitoring, de la version courante de `master`. **Elle ne les retire pas de l'historique : la révocation par le propriétaire reste indispensable** ([SECURITE.md](SECURITE.md) §2).
- Lancer `python scripts/verifier_secrets.py` juste avant l'envoi.

## Limites

- Aucun utilisateur réel, aucun contenu relu par un spécialiste, aucun hébergement : la fusion n'est pas une mise en service.
- Fonctions non promises : notifications, récupération de mot de passe par email, mode hors connexion, autres langues que le français.
