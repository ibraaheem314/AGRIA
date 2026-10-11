import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../shared/api'

export type User = { id: number; email: string; display_name: string; is_advisor: boolean }
type Me = { user: User | null; signup: boolean }

export const ME_KEY = ['me']

/** Session courante. Pose aussi le cookie CSRF au premier appel. */
export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: () => api<Me>('/auth/me'), staleTime: 60_000 })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api<{ user: User }>('/auth/login', { method: 'POST', body }),
    onSuccess: () => {
      qc.clear() // aucune donnée d'une session précédente ne reste en mémoire
      return qc.invalidateQueries({ queryKey: ME_KEY })
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { email: string; display_name: string; password: string }) =>
      api<{ user: User }>('/auth/register', { method: 'POST', body }),
    onSuccess: () => {
      qc.clear()
      return qc.invalidateQueries({ queryKey: ME_KEY })
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api<void>('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      qc.clear()
      return qc.invalidateQueries({ queryKey: ME_KEY })
    },
  })
}
