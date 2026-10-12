import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ApiError, newRequestId } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { formatDate, formatDateTime, formatDecimal, formatFcfa, plural } from '../../shared/format'
import { Alert, Badge, Button, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { useCurrentDossier } from '../dossiers/DossierLayout'
import { isDetailed } from '../dossiers/guidance'
import {
  useAddSuggestion,
  useBudget,
  useBudgetHistory,
  useCreateLine,
  useRemoveLine,
  useUpdateLine,
  type Budget,
  type BudgetLine,
  type LineInput,
  type Suggestion,
  type Totals,
} from './api'

const STATE_BADGE: Record<BudgetLine['state'], { label: string; tone: 'ok' | 'info' | 'warn' | 'neutral' }> = {
  connu: { label: 'Prix connu', tone: 'ok' },
  estime: { label: 'Prix estimé', tone: 'info' },
  incomplet: { label: 'Montant manquant', tone: 'warn' },
  detenu: { label: 'Déjà détenu', tone: 'neutral' },
}

/** Phrase d'état : un budget incomplet n'est jamais présenté comme un total. */
export function budgetSentence(t: Totals): string {
  switch (t.status) {
    case 'vide':
      return 'Aucun poste chiffré pour l’instant.'
    case 'incomplet': {
      const missing = `Budget incomplet : ${plural(t.incomplete, 'poste')} sans montant.`
      const priced = t.lines - t.owned - t.incomplete
      if (priced === 0) return `${missing} Aucun poste n’est encore chiffré.`
      return `${missing} Les postes chiffrés totalisent ${formatFcfa(t.priced_total)}${
        t.estimated_total ? `, dont ${formatFcfa(t.estimated_total)} estimés` : ''
      } — ce n’est pas le coût total.`
    }
    case 'complet_estime':
      return `Tous les postes sont chiffrés : ${formatFcfa(t.priced_total)}, dont ${formatFcfa(t.estimated_total)} d’estimations.`
    case 'complet':
      return `Tous les postes sont chiffrés avec des prix connus : ${formatFcfa(t.priced_total)}.`
  }
}

export function BudgetPage() {
  const dossier = useCurrentDossier()
  const budget = useBudget(dossier.id)
  const [editing, setEditing] = useState<BudgetLine | 'new' | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const owner = dossier.role === 'porteur' && !dossier.archived
  const detailed = isDetailed(dossier)

  if (budget.isPending) return <Loading label="Chargement du budget…" />
  if (budget.isError) return <Alert tone="danger" role="alert" title="Budget indisponible">{budget.error.message}</Alert>
  const data = budget.data
  const overall = data.totals.overall

  return (
    <div className="space-y-6">
      <p><Link to={`/d/${dossier.id}/projet`} className="text-brand-700 underline">← Mon projet</Link></p>
      <PageTitle subtitle="Une estimation des dépenses de préparation et de campagne. Aucune recette ni rentabilité n’est calculée.">
        Budget provisoire
      </PageTitle>

      <Card>
        <h2 className="font-semibold">Où en est le budget</h2>
        <p className={`mt-1 font-medium ${overall.status === 'incomplet' ? 'text-warn-700' : ''}`}>{budgetSentence(overall)}</p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {data.choices.categories.map((c) => {
            const t = data.totals.by_category[c.value]!
            return (
              <div key={c.value} className="rounded-md border border-line p-2">
                <dt className="font-medium">{c.label}</dt>
                <dd>{budgetSentence(t)}</dd>
              </div>
            )
          })}
        </dl>
        <p className="mt-3 text-sm">
          Somme disponible indiquée dans le dossier :{' '}
          {data.apport.montant !== null ? (
            <>
              {formatFcfa(data.apport.montant)} ({data.apport.status === 'verifie' ? 'vérifiée' : data.apport.status === 'estime' ? 'estimée' : 'déclarée'})
            </>
          ) : (
            'non renseignée'
          )}
          .
        </p>
        <details className="mt-3 text-sm" open={detailed}>
          <summary className="cursor-pointer font-medium">Ce que ces chiffres veulent dire</summary>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Montant chiffré</strong> : la somme des postes qui ont une quantité et un prix
              {overall.lines - overall.owned - overall.incomplete > 0 ? ` (${formatFcfa(overall.priced_total)})` : ''}.
            </li>
            <li>
              <strong>À chiffrer</strong> : {overall.incomplete > 0 ? plural(overall.incomplete, 'poste') + ' sans montant' : 'aucun poste sans montant'}.
              Un poste à chiffrer ne compte jamais pour zéro : tant qu'il en reste, le coût total n'est pas connu.
            </li>
            <li>
              <strong>Moyens disponibles</strong> : la somme indiquée dans le dossier, telle que vous l'avez déclarée.
            </li>
            <li>
              <strong>Limites</strong> : comparer ces montants ne dit pas si le projet est faisable. Des postes peuvent
              manquer, les estimations peuvent changer, et aucune recette n'est prévue ici.
            </li>
          </ul>
        </details>
        <details className="mt-2 text-sm">
          <summary className="cursor-pointer font-medium">Règles de calcul</summary>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
            {data.rules.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </details>
      </Card>

      {flash && <Alert tone="ok" role="status">{flash}</Alert>}

      {owner && (
        <Suggestions
          dossierId={dossier.id}
          items={data.suggestions}
          detailed={detailed}
          onAdded={(label) => setFlash(`« ${label} » ajouté au budget, à chiffrer : indiquez quantité et prix avec « Modifier ».`)}
        />
      )}

      {owner && editing === null && (
        <Button onClick={() => { setFlash(null); setEditing('new') }}>Ajouter un poste</Button>
      )}
      {owner && editing !== null && (
        <LineForm
          key={editing === 'new' ? 'new' : editing.id}
          dossierId={dossier.id}
          budget={data}
          line={editing === 'new' ? null : editing}
          onDone={(message) => { setEditing(null); setFlash(message) }}
          onCancel={() => setEditing(null)}
        />
      )}

      {data.choices.categories.map((c) => {
        const lines = data.lines.filter((l) => l.category === c.value)
        return (
          <section key={c.value} aria-labelledby={`cat-${c.value}`} className="space-y-3">
            <h2 id={`cat-${c.value}`} className="text-lg font-semibold">{c.label}</h2>
            {lines.length === 0 && <p className="text-muted">Aucun poste.</p>}
            <ul className="space-y-3">
              {lines.map((line) => (
                <LineItem
                  key={line.id}
                  line={line}
                  dossierId={dossier.id}
                  owner={owner}
                  canAsk={!dossier.archived}
                  onEdit={() => { setFlash(null); setEditing(line) }}
                  onRemoved={() => setFlash(`« ${line.label} » retiré du budget (conservé dans l’historique).`)}
                />
              ))}
            </ul>
          </section>
        )
      })}

      <section className="space-y-2">
        <Button variant="ghost" aria-expanded={showHistory} onClick={() => setShowHistory((v) => !v)}>
          {showHistory ? 'Masquer l’historique' : 'Voir l’historique du budget'}
        </Button>
        {showHistory && <History dossierId={dossier.id} />}
      </section>
    </div>
  )
}

// « Laisser de côté » : repère de ce navigateur seulement, rien n'est enregistré côté serveur.
const asideKey = (dossierId: number) => `agria.budget-de-cote.${dossierId}`

function readAside(dossierId: number): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(asideKey(dossierId)) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : []
  } catch {
    return []
  }
}

