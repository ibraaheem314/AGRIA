import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { FACT_BY_KEY, factLabel, REGIONS } from '../data/facts'
import { describe, type FactState, type Value } from '../data/model'
import { useStore } from '../data/store'
import { Button, Field, input, Note, PageHeader, Panel, Steps } from '../ui'

/**
 * Débutant : quelques premières questions, une ou deux par écran quand elles décrivent la même
 * chose (la culture et sa période ; le lieu et le terrain), puis un récapitulatif modifiable avant
 * la première synthèse. Chaque question accepte « Je ne sais pas encore » (enregistré) ou
 * « Répondre plus tard » (rien n'est enregistré). Aucun choix ne préremplit une réponse.
 */
type Mode = 'reponse' | 'inconnu' | 'plus_tard'
type Answer = { mode: Mode; value: Value }
const KEYS = ['culture', 'periode', 'localisation', 'acces_terrain', 'eau', 'debouches'] as const
type Key = (typeof KEYS)[number]
const REQUIRED: Record<Key, string> = { culture: 'nom', localisation: 'region', periode: 'debut', acces_terrain: 'situation', eau: 'source', debouches: 'description' }

const SCREENS: { title: string; keys: Key[] }[] = [
  { title: 'Votre culture', keys: ['culture', 'periode'] },
  { title: 'Le lieu et le terrain', keys: ['localisation', 'acces_terrain'] },
  { title: "L'eau", keys: ['eau'] },
  { title: 'La vente', keys: ['debouches'] },
]
const QUESTION: Record<Key, string> = {
  culture: 'Que voulez-vous cultiver ?',
  periode: 'Quand voudriez-vous commencer ?',
  localisation: 'Où se trouverait le terrain ?',
  acces_terrain: 'Avez-vous accès à un terrain ?',
  eau: "D'où viendrait l'eau ?",
  debouches: 'À qui pensez-vous vendre ?',
}

const blank = (): Record<Key, Answer> => Object.fromEntries(KEYS.map((k) => [k, { mode: 'reponse', value: {} }])) as Record<Key, Answer>
const answered = (a: Answer, k: Key) => a.mode !== 'reponse' || Boolean(a.value[REQUIRED[k]]?.trim())

export function Onboarding() {
  const { ops } = useStore()
  const navigate = useNavigate()
  // 0 : présentation ; 1 à 4 : questions ; 5 : récapitulatif.
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(blank)
  const [idea, setIdea] = useState('')
  const [errors, setErrors] = useState<Key[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const dirty = idea.trim() !== '' || KEYS.some((k) => answers[k].mode !== 'reponse' || Object.values(answers[k].value).some(Boolean))
  const { allowNextNavigation } = useUnsavedChanges(dirty)
  const total = SCREENS.length

  // Changement d'étape : le focus va au titre de l'étape (clavier, lecteur d'écran).
  useEffect(() => {
    if (step > 0) headingRef.current?.focus()
  }, [step])

  const set = (k: Key, a: Answer) => setAnswers((s) => ({ ...s, [k]: a }))
  const go = (to: number) => { setErrors([]); setStep(to) }

  function next() {
    const missing = SCREENS[step - 1]!.keys.filter((k) => !answered(answers[k], k))
    if (missing.length) return setErrors(missing)
    go(step + 1)
  }

  function finish() {
    const facts: Record<string, FactState> = {}
    const deferred: string[] = []
    for (const k of KEYS) {
      const a = answers[k]
      if (a.mode === 'plus_tard' || !answered(a, k)) deferred.push(k)
      else if (a.mode === 'inconnu') facts[k] = { status: 'inconnu', value: null, source: '' }
      else facts[k] = { status: 'declare', value: Object.fromEntries(Object.entries(a.value).filter(([, v]) => v.trim())), source: '' }
    }
    const culture = answers.culture.mode === 'reponse' ? answers.culture.value.nom?.trim() : ''
    const debut = answers.periode.mode === 'reponse' ? answers.periode.value.debut : ''
    const id = ops.createDossier({
      owner: 'awa',
      profile: 'debutant',
      idea: idea.trim(),
      projectName: culture ? `${culture} — premier projet` : 'Mon premier projet',
      campaign: debut ? `Campagne à partir de ${new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(`${debut}-01`))}` : 'Prochaine campagne',
      facts,
      deferred,
    })
    allowNextNavigation()
    navigate(`/d/${id}?premiere=1`)
  }

  if (step === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <PageHeader eyebrow="Préparer une campagne" title="Préparez votre première campagne">
          Quelques questions sur votre projet, puis une première synthèse : ce qui est connu, ce qui reste à éclaircir, et une
          première étape à réaliser. Vous complétez le reste ensuite, à votre rythme.
        </PageHeader>
        <Note tone="neutral">« Je ne sais pas encore » est toujours une réponse possible. La synthèse n'est pas un avis sur la faisabilité du projet.</Note>
        <Button onClick={() => go(1)}>Commencer</Button>
        <p className="text-sm text-muted">{total} courtes étapes, environ cinq minutes.</p>
      </div>
    )
  }

  if (step === total + 1) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Steps current={total} total={total} label="Vérifier avant la synthèse" />
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl">Avant votre première synthèse</h1>
        <Panel>
          <ul className="divide-y divide-line">
            {KEYS.map((k) => {
              const a = answers[k]
              const text = a.mode === 'inconnu' ? 'Je ne sais pas encore' : a.mode === 'plus_tard' || !answered(a, k) ? 'Répondre plus tard' : describe(k, { status: 'declare', value: a.value, source: '' })
              const screen = SCREENS.findIndex((s) => s.keys.includes(k)) + 1
              return (
                <li key={k} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span><span className="block text-sm text-muted">{factLabel(k, 'debutant')}</span><span className={a.mode === 'reponse' ? 'font-medium' : 'italic'}>{text}</span></span>
                  <Button variant="quiet" onClick={() => go(screen)}>Modifier<span className="sr-only"> : {factLabel(k, 'debutant')}</span></Button>
                </li>
              )
            })}
          </ul>
        </Panel>
        <Panel>
          <Field label="Votre projet en une phrase (facultatif)" help="Ce qui vous motive, ou ce que les questions n'ont pas couvert. Inutile de répéter vos réponses.">
            {(p) => <textarea {...p} rows={2} className={input} value={idea} onChange={(e) => setIdea(e.target.value)} />}
          </Field>
        </Panel>
        <div className="flex flex-wrap gap-3">
          <Button onClick={finish}>Voir ma première synthèse</Button>
          <Button variant="quiet" onClick={() => go(total)}>Retour</Button>
        </div>
      </div>
    )
  }

  const screen = SCREENS[step - 1]!
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Steps current={step} total={total} label={screen.title} />
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl">Quelques premières questions</h1>
      {screen.keys.map((k) => (
        <Question key={k} k={k} a={answers[k]} onChange={(a) => set(k, a)} error={errors.includes(k)} />
      ))}
      <div className="flex flex-wrap gap-3">
        <Button onClick={next}>{step === total ? 'Vérifier mes réponses' : 'Continuer'}</Button>
        <Button variant="quiet" onClick={() => go(step - 1)}>Retour</Button>
      </div>
      <p className="text-sm text-muted">{step < total ? `Encore ${total - step} étape${total - step > 1 ? 's' : ''}, puis un récapitulatif avant votre synthèse.` : 'Dernière étape avant le récapitulatif.'}</p>
    </div>
  )
}

