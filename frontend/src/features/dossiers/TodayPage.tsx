import { Link } from 'react-router'
import { formatDate, formatDateTime, plural } from '../../shared/format'
import { Alert, Badge, ButtonLink, Card, Loading, PageTitle } from '../../shared/ui'
import { usePreparation, type Check } from '../plan/api'
import { useRelecture } from '../reviews/api'
import { useCurrentDossier } from './DossierLayout'
import { isDetailed } from './guidance'
import { BudgetCard, factCounts } from './ProjectPage'
import { ownerHome, type HomePlan } from './priority'

/** Accueil : prochaine démarche, points bloquants, état du dossier, retours disponibles. */
export function TodayPage() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const relecture = useRelecture(dossier.id)
  const counts = factCounts(dossier)
  const owner = dossier.role === 'porteur'
  const active = owner && !dossier.archived
  const detailed = isDetailed(dossier)

  // Les informations vides bloquantes sont regroupées : la liste ne répète pas « non renseigné ».
  const blockingChecks = prep.data?.checks.filter((c) => c.blocking && c.level !== 'a_completer') ?? []
  const blockingEmpty = prep.data?.checks.filter((c) => c.blocking && c.level === 'a_completer') ?? []
  const blockedActions = prep.data?.actions.filter((a) => a.status === 'bloquee') ?? []
  const deferral = dossier.status.code === 'differe' ? relecture.data?.decisions.find((d) => d.choice === 'differer') : undefined
  const starting = ['brouillon', 'a_completer'].includes(dossier.status.code)
  // Échanges qui demandent l'attention du porteur : questions du conseiller sans réponse de sa part,
  // et ses propres questions auxquelles le conseiller a répondu.
  const threads = relecture.data?.threads ?? []
  const toAnswer = threads.filter(
    (m) => m.kind === 'question' && m.author_role === 'conseiller' && !m.resolved_at && !m.replies.some((r) => r.author_role === 'porteur'),
  )
  const answered = threads.filter(
    (m) => m.kind === 'question' && m.author_role === 'porteur' && !m.resolved_at && m.replies.some((r) => r.author_role === 'conseiller'),
  )
  const stepByStep = active && dossier.project.profile === 'debutant' && counts.non_renseigne > 0
  // Action principale : une seule, calculée à un seul endroit, une fois le plan et les échanges lus.
  const home = prep.data && !relecture.isPending ? ownerHome(dossier, prep.data, toAnswer.length) : null

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
          <p className="mt-2 text-sm text-muted">Le dossier reste modifiable.</p>
        </Card>
      )}

      {!owner && <AdvisorPending dossierId={dossier.id} />}

      {active && home && <HomeActions plan={home} dossierId={dossier.id} />}

      {active && detailed && starting && (
        <Card>
          <h2 className="font-semibold">Comment avancer</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              {stepByStep
                ? <>Renseignez votre projet, pas à pas ou dans <strong>Mon projet</strong>.</>
                : <>Dans <strong>Mon projet</strong>, indiquez ce que vous savez. « Je ne sais pas » est une réponse acceptée : elle devient un point à vérifier.</>}
            </li>
            <li>Dans <strong>Mon plan</strong>, suivez les démarches proposées et notez leur résultat réel.</li>
            <li>Chiffrez le <strong>budget provisoire</strong>, même incomplet.</li>
            <li>Posez vos questions et demandez une relecture à votre conseiller, s'il vous a été attribué.</li>
          </ol>
          <p className="mt-2 text-sm text-muted">Ces étapes organisent la préparation ; elles ne remplacent pas l'avis d'un conseiller sur votre projet.</p>
        </Card>
      )}

      {prep.isSuccess && (
        <Card>
          <h2 className="font-semibold">{dossier.archived ? 'Points restés ouverts à l’archivage' : 'Points bloquants'}</h2>
          {blockingEmpty.length > 0 && (
            <p className="mt-1">
              {blockingEmpty.length === 1 ? 'Information bloquante non renseignée' : 'Informations bloquantes non renseignées'} :{' '}
              {blockingEmpty.map((c) => c.fact_label).join(', ')}.{' '}
              {active && (
                <Link
                  to={stepByStep ? `/d/${dossier.id}/projet/pas-a-pas` : `/d/${dossier.id}/projet/${blockingEmpty[0]!.fact_key}`}
                  className="text-brand-700 underline"
                >
                  {stepByStep ? 'Renseigner pas à pas' : 'Compléter'}
                </Link>
              )}
            </p>
          )}
          {blockingChecks.length === 0 && blockedActions.length === 0 && blockingEmpty.length === 0 ? (
            <p className="mt-1 text-muted">
              Aucun point bloquant n'est signalé par les règles disponibles. Ce n'est pas une validation du projet.
            </p>
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
            {owner && toAnswer.length > 0 && (
              <p className="mt-1 font-medium text-warn-700">
                {toAnswer.length === 1 ? 'Une question du conseiller attend votre réponse' : `${toAnswer.length} questions du conseiller attendent votre réponse`} :{' '}
                {toAnswer.map((m) => (m.target_label ? `« ${m.target_label} »` : 'le dossier')).join(', ')}.
              </p>
            )}
            {owner && answered.length > 0 && (
              <p className="mt-1">
                {answered.length === 1 ? 'Le conseiller a répondu à votre question.' : `Le conseiller a répondu à ${answered.length} de vos questions.`}
              </p>
            )}
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
              relecture.data.advisors.length > 0 && toAnswer.length === 0 && answered.length === 0 && (
                <p className="mt-1">{owner ? 'Aucun retour pour le moment.' : 'Aucun avis donné pour le moment.'}</p>
              )
            )}
            <Link
              to={`/d/${dossier.id}/relecture${owner && toAnswer.length > 0 && !dossier.archived ? '#messages' : ''}`}
              className="mt-2 inline-block font-medium text-brand-700 underline"
            >
              {dossier.archived
                ? 'Consulter la relecture et les échanges'
                : owner && toAnswer.length > 0
                  ? 'Répondre au conseiller'
                  : 'Ouvrir la relecture et les échanges'}
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

/** Une seule action mise en avant ; les autres restent accessibles juste dessous. */
function HomeActions({ plan, dossierId }: { plan: HomePlan; dossierId: number }) {
  const { primary, secondary } = plan
  return (
    <>
      {primary ? (
        <Card className="border-brand-700 ring-1 ring-brand-700">
          <p className="text-sm font-medium text-brand-800">À faire maintenant · {primary.heading}</p>
          <h2 className="mt-1 text-lg font-semibold">{primary.title}</h2>
          {primary.why && <p className="mt-1 text-sm text-muted">{primary.why}</p>}
          <ButtonLink to={primary.to} className="mt-3">{primary.label}</ButtonLink>
        </Card>
      ) : (
        <Card>
          <h2 className="font-semibold">Aucune démarche ouverte pour l’instant</h2>
          <p className="mt-1 text-sm text-muted">
            Les démarches apparaissent quand une information est inconnue ou reste à vérifier. Vous pouvez compléter le
            budget provisoire ou demander une relecture.
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4">
            <Link to={`/d/${dossierId}/projet/budget`} className="font-medium text-brand-700 underline">Budget provisoire</Link>
            <Link to={`/d/${dossierId}/relecture`} className="font-medium text-brand-700 underline">Relecture et échanges</Link>
          </p>
        </Card>
      )}
      {secondary.length > 0 && (
        <section aria-labelledby="aussi-possible" className="rounded-lg border border-line bg-surface p-4">
          <h2 id="aussi-possible" className="font-semibold">Aussi possible</h2>
          <ul className="mt-2 space-y-2">
            {secondary.map((a) => (
              <li key={a.key}>
                <span className="text-sm text-muted">{a.heading} : </span>
                <Link to={a.to} className="font-medium text-brand-700 underline">{a.title}</Link>
                {a.why && <span className="block text-sm text-muted">{a.why}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
