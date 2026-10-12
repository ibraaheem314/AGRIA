/**
 * Modèle du prototype UX1 : mêmes notions que l'API (informations et états, démarches et issues,
 * postes de budget, échanges, avis versionnés, décisions), tenues en mémoire du navigateur.
 * Les points à vérifier sont recalculés avec le contenu réel de préparation (lecture seule),
 * par une copie du moteur backend/preparation/engine.py : c'est une simulation de présentation.
 */
import content from '../../../../backend/preparation/content/preparation-generique.v1.json'
import { FACT_BY_KEY, factLabel, factsFor, SUBJECTS, type Profile, type Status, type Subject } from './facts'

export type PersonId = 'awa' | 'modou' | 'ndiaye' | 'coumba'
export type Person = { id: PersonId; name: string; role: 'porteur' | 'conseiller'; profile?: Profile }
export const PEOPLE: Record<PersonId, Person> = {
  awa: { id: 'awa', name: 'Awa (fictive)', role: 'porteur', profile: 'debutant' },
  modou: { id: 'modou', name: 'Modou (fictif)', role: 'porteur', profile: 'producteur' },
  ndiaye: { id: 'ndiaye', name: 'Mme Ndiaye (conseillère fictive)', role: 'conseiller' },
  coumba: { id: 'coumba', name: 'Coumba (fictive)', role: 'porteur', profile: 'debutant' },
}

export type Value = Record<string, string>
export type FactState = { status: Status; value: Value | null; source: string; at?: string; by?: PersonId; carried?: boolean }
export type Revision = { key: string; status: Status; value: Value | null; source: string; at: string; by: PersonId }
export type Outcome = 'favorable' | 'defavorable' | 'incertain'
export type ActionStatus = 'a_faire' | 'en_cours' | 'bloquee' | 'terminee'
export type ActionEvent = { at: string; by: PersonId; text: string }
export type Action = {
  id: string
  key: string | null
  title: string
  goal: string
  explanation: string
  steps: string[]
  factKey: string | null
  status: ActionStatus
  blockedReason?: string
  result?: { text: string; outcome: Outcome; date: string }
  events: ActionEvent[]
}
export type PriceStatus = 'connu' | 'estime' | 'manquant'
export type Line = {
  id: string
  label: string
  category: 'campagne' | 'investissement'
  quantity: number | null
  unit: string
  unitPrice: number | null
  priceStatus: PriceStatus
  source: string
  owned: boolean
  example?: boolean
  suggestion?: string
}
export type Target = { type: 'dossier' | 'information' | 'demarche' | 'poste'; ref: string; label: string }
export type Message = { id: string; author: PersonId; kind: 'question' | 'commentaire' | 'reponse'; target: Target; body: string; at: string; replies: Message[]; resolvedAt?: string }
export type Section = 'contexte' | 'plan' | 'budget'
export type Versions = Record<Section, number>
export type Review = { id: string; advisor: PersonId; at: string; scope: Section[]; verdict: 'sans_reserve' | 'avec_reserves'; opinion: string; reservations: string; versions: Versions }
export type Decision = { id: string; choice: 'poursuivre' | 'modifier' | 'differer'; reason: string; at: string; by: PersonId; versions: Versions }
export type Dossier = {
  id: string
  owner: PersonId
  profile: Profile
  idea: string
  projectName: string
  campaign: string
  archivedAt?: string
  previousId?: string
  advisors: { id: PersonId; since: string }[]
  facts: Record<string, FactState>
  history: Revision[]
  deferred: string[]
  actions: Action[]
  budget: Line[]
  threads: Message[]
  requests: { at: string; note: string }[]
  reviews: Review[]
  decisions: Decision[]
  versions: Versions
  createdAt: string
  updatedAt: string
}

export const SECTION_LABEL: Record<Section, string> = { contexte: 'Projet', plan: 'Démarches', budget: 'Budget' }
export const OUTCOME_LABEL: Record<Outcome, string> = { favorable: 'Favorable', defavorable: 'Défavorable', incertain: 'Incertain' }
export const DECISION_LABEL: Record<Decision['choice'], string> = { poursuivre: 'Poursuivre', modifier: 'Modifier le projet', differer: 'Différer' }
export const VERDICT_LABEL: Record<Review['verdict'], string> = {
  sans_reserve: 'Revu sans réserve sur le périmètre examiné',
  avec_reserves: 'Revu avec réserves',
}

// ---- Contenu et moteur (copie du calcul serveur) --------------------------------------------

type Rule = { states?: string[]; value?: Record<string, string[]>; level: Level; blocking?: boolean; message: string; action?: string }
export type Level = 'a_completer' | 'a_clarifier' | 'a_verifier'
type CheckDef = { key: string; fact: string; why: string; rules: Rule[] }
type ActionDef = { key: string; title: string; goal: string; explanation: string; steps: string[]; prerequisites: string[] }

