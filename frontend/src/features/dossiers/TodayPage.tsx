import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { formatDate, formatDateTime, plural } from '../../shared/format'
import { Alert, Badge, ButtonLink, Card, Loading, PageTitle } from '../../shared/ui'
import { usePreparation, type Check } from '../plan/api'
import { useRelecture, type Message } from '../reviews/api'
import { useCurrentDossier } from './DossierLayout'
import { factCounts } from './ProjectPage'
import { useBudget } from '../budget/api'
import { budgetSentence } from '../budget/BudgetPage'
import { advisorHome, ownerHome, type HomePlan } from './priority'
import { readDeferred } from './deferred'
import { canEdit } from './roles'
import { FIRST_KEYS, openChecks, shortValue, SUBJECT_STATE, subjectsFor, subjectState } from './subjects'

/** Accueil du dossier : synthèse pour le porteur, accueil existant pour le conseiller. */
export function TodayPage() {
  const dossier = useCurrentDossier()
  return dossier.role === 'porteur' ? <OwnerSynthesis /> : <AdvisorToday />
}

/**
 * Synthèse du porteur (direction retenue après UX2) : un résumé bref de ce qui est indiqué, une
 * action principale avec sa raison, les autres possibilités, puis les sujets ; l'état du dossier
 * dans un seul panneau. Tout vient du serveur ; l'ordre des actions suit `priority.ts`.
 */
