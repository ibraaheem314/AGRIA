import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { budgetTotals, EMPTY, formatFcfa, lineAmount, type Line, type PriceStatus } from '../data/model'
import { SUGGESTIONS } from '../data/seed'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, ButtonLink, Chip, Choice, Eyebrow, Field, input, Note, PageHeader, Panel, SectionTitle, TextLink, type Tone } from '../ui'

const UNITS = ['unité', 'kg', 'sac', 'litre', 'mètre', 'm²', 'jour', 'mois', 'forfait']

function lineState(l: Line): { label: string; tone: Tone } {
  if (l.owned) return { label: 'Déjà détenu, non compté', tone: 'neutral' }
  if (lineAmount(l) === null) return { label: 'À chiffrer', tone: 'warn' }
  return l.priceStatus === 'connu' ? { label: 'Prix connu', tone: 'ok' } : { label: 'Prix estimé', tone: 'info' }
}

export function BudgetPage() {
  const { dossier: d, canEdit, base } = useDossierCtx()
  const [aside, setAside] = useState<string[]>([])
  const suggestions = SUGGESTIONS.filter((s) => !d.budget.some((l) => l.suggestion === s.key) && !aside.includes(s.key))

  // Budget vide : une entrée guidée plutôt que des compteurs et des sections vides.
  if (d.budget.length === 0) {
    if (!canEdit) {
      return (
        <div className="space-y-4">
          <PageHeader title="Budget provisoire">Aucun poste dans ce budget.</PageHeader>
        </div>
      )
    }
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader eyebrow="Budget provisoire" title="Préparer mes premières dépenses">
          Aucun montant n'est encore renseigné. Choisissez les postes qui vous concernent : ils sont ajoutés sans quantité ni prix,
          et vous les chiffrerez quand vous aurez l'information.
        </PageHeader>
        <Suggestions items={suggestions} onAside={(k) => setAside((x) => [...x, k])} open />
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink to={`${base}/budget/poste/nouveau`} variant="secondary">Ajouter un autre poste</ButtonLink>
          {aside.length > 0 && <button type="button" className="font-medium text-brand-800 underline" onClick={() => setAside([])}>Revoir les postes laissés de côté ({aside.length})</button>}
        </div>
        <p className="text-sm text-muted">Le budget recense des dépenses ; aucune recette, marge ou rentabilité n'est calculée.</p>
      </div>
    )
  }

  const t = budgetTotals(d.budget)
  const apport = d.facts.apport ?? EMPTY
  const apportKnown = apport.status !== 'non_renseigne' && apport.status !== 'inconnu'
  return (
    <div className="space-y-6">
      <PageHeader title="Budget provisoire" actions={canEdit ? <ButtonLink to={`${base}/budget/poste/nouveau`}>Ajouter un poste</ButtonLink> : undefined}>
        Les dépenses à prévoir pour la campagne. Aucune recette, marge ou rentabilité n'est calculée.
      </PageHeader>

      <section aria-label="Où en est le budget" className={`grid gap-3 ${apportKnown ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        <Panel>
          <Eyebrow>Postes chiffrés</Eyebrow>
          <p className="mt-1 text-2xl font-semibold">{t.count - t.missing - t.owned > 0 ? formatFcfa(t.priced) : '—'}</p>
          <p className="text-sm text-muted">{t.estimated > 0 ? `dont ${formatFcfa(t.estimated)} d'estimations` : t.count - t.missing - t.owned > 0 ? 'prix connus' : 'aucun poste chiffré'}</p>
        </Panel>
        <Panel className={t.missing > 0 ? 'ring-warn-700/40' : ''}>
          <Eyebrow>À chiffrer</Eyebrow>
          <p className="mt-1 text-2xl font-semibold">{t.missing} poste{t.missing > 1 ? 's' : ''}</p>
          <p className="text-sm text-muted">{t.missing > 0 ? "Ils ne comptent pas pour zéro : le coût total n'est pas connu." : 'Tous les postes listés ont un montant.'}</p>
        </Panel>
        {apportKnown && (
          <Panel>
            <Eyebrow>Somme disponible indiquée</Eyebrow>
            <p className="mt-1 text-2xl font-semibold">{formatFcfa(Number(apport.value?.montant ?? 0))}</p>
            <p className="text-sm text-muted">Telle que déclarée dans le dossier.</p>
          </Panel>
        )}
      </section>
      <p className="text-sm text-muted">
        {!apportKnown && canEdit && <>Somme disponible : {apport.status === 'inconnu' ? 'inconnue pour l’instant' : 'pas encore indiquée'} (<TextLink to={`${base}/info/apport`}>la renseigner</TextLink>). </>}
        Comparer ces montants ne dit pas si le projet est faisable : des postes peuvent manquer et les estimations changer.
      </p>

      {(['campagne', 'investissement'] as const).map((cat) => {
        const lines = d.budget.filter((l) => l.category === cat)
        if (lines.length === 0) return null
        return (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <SectionTitle id={`cat-${cat}`}>{cat === 'campagne' ? 'Dépenses de la campagne' : 'Investissements (matériel durable, aménagement)'}</SectionTitle>
            <ul className="divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
              {lines.map((l) => {
                const st = lineState(l)
                const amount = lineAmount(l)
                return (
                  <li key={l.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {l.label}{' '}
                        {l.example && <span className="ml-1 text-xs font-normal text-muted">(montant d'exemple fictif)</span>}
                      </p>
                      <p className="text-sm text-muted">
                        {l.quantity !== null ? `${String(l.quantity).replace('.', ',')} ${l.unit}` : `Quantité à préciser (${l.unit})`}
                        {' × '}
                        {l.unitPrice !== null ? `${formatFcfa(l.unitPrice)} / ${l.unit}` : 'prix à trouver'}
                        {l.source && ` · source : ${l.source}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <span className="font-semibold tabular-nums">{l.owned ? 'non compté' : amount !== null ? formatFcfa(amount) : 'montant inconnu'}</span>
                      <Chip tone={st.tone}>{st.label}</Chip>
                      {canEdit && <TextLink to={`${base}/budget/poste/${l.id}`}>Modifier<span className="sr-only"> : {l.label}</span></TextLink>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {canEdit && suggestions.length > 0 && <Suggestions items={suggestions} onAside={(k) => setAside((x) => [...x, k])} open={false} unfolded={d.budget.length < 3} />}
      {canEdit && aside.length > 0 && <p className="text-sm text-muted">Laissés de côté pour cette visite : {aside.length}. <button type="button" className="font-medium text-brand-800 underline" onClick={() => setAside([])}>Les proposer à nouveau</button></p>}
    </div>
  )
}

/** Postes génériques à examiner : ajoutés sans quantité ni prix (jamais comptés pour zéro). */
function Suggestions({ items, onAside, open, unfolded = false }: { items: typeof SUGGESTIONS; onAside: (key: string) => void; open: boolean; unfolded?: boolean }) {
  const { dossier: d } = useDossierCtx()
  const { ops } = useStore()
  const list = (
    <>
      <p className="text-sm text-muted">Une liste générique pour ne rien oublier : ni un budget complet, ni une recommandation d'achat.</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.key} className="rounded-lg border border-line bg-surface p-3">
            <p className="font-medium">{s.label}</p>
            <p className="text-sm text-muted">{s.help}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => ops.saveLine(d.id, { label: s.label, category: s.category, quantity: null, unit: 'forfait', unitPrice: null, priceStatus: 'manquant', source: '', owned: false, suggestion: s.key })}>
                Ajouter<span className="sr-only"> : {s.label}</span>
              </Button>
              <Button variant="quiet" onClick={() => onAside(s.key)}>Pas pour moi<span className="sr-only"> : {s.label}</span></Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
  if (open) {
    return (
      <section aria-labelledby="examiner">
        <SectionTitle id="examiner">Postes à examiner</SectionTitle>
        {items.length ? list : <p className="text-sm text-muted">Chaque poste proposé a été ajouté ou laissé de côté.</p>}
      </section>
    )
  }
  return (
    <section aria-labelledby="examiner">
      <details className="rounded-xl bg-surface p-4 ring-1 ring-line" open={unfolded}>
        <summary id="examiner" className="cursor-pointer text-lg font-semibold">Autres postes à examiner ({items.length})</summary>
        <div className="mt-2">{list}</div>
      </details>
    </section>
  )
}

export function LinePage() {
  const { lineId } = useParams()
  const { dossier: d, canEdit, base } = useDossierCtx()
  const { ops } = useStore()
  const navigate = useNavigate()
  const existing = d.budget.find((l) => l.id === lineId)
  const initial = {
    label: existing?.label ?? '',
    category: existing?.category ?? 'campagne',
    quantity: existing?.quantity != null ? String(existing.quantity).replace('.', ',') : '',
    unit: existing?.unit ?? 'unité',
    priceStatus: (existing?.priceStatus ?? '') as PriceStatus | '',
    unitPrice: existing?.unitPrice != null ? String(existing.unitPrice) : '',
    source: existing?.source ?? '',
    owned: existing?.owned ?? false,
  }
  const [form, setForm] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const { allowNextNavigation } = useUnsavedChanges(JSON.stringify(form) !== JSON.stringify(initial))
  if (!canEdit) return <p>Consultation seulement. <TextLink to={`${base}/budget`}>Retour au budget</TextLink></p>
  if (lineId !== 'nouveau' && !existing) return <p>Poste introuvable. <TextLink to={`${base}/budget`}>Retour</TextLink></p>
  const set = (p: Partial<typeof form>) => setForm((s) => ({ ...s, ...p }))

  function save() {
    const qty = form.quantity.trim() ? Number(form.quantity.replace(',', '.').replace(/\s/g, '')) : null
    const price = form.unitPrice.trim() ? Number(form.unitPrice.replace(/\s/g, '')) : null
    if (form.label.trim().length < 2) return setError('Nommez le poste.')
    if (qty !== null && (!Number.isFinite(qty) || qty <= 0)) return setError('Quantité invalide.')
    if (!form.priceStatus) return setError('Indiquez si le prix est connu, estimé ou à trouver.')
    if (form.priceStatus !== 'manquant' && (price === null || !Number.isFinite(price) || price < 0)) return setError('Indiquez le prix unitaire, ou choisissez « prix à trouver ».')
    if (form.priceStatus !== 'manquant' && !form.source.trim()) return setError("Indiquez d'où vient ce prix (devis, vendeur, marché…).")
    ops.saveLine(d.id, {
      id: existing?.id, label: form.label.trim(), category: form.category as Line['category'], quantity: qty, unit: form.unit,
      unitPrice: form.priceStatus === 'manquant' ? null : price, priceStatus: form.priceStatus, source: form.source.trim(), owned: form.owned,
      suggestion: existing?.suggestion,
    })
    allowNextNavigation()
    navigate(`${base}/budget`, { state: { flash: `« ${form.label.trim()} » enregistré dans le budget.` } })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p><TextLink to={`${base}/budget`}>← Budget</TextLink></p>
      <PageHeader title={existing ? `Modifier « ${existing.label} »` : 'Nouveau poste'} />
      <Panel>
        <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); save() }}>
          <Field label="Poste" required>{(p) => <input {...p} className={input} value={form.label} onChange={(e) => set({ label: e.target.value })} />}</Field>
          <Choice<Line['category']> legend="Type de dépense" name="cat" value={form.category as Line['category']} onChange={(v) => set({ category: v })} options={[
            { value: 'campagne', label: 'Dépense de la campagne' },
            { value: 'investissement', label: 'Investissement', help: 'Matériel durable, aménagement.' },
          ]} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Quantité" help="Laisser vide si inconnue.">{(p) => <input {...p} inputMode="decimal" className={input} value={form.quantity} onChange={(e) => set({ quantity: e.target.value })} />}</Field>
            <Field label="Unité">{(p) => <select {...p} className={input} value={form.unit} onChange={(e) => set({ unit: e.target.value })}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select>}</Field>
          </div>
          <Choice<PriceStatus> legend="Le prix" name="prix" value={form.priceStatus} onChange={(v) => set({ priceStatus: v })} options={[
            { value: 'connu', label: 'Prix connu', help: 'Devis, prix relevé.' },
            { value: 'estime', label: 'Prix estimé', help: 'Approximation à confirmer.' },
            { value: 'manquant', label: 'Prix à trouver', help: 'Le poste reste « à chiffrer ».' },
          ]} />
          {form.priceStatus && form.priceStatus !== 'manquant' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prix unitaire (FCFA)" required>{(p) => <input {...p} inputMode="numeric" className={input} value={form.unitPrice} onChange={(e) => set({ unitPrice: e.target.value })} />}</Field>
              <Field label="D'où vient ce prix ?" required>{(p) => <input {...p} className={input} value={form.source} onChange={(e) => set({ source: e.target.value })} />}</Field>
            </div>
          )}
          <label className="flex items-start gap-2"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-brand-700" checked={form.owned} onChange={(e) => set({ owned: e.target.checked })} /> Déjà détenu : listé mais pas compté dans les montants.</label>
          <Note tone="neutral">Les montants sont calculés par l'application ; un poste sans quantité ou sans prix reste « à chiffrer ».</Note>
          {error && <p role="alert" className="font-medium text-danger-700">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Enregistrer le poste</Button>
            {existing && <Button variant="danger" onClick={() => { ops.removeLine(d.id, existing.id); allowNextNavigation(); navigate(`${base}/budget`, { state: { flash: `« ${existing.label} » retiré du budget.` } }) }}>Retirer</Button>}
          </div>
        </form>
      </Panel>
    </div>
  )
}