function writeAside(dossierId: number, keys: string[]) {
  try {
    if (keys.length) window.localStorage.setItem(asideKey(dossierId), JSON.stringify(keys))
    else window.localStorage.removeItem(asideKey(dossierId))
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite seulement.
  }
}

/** Postes à examiner : une aide pour ne rien oublier, pas un budget complet ni un conseil d'achat. */
function Suggestions({
  dossierId,
  items,
  detailed,
  onAdded,
}: {
  dossierId: number
  items: Suggestion[]
  detailed: boolean
  onAdded: (label: string) => void
}) {
  const add = useAddSuggestion(dossierId)
  // Un identifiant par élément : un nouvel essai après un échec réseau ne crée pas de doublon.
  const requestIds = useRef(new Map<string, string>())
  const [aside, setAside] = useState<string[]>(() => readAside(dossierId))
  const pending = items.filter((s) => !s.added && !aside.includes(s.key))
  const setAsideItems = items.filter((s) => !s.added && aside.includes(s.key))
  if (pending.length === 0 && setAsideItems.length === 0) return null

  function updateAside(keys: string[]) {
    setAside(keys)
    writeAside(dossierId, keys)
  }

  function addItem(item: Suggestion) {
    let requestId = requestIds.current.get(item.key)
    if (!requestId) {
      requestId = newRequestId()
      requestIds.current.set(item.key, requestId)
    }
    add.mutate(
      { key: item.key, request_id: requestId },
      {
        onSuccess: () => {
          requestIds.current.delete(item.key)
          onAdded(item.label)
        },
      },
    )
  }

  const content = (
    <div className="space-y-3">
      <p className="text-sm">
        Une liste générique pour ne rien oublier : ce n'est ni un budget complet ni une recommandation d'achat. Un
        poste ajouté n'a ni quantité ni prix ; vous le chiffrez ensuite, quand vous avez l'information.
      </p>
      {add.error && <Alert tone="danger" role="alert">Non ajouté : {add.error.message}</Alert>}
      <ul className="space-y-2">
        {pending.map((item) => (
          <li key={item.key} className="rounded-md border border-line p-3">
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-muted">{item.help}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                busy={add.isPending && add.variables?.key === item.key}
                disabled={add.isPending}
                onClick={() => addItem(item)}
              >
                Ajouter au budget<span className="sr-only"> : {item.label}</span>
              </Button>
              <Button variant="ghost" onClick={() => updateAside([...aside, item.key])}>
                Laisser de côté<span className="sr-only"> : {item.label}</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {pending.length === 0 && <p className="text-sm">Chaque élément a été ajouté ou laissé de côté.</p>}
      {setAsideItems.length > 0 && (
        <p className="text-sm text-muted">
          Laissés de côté : {setAsideItems.map((s) => s.label).join(', ')}.{' '}
          <button type="button" className="font-medium text-brand-700 underline" onClick={() => updateAside([])}>
            Les proposer à nouveau
          </button>
        </p>
      )}
    </div>
  )

  return (
    <section aria-labelledby="a-examiner" className="rounded-lg border border-line bg-surface p-4">
      {detailed ? (
        <>
          <h2 id="a-examiner" className="mb-2 font-semibold">Postes à examiner</h2>
          {content}
        </>
      ) : (
        <details>
          <summary id="a-examiner" className="cursor-pointer font-semibold">Postes à examiner ({pending.length})</summary>
          <div className="mt-2">{content}</div>
        </details>
      )}
    </section>
  )
}

function LineItem({
  line,
  dossierId,
  owner,
  canAsk,
  onEdit,
  onRemoved,
}: {
  line: BudgetLine
  dossierId: number
  owner: boolean
  canAsk: boolean
  onEdit: () => void
  onRemoved: () => void
}) {
  const remove = useRemoveLine(dossierId)
  const [confirming, setConfirming] = useState(false)
  const badge = STATE_BADGE[line.state]
  return (
    <Card as="li">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium">{line.label}</h3>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>
      <p className="mt-1">
        {line.quantity !== null ? `${formatDecimal(line.quantity)} ${line.unit_label}` : `Quantité manquante (${line.unit_label})`}
        {' × '}
        {line.unit_price !== null ? `${formatFcfa(line.unit_price)} / ${line.unit_label}` : 'prix manquant'}
        {' = '}
        <strong>{line.amount !== null ? formatFcfa(line.amount) : 'montant manquant'}</strong>
        {line.already_owned && <span className="text-muted"> (non compté : déjà détenu)</span>}
      </p>
      {(line.source || line.price_date) && (
        <p className="mt-1 text-sm text-muted">
          Source : {line.source || '—'}{line.price_date ? ` · prix du ${formatDate(line.price_date)}` : ''}
        </p>
      )}
      {line.notes && <p className="mt-1 text-sm text-muted">{line.notes}</p>}
      {canAsk && (
        <p className="mt-1 text-sm">
          <Link to={`/d/${dossierId}/relecture?cible=poste:${line.id}#messages`} className="text-brand-700 underline">
            Poser une question<span className="sr-only"> sur « {line.label} »</span>
          </Link>
        </p>
      )}
      {remove.error && <p role="alert" className="mt-2 text-sm text-danger-700">{remove.error.message}</p>}
      {owner && (
        <div className="mt-2 flex flex-wrap gap-2">
          {!confirming ? (
            <>
              <Button variant="ghost" onClick={onEdit}>Modifier<span className="sr-only"> : {line.label}</span></Button>
              <Button variant="ghost" onClick={() => setConfirming(true)}>Retirer<span className="sr-only"> : {line.label}</span></Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                busy={remove.isPending}
                onClick={() => remove.mutate({ id: line.id, expected_version: line.row_version }, { onSuccess: onRemoved })}
              >
                Confirmer le retrait
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>Annuler</Button>
            </>
          )}
        </div>
      )}
    </Card>
  )
}

function toInput(line: BudgetLine | null): LineInput {
  return {
    category: line?.category ?? '',
    label: line?.label ?? '',
    quantity: line?.quantity?.replace('.', ',') ?? '',
    unit: line?.unit ?? '',
    unit_price: line?.unit_price?.toString() ?? '',
    price_status: line?.price_status ?? '',
    source: line?.source ?? '',
    price_date: line?.price_date ?? '',
    already_owned: line?.already_owned ?? false,
    notes: line?.notes ?? '',
  }
}

function LineForm({
  dossierId,
  budget,
  line,
  onDone,
  onCancel,
}: {
  dossierId: number
  budget: Budget
  line: BudgetLine | null
  onDone: (message: string) => void
  onCancel: () => void
}) {
  const create = useCreateLine(dossierId)
  const update = useUpdateLine(dossierId, line?.id ?? 0)
  const mutation = line ? update : create
  const requestId = useRef(newRequestId())
  const [form, setForm] = useState<LineInput>(() => toInput(line))
  const [baseline] = useState<LineInput>(() => toInput(line))
  useUnsavedChanges(JSON.stringify(form) !== JSON.stringify(baseline))
  const set = <K extends keyof LineInput>(key: K, value: LineInput[K]) => setForm((f) => ({ ...f, [key]: value }))
  const error = mutation.error instanceof ApiError ? mutation.error : null
  const missing = form.price_status === 'manquant'

  function submit(event: FormEvent) {
    event.preventDefault()
    const body = { ...form, unit_price: missing ? '' : form.unit_price, price_date: form.price_date || null }
    if (line) {
      update.mutate(
        { ...body, expected_version: line.row_version },
        { onSuccess: (r) => onDone(r.changed ? `« ${r.label} » enregistré.` : 'Aucun changement à enregistrer.') },
      )
    } else {
      create.mutate({ ...body, request_id: requestId.current }, { onSuccess: (r) => onDone(`« ${r.label} » ajouté au budget.`) })
    }
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <h2 className="font-semibold">{line ? `Modifier « ${line.label} »` : 'Nouveau poste'}</h2>
        {error && (
          <Alert tone="danger" role="alert" title={error.code === 'conflit' ? 'Modification refusée' : 'Non enregistré'}>
            {error.message}
          </Alert>
        )}
        <fieldset className="space-y-2">
          <legend className="font-medium">Type de dépense</legend>
          {budget.choices.categories.map((c) => (
            <label key={c.value} className="flex items-center gap-2">
              <input type="radio" name="category" className="size-5 shrink-0 accent-brand-700" checked={form.category === c.value} onChange={() => set('category', c.value)} />
              {c.label}
            </label>
          ))}
          {error?.fieldMessage('category') && <p className="text-sm font-medium text-danger-700">{error.fieldMessage('category')}</p>}
        </fieldset>
        <Field label="Poste" help="Par exemple : semences, location de motopompe, main-d'œuvre de repiquage." error={error?.fieldMessage('label')} required>
          {(p) => <input {...p} className={inputClass} maxLength={200} value={form.label} onChange={(e) => set('label', e.target.value)} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quantité" help="Laisser vide si inconnue." error={error?.fieldMessage('quantity')}>
            {(p) => <input {...p} inputMode="decimal" className={inputClass} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />}
          </Field>
          <Field label="Unité" error={error?.fieldMessage('unit')} required>
            {(p) => (
              <select {...p} className={inputClass} value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                <option value="">— Choisir —</option>
                {budget.choices.units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            )}
          </Field>
        </div>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-brand-700" checked={form.already_owned} onChange={(e) => set('already_owned', e.target.checked)} />
          <span>Déjà détenu : listé pour mémoire, sans être compté dans les totaux.</span>
        </label>
        <fieldset className="space-y-2">
          <legend className="font-medium">Prix</legend>
          {budget.choices.price_statuses.map((s) => (
            <label key={s.value} className="flex items-center gap-2">
              <input type="radio" name="price_status" className="size-5 shrink-0 accent-brand-700" checked={form.price_status === s.value} onChange={() => set('price_status', s.value)} />
              {s.label}
            </label>
          ))}
          {error?.fieldMessage('price_status') && <p className="text-sm font-medium text-danger-700">{error.fieldMessage('price_status')}</p>}
        </fieldset>
        {!missing && form.price_status && (
          <>
            <Field label={`Prix unitaire (FCFA${form.unit ? ` par ${budget.choices.units.find((u) => u.value === form.unit)?.label}` : ''})`} error={error?.fieldMessage('unit_price')} required>
              {(p) => <input {...p} inputMode="numeric" className={inputClass} value={form.unit_price} onChange={(e) => set('unit_price', e.target.value)} />}
            </Field>
            <Field
              label={form.price_status === 'connu' ? 'Source du prix (devis, vendeur…)' : 'Sur quoi repose l’estimation ?'}
              error={error?.fieldMessage('source')}
              required
            >
              {(p) => <input {...p} className={inputClass} maxLength={300} value={form.source} onChange={(e) => set('source', e.target.value)} />}
            </Field>
            <Field label="Date du prix" help={form.price_status === 'connu' ? undefined : 'Facultatif pour une estimation.'} error={error?.fieldMessage('price_date')} required={form.price_status === 'connu'}>
              {(p) => <input {...p} type="date" className={inputClass} value={form.price_date ?? ''} onChange={(e) => set('price_date', e.target.value)} />}
            </Field>
          </>
        )}
        <Field label="Remarques" help="Facultatif." error={error?.fieldMessage('notes')}>
          {(p) => <textarea {...p} rows={2} maxLength={1000} className={inputClass} value={form.notes} onChange={(e) => set('notes', e.target.value)} />}
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" busy={mutation.isPending}>{error?.network ? 'Réessayer' : 'Enregistrer le poste'}</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
        </div>
      </form>
    </Card>
  )
}

const KIND_LABEL = { ajout: 'Ajout', modif: 'Modification', retrait: 'Retrait' } as const

function History({ dossierId }: { dossierId: number }) {
  const history = useBudgetHistory(dossierId, true)
  if (history.isPending) return <Loading />
  if (history.isError) return <Alert tone="danger">{history.error.message}</Alert>
  if (history.data.length === 0) return <p className="text-muted">Aucune modification.</p>
  return (
    <ol className="space-y-2">
      {history.data.map((e) => (
        <li key={e.budget_version} className="rounded-md border border-line bg-surface p-3 text-sm">
          <p>
            <strong>{KIND_LABEL[e.kind]} : {e.snapshot.label}</strong>{' '}
            <span className="text-muted">· {formatDateTime(e.created_at)} · {e.author.display_name} · version {e.budget_version}</span>
          </p>
          <p className="mt-1">
            {e.snapshot.quantity ?? '?'} × {e.snapshot.unit_price !== null ? formatFcfa(e.snapshot.unit_price) : 'prix manquant'} ={' '}
            {e.snapshot.amount !== null ? formatFcfa(e.snapshot.amount) : 'montant manquant'}
          </p>
        </li>
      ))}
    </ol>
  )
}
