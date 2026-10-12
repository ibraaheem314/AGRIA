/**
 * État du prototype : en mémoire et dans le stockage local de ce navigateur seulement.
 * Aucune requête réseau, aucune écriture dans une base. « Réinitialiser » revient au jeu fictif.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { factLabel, HOW_KNOWN, type Status } from './facts'
import {
  syncActions, type Action, type Decision, type Dossier, type FactState, type Line, type Message, type PersonId,
  type Review, type Section, type Target, type Value,
} from './model'
import { initialState, STATE_VERSION, type ProtoState } from './seed'

const KEY = 'agria.prototype.ux1'
const VIEWER_KEY = 'agria.prototype.ux1.role'
export type Viewer = 'awa' | 'modou' | 'ndiaye'
export type Sim = 'normal' | 'chargement' | 'erreur'

function load(): ProtoState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ProtoState
      if (parsed.version === STATE_VERSION) return parsed
    }
  } catch {
    // Stockage indisponible ou illisible : on repart du jeu fictif.
  }
  return initialState()
}

function loadViewer(): Viewer {
  try {
    const v = window.localStorage.getItem(VIEWER_KEY)
    if (v === 'awa' || v === 'modou' || v === 'ndiaye') return v
  } catch {
    // ignoré
  }
  return 'awa'
}

const now = () => new Date().toISOString()

type Ops = ReturnType<typeof makeOps>
type Ctx = { state: ProtoState; viewer: Viewer; setViewer: (v: Viewer) => void; sim: Sim; setSim: (s: Sim) => void; ops: Ops }
const StoreContext = createContext<Ctx | null>(null)

function makeOps(setState: (fn: (s: ProtoState) => ProtoState) => void) {
  const nextId = (s: ProtoState) => () => `x${++s.seq}`
  const update = (id: string, fn: (d: Dossier, s: ProtoState) => Dossier) =>
    setState((s) => {
      const copy: ProtoState = { ...s }
      copy.dossiers = s.dossiers.map((d) => (d.id === id ? { ...fn(structuredClone(d), copy), updatedAt: now() } : d))
      return copy
    })
  const bump = (d: Dossier, section: Section) => ({ ...d.versions, [section]: d.versions[section] + 1 })

  return {
    reset: () => setState(() => initialState()),

    createDossier: (input: Pick<Dossier, 'owner' | 'profile' | 'idea' | 'projectName' | 'campaign'> & { facts: Record<string, FactState>; deferred: string[] }) => {
      const id = `d-${Date.now()}`
      setState((s) => {
        const copy = { ...s }
        const d: Dossier = {
          ...input, id, advisors: [], history: [], actions: [], budget: [], threads: [], requests: [], reviews: [], decisions: [],
          versions: { contexte: 1, plan: 0, budget: 0 }, createdAt: now(), updatedAt: now(),
        }
        d.history = Object.entries(input.facts).map(([key, f]) => ({ key, status: f.status, value: f.value, source: f.source, at: now(), by: input.owner }))
        d.actions = syncActions(d, now(), nextId(copy))
        if (d.actions.length) d.versions.plan = 1
        copy.dossiers = [...s.dossiers, d]
        return copy
      })
      return id
    },

    saveFact: (id: string, key: string, data: { status: Exclude<Status, 'non_renseigne'>; value: Value | null; source: string }, by: PersonId) =>
      update(id, (d, s) => {
        d.facts[key] = { ...data, at: now(), by }
        d.history.push({ key, ...data, at: now(), by })
        d.deferred = d.deferred.filter((k) => k !== key)
        d.versions = bump(d, 'contexte')
        const before = d.actions.length
        d.actions = syncActions(d, now(), nextId(s))
        if (d.actions.length > before) d.versions = bump(d, 'plan')
        return d
      }),

    setDeferred: (id: string, key: string, on: boolean) =>
      update(id, (d) => ({ ...d, deferred: on ? [...new Set([...d.deferred, key])] : d.deferred.filter((k) => k !== key) })),

    reconfirm: (id: string, key: string, by: PersonId) =>
      update(id, (d, s) => {
        const f = d.facts[key]!
        const source = `Reconfirmé pour cette campagne (${new Intl.DateTimeFormat('fr-FR').format(new Date())}).`
        d.facts[key] = { status: 'declare', value: f.value, source, at: now(), by }
        d.history.push({ key, status: 'declare', value: f.value, source, at: now(), by })
        d.versions = bump(d, 'contexte')
        d.actions = syncActions(d, now(), nextId(s))
        return d
      }),

    updateAction: (id: string, actionId: string, patch: Partial<Action>, eventText: string, by: PersonId) =>
      update(id, (d) => {
        d.actions = d.actions.map((a) => (a.id === actionId ? { ...a, ...patch, events: [...a.events, { at: now(), by, text: eventText }] } : a))
        d.versions = bump(d, 'plan')
        return d
      }),

    addAction: (id: string, title: string, goal: string, by: PersonId) => {
      const created = `p-${Date.now()}`
      update(id, (d) => {
        d.actions.push({ id: created, key: null, title, goal, explanation: '', steps: [], factKey: null, status: 'a_faire', events: [{ at: now(), by, text: 'Démarche personnelle ajoutée' }] })
        d.versions = bump(d, 'plan')
        return d
      })
      return created
    },

    saveLine: (id: string, line: Omit<Line, 'id'> & { id?: string }) =>
      update(id, (d, s) => {
        if (line.id) d.budget = d.budget.map((l) => (l.id === line.id ? { ...(line as Line) } : l))
        else d.budget.push({ ...line, id: nextId(s)() })
        d.versions = bump(d, 'budget')
        return d
      }),

    removeLine: (id: string, lineId: string) =>
      update(id, (d) => ({ ...d, budget: d.budget.filter((l) => l.id !== lineId), versions: bump(d, 'budget') })),

    post: (id: string, m: { author: PersonId; kind: Message['kind']; target: Target; body: string; parentId?: string }) =>
      update(id, (d, s) => {
        const msg: Message = { id: nextId(s)(), author: m.author, kind: m.kind, target: m.target, body: m.body, at: now(), replies: [] }
        if (m.parentId) d.threads = d.threads.map((t) => (t.id === m.parentId ? { ...t, replies: [...t.replies, { ...msg, kind: 'reponse', target: t.target }] } : t))
        else d.threads.push(msg)
        return d
      }),

    resolve: (id: string, msgId: string) =>
      update(id, (d) => ({ ...d, threads: d.threads.map((t) => (t.id === msgId ? { ...t, resolvedAt: now() } : t)) })),

    requestReview: (id: string, note: string) => update(id, (d) => ({ ...d, requests: [...d.requests, { at: now(), note }] })),

    giveReview: (id: string, r: Omit<Review, 'id' | 'at' | 'versions'>) =>
      update(id, (d, s) => ({ ...d, reviews: [...d.reviews, { ...r, id: nextId(s)(), at: now(), versions: { ...d.versions } }] })),

    decide: (id: string, choice: Decision['choice'], reason: string, by: PersonId) =>
      update(id, (d, s) => ({ ...d, decisions: [...d.decisions, { id: nextId(s)(), choice, reason, by, at: now(), versions: { ...d.versions } }] })),

    /** Geste de l'équipe AGRIA (commande assign_advisor), hors de l'application : outil de démonstration. */
    assignAdvisor: (id: string) => update(id, (d) => (d.advisors.length ? d : { ...d, advisors: [{ id: 'ndiaye', since: now() }] })),

    archive: (id: string) => update(id, (d) => ({ ...d, archivedAt: now() })),

    /** Campagne suivante : seules les informations du lieu sont reprises, « à reconfirmer ». */
    startNextCampaign: (prevId: string, campaign: string) => {
      const id = `d-${Date.now()}`
      setState((s) => {
        const prev = s.dossiers.find((d) => d.id === prevId)!
        const copy = { ...s }
        const facts: Record<string, FactState> = {}
        for (const key of ['localisation', 'acces_terrain', 'eau']) {
          const f = prev.facts[key]
          if (!f || f.status === 'non_renseigne' || f.status === 'inconnu') continue
          facts[key] = {
            status: 'declare',
            value: f.value,
            source: `Repris de « ${prev.campaign} », où l'information était « ${HOW_KNOWN[f.status].toLowerCase()} »${f.source ? ` (${f.source})` : ''}.`,
            at: now(),
            by: prev.owner,
            carried: true,
          }
        }
        const d: Dossier = {
          id, owner: prev.owner, profile: prev.profile, idea: prev.idea, projectName: prev.projectName, campaign,
          previousId: prev.id, advisors: [], facts, deferred: [], actions: [], budget: [], threads: [], requests: [], reviews: [], decisions: [],
          history: Object.entries(facts).map(([key, f]) => ({ key, status: f.status, value: f.value, source: f.source, at: now(), by: prev.owner })),
          versions: { contexte: 1, plan: 1, budget: 0 }, createdAt: now(), updatedAt: now(),
        }
        d.actions = syncActions(d, now(), nextId(copy))
        copy.dossiers = [...s.dossiers, d]
        return copy
      })
      return id
    },
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<ProtoState>(load)
  const [viewer, setViewerRaw] = useState<Viewer>(loadViewer)
  const [sim, setSim] = useState<Sim>('normal')
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // Stockage indisponible : l'état vit jusqu'à la fermeture de l'onglet.
    }
  }, [state])
  const setState = useCallback((fn: (s: ProtoState) => ProtoState) => setStateRaw((s) => fn(s)), [])
  const setViewer = useCallback((v: Viewer) => {
    setViewerRaw(v)
    try {
      window.localStorage.setItem(VIEWER_KEY, v)
    } catch {
      // ignoré
    }
  }, [])
  const ops = useMemo(() => makeOps(setState), [setState])
  const value = useMemo(() => ({ state, viewer, setViewer, sim, setSim, ops }), [state, viewer, setViewer, sim, ops])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('StoreProvider manquant')
  return ctx
}

/** Dossier courant du porteur connecté : la campagne active, sinon la plus récente. */
export function useOwnDossier(): Dossier | null {
  const { state, viewer } = useStore()
  const own = state.dossiers.filter((d) => d.owner === viewer)
  return own.find((d) => !d.archivedAt) ?? own[own.length - 1] ?? null
}

export function useDossier(id: string | undefined): Dossier | null {
  const { state } = useStore()
  return state.dossiers.find((d) => d.id === id) ?? null
}

export { factLabel }
