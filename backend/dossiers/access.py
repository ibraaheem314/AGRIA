"""Règles d'accès aux dossiers, appliquées par le serveur à chaque requête.

- Le propriétaire du projet lit et modifie ses dossiers.
- Un conseiller lit uniquement les dossiers qui lui sont attribués (attribution active),
  et n'y écrit que des commentaires et des avis (pas les données du porteur).
- Personne d'autre : le dossier est traité comme inexistant (404), sans en révéler l'existence.
- Le statut d'administration technique (is_staff) ne donne aucun accès par l'API.
"""

from django.db.models import Q, QuerySet
from rest_framework.exceptions import NotFound, PermissionDenied

from dossiers.models import Campaign, Project


def visible_campaigns(user) -> QuerySet[Campaign]:
    if not user.is_authenticated:
        return Campaign.objects.none()
    return (
        Campaign.objects.filter(
            Q(project__owner=user)
            | Q(assignments__advisor=user, assignments__ended_at__isnull=True)
        )
        .select_related("project", "project__owner")
        .distinct()
    )


def own_projects(user) -> QuerySet[Project]:
    return Project.objects.filter(owner=user)


def campaign_for_read(user, campaign_id: int) -> Campaign:
    campaign = visible_campaigns(user).filter(pk=campaign_id).first()
    if campaign is None:
        raise NotFound("Dossier introuvable.")
    return campaign


def campaign_for_owner_write(user, campaign_id: int, *, lock: bool = False) -> Campaign:
    """Dossier modifiable par son propriétaire. `lock` sérialise les écritures concurrentes."""
    campaign = campaign_for_read(user, campaign_id)
    if campaign.project.owner_id != user.pk:
        raise PermissionDenied("Seul le porteur du projet peut modifier ces informations.")
    if lock:
        campaign = (
            Campaign.objects.select_for_update().select_related("project").get(pk=campaign.pk)
        )
    if campaign.archived_at is not None:
        raise PermissionDenied("Ce dossier est archivé : il n'est plus modifiable.")
    return campaign


def role_on(user, campaign: Campaign) -> str:
    return "porteur" if campaign.project.owner_id == user.pk else "conseiller"
