import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useScrollToHash } from '../../../src/shared/hash'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { factLabel } from '../data/facts'
import {
  DECISION_LABEL, formatDay, PEOPLE, pendingRequest, QUESTION_STATE_LABEL, questionState, SECTION_LABEL, staleSections, VERDICT_LABEL,
  type Decision, type Message, type Target,
} from '../data/model'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, ButtonLink, Chip, Choice, Eyebrow, Field, input, Note, PageHeader, Panel, SectionTitle } from '../ui'

export function ExchangesPage() {
  const { dossier: d, role, canEdit, base } = useDossierCtx()
  useScrollToHash(true)
  const writable = !d.archivedAt
  const toAnswer = d.threads.filter((m) => questionState(d, m, role) === 'a_repondre')
  const others = d.threads.filter((m) => !toAnswer.includes(m))
  const advisor = d.advisors[0]
  return (
    <div className="space-y-6">
      <PageHeader title={role === 'conseiller' ? 'Échanges et avis' : 'Conseiller'}>
        {role === 'conseiller' ? `Dossier de ${PEOPLE[d.owner].name}.` : 'Vos échanges avec le conseiller, ses avis et vos décisions.'}
      </PageHeader>

      {role === 'porteur' && (
        advisor ? (
          <Panel><Eyebrow>Votre conseillère</Eyebrow><p className="mt-1 font-medium">{PEOPLE[advisor.id].name}</p><p className="text-sm text-muted">Attribuée le {formatDay(advisor.since)}. Son avis porte sur la préparation ; il ne garantit ni la faisabilité ni la rentabilité.</p></Panel>
        ) : (
          <Panel>
            <h2 className="text-lg font-semibold">Aucun conseiller n'est attribué à ce dossier</h2>
            <p className="mt-1">L'attribution est faite par l'équipe AGRIA. Aucune disponibilité, aucun délai ni aucune réponse ne peut être promis.</p>
            <h3 className="mt-3 font-semibold">Ce que vous pouvez faire dès maintenant</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Noter vos questions : elles restent dans le dossier et seront visibles par un conseiller s'il en est attribué un.</li>
              <li>Demander une relecture : la demande est enregistrée, sans réponse garantie.</li>
              <li>Continuer vos démarches et votre budget, et noter vous-même une décision.</li>
            </ul>
          </Panel>
        )
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          {toAnswer.length > 0 && (
            <section aria-labelledby="a-traiter">
              <SectionTitle id="a-traiter">Attendent votre réponse ({toAnswer.length})</SectionTitle>
              <ul className="space-y-3">{toAnswer.map((m) => <Thread key={m.id} m={m} writable={writable} />)}</ul>
            </section>
          )}
          <section aria-labelledby="messages">
            <SectionTitle id="messages">{toAnswer.length ? 'Autres échanges' : 'Questions et commentaires'}</SectionTitle>
            {others.length === 0 && toAnswer.length === 0 && <p className="text-muted">Aucun échange pour l'instant.</p>}
            <ul className="space-y-3">{others.map((m) => <Thread key={m.id} m={m} writable={writable} />)}</ul>
          </section>
          {writable && (role === 'porteur' || d.advisors.some((a) => a.id === 'ndiaye')) && <NewMessage />}
        </div>
        <aside className="space-y-4" aria-label="Relecture et décision">
          <ReviewsBlock />
          {role === 'conseiller' && writable && <ButtonLink to={`${base}/avis`} variant="secondary">Rédiger un avis</ButtonLink>}
          <DecisionBlock canDecide={canEdit} />
        </aside>
      </div>
    </div>
  )
}

function Thread({ m, writable }: { m: Message; writable: boolean }) {
  const { dossier: d, role, viewer } = useDossierCtx()
  const { ops } = useStore()
  const [body, setBody] = useState('')
  const { allowNextNavigation } = useUnsavedChanges(body.trim() !== '')
  const st = questionState(d, m, role)
  return (
    <li className="rounded-xl bg-surface p-4 ring-1 ring-line">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm text-muted">
          {m.kind === 'question' ? 'Question' : 'Commentaire'} de {PEOPLE[m.author].name} · {formatDay(m.at)}
          {m.target.type !== 'dossier' && <> · à propos de « {m.target.label} »</>}
        </p>
        {st && <Chip tone={st === 'a_repondre' ? 'warn' : st === 'close' ? 'ok' : 'neutral'}>{QUESTION_STATE_LABEL[st]}</Chip>}
      </div>
      <p className="mt-1 whitespace-pre-line text-lg">{m.body}</p>
      {m.replies.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-4 border-line pl-3">
          {m.replies.map((r) => <li key={r.id}><p className="text-sm text-muted">{PEOPLE[r.author].name} · {formatDay(r.at)}</p><p className="whitespace-pre-line">{r.body}</p></li>)}
        </ul>
      )}
      {writable && !m.resolvedAt && (
        <form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); if (!body.trim()) return; ops.post(d.id, { author: viewer, kind: 'reponse', target: m.target, body: body.trim(), parentId: m.id }); allowNextNavigation(); setBody('') }}>
          <Field label="Répondre">{(p) => <textarea {...p} rows={2} className={input} value={body} onChange={(e) => setBody(e.target.value)} />}</Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant={st === 'a_repondre' ? 'primary' : 'secondary'} disabled={!body.trim()}>Envoyer la réponse</Button>
            {m.kind === 'question' && <Button variant="quiet" onClick={() => ops.resolve(d.id, m.id)}>Marquer comme résolue</Button>}
          </div>
          <p className="text-xs text-muted">Une réponse ne clôt pas la question : elle reste ouverte jusqu'à être marquée résolue.</p>
        </form>
      )}
    </li>
  )
}

