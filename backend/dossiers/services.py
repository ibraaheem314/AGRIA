"""Opérations d'écriture sur les dossiers. Un seul chemin d'écriture par objet."""

from django.db import transaction
from rest_framework.exceptions import ValidationError

from agria.errors import Conflict
from dossiers import facts
from dossiers.models import Campaign, Fact, FactRevision, Project
from preparation import services as preparation


@transaction.atomic
def create_project(*, owner, name, profile, campaign_label, request_id) -> tuple[Project, bool]:
    """Crée le projet et sa première campagne ensemble. Rejouer la même requête ne crée rien.

    Retourne (projet, créé).
    """
    if request_id:
        existing = Project.objects.filter(owner=owner, client_request_id=request_id).first()
        if existing:
            return existing, False
    project = Project.objects.create(
        owner=owner, name=name, profile=profile, client_request_id=request_id
    )
    campaign = Campaign.objects.create(project=project, label=campaign_label)
    preparation.sync_plan(campaign, owner)
    return project, True


# Informations du lieu qu'un producteur peut reprendre d'une campagne à l'autre, à revérifier.
REUSABLE_KEYS = ("localisation", "acces_terrain", "eau")
REUSED_STATUS = {
    "verifie": "declare",
    "declare": "declare",
    "estime": "estime",
    "inconnu": "inconnu",
}


@transaction.atomic
def create_campaign(*, project, label, request_id, copy_from=None, author=None):
    """Nouvelle campagne d'un projet. Rejouer la même requête ne crée rien.

    `copy_from` (campagne du même projet) : reprend seulement les informations du lieu,
    comme point de départ à revérifier. Une information vérifiée redevient « déclarée » ;
    démarches, budget et résultats ne sont jamais recopiés.
    """
    if request_id:
        existing = Campaign.objects.filter(project=project, client_request_id=request_id).first()
        if existing:
            return existing, False
    campaign = Campaign.objects.create(project=project, label=label, client_request_id=request_id)
    if copy_from is not None:
        for fact in copy_from.facts.filter(key__in=REUSABLE_KEYS):
            origin = (
                f"Repris de la campagne « {copy_from.label} » où l'information était "
                f"« {facts.STATUSES[fact.status].lower()} » : à revérifier pour cette campagne."
            )
            if fact.source:
                origin = f"{origin} Source d'origine : {fact.source}"
            save_fact(
                campaign=campaign,
                key=fact.key,
                status=REUSED_STATUS[fact.status],
                value=fact.value,
                source=origin[:1000],
                expected_version=0,
                author=author or project.owner,
            )
    preparation.sync_plan(campaign, author or project.owner)
    return campaign, True


SOURCE_REQUIRED = "Indiquez comment l'information a été vérifiée (document, visite, personne)."


def _same_state(fact: Fact, status, value, source) -> bool:
    return fact.status == status and fact.value == value and fact.source == source


def save_fact(
    *, campaign: Campaign, key: str, status: str, value, source: str, expected_version, author
) -> tuple[Fact, bool]:
    """Enregistre une information avec contrôle de concurrence optimiste.

    `campaign` doit avoir été verrouillée (select_for_update) par l'appelant.
    `expected_version` : row_version lue par le client (0 si l'information n'existait pas).
    - Version différente et contenu identique : reprise d'un envoi déjà enregistré -> succès,
      aucune nouvelle révision.
    - Version différente et contenu différent : conflit explicite (409).
    Retourne (information, modifiée).
    """
    definition = facts.BY_KEY[key]
    if campaign.project.profile not in definition.profiles:
        raise Conflict("Cette information ne concerne pas ce profil de projet.")
    cleaned = facts.clean_value(definition, status, value)
    source = (source or "").strip()
    if status == "verifie" and not source:
        raise ValidationError({"source": SOURCE_REQUIRED})
    if len(source) > 1000:
        raise ValidationError({"source": "1000 caractères au maximum."})

    fact = Fact.objects.filter(campaign=campaign, key=key).first()
    current_version = fact.row_version if fact else 0
    if expected_version != current_version:
        if fact and _same_state(fact, status, cleaned, source):
            return fact, False
        raise Conflict(
            "Cette information a été modifiée entre-temps (autre appareil ou autre onglet). "
            "Rechargez-la avant de réessayer."
        )
    if fact and _same_state(fact, status, cleaned, source):
        return fact, False

    campaign.context_version += 1
    campaign.save(update_fields=["context_version", "updated_at"])
    if fact is None:
        fact = Fact(campaign=campaign, key=key, row_version=1)
    else:
        fact.row_version += 1
    fact.status, fact.value, fact.source, fact.updated_by = status, cleaned, source, author
    fact.save()
    FactRevision.objects.create(
        campaign=campaign,
        key=key,
        status=status,
        value=cleaned,
        source=source,
        context_version=campaign.context_version,
        author=author,
    )
    # Les points à vérifier ont pu changer : ajoute les démarches nouvellement nécessaires
    # (aucune démarche existante n'est modifiée ni supprimée).
    preparation.sync_plan(campaign, author)
    return fact, True
