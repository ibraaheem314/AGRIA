import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { FACT_BY_KEY, REGIONS } from '../data/facts'
import type { FactState, Value } from '../data/model'
import { useStore } from '../data/store'
import { Button, Field, input, Note, PageHeader, Panel, Steps } from '../ui'

type Mode = 'repondre' | 'inconnu' | 'plus_tard'
type Answer = { mode: Mode; value: Value }
const KEYS = ['culture', 'localisation', 'periode', 'acces_terrain', 'eau', 'debouches'] as const
type Key = (typeof KEYS)[number]
const empty = (): Record<Key, Answer> => Object.fromEntries(KEYS.map((k) => [k, { mode: 'repondre', value: {} }])) as Record<Key, Answer>

const REQUIRED: Record<Key, string> = { culture: 'nom', localisation: 'region', periode: 'debut', acces_terrain: 'situation', eau: 'source', debouches: 'description' }

/** Débutant : une idée concrète, puis trois points décisifs, avant une première synthèse. */
export function Onboarding() {
  const { ops } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [idea, setIdea] = useState('')
  const [answers, setAnswers] = useState(empty)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const dirty = idea.trim() !== '' || KEYS.some((k) => answers[k].mode !== 'repondre' || Object.values(answers[k].value).some(Boolean))
  const { allowNextNavigation } = useUnsavedChanges(dirty)

  const set = (k: Key, a: Partial<Answer>) => setAnswers((s) => ({ ...s, [k]: { ...s[k], ...a, value: { ...s[k].value, ...(a.value ?? {}) } } }))

  function validate(keys: Key[]): boolean {
    const e: Partial<Record<Key, string>> = {}
    for (const k of keys) {
      if (answers[k].mode === 'repondre' && !answers[k].value[REQUIRED[k]]?.trim()) {
        e[k] = 'Indiquez une réponse, ou choisissez « Je ne sais pas encore » ou « Plus tard ».'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function finish() {
    if (!validate(['acces_terrain', 'eau', 'debouches'])) return
    const facts: Record<string, FactState> = {}
    const deferred: string[] = []
    for (const k of KEYS) {
      const a = answers[k]
      if (a.mode === 'plus_tard') deferred.push(k)
      else if (a.mode === 'inconnu') facts[k] = { status: 'inconnu', value: null, source: '' }
      else facts[k] = { status: 'declare', value: Object.fromEntries(Object.entries(a.value).filter(([, v]) => v.trim())), source: '' }
    }
    const culture = answers.culture.mode === 'repondre' ? answers.culture.value.nom : ''
    const debut = answers.periode.mode === 'repondre' ? answers.periode.value.debut : ''
    const id = ops.createDossier({
      owner: 'awa',
      profile: 'debutant',
      idea: idea.trim() || 'Projet agricole en préparation',
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
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader eyebrow="Préparer une campagne" title="Partez de votre idée, pas d'un formulaire">
          En quelques minutes, AGRIA vous montre ce que votre projet dit déjà, ce qui reste à éclaircir et par quelles démarches
          commencer. Vous compléterez le reste au fil de la préparation.
        </PageHeader>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ['1', 'Votre idée', 'Ce que vous voulez cultiver, où, et quand.'],
            ['2', 'Trois points décisifs', "Le terrain, l'eau et à qui vendre."],
            ['3', 'Une première synthèse', 'Connu, inconnu, et les premières démarches proposées.'],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-xl bg-surface p-4 ring-1 ring-line">
              <p className="text-sm font-semibold text-brand-800">{n}</p>
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
        <Note tone="neutral">« Je ne sais pas encore » est toujours une réponse possible. Rien n'est vérifié à votre place : la synthèse n'est pas un avis sur la faisabilité.</Note>
        <Button onClick={() => setStep(1)}>Décrire mon projet</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Steps current={step} total={2} label={step === 1 ? 'Votre idée' : 'Trois points décisifs'} />
      {step === 1 ? (
        <>
          <PageHeader title="Votre idée de projet">Quelques mots suffisent. Vous pourrez tout modifier ensuite.</PageHeader>
          <Panel>
            <Field label="En une phrase, que voulez-vous faire ?" help="Par exemple : cultiver des oignons près de chez moi pour les vendre au marché.">
              {(p) => <textarea {...p} rows={2} className={input} value={idea} onChange={(e) => setIdea(e.target.value)} />}
            </Field>
          </Panel>
          <Question k="culture" a={answers.culture} set={set} error={errors.culture} title="Que voulez-vous cultiver ?">
            <Field label="Culture">{(p) => <input {...p} className={input} value={answers.culture.value.nom ?? ''} onChange={(e) => set('culture', { value: { nom: e.target.value } })} />}</Field>
          </Question>
          <Question k="localisation" a={answers.localisation} set={set} error={errors.localisation} title="Où se trouverait le terrain ?">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Région">
                {(p) => (
                  <select {...p} className={input} value={answers.localisation.value.region ?? ''} onChange={(e) => set('localisation', { value: { region: e.target.value } })}>
                    <option value="">— Choisir —</option>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                )}
              </Field>
              <Field label="Commune, village ou quartier">{(p) => <input {...p} className={input} value={answers.localisation.value.lieu ?? ''} onChange={(e) => set('localisation', { value: { lieu: e.target.value } })} />}</Field>
            </div>
          </Question>
          <Question k="periode" a={answers.periode} set={set} error={errors.periode} title="Quand voudriez-vous commencer ?">
            <Field label="Mois de début">{(p) => <input {...p} type="month" className={input} value={answers.periode.value.debut ?? ''} onChange={(e) => set('periode', { value: { debut: e.target.value } })} />}</Field>
          </Question>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => validate(['culture', 'localisation', 'periode']) && setStep(2)}>Continuer</Button>
            <Button variant="quiet" onClick={() => setStep(0)}>Retour</Button>
          </div>
        </>
      ) : (
        <>
          <PageHeader title="Trois points décisifs">
            Ce sont les points que les règles de préparation examinent en premier. Une réponse partielle vaut mieux que rien, et « Je
            ne sais pas encore » vous proposera une démarche pour le savoir.
          </PageHeader>
          <Question k="acces_terrain" a={answers.acces_terrain} set={set} error={errors.acces_terrain} title="Avez-vous accès à un terrain ?">
            <ChoiceList k="acces_terrain" field="situation" a={answers.acces_terrain} set={set} />
          </Question>
          <Question k="eau" a={answers.eau} set={set} error={errors.eau} title="D'où viendrait l'eau ?">
            <ChoiceList k="eau" field="source" a={answers.eau} set={set} />
          </Question>
          <Question k="debouches" a={answers.debouches} set={set} error={errors.debouches} title="À qui pensez-vous vendre ?">
            <Field label="Acheteurs envisagés" help="Marché, commerçant, voisins…">
              {(p) => <textarea {...p} rows={2} className={input} value={answers.debouches.value.description ?? ''} onChange={(e) => set('debouches', { value: { description: e.target.value } })} />}
            </Field>
          </Question>
          <div className="flex flex-wrap gap-3">
            <Button onClick={finish}>Voir ma première synthèse</Button>
            <Button variant="quiet" onClick={() => setStep(1)}>Retour</Button>
          </div>
        </>
      )}
    </div>
  )
}

function Question({ k, a, set, error, title, children }: { k: Key; a: Answer; set: (k: Key, a: Partial<Answer>) => void; error?: string; title: string; children: ReactNode }) {
  const modes: { value: Mode; label: string }[] = [
    { value: 'repondre', label: 'Je réponds' },
    { value: 'inconnu', label: 'Je ne sais pas encore' },
    { value: 'plus_tard', label: 'Plus tard' },
  ]
  return (
    <Panel>
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">{title}</legend>
        <p className="text-sm text-muted">{FACT_BY_KEY[k]!.why}</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Réponse : ${title}`}>
          {modes.map((m) => (
            <label key={m.value} className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium ring-1 ring-line has-[:checked]:bg-brand-700 has-[:checked]:text-white has-[:checked]:ring-brand-700 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-info-700">
              <input type="radio" className="sr-only" name={`mode-${k}`} checked={a.mode === m.value} onChange={() => set(k, { mode: m.value })} />
              {m.label}
            </label>
          ))}
        </div>
        {a.mode === 'repondre' && children}
        {a.mode === 'inconnu' && <p className="text-sm">Enregistré comme « Je ne sais pas encore » : la synthèse le montrera comme une inconnue, avec une démarche pour l'éclaircir quand il en existe une.</p>}
        {a.mode === 'plus_tard' && <p className="text-sm">Rien n'est enregistré : la question restera « pas encore abordée » et vous pourrez y revenir depuis la synthèse.</p>}
        {error && <p role="alert" className="text-sm font-medium text-danger-700">{error}</p>}
      </fieldset>
    </Panel>
  )
}

function ChoiceList({ k, field, a, set }: { k: Key; field: string; a: Answer; set: (k: Key, a: Partial<Answer>) => void }) {
  const choices = FACT_BY_KEY[k]!.fields.find((f) => f.name === field)!.choices!
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {choices.map(([v, label]) => (
        <label key={v} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
          <input type="radio" name={`${k}-${field}`} className="size-5 shrink-0 accent-brand-700" checked={a.value[field] === v} onChange={() => set(k, { value: { [field]: v } })} />
          {label}
        </label>
      ))}
    </div>
  )
}
