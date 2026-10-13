import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { api, ApiError } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { Alert, Button, Card, Field, inputClass, PageTitle } from '../../shared/ui'
import { dossierKey, type Dossier, type FactItem, type FactState, type FactValue } from './api'
import { useCurrentDossier } from './DossierLayout'
import { readDeferred, writeDeferred } from './deferred'
import { canEdit } from './roles'
import { FIRST_KEYS, shortValue } from './subjects'

/**
 * Premières questions du débutant : quatre courtes étapes, puis un récapitulatif avant la
 * synthèse (direction retenue après UX2, prototype UX1/UX2 comme référence de conception).
 *
 * Chaque étape est enregistrée sur le serveur en la quittant (« Continuer ») ; rien n'est promis
 * avant la réponse du serveur. La reprise part toujours de ce qui est enregistré. « Je ne sais
 * pas encore » est enregistré (statut inconnu) ; « Répondre plus tard » n'enregistre rien et reste
 * le repère local du pas-à-pas (D-049). Un renvoi identique après une coupure n'est pas un conflit :
 * la même version attendue est renvoyée.
 */
type Key = (typeof FIRST_KEYS)[number]
type Mode = 'reponse' | 'inconnu' | 'plus_tard'
type Answer = { mode: Mode; value: Record<string, string> }
type Saved = Pick<FactState, 'status' | 'value' | 'source' | 'row_version'>

const SCREENS: { title: string; keys: Key[] }[] = [
  { title: 'Votre culture', keys: ['culture', 'periode'] },
  { title: 'Le lieu et le terrain', keys: ['localisation', 'acces_terrain'] },
  { title: 'L’eau', keys: ['eau'] },
  { title: 'La vente', keys: ['debouches'] },
]
const QUESTION: Record<Key, string> = {
  culture: 'Que voulez-vous cultiver ?',
  periode: 'Quand voudriez-vous commencer ?',
  localisation: 'Où se trouverait le terrain ?',
  acces_terrain: 'Avez-vous accès à un terrain ?',
  eau: 'D’où viendrait l’eau ?',
  debouches: 'À qui pensez-vous vendre ?',
}
/** Champs posés ici ; les autres (surface, précisions, fin…) restent tels qu'enregistrés. */
const SHOWN: Record<Key, string[]> = {
  culture: ['nom'],
  periode: ['debut'],
  localisation: ['region', 'lieu'],
  acces_terrain: ['situation'],
  eau: ['source'],
  debouches: ['description'],
}
const required = (k: Key) => SHOWN[k][0]!

/** Une réponse estimée ou vérifiée se modifie dans sa fiche : ici, on ne déclare que. */
const locked = (s: Saved) => s.status === 'estime' || s.status === 'verifie'

function answerFrom(saved: Saved, deferred: boolean, k: Key): Answer {
  if (saved.status === 'non_renseigne') return { mode: deferred ? 'plus_tard' : 'reponse', value: {} }
  if (saved.status === 'inconnu') return { mode: 'inconnu', value: {} }
  const value: Record<string, string> = {}
  for (const name of SHOWN[k]) {
    const raw = saved.value?.[name]
    if (raw !== undefined && raw !== null) value[name] = String(raw)
  }
  return { mode: 'reponse', value }
}

const filled = (a: Answer, k: Key) => a.mode !== 'reponse' || Boolean(a.value[required(k)]?.trim())

/** Écriture à faire pour une réponse, ou null si rien ne change par rapport au serveur. */
function writeFor(k: Key, a: Answer, s: Saved): { status: 'inconnu' | 'declare'; value: FactValue | null } | null {
  if (locked(s) || a.mode === 'plus_tard') return null
  if (a.mode === 'inconnu') return s.status === 'inconnu' ? null : { status: 'inconnu', value: null }
  const value: FactValue = { ...(s.status === 'inconnu' ? {} : (s.value ?? {})) }
  for (const name of SHOWN[k]) {
    const raw = a.value[name]?.trim() ?? ''
    if (raw) value[name] = raw
    else delete value[name]
  }
  const same = s.status === 'declare' && SHOWN[k].every((n) => String(s.value?.[n] ?? '') === (a.value[n]?.trim() ?? ''))
  return same ? null : { status: 'declare', value }
}

