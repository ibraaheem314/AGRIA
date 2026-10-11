import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../shared/api'

export type Person = { id: number; display_name: string }
export type Profile = 'debutant' | 'producteur'
export type FactStatus = 'non_renseigne' | 'inconnu' | 'declare' | 'estime' | 'verifie'
export type FieldKind = 'choice' | 'text' | 'longtext' | 'integer' | 'decimal' | 'month'

export type FieldDef = {
  name: string
  label: string
  kind: FieldKind
  required: boolean
  choices: { value: string; label: string }[]
  unit: string | null
  minimum: number | null
  maximum: number | null
  max_length: number
  help: string
}

export type FactValue = Record<string, string | number>

export type FactState = {
  status: FactStatus
  value: FactValue | null
  source: string
  row_version: number
  updated_at: string | null
  updated_by: Person | null
}

export type FactItem = {
  key: string
  section: string
  label: string
  why: string
  fields: FieldDef[]
  state: FactState
}

export type DossierSummary = {
  id: number
  status: { code: string; label: string }
  pending: { open_questions: number; review_requested: boolean }
  label: string
  archived: boolean
  role: 'porteur' | 'conseiller'
  created_at: string
  updated_at: string
  project: {
    id: number
    name: string
    profile: Profile
    profile_label: string
    is_demo: boolean
    owner: Person
  }
}

export type Dossier = DossierSummary & {
  context_version: number
  statuses: { value: Exclude<FactStatus, 'non_renseigne'>; label: string; help: string }[]
  sections: { key: string; label: string }[]
  facts: FactItem[]
}

export type Revision = {
  context_version: number
  status: Exclude<FactStatus, 'non_renseigne'>
  value: FactValue | null
  source: string
  author: Person
  created_at: string
}

export const dossierKey = (id: number) => ['dossier', id]

export function useDossiers({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: ['dossiers'], queryFn: () => api<DossierSummary[]>('/dossiers'), enabled })
}

export function useDossier(id: number) {
  return useQuery({ queryKey: dossierKey(id), queryFn: () => api<Dossier>(`/dossiers/${id}`) })
}

export function useFactHistory(id: number, key: string) {
  return useQuery({
    queryKey: ['historique', id, key],
    queryFn: () => api<Revision[]>(`/dossiers/${id}/informations/${key}/historique`),
  })
}

export type NewProject = { name: string; profile: Profile; campaign_label: string; request_id: string }

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: NewProject) => api<Dossier>('/projects', { method: 'POST', body }),
    onSuccess: (dossier) => {
      qc.setQueryData(dossierKey(dossier.id), dossier)
      return qc.invalidateQueries({ queryKey: ['dossiers'] })
    },
  })
}

export type FactWrite = {
  status: Exclude<FactStatus, 'non_renseigne'>
  value: FactValue | null
  source: string
  expected_version: number
}

export function useSaveFact(dossierId: number, key: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: FactWrite) =>
      api<{ state: FactState; changed: boolean; context_version: number }>(
        `/dossiers/${dossierId}/informations/${key}`,
        { method: 'PUT', body },
      ),
    // Le dossier entier est relu : vérifications, plan et avis dépendent du contexte.
    // Pas d'attente : la page peut naviguer aussitôt l'écriture confirmée.
    onSuccess: () => {
      void qc.invalidateQueries({ predicate: (q) => q.queryKey[1] === dossierId })
    },
  })
}

export function useCreateCampaign(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { label: string; request_id: string; copy_from: number | null }) =>
      api<Dossier>(`/projects/${projectId}/campaigns`, { method: 'POST', body }),
    onSuccess: (dossier) => {
      qc.setQueryData(dossierKey(dossier.id), dossier)
      return qc.invalidateQueries({ queryKey: ['dossiers'] })
    },
  })
}
