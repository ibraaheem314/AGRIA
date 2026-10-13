import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/*
 * Démonstration du suivi de campagne : données FICTIVES, gardées dans ce navigateur sous une clé
 * distincte de celle du prototype UX1 (rien n'est envoyé, aucune base n'est écrite).
 * Les « fenêtres » du plan viennent d'une fiche d'exemple non relue : elles illustrent le
 * mécanisme (recalage sur les dates réelles), pas une consigne applicable au champ.
 */

const KEY = 'agria.demo.suivi.v1'

/** Date du jour fixée par le scénario (tout est fictif, y compris le calendrier). */
export const TODAY = '2026-10-13'

export type Op = 'semis' | 'repiquage' | 'desherbage' | 'arrosage' | 'apport' | 'traitement' | 'retrait' | 'autre'
export const OP_LABEL: Record<Op, string> = {
  semis: 'Semis en pépinière',
  repiquage: 'Repiquage',
  desherbage: 'Désherbage',
  arrosage: 'Arrosage',
  apport: 'Apport (fumure ou engrais)',
  traitement: 'Traitement',
  retrait: 'Retrait de feuilles ou de plants',
  autre: 'Autre action',
}

export type Stage = 'reprise' | 'feuillage' | 'formation' | 'maturite'
export const STAGE_LABEL: Record<Stage, string> = {
  reprise: 'Reprise après repiquage',
  feuillage: 'Croissance du feuillage',
  formation: 'Formation de la partie récoltée',
  maturite: 'Prêt à récolter',
}
/** Semaines après repiquage à partir desquelles la fiche d'exemple situe chaque stade (fictif). */
const STAGE_FROM_WEEK: Record<Stage, number> = { reprise: 0, feuillage: 2, formation: 8, maturite: 14 }

export type Entry = {
  id: string
  /** Réalisé (opération déclarée faite) ou observé (constat déclaré). */
  kind: 'realise' | 'observe'
  date: string
  op?: Op
  stage?: Stage
  title: string
  details: string[]
  problemId?: string
  photo?: boolean
  /** Enregistrée dans le journal après confirmation explicite. */
  recordedOn: string
}

export type Problem = {
  id: string
  openedOn: string
  summary: string
  status: 'ouvert' | 'clos'
  followUpOn: string | null
  closedReason?: string
}

export type Clarification = { kind: 'stade'; observed: Stage; entryDate: string }

export type DemoState = {
  version: 1
  transplant: string
  /** Corrections de la date de repiquage : l'historique reste visible. */
  transplantHistory: { from: string; to: string; reason: string; on: string }[]
  entries: Entry[]
  problems: Problem[]
  /** Contradiction en attente : rien n'est tranché automatiquement. */
  clarification: Clarification | null
}

const INITIAL: DemoState = {
  version: 1,
  transplant: '2026-09-15',
  transplantHistory: [],
  entries: [
    { id: 'e1', kind: 'realise', date: '2026-08-01', op: 'semis', title: 'Semis en pépinière', details: ['Déclaré par Ndèye'], recordedOn: '2026-08-01' },
    { id: 'e2', kind: 'realise', date: '2026-09-15', op: 'repiquage', title: 'Repiquage', details: ['Plus tard que la fenêtre de la fiche', 'Raison déclarée : pompe du puits en panne'], recordedOn: '2026-09-15' },
    { id: 'e3', kind: 'realise', date: '2026-09-30', op: 'desherbage', title: 'Désherbage', details: [], recordedOn: '2026-09-30' },
    { id: 'e4', kind: 'observe', date: '2026-10-05', stage: 'feuillage', title: 'Observation de la culture', details: ['Plants repris, feuillage vert'], recordedOn: '2026-10-05' },
    { id: 'e5', kind: 'realise', date: '2026-10-08', op: 'arrosage', title: 'Arrosage', details: ['Dernier arrosage déclaré'], recordedOn: '2026-10-08' },
  ],
  problems: [],
  clarification: null,
}

// ---- Dates (chaînes AAAA-MM-JJ, sans fuseau) -------------------------------------------------

const DAY = 86_400_000
const toTime = (d: string) => Date.UTC(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10)))
export const daysBetween = (a: string, b: string) => Math.round((toTime(b) - toTime(a)) / DAY)
export const addDays = (d: string, n: number) => new Date(toTime(d) + n * DAY).toISOString().slice(0, 10)
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
export const formatDay = (d: string) => `${Number(d.slice(8, 10))} ${MONTHS[Number(d.slice(5, 7)) - 1]}`

// ---- Plan (prévu) : fiche d'exemple non relue, recalée sur la date réelle de repiquage --------

export type Planned = {
  key: string
  title: string
  op?: Op
  /** Fenêtre en jours après repiquage (exemple fictif). */
  window: [number, number]
  note?: string
}
const FICHE: Planned[] = [
  { key: 'desherbage-1', title: 'Premier désherbage', op: 'desherbage', window: [10, 21] },
  { key: 'observation', title: 'Observer feuilles et plants', window: [21, 35], note: 'Repère du suivi : une observation au moins dans cette période' },
  { key: 'apport', title: 'Apport prévu par la fiche', op: 'apport', window: [25, 40], note: 'Contenu non détaillé dans la démonstration : aucune dose' },
  { key: 'desherbage-2', title: 'Second désherbage', op: 'desherbage', window: [35, 50] },
]
/** Fenêtre de repiquage de la fiche, en jours après le semis en pépinière (exemple). */
export const TRANSPLANT_WINDOW: [number, number] = [31, 40]

