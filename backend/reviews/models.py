"""Relecture, échanges et décisions rattachés à un dossier.

- Un avis est immuable : il garde les versions examinées et un instantané du périmètre.
- Un avis devient « à réexaminer » (calculé) dès qu'une section relue change de version.
- Une demande, un commentaire, un avis ou une décision ne sont jamais effacés.
"""

from django.conf import settings
from django.db import models
from django.db.models import Q

from dossiers.models import Campaign

SECTIONS = {
    "contexte": "Contexte du projet",
    "plan": "Plan d'action",
    "budget": "Budget provisoire",
}
VERDICTS = {
    "sans_reserve": "Revu sans réserve sur le périmètre examiné",
    "avec_reserves": "Revu avec réserves",
}
DECISIONS = {"poursuivre": "Poursuivre", "modifier": "Modifier le projet", "differer": "Différer"}
COMMENT_KINDS = {"question": "Question", "commentaire": "Commentaire", "reponse": "Réponse"}
TARGETS = {
    "dossier": "Dossier",
    "information": "Information",
    "demarche": "Démarche",
    "poste": "Poste",
}


class ReviewRequest(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="review_requests")
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    note = models.TextField(blank=True, max_length=2000)
    versions = models.JSONField()
    client_request_id = models.UUIDField(null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "demande de relecture"
        ordering = ["-created_at", "-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "client_request_id"], name="review_request_unique_request"
            ),
        ]

    def __str__(self):
        return f"Demande {self.campaign} ({self.created_at:%d/%m/%Y})"


class Review(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="reviews")
    advisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    scope = models.JSONField()  # sous-ensemble non vide de SECTIONS
    versions = models.JSONField()  # versions des sections au moment de l'avis
    verdict = models.CharField(max_length=20, choices=list(VERDICTS.items()))
    opinion = models.TextField("avis")
    reservations = models.TextField("réserves", blank=True)
    snapshot = models.JSONField()  # contenu exact du périmètre examiné
    client_request_id = models.UUIDField(null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "avis du conseiller"
        verbose_name_plural = "avis du conseiller"
        ordering = ["-created_at", "-id"]
        constraints = [
            models.CheckConstraint(condition=~Q(opinion=""), name="review_has_opinion"),
            models.CheckConstraint(
                condition=~Q(verdict="avec_reserves") | ~Q(reservations=""),
                name="review_reserves_written",
            ),
            models.UniqueConstraint(
                fields=["campaign", "client_request_id"], name="review_unique_request"
            ),
        ]

    def __str__(self):
        return f"Avis {self.advisor} sur {self.campaign}"


class Comment(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    kind = models.CharField(max_length=12, choices=list(COMMENT_KINDS.items()))
    target_type = models.CharField(max_length=12, choices=list(TARGETS.items()), default="dossier")
    target_ref = models.CharField(max_length=80, blank=True)
    target_label = models.CharField(max_length=200, blank=True)  # libellé au moment du message
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, related_name="replies")
    body = models.TextField(max_length=4000)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, related_name="+"
    )
    client_request_id = models.UUIDField(null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "message"
        ordering = ["created_at", "id"]
        constraints = [
            models.CheckConstraint(condition=~Q(body=""), name="comment_has_body"),
            models.CheckConstraint(
                condition=Q(parent__isnull=True) | Q(kind="reponse"), name="comment_reply_kind"
            ),
            models.UniqueConstraint(
                fields=["campaign", "client_request_id"], name="comment_unique_request"
            ),
        ]

    def __str__(self):
        return f"{self.get_kind_display()} de {self.author}"


class Decision(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="decisions")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    choice = models.CharField(max_length=12, choices=list(DECISIONS.items()))
    reason = models.TextField("motifs")
    versions = models.JSONField()
    client_request_id = models.UUIDField(null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "décision"
        ordering = ["-created_at", "-id"]
        constraints = [
            models.CheckConstraint(condition=~Q(reason=""), name="decision_has_reason"),
            models.UniqueConstraint(
                fields=["campaign", "client_request_id"], name="decision_unique_request"
            ),
        ]

    def __str__(self):
        return f"{self.get_choice_display()} — {self.campaign}"
