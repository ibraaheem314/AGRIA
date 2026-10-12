import { useState } from 'react'
import { useParams } from 'react-router'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { factLabel, subjectOf } from '../data/facts'
import { formatDay, OUTCOME_LABEL, PEOPLE, type Action, type ActionStatus, type Outcome } from '../data/model'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, ButtonLink, Chip, Choice, Field, input, Note, PageHeader, Panel, SectionTitle, TextLink, type Tone } from '../ui'

const STATUS: Record<ActionStatus, { label: string; tone: Tone }> = {
  a_faire: { label: 'À faire', tone: 'neutral' },
  en_cours: { label: 'En cours', tone: 'info' },
  bloquee: { label: 'Bloquée', tone: 'danger' },
  terminee: { label: 'Terminée', tone: 'ok' },
}
const OUTCOMES: { value: Outcome; label: string; help: string }[] = [
  { value: 'favorable', label: 'Favorable', help: 'La démarche confirme une situation qui convient.' },
  { value: 'defavorable', label: 'Défavorable', help: 'Elle révèle une difficulté (pas d’accord, pas d’eau, pas d’acheteur…).' },
  { value: 'incertain', label: 'Incertain', help: 'La réponse reste partielle ou doit encore être confirmée.' },
]

export function ActionsPage() {
  const { dossier: d, canEdit, base, viewer } = useDossierCtx()
  const { ops } = useStore()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const { allowNextNavigation } = useUnsavedChanges(adding && title.trim() !== '')
  const archived = Boolean(d.archivedAt)
  // Campagne archivée : formulations historiques, états enregistrés conservés (rien n'est clôturé après coup).
  const groups: [ActionStatus[], string][] = archived
    ? [[['en_cours', 'a_faire', 'bloquee'], 'Restait à faire à l’archivage'], [['terminee'], 'Démarches terminées pendant cette campagne']]
    : [[['en_cours'], 'En cours'], [['a_faire'], 'À faire'], [['bloquee'], 'Bloquées'], [['terminee'], 'Terminées']]
  return (
    <div className="space-y-6">
      <PageHeader title="Démarches" actions={canEdit && !adding ? <Button variant="secondary" onClick={() => setAdding(true)}>Ajouter une démarche personnelle</Button> : undefined}>
        {archived
          ? 'Historique de cette campagne : les démarches telles qu’elles étaient à l’archivage.'
          : 'Proposées à partir du dossier quand une information est inconnue ou à confirmer. Contenu générique, non relu par un spécialiste.'}
      </PageHeader>
      {adding && (
        <Panel>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (title.trim().length < 3) return; ops.addAction(d.id, title.trim(), '', viewer); allowNextNavigation(); setTitle(''); setAdding(false) }}>
            <Field label="Intitulé de la démarche" required>{(p) => <input {...p} className={input} value={title} onChange={(e) => setTitle(e.target.value)} />}</Field>
            <div className="flex gap-2"><Button type="submit">Ajouter</Button><Button variant="quiet" onClick={() => { setTitle(''); setAdding(false) }}>Annuler</Button></div>
          </form>
        </Panel>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map(([statuses, label]) => {
          const items = d.actions.filter((a) => statuses.includes(a.status))
          if (items.length === 0) return null
          const key = statuses.join('-')
          return (
            <section key={key} aria-labelledby={`g-${key}`} className={statuses.includes('terminee') || archived ? 'md:col-span-2' : ''}>
              <SectionTitle id={`g-${key}`}>{label} ({items.length})</SectionTitle>
              <ul className="divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
                {items.map((a) => <ActionRow key={a.id} a={a} base={base} />)}
              </ul>
            </section>
          )
        })}
      </div>
      {d.actions.length === 0 && <p className="text-muted">Aucune démarche pour l'instant.</p>}
    </div>
  )
}

function ActionRow({ a, base }: { a: Action; base: string }) {
  return (
    <li className="px-4 py-3">
      <TextLink to={`${base}/demarches/${a.id}`}>{a.title}</TextLink>
      <p className="text-sm text-muted">
        {a.factKey ? subjectOf(a.factKey).title : 'Démarche personnelle'}
        {a.status !== 'terminee' && ` · ${STATUS[a.status].label.toLowerCase()}`}
        {a.result && ` · résultat ${OUTCOME_LABEL[a.result.outcome].toLowerCase()}`}
        {a.status === 'bloquee' && a.blockedReason && ` · ${a.blockedReason}`}
      </p>
    </li>
  )
}

