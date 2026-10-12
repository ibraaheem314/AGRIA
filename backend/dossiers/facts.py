"""Registre des informations d'un dossier de préparation.

Source unique : le serveur valide les valeurs avec ces définitions et les envoie à
l'interface, qui construit les formulaires à partir d'elles. Les textes « pourquoi »
expliquent l'utilité d'une information ; ce ne sont pas des prescriptions agronomiques.

Une information absente n'a pas de ligne en base (« non renseignée »). « Je ne sais
pas » est un état enregistré (status=inconnu) sans valeur. Aucune valeur par défaut.
"""

from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from decimal import Decimal, InvalidOperation

from rest_framework.exceptions import ValidationError

PROFILES = {
    "debutant": "Débutant avec un projet concret",
    "producteur": "Producteur déjà actif",
}

STATUSES = {
    "inconnu": "Je ne sais pas",
    "declare": "Déclaré",
    "estime": "Estimé",
    "verifie": "Vérifié",
}
STATUS_HELP = {
    "inconnu": "L'information n'est pas connue pour l'instant.",
    "declare": "Vous l'affirmez, sans preuve enregistrée.",
    "estime": "C'est une approximation.",
    "verifie": (
        "Vous indiquez ce qui le confirme (document, visite, personne). AGRIA ne contrôle pas "
        "cette source, et la situation décrite peut rester à régler."
    ),
}

REGIONS = [
    "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda",
    "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor",
]  # fmt: skip


@dataclass(frozen=True)
class Field:
    name: str
    label: str
    kind: str  # choice | text | longtext | integer | decimal | month
    required: bool = False
    choices: tuple[tuple[str, str], ...] = ()
    unit: str | None = None
    minimum: float | None = None
    maximum: float | None = None
    max_length: int = 2000
    help: str = ""


@dataclass(frozen=True)
class FactDefinition:
    key: str
    section: str
    label: str
    why: str
    fields: tuple[Field, ...]
    profiles: tuple[str, ...] = ("debutant", "producteur")
    label_by_profile: dict[str, str] = field(default_factory=dict)

    def label_for(self, profile: str) -> str:
        return self.label_by_profile.get(profile, self.label)

    def as_dict(self, profile: str) -> dict:
        data = asdict(self)
        data["label"] = self.label_for(profile)
        data.pop("label_by_profile")
        data["fields"] = [
            {**asdict(f), "choices": [{"value": v, "label": lab} for v, lab in f.choices]}
            for f in self.fields
        ]
        return data


SECTIONS = {
    "lieu": "Le lieu",
    "projet": "Le projet",
    "moyens": "Vos moyens",
    "vente": "La vente",
    "experience": "Votre expérience",
}

