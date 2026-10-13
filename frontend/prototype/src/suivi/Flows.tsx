import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Button, ButtonLink, Choice, Field, input, Note, PageHeader, Panel, SectionTitle, TextLink } from '../ui'
import { CampaignContext, ConfirmBar, KindChip, Scripted } from './SuiviApp'
import {
  contradicts, daysBetween, estimatedStage, formatDay, lastOp, OP_LABEL, plan, STAGE_LABEL, TODAY,
  addDays, useDemo, type Op, type Stage,
} from './data'

/** Le titre de chaque étape reçoit le focus : clavier et lecteur d'écran suivent le parcours. */
function useStepFocus(step: unknown) {
  const ref = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    ref.current?.focus()
    window.scrollTo({ top: 0 })
  }, [step])
  return ref
}

const UNKNOWN = 'je_ne_sais_pas'

// ---- B. Observation : état général ou problème sur les feuilles -------------------------------

type ProblemAnswers = { feuilles: string; ou: string; depuis: string; aspect: string; arrosage: string }
const LEAVES = [
  { value: 'jeunes', label: 'Les plus jeunes' },
  { value: 'anciennes', label: 'Les plus anciennes' },
  { value: 'toutes', label: 'Jeunes et anciennes' },
  { value: UNKNOWN, label: 'Je ne sais pas' },
]
const WHERE = [
  { value: 'quelques', label: 'Quelques plants' },
  { value: 'zone', label: 'Une partie de la parcelle' },
  { value: 'partout', label: 'Toute la parcelle' },
  { value: UNKNOWN, label: 'Je ne sais pas' },
]
const SINCE = [
  { value: 'jours', label: 'Quelques jours' },
  { value: 'semaine', label: 'Plus d’une semaine' },
  { value: UNKNOWN, label: 'Je ne sais pas' },
]
const ASPECT = [
  { value: 'taches', label: 'Des taches' },
  { value: 'jaunissement', label: 'Un jaunissement' },
  { value: 'dessechement', label: 'Des pointes qui sèchent' },
  { value: 'autre', label: 'Autre chose' },
]
const label = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? '—'

export function ObservePage() {
  const [params] = useSearchParams()
  return params.get('probleme') === '1' ? <ProblemFlow /> : <GeneralObservation />
}

function GeneralObservation() {
  const { state, ops } = useDemo()
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage | ''>('')
  const [note, setNote] = useState('')
  const [step, setStep] = useState<'saisie' | 'contradiction'>('saisie')
  const [error, setError] = useState(false)
  const heading = useStepFocus(step)
  const est = estimatedStage(state)

  function save() {
    if (!stage) {
      setError(true)
      return
    }
    if (contradicts(state, stage)) {
      setStep('contradiction')
      return
    }
    ops.record({ kind: 'observe', date: TODAY, stage, title: 'Observation de la culture', details: note.trim() ? [note.trim()] : [] })
    navigate('/suivi/journal')
  }

  if (step === 'contradiction' && stage) return <Contradiction observed={stage} note={note} onBack={() => setStep('saisie')} />

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader eyebrow="Observation" title="Où en est la culture ?" />
      <h2 ref={heading} tabIndex={-1} className="sr-only">Saisie de l'observation</h2>
      <CampaignContext />
      <Panel>
        <Choice
          legend="Ce que vous voyez aujourd'hui"
          help={`D'après la date de repiquage, la fiche d'exemple situe la culture à « ${STAGE_LABEL[est.stage]} ». Indiquez ce que vous observez, même si c'est différent.`}
          name="stade"
          single
          value={stage}
          onChange={(v) => { setStage(v); setError(false) }}
          options={(Object.keys(STAGE_LABEL) as Stage[]).map((s) => ({ value: s, label: STAGE_LABEL[s] }))}
        />
        {error && <p role="alert" className="mt-2 text-sm font-medium text-danger-700">Choisissez ce que vous voyez.</p>}
        <div className="mt-4">
          <Field label="Remarque (facultatif)">
            {(p) => <textarea {...p} rows={2} className={input} value={note} onChange={(e) => setNote(e.target.value)} />}
          </Field>
        </div>
      </Panel>
      <ConfirmBar onCancel={() => navigate('/suivi')}>
        <Button onClick={save}>Enregistrer l'observation</Button>
      </ConfirmBar>
      <p className="text-sm text-muted">
        Un problème sur les feuilles ? <TextLink to="/suivi/observer?probleme=1">Le décrire</TextLink>
      </p>
    </div>
  )
}

