import { useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { formatDate, formatDateTime, todayInDakar } from '../../shared/format'
import { Alert, Badge, Button, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { useCurrentDossier } from '../dossiers/DossierLayout'
import { isDetailed } from '../dossiers/guidance'
import { canEdit, words } from '../dossiers/roles'
import { ACTION_TONE, preparationKey, useActionHistory, usePreparation, useUpdateAction, type ActionStatus, type PlanAction, type ResultOutcome } from './api'

const OUTCOMES: { value: ResultOutcome; label: string; help: string }[] = [
  { value: 'favorable', label: 'Favorable', help: 'La vérification confirme une situation qui convient.' },
  { value: 'defavorable', label: 'Défavorable', help: 'Elle révèle une difficulté (pas d’accord, pas d’eau, pas d’acheteur…).' },
  { value: 'incertain', label: 'Incertain', help: 'La réponse reste partielle ou doit encore être confirmée.' },
]

const STATUS_LABEL: Record<ActionStatus, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  bloquee: 'Bloquée',
  terminee: 'Terminée',
}

export function ActionPage() {
  const dossier = useCurrentDossier()
  const { actionId } = useParams()
  const prep = usePreparation(dossier.id)
  if (prep.isPending) return <Loading />
  if (prep.isError) return <Alert tone="danger" role="alert">{prep.error.message}</Alert>
  const action = prep.data.actions.find((a) => a.id === Number(actionId))
  if (!action) {
    return (
      <div role="alert">
        <PageTitle>Démarche introuvable</PageTitle>
        <Link to={`/d/${dossier.id}/plan`} className="text-brand-700 underline">Retour au plan</Link>
      </div>
    )
  }
  const editable = dossier.role === 'porteur' && !dossier.archived

  return (
    <div className="space-y-6">
      <p><Link to={`/d/${dossier.id}/plan`} className="text-brand-700 underline">{words(dossier).backToPlan}</Link></p>
      <PageTitle subtitle={action.goal}>{action.title}</PageTitle>
      <p className="flex flex-wrap items-center gap-2">
        <Badge tone={ACTION_TONE[action.status]}>{action.status_label}</Badge>
        {action.due_date && <span className="text-sm text-muted">Échéance : {formatDate(action.due_date)}</span>}
      </p>

      {action.status === 'bloquee' && <Alert tone="danger" title="Bloquée">{action.blocked_reason}</Alert>}
      {action.status === 'terminee' && (
        <Alert tone="neutral" title={`Résultat${action.result_date ? ` du ${formatDate(action.result_date)}` : ''}${action.result_outcome_label ? ` — ${action.result_outcome_label.toLowerCase()}` : ''}`}>
          <p className="whitespace-pre-line">{action.result_text}</p>
        </Alert>
      )}
      {action.status === 'terminee' && <NextStep dossier={dossier} action={action} />}

      <Card>
        <h2 className="font-semibold">Pourquoi ?</h2>
        <p className="mt-1">{action.explanation || 'Démarche ajoutée par le porteur du projet.'}</p>
        {action.definition_key && (
          <p className="mt-1 text-sm text-muted">
            {action.linked_check
              ? `Point toujours signalé : ${action.linked_check.message}.`
              : 'Le point qui a motivé cette démarche n’est plus signalé dans le dossier.'}
          </p>
        )}
      </Card>

      {action.steps.length > 0 && (
        <Card>
          <details open={isDetailed(dossier)}>
            <summary className="cursor-pointer font-semibold">Étapes proposées ({action.steps.length})</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {action.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            {isDetailed(dossier) && dossier.role === 'porteur' && !dossier.archived && (
              <p className="mt-2 text-sm text-muted">
                Une étape n'est pas claire ? Posez la question à votre conseiller depuis le bas de cette page.
              </p>
            )}
          </details>
        </Card>
      )}

      {action.prerequisites.length > 0 && (
        <Card>
          <h2 className="font-semibold">À faire avant</h2>
          <ul className="mt-2 space-y-1">
            {action.prerequisites.map((p) => (
              <li key={p.id}>
                <Link to={`/d/${dossier.id}/plan/${p.id}`} className="text-brand-700 underline">{p.title}</Link>{' '}
                <Badge tone={p.done ? 'ok' : 'neutral'}>{p.done ? 'Terminée' : 'Pas encore terminée'}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {editable && <StatusForm dossierId={dossier.id} action={action} />}
      {!dossier.archived && (
        <p>
          <Link to={`/d/${dossier.id}/relecture?cible=demarche:${action.id}#messages`} className="font-medium text-brand-700 underline">
            Poser une question sur cette démarche
          </Link>
        </p>
      )}
      <ActionHistory dossierId={dossier.id} actionId={action.id} />
    </div>
  )
}

type Mode = 'idle' | 'terminer' | 'bloquer' | 'echeance'

function StatusForm({ dossierId, action }: { dossierId: number; action: PlanAction }) {
  const update = useUpdateAction(dossierId, action.id)
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Mode>('idle')
  const [result, setResult] = useState('')
  const [outcome, setOutcome] = useState<ResultOutcome | ''>('')
  const [resultDate, setResultDate] = useState(todayInDakar())
  const [reason, setReason] = useState(action.blocked_reason)
  const [due, setDue] = useState(action.due_date ?? '')
  const [done, setDone] = useState<string | null>(null)
  useUnsavedChanges(
    (mode === 'terminer' && (result.trim() !== '' || outcome !== '')) ||
      (mode === 'bloquer' && reason !== action.blocked_reason) ||
      (mode === 'echeance' && due !== (action.due_date ?? '')),
  )
  const error = update.error instanceof ApiError ? update.error : null

  function send(body: Parameters<typeof update.mutate>[0], message: string) {
    setDone(null)
    update.mutate(body, {
      onSuccess: async (r) => {
        // Le message n'apparaît qu'avec l'état relu : jamais « terminée » à côté d'un statut périmé.
        await queryClient.refetchQueries({ queryKey: preparationKey(dossierId) }, { cancelRefetch: false })
        setDone(r.changed ? message : 'Aucun changement à enregistrer.')
        setMode('idle')
      },
    })
  }
  const base = { expected_version: action.row_version }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (mode === 'terminer') {
      send(
        { ...base, status: 'terminee', result_text: result, result_date: resultDate, result_outcome: outcome },
        'Démarche terminée, résultat enregistré.',
      )
    }
    if (mode === 'bloquer') send({ ...base, status: 'bloquee', blocked_reason: reason }, 'Blocage enregistré.')
    if (mode === 'echeance') send({ ...base, due_date: due || null }, 'Échéance enregistrée.')
  }

  return (
    <Card>
      <h2 className="font-semibold">Où en est la démarche</h2>
      {done && <p role="status" className="mt-2 font-medium text-ok-700">{done}</p>}
      {error && (
        <div className="mt-2">
          <Alert tone="danger" role="alert" title={error.code === 'conflit' ? 'Modification refusée' : 'Non enregistré'}>
            {error.message}
          </Alert>
        </div>
      )}
      {mode === 'idle' && (
        <div className="mt-3 flex flex-wrap gap-2">
          {action.status !== 'en_cours' && action.status !== 'terminee' && (
            <Button busy={update.isPending} onClick={() => send({ ...base, status: 'en_cours' }, 'Démarche commencée.')}>
              Commencer
            </Button>
          )}
          {action.status !== 'terminee' && (
            <Button variant="secondary" onClick={() => setMode('terminer')} disabled={!action.prerequisites_met}>
              Terminer et indiquer le résultat
            </Button>
          )}
          {action.status !== 'bloquee' && action.status !== 'terminee' && (
            <Button variant="danger" onClick={() => setMode('bloquer')}>Signaler un blocage</Button>
          )}
          {(action.status === 'bloquee' || action.status === 'terminee') && (
            <Button variant="secondary" busy={update.isPending} onClick={() => send({ ...base, status: 'en_cours' }, 'Démarche reprise.')}>
              {action.status === 'terminee' ? 'Rouvrir' : 'Reprendre'}
            </Button>
          )}
          {action.status !== 'terminee' && (
            <Button variant="ghost" onClick={() => setMode('echeance')}>Fixer une échéance</Button>
          )}
        </div>
      )}
      {!action.prerequisites_met && action.status !== 'terminee' && mode === 'idle' && (
        <p className="mt-2 text-sm text-muted">Pour terminer cette démarche, terminez d'abord celles indiquées plus haut.</p>
      )}
      {action.status === 'terminee' && mode === 'idle' && (
        <p className="mt-2 text-sm text-muted">Rouvrir efface le résultat affiché ; il reste dans l'historique.</p>
      )}

      {mode !== 'idle' && (
        <form onSubmit={submit} className="mt-3 space-y-4" noValidate>
          {mode === 'terminer' && (
            <>
              <Field label="Résultat réel de la démarche" help="Ce qui a été fait, appris ou obtenu — y compris si c'est négatif." error={error?.fieldMessage('result_text')} required>
                {(p) => <textarea {...p} rows={4} className={inputClass} value={result} onChange={(e) => setResult(e.target.value)} />}
              </Field>
              <fieldset className="space-y-1">
                <legend className="font-medium">
                  Ce résultat est-il… <span className="text-muted">(obligatoire)</span>
                </legend>
                {OUTCOMES.map((o) => (
                  <label key={o.value} className="flex items-start gap-2">
                    <input type="radio" name="outcome" className="mt-1 size-5 shrink-0 accent-brand-700" checked={outcome === o.value}
                      onChange={() => setOutcome(o.value)} />
                    <span>
                      <span className="font-medium">{o.label}</span>
                      <span className="block text-sm text-muted">{o.help}</span>
                    </span>
                  </label>
                ))}
                {error?.fieldMessage('result_outcome') && (
                  <p className="text-sm font-medium text-danger-700">{error.fieldMessage('result_outcome')}</p>
                )}
              </fieldset>
              <Field label="Date de réalisation" error={error?.fieldMessage('result_date')} required>
                {(p) => <input {...p} type="date" max={todayInDakar()} className={inputClass} value={resultDate} onChange={(e) => setResultDate(e.target.value)} />}
              </Field>
            </>
          )}
          {mode === 'bloquer' && (
            <Field label="Qu'est-ce qui bloque ?" error={error?.fieldMessage('blocked_reason')} required>
              {(p) => <textarea {...p} rows={3} className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />}
            </Field>
          )}
          {mode === 'echeance' && (
            <Field label="Échéance" help="Laisser vide pour retirer l'échéance." error={error?.fieldMessage('due_date')}>
              {(p) => <input {...p} type="date" className={inputClass} value={due} onChange={(e) => setDue(e.target.value)} />}
            </Field>
          )}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" busy={update.isPending}>{error?.network ? 'Réessayer' : 'Enregistrer'}</Button>
            <Button type="button" variant="ghost" onClick={() => { setMode('idle'); update.reset() }}>Annuler</Button>
          </div>
        </form>
      )}
    </Card>
  )
}

function ActionHistory({ dossierId, actionId }: { dossierId: number; actionId: number }) {
  const history = useActionHistory(dossierId, actionId)
  return (
    <section aria-labelledby="historique" className="space-y-2">
      <h2 id="historique" className="text-lg font-semibold">Historique</h2>
      {history.isPending && <Loading />}
      {history.isError && <Alert tone="danger">Historique indisponible : {history.error.message}</Alert>}
      <ol className="space-y-2">
        {history.data?.map((e, i) => (
          <li key={`${e.plan_version}-${i}`} className="rounded-md border border-line bg-surface p-3 text-sm">
            <p>
              <strong>{e.from_status ? `${STATUS_LABEL[e.from_status]} → ` : ''}{STATUS_LABEL[e.to_status]}</strong>{' '}
              <span className="text-muted">· {formatDateTime(e.created_at)}{e.author ? ` · ${e.author.display_name}` : ''}</span>
            </p>
            {e.note && <p className="mt-1">{e.note}</p>}
            {e.blocked_reason && <p className="mt-1">Motif : {e.blocked_reason}</p>}
            {e.result_text && <p className="mt-1">Résultat{e.result_date ? ` (${formatDate(e.result_date)})` : ''} : {e.result_text}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * Après une démarche terminée : le résultat est enregistré, mais l'information du dossier ne
 * change pas toute seule. On indique où la mettre à jour, sans rien supposer du résultat.
 */
function NextStep({ dossier, action }: { dossier: ReturnType<typeof useCurrentDossier>; action: PlanAction }) {
  const fact = action.related_fact
  const owner = canEdit(dossier)
  if (!fact) {
    return (
      <Card>
        <h2 className="font-semibold">{owner ? 'Et maintenant ?' : 'Information liée'}</h2>
        <p className="mt-1 text-sm">
          Cette démarche personnelle n'est liée à aucune information du dossier.
          {owner && (
            <>
              {' '}Si son résultat change une information, mettez-la à jour dans{' '}
              <Link to={`/d/${dossier.id}/projet`} className="underline">Toutes les informations</Link>.
            </>
          )}
        </p>
      </Card>
    )
  }
  if (!action.linked_check) {
    return (
      <Card>
        <h2 className="font-semibold">Et maintenant ?</h2>
        <p className="mt-1 text-sm">
          Le point qui avait motivé cette démarche n'est plus signalé : l'information « {fact.label} » a déjà été mise à jour.
        </p>
        <Link to={`/d/${dossier.id}/projet/${fact.key}`} className="mt-2 inline-block text-sm text-brand-700 underline">
          Voir l'information « {fact.label} »
        </Link>
      </Card>
    )
  }
  const hint: Record<string, string> = {
    favorable: 'Indiquez la situation confirmée. « Vérifié » demande en plus de dire ce qui le confirme.',
    defavorable: 'Décrivez la situation réelle, même défavorable : le point restera ouvert, c’est normal.',
    incertain: 'Indiquez ce que vous savez maintenant, même partiel : le point peut rester ouvert.',
  }
  return (
    <Card className={owner ? 'border-brand-700' : ''}>
      <h2 className="font-semibold">{owner ? 'Et maintenant : mettre le dossier à jour' : 'Information liée : point encore ouvert'}</h2>
      <p className="mt-1">
        Le résultat est enregistré, mais le point « {action.linked_check.message} » reste ouvert tant que l'information
        « {fact.label} » n'est pas mise à jour. Elle ne change jamais automatiquement.
      </p>
      {owner && action.result_outcome && <p className="mt-1 text-sm text-muted">{hint[action.result_outcome]}</p>}
      {owner ? (
        <Link
          to={`/d/${dossier.id}/projet/${fact.key}?depuis=${action.id}`}
          className="mt-3 inline-flex min-h-11 items-center rounded-md bg-brand-700 px-4 font-medium text-white hover:bg-brand-800"
        >
          Mettre à jour : {fact.label}
        </Link>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            {dossier.archived ? 'Dossier archivé : plus de mise à jour possible.' : 'La mise à jour revient au porteur du projet.'}
          </p>
          <Link to={`/d/${dossier.id}/projet/${fact.key}`} className="mt-1 inline-block text-sm font-medium text-brand-700 underline">
            Consulter l’information : {fact.label}
          </Link>
        </>
      )}
    </Card>
  )
}
