# Scénario illustratif d'une campagne complète

**Scénario fictif.** Personne, lieu, culture et événements sont inventés pour illustrer le fonctionnement proposé ; rien ne provient d'un entretien. **Aucune date, dose, quantité ni aucun produit n'est donné** : les crochets `[…]` désignent ce qu'une référence relue fournirait. Statut : proposition ([CADRAGE_PRODUIT.md](CADRAGE_PRODUIT.md)). Une **démonstration interactive** en reprend trois moments (où en est la culture, problème sur les feuilles, action et suivi de son résultat) : prototype, route `/suivi` ([DEMARRAGE](DEMARRAGE.md)).

**Personnage :** Ndèye (fictive), productrice maraîchère, cultive une petite parcelle irriguée par un puits, au téléphone Android, à l'aise à l'oral en wolof, lit le français avec effort. Culture d'exemple : une culture **repiquée** (pépinière puis repiquage), choisie parce qu'elle fait apparaître des opérations décalées. La culture et la zone réellement retenues dépendront des décisions D-014 et D-054.

## Vocabulaire utilisé dans tout le scénario

| Objet | Définition | Qui le crée | Peut-il changer seul ? |
|---|---|---|---|
| **Prévu** | Une opération ou un stade attendu, issu d'une référence relue, recalé sur les dates réelles | Le système, à partir du contenu relu | Il est recalculé quand une date réelle change ; il n'est jamais marqué « fait » |
| **Observé** | Ce que l'utilisatrice constate (stade, symptôme, état), daté, éventuellement avec photo | L'utilisatrice | Non ; une nouvelle observation s'ajoute, l'ancienne reste |
| **Réalisé** | Une opération déclarée faite, avec sa date et ce qui a été employé, tel que déclaré | L'utilisatrice | Non ; une correction crée une révision tracée |
| **Proposition** | Ce que le système ou l'assistant suggère, avec sa provenance | Le système ou l'IA | Ce n'est jamais un fait : l'utilisatrice l'accepte comme tâche, ou l'ignore |

## 1. Projet

| | |
|---|---|
| Ce qu'elle cherche | Savoir si sa prochaine campagne tient debout |
| Ce qu'elle renseigne | Culture, période visée, lieu, accès au terrain, eau (puits), vente envisagée ; « je ne sais pas » accepté |
| Ce que le système sait réellement | Ses déclarations ; la culture et la zone sont dans le périmètre pris en charge |
| Ce qu'il restitue | Synthèse courte, points à éclaircir, première démarche (fonction UX3-A existante) |
| Provenance | Contenu de préparation versionné et relu pour cette culture et cette zone |
| Confirmation | Chaque réponse est enregistrée explicitement, étape par étape |
| Conséquence | Le dossier de campagne existe ; les inconnues deviennent des démarches |

## 2. Préparation

| | |
|---|---|
| Ce qu'elle cherche | Lever les points bloquants : eau suffisante sur la période, semences, budget |
| Ce qu'elle renseigne | Résultat de ses démarches (le puits a-t-il baissé l'an dernier à cette période ?), postes de budget |
| Ce que le système sait | Résultats déclarés, issue (favorable, défavorable, incertaine) |
| Ce qu'il restitue | Points encore ouverts recalculés ; budget incomplet si un poste n'est pas chiffré |
| Provenance | Règles du contenu relu ; calcul déterministe du budget |
| Confirmation | Mise à jour explicite de l'information après la démarche (D-048) |
| Conséquence | Décision de poursuivre, enregistrée avec ses motifs |

## 3. Semis en pépinière

| | |
|---|---|
| Ce qu'elle cherche | Démarrer au bon moment et savoir ce qui suit |
| Ce qu'elle renseigne | « Semis en pépinière fait le [date réelle] » (réalisé) |
| Ce que le système sait | La date réelle ; la fiche relue de la culture pour la zone |
| Ce qu'il restitue | Plan daté : opérations prévues avec des **fenêtres** `[issues de la fiche relue]` comptées depuis la date réelle (entretien de la pépinière, repiquage attendu) |
| Provenance | « Fiche [culture] — [zone], version n, relue par [référent] le [date] » |
| Confirmation | Le semis est déclaré par elle ; le plan n'est qu'une proposition |
| Conséquence | Les rappels se calent sur le semis réel, pas sur un calendrier théorique |

## 4. Repiquage retardé (opération retardée)

