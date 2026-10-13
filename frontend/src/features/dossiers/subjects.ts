import type { Check } from '../plan/api'
import type { Dossier, FactItem, FactStatus } from './api'
import { describeValue } from './factDisplay'

/**
 * Lecture du dossier par sujet (direction retenue après UX2). Regroupement de présentation
 * seulement : les informations, les points ouverts et les démarches viennent du serveur.
 * Une information que ce regroupement ne connaît pas reste visible, rangée dans « Autres
 * informations ».
 */
export type Subject = { key: string; title: string; facts: FactItem[] }

const GROUPS: { key: string; title: string; facts: string[] }[] = [
  { key: 'terrain', title: 'Le lieu et le terrain', facts: ['localisation', 'acces_terrain'] },
  { key: 'eau', title: 'L’eau', facts: ['eau'] },
  { key: 'culture', title: 'La culture et la période', facts: ['culture', 'periode'] },
  { key: 'vente', title: 'La vente', facts: ['debouches'] },
  { key: 'moyens', title: 'Les moyens', facts: ['temps_disponible', 'main_oeuvre', 'materiel', 'apport'] },
  { key: 'experience', title: 'L’expérience', facts: ['experience', 'changements'] },
]

export function subjectsFor(dossier: Pick<Dossier, 'facts'>): Subject[] {
  const byKey = new Map(dossier.facts.map((f) => [f.key, f]))
  const subjects = GROUPS.map((g) => ({
    key: g.key,
    title: g.title,
    facts: g.facts.map((k) => byKey.get(k)).filter((f): f is FactItem => Boolean(f)),
  })).filter((s) => s.facts.length > 0)
  const known = new Set(GROUPS.flatMap((g) => g.facts))
  const others = dossier.facts.filter((f) => !known.has(f.key))
  if (others.length > 0) subjects.push({ key: 'autres', title: 'Autres informations', facts: others })
  return subjects
}

export function subjectOf(dossier: Pick<Dossier, 'facts'>, factKey: string): Subject | undefined {
  return subjectsFor(dossier).find((s) => s.facts.some((f) => f.key === factKey))
}

export type SubjectState = 'non_aborde' | 'inconnu' | 'ouvert' | 'rien_signale'

/** État d'un sujet, déduit des statuts enregistrés et des points calculés par le serveur. */
export function subjectState(subject: Subject, checks: Check[]): SubjectState {
  const statuses = subject.facts.map((f) => f.state.status)
  const open = openChecks(subject, checks)
  if (statuses.every((s) => s === 'non_renseigne')) return 'non_aborde'
  if (open.length > 0 && statuses.includes('inconnu')) return 'inconnu'
  if (open.length > 0) return 'ouvert'
  if (statuses.includes('non_renseigne')) return 'non_aborde'
  return 'rien_signale'
}

/** Points ouverts d'un sujet, hors simple saisie manquante. */
export function openChecks(subject: Subject, checks: Check[]): Check[] {
  return checks.filter((c) => c.level !== 'a_completer' && subject.facts.some((f) => f.key === c.fact_key))
}

export const SUBJECT_STATE: Record<SubjectState, { label: string; archived: string; tone: 'neutral' | 'warn' | 'info' }> = {
  non_aborde: { label: 'Pas encore abordé', archived: 'Non abordé', tone: 'neutral' },
  inconnu: { label: 'Inconnu pour l’instant', archived: 'Restait inconnu', tone: 'warn' },
  ouvert: { label: 'Point à éclaircir', archived: 'Restait à éclaircir', tone: 'info' },
  rien_signale: { label: 'Rien de signalé', archived: 'Rien de signalé', tone: 'neutral' },
}

/** Les informations des premières questions, dans l'ordre du résumé. */
export const FIRST_KEYS = ['culture', 'periode', 'localisation', 'acces_terrain', 'eau', 'debouches'] as const

/** D'où vient l'information, dit à la personne qui la lit (porteur ou conseiller). */
export function howKnown(status: FactStatus, advisor: boolean): string {
  return (advisor ? HOW_KNOWN_ADVISOR : HOW_KNOWN)[status]
}
const HOW_KNOWN: Record<FactStatus, string> = {
  non_renseigne: 'Pas encore abordé',
  inconnu: 'Je ne sais pas encore',
  declare: 'Déclaré',
  estime: 'Estimé',
  verifie: 'Vérifié (source indiquée)',
}
const HOW_KNOWN_ADVISOR: Record<FactStatus, string> = {
  non_renseigne: 'Pas encore abordé',
  inconnu: 'Inconnu du porteur pour l’instant',
  declare: 'Déclaré par le porteur',
  estime: 'Estimation du porteur',
  verifie: 'Vérifié par le porteur (source indiquée)',
}

/** Une ligne de résumé : les valeurs enregistrées (sans nom de champ), ou ce qui en tient lieu. */
export function shortValue(fact: FactItem, deferred: boolean, advisor = false): string {
  const status = fact.state.status
  if (status === 'non_renseigne') return deferred ? 'à répondre plus tard' : 'pas encore abordé'
  if (status === 'inconnu') return advisor ? 'inconnu du porteur pour l’instant' : 'vous ne savez pas encore'
  return describeValue(fact, fact.state.value, false).join(' · ') || '—'
}
