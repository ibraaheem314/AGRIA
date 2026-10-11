import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ApiError, newRequestId } from '../../shared/api'
import { formatDate } from '../../shared/format'
import { Alert, Badge, Button, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { useCurrentDossier } from '../dossiers/DossierLayout'
import { ACTION_TONE, LEVEL_TONE, useCreateAction, usePreparation, type Check, type PlanAction, type Template } from './api'

export function TemplateNotice({ template }: { template: Template }) {
  const relu = template.review_status === 'relu'
  return (
    <details className="rounded-md border border-line bg-surface p-3 text-sm">
      <summary className="cursor-pointer font-medium">
        Contenu : {template.title} (version {template.version}) —{' '}
        <span className={relu ? 'text-ok-700' : 'text-warn-700'}>{template.review_label}</span>
      </summary>
      <div className="mt-2 space-y-1 text-muted">
        <p>Source : {template.source}</p>
        <p>Domaine d'application : {template.scope.pays}{template.scope.note ? ` — ${template.scope.note}` : ''}</p>
        {template.review_note && <p>{template.review_note}</p>}
        {relu && template.reviewer && <p>Relu par {template.reviewer}{template.review_date ? ` le ${formatDate(template.review_date)}` : ''}.</p>}
      </div>
    </details>
  )
}

export function CheckItem({ check, dossierId }: { check: Check; dossierId: number }) {
  return (
    <Card as="li">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium">{check.message}</h3>
        <span className="flex flex-wrap gap-1">
          {check.blocking && <Badge tone="danger">Bloquant</Badge>}
          <Badge tone={LEVEL_TONE[check.level]}>{check.level_label}</Badge>
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">Pourquoi ? {check.why}</p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <Link to={`/d/${dossierId}/projet/${check.fact_key}`} className="font-medium text-brand-700 underline">
          {check.level === 'a_completer' ? 'Compléter' : 'Mettre à jour'} : {check.fact_label}
        </Link>
        {check.action && (
          <Link to={`/d/${dossierId}/plan/${check.action.id}`} className="font-medium text-brand-700 underline">
            Démarche : {check.action.title}
          </Link>
        )}
      </p>
      {check.action?.status === 'terminee' && (
        <p className="mt-1 text-sm text-warn-700">
          La démarche liée est terminée, mais l'information du dossier n'a pas encore été mise à jour.
        </p>
      )}
    </Card>
  )
}

export function ActionItem({ action, dossierId, next }: { action: PlanAction; dossierId: number; next?: boolean }) {
  return (
    <Card as="li" className={next ? 'border-brand-700 ring-1 ring-brand-700' : ''}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link to={`/d/${dossierId}/plan/${action.id}`} className="font-medium text-brand-700 underline">
          {action.title}
        </Link>
        <span className="flex flex-wrap gap-1">
          {next && <Badge tone="info">Prochaine démarche</Badge>}
          <Badge tone={ACTION_TONE[action.status]}>{action.status_label}</Badge>
        </span>
      </div>
      {action.goal && <p className="mt-1 text-sm">{action.goal}</p>}
      {action.status === 'bloquee' && <p className="mt-1 text-sm text-danger-700">Bloquée : {action.blocked_reason}</p>}
      {action.status === 'terminee' && (
        <p className="mt-1 text-sm">Résultat ({action.result_date && formatDate(action.result_date)}) : {action.result_text}</p>
      )}
      {!action.prerequisites_met && action.status !== 'terminee' && (
        <p className="mt-1 text-sm text-muted">
          En attente de : {action.prerequisites.filter((p) => !p.done).map((p) => p.title).join(', ')}
        </p>
      )}
      {action.due_date && action.status !== 'terminee' && (
        <p className="mt-1 text-sm text-muted">Échéance : {formatDate(action.due_date)}</p>
      )}
    </Card>
  )
}

export function PlanPage() {
  const dossier = useCurrentDossier()
  const prep = usePreparation(dossier.id)
  if (prep.isPending) return <Loading label="Chargement du plan…" />
  if (prep.isError) return <Alert tone="danger" role="alert" title="Plan indisponible">{prep.error.message}</Alert>
  const data = prep.data
  if (!data.template) {
    return <Alert tone="warn" title="Aucun modèle de préparation">Le serveur n'a chargé aucun modèle de préparation (commande load_content).</Alert>
  }

  const toClarify = data.checks.filter((c) => c.level !== 'a_completer')
  const toComplete = data.checks.filter((c) => c.level === 'a_completer')
  const open = data.actions.filter((a) => a.status !== 'terminee')
  const done = data.actions.filter((a) => a.status === 'terminee')
  const owner = dossier.role === 'porteur' && !dossier.archived

  return (
    <div className="space-y-6">
      <PageTitle subtitle="Ce qu'il reste à vérifier, et les démarches pour y parvenir.">Mon plan</PageTitle>
      <TemplateNotice template={data.template} />

      <section aria-labelledby="points" className="space-y-3">
        <h2 id="points" className="text-lg font-semibold">Points à vérifier ({toClarify.length})</h2>
        {toClarify.length === 0 && <p className="text-muted">Aucun point à clarifier ou à vérifier pour l'instant.</p>}
        <ul className="space-y-3">
          {[...toClarify].sort((a, b) => Number(b.blocking) - Number(a.blocking)).map((c) => (
            <CheckItem key={c.key} check={c} dossierId={dossier.id} />
          ))}
        </ul>
        {toComplete.length > 0 && (
          <details className="rounded-md border border-line bg-surface p-3">
            <summary className="cursor-pointer font-medium">Informations encore à compléter ({toComplete.length})</summary>
            <ul className="mt-2 space-y-1">
              {toComplete.map((c) => (
                <li key={c.key}>
                  <Link to={`/d/${dossier.id}/projet/${c.fact_key}`} className="text-brand-700 underline">{c.fact_label}</Link>
                  {c.blocking && <span className="text-sm text-danger-700"> (bloquant)</span>}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section aria-labelledby="demarches" className="space-y-3">
        <h2 id="demarches" className="text-lg font-semibold">Démarches en cours et à faire ({open.length})</h2>
        {open.length === 0 && (
          <p className="text-muted">
            Aucune démarche ouverte. Les démarches apparaissent quand une information est inconnue ou reste à vérifier.
          </p>
        )}
        <ul className="space-y-3">
          {open.map((a) => (
            <ActionItem key={a.id} action={a} dossierId={dossier.id} next={a.id === data.next_action_id} />
          ))}
        </ul>
        {owner && <NewActionForm dossierId={dossier.id} />}
      </section>

      {done.length > 0 && (
        <section aria-labelledby="terminees" className="space-y-3">
          <h2 id="terminees" className="text-lg font-semibold">Démarches terminées ({done.length})</h2>
          <ul className="space-y-3">
            {done.map((a) => <ActionItem key={a.id} action={a} dossierId={dossier.id} />)}
          </ul>
        </section>
      )}
    </div>
  )
}

function NewActionForm({ dossierId }: { dossierId: number }) {
  const create = useCreateAction(dossierId)
  const requestId = useRef(newRequestId())
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [goal, setGoal] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    create.mutate(
      { title, goal, request_id: requestId.current },
      {
        onSuccess: () => {
          requestId.current = newRequestId()
          setTitle('')
          setGoal('')
          setOpen(false)
        },
      },
    )
  }

  if (!open) {
    return <Button variant="secondary" onClick={() => setOpen(true)}>Ajouter une démarche personnelle</Button>
  }
  const error = create.error instanceof ApiError ? create.error : null
  return (
    <Card>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <h3 className="font-semibold">Nouvelle démarche</h3>
        {error && <Alert tone="danger" role="alert">{error.message}</Alert>}
        <Field label="Intitulé" error={error?.fieldMessage('title')} required>
          {(p) => <input {...p} className={inputClass} maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />}
        </Field>
        <Field label="Objectif" help="Facultatif." error={error?.fieldMessage('goal')}>
          {(p) => <textarea {...p} rows={2} className={inputClass} value={goal} onChange={(e) => setGoal(e.target.value)} />}
        </Field>
        <div className="flex gap-3">
          <Button type="submit" busy={create.isPending}>{error?.network ? 'Réessayer' : 'Ajouter'}</Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
        </div>
      </form>
    </Card>
  )
}
