import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { formatDate, formatDateTime, plural } from '../../shared/format'
import { Alert, Badge, ButtonLink, Card, Loading, PageTitle } from '../../shared/ui'
import { usePreparation, type Check } from '../plan/api'
import { useRelecture, type Message } from '../reviews/api'
import { useCurrentDossier } from './DossierLayout'
import { isDetailed } from './guidance'
import { BudgetCard, factCounts } from './ProjectPage'
import { advisorHome, ownerHome, type HomePlan } from './priority'

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
  // Qui doit agir dans les échanges : état calculé par le serveur pour la personne connectée.
  const toAnswer = relecture.data?.threads.filter((m) => m.state === 'a_repondre') ?? []
  const stepByStep = active && dossier.project.profile === 'debutant' && counts.non_renseigne > 0
  // Action principale : une seule, calculée à un seul endroit, une fois le plan et les échanges lus.
  const home =
    prep.data && !relecture.isPending
      ? owner
        ? ownerHome(dossier, prep.data, toAnswer.length)
        : relecture.data
          ? advisorHome(dossier, relecture.data)
          : null
      : null

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

      {!dossier.archived && home && (owner || !relecture.isError) && <HomeActions plan={home} dossierId={dossier.id} advisor={!owner} />}

      <ExchangesCard toAnswer={toAnswer} />

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

/** Une seule action mise en avant ; les autres restent accessibles juste dessous. */
function HomeActions({ plan, dossierId, advisor }: { plan: HomePlan; dossierId: number; advisor: boolean }) {
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
      ) : advisor ? (
        <Card>
          <h2 className="font-semibold">Aucune intervention attendue de vous pour l’instant</h2>
          <p className="mt-1 text-sm text-muted">
            Aucune question n'attend votre réponse et aucune relecture n'est demandée. Vous pouvez consulter le projet,
            le plan et les échanges, ou donner un avis à tout moment.
          </p>
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

/**
 * Échanges et relecture, du point de vue de la personne connectée : ce qui l'attend, ce qu'elle
 * attend, les réponses reçues, la relecture demandée et le dernier avis. Rien n'est affirmé avant
 * d'avoir lu les échanges ; aucune réponse future n'est promise.
 */
function ExchangesCard({ toAnswer }: { toAnswer: Message[] }) {
  const dossier = useCurrentDossier()
  const relecture = useRelecture(dossier.id)
  const owner = dossier.role === 'porteur'
  const other = owner ? 'du conseiller' : 'du porteur'
  const count = (state: string) => relecture.data?.threads.filter((m) => m.state === state).length ?? 0
  const awaiting = count('en_attente_reponse')
  const received = count('reponse_recue')
  const answered = count('repondu')
  const request = relecture.data?.requests.find((r) => !r.answered)
  const review = relecture.data?.reviews[0]
  const noAdvisor = relecture.data?.advisors.length === 0
  const lines: ReactNode[] = []
  if (relecture.data) {
    if (noAdvisor) {
      lines.push("Aucun conseiller n'est attribué à ce dossier pour le moment : aucune réponse ni aucun avis ne peut être promis.")
    }
    if (toAnswer.length > 0) {
      lines.push(
        <strong className="text-warn-700">
          {toAnswer.length === 1 ? `Une question ${other} attend votre réponse` : `${toAnswer.length} questions ${other} attendent votre réponse`} :{' '}
          {toAnswer.map((m) => (m.target_label ? `« ${m.target_label} »` : 'le dossier')).join(', ')}.
        </strong>,
      )
    }
    if (received > 0) lines.push(`Réponse reçue à ${received === 1 ? 'une de vos questions' : `${received} de vos questions`} ; l'échange reste ouvert tant qu'il n'est pas marqué résolu.`)
    if (awaiting > 0) lines.push(`${awaiting === 1 ? 'Une question' : `${awaiting} questions`} en attente d'une réponse ${other}.`)
    if (answered > 0) lines.push(`Vous avez répondu à ${answered === 1 ? 'une question' : `${answered} questions`} ; ${answered === 1 ? 'elle reste ouverte' : 'elles restent ouvertes'} tant qu'elle${answered === 1 ? " n'est pas marquée résolue" : "s ne sont pas marquées résolues"}.`)
    if (request) {
      lines.push(
        owner
          ? `Relecture demandée le ${formatDateTime(request.created_at)} — aucun avis reçu depuis.`
          : `Relecture demandée le ${formatDateTime(request.created_at)} par ${request.requested_by.display_name} — aucun avis depuis.`,
      )
    }
    if (review) {
      lines.push(
        <>
          Dernier avis du conseiller : <strong>{review.verdict_label}</strong> ({review.advisor.display_name},{' '}
          {formatDateTime(review.created_at)}){' '}
          {review.current ? <Badge tone="ok">À jour</Badge> : <Badge tone="warn">À réexaminer</Badge>}
          {!review.current && owner && <span className="block text-sm text-muted">Le dossier a changé depuis cet avis ; vous pouvez demander une nouvelle relecture.</span>}
        </>,
      )
    }
    if (lines.length === 0) lines.push('Aucune question en cours, aucune relecture demandée, aucun avis pour le moment.')
  }
  return (
    <section aria-labelledby="echanges" className="rounded-lg border border-line bg-surface p-4">
      <h2 id="echanges" className="font-semibold">Échanges et relecture</h2>
      {relecture.isPending && <Loading />}
      {relecture.isError && (
        <p className="mt-1 text-danger-700">
          Échanges indisponibles : {relecture.error.message}{' '}
          <button type="button" className="font-medium underline" onClick={() => relecture.refetch()}>Réessayer</button>
        </p>
      )}
      {lines.length > 0 && (
        <ul className="mt-1 space-y-1">
          {lines.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      )}
      {relecture.data && (
        <Link to={`/d/${dossier.id}/relecture`} className="mt-2 inline-block font-medium text-brand-700 underline">
          {dossier.archived ? 'Consulter la relecture et les échanges' : 'Ouvrir la relecture et les échanges'}
        </Link>
      )}
    </section>
  )
}
