/**
 * Registre des informations, recopié de backend/dossiers/facts.py pour le prototype seulement
 * (l'application réelle le reçoit de l'API). Mêmes clés, libellés, champs et choix.
 * Les « sujets » sont une proposition de présentation UX1 : ils regroupent des informations
 * existantes, sans nouvelle donnée.
 */

export type Profile = 'debutant' | 'producteur'
export type FieldKind = 'choice' | 'text' | 'longtext' | 'integer' | 'decimal' | 'month'
export type FieldDef = {
  name: string
  label: string
  kind: FieldKind
  required?: boolean
  choices?: [string, string][]
  unit?: string
}
export type FactDef = {
  key: string
  label: string
  labelProducteur?: string
  why: string
  fields: FieldDef[]
  profiles?: Profile[]
}

export const REGIONS = [
  'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda',
  'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor',
]

export const FACTS: FactDef[] = [
  {
    key: 'localisation',
    label: 'Localisation du terrain',
    why: 'Les démarches, les contacts utiles et les conditions locales dépendent du lieu.',
    fields: [
      { name: 'region', label: 'Région', kind: 'choice', required: true, choices: REGIONS.map((r) => [r, r]) },
      { name: 'lieu', label: 'Commune, village ou quartier', kind: 'text' },
    ],
  },
  {
    key: 'acces_terrain',
    label: 'Accès au terrain',
    why: "Sans accès confirmé au terrain, les autres préparatifs risquent d'être perdus.",
    fields: [
      {
        name: 'situation', label: 'Situation', kind: 'choice', required: true, choices: [
          ['detenu', 'Terrain à moi ou à ma famille'],
          ['accord', 'Accord obtenu (location, prêt ou autre)'],
          ['en_discussion', 'En discussion'],
          ['aucun', 'Pas encore de terrain identifié'],
        ],
      },
      { name: 'surface', label: 'Surface', kind: 'decimal' },
      { name: 'surface_unite', label: 'Unité de surface', kind: 'choice', choices: [['m2', 'm²'], ['ha', 'hectares']] },
      { name: 'precisions', label: "Précisions (durée de l'accord, conditions…)", kind: 'text' },
    ],
  },
  {
    key: 'eau',
    label: "Accès à l'eau",
    why: "La disponibilité de l'eau pendant toute la période envisagée conditionne la suite du projet.",
    fields: [
      {
        name: 'source', label: 'Source principale', kind: 'choice', required: true, choices: [
          ['forage', 'Forage'],
          ['puits', 'Puits'],
          ['reseau', 'Réseau (robinet)'],
          ['cours_eau', "Fleuve, marigot ou cours d'eau"],
          ['bassin', 'Bassin ou retenue'],
          ['pluie', 'Pluie seulement'],
          ['aucune', 'Aucune source identifiée'],
        ],
      },
      { name: 'precisions', label: 'Précisions (distance, partage, coût, saisons sans eau…)', kind: 'text' },
    ],
  },
  {
    key: 'culture',
    label: 'Culture envisagée',
    why: 'Les besoins, le calendrier et le budget en dépendent. AGRIA ne recommande pas de culture : ce choix mérite d’être relu avec un conseiller.',
    fields: [{ name: 'nom', label: 'Culture', kind: 'text', required: true }],
  },
  {
    key: 'periode',
    label: 'Période envisagée',
    why: "La période fixe l'ordre et l'échéance des démarches de préparation.",
    fields: [
      { name: 'debut', label: 'Début (mois)', kind: 'month', required: true },
      { name: 'fin', label: 'Fin (mois)', kind: 'month' },
    ],
  },
  {
    key: 'temps_disponible',
    label: 'Temps disponible',
    why: "Le temps de travail disponible limite ce qu'il est possible de mener.",
    fields: [{ name: 'heures_semaine', label: 'Heures par semaine', kind: 'decimal', required: true, unit: 'h/semaine' }],
  },
  {
    key: 'main_oeuvre',
    label: "Main-d'œuvre",
    why: "Savoir qui travaillera, et quand, permet d'organiser les tâches et leur coût.",
    fields: [{ name: 'description', label: 'Qui travaillera avec vous ?', kind: 'longtext', required: true }],
  },
  {
    key: 'materiel',
    label: 'Matériel',
    why: 'Le matériel déjà disponible évite des achats ; celui qui manque entre au budget.',
    fields: [{ name: 'description', label: 'Matériel disponible et matériel manquant', kind: 'longtext', required: true }],
  },
  {
    key: 'apport',
    label: 'Somme disponible pour le projet',
    why: 'Permet de rapprocher le budget provisoire de vos moyens, sans en tirer de garantie.',
    fields: [{ name: 'montant', label: 'Montant', kind: 'integer', required: true, unit: 'FCFA' }],
  },
  {
    key: 'debouches',
    label: 'Débouchés envisagés',
    why: "Identifier à l'avance à qui vendre permet de vérifier qu'une vente est possible.",
    fields: [{ name: 'description', label: 'À qui pensez-vous vendre, où et comment ?', kind: 'longtext', required: true }],
  },
  {
    key: 'experience',
    label: 'Vos connaissances agricoles',
    labelProducteur: 'Vos campagnes précédentes',
    why: 'Elle aide votre conseiller à adapter ses explications. Les points à vérifier restent les mêmes pour tous.',
    fields: [{ name: 'description', label: 'Décrivez votre expérience et les difficultés rencontrées', kind: 'longtext', required: true }],
  },
  {
    key: 'changements',
    label: 'Changements envisagés',
    why: 'Ce qui change par rapport aux campagnes précédentes mérite une attention particulière.',
    fields: [{ name: 'description', label: "Qu'allez-vous faire différemment cette fois ?", kind: 'longtext', required: true }],
    profiles: ['producteur'],
  },
]

export const FACT_BY_KEY = Object.fromEntries(FACTS.map((f) => [f.key, f])) as Record<string, FactDef>

export function factsFor(profile: Profile): FactDef[] {
  return FACTS.filter((f) => !f.profiles || f.profiles.includes(profile))
}

export function factLabel(key: string, profile: Profile): string {
  const def = FACT_BY_KEY[key]!
  return profile === 'producteur' && def.labelProducteur ? def.labelProducteur : def.label
}

/** Proposition UX1 : le dossier se lit par sujet, chaque sujet réunissant informations, points et démarches. */
export type Subject = { key: string; title: string; facts: string[] }
export const SUBJECTS: Subject[] = [
  { key: 'terrain', title: 'Le lieu et le terrain', facts: ['localisation', 'acces_terrain'] },
  { key: 'eau', title: "L'eau", facts: ['eau'] },
  { key: 'culture', title: 'La culture et la période', facts: ['culture', 'periode'] },
  { key: 'vente', title: 'La vente', facts: ['debouches'] },
  { key: 'moyens', title: 'Vos moyens', facts: ['temps_disponible', 'main_oeuvre', 'materiel', 'apport'] },
  { key: 'experience', title: 'Votre expérience', facts: ['experience', 'changements'] },
]

export function subjectOf(factKey: string): Subject {
  return SUBJECTS.find((s) => s.facts.includes(factKey))!
}

/** Libellés de présentation des états existants (mêmes valeurs que l'API). */
export type Status = 'non_renseigne' | 'inconnu' | 'declare' | 'estime' | 'verifie'
export const HOW_KNOWN: Record<Status, string> = {
  non_renseigne: 'Pas encore abordé',
  inconnu: 'Je ne sais pas encore',
  declare: 'Vous l’affirmez',
  estime: 'Estimation',
  verifie: 'Confirmé, source indiquée',
}