export function ActionPage() {
  const { actionId } = useParams()
  const { dossier: d, checks, canEdit, base, viewer, role } = useDossierCtx()
  const { ops } = useStore()
  const [mode, setMode] = useState<'idle' | 'resultat' | 'blocage'>('idle')
  const a = d.actions.find((x) => x.id === actionId)
  if (!a) return <p>Démarche introuvable. <TextLink to={`${base}/demarches`}>Retour</TextLink></p>
  const check = a.key ? checks.find((c) => c.actionKey === a.key) : undefined
  return (
    <div className="space-y-6">
      <p><TextLink to={`${base}/demarches`}>← Démarches</TextLink></p>
      <PageHeader eyebrow={a.factKey ? subjectOf(a.factKey).title : 'Démarche personnelle'} title={a.title}>
        <span className="flex flex-wrap items-center gap-2">
          <Chip tone={STATUS[a.status].tone}>{d.archivedAt && a.status !== 'terminee' ? `${STATUS[a.status].label} à l’archivage` : STATUS[a.status].label}</Chip>
          {a.goal && <span>{a.goal}</span>}
        </span>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          {a.status === 'terminee' && a.result && <ResultPanels a={a} stillOpen={check?.message} />}
          {a.status === 'bloquee' && <Note tone="warn">Bloquée : {a.blockedReason}</Note>}
          {a.status !== 'terminee' && (
            <Panel>
              {a.explanation && (<><SectionTitle>Pourquoi</SectionTitle><p>{a.explanation}</p></>)}
              {a.steps.length > 0 && (
                <>
                  <h2 className="mt-4 text-lg font-semibold">Étapes proposées</h2>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5">{a.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                  <p className="mt-3 text-sm text-muted">Étapes génériques de préparation, non relues par un spécialiste : elles ne remplacent pas un avis local.</p>
                </>
              )}
              {check && <p className="mt-3 text-sm">Point concerné : {check.message}.</p>}
            </Panel>
          )}
          {canEdit && mode === 'idle' && (
            <div className="flex flex-wrap gap-2">
              {a.status === 'a_faire' && <Button onClick={() => ops.updateAction(d.id, a.id, { status: 'en_cours' }, 'Commencée', viewer)}>Commencer</Button>}
              {a.status === 'bloquee' && <Button onClick={() => ops.updateAction(d.id, a.id, { status: 'en_cours', blockedReason: undefined }, 'Reprise', viewer)}>Reprendre</Button>}
              {a.status !== 'terminee' && <Button variant={a.status === 'en_cours' ? 'primary' : 'secondary'} onClick={() => setMode('resultat')}>Noter le résultat</Button>}
              {a.status !== 'terminee' && a.status !== 'bloquee' && <Button variant="quiet" onClick={() => setMode('blocage')}>Signaler un blocage</Button>}
              {a.status === 'terminee' && <Button variant="quiet" onClick={() => ops.updateAction(d.id, a.id, { status: 'en_cours', result: undefined }, 'Rouverte (le résultat précédent reste dans l’historique)', viewer)}>Rouvrir</Button>}
            </div>
          )}
          {mode === 'resultat' && <ResultForm a={a} onDone={() => setMode('idle')} />}
          {mode === 'blocage' && <BlockForm a={a} onDone={() => setMode('idle')} />}
          {role === 'conseiller' && !d.archivedAt && (
            <TextLink to={`${base}/echanges?cible=demarche:${a.id}#nouveau`}>Poser une question au porteur sur cette démarche</TextLink>
          )}
        </div>
        <aside aria-label="Historique de la démarche">
          <Panel>
            <details>
              <summary className="cursor-pointer font-semibold">Historique ({a.events.length})</summary>
              <ol className="mt-2 space-y-2 text-sm">
                {a.events.slice().reverse().map((e, i) => (
                  <li key={i} className="border-l-2 border-line pl-2"><p>{e.text}</p><p className="text-muted">{formatDay(e.at)} · {PEOPLE[e.by].name}</p></li>
                ))}
              </ol>
            </details>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

/** Résultat noté, puis ce qu'il change : rien d'automatique, une mise à jour explicite proposée. */
function ResultPanels({ a, stillOpen }: { a: Action; stillOpen?: string }) {
  const { dossier: d, canEdit, base } = useDossierCtx()
  const r = a.result!
  const fact = a.factKey
  const hint: Record<Outcome, string> = {
    favorable: 'Indiquez la situation confirmée. « Confirmé » demande en plus de dire ce qui le confirme.',
    defavorable: 'Un résultat défavorable n’arrête pas forcément le projet : décrivez la situation réelle, cherchez une autre solution, posez la question, ou notez une décision.',
    incertain: 'Indiquez ce que vous savez maintenant, même partiel : le point peut rester ouvert, et vous pouvez en parler avec votre conseiller.',
  }
  return (
    <>
      <Panel label="Résultat">
        <SectionTitle aside={<Chip tone={r.outcome === 'favorable' ? 'ok' : 'warn'}>Résultat {OUTCOME_LABEL[r.outcome].toLowerCase()}</Chip>}>Résultat du {formatDay(r.date)}</SectionTitle>
        <p className="whitespace-pre-line">{r.text}</p>
      </Panel>
      {fact && stillOpen ? (
        <section aria-label="Et maintenant" className="rounded-xl bg-surface p-5 ring-2 ring-brand-700/40">
          <h2 className="text-lg font-semibold">{canEdit ? 'Et maintenant : mettre le dossier à jour' : 'Information liée : point encore ouvert'}</h2>
          <p className="mt-1">
            Le résultat est noté, mais le point « {stillOpen} » reste ouvert tant que l'information « {factLabel(fact, d.profile)} » n'est pas
            mise à jour. Rien ne change automatiquement.
          </p>
          {canEdit && <p className="mt-1 text-sm text-muted">{hint[r.outcome]}</p>}
          {canEdit && (
            <div className="mt-3 flex flex-wrap gap-2">
              <ButtonLink to={`${base}/info/${fact}?depuis=${a.id}`}>Mettre à jour : {factLabel(fact, d.profile)}</ButtonLink>
              {r.outcome !== 'favorable' && <ButtonLink to={`${base}/echanges?cible=demarche:${a.id}#nouveau`} variant="secondary">En parler au conseiller</ButtonLink>}
              {r.outcome === 'defavorable' && <ButtonLink to={`${base}/echanges#decision`} variant="quiet">Revoir le projet (décision)</ButtonLink>}
            </div>
          )}
        </section>
      ) : (
        <Panel>
          <h2 className="font-semibold">{fact ? 'Le point lié n’est plus signalé' : 'Démarche personnelle'}</h2>
          <p className="mt-1 text-sm">{fact ? `L'information « ${factLabel(fact, d.profile)} » a été mise à jour depuis.` : 'Elle n’est liée à aucune information : si son résultat en change une, mettez-la à jour dans le sujet concerné.'}</p>
          {fact && <TextLink to={`${base}/info/${fact}`} className="mt-2 inline-block">Voir l'information</TextLink>}
        </Panel>
      )}
    </>
  )
}

function ResultForm({ a, onDone }: { a: Action; onDone: () => void }) {
  const { dossier: d, viewer } = useDossierCtx()
  const { ops } = useStore()
  const [text, setText] = useState('')
  const [outcome, setOutcome] = useState<Outcome | ''>('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState<string | null>(null)
  const { allowNextNavigation } = useUnsavedChanges(text.trim() !== '' || outcome !== '')
  return (
    <Panel>
      <form className="space-y-4" noValidate onSubmit={(e) => {
        e.preventDefault()
        if (!text.trim()) return setError('Décrivez le résultat réel, même négatif.')
        if (!outcome) return setError('Indiquez si le résultat est favorable, défavorable ou incertain.')
        ops.updateAction(d.id, a.id, { status: 'terminee', result: { text: text.trim(), outcome, date } }, `Terminée — résultat ${OUTCOME_LABEL[outcome].toLowerCase()}`, viewer)
        allowNextNavigation()
        onDone()
      }}>
        <h2 className="text-lg font-semibold">Noter le résultat</h2>
        <Field label="Qu'avez-vous fait, appris ou obtenu ?" help="Y compris si c'est négatif ou partiel." required>
          {(p) => <textarea {...p} rows={3} className={input} value={text} onChange={(e) => setText(e.target.value)} />}
        </Field>
        <Choice<Outcome> legend="Ce résultat est-il…" name="outcome" value={outcome} onChange={setOutcome} options={OUTCOMES} />
        <Field label="Date">{(p) => <input {...p} type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
        {error && <p role="alert" className="font-medium text-danger-700">{error}</p>}
        <div className="flex gap-2"><Button type="submit">Enregistrer le résultat</Button><Button variant="quiet" onClick={onDone}>Annuler</Button></div>
      </form>
    </Panel>
  )
}

function BlockForm({ a, onDone }: { a: Action; onDone: () => void }) {
  const { dossier: d, viewer } = useDossierCtx()
  const { ops } = useStore()
  const [reason, setReason] = useState('')
  const { allowNextNavigation } = useUnsavedChanges(reason.trim() !== '')
  return (
    <Panel>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!reason.trim()) return; ops.updateAction(d.id, a.id, { status: 'bloquee', blockedReason: reason.trim() }, `Bloquée : ${reason.trim()}`, viewer); allowNextNavigation(); onDone() }}>
        <Field label="Qu'est-ce qui bloque ?" required>{(p) => <textarea {...p} rows={2} className={input} value={reason} onChange={(e) => setReason(e.target.value)} />}</Field>
        <div className="flex gap-2"><Button type="submit">Enregistrer</Button><Button variant="quiet" onClick={onDone}>Annuler</Button></div>
      </form>
    </Panel>
  )
}