export const CONTENT = content as unknown as {
  title: string
  version: number
  review: { status: string; note: string }
  checks: CheckDef[]
  actions: ActionDef[]
}
export const ACTION_DEF = Object.fromEntries(CONTENT.actions.map((a) => [a.key, a])) as Record<string, ActionDef>

export type Check = { key: string; factKey: string; level: Level; blocking: boolean; message: string; why: string; actionKey: string | null }

function matches(rule: Rule, state: FactState): boolean {
  if (rule.states && !rule.states.includes(state.status)) return false
  if (rule.value) {
    if (!state.value) return false
    for (const [field, allowed] of Object.entries(rule.value)) {
      if (!allowed.includes(state.value[field] ?? '')) return false
    }
  }
  return true
}

export const EMPTY: FactState = { status: 'non_renseigne', value: null, source: '' }

export function computeChecks(d: Pick<Dossier, 'profile' | 'facts'>): Check[] {
  const keys = new Set(factsFor(d.profile).map((f) => f.key))
  const out: Check[] = []
  for (const c of CONTENT.checks) {
    if (!keys.has(c.fact)) continue
    const state = d.facts[c.fact] ?? EMPTY
    const rule = c.rules.find((r) => matches(r, state))
    if (!rule) continue
    out.push({ key: c.key, factKey: c.fact, level: rule.level, blocking: Boolean(rule.blocking), message: rule.message, why: c.why, actionKey: rule.action ?? null })
  }
  return out
}

/** Démarche créée depuis le contenu : jamais supprimée ni réécrite ensuite (même règle que le serveur). */
export function actionFromContent(key: string, factKey: string, id: string, at: string, origin: string, by: PersonId): Action {
  const def = ACTION_DEF[key]!
  return {
    id, key, title: def.title, goal: def.goal, explanation: def.explanation, steps: def.steps, factKey,
    status: 'a_faire', events: [{ at, by, text: `Proposée par les règles de préparation : ${origin}` }],
  }
}

/** Ajoute les démarches devenues nécessaires ; ne supprime ni ne modifie jamais les existantes. */
export function syncActions(d: Dossier, at: string, newId: () => string): Action[] {
  const actions = [...d.actions]
  for (const c of computeChecks(d)) {
    if (c.actionKey && !actions.some((a) => a.key === c.actionKey)) {
      actions.push(actionFromContent(c.actionKey, c.factKey, newId(), at, c.message, d.owner))
    }
  }
  return actions
}

// ---- Lecture par sujet ---------------------------------------------------------------------

export type SubjectState = 'non_aborde' | 'inconnu' | 'ouvert' | 'rien_signale'
export const SUBJECT_STATE_LABEL: Record<SubjectState, string> = {
  non_aborde: 'Pas encore abordé',
  inconnu: 'Inconnu pour l’instant',
  ouvert: 'Point à éclaircir',
  rien_signale: 'Rien de signalé',
}

export function subjectsFor(d: Dossier): Subject[] {
  return SUBJECTS.map((s) => ({ ...s, facts: s.facts.filter((k) => factsFor(d.profile).some((f) => f.key === k)) })).filter((s) => s.facts.length > 0)
}

export function subjectState(d: Dossier, s: Subject, checks: Check[]): SubjectState {
  const states = s.facts.map((k) => (d.facts[k] ?? EMPTY).status)
  const open = checks.filter((c) => s.facts.includes(c.factKey) && c.level !== 'a_completer')
  if (states.every((x) => x === 'non_renseigne')) return 'non_aborde'
  if (open.length > 0 && states.some((x) => x === 'inconnu')) return 'inconnu'
  if (open.length > 0) return 'ouvert'
  if (states.some((x) => x === 'non_renseigne')) return 'non_aborde'
  return 'rien_signale'
}