function startStep(dossier: Dossier, deferred: string[]): number {
  const facts = FIRST_KEYS.map((k) => dossier.facts.find((f) => f.key === k))
  const untouched = facts.every((f) => !f || f.state.status === 'non_renseigne') && !FIRST_KEYS.some((k) => deferred.includes(k))
  if (untouched) return 0
  const i = SCREENS.findIndex((s) =>
    s.keys.some((k) => {
      const f = dossier.facts.find((x) => x.key === k)
      return f?.state.status === 'non_renseigne' && !deferred.includes(k)
    }),
  )
  return i === -1 ? SCREENS.length + 1 : i + 1
}

export function OnboardingPage() {
  const dossier = useCurrentDossier()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const facts = Object.fromEntries(
    FIRST_KEYS.map((k) => [k, dossier.facts.find((f) => f.key === k)]),
  ) as Record<Key, FactItem | undefined>
  const keys = FIRST_KEYS.filter((k) => facts[k])
  const [deferred, setDeferred] = useState<string[]>(() => readDeferred(dossier.id))
  const [saved, setSaved] = useState<Record<string, Saved>>(() =>
    Object.fromEntries(keys.map((k) => [k, { ...facts[k]!.state }])),
  )
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(keys.map((k) => [k, answerFrom(facts[k]!.state, deferred.includes(k), k)])),
  )
  const [step, setStep] = useState(() => startStep(dossier, deferred))
  const [missing, setMissing] = useState<Key[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<{ key: Key; error: ApiError | Error } | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  // Saisie non encore enregistrée : la quitter demande confirmation (mêmes règles que partout).
  // « Répondre plus tard » n'a rien à enregistrer ; une réponse encore vide non plus.
  const dirty = keys.some((k) => {
    const a = answers[k]!
    const s = saved[k]!
    if (a.mode === 'reponse' && s.status === 'non_renseigne' && !Object.values(a.value).some((v) => v.trim())) return false
    return writeFor(k, a, s) !== null
  })
  const { allowNextNavigation } = useUnsavedChanges(dirty)

  // Changement d'étape : le focus va au titre (clavier, lecteur d'écran), la page remonte.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [step])

  if (!canEdit(dossier)) {
    return (
      <div className="space-y-4">
        <PageTitle>Premières questions</PageTitle>
        <Alert tone="neutral">
          {dossier.archived ? 'Dossier archivé : consultation seulement.' : 'Seul le porteur du projet répond à ces questions.'}{' '}
          <Link to={`/d/${dossier.id}`} className="underline">Retour au dossier</Link>
        </Alert>
      </div>
    )
  }

  const total = SCREENS.length
  const go = (to: number) => {
    setMissing([])
    setError(null)
    setStep(to)
  }
  const set = (k: Key, a: Answer) => {
    setAnswers((s) => ({ ...s, [k]: a }))
    setMissing((m) => m.filter((x) => x !== k))
  }
  function updateDeferred(next: string[]) {
    setDeferred(next)
    writeDeferred(dossier.id, next)
  }

  async function reload(k: Key) {
    await queryClient.refetchQueries({ queryKey: dossierKey(dossier.id) })
    const fresh = queryClient.getQueryData<Dossier>(dossierKey(dossier.id))?.facts.find((f) => f.key === k)
    if (!fresh) return
    setSaved((s) => ({ ...s, [k]: { ...fresh.state } }))
    setAnswers((s) => ({ ...s, [k]: answerFrom(fresh.state, deferred.includes(k), k) }))
    setError(null)
  }

  /** Enregistre les réponses de l'étape, une à une ; s'arrête à la première erreur. */
  async function saveStep(screenKeys: Key[]): Promise<boolean> {
    const pending = screenKeys.filter((k) => facts[k] && !filled(answers[k]!, k))
    if (pending.length) {
      setMissing(pending)
      return false
    }
    setError(null)
    let nextDeferred = deferred
    let changed = false
    try {
      for (const k of screenKeys) {
        const a = answers[k]
        const s = saved[k]
        if (!a || !s) continue
        if (a.mode === 'plus_tard') {
          if (s.status === 'non_renseigne' && !nextDeferred.includes(k)) nextDeferred = [...nextDeferred, k]
          continue
        }
        nextDeferred = nextDeferred.filter((x) => x !== k)
        const write = writeFor(k, a, s)
        if (!write) continue
        try {
          const result = await api<{ state: FactState; changed: boolean }>(`/dossiers/${dossier.id}/informations/${k}`, {
            method: 'PUT',
            body: { ...write, source: s.source, expected_version: s.row_version },
          })
          changed = true
          setSaved((prev) => ({ ...prev, [k]: { ...result.state } }))
          setAnswers((prev) => ({ ...prev, [k]: answerFrom(result.state, false, k) }))
        } catch (e) {
          setError({ key: k, error: e as Error })
          return false
        }
      }
      return true
    } finally {
      if (nextDeferred !== deferred) updateDeferred(nextDeferred)
      if (changed) void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[1] === dossier.id })
    }
  }

  async function next() {
    const screen = SCREENS[step - 1]!
    setBusy(true)
    const ok = await saveStep(screen.keys)
    // Même rendu : l'étape change et le bouton se libère ensemble.
    if (ok) {
      setNotice(`Étape « ${screen.title} » enregistrée dans votre dossier.`)
      go(step + 1)
    }
    setBusy(false)
  }

  if (step === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <PageTitle subtitle={`${dossier.project.name} · ${dossier.label}`}>Préparez votre première campagne</PageTitle>
        <p>
          Quelques questions sur votre projet, puis une première synthèse : ce qui est connu, ce qui reste à éclaircir et
          une première étape à réaliser. Vous complétez le reste ensuite, à votre rythme.
        </p>
        <Alert tone="neutral">
          « Je ne sais pas encore » est toujours une réponse possible. La synthèse n'est pas un avis sur la faisabilité du
          projet.
        </Alert>
        <Button onClick={() => go(1)}>Commencer</Button>
        <p className="text-sm text-muted">{total} courtes étapes. Chaque étape est enregistrée quand vous continuez.</p>
      </div>
    )
  }

  if (step === total + 1) {
    const anyAnswer = keys.some((k) => saved[k]!.status !== 'non_renseigne')
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Progress current={total} total={total} label="Vérifier avant la synthèse" />
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold focus:outline-none">
          Avant votre première synthèse
        </h1>
        {notice && <Alert tone="ok" role="status">{notice}</Alert>}
        <p className="text-sm text-muted">
          Ce récapitulatif reprend ce qui est enregistré dans votre dossier. Les questions remises à plus tard restent sans
          réponse : rien n'est enregistré pour elles.
        </p>
        <Card>
          <ul className="divide-y divide-line">
            {keys.map((k) => {
              const fact = { ...facts[k]!, state: { ...facts[k]!.state, ...saved[k]! } }
              const screen = SCREENS.findIndex((s) => s.keys.includes(k)) + 1
              const empty = fact.state.status === 'non_renseigne' || fact.state.status === 'inconnu'
              return (
                <li key={k} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span>
                    <span className="block text-sm text-muted">{fact.label}</span>
                    <span className={empty ? 'italic' : 'font-medium'}>{shortValue(fact, deferred.includes(k))}</span>
                  </span>
                  <Button variant="ghost" onClick={() => go(screen)}>
                    Modifier<span className="sr-only"> : {fact.label}</span>
                  </Button>
                </li>
              )
            })}
          </ul>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              allowNextNavigation()
              navigate(`/d/${dossier.id}?premiere=1`)
            }}
          >
            {anyAnswer ? 'Voir ma première synthèse' : 'Voir mon dossier'}
          </Button>
          <Button variant="ghost" onClick={() => go(total)}>Retour</Button>
        </div>
      </div>
    )
  }

  const screen = SCREENS[step - 1]!
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Progress current={step} total={total} label={screen.title} />
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold focus:outline-none">Quelques premières questions</h1>
      {notice && step > 1 && <Alert tone="ok" role="status">{notice}</Alert>}
      {screen.keys.filter((k) => facts[k]).map((k) => (
        <Question
          key={k}
          k={k}
          fact={facts[k]!}
          answer={answers[k]!}
          saved={saved[k]!}
          dossierId={dossier.id}
          missing={missing.includes(k)}
          error={error?.key === k ? error.error : null}
          onReload={() => void reload(k)}
          onChange={(a) => set(k, a)}
        />
      ))}
      {error && !(error.error instanceof ApiError && (error.error.code === 'conflit' || error.error.fields)) && (
        <Alert tone="danger" role="alert" title="Étape non enregistrée">
          {error.error.message} Vos réponses restent à l'écran.
        </Alert>
      )}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void next()} busy={busy}>
          {error?.error instanceof ApiError && error.error.network
            ? 'Réessayer l’enregistrement'
            : step === total
              ? 'Enregistrer et vérifier mes réponses'
              : 'Enregistrer et continuer'}
        </Button>
        <Button variant="ghost" onClick={() => go(step - 1)} disabled={busy}>Retour</Button>
      </div>
      <p className="text-sm text-muted">
        {step < total
          ? `Encore ${total - step} étape${total - step > 1 ? 's' : ''}, puis un récapitulatif avant votre synthèse.`
          : 'Dernière étape avant le récapitulatif.'}{' '}
        Vous pouvez vous arrêter : ce qui est enregistré est conservé.
      </p>
    </div>
  )
}

