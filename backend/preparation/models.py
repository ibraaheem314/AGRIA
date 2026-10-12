"""Modèles de contenu versionnés, plan d'action et historique des démarches.

Invariants garantis par la base :
- une démarche terminée porte un résultat ; une démarche bloquée porte un motif ;
- une démarche issue du modèle n'existe qu'une fois par dossier ;
- un modèle (code, version) est unique ; son contenu n'est jamais modifié après chargement.
"""

from django.conf import settings
from django.db import models
from django.db.models import Q

from dossiers.models import Campaign

REVIEW_STATUSES = {
    "non_relu": "Non relu par un spécialiste",
    "en_relecture": "En cours de relecture",
    "relu": "Relu",
}

# Issue du résultat d'une démarche, indiquée par le porteur. Elle ne modifie jamais une
# information du dossier : c'est au porteur de la mettre à jour.
RESULT_OUTCOMES = {
    "favorable": "Favorable",
    "defavorable": "Défavorable",
    "incertain": "Incertain",
}

ACTION_STATUSES = {
    "a_faire": "À faire",
    "en_cours": "En cours",
    "bloquee": "Bloquée",
    "terminee": "Terminée",
}


class PreparationTemplate(models.Model):
    code = models.SlugField(max_length=80)
    version = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    review_status = models.CharField(max_length=20, choices=list(REVIEW_STATUSES.items()))
    content = models.JSONField()
    content_sha256 = models.CharField(max_length=64)
    loaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "modèle de préparation"
        verbose_name_plural = "modèles de préparation"
        ordering = ["code", "-version"]
        constraints = [
            models.UniqueConstraint(fields=["code", "version"], name="template_unique_version"),
        ]

    def __str__(self):
        return f"{self.code} v{self.version}"


class CampaignPlan(models.Model):
    """Plan d'un dossier : modèle utilisé et version du plan."""

    campaign = models.OneToOneField(Campaign, on_delete=models.CASCADE, related_name="plan")
    template = models.ForeignKey(PreparationTemplate, on_delete=models.PROTECT)
    # Augmente à chaque modification du plan (ajout de démarche, changement d'état).
    plan_version = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "plan d'un dossier"

    def __str__(self):
        return f"Plan {self.campaign} ({self.template})"


class Action(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="actions")
    # Démarche issue du modèle (definition_key renseigné) ou ajoutée par le porteur.
    template = models.ForeignKey(PreparationTemplate, on_delete=models.PROTECT, null=True)
    definition_key = models.CharField(max_length=80, blank=True)
    origin = models.CharField("motif d'ajout", max_length=300, blank=True)
    title = models.CharField(max_length=200)
    goal = models.TextField(blank=True)
    explanation = models.TextField(blank=True)
    steps = models.JSONField(default=list)
    prerequisites = models.JSONField(default=list)  # clés d'autres démarches du modèle
    position = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=10, choices=list(ACTION_STATUSES.items()), default="a_faire"
    )
    blocked_reason = models.TextField(blank=True)
    result_text = models.TextField("résultat", blank=True)
    result_date = models.DateField(null=True, blank=True)
    result_outcome = models.CharField(
        "issue du résultat", max_length=12, choices=list(RESULT_OUTCOMES.items()), blank=True
    )
    due_date = models.DateField("échéance", null=True, blank=True)
    created_at_context_version = models.PositiveIntegerField(default=0)
    row_version = models.PositiveIntegerField(default=1)
    client_request_id = models.UUIDField(null=True, blank=True, editable=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "démarche"
        ordering = ["position", "id"]
        constraints = [
            models.CheckConstraint(
                condition=~Q(status="terminee")
                | (~Q(result_text="") & Q(result_date__isnull=False)),
                name="action_done_has_result",
            ),
            models.CheckConstraint(
                condition=~Q(status="bloquee") | ~Q(blocked_reason=""),
                name="action_blocked_has_reason",
            ),
            models.UniqueConstraint(
                fields=["campaign", "definition_key"],
                condition=~Q(definition_key=""),
                name="action_unique_definition",
            ),
            models.UniqueConstraint(
                fields=["campaign", "client_request_id"], name="action_unique_request"
            ),
        ]

    def __str__(self):
        return self.title


class ActionEvent(models.Model):
    """Historique en ajout seul des démarches : création et chaque changement d'état."""

    action = models.ForeignKey(Action, on_delete=models.CASCADE, related_name="events")
    plan_version = models.PositiveIntegerField()
    from_status = models.CharField(max_length=10, blank=True)
    to_status = models.CharField(max_length=10)
    blocked_reason = models.TextField(blank=True)
    result_text = models.TextField(blank=True)
    result_date = models.DateField(null=True, blank=True)
    result_outcome = models.CharField(max_length=12, blank=True)
    note = models.TextField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "évènement de démarche"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.action} : {self.from_status or '∅'} → {self.to_status}"
