import { Link } from 'react-router'
import { Alert, Badge, Card, Loading, PageTitle } from '../../shared/ui'
import { usePreparation } from '../plan/api'
import { useCurrentDossier } from './DossierLayout'
import { factCounts } from './ProjectPage'

/** Accueil : où en est mon projet, quelle est ma prochaine action, sur quoi ai-je besoin d'aide ? */
export function TodayPage() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const counts = factCounts(dossier)
  const owner = dossier.role === 'porteur'

  const nextAction = prep.data?.actions.find((a) => a.id === prep.data?.next_action_id)
  const blockingChecks = prep.data?.checks.filter((c) => c.blocking) ?? []
  const blockedActions = prep.data?.actions.filter((a) => a.status === 'bloquee') ?? []
  const nextFact = dossier.facts.find((f) => f.state.status === 'non_renseigne')

  return (
    <div className="space-y-4">
      <PageTitle subtitle={`${dossier.project.name} · ${dossier.label} · préparation`}>Aujourd’hui</PageTitle>

      {prep.isPending && <Loading label="Chargement du plan…" />}
      {prep.isError && (
        <Alert tone="danger" role="alert" title="Plan indisponible">
          {prep.error.message}{' '}
          <button type="button" className="font-medium underline" onClick={() => prep.refetch()}>Réessayer</button>
        </Alert>
      )}

      <Card>
        <h2 className="font-semibold">Ma prochaine action</h2>
        {nextAction ? (
          <>
            <p className="mt-1 font-medium">{nextAction.title}</p>
            {nextAction.explanation && <p className="text-sm text-muted">Pourquoi ? {nextAction.explanation}</p>}
            <Link to={`/d/${dossier.id}/plan/${nextAction.id}`} className="mt-2 inline-block font-medium text-brand-700 underline">
              Voir les étapes
            </Link>
          </>
        ) : owner && nextFact ? (
          <>
            <p className="mt-1 font-medium">Compléter : {nextFact.label}</p>
            <p className="text-sm text-muted">Pourquoi ? {nextFact.why}</p>
            <Link to={`/d/${dossier.id}/projet/${nextFact.key}`} className="mt-2 inline-block font-medium text-brand-700 underline">
              Compléter cette information
            </Link>
            <p className="mt-1 text-sm text-muted">« Je ne sais pas » est une réponse acceptée.</p>
          </>
        ) : (
          prep.isSuccess && <p className="mt-1 text-muted">Aucune démarche ouverte pour l'instant.</p>
        )}
      </Card>

      {prep.isSuccess && (
        <Card>
          <h2 className="font-semibold">Points bloquants</h2>
          {blockingChecks.length === 0 && blockedActions.length === 0 ? (
            <p className="mt-1 text-muted">Aucun point bloquant signalé.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {blockingChecks.map((c) => (
                <li key={c.key}>
                  <Link to={c.action ? `/d/${dossier.id}/plan/${c.action.id}` : `/d/${dossier.id}/projet/${c.fact_key}`} className="text-brand-700 underline">
                    {c.message}
                  </Link>
                </li>
              ))}
              {blockedActions.map((a) => (
                <li key={a.id}>
                  <Link to={`/d/${dossier.id}/plan/${a.id}`} className="text-brand-700 underline">{a.title}</Link>{' '}
                  <Badge tone="danger">Bloquée</Badge>
                  <span className="block text-sm text-muted">{a.blocked_reason}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-sm text-muted">Un point bloquant suspend l'étape concernée, pas nécessairement tout le projet.</p>
        </Card>
      )}

      <Card>
        <h2 className="font-semibold">Mon dossier</h2>
        <p className="mt-1">
          {counts.total - counts.non_renseigne} information(s) renseignée(s) sur {counts.total}, dont {counts.verifie} vérifiée(s)
          et {counts.inconnu} « je ne sais pas ».
        </p>
        {prep.data && (
          <p className="mt-1">
            Démarches : {prep.data.actions.filter((a) => a.status === 'terminee').length} terminée(s) sur {prep.data.actions.length}.
          </p>
        )}
        <p className="mt-1 text-sm text-muted">Ces compteurs mesurent l'avancement de la préparation, pas les chances de réussite du projet.</p>
        <p className="mt-2 flex flex-wrap gap-x-4">
          <Link to={`/d/${dossier.id}/projet`} className="font-medium text-brand-700 underline">Éléments connus</Link>
          <Link to={`/d/${dossier.id}/plan`} className="font-medium text-brand-700 underline">Points à vérifier</Link>
        </p>
      </Card>
    </div>
  )
}
