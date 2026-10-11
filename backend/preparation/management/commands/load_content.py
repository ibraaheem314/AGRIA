from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from preparation.content import ContentError, load_all


class Command(BaseCommand):
    help = "Charge les modèles de préparation (preparation/content/*.json). Idempotent."

    def handle(self, *args, **opts):
        try:
            with transaction.atomic():
                results = load_all()
        except ContentError as exc:
            raise CommandError(str(exc)) from exc
        for template, created in results:
            state = "chargé" if created else "déjà présent, identique"
            self.stdout.write(f"{template} ({template.get_review_status_display()}) : {state}")