/** Une question : la réponse directement, puis deux autres possibilités. */
function Question({ k, a, onChange, error }: { k: Key; a: Answer; onChange: (a: Answer) => void; error: boolean }) {
  const def = FACT_BY_KEY[k]!
  const setValue = (field: string, v: string) => onChange({ mode: 'reponse', value: { ...(a.mode === 'reponse' ? a.value : {}), [field]: v } })
  const value = a.mode === 'reponse' ? a.value : {}
  let control: ReactNode
  if (k === 'acces_terrain' || k === 'eau') {
    const field = k === 'eau' ? 'source' : 'situation'
    const choices = def.fields.find((f) => f.name === field)!.choices!
    control = (
      <div className="grid gap-2 sm:grid-cols-2">
        {choices.map(([v, label]) => (
          <label key={v} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
            <input type="radio" name={`${k}-${field}`} className="size-5 shrink-0 accent-brand-700" checked={value[field] === v} onChange={() => setValue(field, v)} />
            {label}
          </label>
        ))}
      </div>
    )
  } else if (k === 'localisation') {
    control = (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Région">
          {(p) => (
            <select {...p} className={input} value={value.region ?? ''} onChange={(e) => setValue('region', e.target.value)}>
              <option value="">— Choisir —</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          )}
        </Field>
        <Field label="Commune, village ou quartier (facultatif)">{(p) => <input {...p} className={input} value={value.lieu ?? ''} onChange={(e) => setValue('lieu', e.target.value)} />}</Field>
      </div>
    )
  } else if (k === 'periode') {
    control = <Field label="Mois de début">{(p) => <input {...p} type="month" className={`${input} sm:max-w-xs`} value={value.debut ?? ''} onChange={(e) => setValue('debut', e.target.value)} />}</Field>
  } else if (k === 'culture') {
    control = <Field label="Culture">{(p) => <input {...p} className={`${input} sm:max-w-sm`} value={value.nom ?? ''} onChange={(e) => setValue('nom', e.target.value)} />}</Field>
  } else {
    control = <Field label="Acheteurs envisagés" help="Marché, commerçant, voisins…">{(p) => <textarea {...p} rows={2} className={input} value={value.description ?? ''} onChange={(e) => setValue('description', e.target.value)} />}</Field>
  }
  const alt = (mode: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={a.mode === mode}
      onClick={() => onChange(a.mode === mode ? { mode: 'reponse', value: {} } : { mode, value: {} })}
      className="min-h-11 rounded-full px-3 text-sm font-medium text-brand-800 ring-1 ring-inset ring-line aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
    >
      {label}
    </button>
  )
  return (
    <Panel as="section" label={QUESTION[k]}>
      <h2 className="text-lg font-semibold">{QUESTION[k]}</h2>
      <p className="mb-3 text-sm text-muted">{def.why}</p>
      {control}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Ou :</span>
        {alt('inconnu', 'Je ne sais pas encore')}
        {alt('plus_tard', 'Répondre plus tard')}
      </div>
      {a.mode === 'inconnu' && <p className="mt-2 text-sm">Enregistré comme une inconnue : la synthèse proposera une démarche pour l'éclaircir quand il en existe une.</p>}
      {a.mode === 'plus_tard' && <p className="mt-2 text-sm">Rien n'est enregistré : la question restera « pas encore abordée ».</p>}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-danger-700">Répondez, ou choisissez « Je ne sais pas encore » ou « Répondre plus tard ».</p>}
    </Panel>
  )
}
