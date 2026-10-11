import { useEffect } from 'react'
import { Link, Outlet, useLocation, useOutletContext, useParams } from 'react-router'
import { ApiError } from '../../shared/api'
import { Alert, Loading, PageTitle } from '../../shared/ui'
import { useDossier, type Dossier } from './api'
import { rememberDossier } from './lastDossier'

/** Charge le dossier de l'URL (/d/:dossierId/...) et le fournit aux pages enfants. */
export function DossierLayout() {
  const { dossierId } = useParams()
  const id = Number(dossierId)
  const dossier = useDossier(id)
  const location = useLocation()
  const flash = (location.state as { flash?: string } | null)?.flash

  useEffect(() => {
    if (dossier.data) rememberDossier(dossier.data.id)
  }, [dossier.data])

  if (!Number.isInteger(id)) return <NotFoundDossier />
  if (dossier.isPending) return <Loading label="Chargement du dossier…" />
  if (dossier.isError) {
    const error = dossier.error instanceof ApiError ? dossier.error : null
    if (error?.status === 404) return <NotFoundDossier />
    return (
      <Alert tone="danger" role="alert" title="Dossier indisponible">
        <p>{dossier.error.message}</p>
        <button type="button" className="mt-2 font-medium underline" onClick={() => dossier.refetch()}>
          Réessayer
        </button>
      </Alert>
    )
  }

  const d = dossier.data
  return (
    <div className="space-y-4">
      {d.project.is_demo && (
        <Alert tone="warn" title="Exemple de démonstration">
          Ce dossier est fictif. Il sert à montrer le fonctionnement d'AGRIA ; ses informations n'appartiennent à personne.
        </Alert>
      )}
      {d.role === 'conseiller' && (
        <Alert tone="info">
          Vous consultez le dossier de {d.project.owner.display_name} en tant que conseiller : les informations du porteur sont en lecture seule.
        </Alert>
      )}
      {d.archived && <Alert tone="neutral">Ce dossier est archivé : il n'est plus modifiable.</Alert>}
      {flash && (
        <Alert tone="ok" role="status">
          {flash}
        </Alert>
      )}
      <Outlet context={d} />
    </div>
  )
}

export function useCurrentDossier(): Dossier {
  return useOutletContext<Dossier>()
}

function NotFoundDossier() {
  return (
    <div role="alert">
      <PageTitle>Dossier introuvable</PageTitle>
      <p>Ce dossier n'existe pas ou ne vous est pas accessible.</p>
      <Link to="/dossiers" className="mt-2 inline-block font-medium text-brand-700 underline">
        Voir mes dossiers
      </Link>
    </div>
  )
}
