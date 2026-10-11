import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '../shared/api'

type Health = { status: string; database: string; migrations: string }

export function App() {
  const health = useQuery({ queryKey: ['health'], queryFn: () => api<Health>('/health'), retry: false })

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-brand-700">AGRIA</h1>
      <p className="mt-2 text-muted">Préparer sa campagne agricole.</p>
      <section className="mt-6 rounded-lg border border-line bg-surface p-4" aria-live="polite">
        <h2 className="font-medium">État du serveur</h2>
        {health.isPending && <p>Vérification…</p>}
        {health.isSuccess && <p>Serveur et base de données disponibles.</p>}
        {health.isError && (
          <p role="alert" className="text-danger-700">
            {health.error instanceof ApiError ? health.error.message : 'Serveur indisponible.'}
          </p>
        )}
      </section>
    </main>
  )
}
