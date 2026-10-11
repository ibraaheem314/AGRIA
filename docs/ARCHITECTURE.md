# Architecture

Mise à jour : 11 octobre 2026. Ce document décrit **le code présent sur la branche `refonte/fondations`**. Les éléments encore à construire sont signalés comme tels. L'état par brique et les preuves sont dans [AVANCEMENT.md](AVANCEMENT.md) ; les choix et leurs motifs, dans [DECISIONS.md](DECISIONS.md).

## 1. Vue d'ensemble

```text
Navigateur (téléphone ou ordinateur)
  │  même origine : cookies de session HttpOnly + jeton CSRF
  ▼
frontend/  React 19 · React Router 7 · TanStack Query · Tailwind 4   (aucun secret, aucune variable d'environnement)
  │  /api/*  (proxy Vite en développement)
  ▼
backend/   Django 5.2 LTS · Django REST Framework   (une seule application, modules par domaine)
  │  transaction par requête ; verrou sur le dossier pour toute écriture
  ▼
PostgreSQL (contraintes d'intégrité pour les invariants métier)
```

Aucun service externe n'est requis : ni IA, ni météo, ni envoi d'email.

## 2. Organisation du code

```text
backend/
  agria/          configuration, authentification CSRF, format d'erreur, santé
  accounts/       compte (email = identifiant, indicateur conseiller), API de session, commande create_account
  dossiers/       projet, campagne (= dossier), informations et leur historique, attribution conseiller, règles d'accès
  preparation/    modèles de contenu versionnés, calcul des points à vérifier, plan et démarches
    content/      fichiers JSON des modèles (source de vérité, relus dans Git)
  budget/         postes, calcul pur des montants et totaux (calc.py), historique
  reviews/        demandes de relecture, avis, messages, décisions, statut du dossier, synthèse
  tests/          tests pytest par brique
frontend/
  src/app/        routage, mise en page, garde de connexion
  src/features/   auth, dossiers, plan, help
  src/shared/     client API, composants d'interface, formats
  e2e/            parcours Playwright (ordinateur + téléphone)
scripts/dev.py    base locale, .env, sauvegarde/restauration, contrôles, serveur de parcours
```


## 3. Modèle de données

```text
Compte ─┬─ Projet (profil débutant/producteur, is_demo)
        │     └─ Campagne = dossier (context_version, archived_at)
        │           ├─ Information (clé du registre, état, valeur, source, row_version)
        │           │     └─ Révision d'information (ajout seul, numérotée par context_version)
        │           ├─ Plan (modèle de préparation figé pour ce dossier, plan_version)
        │           │     └─ Démarche (état, motif de blocage, résultat + date, prérequis, row_version)
        │           │           └─ Évènement de démarche (ajout seul)
        │           ├─ Poste de budget (catégorie, quantité, unité, prix FCFA, état du prix, source, date, retiré)
        │           │     └─ Évènement de budget (ajout seul, état complet du poste)
        │           ├─ Attribution conseiller (active ou close, jamais effacée)
        │           ├─ Demande de relecture (versions au moment de la demande)
        │           ├─ Avis (conseiller, périmètre, versions examinées, verdict, réserves, instantané figé)
        │           ├─ Message (question, commentaire ou réponse ; cible : dossier, information, démarche, poste)
        │           └─ Décision (poursuivre, modifier, différer, motifs, versions)
        └─ Modèle de préparation (code, version, contenu JSON, empreinte SHA-256, statut de relecture)
```

### Invariants garantis par PostgreSQL

| Invariant | Contrainte |
|---|---|
| « Je ne sais pas » n'a aucune valeur ; tout autre état en a une | `fact_value_matches_status` |
| Une information « vérifiée » porte une source | `fact_verified_has_source` |
| Une démarche terminée porte un résultat et une date | `action_done_has_result` |
| Une démarche bloquée porte un motif | `action_blocked_has_reason` |
| Une démarche du modèle n'existe qu'une fois par dossier | `action_unique_definition` |
| Une requête de création rejouée ne crée rien de plus | `*_unique_request` |
| Une version de modèle est unique | `template_unique_version` |
| Un conseiller n'a qu'une attribution active par dossier | `assignment_one_active_per_advisor` |
| Prix « manquant » si et seulement si aucun prix n'est saisi | `budget_missing_iff_no_price` |
| Prix « connu » ⇒ source et date ; « estimé » ⇒ source | `budget_known_has_source_and_date`, `budget_estimate_has_source` |

### Invariants garantis par le code et vérifiés par des tests

