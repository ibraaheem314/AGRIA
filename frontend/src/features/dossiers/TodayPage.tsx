import { Link } from 'react-router'
import { formatDate, formatDateTime, plural } from '../../shared/format'
import { Alert, Badge, Card, Loading, PageTitle } from '../../shared/ui'
import { usePreparation, type Check } from '../plan/api'
import { useRelecture } from '../reviews/api'
import { useCurrentDossier } from './DossierLayout'
import { isDetailed } from './guidance'
import { BudgetCard, factCounts } from './ProjectPage'

/** Accueil : prochaine démarche, points bloquants, état du dossier, retours disponibles. */
export function TodayPage() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const relecture = useRelecture(dossier.id)
  const counts = factCounts(dossier)
  const owner = dossier.role === 'porteur'
  const active = owner && !dossier.archived
  const detailed = isDetailed(dossier)

  const nextAction = prep.data?.actions.find((a) => a.id === prep.data?.next_action_id)
  const blockingChecks = prep.data?.checks.filter((c) => c.blocking) ?? []
  const blockedActions = prep.data?.actions.filter((a) => a.status === 'bloquee') ?? []
  const nextFact = dossier.facts.find((f) => f.state.status === 'non_renseigne')
  const deferral = dossier.status.code === 'differe' ? relecture.data?.decisions.find((d) => d.choice === 'differer') : undefined
  const starting = ['brouillon', 'a_completer'].includes(dossier.status.code)

  return (
    <div className="space-y-4">
      <PageTitle subtitle={`${dossier.project.name} · ${dossier.label} · état : ${dossier.status.label}`}>Aujourd’hui</PageTitle>

      {prep.isPending && <Loading label="Chargement du plan…" />}
      {prep.isError && (
        <Alert tone="danger" role="alert" title="Plan indisponible">
          {prep.error.message}{' '}
          <button type="button" className="font-medium underline" onClick={() => prep.refetch()}>Réessayer</button>
        </Alert>
      )}

      {dossier.archived && <ArchivedCard />}

      {!dossier.archived && dossier.status.code === 'differe' && (
        <Card className="border-warn-700/40">
          <h2 className="font-semibold">Projet différé</h2>
          {deferral ? (
            <p className="mt-1">
              Décision du {formatDateTime(deferral.created_at)} : <span className="whitespace-pre-line">{deferral.reason}</span>
            </p>
          ) : (
            <p className="mt-1">Une décision de différer ce projet est enregistrée.</p>
          )}
          <p className="mt-2 text-sm text-muted">
            Le dossier reste modifiable. {owner ? 'Pour reprendre la préparation, enregistrez une nouvelle décision dans ' : 'Voir '}
            <Link to={`/d/${dossier.id}/relecture`} className="text-brand-700 underline">Relecture et échanges</Link>.
          </p>
        </Card>
      )}

      {!owner && <AdvisorPending dossierId={dossier.id} />}

      {active && detailed && starting && (
        <Card>
          <h2 className="font-semibold">Comment avancer</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Dans <strong>Mon projet</strong>, indiquez ce que vous savez. « Je ne sais pas » est une réponse acceptée : elle devient un point à vérifier.</li>
            <li>Dans <strong>Mon plan</strong>, suivez les démarches proposées et notez leur résultat réel.</li>
            <li>Chiffrez le <strong>budget provisoire</strong>, même incomplet.</li>
            <li>Posez vos questions et demandez une relecture à votre conseiller, s'il vous a été attribué.</li>
          </ol>
          <p className="mt-2 text-sm text-muted">Ces étapes organisent la préparation ; elles ne remplacent pas l'avis d'un conseiller sur votre projet.</p>
        </Card>
      )}

      {active && (
        <Card>
          <h2 className="font-semibold">{dossier.status.code === 'differe' ? 'Si vous reprenez la préparation' : 'Ma prochaine action'}</h2>
          {nextAction ? (
            <>
              <p className="mt-1 font-medium">{nextAction.title}</p>
              {detailed && nextAction.explanation && <p className="text-sm text-muted">Pourquoi ? {nextAction.explanation}</p>}
              <Link to={`/d/${dossier.id}/plan/${nextAction.id}`} className="mt-2 inline-block font-medium text-brand-700 underline">
                {detailed ? 'Voir les étapes' : 'Ouvrir la démarche'}
              </Link>
            </>
          ) : nextFact ? (
            <>
              <p className="mt-1 font-medium">Compléter : {nextFact.label}</p>
              {detailed && <p className="text-sm text-muted">Pourquoi ? {nextFact.why}</p>}
              <Link to={`/d/${dossier.id}/projet/${nextFact.key}`} className="mt-2 inline-block font-medium text-brand-700 underline">
                Compléter cette information
              </Link>
              {detailed && <p className="mt-1 text-sm text-muted">« Je ne sais pas » est une réponse acceptée.</p>}
            </>
          ) : (
            prep.isSuccess && <p className="mt-1 text-muted">Aucune démarche ouverte pour l'instant.</p>
          )}
        </Card>
      )}

      {prep.isSuccess && (
        <Card>
          <h2 className="font-semibold">{dossier.archived ? 'Points restés ouverts à l’archivage' : 'Points bloquants'}</h2>
          {blockingChecks.length === 0 && blockedActions.length === 0 ? (
            <p className="mt-1 text-muted">Aucun point bloquant signalé.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {blockingChecks.map((c: Check) => (
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
          {!dossier.archived && (
            <p className="mt-2 text-sm text-muted">Un point bloquant suspend l'étape concernée, pas nécessairement tout le projet.</p>
          )}
        </Card>
      )}

      <Card>
        <h2 className="font-semibold">{owner ? 'Dernier retour du conseiller' : 'Dernier avis donné'}</h2>
        {relecture.isPending && <Loading />}
        {relecture.isError && <p className="mt-1 text-danger-700">Retours indisponibles : {relecture.error.message}</p>}
        {relecture.data && (
          <>
            {relecture.data.advisors.length === 0 && <p className="mt-1">Aucun conseiller n'est attribué à ce dossier pour le moment.</p>}
            {relecture.data.reviews[0] ? (
              <div className="mt-1">
                <p className="font-medium">
                  {relecture.data.reviews[0].verdict_label}{' '}
                  {!relecture.data.reviews[0].current && <Badge tone="warn">À réexaminer</Badge>}
                </p>
                <p className="text-sm text-muted">
                  {relecture.data.reviews[0].advisor.display_name} · {formatDateTime(relecture.data.reviews[0].created_at)}
                </p>
              </div>
            ) : (
              relecture.data.advisors.length > 0 && (
                <p className="mt-1">{owner ? 'Aucun retour pour le moment.' : 'Aucun avis donné pour le moment.'}</p>
              )
            )}
            <Link to={`/d/${dossier.id}/relecture`} className="mt-2 inline-block font-medium text-brand-700 underline">
              {dossier.archived ? 'Consulter la relecture et les échanges' : 'Ouvrir la relecture et les échanges'}
            </Link>
          </>
        )}
      </Card>

      <BudgetCard dossierId={dossier.id} />

      <Card>
        <h2 className="font-semibold">État du dossier</h2>
        <p className="mt-1"><Badge tone="info">{dossier.status.label}</Badge></p>
        <p className="mt-2">
          {plural(counts.total - counts.non_renseigne, 'information renseignée', 'informations renseignées')} sur {counts.total}, dont{' '}
          {plural(counts.verifie, 'vérifiée', 'vérifiées')} et {counts.inconnu} « je ne sais pas ».
        </p>
        {prep.data && (
          <p className="mt-1">
            Démarches : {plural(prep.data.actions.filter((a) => a.status === 'terminee').length, 'terminée', 'terminées')} sur{' '}
            {prep.data.actions.length}.
          </p>
        )}
        <p className="mt-1 text-sm text-muted">Ces compteurs mesurent l'avancement de la préparation, pas les chances de réussite du projet.</p>
        <p className="mt-2 flex flex-wrap gap-x-4">
          <Link to={`/d/${dossier.id}/projet`} className="font-medium text-brand-700 underline">Éléments connus</Link>
          <Link to={`/d/${dossier.id}/plan`} className="font-medium text-brand-700 underline">Points à vérifier</Link>
          <Link to={`/d/${dossier.id}/synthese`} className="font-medium text-brand-700 underline">Synthèse</Link>
        </p>
      </Card>
    </div>
  )
}

function ArchivedCard() {
  const dossier = useCurrentDossier()
  return (
    <Card>
      <h2 className="font-semibold">Dossier archivé : consultation seulement</h2>
      <p className="mt-1">
        {dossier.archived_at ? `Archivé le ${formatDate(dossier.archived_at)}. ` : ''}
        Les informations, démarches, budget, avis et échanges restent consultables tels qu'ils étaient. Plus aucune
        modification n'est possible dans ce dossier.
      </p>
      <p className="mt-2 flex flex-wrap gap-x-4">
        <Link to={`/d/${dossier.id}/synthese`} className="font-medium text-brand-700 underline">Relire la synthèse</Link>
        {dossier.role === 'porteur' && (
          <Link to={`/d/${dossier.id}/projet`} className="font-medium text-brand-700 underline">Préparer une autre campagne pour ce projet</Link>
        )}
      </p>
    </Card>
  )
}

function AdvisorPending({ dossierId }: { dossierId: number }) {
  const dossier = useCurrentDossier()
  return (
    <Card>
      <h2 className="font-semibold">En attente de votre part</h2>
      <ul className="mt-1 space-y-1">
        <li>{dossier.pending.review_requested ? 'Une relecture est demandée.' : 'Aucune relecture demandée.'}</li>
        <li>{plural(dossier.pending.open_questions, 'question ouverte', 'questions ouvertes')}.</li>
      </ul>
      <Link to={`/d/${dossierId}/relecture`} className="mt-2 inline-block font-medium text-brand-700 underline">
        Relecture et échanges
      </Link>
    </Card>
  )
}
