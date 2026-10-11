# État d'avancement de la reconstruction

Branche de travail : `refonte/fondations`. Archive du prototype : `archive/prototype-2026-10-11` (`fba4f93`).

Légende des niveaux de preuve, à ne pas confondre :

- **Implémenté** : le code existe.
- **Vérifié** : un test ou un scénario exécuté l'a constaté, avec la commande indiquée.
- **Validé par un spécialiste** : un conseiller ou un agronome a relu le contenu. *Aucun contenu ne l'est à ce jour.*
- **Utilité démontrée** : constatée avec de vrais utilisateurs. *Rien ne l'est à ce jour.*

| Brique | Statut | Preuve |
|---|---|---|
| 0 — Préserver et établir la base | Terminée | Ci-dessous |
| 1 — Socle exécutable | À faire | |
| 2 — Identité, projet, campagne | À faire | |
| 3 — Vérifications et plan d'action | À faire | |
| 4 — Budget transparent | À faire | |
| 5 — Conseiller, relecture, synthèse | À faire | |
| 6 — Parcours complet et polissage | À faire | |
| 7 — Recette et passation | À faire | |

## Brique 0 — Préserver et établir la base (11/10/2026)

**Fonctionne :**

- L'état récupérable existe : commit `fba4f93`. Il contient 24 fichiers modifiés et 26 entrées non suivies (dont `docs/`, `ROADMAP.md`, les nouvelles pages), ainsi que les suppressions présentes dans le dossier de travail. Après le commit, `git status` était vide.
- Les secrets ignorés ont été déplacés dans `.local-archive/prototype/` (ignoré par Git). `dist/` et `node_modules/` ont été supprimés.
- L'ancien code est retiré de la branche de refonte. L'inventaire est dans [INVENTAIRE.md](INVENTAIRE.md).

**Vérifications exécutées :**

- Recherche des 13 valeurs secrètes des `.env` dans tout l'historique Git et dans les fichiers à archiver ; seuls les noms de variables ont été affichés. Résultat : clés OpenWeather et Agromonitoring présentes dans l'historique public. Aucune valeur secrète dans les fichiers archivés.
- Liste des fichiers ignorés avant le commit : `.env`, `api/.env`, `api/api.log`, `dist/`, `node_modules/` (exclus comme prévu).

**Reste incomplet :** révocation des clés chez les fournisseurs (action externe, voir [SECURITE.md](SECURITE.md) §3).

**Décisions :** archive sur une branche plutôt qu'un stash, plus visible et poussable sur demande. Pas de réécriture de l'historique (non autorisée).
