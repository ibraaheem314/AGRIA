# Roadmap AGRIA

Mise à jour : 11 octobre 2026, après clarification des deux profils utilisateurs.
Phase actuelle : **cadrage de la préparation accompagnée d'une campagne**.
Cette version remplace le choix initial irrigation/conservation comme porte d'entrée.

## Statuts et calendrier

À faire = non réalisé ; conditionnel = dépend d'un jalon ; terminé = preuve liée.
J0 est le lancement effectif de l'enquête, encore non daté. Les fenêtres ci-dessous sont indicatives, sans estimation contractuelle de développement.

Le fondateur porte le produit et la technique ; conseiller et relais local restent à identifier. La documentation est livrée, pas les corrections applicatives.

## Trajectoire

| Jalon | Fenêtre indicative | Livrable | Condition de passage |
|---|---|---|---|
| G0 — Préserver et contenir | Dès maintenant, en parallèle | État récupérable, secrets et démonstration assainis | P0 corrigés avant usage réel du logiciel |
| G1 — Valider le parcours | J0 à J0 + 3 semaines | Fiche de préparation éprouvée, zone/culture et groupe pilote | Besoin concret, accès aux participants et conseiller, alternative et payeur examinés |
| G2 — Tester le service manuellement | Après G1, durée fixée au protocole | Quelques dossiers accompagnés et bilan | Démarches utiles, relecture possible, coût et intérêt de poursuite documentés |
| G3 — Construire la version minimale | Après signal utile G2 | F1–F6 du cahier des charges | Recette fonctionnelle, permissions, persistance et récupération validées |
| G4 — Tester le produit | Après G3 | Usage réel des mêmes parcours et bilan de service | Utilisation, qualité, coûts et engagement de poursuite suffisants |
| G5 — Étendre avec preuve | Après G4 positif | Suivi de campagne ou second contexte comparable | Besoin récurrent et service reproductible |

Les prototypes de parcours et corrections de sécurité peuvent avancer avant G2 ; une intégration capteur ou un moteur agronomique ne sont pas des prérequis.

## G0 — Technique immédiate

Statut : à faire.

- [ ] T0 : préserver le travail non commité, y compris fichiers non suivis.
- [ ] T1 : traiter les clés exposées et vérifier la portée de l'exposition.
- [ ] T2 : retirer faux succès, conseils de démonstration trompeurs et promesses sans preuve.
- [ ] T3/T5 : rétablir installation reproductible, lint, typecheck et préparation de CI.

Voir le [plan de refonte](docs/PLAN_REFONTE.md). Les entretiens ne dépendent pas du fonctionnement du prototype.

## G1 — Enquête et fiche commune

Statut : à faire ; aucun contact confirmé.

- Semaine 1 : trouver 5 débutants avec projet concret, 5 producteurs peu accompagnés et 2 conseillers, comme objectif indicatif.
- Semaine 2 : reconstituer leurs dernières démarches, problèmes, alternatives et dépenses de préparation.
- Semaine 3 : tester une même fiche de préparation ; choisir zone, culture, groupe et conseiller pour quelques dossiers réels.

Ces nombres ne constituent pas un échantillon représentatif. Si les deux profils ont des besoins différents, choisir un seul parcours de lancement au lieu de développer deux produits.

Critères : difficulté documentée, démarche modifiable, participants accessibles, conseil disponible, contenu local vérifiable, méthode d'évaluation, payeur potentiel. Ne pas assimiler intérêt oral et demande payante.

À inscrire dans D-014 : filière, culture, zone, groupe prioritaire et canal. L'absence de participants entraîne une recherche ciblée ou une révision de l'hypothèse, pas plus de développement.

## G2 — Service manuel

Statut : conditionnel à G1.

- [ ] Fixer le protocole, les dépenses maximales et le temps disponible.
- [ ] Définir le résultat attendu avant de tester : informations clarifiées, démarches effectuées et décision de lancement.
- [ ] Accompagner environ 3 dossiers, nombre indicatif à adapter avec le conseiller.
- [ ] Produire contexte, vérifications, plan, budget incomplet si nécessaire, relecture et synthèse.
- [ ] Mesurer temps par dossier, blocages, qualité des informations et engagement de poursuite.
- [ ] Décider de continuer, corriger, prolonger avec limite ou arrêter.

Le pilote manuel ne requiert pas de déployer l'ancienne application. Données privées dans un espace adapté, accès convenu, aucune coordonnée personnelle publiée dans Git.

## G3 — Version minimale fiable

Statut : conditionnel à G2. Développer en tranches vérifiables :

1. T4 + F1 : accès et dossier durable, contrôlés avec deux comptes.
2. F2 + F3 : contenu local versionné, revue des conditions et plan d'action.
3. F4 : budget explicite et calculs testés.
4. F5 + F6 : attribution conseiller, commentaires, historique et synthèse.
5. T8 : parcours téléphone, erreur réseau, reprise et recette complète.

L'interface peut être préparée avec des exemples clairement étiquetés avant le pilote. Aucune date de livraison ne devient ferme avant estimation de ces tranches.

## G4 — Bilan produit

Évaluer séparément débutants et producteurs actifs : utilité des démarches, décisions documentées, complétude réelle, temps de conseil, coût et poursuite.

| Constat | Suite |
|---|---|
| Service utile et engagement concret avec coût soutenable | Consolider |
| Besoin réel mais erreurs ou parcours corrigeables | Corriger puis vérifier |
| Résultats insuffisants | Prolongation bornée ou arrêt |
| Service peu utile, conseil indisponible ou absence de payeur plausible | Revoir le modèle ou arrêter |

Ni un dossier rempli ni un abonnement envisagé ne prouvent un gain de rendement.

## Hors périmètre initial

Marketplace, réseau social, formation généraliste, chatbot ouvert, diagnostic photo autonome, capteurs, automatisation, satellite, crédit/paiement, plusieurs pays et plusieurs filières.

Les capteurs peuvent rester un apprentissage personnel limité, sans dépendance dans la livraison du produit.

## Revue hebdomadaire

Noter phase, preuve nouvelle, tâche livrée, coût/temps, risque, prochaine action/responsable/échéance et décision éventuelle.
Limiter le travail simultané à une enquête/service et une tâche technique utile.

Références : [produit](docs/PRODUIT.md), [protocole](docs/VALIDATION_TERRAIN.md), [décisions](docs/DECISIONS.md).
