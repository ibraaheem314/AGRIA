# Registre des décisions

Mise à jour : 11 octobre 2026, après clarification de la cible par le fondateur.

Ce registre distingue le cap convenu, les recommandations d'architecture et les choix encore ouverts. Une décision documentaire n'est pas une correction livrée.

## Décisions

| ID | Statut | Décision ou question | Motif / condition de révision |
|---|---|---|---|
| D-001 | Acté | Sénégal comme premier marché | Instruction du fondateur ; expansion ultérieure après preuve locale |
| D-002 | Acté | Un problème, une filière, un territoire et un client pour le premier pilote | Réduire la dispersion du prototype généraliste |
| D-003 | Supersédé | Ancien choix H1 irrigation ou H2 conservation | Remplacé par D-012 à D-014 : clarifier le parcours client avant la solution technique |
| D-004 | Acté | Reporter le développement des fonctionnalités généralistes | Priorité à l'enquête et à la boucle du pilote |
| D-005 | Acté (précisé par D-016) | Réutiliser React/Vite/TypeScript ; garder Python pour le serveur et l'analyse | Pas de migration Next.js ; le framework Python retenu est justifié en D-016 |
| D-006 | Partiellement tranché (11/10/2026) | Authentification : module d'authentification de Django (sessions serveur, Argon2, CSRF), auto-hébergé. Stockage : PostgreSQL. **Hébergement : ouvert** | Un fournisseur géré (Supabase, Auth0…) exigeait un compte externe et ne fonctionne pas hors ligne en développement. L'authentification Django est éprouvée et ne demande aucun code de mot de passe maison. Hébergement à décider avant tout usage partagé |
| D-007 | Acté | Capteurs éventuels et laboratoire limité ; aucun achat de flotte engagé | La mesure doit améliorer une décision ou la vérification du résultat |
| D-008 | Acté | Recommandations explicables, validation humaine au pilote | Pas de LLM décisionnaire ni d'actionneur automatique au lancement |
| D-009 | Acté | Distinguer démonstration, mesure, estimation et résultat prouvé | Corriger les faux succès et les allégations non documentées |
| D-010 | Livré — documentation | Remplacer les cinq anciens guides et créer les références produit/techniques | Ne vaut pas réalisation des tâches T0 à T8 |
| D-011 | Ouvert | Date J0, disponibilités et plafonds financiers | À renseigner avant engagement d'un calendrier et de dépenses |
| D-012 | Confirmé par le fondateur | Débutants avec projet concret ET producteurs actifs peu accompagnés dans la vision | Deux entrées possibles, aucun choix automatique de deux produits |
| D-013 | Proposition de produit | Préparation accompagnée d'une campagne ; six fonctions F1–F6 | À éprouver en G1/G2 ; suivi complet, météo et capteurs différés |
| D-014 | Ouvert | Zone, culture, groupe prioritaire et canal du premier pilote | Maraîchage candidat ; ne pas choisir une culture ou servir les deux groupes sans preuve |
| D-015 | Livré — documentation | Cahier des charges et réalignement des références sur D-012/D-013 | Aucun changement applicatif ni validation commerciale implicite |
| D-016 | Acté (11/10/2026) | Backend **Django 5.2 LTS + Django REST Framework** à la place de Flask | Bénéfice précis : authentification, sessions, CSRF, migrations, transactions par requête et interface d'administration (attribution des conseillers, contenus) fournies par un même projet maintenu, avec support jusqu'en avril 2028. Le code Flask ne contenait rien de réutilisable (voir INVENTAIRE). Django 6 exige Python 3.12 : migration possible plus tard sans changement d'architecture |
| D-017 | Acté (11/10/2026) | Frontend : React 19, React Router 7, TanStack Query 5, Vite 8, TypeScript 6.0, Tailwind 4. **Aucune variable d'environnement côté navigateur** | React Router 8 exige Node ≥ 22.22 (poste : 22.15) ; typescript-eslint ne supporte pas encore TypeScript 7. Le proxy Vite garantit la même origine (cookies HttpOnly, CSRF) |
| D-018 | Acté (11/10/2026) | Organisation `backend/` + `frontend/` + `scripts/dev.py` ; une seule application Django découpée en modules métier | Remplace l'arborescence `src/` + `api/` proposée en ARCHITECTURE §3. Pas de services séparés |
| D-019 | Acté (11/10/2026) | Base de développement : instance PostgreSQL propre au projet (`.devdb/`, 127.0.0.1:5444) gérée par `scripts/dev.py` ; Docker non requis | Le démon Docker n'est pas actif sur le poste, et les services PostgreSQL déjà installés (ports 5432 et 5433) ne doivent pas être modifiés |
| D-020 | Acté (11/10/2026) | Parcours de bout en bout avec Playwright sur une base dédiée `agria_e2e`, en vues ordinateur et téléphone | Prouve le comportement réel (proxy, cookies, base) sans toucher les données de travail |

## Décisions à ne pas rouvrir par défaut

Le choix du nom AGRIA, du pays initial et l'absence de marketplace au lancement ne nécessitent pas une nouvelle discussion à chaque tâche technique.

Les corrections réversibles et les travaux déjà autorisés peuvent avancer dans le périmètre demandé. Ce document n'ajoute pas de circuit d'approbation à ces travaux.

Une nouvelle dépense, un contact externe, une publication ou un déploiement ne sont pas autorisés par le seul fait de les mentionner ici. Les instructions effectives du fondateur définissent l'autorisation.

## Registre des inconnues

| Inconnue | Conséquence | Moyen de résolution |
|---|---|---|
| Site et relais local | Impossible de valider le service au Sénégal | Entretiens et accord de pilote |
| Difficulté réelle de préparation | Proposition de valeur non établie | Démarches, blocages et accompagnements actuels documentés |
| Capacité à effectuer les démarches | Risque d'un dossier rempli sans effet | Observer les pratiques, accès et contraintes |
| Payeur et disposition à payer | Viabilité commerciale inconnue | Entretien avec décideur, offre de pilote et engagement concret |
| Budget / disponibilité | Plan matériel et délais non engageables | D-011 |
| Infrastructure / connectivité | Architecture terrain encore incertaine | Relevé sur site |
| Exposition du prototype | Portée de l'incident de clés inconnue | Vérification auprès des comptes et déploiements accessibles |
| Expertise agronomique | Recommandations non validées | Partenaire technique à identifier |

## Historique du changement de cap

Le premier cadrage partait de l'expertise environnementale du fondateur et comparait irrigation/conservation. Le fondateur a précisé son intention d'aider à la fois des débutants avec projet concret et des exploitants peu accompagnés. Le 11 octobre 2026, D-003 a donc été supersédé : l'enquête valide désormais la préparation d'une campagne et le groupe de lancement. Aucune des anciennes pistes n'est traitée comme un produit supplémentaire à développer.

## Format de décision après enquête

- ID et date :
- Responsable :
- Question :
- Preuves et liens :
- Options comparées, y compris la pratique actuelle :
- Choix et raison :
- Hypothèses restantes :
- Conséquences produit, techniques et budgétaires :
- Condition et date de réexamen :
- Documents mis à jour :

## Revue hebdomadaire

Examiner les preuves nouvelles, les blocages et la prochaine décision. Limiter le travail simultané à une enquête produit et une tâche technique directement utile.

Une nouvelle idée est consignée dans le hors-périmètre de la roadmap. Elle n'interrompt pas automatiquement le travail engagé.
