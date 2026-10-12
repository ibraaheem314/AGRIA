import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { FACT_BY_KEY, factLabel, howKnown, subjectOf, type FieldDef, type Status } from '../data/facts'
import { computeChecks, describe, EMPTY, formatDay, OUTCOME_LABEL, PEOPLE, type FactState, type Value } from '../data/model'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, Chip, Choice, Field, input, Note, PageHeader, Panel, TextLink } from '../ui'
import { LEVEL_LABEL } from './Subject'

type Mode = 'repondre' | 'inconnu'
type How = 'declare' | 'estime' | 'verifie'

export function FactPage() {
  const { factKey = '' } = useParams()
  const [params] = useSearchParams()
  const { dossier: d, checks, canEdit, role, base } = useDossierCtx()
  const def = FACT_BY_KEY[factKey]
  if (!def) return <p>Information introuvable. <TextLink to={base}>Retour</TextLink></p>
  const f = d.facts[factKey] ?? EMPTY
  const subject = subjectOf(factKey)
  const from = d.actions.find((a) => a.id === params.get('depuis') && a.status === 'terminee')
  const check = checks.find((c) => c.factKey === factKey && c.level !== 'a_completer')
  const history = d.history.filter((h) => h.key === factKey).slice().reverse()

  return (
    <div className="space-y-6">
      <p><TextLink to={from ? `${base}/demarches/${from.id}` : `${base}/sujet/${subject.key}`}>← {from ? 'Démarche' : subject.title}</TextLink></p>
      <PageHeader eyebrow={subject.title} title={factLabel(factKey, d.profile, role)}>{def.why}</PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          {from?.result && (
            <section aria-label="Résultat de la démarche" className="rounded-xl bg-info-50 p-4 ring-1 ring-info-700/30">
              <p className="font-semibold">Résultat de « {from.title} » — {OUTCOME_LABEL[from.result.outcome].toLowerCase()}</p>
              <p className="mt-1">{from.result.text}</p>
              <p className="mt-2 text-sm">Ce résultat ne remplit rien à votre place : décidez ce que vous enregistrez. « Confirmé » demande d'indiquer ce qui le confirme ; un résultat favorable ne suffit pas.</p>
            </section>
          )}
          {check && (
            <Note tone="warn">
              <strong>Situation : {LEVEL_LABEL[check.level].toLowerCase()}.</strong> {check.message}.
            </Note>
          )}
          {canEdit ? <FactForm key={factKey} factKey={factKey} state={f} fromAction={from?.id} /> : (
            <Panel>
              <Chip tone={f.status === 'inconnu' ? 'warn' : 'neutral'}>{howKnown(f.status, role)}</Chip>
              <p className="mt-2 text-lg">{describe(factKey, f)}</p>
              {f.source && <p className="mt-1 text-sm text-muted">Source ou précision : {f.source}</p>}
              <p className="mt-2 text-sm text-muted">{role === 'conseiller' ? 'Lecture seule : seul le porteur modifie ses informations.' : 'Campagne archivée : consultation seulement.'}</p>
            </Panel>
          )}
        </div>
        <aside aria-label="Historique">
          <Panel>
            <details open={!canEdit}>
              <summary className="cursor-pointer font-semibold">Historique ({history.length})</summary>
              <ol className="mt-2 space-y-2 text-sm">
                {history.map((h, i) => (
                  <li key={i} className="border-l-2 border-line pl-2">
                    <p className="font-medium">{howKnown(h.status, role)}</p>
                    <p>{describe(factKey, h as FactState)}</p>
                    <p className="text-muted">{formatDay(h.at)} · {PEOPLE[h.by].name}</p>
                  </li>
                ))}
                {history.length === 0 && <li className="text-muted">Aucune modification.</li>}
              </ol>
            </details>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function FactForm({ factKey, state, fromAction }: { factKey: string; state: FactState; fromAction?: string }) {
  const { dossier: d, viewer, base } = useDossierCtx()
  const { ops } = useStore()
  const navigate = useNavigate()
  const def = FACT_BY_KEY[factKey]!
  const initial = {
    mode: (state.status === 'inconnu' ? 'inconnu' : 'repondre') as Mode,
    how: (['declare', 'estime', 'verifie'].includes(state.status) ? state.status : '') as How | '',
    value: { ...(state.value ?? {}) } as Value,
    source: state.carried ? '' : state.source,
  }
  const [form, setForm] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const { allowNextNavigation } = useUnsavedChanges(dirty)
  const required = def.fields.filter((x) => x.required)
  const hasNotes = form.source.trim() !== '' || def.fields.some((x) => x.kind !== 'choice' && (form.value[x.name] ?? '').trim() !== '')
  const situationChanged = state.status !== 'non_renseigne' && hasNotes && def.fields.some((x) => x.kind === 'choice' && (form.value[x.name] ?? '') !== (initial.value[x.name] ?? ''))

  function save() {
    let status: Exclude<Status, 'non_renseigne'>
    let value: Value | null = null
    if (form.mode === 'inconnu') status = 'inconnu'
    else {
      if (required.some((x) => !(form.value[x.name] ?? '').trim())) return setError(`Indiquez : ${required.map((x) => x.label.toLowerCase()).join(', ')} — ou choisissez « Je ne sais pas encore ».`)
      if (!form.how) return setError('Indiquez comment vous le savez.')
      if (form.how === 'verifie' && !form.source.trim()) return setError('Indiquez ce qui le confirme (document, visite, personne).')
      status = form.how
      value = Object.fromEntries(Object.entries(form.value).filter(([, v]) => v.trim()))
    }
    const next = { status, value, source: form.source.trim() }
    const after = computeChecks({ profile: d.profile, facts: { ...d.facts, [factKey]: next } }).find((c) => c.factKey === factKey && c.level !== 'a_completer')
    ops.saveFact(d.id, factKey, next, viewer)
    allowNextNavigation()
    const label = factLabel(factKey, d.profile)
    const flash = after
      ? `« ${label} » enregistré. Point encore à éclaircir : ${after.message}.`
      : `« ${label} » enregistré. Plus rien n'est signalé sur cette information par les règles disponibles (ce n'est pas une validation du projet).`
    navigate(fromAction ? `${base}/demarches/${fromAction}` : `${base}/sujet/${subjectOf(factKey).key}`, { state: { flash } })
  }

  return (
    <Panel>
      <form className="space-y-5" noValidate onSubmit={(e) => { e.preventDefault(); save() }}>
        {state.carried && <Note tone="warn">Repris de la campagne précédente : vérifiez que c'est toujours vrai cette saison.</Note>}
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Votre réponse">
          {([['repondre', 'Je réponds'], ['inconnu', 'Je ne sais pas encore']] as [Mode, string][]).map(([v, l]) => (
            <label key={v} className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium ring-1 ring-line has-[:checked]:bg-brand-700 has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-info-700">
              <input type="radio" className="sr-only" name="mode" checked={form.mode === v} onChange={() => setForm((s) => ({ ...s, mode: v }))} />
              {l}
            </label>
          ))}
        </div>
        {form.mode === 'repondre' ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {def.fields.map((x) => <FieldInput key={x.name} def={x} value={form.value[x.name] ?? ''} onChange={(v) => setForm((s) => ({ ...s, value: { ...s.value, [x.name]: v } }))} />)}
            </div>
            <Choice<How>
              legend="Comment le savez-vous ?"
              name="how"
              value={form.how}
              onChange={(v) => setForm((s) => ({ ...s, how: v }))}
              options={[
                { value: 'declare', label: 'Je l’affirme', help: 'Sans preuve enregistrée.' },
                { value: 'estime', label: 'C’est une estimation', help: 'Une approximation, à préciser.' },
                { value: 'verifie', label: 'J’ai de quoi le confirmer', help: 'Document, visite, personne. AGRIA ne contrôle pas cette source, et la situation peut rester à régler.' },
              ]}
            />
          </>
        ) : (
          <p className="text-sm">Enregistré comme « Je ne sais pas encore » : le dossier le montrera comme une inconnue, avec une démarche pour l'éclaircir quand il en existe une.</p>
        )}
        <Field label={form.how === 'verifie' && form.mode === 'repondre' ? 'Qu’est-ce qui le confirme ?' : 'Précision ou source'} help={form.how === 'verifie' ? undefined : 'Facultatif.'} required={form.how === 'verifie' && form.mode === 'repondre'}>
          {(p) => <textarea {...p} rows={2} className={input} value={form.source} onChange={(e) => setForm((s) => ({ ...s, source: e.target.value }))} />}
        </Field>
        {situationChanged && <Note tone="neutral">La situation a changé : relisez les précisions et la source. Elles sont conservées telles quelles.</Note>}
        {error && <p role="alert" className="font-medium text-danger-700">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Enregistrer</Button>
          {state.status === 'non_renseigne' && !d.deferred.includes(factKey) && (
            <Button variant="quiet" onClick={() => { ops.setDeferred(d.id, factKey, true); allowNextNavigation(); navigate(`${base}/sujet/${subjectOf(factKey).key}`, { state: { flash: 'Remis à plus tard : rien n’a été enregistré.' } }) }}>
              Plus tard
            </Button>
          )}
        </div>
      </form>
    </Panel>
  )
}

function FieldInput({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  return (
    <div className={def.kind === 'longtext' ? 'sm:col-span-2' : ''}>
      <Field label={def.label} required={def.required} help={def.unit ? `Unité : ${def.unit}` : undefined}>
        {(p) =>
          def.kind === 'choice' ? (
            <select {...p} className={input} value={value} onChange={(e) => onChange(e.target.value)}>
              <option value="">— Choisir —</option>
              {def.choices!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ) : def.kind === 'longtext' ? (
            <textarea {...p} rows={3} className={input} value={value} onChange={(e) => onChange(e.target.value)} />
          ) : (
            <input {...p} type={def.kind === 'month' ? 'month' : 'text'} inputMode={def.kind === 'integer' || def.kind === 'decimal' ? 'decimal' : undefined} className={input} value={value} onChange={(e) => onChange(e.target.value)} />
          )
        }
      </Field>
    </div>
  )
}
