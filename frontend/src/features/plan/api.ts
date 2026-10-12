import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../shared/api'
import type { FactStatus, Person } from '../dossiers/api'

export type Level = 'a_completer' | 'a_clarifier' | 'a_verifier'
export type ActionStatus = 'a_faire' | 'en_cours' | 'bloquee' | 'terminee'
export type ResultOutcome = 'favorable' | 'defavorable' | 'incertain'

export type Check = {
  key: string
  fact_key: string
  fact_label: string
  fact_status: FactStatus
  level: Level
  level_label: string
  blocking: boolean
  message: string
  why: string
  action_key: string | null
  action: { id: number; title: string; status: ActionStatus } | null
}

export type PlanAction = {
  id: number
  definition_key: string | null
  custom: boolean
  title: string
  goal: string
  explanation: string
  steps: string[]
  prerequisites: { id: number; title: string; done: boolean }[]
  prerequisites_met: boolean
  status: ActionStatus
  status_label: string
  blocked_reason: string
  result_text: string
  result_date: string | null
  result_outcome: ResultOutcome | null
  result_outcome_label: string | null
  due_date: string | null
  origin: string
  row_version: number
  created_at: string
  updated_at: string
  linked_check: { key: string; message: string; level: Level; fact_key: string } | null
  related_fact: { key: string; label: string } | null
}

export type Template = {
  code: string
  version: number
  title: string
  review_status: 'non_relu' | 'en_relecture' | 'relu'
  review_label: string
  review_note: string | null
  reviewer: string | null
  review_date: string | null
  source: string
  scope: { pays: string; zones: string[]; cultures: string[]; note?: string }
}

export type Preparation = {
  template: Template | null
  plan_version: number
  context_version: number
  checks: Check[]
  actions: PlanAction[]
  next_action_id: number | null
}

export type ActionEvent = {
  plan_version: number
  from_status: ActionStatus | null
  to_status: ActionStatus
  blocked_reason: string
  result_text: string
  result_date: string | null
  result_outcome: ResultOutcome | null
  note: string
  author: Person | null
  created_at: string
}

export const preparationKey = (id: number) => ['preparation', id]

export const fetchPreparation = (dossierId: number) => api<Preparation>(`/dossiers/${dossierId}/preparation`)

export function usePreparation(dossierId: number) {
  return useQuery({ queryKey: preparationKey(dossierId), queryFn: () => fetchPreparation(dossierId) })
}

export function useActionHistory(dossierId: number, actionId: number) {
  return useQuery({
    queryKey: ['historique-demarche', dossierId, actionId],
    queryFn: () => api<ActionEvent[]>(`/dossiers/${dossierId}/actions/${actionId}/historique`),
  })
}

export type ActionUpdate = {
  status?: ActionStatus
  blocked_reason?: string
  result_text?: string
  result_date?: string | null
  result_outcome?: ResultOutcome | ''
  due_date?: string | null
  expected_version: number
}

function invalidateDossier(qc: ReturnType<typeof useQueryClient>, dossierId: number) {
  void qc.invalidateQueries({ predicate: (q) => q.queryKey[1] === dossierId })
}

export function useUpdateAction(dossierId: number, actionId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ActionUpdate) =>
      api<{ changed: boolean; row_version: number; status: ActionStatus }>(`/dossiers/${dossierId}/actions/${actionId}`, {
        method: 'PATCH',
        body,
      }),
    onSuccess: () => invalidateDossier(qc, dossierId),
  })
}

export function useCreateAction(dossierId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { title: string; goal: string; request_id: string }) =>
      api<{ id: number }>(`/dossiers/${dossierId}/actions`, { method: 'POST', body }),
    onSuccess: () => invalidateDossier(qc, dossierId),
  })
}

export const ACTION_TONE: Record<ActionStatus, 'neutral' | 'info' | 'danger' | 'ok'> = {
  a_faire: 'neutral',
  en_cours: 'info',
  bloquee: 'danger',
  terminee: 'ok',
}

export const LEVEL_TONE: Record<Level, 'neutral' | 'warn' | 'info'> = {
  a_completer: 'neutral',
  a_clarifier: 'warn',
  a_verifier: 'info',
}
