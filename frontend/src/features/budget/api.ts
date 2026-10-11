import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../shared/api'
import type { FactStatus, Person } from '../dossiers/api'

export type Choice = { value: string; label: string }
export type LineState = 'connu' | 'estime' | 'incomplet' | 'detenu'
export type BudgetStatus = 'vide' | 'incomplet' | 'complet_estime' | 'complet'

export type BudgetLine = {
  id: number
  category: string
  category_label: string
  label: string
  quantity: string | null
  unit: string
  unit_label: string
  unit_price: number | null
  price_status: 'connu' | 'estime' | 'manquant'
  price_status_label: string
  source: string
  price_date: string | null
  already_owned: boolean
  notes: string
  amount: number | null
  state: LineState
  row_version: number
  updated_at: string
}

export type Totals = {
  lines: number
  owned: number
  incomplete: number
  estimated_lines: number
  known_total: number
  estimated_total: number
  priced_total: number
  status: BudgetStatus
  complete: boolean
}

export type Budget = {
  budget_version: number
  lines: BudgetLine[]
  totals: { overall: Totals; by_category: Record<string, Totals> }
  apport: { status: FactStatus; montant: number | null }
  rules: string[]
  choices: { categories: Choice[]; units: Choice[]; price_statuses: Choice[] }
}

export type BudgetEvent = {
  budget_version: number
  line_id: number
  kind: 'ajout' | 'modif' | 'retrait'
  snapshot: Omit<BudgetLine, 'id' | 'row_version' | 'updated_at' | 'unit_label' | 'category_label' | 'price_status_label'> & { removed: boolean }
  author: Person
  created_at: string
}

export type LineInput = {
  category: string
  label: string
  quantity: string
  unit: string
  unit_price: string
  price_status: string
  source: string
  price_date: string | null
  already_owned: boolean
  notes: string
}

export const budgetKey = (id: number) => ['budget', id]

export function useBudget(dossierId: number) {
  return useQuery({ queryKey: budgetKey(dossierId), queryFn: () => api<Budget>(`/dossiers/${dossierId}/budget`) })
}

export function useBudgetHistory(dossierId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['historique-budget', dossierId],
    queryFn: () => api<BudgetEvent[]>(`/dossiers/${dossierId}/budget/historique`),
    enabled,
  })
}

function useInvalidate(dossierId: number) {
  const qc = useQueryClient()
  return () => void qc.invalidateQueries({ predicate: (q) => q.queryKey[1] === dossierId })
}

export function useCreateLine(dossierId: number) {
  const invalidate = useInvalidate(dossierId)
  return useMutation({
    mutationFn: (body: LineInput & { request_id: string }) =>
      api<BudgetLine>(`/dossiers/${dossierId}/budget`, { method: 'POST', body }),
    onSuccess: invalidate,
  })
}

export function useUpdateLine(dossierId: number, lineId: number) {
  const invalidate = useInvalidate(dossierId)
  return useMutation({
    mutationFn: (body: LineInput & { expected_version: number }) =>
      api<BudgetLine & { changed: boolean }>(`/dossiers/${dossierId}/budget/postes/${lineId}`, { method: 'PUT', body }),
    onSuccess: invalidate,
  })
}

export function useRemoveLine(dossierId: number) {
  const invalidate = useInvalidate(dossierId)
  return useMutation({
    mutationFn: ({ id, expected_version }: { id: number; expected_version: number }) =>
      api<{ changed: boolean }>(`/dossiers/${dossierId}/budget/postes/${id}/retirer`, {
        method: 'POST',
        body: { expected_version },
      }),
    onSuccess: invalidate,
  })
}