function Progress({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-brand-800">Étape {current} sur {total} · {label}</p>
      <div className="mt-1 flex gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < current ? 'bg-brand-700' : 'bg-line'}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">C'est l'avancement des questions, pas une mesure de la faisabilité.</p>
    </div>
  )
}

/** Une question : la réponse directement, puis deux autres possibilités. */
function Question({
  k,
  fact,
  answer,
  saved,
  dossierId,
  missing,
  error,
  onReload,
  onChange,
}: {
  k: Key
  fact: FactItem
  answer: Answer
  saved: Saved
  dossierId: number
  missing: boolean
  error: Error | null
  onReload: () => void
  onChange: (a: Answer) => void
}) {
  const field = (name: string) => fact.fields.find((f) => f.name === name)
  const value = answer.mode === 'reponse' ? answer.value : {}
  const setValue = (name: string, v: string) => onChange({ mode: 'reponse', value: { ...value, [name]: v } })
  const apiError = error instanceof ApiError ? error : null
  const valueErrors = (apiError?.fields?.value ?? null) as Record<string, string> | string | null
  const fieldError = (name: string) => (valueErrors && typeof valueErrors === 'object' ? valueErrors[name] : undefined)
  const titleId = `question-${k}`

  if (locked(saved)) {
    return (
      <Card>
        <h2 id={titleId} className="text-lg font-semibold">{QUESTION[k]}</h2>
        <p className="mt-1">{shortValue({ ...fact, state: { ...fact.state, ...saved } }, false)}</p>
        <p className="mt-1 text-sm text-muted">
          Information {saved.status === 'verifie' ? 'vérifiée' : 'estimée'} : elle se modifie dans sa fiche, avec sa source.{' '}
          <Link to={`/d/${dossierId}/projet/${k}`} className="text-brand-700 underline">Ouvrir la fiche</Link>
        </p>
      </Card>
    )
  }

  let control: ReactNode
  const choiceField = k === 'eau' ? field('source') : k === 'acces_terrain' ? field('situation') : undefined
  if (choiceField) {
    control = (
      <fieldset aria-labelledby={titleId}>
        <div className="grid gap-2 sm:grid-cols-2">
          {choiceField.choices.map((c) => (
            <label key={c.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-line px-3 py-2 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
              <input
                type="radio"
                name={`${k}-${choiceField.name}`}
                className="size-5 shrink-0 accent-brand-700"
                checked={value[choiceField.name] === c.value}
                onChange={() => setValue(choiceField.name, c.value)}
              />
              {c.label}
            </label>
          ))}
        </div>
        {fieldError(choiceField.name) && <p className="mt-1 text-sm font-medium text-danger-700">{fieldError(choiceField.name)}</p>}
      </fieldset>
    )
  } else if (k === 'localisation') {
    control = (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Région" error={fieldError('region')}>
          {(p) => (
            <select {...p} className={inputClass} value={value.region ?? ''} onChange={(e) => setValue('region', e.target.value)}>
              <option value="">— Choisir —</option>
              {field('region')?.choices.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          )}
        </Field>
        <Field label="Commune, village ou quartier (facultatif)" error={fieldError('lieu')}>
          {(p) => <input {...p} className={inputClass} maxLength={120} value={value.lieu ?? ''} onChange={(e) => setValue('lieu', e.target.value)} />}
        </Field>
      </div>
    )
  } else if (k === 'periode') {
    control = (
      <Field label="Mois de début" error={fieldError('debut')}>
        {(p) => <input {...p} type="month" placeholder="AAAA-MM" className={`${inputClass} sm:max-w-xs`} value={value.debut ?? ''} onChange={(e) => setValue('debut', e.target.value)} />}
      </Field>
    )
  } else if (k === 'culture') {
    control = (
      <Field label="Culture" error={fieldError('nom')}>
        {(p) => <input {...p} className={`${inputClass} sm:max-w-sm`} maxLength={120} value={value.nom ?? ''} onChange={(e) => setValue('nom', e.target.value)} />}
      </Field>
    )
  } else {
    control = (
      <Field label="Acheteurs envisagés" help="Marché, commerçant, voisins…" error={fieldError('description')}>
        {(p) => <textarea {...p} rows={2} className={inputClass} value={value.description ?? ''} onChange={(e) => setValue('description', e.target.value)} />}
      </Field>
    )
  }

  const alt = (mode: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={answer.mode === mode}
      // Second appui : retour à la réponse enregistrée s'il y en a une, sinon à une réponse vide.
      onClick={() => onChange(answer.mode === mode ? { mode: 'reponse', value: saved.status === 'declare' ? answerFrom(saved, false, k).value : {} } : { mode, value: {} })}
      className="min-h-11 rounded-full px-3 text-sm font-medium text-brand-800 ring-1 ring-inset ring-line aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
    >
      {label}
    </button>
  )

  return (
    <Card>
      <section aria-labelledby={titleId}>
        <h2 id={titleId} className="text-lg font-semibold">{QUESTION[k]}</h2>
        <p className="mb-3 text-sm text-muted">{fact.why}</p>
        {apiError?.code === 'conflit' && (
          <Alert tone="danger" role="alert" title="Modification refusée">
            <p>{apiError.message}</p>
            <p className="mt-1">
              Votre saisie est conservée.{' '}
              <button type="button" className="font-medium underline" onClick={onReload}>Recharger la version enregistrée</button>{' '}
              (votre saisie sera alors perdue).
            </p>
          </Alert>
        )}
        {apiError && typeof valueErrors === 'string' && <p role="alert" className="mb-2 text-sm font-medium text-danger-700">{valueErrors}</p>}
        {control}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Ou :</span>
          {alt('inconnu', 'Je ne sais pas encore')}
          {saved.status === 'non_renseigne' && alt('plus_tard', 'Répondre plus tard')}
        </div>
        {answer.mode === 'inconnu' && (
          <p className="mt-2 text-sm">Sera enregistré comme une inconnue : la synthèse proposera une démarche pour l'éclaircir quand il en existe une.</p>
        )}
        {answer.mode === 'plus_tard' && (
          <p className="mt-2 text-sm">Rien ne sera enregistré : la question restera sans réponse, à reprendre plus tard.</p>
        )}
        {missing && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger-700">
            Répondez, ou choisissez « Je ne sais pas encore »{saved.status === 'non_renseigne' ? ' ou « Répondre plus tard »' : ''}.
          </p>
        )}
      </section>
    </Card>
  )
}