/** Résumé lisible d'une information (valeurs saisies, sans interprétation). */
export function describe(key: string, state: FactState): string {
  if (state.status === 'non_renseigne') return 'Pas encore abordé'
  if (state.status === 'inconnu') return 'Inconnu pour l’instant'
  const def = FACT_BY_KEY[key]!
  const parts: string[] = []
  for (const f of def.fields) {
    const raw = state.value?.[f.name]
    if (!raw || f.name === 'surface_unite') continue
    let text = f.choices?.find(([v]) => v === raw)?.[1] ?? raw
    if (f.kind === 'month') text = formatMonthShort(raw)
    if (f.name === 'surface') text = `${raw} ${state.value?.surface_unite === 'ha' ? 'ha' : 'm²'}`
    if (f.unit === 'FCFA') text = formatFcfa(Number(raw))
    if (f.unit === 'h/semaine') text = `${raw} h par semaine`
    parts.push(text)
  }
  return parts.join(' · ') || '—'
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
export function formatMonthShort(v: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(v)
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : v
}
const NBSP = String.fromCharCode(160)
export function formatFcfa(n: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(n)}${NBSP}FCFA`
}
export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Dakar' }).format(new Date(iso))
}

// ---- Échanges : qui doit agir (même règle que reviews/sections.question_state) -------------

export type QuestionState = 'a_repondre' | 'en_attente' | 'reponse_recue' | 'repondu' | 'close'
export function roleOf(d: Dossier, p: PersonId): 'porteur' | 'conseiller' {
  return d.owner === p ? 'porteur' : 'conseiller'
}
export function questionState(d: Dossier, m: Message, viewer: 'porteur' | 'conseiller'): QuestionState | null {
  if (m.kind !== 'question') return null
  if (m.resolvedAt) return 'close'
  const last = m.replies[m.replies.length - 1] ?? m
  const mine = roleOf(d, m.author) === viewer
  if (roleOf(d, last.author) === viewer) return mine ? 'en_attente' : 'repondu'
  return mine ? 'reponse_recue' : 'a_repondre'
}
/** État d'un échange en clair, sans laisser croire à une notification : partagé dans le dossier. */
export function questionLabel(d: Dossier, st: QuestionState, viewer: 'porteur' | 'conseiller'): string {
  if (st === 'en_attente') {
    if (viewer === 'porteur' && d.advisors.length === 0) return 'Enregistrée, aucun conseiller attribué'
    return 'Partagée, en attente de réponse'
  }
  return QUESTION_STATE_LABEL[st]
}
export const QUESTION_STATE_LABEL: Record<QuestionState, string> = {
  a_repondre: 'Attend votre réponse',
  en_attente: 'En attente d’une réponse',
  reponse_recue: 'Réponse reçue, échange ouvert',
  repondu: 'Vous avez répondu, échange ouvert',
  close: 'Échange clôturé',
}

export function staleSections(d: Dossier, r: Review): Section[] {
  return r.scope.filter((s) => d.versions[s] !== r.versions[s])
}
export function pendingRequest(d: Dossier) {
  const last = d.requests[d.requests.length - 1]
  const lastReview = d.reviews[d.reviews.length - 1]
  return last && (!lastReview || lastReview.at < last.at) ? last : null
}

// ---- Budget (mêmes règles que budget/calc.py) ----------------------------------------------

export function lineAmount(l: Line): number | null {
  if (l.owned || l.quantity === null || l.unitPrice === null) return null
  return Math.round(l.quantity * l.unitPrice)
}
export function budgetTotals(lines: Line[]) {
  const counted = lines.filter((l) => !l.owned)
  const priced = counted.filter((l) => lineAmount(l) !== null)
  return {
    priced: priced.reduce((s, l) => s + lineAmount(l)!, 0),
    estimated: priced.filter((l) => l.priceStatus === 'estime').reduce((s, l) => s + lineAmount(l)!, 0),
    missing: counted.length - priced.length,
    owned: lines.length - counted.length,
    count: lines.length,
  }
}

// ---- Étape suivante du porteur (une seule mise en avant) ------------------------------------

export type NextStep = { kind: string; title: string; why?: string; to: string; label: string }
export function nextStep(d: Dossier, checks: Check[]): NextStep | null {
  const viewer = 'porteur'
  const last = d.decisions[d.decisions.length - 1]
  if (last?.choice === 'differer') {
    return { kind: 'differe', title: 'Projet différé', why: `Décision du ${formatDay(last.at)} : ${last.reason}`, to: '/echanges#decision', label: 'Revoir la décision' }
  }
  const toAnswer = d.threads.filter((m) => questionState(d, m, viewer) === 'a_repondre')
  if (toAnswer.length > 0) {
    return { kind: 'repondre', title: 'Votre conseillère attend une réponse', why: `Question sur « ${toAnswer[0]!.target.label} ».`, to: '/echanges', label: 'Répondre' }
  }
  const carried = Object.entries(d.facts).filter(([, f]) => f.carried)
  if (carried.length > 0) {
    return { kind: 'reprise', title: `Reconfirmer ${carried.length} information${carried.length > 1 ? 's' : ''} reprise${carried.length > 1 ? 's' : ''}`, why: 'Elles viennent de la campagne précédente : la situation a pu changer.', to: '/reprise', label: 'Reconfirmer' }
  }
  const inProgress = d.actions.find((a) => a.status === 'en_cours')
  if (inProgress) return { kind: 'continuer', title: inProgress.title, why: 'Démarche commencée.', to: `/demarches/${inProgress.id}`, label: 'Continuer la démarche' }
  const blockingEmpty = checks.filter((c) => c.blocking && c.level === 'a_completer')
  if (blockingEmpty.length > 0) {
    const k = blockingEmpty[0]!.factKey
    return { kind: 'renseigner', title: `Répondre : ${factLabel(k, d.profile)}`, why: 'Les règles de préparation en ont besoin pour signaler les points à éclaircir.', to: `/info/${k}`, label: 'Répondre' }
  }
  const ready = d.actions.find((a) => a.status === 'a_faire')
  if (ready) return { kind: 'demarche', title: ready.title, why: ready.goal, to: `/demarches/${ready.id}`, label: 'Voir la démarche' }
  return null
}
