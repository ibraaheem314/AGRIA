"""Crée un dossier d'exemple, fictif et identifié comme tel, sur un compte dédié.

Les dossiers réels ne sont jamais touchés : le compte de démonstration est distinct,
et son projet porte is_demo=True (bandeau « Exemple de démonstration » dans l'interface).
"""

import secrets
import uuid

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from dossiers import services as dossiers
from dossiers.models import Campaign, Project
from preparation import services as preparation
from preparation.content import active_template
from preparation.models import Action

DEMO_EMAIL = "demonstration@agria.invalid"  # domaine réservé : aucune boîte réelle


class Command(BaseCommand):
    help = "Crée (une fois) un compte et un dossier de démonstration fictifs."

    def handle(self, *args, **opts):
        if active_template() is None:
            raise CommandError("Charger d'abord le contenu : python manage.py load_content")
        User = get_user_model()
        if User.objects.filter(email=DEMO_EMAIL).exists():
            self.stdout.write("Le compte de démonstration existe déjà : rien à faire.")
            return
        password = secrets.token_urlsafe(12)
        with transaction.atomic():
            user = User.objects.create_user(
                email=DEMO_EMAIL, password=password, display_name="Compte de démonstration"
            )
            project, _ = dossiers.create_project(
                owner=user,
                name="Exemple fictif — maraîchage",
                profile="debutant",
                campaign_label="Contre-saison (exemple)",
                request_id=uuid.uuid4(),
            )
            Project.objects.filter(pk=project.pk).update(is_demo=True)
            campaign = Campaign.objects.select_for_update().get(project=project)

            def save(key, status, value=None, source=""):
                fact = campaign.facts.filter(key=key).first()
                dossiers.save_fact(
                    campaign=campaign, key=key, status=status, value=value, source=source,
                    expected_version=fact.row_version if fact else 0, author=user,
                )  # fmt: skip

            save("localisation", "declare", {"region": "Thiès", "lieu": "Exemple fictif"})
            save("acces_terrain", "declare", {"situation": "en_discussion"})
            save("eau", "inconnu", source="Exemple : personne à interroger non identifiée")
            save("culture", "estime", {"nom": "Exemple : légume de contre-saison"})
            action = Action.objects.get(campaign=campaign, definition_key="identifier-eau")
            preparation.update_action(
                action=action,
                data={
                    "status": "terminee",
                    "result_text": "Exemple fictif : un puits partagé repéré à proximité.",
                    "result_date": timezone.localdate(),
                },
                expected_version=action.row_version,
                author=user,
            )
        self.stdout.write(self.style.SUCCESS(f"Dossier de démonstration créé pour {DEMO_EMAIL}"))
        self.stdout.write(f"Mot de passe (affiché une seule fois) : {password}")