function OwnerSynthesis() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const relecture = useRelecture(dossier.id)
  const [params] = useSearchParams()
  const first = params.get('premiere') === '1'
  const active = canEdit(dossier)
  const deferred = active ? readDeferred(dossier.id) : []
  const toAnswer = relecture.data?.threads.filter((m) => m.state === 'a_repondre') ?? []
  const home = prep.data && !relecture.isPending ? ownerHome(dossier, prep.data, toAnswer.length, deferred) : null
  const subjects = subjectsFor(dossier)
  const summary = FIRST_KEYS.map((k) => dossier.facts.find((f) => f.key === k)).filter((f) => f !== undefined)
  const base = `/d/${dossier.id}`

  return (
    <div className="space-y-6">
      <PageTitle subtitle={`${dossier.label} · ${dossier.project.profile_label} · état : ${dossier.status.label}`}>
        {dossier.project.name}
      </PageTitle>

      <section aria-labelledby="resume" className="space-y-2">
        <h2 id="resume" className="font-semibold">
          {first ? 'Votre point de départ' : dossier.archived ? 'Ce qui était indiqué' : 'Ce que vous avez indiqué'}
        </h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
          {summary.map((f) => {
            const known = !['non_renseigne', 'inconnu'].includes(f.state.status)
            return (
              <li key={f.key} className="text-sm">
                <span className="text-muted">{f.label} : </span>
                <span className={known ? 'font-medium' : 'italic text-muted'}>{shortValue(f, deferred.includes(f.key))}</span>
              </li>
            )
          })}
        </ul>
        {first && (
          <p className="text-sm text-muted">
            Ce n'est pas un avis sur la faisabilité : c'est ce qui est connu, ce qui ne l'est pas encore, et une première étape.
          </p>
        )}
      </section>

      {prep.isError && (
        <Alert tone="danger" role="alert" title="Démarches indisponibles">
          {prep.error.message}{' '}
          <button type="button" className="font-medium underline" onClick={() => prep.refetch()}>Réessayer</button>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          {dossier.archived && <ArchivedCard />}
          {!dossier.archived && dossier.status.code === 'differe' && <DecisionCard />}
          {active && !home && !prep.isError && <Loading label="Chargement de la prochaine étape…" />}
          {active && home && (
            <>
              <HomeActions plan={home} dossierId={dossier.id} advisor={false} />
              <p className="text-sm text-muted">
                Ou bien : <Link to={`${base}/plan`} className="font-medium text-brand-700 underline">choisir une autre démarche</Link>
                {' · '}
                <Link to={`${base}/projet/budget`} className="font-medium text-brand-700 underline">préparer le budget</Link>
                {' · '}compléter un sujet ci-dessous.
              </p>
            </>
          )}
          <SubjectList subjects={subjects} deferred={deferred} />
        </div>

        <aside className="space-y-4" aria-label="État du dossier">
          <StatePanel />
          <ExchangesCard toAnswer={toAnswer} />
          {!dossier.archived && dossier.status.code !== 'differe' && <DecisionCard />}
        </aside>
      </div>
    </div>
  )
}

/** Les sujets, une ligne chacun : état déduit du serveur, premier point ouvert, démarches liées. */
function SubjectList({ subjects, deferred }: { subjects: ReturnType<typeof subjectsFor>; deferred: string[] }) {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const base = `/d/${dossier.id}`
  const checks = prep.data?.checks ?? []
  return (
    <section aria-labelledby="sujets" className="space-y-2">
      <h2 id="sujets" className="text-lg font-semibold">{dossier.archived ? 'Les sujets à l’archivage' : 'Les sujets du dossier'}</h2>
      <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
        {subjects.map((subject) => {
          const state = prep.data ? subjectState(subject, checks) : null
          const open = openChecks(subject, checks)[0]
          const keys = subject.facts.map((f) => f.key)
          const related = prep.data?.actions.filter((a) => a.related_fact && keys.includes(a.related_fact.key)).length ?? 0
          const untouched = subject.facts.every((f) => f.state.status === 'non_renseigne')
          const later = untouched && subject.facts.some((f) => deferred.includes(f.key))
          let line = ''
          if (open) line = open.message
          else if (state === 'non_aborde') line = untouched ? (later ? 'Remis à plus tard' : 'Pas encore abordé') : 'Certaines informations restent à donner'
          else if (state === 'rien_signale') line = 'Rien n’est signalé par les règles disponibles'
          return (
            <li key={subject.key}>
              <Link
                to={`${base}/sujet/${subject.key}`}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 hover:bg-canvas focus-visible:bg-canvas"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{subject.title}</span>
                  <span className="block text-sm text-muted">
                    {line}
                    {related > 0 ? `${line ? ' · ' : ''}${plural(related, 'démarche', 'démarches')}` : ''}
                  </span>
                </span>
                {state && (
                  <Badge tone={SUBJECT_STATE[state].tone}>
                    {dossier.archived ? SUBJECT_STATE[state].archived : SUBJECT_STATE[state].label}
                  </Badge>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="text-sm text-muted">
        Le détail, les démarches et les questions de chaque sujet s'ouvrent en le sélectionnant. « Rien de signalé » n'est
        pas une validation.{' '}
        <Link to={`${base}/projet`} className="font-medium text-brand-700 underline">
          {dossier.role === 'conseiller' ? 'Toutes les informations du porteur' : 'Toutes les informations'}
        </Link>
      </p>
    </section>
  )
}

/** Un seul panneau d'état : informations renseignées, démarches, budget, contenu utilisé. */
function StatePanel() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const budget = useBudget(dossier.id)
  const counts = factCounts(dossier)
  const base = `/d/${dossier.id}`
  const actions = prep.data?.actions ?? []
  const done = actions.filter((a) => a.status === 'terminee').length
  const blocked = actions.filter((a) => a.status === 'bloquee')
  const open = actions.length - done
  const template = prep.data?.template
  const filled = counts.declare + counts.estime + counts.verifie
  return (
    <Card>
      <h2 className="font-semibold">État du dossier</h2>
      <dl className="mt-1 divide-y divide-line text-sm">
        <div className="py-2">
          <dt className="font-medium">Informations</dt>
          <dd>
            {plural(filled, 'renseignée', 'renseignées')} · {plural(counts.inconnu, 'inconnue', 'inconnues')} ·{' '}
            {counts.non_renseigne} pas encore abordée{counts.non_renseigne > 1 ? 's' : ''}
          </dd>
        </div>
        <div className="py-2">
          <dt className="font-medium">Démarches</dt>
          <dd>
            {prep.data ? (
              <>
                {dossier.archived ? `À l’archivage : ${open} restai${open > 1 ? 'ent' : 't'} à faire` : plural(open, 'ouverte', 'ouvertes')}
                {blocked.length > 0 ? `, dont ${plural(blocked.length, 'bloquée', 'bloquées')}` : ''} · {plural(done, 'terminée', 'terminées')}.{' '}
                <Link to={`${base}/plan`} className="font-medium text-brand-700 underline">Voir les démarches</Link>
                {blocked.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {blocked.map((a) => (
                      <li key={a.id}>
                        <Link to={`${base}/plan/${a.id}`} className="text-brand-700 underline">{a.title}</Link>{' '}
                        <Badge tone="danger">Bloquée</Badge>
                        {a.blocked_reason && <span className="block text-muted">Motif : {a.blocked_reason}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : prep.isError ? (
              'indisponibles.'
            ) : (
              '…'
            )}
          </dd>
        </div>
        <div className={`py-2 ${budget.data?.totals.overall.status === 'incomplet' ? 'text-warn-700' : ''}`}>
          <dt className="font-medium">Budget</dt>
          <dd>
            {budget.isError ? 'indisponible.' : budget.data ? budgetSentence(budget.data.totals.overall) : '…'}{' '}
            <Link to={`${base}/projet/budget`} className="font-medium text-brand-700 underline">Ouvrir le budget</Link>
          </dd>
        </div>
      </dl>
      <p className="mt-1 text-xs text-muted">
        Ces compteurs mesurent l'avancement de la préparation, pas les chances de réussite du projet.
        {template ? ` Démarches proposées à partir d’un contenu générique (${template.review_label.toLowerCase()}).` : ''}
      </p>
    </Card>
  )
}

/** Accueil du conseiller : ses interventions, les points bloquants et l'état du dossier. */
function AdvisorToday() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const relecture = useRelecture(dossier.id)

  // Les informations vides bloquantes sont regroupées : la liste ne répète pas « non renseigné ».
  const blockingChecks = prep.data?.checks.filter((c) => c.blocking && c.level !== 'a_completer') ?? []
  const blockingEmpty = prep.data?.checks.filter((c) => c.blocking && c.level === 'a_completer') ?? []
  const blockedActions = prep.data?.actions.filter((a) => a.status === 'bloquee') ?? []
  // Qui doit agir dans les échanges : état calculé par le serveur pour la personne connectée.
  const toAnswer = relecture.data?.threads.filter((m) => m.state === 'a_repondre') ?? []
  // Action principale : une seule, calculée à un seul endroit, une fois le plan et les échanges lus.
  const home = prep.data && relecture.data ? advisorHome(dossier, relecture.data) : null

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

      {!dossier.archived && dossier.status.code === 'differe' && <DecisionCard />}

      {!dossier.archived && home && <HomeActions plan={home} dossierId={dossier.id} advisor />}

      <ExchangesCard toAnswer={toAnswer} />

      {!dossier.archived && dossier.status.code !== 'differe' && <DecisionCard />}

      <SubjectList subjects={subjectsFor(dossier)} deferred={[]} />

      {prep.isSuccess && (
        <Card>
          <h2 className="font-semibold">{dossier.archived ? 'Points restés ouverts à l’archivage' : 'Points bloquants'}</h2>
          {blockingEmpty.length > 0 && (
            <p className="mt-1">
              {blockingEmpty.length === 1 ? 'Information bloquante non renseignée' : 'Informations bloquantes non renseignées'} :{' '}
              {blockingEmpty.map((c) => c.fact_label).join(', ')}.
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

      <SummaryCard />

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

/**
 * Dernière décision du porteur (poursuivre, modifier, différer) : la sienne, pas un avis du
 * conseiller ni une approbation d'AGRIA. Si le dossier a changé depuis, on le dit, sans statut
 * de validité.
 */
function DecisionCard() {
  const dossier = useCurrentDossier()
  const relecture = useRelecture(dossier.id)
  const differe = dossier.status.code === 'differe'
  const decision = relecture.data?.decisions[0]
  if (!decision) {
    return differe ? (
      <Card className="border-warn-700/40">
        <h2 className="font-semibold">Projet différé</h2>
        <p className="mt-1">Une décision de différer ce projet est enregistrée.</p>
      </Card>
    ) : null
  }
  const changed = relecture.data
    ? Object.entries(relecture.data.versions).some(([k, v]) => decision.versions[k as keyof typeof decision.versions] !== v)
    : false
  return (
    <Card className={differe ? 'border-warn-700/40' : ''}>
      <h2 className="font-semibold">{differe ? 'Projet différé' : 'Dernière décision du porteur'}</h2>
      <p className="mt-1">
        <strong>{decision.choice_label}</strong>{' '}
        <span className="text-sm text-muted">
          — décision de {decision.author.display_name}, {formatDateTime(decision.created_at)}
        </span>
      </p>
      <p className="mt-1 whitespace-pre-line">Motif : {decision.reason}</p>
      <p className="mt-1 text-sm text-muted">
        C'est une décision du porteur, distincte de l'avis du conseiller
        {decision.choice === 'poursuivre' ? ' ; « Poursuivre » n’est pas une approbation d’AGRIA.' : '.'}
        {changed && ' Le dossier a été modifié depuis cette décision.'}
        {differe && ' Le dossier reste modifiable.'}
      </p>
    </Card>
  )
}

/** Résumé : état, informations, démarches et budget, avec les liens vers le détail. */
function SummaryCard() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  const budget = useBudget(dossier.id)
  const counts = factCounts(dossier)
  return (
    <Card>
      <h2 className="font-semibold">Résumé du dossier</h2>
      <ul className="mt-1 space-y-1">
        <li>
          État : <Badge tone="info">{dossier.status.label}</Badge>
        </li>
        <li>
          {plural(counts.total - counts.non_renseigne, 'information renseignée', 'informations renseignées')} sur {counts.total}, dont{' '}
          {plural(counts.verifie, 'vérifiée', 'vérifiées')} et {counts.inconnu} « je ne sais pas ».
        </li>
        {prep.data && (
          <li>
            Démarches : {plural(prep.data.actions.filter((a) => a.status === 'terminee').length, 'terminée', 'terminées')} sur{' '}
            {prep.data.actions.length}.
          </li>
        )}
        <li className={budget.data?.totals.overall.status === 'incomplet' ? 'text-warn-700' : ''}>
          Budget : {budget.isError ? 'indisponible.' : budget.data ? budgetSentence(budget.data.totals.overall) : '…'}
        </li>
      </ul>
      <p className="mt-1 text-sm text-muted">Ces compteurs mesurent l'avancement de la préparation, pas les chances de réussite du projet.</p>
      <p className="mt-2 flex flex-wrap gap-x-4">
        <Link to={`/d/${dossier.id}/projet`} className="font-medium text-brand-700 underline">Éléments connus</Link>
        <Link to={`/d/${dossier.id}/plan`} className="font-medium text-brand-700 underline">Points à vérifier</Link>
        <Link to={`/d/${dossier.id}/projet/budget`} className="font-medium text-brand-700 underline">Budget provisoire</Link>
        <Link to={`/d/${dossier.id}/synthese`} className="font-medium text-brand-700 underline">Synthèse</Link>
      </p>
    </Card>
  )
}
