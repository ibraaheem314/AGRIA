import { useEffect } from 'react'
import { Link, Outlet, useLocation, useMatch, useOutletContext, useParams } from 'react-router'
import { ApiError } from '../../shared/api'
import { formatDate } from '../../shared/format'
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
  // L'accueil a sa propre carte d'archivage : pas de bandeau en double.
  const onHome = useMatch('/d/:dossierId') !== null

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
          Vous consultez le dossier de <strong>{d.project.owner.display_name}</strong> (« {d.project.name} », campagne « {d.label} ») en tant que conseiller : les informations du porteur sont en lecture seule.{!d.archived && ' Vous pouvez poser des questions, répondre et donner un avis.'}
        </Alert>
      )}
      {d.archived && !onHome && (
        <Alert tone="neutral">
          Dossier archivé{d.archived_at ? ` le ${formatDate(d.archived_at)}` : ''} : consultation seulement, plus aucune modification possible.
        </Alert>
      )}
      {flash && (
        <Alert tone="ok" role="status">
          {flash}
        </Alert>
      )}
      {/* Clé par dossier : aucun état de formulaire ne passe d'un dossier à un autre. */}
      <Outlet key={d.id} context={d} />
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