DEFINITIONS: tuple[FactDefinition, ...] = (
    FactDefinition(
        key="localisation",
        section="lieu",
        label="Localisation du terrain",
        why="Les démarches, les contacts utiles et les conditions locales dépendent du lieu.",
        fields=(
            Field("region", "Région", "choice", required=True,
                  choices=tuple((r, r) for r in REGIONS)),
            Field("lieu", "Commune, village ou quartier", "text", max_length=120),
        ),
    ),
    FactDefinition(
        key="acces_terrain",
        section="lieu",
        label="Accès au terrain",
        why="Sans accès confirmé au terrain, les autres préparatifs risquent d'être perdus.",
        fields=(
            Field("situation", "Situation", "choice", required=True, choices=(
                ("detenu", "Terrain à moi ou à ma famille"),
                ("accord", "Accord obtenu (location, prêt ou autre)"),
                ("en_discussion", "En discussion"),
                ("aucun", "Pas encore de terrain identifié"),
            )),
            Field("surface", "Surface", "decimal", minimum=0, maximum=100000),
            Field("surface_unite", "Unité de surface", "choice",
                  choices=(("m2", "m²"), ("ha", "hectares"))),
            Field("precisions", "Précisions (durée de l'accord, conditions…)", "text",
                  max_length=300),
        ),
    ),
    FactDefinition(
        key="eau",
        section="lieu",
        label="Accès à l'eau",
        why=(
            "La disponibilité de l'eau pendant toute la période envisagée conditionne la "
            "suite du projet."
        ),
        fields=(
            Field("source", "Source principale", "choice", required=True, choices=(
                ("forage", "Forage"),
                ("puits", "Puits"),
                ("reseau", "Réseau (robinet)"),
                ("cours_eau", "Fleuve, marigot ou cours d'eau"),
                ("bassin", "Bassin ou retenue"),
                ("pluie", "Pluie seulement"),
                ("aucune", "Aucune source identifiée"),
            )),
            Field("precisions", "Précisions (distance, partage, coût, saisons sans eau…)",
                  "text", max_length=300),
        ),
    ),
    FactDefinition(
        key="culture",
        section="projet",
        label="Culture envisagée",
        why=(
            "Les besoins, le calendrier et le budget en dépendent. AGRIA ne recommande pas "
            "de culture : ce choix mérite d'être relu avec un conseiller."
        ),
        fields=(Field("nom", "Culture", "text", required=True, max_length=120),),
    ),
    FactDefinition(
        key="periode",
        section="projet",
        label="Période envisagée",
        why="La période fixe l'ordre et l'échéance des démarches de préparation.",
        fields=(
            Field("debut", "Début (mois)", "month", required=True),
            Field("fin", "Fin (mois)", "month"),
        ),
    ),
    FactDefinition(
        key="temps_disponible",
        section="moyens",
        label="Temps disponible",
        why="Le temps de travail disponible limite ce qu'il est possible de mener.",
        fields=(
            Field("heures_semaine", "Heures par semaine", "decimal", required=True,
                  minimum=0, maximum=168, unit="h/semaine"),
        ),
    ),
    FactDefinition(
        key="main_oeuvre",
        section="moyens",
        label="Main-d'œuvre",
        why="Savoir qui travaillera, et quand, permet d'organiser les tâches et leur coût.",
        fields=(Field("description", "Qui travaillera avec vous ?", "longtext", required=True),),
    ),
    FactDefinition(
        key="materiel",
        section="moyens",
        label="Matériel",
        why="Le matériel déjà disponible évite des achats ; celui qui manque entre au budget.",
        fields=(
            Field("description", "Matériel disponible et matériel manquant", "longtext",
                  required=True),
        ),
    ),
    FactDefinition(
        key="apport",
        section="moyens",
        label="Somme disponible pour le projet",
        why="Permet de rapprocher le budget provisoire de vos moyens, sans en tirer de garantie.",
        fields=(
            Field("montant", "Montant", "integer", required=True, minimum=0,
                  maximum=10_000_000_000, unit="FCFA"),
        ),
    ),
    FactDefinition(
        key="debouches",
        section="vente",
        label="Débouchés envisagés",
        why="Identifier à l'avance à qui vendre permet de vérifier qu'une vente est possible.",
        fields=(
            Field("description", "À qui pensez-vous vendre, où et comment ?", "longtext",
                  required=True),
        ),
    ),
    FactDefinition(
        key="experience",
        section="experience",
        label="Expérience",
        label_by_profile={
            "debutant": "Vos connaissances agricoles",
            "producteur": "Vos campagnes précédentes",
        },
        why=(
            "Elle aide votre conseiller à adapter ses explications. Les points à vérifier restent "
            "les mêmes pour tous."
        ),
        fields=(
            Field("description", "Décrivez votre expérience et les difficultés rencontrées",
                  "longtext", required=True),
        ),
    ),
    FactDefinition(
        key="changements",
        section="experience",
        label="Changements envisagés",
        profiles=("producteur",),
        why="Ce qui change par rapport aux campagnes précédentes mérite une attention particulière.",  # noqa: E501
        fields=(
            Field("description", "Qu'allez-vous faire différemment cette fois ?", "longtext",
                  required=True),
        ),
    ),
)  # fmt: skip

