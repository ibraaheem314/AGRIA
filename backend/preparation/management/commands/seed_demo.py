"""Données de démonstration fictives, identifiées comme telles, sur des comptes dédiés.

Crée une seule fois (idempotent) :
- demo-debutant@agria.invalid : un débutant avec des inconnues, une démarche terminée,
  un budget incomplet, une question et une demande de relecture ;
- demo-producteur@agria.invalid : un producteur dont la campagne précédente est archivée
  et la nouvelle campagne reprend le lieu « à revérifier » ;
- demo-conseiller@agria.invalid : un conseiller attribué au dossier du débutant.

Tous les projets portent is_demo=True (bandeau « Exemple de démonstration »). Les mots de passe
sont tirés au hasard et affichés une seule fois ; ils ne sont stockés nulle part en clair.
Domaine .invalid : aucune boîte aux lettres réelle. À lancer sur une base dédiée (dev.py demo-init).
"""

import secrets
import uuid

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from budget import services as budget
from dossiers import services as dossiers
from dossiers.models import AdvisorAssignment, Campaign, Project
from preparation import services as preparation
from preparation.content import active_template
from preparation.models import Action
from reviews import services as reviews

ACCOUNTS = {
    "debutant": ("demo-debutant@agria.invalid", "Awa (exemple fictif)", False),
    "producteur": ("demo-producteur@agria.invalid", "Modou (exemple fictif)", False),
    "conseiller": ("demo-conseiller@agria.invalid", "Conseillère (exemple fictif)", True),
}


def _save(campaign, user, key, status, value=None, source=""):
    fact = campaign.facts.filter(key=key).first()
    dossiers.save_fact(
        campaign=campaign, key=key, status=status, value=value, source=source,
        expected_version=fact.row_version if fact else 0, author=user,
    )  # fmt: skip


def _project(owner, name, profile, label):
    project, _ = dossiers.create_project(
        owner=owner, name=name, profile=profile, campaign_label=label, request_id=uuid.uuid4()
    )
    Project.objects.filter(pk=project.pk).update(is_demo=True)
    return project, Campaign.objects.select_for_update().get(project=project)


class Command(BaseCommand):
    help = "Crée (une fois) trois comptes et des dossiers de démonstration fictifs."

    def handle(self, *args, **opts):
        if active_template() is None:
            raise CommandError("Charger d'abord le contenu : python manage.py load_content")
        User = get_user_model()
        emails = [email for email, _, _ in ACCOUNTS.values()]
        if User.objects.filter(email__in=emails).exists():
            self.stdout.write("Les comptes de démonstration existent déjà : rien à faire.")
            return

        passwords = {role: secrets.token_urlsafe(12) for role in ACCOUNTS}
        today = timezone.localdate()
        with transaction.atomic():
            users = {
                role: User.objects.create_user(
                    email=email, password=passwords[role], display_name=name, is_advisor=advisor
                )
                for role, (email, name, advisor) in ACCOUNTS.items()
            }

            # Débutant : inconnues, démarche terminée, budget incomplet, question, demande.
            u = users["debutant"]
            _, campaign = _project(
                u, "Exemple fictif — maraîchage", "debutant", "Contre-saison (exemple)"
            )
            _save(
                campaign,
                u,
                "localisation",
                "declare",
                {"region": "Thiès", "lieu": "Village fictif"},
            )
            _save(campaign, u, "acces_terrain", "declare", {"situation": "en_discussion"})
            _save(
                campaign,
                u,
                "eau",
                "inconnu",
                source="Exemple : personne à interroger non identifiée",
            )
            _save(campaign, u, "culture", "estime", {"nom": "Exemple : légume de contre-saison"})
            action = Action.objects.get(campaign=campaign, definition_key="identifier-eau")
            preparation.update_action(
                action=action,
                data={"status": "terminee", "result_date": today,
                      "result_text": "Exemple fictif : un puits partagé repéré."},
                expected_version=action.row_version, author=u,
            )  # fmt: skip
            budget.create_line(
                campaign=campaign, request_id=uuid.uuid4(), author=u,
                data={"category": "campagne", "label": "Semences (exemple)", "quantity": "2",
                      "unit": "kg", "unit_price": "15000", "price_status": "estime",
                      "source": "Exemple fictif", "price_date": None},
            )  # fmt: skip
            budget.create_line(
                campaign=campaign, request_id=uuid.uuid4(), author=u,
                data={"category": "investissement", "label": "Motopompe (exemple)", "quantity": "1",
                      "unit": "unite", "price_status": "manquant"},
            )  # fmt: skip
            reviews.post_comment(
                campaign=campaign, author=u, request_id=uuid.uuid4(),
                data={"kind": "question", "body": "Exemple : comment savoir si le puits suffit ?"},
            )  # fmt: skip
            reviews.request_review(
                campaign=campaign,
                note="Exemple fictif de demande.",
                request_id=uuid.uuid4(),
                author=u,
            )
            AdvisorAssignment.objects.create(campaign=campaign, advisor=users["conseiller"])

            # Producteur : campagne précédente archivée, nouvelle campagne à revérifier.
            p = users["producteur"]
            project, previous = _project(p, "Exemple fictif — exploitation", "producteur",
                                         "Contre-saison passée (exemple)")  # fmt: skip
            _save(previous, p, "localisation", "verifie", {"region": "Thiès"}, "Exemple fictif")
            _save(previous, p, "eau", "verifie", {"source": "forage"}, "Exemple : comité du forage")
            _save(previous, p, "experience", "declare",
                  {"description": "Exemple fictif : deux campagnes d'oignon."})  # fmt: skip
            reviews.archive(campaign=previous)
            dossiers.create_campaign(
                project=project, label="Prochaine contre-saison (exemple)", request_id=uuid.uuid4(),
                copy_from=previous, author=p,
            )  # fmt: skip

        self.stdout.write(self.style.SUCCESS("Données de démonstration créées (exemples fictifs)."))
        self.stdout.write("Mots de passe affichés UNE SEULE FOIS : à noter dans un endroit privé.")
        for role, (email, _, _) in ACCOUNTS.items():
            self.stdout.write(f"  {role:<11} {email}  {passwords[role]}")
