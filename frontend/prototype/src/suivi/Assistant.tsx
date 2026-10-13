import { useState, type FormEvent, type ReactNode } from 'react'
import { Button, ButtonLink, Field, input, Note, PageHeader } from '../ui'
import { Scripted } from './SuiviApp'
import { daysBetween, estimatedStage, formatDay, lastObservation, lastOp, STAGE_LABEL, TODAY, useDemo, type DemoState } from './data'

/*
 * Assistant scénarisé : aucune IA. La question libre est rapprochée par mots-clés de l'une des
 * trois situations de la démonstration ; tout le reste reçoit une réponse « hors scénario ».
 * Les demandes de dose, de volume ou de produit sont refusées explicitement.
 */

type Intent = 'situation' | 'probleme' | 'action' | 'quantite' | 'hors'

const RULES: { intent: Intent; words: RegExp }[] = [
  { intent: 'quantite', words: /\b(dose|doses|combien|quantit|litres?|kg|grammes?|engrais|produit|pesticide|insecticide|fongicide|traiter avec)/i },
  { intent: 'action', words: /(j'ai |j’ai |je viens de |fait |réalis|traité|arrosé|désherb|apport)/i },
  { intent: 'probleme', words: /(feuille|tache|jaun|sèche|seche|malad|insecte|probl|photo|abîm|abim)/i },
  { intent: 'situation', words: /(où en|ou en|stade|vérifier|verifier|maintenant|que faire|quoi faire|prochaine)/i },
]

export function classify(text: string): Intent {
  return RULES.find((r) => r.words.test(text))?.intent ?? 'hors'
}

const EXAMPLES = ['Où en est ma culture ?', 'J’ai des taches sur les feuilles', 'J’ai arrosé ce matin', 'Combien d’engrais dois-je mettre ?']

export function AssistantPage() {
  const { state } = useDemo()
  const [text, setText] = useState('')
  const [asked, setAsked] = useState<{ q: string; intent: Intent } | null>(null)

  function ask(q: string) {
    const clean = q.trim()
    if (!clean) return
    setAsked({ q: clean, intent: classify(clean) })
  }
  function submit(e: FormEvent) {
    e.preventDefault()
    ask(text)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader eyebrow="Assistant" title="Demander">
        Cette démonstration répond à trois situations : où en est la culture, un problème sur les feuilles, une action réalisée. Les
        réponses sont écrites à l'avance ; aucune IA n'est appelée.
      </PageHeader>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Votre question">
          {(p) => <input {...p} className={input} value={text} onChange={(e) => setText(e.target.value)} maxLength={300} />}
        </Field>
        <Button type="submit">Demander</Button>
      </form>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted">Exemples :</span>
        {EXAMPLES.map((q) => (
          <button key={q} type="button" className="min-h-11 rounded-full px-3 text-sm font-medium text-brand-800 ring-1 ring-inset ring-line" onClick={() => { setText(q); ask(q) }}>
            {q}
          </button>
        ))}
      </div>
      {asked && (
        <div className="space-y-2" aria-live="polite">
          <p className="rounded-lg bg-canvas px-3 py-2"><span className="text-sm text-muted">Vous : </span>{asked.q}</p>
          <Answer intent={asked.intent} state={state} />
        </div>
      )}
    </div>
  )
}

function Answer({ intent, state }: { intent: Intent; state: DemoState }) {
  const est = estimatedStage(state)
  const obs = lastObservation(state)
  const water = lastOp(state, 'arrosage')
  const open = state.problems.filter((p) => p.status === 'ouvert')
  const answers: Record<Intent, { body: ReactNode; sources: string[] }> = {
    situation: {
      sources: ['Votre journal', 'Fiche d’exemple non relue'],
      body: (
        <>
          <p>
            D'après votre journal, le repiquage date du {formatDay(state.transplant)} ({est.weeks} semaines). La fiche d'exemple situe la culture à
            « {STAGE_LABEL[est.stage]} » ; votre dernière observation{obs ? ` (le ${formatDay(obs.date)})` : ''} indique
            {obs?.stage ? ` « ${STAGE_LABEL[obs.stage]} »` : ' un état sans stade précisé'}.
          </p>
          {water && daysBetween(water.date, TODAY) >= 3 && <p>Aucun arrosage n'est noté depuis le {formatDay(water.date)} : cela ne veut pas dire qu'il n'a pas eu lieu.</p>}
          {open.length > 0 && <p>{open.length === 1 ? 'Un problème est' : `${open.length} problèmes sont`} en cours de suivi.</p>}
          <ButtonLink to="/suivi" variant="secondary">Voir ce qu'il faut vérifier maintenant</ButtonLink>
        </>
      ),
    },
    probleme: {
      sources: ['Règle de la démonstration'],
      body: (
        <>
          <p>Je vais vous demander ce que vous voyez (aspect, quelles feuilles, où, depuis quand), et éventuellement une photo. Je ne donnerai pas de cause : aucune fiche relue ne la fonde dans cette démonstration.</p>
          <ButtonLink to="/suivi/observer?probleme=1">Décrire le problème</ButtonLink>
        </>
      ),
    },
    action: {
      sources: ['Règle de la démonstration'],
      body: (
        <>
          <p>Je ne note rien à partir de cette phrase : une action entre dans votre journal quand vous la confirmez, avec sa date.</p>
          <ButtonLink to="/suivi/action">Déclarer l'action</ButtonLink>
        </>
      ),
    },
    quantite: {
      sources: ['Règle de la démonstration'],
      body: (
        <>
          <p>
            Je ne donne ni dose, ni volume, ni produit. Dans le produit, ces chiffres viendraient seulement d'une référence relue pour la
            culture et la zone, et je dirais d'où ils viennent ; sans cette référence, je le dirais et je proposerais de transmettre la
            question à une personne compétente.
          </p>
          <p>Vous pouvez en revanche noter ce que vous avez réellement apporté ou arrosé.</p>
          <ButtonLink to="/suivi/action" variant="secondary">Noter une action réalisée</ButtonLink>
        </>
      ),
    },
    hors: {
      sources: ['Règle de la démonstration'],
      body: (
        <>
          <p>Cette question sort des trois situations de la démonstration. Dans le produit, une question hors du périmètre relu reçoit une réponse claire : « je n'ai pas de référence pour cela », avec la possibilité de la transmettre.</p>
          <Note tone="neutral">Situations prises en charge : où en est la culture · un problème sur les feuilles · une action réalisée.</Note>
        </>
      ),
    },
  }
  const a = answers[intent]
  return <Scripted sources={a.sources}>{a.body}</Scripted>
}
