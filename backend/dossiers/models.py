"""Projet, campagne (le « dossier »), informations et attribution d'un conseiller.

Invariants garantis par la base :
- une information « je ne sais pas » n'a pas de valeur ; une autre information en a une ;
- une information « vérifiée » porte une source ;
- un identifiant de requête client ne peut créer qu'un seul objet (reprises sans doublon) ;
- un conseiller n'a qu'une attribution active par dossier.
"""

from django.conf import settings
from django.db import models
from django.db.models import Q

from dossiers import facts


class Project(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="projects"
    )
    name = models.CharField("nom du projet", max_length=120)
    profile = models.CharField("profil", max_length=20, choices=list(facts.PROFILES.items()))
    is_demo = models.BooleanField(
        "démonstration",
        default=False,
        help_text="Exemple fictif, identifié comme tel ; jamais mélangé aux dossiers réels.",
    )
    client_request_id = models.UUIDField(null=True, blank=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "projet"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "client_request_id"], name="project_unique_request"
            ),
        ]

    def __str__(self):
        return self.name


class Campaign(models.Model):
    """Une campagne préparée = un dossier."""

    project = models.ForeignKey(Project, on_delete=models.PROTECT, related_name="campaigns")
    label = models.CharField("intitulé", max_length=120)
    # Version du contexte : augmente à chaque modification d'une information.
    context_version = models.PositiveIntegerField(default=0)
    archived_at = models.DateTimeField(null=True, blank=True)
    client_request_id = models.UUIDField(null=True, blank=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "campagne (dossier)"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["project", "client_request_id"], name="campaign_unique_request"
            ),
        ]

    def __str__(self):
        return f"{self.project.name} — {self.label}"


FACT_STATUS_CHOICES = list(facts.STATUSES.items())


class Fact(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="facts")
    key = models.CharField(max_length=40, choices=[(d.key, d.label) for d in facts.DEFINITIONS])
    status = models.CharField(max_length=10, choices=FACT_STATUS_CHOICES)
    value = models.JSONField(null=True, blank=True)
    source = models.TextField("source ou précision", blank=True, max_length=1000)
    row_version = models.PositiveIntegerField(default=1)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "information"
        constraints = [
            models.UniqueConstraint(fields=["campaign", "key"], name="fact_unique_key"),
            models.CheckConstraint(
                condition=(Q(status="inconnu", value__isnull=True))
                | (~Q(status="inconnu") & Q(value__isnull=False)),
                name="fact_value_matches_status",
            ),
            models.CheckConstraint(
                condition=~Q(status="verifie") | ~Q(source=""),
                name="fact_verified_has_source",
            ),
        ]

    def __str__(self):
        return f"{self.key} ({self.status})"


class FactRevision(models.Model):
    """Historique en ajout seul : chaque modification d'une information y laisse une trace."""

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="fact_revisions")
    key = models.CharField(max_length=40)
    status = models.CharField(max_length=10, choices=FACT_STATUS_CHOICES)
    value = models.JSONField(null=True, blank=True)
    source = models.TextField(blank=True)
    context_version = models.PositiveIntegerField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "révision d'information"
        ordering = ["-context_version"]
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "context_version"], name="fact_revision_unique_version"
            ),
        ]

    def __str__(self):
        return f"{self.key} v{self.context_version}"


class AdvisorAssignment(models.Model):
    """Attribution explicite d'un dossier à un conseiller (faite par l'administration)."""

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="assignments")
    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="assignments",
        limit_choices_to={"is_advisor": True},
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="+", null=True
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "attribution à un conseiller"
        verbose_name_plural = "attributions à un conseiller"
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "advisor"],
                condition=Q(ended_at__isnull=True),
                name="assignment_one_active_per_advisor",
            ),
        ]

    def __str__(self):
        return f"{self.advisor} → {self.campaign}"
