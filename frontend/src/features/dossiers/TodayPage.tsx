import { Link } from 'react-router'
import { Card, PageTitle } from '../../shared/ui'
import { useCurrentDossier } from './DossierLayout'
import { factCounts } from './ProjectPage'

export function TodayPage() {
  const dossier = useCurrentDossier()
  const counts = factCounts(dossier)
  const next = dossier.facts.find((f) => f.state.status === 'non_renseigne')
  const owner = dossier.role === 'porteur'

  return (
    <div className="space-y-4">
      <PageTitle subtitle={`${dossier.project.name} · ${dossier.label} · préparation`}>Aujourd’hui</PageTitle>

      {owner && next && (
        <Card>
          <h2 className="font-semibold">Information à compléter</h2>
          <p className="mt-1 font-medium">{next.label}</p>
          <p className="text-sm text-muted">Pourquoi ? {next.why}</p>
          <Link to={`/d/${dossier.id}/projet/${next.key}`} className="mt-3 inline-block font-medium text-brand-700 underline">
            Compléter cette information
          </Link>
          <p className="mt-2 text-sm text-muted">« Je ne sais pas » est une réponse acceptée.</p>
        </Card>
      )}

      <Card>
        <h2 className="font-semibold">Mon dossier</h2>
        <p className="mt-1">
          {counts.total - counts.non_renseigne} information(s) renseignée(s) sur {counts.total}, dont {counts.verifie} vérifiée(s)
          et {counts.inconnu} « je ne sais pas ».
        </p>
        <Link to={`/d/${dossier.id}/projet`} className="mt-2 inline-block font-medium text-brand-700 underline">
          Voir les éléments connus
        </Link>
      </Card>
    </div>
  )
}