BY_KEY = {d.key: d for d in DEFINITIONS}
MONTH_RE = re.compile(r"^(\d{4})-(\d{2})$")


def definitions_for(profile: str) -> list[FactDefinition]:
    return [d for d in DEFINITIONS if profile in d.profiles]


def _clean_field(f: Field, raw) -> object:
    if f.kind in {"text", "longtext"}:
        if not isinstance(raw, str):
            raise ValueError("Texte attendu.")
        value = raw.strip()
        if len(value) > f.max_length:
            raise ValueError(f"{f.max_length} caractères au maximum.")
        return value or None
    if f.kind == "choice":
        allowed = {v for v, _ in f.choices}
        if raw not in allowed:
            raise ValueError("Choix invalide.")
        return raw
    if f.kind in {"integer", "decimal"}:
        try:
            number = Decimal(str(raw).replace(",", ".").replace(" ", "").replace(" ", ""))
        except InvalidOperation:
            raise ValueError("Nombre attendu.") from None
        if not number.is_finite():
            raise ValueError("Nombre attendu.")
        if f.kind == "integer" and number != number.to_integral_value():
            raise ValueError("Nombre entier attendu.")
        if f.minimum is not None and number < Decimal(str(f.minimum)):
            raise ValueError(f"Doit être au moins {f.minimum:g}.")
        if f.maximum is not None and number > Decimal(str(f.maximum)):
            raise ValueError(f"Doit être au plus {f.maximum:g}.")
        if f.kind == "integer":
            return int(number)
        # Décimal stocké en texte pour ne jamais passer par un flottant.
        return format(number.normalize(), "f")
    if f.kind == "month":
        match = MONTH_RE.match(str(raw))
        if (
            not match
            or not (2000 <= int(match.group(1)) <= 2100)
            or not (1 <= int(match.group(2)) <= 12)
        ):
            raise ValueError("Mois attendu au format AAAA-MM.")
        return raw
    raise ValueError("Type de champ inconnu.")  # pragma: no cover


def clean_value(definition: FactDefinition, status: str, value) -> dict | None:
    """Valide une valeur. Lève ValidationError({"value": {champ: message}})."""
    if status == "inconnu":
        if value not in (None, {}):
            raise ValidationError({"value": "« Je ne sais pas » ne s'accompagne d'aucune valeur."})
        return None
    if not isinstance(value, dict):
        raise ValidationError({"value": "Valeur attendue."})
    known = {f.name: f for f in definition.fields}
    unknown = set(value) - set(known)
    if unknown:
        raise ValidationError({"value": f"Champs inconnus : {', '.join(sorted(unknown))}."})
    cleaned: dict = {}
    errors: dict = {}
    for name, f in known.items():
        raw = value.get(name)
        if raw is None or (isinstance(raw, str) and not raw.strip()):
            if f.required:
                errors[name] = "Information requise (ou choisissez « Je ne sais pas »)."
            continue
        try:
            cleaned_value = _clean_field(f, raw)
        except ValueError as exc:
            errors[name] = str(exc)
            continue
        if cleaned_value is not None:
            cleaned[name] = cleaned_value
    if not errors:
        errors.update(_cross_checks(definition.key, cleaned))
    if errors:
        raise ValidationError({"value": errors})
    if not cleaned:
        raise ValidationError({"value": "Aucune information saisie."})
    return cleaned


def _cross_checks(key: str, value: dict) -> dict:
    errors = {}
    if key == "acces_terrain" and ("surface" in value) != ("surface_unite" in value):
        errors["surface_unite"] = "Indiquez la surface et son unité ensemble."
    if key == "periode" and value.get("fin") and value["fin"] < value["debut"]:
        errors["fin"] = "La fin ne peut pas précéder le début."
    return errors