- Les points à vérifier sont **calculés** à partir des informations et du modèle (fonction pure `preparation/engine.py`), et jamais stockés : ils ne peuvent donc pas diverger du contexte.
- Une modification d'information ajoute, dans la même transaction, les démarches devenues nécessaires. Elle ne modifie, ne supprime et ne recrée jamais une démarche existante.
- Un modèle chargé est immuable : recharger une même version avec un contenu différent est refusé. Un dossier garde la version du modèle avec laquelle son plan a été créé.
- Une démarche ne peut être terminée tant qu'un de ses prérequis, présent dans le plan, n'est pas terminé.
- Un avis porte sur la version que le conseiller a lue : l'interface envoie les versions affichées à l'ouverture du formulaire, et le serveur refuse l'avis (409) si une section du périmètre a changé entre-temps.
- Un avis est « à réexaminer » dès qu'une section de son périmètre change de version (calcul, jamais de suppression). L'instantané conservé permet de relire exactement la version examinée.
- Le statut du dossier est calculé : archivé, différé, revu (avec ou sans réserves, seulement si l'avis est à jour), en revue, à compléter, prêt pour une relecture, brouillon.
- Une nouvelle campagne d'un projet peut reprendre les informations du lieu de la précédente, marquées « à revérifier » (un « vérifié » redevient « déclaré ») ; démarches, budget et résultats ne sont jamais recopiés.
- Les montants du budget sont calculés par le serveur seul (`budget/calc.py`, en Decimal, sans flottant). Un budget avec un poste incomplet n'est jamais déclaré complet.

## 4. Accès et sécurité

| Qui | Lecture | Écriture |
|---|---|---|
| Propriétaire du projet | Ses dossiers | Informations, démarches (sauf dossier archivé) |
| Conseiller attribué (attribution active) | Les dossiers attribués | Avis, messages ; rien sur les données du porteur |
| Tout autre compte, y compris `is_staff` | Rien : réponse 404 | Rien |

- Contrôle centralisé dans `dossiers/access.py` et appliqué par chaque vue. Les routes React ne protègent rien.
- Sessions Django (cookie HttpOnly, SameSite=Lax, Secure hors développement). CSRF imposé à toute écriture, y compris la connexion. Mots de passe hachés en Argon2, validés par les règles Django (10 caractères au moins).
- Limite de tentatives sur la connexion et l'inscription (`AGRIA_AUTH_RATE`, 10/min par adresse IP par défaut). Le compteur est en mémoire du processus : il n'est pas partagé entre plusieurs processus serveur.
- Erreurs : JSON `{"error": {code, message, fields}}` ; base injoignable → 503 ; aucune trace d'exécution renvoyée.

## 5. Écritures fiables

- **Transaction par requête** (`ATOMIC_REQUESTS`) et **verrou** sur la ligne du dossier pour toute écriture : deux requêtes sur un même dossier sont sérialisées.
- **Concurrence optimiste** : chaque information et chaque démarche portent une `row_version`. Une écriture fondée sur une version périmée est refusée (409), sauf si son contenu est identique à l'état enregistré : c'est alors une reprise, acceptée sans effet.
- **Créations idempotentes** : projet, campagne et démarche personnelle portent un `request_id` choisi par l'interface et réutilisé lors d'une nouvelle tentative.
- **Interface** : « enregistré » n'est affiché qu'après la réponse du serveur. En cas d'erreur, la saisie reste à l'écran et un bouton permet de réessayer avec la même requête. Les écritures ne sont jamais rejouées automatiquement.

## 6. Contenu et niveaux de preuve

Le modèle `preparation-generique` v1 contient des vérifications de préparation (lieu, terrain, eau, culture, période, moyens, débouchés) et les démarches associées. Il ne contient **aucune prescription agronomique** et son statut est « non relu par un spécialiste », affiché sur l'écran « Mon plan ». Un modèle ne peut être déclaré « relu » qu'avec un relecteur et une date.

Publication d'une version relue : elle ne s'applique qu'aux dossiers créés ensuite. Un dossier existant garde sa version (règles, statut de relecture affiché, démarches et historique) ; aucune migration automatique n'existe (test `test_publication_d_une_version_relue_sans_migration_silencieuse`, procédure dans VALIDATION_TERRAIN §7.2).

Les exemples de démonstration (`manage.py seed_demo`) sont créés sur un compte dédié, en `.invalid`, et portent `is_demo` : un bandeau les signale et ils ne sont jamais visibles depuis un compte réel.

## 7. Limites connues

- Pas de mode hors connexion : une écriture exige le serveur. La saisie en cours est conservée à l'écran, mais pas après fermeture de la page.
- Pas de récupération de mot de passe par email (aucun envoi configuré) : réinitialisation par l'administration.
- Hébergement, sauvegardes automatiques et supervision : non définis, et aucun déploiement n'a été fait (D-006).
- La limite de tentatives de connexion repose sur un cache local au processus.