| | |
|---|---|
| Ce qu'elle cherche | Repiquer, mais le puits a été en panne |
| Ce qu'elle renseigne | « Repiquage fait le [date réelle], plus tard que prévu ; raison : panne de la pompe » |
| Ce que le système sait | L'écart entre fenêtre prévue et date réelle, la raison déclarée |
| Ce qu'il restitue | Plan **recalé** sur la date réelle de repiquage ; si la fiche relue prévoit une conséquence d'un retard (par exemple un plant trop âgé), il l'affiche **telle que rédigée** ; sinon il n'en invente aucune |
| Provenance | Fiche relue ; règle de recalage (déterministe) |
| Confirmation | Date déclarée par elle |
| Conséquence | Le bilan montrera le retard et sa raison ; aucune opération n'est marquée faite à sa place |

## 5. Suivi : arrosage et fertilisation

| | |
|---|---|
| Ce qu'elle cherche | Savoir quoi faire cette semaine |
| Ce qu'elle renseigne | Arrosages et apports **réalisés**, tels qu'elle les décrit (« arrosé à l'arrosoir ce matin », « fumier apporté »), sans quantité imposée |
| Ce que le système sait | Ses déclarations ; le stade **estimé** d'après la date de repiquage ; le dernier stade **observé** |
| Ce qu'il restitue | « Cette semaine, d'après la fiche relue : `[opérations de la fenêtre]` ». Pour l'arrosage : les repères qualitatifs de la fiche (`[signes de manque d'eau à surveiller]`) ; **aucun volume** tant qu'aucun calcul n'est validé localement (voir la matrice) |
| Provenance | Fiche relue ; jamais l'IA pour une dose ou un volume |
| Confirmation | Chaque opération réalisée est déclarée séparément de la proposition |
| Conséquence | Le journal se remplit ; l'écart prévu/réalisé est visible |

## 6. Observation manquante

| | |
|---|---|
| Situation | Aucune observation ni opération déclarée depuis `[intervalle fixé par la fiche]` |
| Ce que le système sait | Seulement que rien n'a été déclaré : **il ne suppose pas** que rien n'a été fait |
| Ce qu'il restitue | Une invitation : « Où en est la culture ? Avez-vous arrosé, désherbé, observé quelque chose ? » ; le stade reste « estimé d'après les dates », affiché comme tel |
| Conséquence | Les propositions suivantes restent prudentes (« d'après les dates, sans observation récente ») |

## 7. Information contradictoire

| | |
|---|---|
| Situation | Elle déclare un stade (« les bulbes grossissent ») incompatible avec le stade estimé d'après la date ; ou elle parle d'un forage alors que le dossier indique un puits |
| Ce que le système sait | Deux informations qui ne concordent pas |
| Ce qu'il restitue | Il **signale l'écart sans trancher** : « Votre observation ne correspond pas au stade attendu d'après la date de repiquage. Laquelle est juste ? » ; pour l'eau, propose de mettre à jour l'information du dossier |
| Provenance | Comparaison déterministe observé / estimé |
| Confirmation | Elle corrige la date, confirme l'observation, ou met à jour l'eau : chaque choix est tracé |
| Conséquence | L'observation récente prime pour les propositions suivantes ; l'historique garde les deux |

## 8. Problème observé

| | |
|---|---|
| Ce qu'elle cherche | Comprendre des taches sur les feuilles |
| Ce qu'elle renseigne | Description libre (texte ou, plus tard, voix) et une photo |
| Ce que le système sait | Culture, stade, arrosages et apports récents déclarés, météo seulement si une source est intégrée |
| Ce qu'il restitue | 1) Contrôle de la photo : nette ou non, organe visible ou non ; une photo inutilisable est signalée avec un conseil de prise de vue. 2) Une **observation enregistrée** en ses mots. 3) Les **questions de la fiche relue** qui distinguent les causes possibles (feuilles jeunes ou âgées, une plante ou toute la parcelle, évolution depuis quand) |
| Provenance | Fiches de problèmes relues pour la culture ; l'IA ne fait que structurer la description et retrouver la fiche |
| Confirmation | Elle valide l'observation enregistrée (« oui, c'est ce que je vois ») |
| Conséquence | Le problème est ouvert dans le journal, daté, avec la photo en pièce jointe privée |

## 9. Investigation

| | |
|---|---|
| Ce qu'elle renseigne | Réponses aux questions ; une seconde photo si demandée |
| Ce que le système sait | Ses réponses ; la fiche relue |
| Ce qu'il restitue | **Hypothèses**, pas un diagnostic : « Ce que vous décrivez est compatible avec `[cause A]` ou `[cause B]` d'après la fiche ; il manque `[élément]` pour les distinguer. » Si rien ne correspond, ou si les réponses sont ambiguës : « Aucune conclusion fondée n'est possible ; voici quoi observer, et vous pouvez transmettre ce cas à `[recours humain]` » |
| Provenance | Fiche relue ; si un service de reconnaissance d'image est un jour intégré, son résultat est affiché comme « suggestion d'un outil automatique, précision mesurée de `[x]` sur `[jeu local]` », jamais seul |
| Confirmation | Rien n'est confirmé à ce stade ; « diagnostic confirmé » seulement par un expert ou un constat prévu par la fiche |
| Conséquence | Le cas peut être transmis au référent avec son dossier complet (sans ressaisie) |

## 10. Action

| | |
|---|---|
| Ce qu'elle cherche | Savoir quoi faire maintenant |
| Ce qu'elle obtient | Les actions **prévues par la fiche relue** pour l'hypothèse retenue (par exemple des mesures de prophylaxie ou de surveillance `[telles que rédigées]`) ; pour tout traitement par produit : uniquement ce que la fiche relue cite, avec ses conditions, sinon renvoi au recours humain |
| Provenance | Fiche relue ; liste de produits seulement si elle a été établie par le référent, à partir des autorisations en vigueur (à vérifier auprès de l'autorité compétente) |
| Confirmation | Elle déclare l'action **réalisée** (date, ce qui a été fait) ; « Ajouter à mes tâches » crée une opération prévue, pas réalisée |
| Conséquence | Une vérification est planifiée `[délai de la fiche]` |

## 11. Vérification

| | |
|---|---|
| Ce qu'elle renseigne | Nouvelle observation : aggravé, stable, amélioré, avec photo |
| Ce que le système sait | L'évolution déclarée |
| Ce qu'il restitue | Si amélioré : proposition de clore le problème (elle confirme). Si aggravé ou incertain : escalade proposée, et le problème reste ouvert |
| Conséquence | Le problème, ses hypothèses, actions et issue restent dans l'historique et alimentent le bilan |

## 12. Récolte

| | |
|---|---|
| Ce qu'elle renseigne | Dates de récolte réelles ; quantité **dans l'unité qu'elle utilise** (sacs, caisses, kilos) ; ventes éventuelles et prix déclarés |
| Ce que le système sait | Ses déclarations, sans conversion inventée |
| Ce qu'il restitue | Récapitulatif ; une conversion d'unité seulement si elle a été définie avec elle |
| Conséquence | Données pour le bilan |

## 13. Bilan

| | |
|---|---|
| Ce qu'elle cherche | Comprendre ce qui a marché et préparer la suivante |
| Ce qu'elle obtient | Prévu / réalisé (dates, écarts et raisons), problèmes et leurs issues, dépenses déclarées contre budget prévu, récolte déclarée ; ses propres notes « à refaire / à éviter » |
| Ce que le système ne dit pas | Ni rentabilité garantie, ni causalité (« le retard a coûté X ») sans méthode |
| Conséquence | Nouvelle campagne préparée avec ses informations reprises « à reconfirmer » et ses leçons visibles |

## L'assistant conversationnel dans ce scénario

À toute étape, Ndèye peut demander : « Je dois arroser combien aujourd'hui ? », « C'est normal que les feuilles jaunissent ? », « J'ai oublié, j'ai mis le fumier quand ? ».

| Règle | Exemple |
|---|---|
| Il utilise la **mémoire de la campagne** | « D'après votre journal, le fumier a été apporté le `[date]` ; le repiquage date du `[date]`. » |
| Il cite sa provenance | « Selon la fiche `[nom, version, relue par …]` » ou « Dans votre dossier » |
| Il ne donne pas ce qu'aucune référence relue ne fonde | « Je n'ai pas de référence validée pour un volume d'arrosage sur votre parcelle. Les signes à surveiller sont… Voulez-vous transmettre la question ? » |
| Il demande ce qui manque | « Les feuilles jaunes sont-elles les plus jeunes ou les plus anciennes ? » |
| Il ne crée aucun fait | Une réponse ne coche aucune opération ; elle peut proposer « Déclarer un arrosage » ou « Ajouter une observation », qui ouvrent le formulaire à confirmer |
| Il signale les contradictions | « Vous dites avoir repiqué hier, mais votre journal indique une date antérieure. Laquelle est juste ? » |
