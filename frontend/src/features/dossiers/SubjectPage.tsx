import { Link, useParams } from 'react-router'
import { formatDate } from '../../shared/format'
import { Alert, Badge, ButtonLink, Card, Loading, PageTitle } from '../../shared/ui'
import { usePreparation, type Level } from '../plan/api'
import { QUESTION_STATE, useRelecture } from '../reviews/api'
import { useCurrentDossier } from './DossierLayout'
import { readDeferred } from './deferred'
import { describeValue } from './factDisplay'
import { canEdit, words } from './roles'
import { howKnown, openChecks, SUBJECT_STATE, subjectsFor, subjectState } from './subjects'

const LEVEL_LABEL: Record<Level, string> = { a_completer: 'Pas encore abordé', a_clarifier: 'À éclaircir', a_verifier: 'À confirmer' }

/**
 * Un sujet du dossier : ses informations, les points que le serveur y signale, les démarches et
 * les questions liées. Lecture seule ici : les écritures passent par la fiche de l'information,
 * la démarche ou les échanges.
 */
export function SubjectPage() {
  const dossier = useCurrentDossier()
  const { subjectKey } = useParams()
  const prep = usePreparation(dossier.id)
  const relecture = useRelecture(dossier.id)
  const advisor = dossier.role === 'conseiller'
  const editable = canEdit(dossier)
  const base = `/d/${dossier.id}`
  const subject = subjectsFor(dossier).find((s) => s.key === subjectKey)
  if (!subject) {
    return (
      <Alert tone="danger" title="Sujet introuvable">
        <Link to={base} className="underline">Retour au dossier</Link>
      </Alert>
    )
  }
  const keys = subject.facts.map((f) => f.key)
  const deferred = readDeferred(dossier.id)
  const checks = prep.data?.checks ?? []
  const state = prep.data ? subjectState(subject, checks) : null
  const anyOpen = openChecks(subject, checks).length > 0
  const related = prep.data?.actions.filter((a) => a.related_fact && keys.includes(a.related_fact.key)) ?? []
  const threads = relecture.data?.threads.filter((m) => m.target_type === 'information' && keys.includes(m.target_ref)) ?? []
  const hasAdvisor = (relecture.data?.advisors.length ?? 0) > 0
  const askLabel = advisor ? 'Poser une question au porteur' : hasAdvisor ? 'Poser une question au conseiller' : 'Préparer une question'

  return (
    <div className="space-y-6">
      <p className="no-print">
        <Link to={advisor ? `${base}/projet` : base} className="text-brand-700 underline">
          {advisor ? words(dossier).backToProject : '← Projet'}
        </Link>
      </p>
      <PageTitle subtitle={`${dossier.project.name} · ${dossier.label}`}>{subject.title}</PageTitle>
      {state && (
        <p>
          <Badge tone={SUBJECT_STATE[state].tone}>{dossier.archived ? SUBJECT_STATE[state].archived : SUBJECT_STATE[state].label}</Badge>
        </p>
      )}
      {prep.isPending && <Loading label="Chargement des points à vérifier…" />}
      {prep.isError && (
        <Alert tone="danger" role="alert" title="Points à vérifier indisponibles">
          {prep.error.message}{' '}
          <button type="button" className="font-medium underline" onClick={() => prep.refetch()}>Réessayer</button>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          {subject.facts.map((fact) => {
            const status = fact.state.status
            const check = checks.find((c) => c.fact_key === fact.key && c.level !== 'a_completer')
            const later = status === 'non_renseigne' && deferred.includes(fact.key) && editable
            const lines = describeValue(fact, fact.state.value)
            return (
              <Card key={fact.key} as="article">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{fact.label}</h2>
                  <span className="flex flex-wrap gap-1.5">
                    <Badge tone={status === 'inconnu' ? 'warn' : status === 'verifie' ? 'info' : 'neutral'}>{howKnown(status, advisor)}</Badge>
                    {later && <Badge>Remis à plus tard</Badge>}
                  </span>
                </div>
                {lines.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {lines.map((line) => <li key={line} className="break-words">{line}</li>)}
                  </ul>
                )}
                {fact.state.source && <p className="mt-1 break-words text-sm text-muted">Source ou précision : {fact.state.source}</p>}
                {fact.state.updated_at && (
                  <p className="mt-1 text-xs text-muted">Modifié le {formatDate(fact.state.updated_at)} par {fact.state.updated_by?.display_name}</p>
                )}
                <p className="mt-2 text-sm text-muted">{fact.why}</p>
                {check && (
                  <p className="mt-3 rounded-md border border-warn-700/30 bg-warn-50 px-2 py-1 text-sm text-warn-700">
                    <strong>
                      {dossier.archived ? 'Restait à éclaircir à l’archivage' : LEVEL_LABEL[check.level]}
                      {check.blocking ? ' (bloquant)' : ''} :
                    </strong>{' '}
                    {check.message}.
                    {status === 'verifie' && ' Une information vérifiée peut décrire une situation encore à régler.'}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {editable ? (
                    <ButtonLink to={`${base}/projet/${fact.key}?sujet=${subject.key}`} variant={status === 'non_renseigne' ? 'primary' : 'secondary'}>
                      {status === 'non_renseigne' ? 'Répondre' : 'Mettre à jour'}
                      <span className="sr-only"> : {fact.label}</span>
                    </ButtonLink>
                  ) : (
                    <Link to={`${base}/projet/${fact.key}?sujet=${subject.key}`} className="inline-flex min-h-11 items-center font-medium text-brand-700 underline">
                      Consulter l’information et son historique<span className="sr-only"> : {fact.label}</span>
                    </Link>
                  )}
                  {!dossier.archived && relecture.data && (
                    <Link
                      to={`${base}/relecture?cible=information:${fact.key}#messages`}
                      className="inline-flex min-h-11 items-center px-2 font-medium text-brand-700 underline"
                    >
                      {askLabel}<span className="sr-only"> sur « {fact.label} »</span>
                    </Link>
                  )}
                </div>
              </Card>
            )
          })}
          {prep.isSuccess && !anyOpen && state !== 'non_aborde' && (
            <p className="text-sm text-muted">Rien n'est signalé sur ce sujet par les règles disponibles. Ce n'est pas une validation du projet.</p>
          )}
        </div>

        <aside className="space-y-4" aria-label="Démarches et questions liées">
          <Card>
            <h2 className="font-semibold">Démarches liées</h2>
            {prep.isSuccess && related.length === 0 && (
              <p className="mt-1 text-sm text-muted">
                Aucune démarche pour ce sujet. Elles apparaissent quand une information est inconnue ou reste à confirmer.
              </p>
            )}
            {related.length > 0 && (
              <ul className="mt-2 space-y-3">
                {related.map((a) => (
                  <li key={a.id}>
                    <Link to={`${base}/plan/${a.id}`} className="font-medium text-brand-700 underline">{a.title}</Link>
                    <span className="block text-sm text-muted">
                      {a.status === 'terminee'
                        ? `Terminée${a.result_outcome_label ? ` · résultat ${a.result_outcome_label.toLowerCase()}` : ''}`
                        : dossier.archived
                          ? 'Restait à faire à l’archivage'
                          : a.status_label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <h2 className="font-semibold">Questions sur ce sujet</h2>
            {relecture.isPending && <Loading />}
            {relecture.isError && <p className="mt-1 text-sm text-danger-700">Échanges indisponibles : {relecture.error.message}</p>}
            {relecture.data && threads.length === 0 && <p className="mt-1 text-sm text-muted">Aucune question pour l’instant.</p>}
            {threads.length > 0 && (
              <ul className="mt-2 space-y-3">
                {threads.map((m) => (
                  <li key={m.id}>
                    <p className="text-sm break-words">« {m.body} »</p>
                    {m.state && <Badge tone={QUESTION_STATE[m.state].tone}>{QUESTION_STATE[m.state].label}</Badge>}
                  </li>
                ))}
              </ul>
            )}
            <Link to={`${base}/relecture#messages`} className="mt-2 inline-block font-medium text-brand-700 underline">Tous les échanges</Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
