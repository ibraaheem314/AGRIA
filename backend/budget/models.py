"""Postes du budget provisoire.

Invariants garantis par la base :
- prix « manquant » si et seulement si aucun prix unitaire n'est saisi ;
- un prix « connu » porte une source et une date ; un prix « estimé » porte une source ;
- quantité strictement positive, prix unitaire positif ou nul ;
- un identifiant de requête client ne crée qu'un poste.
Un poste n'est jamais effacé : il est retiré (removed_at) et reste dans l'historique.
"""

from django.conf import settings
from django.db import models
from django.db.models import Q

from budget.calc import CATEGORIES, PRICE_STATUSES, UNITS
from dossiers.models import Campaign


class BudgetLine(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="budget_lines")
    category = models.CharField(max_length=20, choices=list(CATEGORIES.items()))
    label = models.CharField("poste", max_length=200)
    quantity = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    unit = models.CharField(max_length=10, choices=list(UNITS.items()))
    unit_price = models.PositiveBigIntegerField("prix unitaire (FCFA)", null=True, blank=True)
    price_status = models.CharField(max_length=10, choices=list(PRICE_STATUSES.items()))
    source = models.CharField("source du prix", max_length=300, blank=True)
    price_date = models.DateField("date du prix", null=True, blank=True)
    already_owned = models.BooleanField("déjà détenu", default=False)
    notes = models.TextField(blank=True, max_length=1000)
    removed_at = models.DateTimeField(null=True, blank=True)
    row_version = models.PositiveIntegerField(default=1)
    client_request_id = models.UUIDField(null=True, blank=True, editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "poste de budget"
        ordering = ["category", "id"]
        constraints = [
            models.CheckConstraint(
                condition=(Q(price_status="manquant") & Q(unit_price__isnull=True))
                | (~Q(price_status="manquant") & Q(unit_price__isnull=False)),
                name="budget_missing_iff_no_price",
            ),
            models.CheckConstraint(
                condition=~Q(price_status="connu") | (~Q(source="") & Q(price_date__isnull=False)),
                name="budget_known_has_source_and_date",
            ),
            models.CheckConstraint(
                condition=~Q(price_status="estime") | ~Q(source=""),
                name="budget_estimate_has_source",
            ),
            models.CheckConstraint(
                condition=Q(quantity__isnull=True) | Q(quantity__gt=0),
                name="budget_quantity_positive",
            ),
            models.UniqueConstraint(
                fields=["campaign", "client_request_id"], name="budget_unique_request"
            ),
        ]

    def __str__(self):
        return self.label


class BudgetEvent(models.Model):
    """Historique en ajout seul : état complet du poste après chaque changement."""

    line = models.ForeignKey(BudgetLine, on_delete=models.CASCADE, related_name="events")
    budget_version = models.PositiveIntegerField()
    kind = models.CharField(
        max_length=10,
        choices=[("ajout", "Ajout"), ("modif", "Modification"), ("retrait", "Retrait")],
    )
    snapshot = models.JSONField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "évènement de budget"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.line} : {self.kind}"