/** Une contradiction est clarifiée par la personne : la dernière déclaration n'est pas tenue pour vraie d'office. */
function Contradiction({ observed, note, onBack }: { observed: Stage; note: string; onBack: () => void }) {
  const { state, ops } = useDemo()
  const navigate = useNavigate()
  const [choice, setChoice] = useState<'date' | 'observation' | 'plus_tard' | ''>('')
  const [date, setDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const sowing = lastOp(state, 'semis')
  const est = estimatedStage(state)

  function confirm() {
    if (choice === 'observation') return onBack()
    if (choice === 'plus_tard') {
      ops.record({ kind: 'observe', date: TODAY, stage: observed, title: 'Observation de la culture', details: ['À clarifier : ne correspond pas à la date de repiquage', ...(note.trim() ? [note.trim()] : [])] })
      ops.askClarification({ kind: 'stade', observed, entryDate: TODAY })
      return navigate('/suivi')
    }
    if (choice === 'date') {
      if (!date || daysBetween(date, TODAY) < 0 || (sowing && daysBetween(sowing.date, date) < 0)) {
        setError(`Indiquez une date entre le ${sowing ? formatDay(sowing.date) : 'semis'} et aujourd'hui.`)
        return
      }
      ops.correctTransplant(date, 'correction après une observation')
      ops.record({ kind: 'observe', date: TODAY, stage: observed, title: 'Observation de la culture', details: note.trim() ? [note.trim()] : [] })
      return navigate('/suivi')
    }
    setError('Choisissez une réponse.')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader eyebrow="À clarifier" title="Votre observation ne correspond pas à la date de repiquage" />
      <Scripted sources={['Votre journal', 'Fiche d’exemple non relue']}>
        <p>
          Vous observez « {STAGE_LABEL[observed]} ». Avec un repiquage le {formatDay(state.transplant)} ({est.weeks} semaines), la fiche
          d'exemple situe la culture à « {STAGE_LABEL[est.stage]} ». Les deux ne peuvent pas être justes en même temps, et je ne choisis
          pas à votre place.
        </p>
      </Scripted>
      <Panel>
        <Choice
          legend="Qu'est-ce qui est juste ?"
          name="clarifier"
          single
          value={choice}
          onChange={(v) => { setChoice(v); setError(null) }}
          options={[
            { value: 'date', label: 'Mon observation ; la date de repiquage est fausse', help: 'Le plan sera recalé ; les opérations déjà notées restent' },
            { value: 'observation', label: 'La date ; je corrige mon observation' },
            { value: 'plus_tard', label: 'Je ne sais pas ; je vérifierai', help: 'L’observation est notée « à clarifier »' },
          ]}
        />
        {choice === 'date' && (
          <div className="mt-4">
            <Field label="Date réelle du repiquage">
              {(p) => <input {...p} type="date" className={`${input} sm:max-w-xs`} value={date} onChange={(e) => setDate(e.target.value)} />}
            </Field>
          </div>
        )}
        {error && <p role="alert" className="mt-2 text-sm font-medium text-danger-700">{error}</p>}
      </Panel>
      <ConfirmBar onCancel={onBack}>
        <Button onClick={confirm}>Confirmer</Button>
      </ConfirmBar>
    </div>
  )
}

export function ClarifyPage() {
  const { state, ops } = useDemo()
  const navigate = useNavigate()
  if (!state.clarification) {
    return (
      <div className="space-y-3">
        <p>Rien à clarifier pour l'instant.</p>
        <TextLink to="/suivi">Revenir à la campagne</TextLink>
      </div>
    )
  }
  return (
    <Contradiction
      observed={state.clarification.observed}
      note=""
      onBack={() => {
        ops.askClarification(null)
        navigate('/suivi/observer')
      }}
    />
  )
}

function ProblemFlow() {
  const { state, ops } = useDemo()
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [photo, setPhoto] = useState(false)
  const [a, setA] = useState<ProblemAnswers>({ feuilles: '', ou: '', depuis: '', aspect: '', arrosage: '' })
  const [other, setOther] = useState('')
  const [followUp, setFollowUp] = useState(addDays(TODAY, 4))
  const [missing, setMissing] = useState(false)
  const heading = useStepFocus(step)
  const water = lastOp(state, 'arrosage')
  const waterGap = water ? daysBetween(water.date, TODAY) : null
  const weeding = lastOp(state, 'desherbage')
  const treatments = state.entries.filter((e) => e.op === 'traitement')
  const set = (k: keyof ProblemAnswers, v: string) => { setA((s) => ({ ...s, [k]: v })); setMissing(false) }
  const aspectText = a.aspect === 'autre' ? other.trim() || 'autre aspect' : label(ASPECT, a.aspect).toLowerCase()
  const summary = `${aspectText}, feuilles : ${label(LEAVES, a.feuilles).toLowerCase()}, ${label(WHERE, a.ou).toLowerCase()}, depuis : ${label(SINCE, a.depuis).toLowerCase()}`

  function next() {
    if (step === 2 && (!a.feuilles || !a.ou || !a.depuis || !a.aspect)) return setMissing(true)
    if (step === 3 && waterGap !== null && waterGap >= 3 && !a.arrosage) return setMissing(true)
    setStep((s) => (s + 1) as 1 | 2 | 3 | 4)
  }

  function confirm() {
    const problemId = ops.openProblem(summary, TODAY)
    ops.record({
      kind: 'observe',
      date: TODAY,
      title: 'Problème sur les feuilles',
      details: [
        summary.charAt(0).toUpperCase() + summary.slice(1),
        ...(a.arrosage === 'oui' ? ['Arrosages continués depuis le dernier noté (déclaré, dates non précisées)'] : []),
        ...(a.arrosage === 'non' ? ['Moins d’arrosage ces derniers jours (déclaré)'] : []),
      ],
      problemId,
      photo,
    })
    if (followUp) ops.setFollowUp(problemId, followUp)
    navigate(`/suivi/action?probleme=${problemId}&apres=observation`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader eyebrow={`Situation B · étape ${step} sur 4`} title="J'observe un problème sur les feuilles" />
      {step === 1 && (
        <>
          <h2 ref={heading} tabIndex={-1} className="text-lg font-semibold focus:outline-none">Une photo, si vous pouvez</h2>
          <Panel>
            {photo ? (
              <figure className="space-y-2">
                <ExampleImage />
                <figcaption className="text-sm text-muted">
                  Image d'exemple (dessin). Dans le produit, votre photo serait jointe au cas. <strong>Aucune analyse automatique</strong> n'est faite ici.
                </figcaption>
              </figure>
            ) : (
              <p>La photo documente le cas et aide la personne qui le relira. Prenez la feuille atteinte de près, et une vue de la plante entière.</p>
            )}
          </Panel>
          <ConfirmBar onCancel={() => navigate('/suivi')}>
            {!photo && <Button variant="secondary" onClick={() => setPhoto(true)}>Utiliser l'image d'exemple</Button>}
            <Button onClick={next}>{photo ? 'Continuer' : 'Continuer sans photo'}</Button>
          </ConfirmBar>
        </>
      )}
      {step === 2 && (
        <>
          <h2 ref={heading} tabIndex={-1} className="text-lg font-semibold focus:outline-none">Ce que vous voyez</h2>
          <p className="text-sm text-muted">Quatre questions. « Je ne sais pas » est une réponse.</p>
          <Panel className="space-y-5">
            <Choice legend="À quoi cela ressemble-t-il ?" name="aspect" value={a.aspect} onChange={(v) => set('aspect', v)} options={ASPECT} />
            {a.aspect === 'autre' && (
              <Field label="Décrivez en quelques mots">
                {(p) => <input {...p} className={input} value={other} onChange={(e) => setOther(e.target.value)} />}
              </Field>
            )}
            <Choice legend="Quelles feuilles ?" name="feuilles" value={a.feuilles} onChange={(v) => set('feuilles', v)} options={LEAVES} />
            <Choice legend="Où dans la parcelle ?" name="ou" value={a.ou} onChange={(v) => set('ou', v)} options={WHERE} />
            <Choice legend="Depuis quand ?" name="depuis" value={a.depuis} onChange={(v) => set('depuis', v)} options={SINCE} />
          </Panel>
          {missing && <p role="alert" className="text-sm font-medium text-danger-700">Répondez aux quatre questions, au besoin par « Je ne sais pas ».</p>}
          <ConfirmBar onCancel={() => setStep(1)}>
            <Button onClick={next}>Continuer</Button>
          </ConfirmBar>
        </>
      )}
      {step === 3 && (
        <>
          <h2 ref={heading} tabIndex={-1} className="text-lg font-semibold focus:outline-none">Ce que votre journal dit déjà</h2>
          <Panel>
            <ul className="space-y-1.5 text-sm">
              <li><KindChip kind="realise" /> Repiquage le {formatDay(state.transplant)}</li>
              {weeding && <li><KindChip kind="realise" /> Désherbage le {formatDay(weeding.date)}</li>}
              <li>{treatments.length ? <><KindChip kind="realise" /> Traitement le {formatDay(treatments[treatments.length - 1]!.date)}</> : 'Aucun traitement noté'}</li>
              <li>{water ? <><KindChip kind="realise" /> Dernier arrosage noté le {formatDay(water.date)}</> : 'Aucun arrosage noté'}</li>
            </ul>
            <p className="mt-2 text-sm text-muted">Inutile de les redire : seules les informations qui manquent sont demandées.</p>
          </Panel>
          {waterGap !== null && waterGap >= 3 ? (
            <Panel>
              <Choice
                legend={`Avez-vous arrosé depuis le ${formatDay(water!.date)} ?`}
                help="Le dernier arrosage noté date de plusieurs jours ; cela ne veut pas dire qu'il n'y en a pas eu."
                name="arrosage"
                value={a.arrosage}
                onChange={(v) => set('arrosage', v)}
                options={[
                  { value: 'oui', label: 'Oui, comme d’habitude' },
                  { value: 'non', label: 'Non, ou moins que d’habitude' },
                  { value: UNKNOWN, label: 'Je ne sais pas' },
                ]}
              />
            </Panel>
          ) : null}
          {missing && <p role="alert" className="text-sm font-medium text-danger-700">Répondez, au besoin par « Je ne sais pas ».</p>}
          <ConfirmBar onCancel={() => setStep(2)}>
            <Button onClick={next}>Voir ce que l'assistant en dit</Button>
          </ConfirmBar>
        </>
      )}
      {step === 4 && (
        <>
          <h2 ref={heading} tabIndex={-1} className="text-lg font-semibold focus:outline-none">Ce qu'il est utile de faire</h2>
          <Scripted sources={['Vos réponses', 'Votre journal', 'Règle de la démonstration']}>
            <div>
              <p className="font-semibold">Ce que vous avez observé</p>
              <p>{summary.charAt(0).toUpperCase() + summary.slice(1)}{photo ? ', photo jointe' : ''}.</p>
              {a.arrosage === 'non' && <p>Vous indiquez avoir moins arrosé ces derniers jours : c'est noté avec l'observation.</p>}
            </div>
            <div>
              <p className="font-semibold">Ce que je ne peux pas dire</p>
              <p>
                La cause. Aucune fiche relue ne décrit les problèmes de cette culture dans la démonstration : je ne propose ni cause, ni
                traitement. Avec une fiche relue, je comparerais vos réponses aux causes qu'elle décrit et je poserais les questions qui
                les distinguent, en disant si une conclusion est possible.
              </p>
            </div>
            <div>
              <p className="font-semibold">Ce qui est utile maintenant</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Enregistrer cette observation, pour pouvoir la comparer plus tard.</li>
                <li>Revoir les mêmes plants à une date que vous choisissez, et décrire les mêmes éléments.</li>
                <li>Si cela s'étend vite ou touche toute la parcelle, montrer le cas à une personne compétente : vos réponses et la photo seraient transmises sans ressaisie.</li>
              </ol>
            </div>
          </Scripted>
          <Panel>
            <Field label="Revoir les mêmes plants le" help="Date choisie par vous ; vous pourrez la changer.">
              {(p) => <input {...p} type="date" className={`${input} sm:max-w-xs`} value={followUp} onChange={(e) => setFollowUp(e.target.value)} />}
            </Field>
          </Panel>
          <Note tone="neutral">Rien n'est encore dans votre journal : l'observation y entre quand vous confirmez.</Note>
          <ConfirmBar onCancel={() => setStep(3)}>
            <Button onClick={confirm}>Confirmer et enregistrer l'observation</Button>
          </ConfirmBar>
        </>
      )}
    </div>
  )
}

/** Dessin d'exemple : il n'est pas une photo, et rien n'en est déduit. */
function ExampleImage() {
  return (
    <svg role="img" aria-label="Dessin d'exemple : feuilles avec des taches, sans valeur de diagnostic" viewBox="0 0 320 160" className="h-40 w-full rounded-lg bg-canvas">
      <path d="M40 150 C 70 60, 110 30, 150 10" stroke="#3f7d3a" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M120 150 C 150 70, 200 40, 260 20" stroke="#4d8f45" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M200 150 C 210 100, 250 80, 300 70" stroke="#5b9c52" strokeWidth="10" fill="none" strokeLinecap="round" />
      {[[90, 70], [105, 52], [175, 75], [220, 48], [245, 86]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#a7814f" />)}
      <text x="160" y="150" textAnchor="middle" fontSize="12" fill="#5c6660">Image d'exemple — aucune analyse</text>
    </svg>
  )
}

// ---- C. Action réalisée et suivi de son résultat ----------------------------------------------

const OPS: Op[] = ['arrosage', 'desherbage', 'apport', 'traitement', 'retrait', 'autre']

export function ActionPage() {
  const { state, ops } = useDemo()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const problemId = params.get('probleme')
  const afterObservation = params.get('apres') === 'observation'
  const problem = state.problems.find((p) => p.id === problemId && p.status === 'ouvert')
  const initialOp = OPS.includes(params.get('op') as Op) ? (params.get('op') as Op) : ''
  const [op, setOp] = useState<Op | ''>(initialOp)
  const [date, setDate] = useState(TODAY)
  const [what, setWhat] = useState('')
  const [linked, setLinked] = useState<'oui' | 'non' | ''>(problem ? 'oui' : '')
  const [step, setStep] = useState<'saisie' | 'verifier' | 'fait'>('saisie')
  const [error, setError] = useState<string | null>(null)
  const heading = useStepFocus(step)
  const apportLine = plan(state).find((l) => l.key === 'apport')

  function review() {
    if (!op) return setError('Choisissez l’action réalisée.')
    if (!date || daysBetween(date, TODAY) < 0) return setError('La date ne peut pas être dans le futur : on ne déclare que ce qui est fait.')
    setError(null)
    setStep('verifier')
  }
  function confirm() {
    ops.record({
      kind: 'realise',
      date,
      op: op as Op,
      title: OP_LABEL[op as Op],
      details: what.trim() ? [`Tel que déclaré : ${what.trim()}`] : [],
      problemId: linked === 'oui' && problem ? problem.id : undefined,
    })
    setStep('fait')
  }

  if (step === 'fait') {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <PageHeader eyebrow="Situation C" title="Action enregistrée" />
        <h2 ref={heading} tabIndex={-1} className="sr-only">Suivre le résultat</h2>
        <Panel>
          <p><KindChip kind="realise" /> {OP_LABEL[op as Op]} le {formatDay(date)} — dans votre journal.</p>
        </Panel>
        {linked === 'oui' && problem ? (
          <Scripted sources={['Votre journal', 'Règle de la démonstration']}>
            <p className="font-semibold">Comment suivre son résultat</p>
            <p>
              Pour savoir comment le problème évolue, revoyez les mêmes plants{problem.followUpOn ? ` le ${formatDay(problem.followUpOn)}` : ''} et
              décrivez les mêmes éléments qu'au départ ({problem.summary}). Une amélioration après une action ne prouve pas que l'action en
              est la cause ; elle sera notée comme une évolution observée.
            </p>
            <ButtonLink to={`/suivi/revoir/${problem.id}`}>Faire l'observation de suivi</ButtonLink>
            <p className="text-sm text-muted">Dans la démonstration, vous pouvez la faire tout de suite.</p>
          </Scripted>
        ) : (
          <Note tone="neutral">Cette action n'est rattachée à aucun problème ouvert : elle compte dans le plan et le bilan.</Note>
        )}
        <p className="flex flex-wrap gap-4">
          <TextLink to="/suivi">Revenir à la campagne</TextLink>
          <TextLink to="/suivi/journal">Voir le journal</TextLink>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader eyebrow="Situation C" title={afterObservation ? 'Observation enregistrée. Avez-vous fait quelque chose ?' : 'J’ai réalisé une action'}>
        {afterObservation ? 'Si vous n’avez encore rien fait, vous pouvez revenir à la campagne : le suivi est prévu.' : 'On ne note que ce qui est fait, tel que vous le décrivez.'}
      </PageHeader>
      {step === 'saisie' && (
        <>
          <h2 ref={heading} tabIndex={-1} className="sr-only">Saisie de l'action</h2>
          <Panel className="space-y-5">
            <Choice legend="Action réalisée" name="op" value={op} onChange={(v) => { setOp(v); setError(null) }} options={OPS.map((o) => ({ value: o, label: OP_LABEL[o] }))} />
            {op === 'apport' && apportLine && (
              <p className="text-sm text-muted">
                La fiche d'exemple place l'apport du {formatDay(apportLine.from)} au {formatDay(apportLine.to)} ; une date en dehors est notée telle quelle, avec l'écart.
              </p>
            )}
            <Field label="Date" help="Aujourd'hui, ou plus tôt si vous la notez après coup.">
              {(p) => <input {...p} type="date" className={`${input} sm:max-w-xs`} value={date} max={TODAY} onChange={(e) => setDate(e.target.value)} />}
            </Field>
            <Field label="Ce que vous avez fait ou utilisé (facultatif)" help="Tel que vous le décrivez : nom écrit sur l'emballage, quantité utilisée… AGRIA ne le juge pas ici.">
              {(p) => <input {...p} className={input} value={what} onChange={(e) => setWhat(e.target.value)} />}
            </Field>
            {problem && (
              <Choice
                legend={`Est-ce lié au problème observé le ${formatDay(problem.openedOn)} ?`}
                name="lie"
                value={linked}
                onChange={(v) => setLinked(v)}
                options={[{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]}
              />
            )}
          </Panel>
          {error && <p role="alert" className="text-sm font-medium text-danger-700">{error}</p>}
          <ConfirmBar onCancel={() => navigate('/suivi')}>
            <Button onClick={review}>Vérifier avant d'enregistrer</Button>
          </ConfirmBar>
        </>
      )}
      {step === 'verifier' && (
        <>
          <h2 ref={heading} tabIndex={-1} className="text-lg font-semibold focus:outline-none">Ce qui sera noté dans votre journal</h2>
          <Panel>
            <p><KindChip kind="realise" /> {OP_LABEL[op as Op]} le {formatDay(date)}</p>
            {what.trim() && <p className="mt-1 text-sm">Tel que déclaré : {what.trim()}</p>}
            {linked === 'oui' && problem && <p className="mt-1 text-sm">Lié au problème observé le {formatDay(problem.openedOn)}</p>}
            {op === 'apport' && apportLine && (daysBetween(date, apportLine.from) > 0 || daysBetween(apportLine.to, date) > 0) && (
              <p className="mt-1 text-sm">Hors de la fenêtre de la fiche d'exemple : noté tel quel, l'écart apparaîtra au bilan.</p>
            )}
          </Panel>
          <ConfirmBar onCancel={() => setStep('saisie')}>
            <Button onClick={confirm}>Confirmer : je l'ai fait</Button>
          </ConfirmBar>
        </>
      )}
    </div>
  )
}

const EVOLUTION = [
  { value: 'etend', label: 'Cela s’étend' },
  { value: 'stable', label: 'C’est stable' },
  { value: 'regresse', label: 'Cela régresse' },
  { value: UNKNOWN, label: 'Je ne sais pas' },
]

export function FollowUpPage() {
  const { problemId } = useParams()
  const { state, ops } = useDemo()
  const navigate = useNavigate()
  const problem = state.problems.find((p) => p.id === problemId)
  const [evolution, setEvolution] = useState('')
  const [close, setClose] = useState<'oui' | 'non' | ''>('')
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const heading = useStepFocus(done)
  if (!problem) {
    return (
      <div className="space-y-3">
        <p>Ce cas n'existe pas dans la démonstration.</p>
        <TextLink to="/suivi">Revenir à la campagne</TextLink>
      </div>
    )
  }
  const actions = state.entries.filter((e) => e.problemId === problem.id && e.kind === 'realise')

  function save() {
    if (!evolution) return setError(true)
    ops.record({ kind: 'observe', date: TODAY, title: 'Observation de suivi', details: [`Évolution : ${label(EVOLUTION, evolution).toLowerCase()}`], problemId: problem!.id })
    if (close === 'oui') ops.closeProblem(problem!.id, `évolution déclarée « ${label(EVOLUTION, evolution).toLowerCase()} », clos par vous`)
    setDone(true)
  }

  if (done) {
    const stillOpen = close !== 'oui'
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <PageHeader eyebrow="Suivi" title="Observation de suivi enregistrée" />
        <h2 ref={heading} tabIndex={-1} className="sr-only">Suite</h2>
        <Scripted sources={['Votre journal', 'Règle de la démonstration']}>
          {evolution === 'etend' ? (
            <p>Le problème s'étend. Il est utile de montrer le cas à une personne compétente : vos observations, la photo et les actions notées seraient transmises ensemble.</p>
          ) : evolution === 'regresse' ? (
            <p>Vous observez une régression. Elle est notée comme une évolution, sans conclure qu'elle vient de l'action.</p>
          ) : (
            <p>C'est noté. Une nouvelle observation dans quelques jours permettra de comparer.</p>
          )}
          <p>{stillOpen ? 'Le cas reste ouvert : il apparaît dans « À vérifier maintenant ».' : 'Le cas est clos ; il reste dans le journal et le bilan.'}</p>
        </Scripted>
        <p className="flex flex-wrap gap-4">
          <TextLink to="/suivi/bilan">Voir l'aperçu du bilan</TextLink>
          <TextLink to="/suivi">Revenir à la campagne</TextLink>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader eyebrow="Suivi" title={`Revoir le problème du ${formatDay(problem.openedOn)}`}>
        Décrire les mêmes éléments qu'au départ permet de comparer.
      </PageHeader>
      <Panel>
        <SectionTitle>Au départ</SectionTitle>
        <p>{problem.summary}</p>
        <p className="mt-1 text-sm">
          Actions notées depuis : {actions.length ? actions.map((x) => `${OP_LABEL[x.op ?? 'autre'].toLowerCase()} le ${formatDay(x.date)}`).join(', ') : 'aucune'}
          .
        </p>
      </Panel>
      <Panel className="space-y-5">
        <Choice legend="Par rapport au départ" name="evolution" value={evolution} onChange={(v) => { setEvolution(v); setError(false) }} options={EVOLUTION} />
        <Choice
          legend="Clore ce cas ?"
          help="Clore ne dit pas que le problème est réglé ; seulement que vous arrêtez de le suivre."
          name="clore"
          value={close}
          onChange={(v) => setClose(v)}
          options={[{ value: 'non', label: 'Non, continuer à suivre' }, { value: 'oui', label: 'Oui, clore' }]}
        />
      </Panel>
      {error && <p role="alert" className="text-sm font-medium text-danger-700">Indiquez l'évolution, au besoin « Je ne sais pas ».</p>}
      <ConfirmBar onCancel={() => navigate('/suivi')}>
        <Button onClick={save}>Enregistrer l'observation de suivi</Button>
      </ConfirmBar>
    </div>
  )
}