function useTarget(): Target {
  const { dossier: d } = useDossierCtx()
  const [params] = useSearchParams()
  const [type, ref] = (params.get('cible') ?? '').split(':')
  if (type === 'information' && ref && d.facts[ref] !== undefined) return { type, ref, label: factLabel(ref, d.profile) }
  if (type === 'information' && ref) return { type, ref, label: factLabel(ref, d.profile) }
  if (type === 'demarche') { const a = d.actions.find((x) => x.id === ref); if (a) return { type, ref: a.id, label: a.title } }
  return { type: 'dossier', ref: '', label: 'Le dossier' }
}

function NewMessage() {
  const { dossier: d, viewer } = useDossierCtx()
  const { ops } = useStore()
  const target = useTarget()
  const [kind, setKind] = useState<'question' | 'commentaire'>('question')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)
  const { allowNextNavigation } = useUnsavedChanges(body.trim() !== '')
  return (
    <section aria-labelledby="nouveau" className="rounded-xl bg-surface p-4 ring-1 ring-line">
      <h2 id="nouveau" className="text-lg font-semibold">Nouveau message</h2>
      <p className="mt-1 text-sm">À propos de : <strong>{target.label}</strong></p>
      {sent && <p role="status" className="mt-2 font-medium text-ok-700">Message envoyé.{d.advisors.length === 0 ? ' Il sera visible par un conseiller s’il en est attribué un.' : ''}</p>}
      <form className="mt-3 space-y-3" onSubmit={(e) => { e.preventDefault(); if (!body.trim()) return; ops.post(d.id, { author: viewer, kind, target, body: body.trim() }); allowNextNavigation(); setBody(''); setSent(true) }}>
        <fieldset className="flex flex-wrap gap-4"><legend className="sr-only">Type de message</legend>
          <label className="flex items-center gap-2"><input type="radio" name="kind" className="size-5 accent-brand-700" checked={kind === 'question'} onChange={() => setKind('question')} />Question</label>
          <label className="flex items-center gap-2"><input type="radio" name="kind" className="size-5 accent-brand-700" checked={kind === 'commentaire'} onChange={() => setKind('commentaire')} />Commentaire</label>
        </fieldset>
        <Field label="Message">{(p) => <textarea {...p} rows={3} className={input} value={body} onChange={(e) => { setBody(e.target.value); setSent(false) }} />}</Field>
        <Button type="submit" disabled={!body.trim()}>Envoyer</Button>
      </form>
    </section>
  )
}

