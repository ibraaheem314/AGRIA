import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../shared/api'
import type { FactStatus, FactValue, Person } from '../dossiers/api'
import type { Totals } from '../budget/api'

export type Section = 'contexte' | 'plan' | 'budget'
export type Versions = Record<Section, number>
export type Choice = { value: string; label: string }
export type DossierStatus = { code: string; label: string }

export type Review = {
  id: number
  advisor: Person
  created_at: string
  scope: Section[]
  scope_labels: string[]
  versions: Versions
  verdict: 'sans_reserve' | 'avec_reserves'
  verdict_label: string
  opinion: string
  reservations: string
  current: boolean
  stale_sections: string[]
}

export type Message = {
  id: number
  kind: 'question' | 'commentaire' | 'reponse'
  kind_label: string
  author: Person
  author_role: 'porteur' | 'conseiller'
  target_type: 'dossier' | 'information' | 'demarche' | 'poste'
  target_ref: string
  target_label: string
  body: string
  resolved_at: string | null
  resolved_by: Person | null
  created_at: string
  replies: Message[]
}

export type Decision = { id: number; choice: string; choice_label: string; reason: string; author: Person; created_at: string }

export type Relecture = {
  role: 'porteur' | 'conseiller'
  can_review: boolean
  status: DossierStatus
  versions: Versions
  advisors: { id: number; display_name: string; since: string }[]
  requests: { id: number; requested_by: Person; note: string; created_at: string; answered: boolean }[]
  reviews: Review[]
  decisions: Decision[]
  threads: Message[]
  choices: { sections: Choice[]; verdicts: Choice[]; decisions: Choice[]; targets: Choice[] }
}

export type SnapshotFact = { key: string; label: string; status: FactStatus; status_label: string; value: FactValue | null; source: string }
export type SnapshotAction = {
  id: number
  title: string
  status: string
  status_label: string
  blocked_reason: string
  result_text: string
  result_date: string | null
  due_date: string | null
}
export type SnapshotLine = {
  label: string
  category: string
  category_label: string
  quantity: string | null
  unit_label: string
  unit_price: number | null
  price_status: string
  source: string
  price_date: string | null
  already_owned: boolean
  amount: number | null
  state: string
}
export type Snapshot = {
  contexte?: { profile: string; profile_label: string; facts: SnapshotFact[] }
  plan?: {
    template: { code: string; version: number; review_status: string } | null
    checks: { key: string; fact_label: string; level: string; blocking: boolean; message: string }[]
    actions: SnapshotAction[]
  }
  budget?: { lines: SnapshotLine[]; totals: { overall: Totals; by_category: Record<string, Totals> } }
}

export type Synthese = Required<Snapshot> & {
  generated_at: string
  dossier: { id: number; label: string; project: string; owner: Person; is_demo: boolean; created_at: string; archived_at: string | null }
  status: DossierStatus
  versions: Versions
  advisors: Relecture['advisors']
  reviews: Review[]
  decisions: Decision[]
  open_questions: { id: number; body: string; author: Person; target_label: string }[]
  notice: string
}

export const relectureKey = (id: number) => ['relecture', id]

export function useRelecture(dossierId: number) {
  return useQuery({ queryKey: relectureKey(dossierId), queryFn: () => api<Relecture>(`/dossiers/${dossierId}/relecture`) })
}

export function useReviewDetail(dossierId: number, reviewId: number | null) {
  return useQuery({
    queryKey: ['avis', dossierId, reviewId],
    queryFn: () => api<Review & { snapshot: Snapshot }>(`/dossiers/${dossierId}/avis/${reviewId}`),
    enabled: reviewId !== null,
  })
}

export function useSynthese(dossierId: number) {
  return useQuery({ queryKey: ['synthese', dossierId], queryFn: () => api<Synthese>(`/dossiers/${dossierId}/synthese`) })
}

function usePost<TBody>(dossierId: number, path: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: TBody) => api<{ id?: number; changed?: boolean }>(`/dossiers/${dossierId}${path}`, { method: 'POST', body }),
    onSuccess: () => {
      void qc.invalidateQueries({ predicate: (q) => q.queryKey[1] === dossierId })
      void qc.invalidateQueries({ queryKey: ['dossiers'] })
    },
  })
}

export const useRequestReview = (id: number) => usePost<{ note: string; request_id: string }>(id, '/demandes-relecture')
export const useGiveReview = (id: number) =>
  usePost<{ scope: Section[]; verdict: string; opinion: string; reservations: string; seen_versions: Versions; request_id: string }>(id, '/avis')
export const usePostMessage = (id: number) =>
  usePost<{ kind?: string; body: string; target_type?: string; target_ref?: string; parent_id?: number; request_id: string }>(id, '/messages')
export const useDecision = (id: number) => usePost<{ choice: string; reason: string; request_id: string }>(id, '/decisions')
export const useArchive = (id: number) => usePost<Record<string, never>>(id, '/archiver')

export function useResolve(dossierId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (commentId: number) => api<{ changed: boolean }>(`/dossiers/${dossierId}/messages/${commentId}/resoudre`, { method: 'POST' }),
    onSuccess: () => void qc.invalidateQueries({ predicate: (q) => q.queryKey[1] === dossierId }),
  })
}