export type PlanLine = Planned & {
  from: string
  to: string
  /** Opération réalisée correspondante, si elle a été déclarée. */
  done?: Entry
  state: 'a_venir' | 'en_cours' | 'passee'
}

export function plan(s: DemoState): PlanLine[] {
  return FICHE.map((p) => {
    const from = addDays(s.transplant, p.window[0])
    const to = addDays(s.transplant, p.window[1])
    const done = p.op
      ? s.entries.find((e) => e.kind === 'realise' && e.op === p.op && daysBetween(addDays(from, -7), e.date) >= 0 && daysBetween(e.date, addDays(to, 7)) >= 0)
      : s.entries.find((e) => e.kind === 'observe' && daysBetween(from, e.date) >= 0 && daysBetween(e.date, to) >= 0)
    const state = daysBetween(TODAY, from) > 0 ? 'a_venir' : daysBetween(to, TODAY) > 0 ? 'passee' : 'en_cours'
    return { ...p, from, to, done, state }
  })
}

/** Stade estimé d'après la date de repiquage seulement (jamais présenté comme observé). */
export function estimatedStage(s: DemoState): { weeks: number; stage: Stage } {
  const weeks = Math.floor(daysBetween(s.transplant, TODAY) / 7)
  const stage = (Object.keys(STAGE_FROM_WEEK) as Stage[]).filter((k) => weeks >= STAGE_FROM_WEEK[k]).pop() ?? 'reprise'
  return { weeks, stage }
}
/** Un stade observé est-il compatible avec l'estimation ? (écart de plus d'un stade = à clarifier) */
export function contradicts(s: DemoState, observed: Stage): boolean {
  const order: Stage[] = ['reprise', 'feuillage', 'formation', 'maturite']
  return Math.abs(order.indexOf(observed) - order.indexOf(estimatedStage(s).stage)) > 1
}

export function lastObservation(s: DemoState): Entry | undefined {
  return [...s.entries].filter((e) => e.kind === 'observe').sort((a, b) => a.date.localeCompare(b.date)).pop()
}
export function lastOp(s: DemoState, op: Op): Entry | undefined {
  return [...s.entries].filter((e) => e.kind === 'realise' && e.op === op).sort((a, b) => a.date.localeCompare(b.date)).pop()
}

// ---- Magasin -----------------------------------------------------------------------------------

function load(): DemoState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      if (parsed.version === 1) return parsed
    }
  } catch {
    /* stockage indisponible : la démonstration repart du scénario */
  }
  return structuredClone(INITIAL)
}

type Ops = {
  /** Ajoute une entrée confirmée au journal. */
  record: (e: Omit<Entry, 'id' | 'recordedOn'>) => string
  openProblem: (summary: string, date: string) => string
  setFollowUp: (problemId: string, date: string) => void
  closeProblem: (problemId: string, reason: string) => void
  correctTransplant: (to: string, reason: string) => void
  askClarification: (c: Clarification | null) => void
  reset: () => void
}

const Ctx = createContext<{ state: DemoState; ops: Ops } | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(load)
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* sans conséquence : la démonstration fonctionne sans stockage */
    }
  }, [state])
  const id = () => Math.random().toString(36).slice(2, 9)
  const ops: Ops = {
    record: (e) => {
      const newId = id()
      setState((s) => ({ ...s, entries: [...s.entries, { ...e, id: newId, recordedOn: TODAY }] }))
      return newId
    },
    openProblem: (summary, date) => {
      const newId = id()
      setState((s) => ({ ...s, problems: [...s.problems, { id: newId, openedOn: date, summary, status: 'ouvert', followUpOn: null }] }))
      return newId
    },
    setFollowUp: (problemId, date) =>
      setState((s) => ({ ...s, problems: s.problems.map((p) => (p.id === problemId ? { ...p, followUpOn: date } : p)) })),
    closeProblem: (problemId, reason) =>
      setState((s) => ({ ...s, problems: s.problems.map((p) => (p.id === problemId ? { ...p, status: 'clos', closedReason: reason } : p)) })),
    correctTransplant: (to, reason) =>
      setState((s) => ({
        ...s,
        transplant: to,
        transplantHistory: [...s.transplantHistory, { from: s.transplant, to, reason, on: TODAY }],
        // Les opérations déjà déclarées sont conservées telles quelles : seul le prévu est recalé.
        entries: s.entries.map((e) => (e.op === 'repiquage' ? { ...e, date: to, details: [...e.details, `Date corrigée le ${formatDay(TODAY)} (était le ${formatDay(s.transplant)})`] } : e)),
        clarification: null,
      })),
    askClarification: (c) => setState((s) => ({ ...s, clarification: c })),
    reset: () => setState(structuredClone(INITIAL)),
  }
  return <Ctx.Provider value={{ state, ops }}>{children}</Ctx.Provider>
}

export function useDemo() {
  const v = useContext(Ctx)
  if (!v) throw new Error('DemoProvider manquant')
  return v
}
