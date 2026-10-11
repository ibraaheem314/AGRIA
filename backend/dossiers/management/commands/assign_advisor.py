from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from dossiers.models import AdvisorAssignment, Campaign


class Command(BaseCommand):
    help = "Attribue un dossier (campagne) à un conseiller, ou clôt l'attribution (--end)."

    def add_arguments(self, parser):
        parser.add_argument("--dossier", type=int, required=True, help="identifiant du dossier")
        parser.add_argument("--email", required=True, help="email du conseiller")
        parser.add_argument("--end", action="store_true", help="clôt l'attribution active")

    @transaction.atomic
    def handle(self, *args, **opts):
        campaign = Campaign.objects.filter(pk=opts["dossier"]).select_related("project").first()
        if campaign is None:
            raise CommandError("Dossier introuvable.")
        advisor = get_user_model().objects.filter(email__iexact=opts["email"]).first()
        if advisor is None or not advisor.is_advisor:
            raise CommandError("Aucun compte conseiller avec cet email.")
        if advisor.pk == campaign.project.owner_id:
            raise CommandError("Le porteur ne peut pas être son propre conseiller.")
        active = AdvisorAssignment.objects.filter(
            campaign=campaign, advisor=advisor, ended_at__isnull=True
        ).first()
        if opts["end"]:
            if active is None:
                raise CommandError("Aucune attribution active à clore.")
            active.ended_at = timezone.now()
            active.save(update_fields=["ended_at"])
            self.stdout.write(
                self.style.SUCCESS(f"Attribution close : {advisor.email} ↛ {campaign}")
            )
            return
        if active:
            self.stdout.write(f"Déjà attribué : {advisor.email} → {campaign}")
            return
        AdvisorAssignment.objects.create(campaign=campaign, advisor=advisor)
        self.stdout.write(self.style.SUCCESS(f"Attribué : {advisor.email} → {campaign}"))