function ReviewsBlock() {
  const { dossier: d, role, canEdit } = useDossierCtx()
  const { ops } = useStore()
  const request = pendingRequest(d)
  const reviews = d.reviews.slice().reverse()
  return (
    <Panel>
      <SectionTitle>Relecture et avis</SectionTitle>
      {request ? (
        <p className="text-sm">Relecture demandée le {formatDay(request.at)} — aucun avis {role === 'porteur' ? 'reçu' : 'donné'} depuis.</p>
      ) : canEdit ? (
        <Button variant="secondary" onClick={() => ops.requestReview(d.id, '')}>Demander une relecture</Button>
      ) : null}
      {canEdit && request && d.advisors.length === 0 && <p className="mt-1 text-sm text-muted">Aucun conseiller attribué : la demande attend une attribution.</p>}
      <ul className="mt-3 space-y-3">
        {reviews.map((r) => {
          const stale = staleSections(d, r)
          return (
            <li key={r.id} className="border-t border-line pt-3">
              <p className="font-medium">{VERDICT_LABEL[r.verdict]} {stale.length ? <Chip tone="warn">À réexaminer</Chip> : <Chip tone="ok">À jour</Chip>}</p>
              <p className="text-sm text-muted">Avis de {PEOPLE[r.advisor].name} · {formatDay(r.at)} · sur : {r.scope.map((s) => SECTION_LABEL[s]).join(', ')}</p>
              {stale.length > 0 && <p className="text-sm text-warn-700">Modifié depuis cet avis : {stale.map((s) => SECTION_LABEL[s]).join(', ')}.</p>}
              <p className="mt-1">{r.opinion}</p>
              {r.reservations && <p className="mt-1 text-sm"><strong>Réserves :</strong> {r.reservations}</p>}
              <details className="mt-1 text-sm text-muted"><summary className="cursor-pointer">Version examinée</summary>Projet v{r.versions.contexte}, démarches v{r.versions.plan}, budget v{r.versions.budget}.</details>
            </li>
          )
        })}
        {reviews.length === 0 && <li className="text-sm text-muted">Aucun avis pour l'instant.</li>}
      </ul>
    </Panel>
  )
}

function DecisionBlock({ canDecide }: { canDecide: boolean }) {
  const { dossier: d, viewer } = useDossierCtx()
  const { ops } = useStore()
  const [choice, setChoice] = useState<Decision['choice'] | ''>('')
  const [reason, setReason] = useState('')
  const [sent, setSent] = useState(false)
  const { allowNextNavigation } = useUnsavedChanges(choice !== '' || reason.trim() !== '')
  const last = d.decisions[d.decisions.length - 1]
  const changed = last && (Object.keys(d.versions) as (keyof typeof d.versions)[]).some((k) => d.versions[k] !== last.versions[k])
  return (
    <section id="decision" aria-labelledby="decision-titre" className="rounded-xl bg-surface p-4 ring-1 ring-line sm:p-5">
      <SectionTitle id="decision-titre">Décision du porteur</SectionTitle>
      {last ? (
        <div className="text-sm">
          <p className="text-base font-semibold">{DECISION_LABEL[last.choice]}</p>
          <p className="text-muted">{PEOPLE[last.by].name} · {formatDay(last.at)}</p>
          <p className="mt-1">Motif : {last.reason}</p>
          {changed && <p className="mt-1 text-muted">Le dossier a été modifié depuis cette décision.</p>}
        </div>
      ) : (
        <p className="text-sm text-muted">Aucune décision enregistrée.</p>
      )}
      <p className="mt-2 text-xs text-muted">Une décision appartient au porteur : elle est distincte de l'avis du conseiller, et « Poursuivre » n'est pas une approbation d'AGRIA.</p>
      {canDecide && (
        <form className="mt-3 space-y-3" onSubmit={(e) => {
          e.preventDefault()
          if (!choice || !reason.trim()) return
          ops.decide(d.id, choice, reason.trim(), viewer)
          allowNextNavigation()
          setChoice(''); setReason(''); setSent(true)
        }}>
          {sent && <p role="status" className="font-medium text-ok-700">Décision enregistrée.</p>}
          <Choice<Decision['choice']> legend="Votre décision" name="choice" value={choice} onChange={setChoice} options={[
            { value: 'poursuivre', label: 'Poursuivre' },
            { value: 'modifier', label: 'Modifier le projet' },
            { value: 'differer', label: 'Différer', help: 'Différer un projet mal préparé peut être une bonne décision.' },
          ]} />
          <Field label="Pourquoi ?" required>{(p) => <textarea {...p} rows={2} className={input} value={reason} onChange={(e) => setReason(e.target.value)} />}</Field>
          <Button type="submit" variant="secondary" disabled={!choice || !reason.trim()}>Enregistrer la décision</Button>
        </form>
      )}
      {!canDecide && !last && <Note tone="neutral">Seul le porteur enregistre une décision.</Note>}
    </section>
  )
}
