import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { formatDate, formatDateTime } from '../../shared/format'
import { Alert, Badge, Button, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { dossierKey, useFactHistory, useSaveFact, type Dossier, type FactItem, type FactStatus, type FactValue, type FieldDef } from './api'
import { describeValue, STATUS_LABEL, STATUS_TONE } from './factDisplay'
import { SituationLine, useOpenPoints } from './ProjectPage'
import { useCurrentDossier } from './DossierLayout'
import { words } from './roles'
import { fetchPreparation, preparationKey, usePreparation } from '../plan/api'

type EditableStatus = Exclude<FactStatus, 'non_renseigne'>
type Draft = { status: EditableStatus | ''; values: Record<string, string>; source: string }

function draftFrom(fact: FactItem): Draft {
  const values: Record<string, string> = {}
  for (const field of fact.fields) {
    const raw = fact.state.value?.[field.name]
    if (raw === undefined || raw === null) values[field.name] = ''
    else values[field.name] = field.kind === 'decimal' ? String(raw).replace('.', ',') : String(raw)
  }
  return {
    status: fact.state.status === 'non_renseigne' ? '' : fact.state.status,
    values,
    source: fact.state.source,
  }
}

function valueFrom(fact: FactItem, draft: Draft): FactValue | null {
  if (draft.status === 'inconnu') return null
  const value: FactValue = {}
  for (const field of fact.fields) {
    const raw = draft.values[field.name]?.trim()
    if (raw) value[field.name] = raw // le serveur valide et normalise (virgule décimale acceptée)
  }
  return value
}

/**
 * Après l'enregistrement, relit les vérifications (le serveur les recalcule) pour dire en clair
 * si un point reste signalé sur cette information. Jamais une validation du projet.
 */
export async function savedSummary(queryClient: QueryClient, dossierId: number, fact: FactItem, changed: boolean) {
  if (!changed) return 'Aucun changement à enregistrer.'
  const saved = `« ${fact.label} » enregistré.`
  try {
    const prep = await queryClient.fetchQuery({
      queryKey: preparationKey(dossierId),
      queryFn: () => fetchPreparation(dossierId),
      staleTime: 0,
    })
    const check = prep.checks.find((c) => c.fact_key === fact.key)
    if (check) return `${saved} Point encore ouvert : ${check.message}.`
    return `${saved} Plus aucun point n'est signalé sur cette information par les règles disponibles (ce n'est pas une validation du projet).`
  } catch {
    return `${saved} Les vérifications n'ont pas pu être relues : consultez Mon plan.`
  }
}

export function FactEditPage() {
  const dossier = useCurrentDossier()
  const navigate = useNavigate()
  const { factKey = '' } = useParams()
  const [searchParams] = useSearchParams()
  const fromAction = Number(searchParams.get('depuis')) || null
  const fact = dossier.facts.find((f) => f.key === factKey)
  if (!fact) {
    return (
      <Alert tone="danger" title="Information introuvable">
        <Link to={`/d/${dossier.id}/projet`} className="underline">Retour au projet</Link>
      </Alert>
    )
  }
  const editable = dossier.role === 'porteur' && !dossier.archived
  return (
    <div className="space-y-6">
      <p className="no-print">
        <Link to={`/d/${dossier.id}/projet`} className="text-brand-700 underline">{words(dossier).backToProject}</Link>
      </p>
      <PageTitle subtitle={fact.why}>{fact.label}</PageTitle>
      <FactSituation dossierId={dossier.id} factKey={fact.key} />
      {fromAction && <ActionResult dossierId={dossier.id} actionId={fromAction} factKey={fact.key} />}
      {editable ? (
        <FactForm
          key={fact.key}
          fact={fact}
          dossierId={dossier.id}
          statuses={dossier.statuses}
          cancelTo={fromAction ? `/d/${dossier.id}/plan/${fromAction}` : `/d/${dossier.id}/projet`}
          onSaved={(message, allowNextNavigation) => {
            allowNextNavigation()
            navigate(fromAction ? `/d/${dossier.id}/plan/${fromAction}` : `/d/${dossier.id}/projet`, {
              state: { flash: message },
            })
          }}
        />
      ) : (
        <Card>
          <Badge tone={STATUS_TONE[fact.state.status]}>{STATUS_LABEL[fact.state.status]}</Badge>
          <ul className="mt-2">{describeValue(fact, fact.state.value).map((l) => <li key={l}>{l}</li>)}</ul>
          {fact.state.source && <p className="mt-1 text-sm text-muted">Source ou précision : {fact.state.source}</p>}
        </Card>
      )}
      {!dossier.archived && (
        <p>
          <Link to={`/d/${dossier.id}/relecture?cible=information:${fact.key}#messages`} className="font-medium text-brand-700 underline">
            Poser une question sur cette information
          </Link>
        </p>
      )}
      <History dossierId={dossier.id} fact={fact} />
    </div>
  )
}

/** Formulaire d'une information, partagé par la page de l'information et le pas-à-pas. */
export function FactForm({
  fact,
  dossierId,
  statuses,
  cancelTo,
  onSaved,
  submitLabel = 'Enregistrer',
  extraActions,
}: {
  fact: FactItem
  dossierId: number
  statuses: { value: EditableStatus; label: string; help: string }[]
  cancelTo: string | null
  /** Appelé une fois l'écriture confirmée, le dossier et les vérifications relus. Appeler
   * `allowNextNavigation` seulement si l'on quitte la page juste après. */
  onSaved: (message: string, allowNextNavigation: () => void) => void
  submitLabel?: string
  extraActions?: ReactNode
}) {
  const queryClient = useQueryClient()
  const save = useSaveFact(dossierId, fact.key)
  const [finishing, setFinishing] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => draftFrom(fact))
  const [baseline, setBaseline] = useState<Draft>(() => draftFrom(fact))
  const { allowNextNavigation } = useUnsavedChanges(JSON.stringify(draft) !== JSON.stringify(baseline))
  const [localError, setLocalError] = useState<string | null>(null)
  // Version lue à l'ouverture : envoyée telle quelle à chaque essai (reprise sans doublon,
  // conflit explicite si quelqu'un d'autre a modifié entre-temps).
  const [expectedVersion, setExpectedVersion] = useState(fact.state.row_version)

  async function reloadSaved() {
    await queryClient.refetchQueries({ queryKey: dossierKey(dossierId) })
    const fresh = queryClient.getQueryData<Dossier>(dossierKey(dossierId))?.facts.find((f) => f.key === fact.key)
    if (fresh) {
      setDraft(draftFrom(fresh))
      setBaseline(draftFrom(fresh))
      setExpectedVersion(fresh.state.row_version)
      save.reset()
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!draft.status) {
      setLocalError('Choisissez où en est cette information.')
      return
    }
    setLocalError(null)
    save.mutate(
      { status: draft.status, value: valueFrom(fact, draft), source: draft.source, expected_version: expectedVersion },
      {
        onSuccess: async (result) => {
          setBaseline(draft)
          setFinishing(true)
          const [message] = await Promise.all([
            savedSummary(queryClient, dossierId, fact, result.changed),
            queryClient.refetchQueries({ queryKey: dossierKey(dossierId) }, { cancelRefetch: false }),
          ])
          setFinishing(false)
          onSaved(message, allowNextNavigation)
        },
      },
    )
  }

  const error = save.error instanceof ApiError ? save.error : null
  const valueErrors = (error?.fields?.value ?? null) as Record<string, string> | string | null
  const fieldError = (name: string) =>
    valueErrors && typeof valueErrors === 'object' ? (valueErrors[name] as string | undefined) : undefined

  return (
    <Card>
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <Alert tone="danger" role="alert" title={error.code === 'conflit' ? 'Modification refusée' : 'Non enregistré'}>
            <p>{error.message}</p>
            {typeof valueErrors === 'string' && <p>{valueErrors}</p>}
            {error.code === 'conflit' && (
              <p className="mt-2">
                Votre saisie est conservée ci-dessous.{' '}
                <button type="button" className="font-medium underline" onClick={reloadSaved}>
                  Recharger la version enregistrée
                </button>{' '}
                (votre saisie sera alors perdue).
              </p>
            )}
          </Alert>
        )}

        <fieldset className="space-y-2">
          <legend className="font-medium">Où en est cette information ?</legend>
          {statuses.map((s) => (
            <label key={s.value} className="flex cursor-pointer gap-3 rounded-md border border-line p-3 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
              <input
                type="radio"
                name="status"
                value={s.value}
                checked={draft.status === s.value}
                onChange={() => setDraft((d) => ({ ...d, status: s.value }))}
                className="mt-1 size-5 shrink-0 accent-brand-700"
              />
              <span>
                <span className="block font-medium">{s.label}</span>
                <span className="block text-sm text-muted">{s.help}</span>
              </span>
            </label>
          ))}
          {localError && <p className="text-sm font-medium text-danger-700">{localError}</p>}
        </fieldset>

        {draft.status && draft.status !== 'inconnu' && (
          <div className="space-y-4">
            {fact.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={draft.values[field.name] ?? ''}
                error={fieldError(field.name)}
                onChange={(v) => setDraft((d) => ({ ...d, values: { ...d.values, [field.name]: v } }))}
              />
            ))}
          </div>
        )}

        {draft.status && (
          <Field
            label={draft.status === 'verifie' ? 'Comment l’avez-vous vérifié ?' : 'Source ou précision'}
            help={
              draft.status === 'verifie'
                ? 'Document, visite, personne consultée, date…'
                : draft.status === 'inconnu'
                  ? 'Facultatif : qui pourrait vous renseigner ?'
                  : 'Facultatif.'
            }
            required={draft.status === 'verifie'}
            error={error?.fieldMessage('source')}
          >
            {(p) => (
              <textarea {...p} rows={3} maxLength={1000} className={inputClass} value={draft.source}
                onChange={(e) => setDraft((d) => ({ ...d, source: e.target.value }))} />
            )}
          </Field>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" busy={save.isPending || finishing}>
            {error?.network ? 'Réessayer l’enregistrement' : submitLabel}
          </Button>
          {extraActions}
          {cancelTo && (
            <Link to={cancelTo} className="inline-flex min-h-11 items-center px-2 text-brand-700 underline">
              Annuler
            </Link>
          )}
        </div>
      </form>
    </Card>
  )
}

function FieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const help = [field.help, field.unit ? `Unité : ${field.unit}` : ''].filter(Boolean).join(' ')
  return (
    <Field label={field.label} help={help || undefined} error={error} required={field.required}>
      {(p) => {
        switch (field.kind) {
          case 'choice':
            return (
              <select {...p} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">— Choisir —</option>
                {field.choices.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            )
          case 'longtext':
            return <textarea {...p} rows={4} maxLength={field.max_length} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
          case 'integer':
          case 'decimal':
            return (
              <input {...p} inputMode={field.kind === 'integer' ? 'numeric' : 'decimal'} className={inputClass}
                value={value} onChange={(e) => onChange(e.target.value)} />
            )
          case 'month':
            return <input {...p} type="month" placeholder="AAAA-MM" className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
          default:
            return <input {...p} maxLength={field.max_length} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        }
      }}
    </Field>
  )
}

function History({ dossierId, fact }: { dossierId: number; fact: FactItem }) {
  const history = useFactHistory(dossierId, fact.key)
  return (
    <section aria-labelledby="historique" className="space-y-2">
      <h2 id="historique" className="text-lg font-semibold">Historique</h2>
      {history.isPending && <Loading />}
      {history.isError && <Alert tone="danger">Historique indisponible : {history.error.message}</Alert>}
      {history.data?.length === 0 && <p className="text-muted">Aucune modification enregistrée.</p>}
      <ol className="space-y-2">
        {history.data?.map((rev) => (
          <li key={rev.context_version} className="rounded-md border border-line bg-surface p-3 text-sm">
            <p>
              <Badge tone={STATUS_TONE[rev.status]}>{STATUS_LABEL[rev.status]}</Badge>{' '}
              <span className="text-muted">
                {formatDateTime(rev.created_at)} · {rev.author.display_name} · version {rev.context_version} du dossier
              </span>
            </p>
            {describeValue(fact, rev.value).map((line) => <p key={line} className="mt-1">{line}</p>)}
            {rev.source && <p className="mt-1 text-muted">Source : {rev.source}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}

function FactSituation({ dossierId, factKey }: { dossierId: number; factKey: string }) {
  const open = useOpenPoints(dossierId).get(factKey)
  return open ? <SituationLine check={open} dossierId={dossierId} /> : null
}

/**
 * Résultat de la démarche d'où l'on vient, à relire pendant la mise à jour. Il ne remplit
 * rien : la valeur enregistrée reste celle du formulaire tant que le porteur ne la change pas.
 */
function ActionResult({ dossierId, actionId, factKey }: { dossierId: number; actionId: number; factKey: string }) {
  const prep = usePreparation(dossierId)
  const action = prep.data?.actions.find((a) => a.id === actionId)
  if (!action || action.status !== 'terminee' || action.related_fact?.key !== factKey) return null
  return (
    <section aria-labelledby="resultat-demarche" className="rounded-md border border-line bg-surface p-4">
      <h2 id="resultat-demarche" className="font-semibold">Résultat de la démarche « {action.title} »</h2>
      <p className="mt-1 text-sm text-muted">
        Terminée{action.result_date ? ` le ${formatDate(action.result_date)}` : ''}
        {action.result_outcome_label ? ` · résultat ${action.result_outcome_label.toLowerCase()}` : ''}
      </p>
      {action.result_text && <p className="mt-2 whitespace-pre-line">{action.result_text}</p>}
      <p className="mt-2 text-sm">
        Ce résultat ne modifie pas l'information ci-dessous : c'est à vous de décider ce que vous enregistrez.
        Choisissez « Vérifié » seulement si vous indiquez ce qui le confirme ; un résultat favorable ne suffit pas.
      </p>
      <Link to={`/d/${dossierId}/plan/${action.id}`} className="mt-2 inline-block text-sm text-brand-700 underline">
        Revenir à la démarche
      </Link>
    </section>
  )
}
