"""Postes à examiner pour un premier budget.

Une aide générique pour ne rien oublier : ni un budget complet, ni une recommandation
d'achat. Un poste ajouté depuis cette liste n'a ni quantité ni prix (« à chiffrer ») : rien
n'est inventé, et un poste inconnu ne compte jamais pour zéro. La catégorie proposée se
modifie comme pour tout autre poste.
"""

SUGGESTIONS: tuple[dict, ...] = (
    {
        "key": "acces_terrain",
        "label": "Accès au terrain",
        "category": "campagne",
        "help": "Location, prêt, préparation du terrain : y a-t-il un coût ?",
    },
    {
        "key": "eau",
        "label": "Eau",
        "category": "campagne",
        "help": "Accès, redevance, pompage, carburant : l'eau a-t-elle un coût pour vous ?",
    },
    {
        "key": "semences",
        "label": "Semences ou plants",
        "category": "campagne",
        "help": "Ce qu'il faut acheter ou obtenir pour planter.",
    },
    {
        "key": "materiel",
        "label": "Matériel",
        "category": "investissement",
        "help": "Outils ou équipements à acheter, louer ou emprunter.",
    },
    {
        "key": "main_oeuvre",
        "label": "Main-d'œuvre",
        "category": "campagne",
        "help": "Personnes à payer pour certains travaux, même ponctuellement.",
    },
    {
        "key": "transport",
        "label": "Transport",
        "category": "campagne",
        "help": "Déplacements, acheminement des achats ou de la récolte.",
    },
)

BY_KEY = {s["key"]: s for s in SUGGESTIONS}
