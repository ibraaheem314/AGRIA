import { useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ApiError, newRequestId } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { formatDateTime } from '../../shared/format'
import { Alert, Badge, Button, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { useCurrentDossier } from '../dossiers/DossierLayout'
import {
  useDecision,
  useGiveReview,
  usePostMessage,
  useRelecture,
  useRequestReview,
  useResolve,
  useReviewDetail,
  type Message,
  type Relecture,
  type Review,
  type Section,
  type Versions,
} from './api'
import { SectionsView } from './SectionsView'

export function RelecturePage() {
  const dossier = useCurrentDossier()
  const relecture = useRelecture(dossier.id)
  if (relecture.isPending) return <Loading label="Chargement de la relecture…" />
  if (relecture.isError) return <Alert tone="danger" role="alert" title="Relecture indisponible">{relecture.error.message}</Alert>
  const data = relecture.data
  const owner = data.role === 'porteur'
  const writable = !dossier.archived

  return (
    <div className="space-y-6">
      <PageTitle subtitle={`État du dossier : ${data.status.label}`}>Relecture et échanges</PageTitle>
      <p className="text-sm text-muted">
        « Revu » signifie qu'un conseiller a relu le périmètre indiqué. Cela ne garantit ni la faisabilité ni la rentabilité du projet.
      </p>

      <Card>
        <h2 className="font-semibold">Conseiller</h2>
        {data.advisors.length === 0 ? (
          <p className="mt-1">
            Aucun conseiller n'est attribué à ce dossier pour le moment. L'attribution est faite par l'équipe AGRIA ;
            aucune disponibilité ni réponse ne peut être promise.
          </p>
        ) : (
          <ul className="mt-1">
            {data.advisors.map((a) => (
              <li key={a.id}>{a.display_name} — attribué depuis le {formatDateTime(a.since)}</li>
            ))}
          </ul>
        )}
        {owner && writable && <RequestReview dossierId={dossier.id} relecture={data} />}
      </Card>

      {data.can_review && writable && <ReviewForm dossierId={dossier.id} relecture={data} />}

      <section aria-labelledby="avis" className="space-y-3">
        <h2 id="avis" className="text-lg font-semibold">Avis ({data.reviews.length})</h2>
        {data.reviews.length === 0 && <p className="text-muted">Aucun avis pour le moment.</p>}
        <ul className="space-y-3">
          {data.reviews.map((r) => <ReviewCard key={r.id} review={r} dossierId={dossier.id} />)}
        </ul>
      </section>

      <Messages dossierId={dossier.id} relecture={data} writable={writable} />

      <section aria-labelledby="decisions" className="space-y-3">
        <h2 id="decisions" className="text-lg font-semibold">Décisions</h2>
        {data.decisions.length === 0 && <p className="text-muted">Aucune décision enregistrée.</p>}
        <ul className="space-y-2">
          {data.decisions.map((d) => (
            <Card as="li" key={d.id}>
              <p className="font-medium">{d.choice_label}</p>
              <p className="mt-1 whitespace-pre-line">{d.reason}</p>
              <p className="mt-1 text-sm text-muted">{d.author.display_name} · {formatDateTime(d.created_at)}</p>
            </Card>
          ))}
        </ul>
        {owner && writable && <DecisionForm dossierId={dossier.id} relecture={data} />}
      </section>

      <p>
        <Link to={`/d/${dossier.id}/synthese`} className="font-medium text-brand-700 underline">Voir la synthèse du dossier</Link>
      </p>
    </div>
  )
}

function RequestReview({ dossierId, relecture }: { dossierId: number; relecture: Relecture }) {
  const request = useRequestReview(dossierId)
  const requestId = useRef(newRequestId())
  const [note, setNote] = useState('')
  const [open, setOpen] = useState(false)
  useUnsavedChanges(open && note.trim() !== '')
  const pending = relecture.requests.find((r) => !r.answered)
  if (pending) {
    return <p className="mt-3 text-sm">Relecture demandée le {formatDateTime(pending.created_at)}, en attente d'avis.</p>
  }
  if (!open) {
    return <Button variant="secondary" className="mt-3" onClick={() => setOpen(true)}>Demander une relecture</Button>
  }
  return (
    <form
      className="mt-3 space-y-3"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        request.mutate({ note, request_id: requestId.current }, { onSuccess: () => setOpen(false) })
      }}
    >
      {request.error && <Alert tone="danger" role="alert">{request.error.message}</Alert>}
      {relecture.advisors.length === 0 && (
        <Alert tone="warn">La demande sera visible dès qu'un conseiller sera attribué à ce dossier.</Alert>
      )}
      <Field label="Message pour le conseiller" help="Facultatif : ce sur quoi vous voulez un avis.">
        {(p) => <textarea {...p} rows={3} className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />}
      </Field>
      <div className="flex gap-3">
        <Button type="submit" busy={request.isPending}>Envoyer la demande</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
      </div>
    </form>
  )
}

function versionsText(v: Versions) {
  return `contexte v${v.contexte}, plan v${v.plan}, budget v${v.budget}`
}

function ReviewCard({ review, dossierId }: { review: Review; dossierId: number }) {
  const dossier = useCurrentDossier()
  const [open, setOpen] = useState(false)
  const detail = useReviewDetail(dossierId, open ? review.id : null)
  return (
    <Card as="li">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium">{review.verdict_label}</p>
        {review.current ? <Badge tone="ok">À jour</Badge> : <Badge tone="warn">À réexaminer</Badge>}
      </div>
      <p className="mt-1 text-sm text-muted">
        {review.advisor.display_name} · {formatDateTime(review.created_at)} · périmètre : {review.scope_labels.join(', ')} ·
        version examinée : {versionsText(review.versions)}
      </p>
      {!review.current && (
        <p className="mt-1 text-sm text-warn-700">
          Modifié depuis cet avis : {review.stale_sections.join(', ')}. L'avis porte sur une version antérieure.
        </p>
      )}
      <p className="mt-2 whitespace-pre-line">{review.opinion}</p>
      {review.reservations && (
        <div className="mt-2">
          <p className="font-medium">Réserves</p>
          <p className="whitespace-pre-line">{review.reservations}</p>
        </div>
      )}
      <Button variant="ghost" className="mt-2" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Masquer la version examinée' : 'Voir la version examinée'}
      </Button>
      {open && detail.isPending && <Loading />}
      {open && detail.data && (
        <div className="mt-3 rounded-md border border-line p-3">
          <SectionsView snapshot={detail.data.snapshot} dossier={dossier} />
        </div>
      )}
    </Card>
  )
}

function ReviewForm({ dossierId, relecture }: { dossierId: number; relecture: Relecture }) {
  const give = useGiveReview(dossierId)
  const requestId = useRef(newRequestId())
  // Versions affichées à l'ouverture : l'avis est refusé si le dossier change avant l'envoi.
  const [seen, setSeen] = useState<Versions | null>(null)
  const [scope, setScope] = useState<Section[]>([])
  const [verdict, setVerdict] = useState('')
  const [opinion, setOpinion] = useState('')
  const [reservations, setReservations] = useState('')
  const [sent, setSent] = useState(false)
  const error = give.error instanceof ApiError ? give.error : null
  useUnsavedChanges(seen !== null && (scope.length > 0 || verdict !== '' || opinion.trim() !== '' || reservations.trim() !== ''))

  if (!seen) {
    return (
      <Card>
        <h2 className="font-semibold">Donner un avis</h2>
        {sent && <p role="status" className="mt-1 font-medium text-ok-700">Avis enregistré.</p>}
        <p className="mt-1 text-sm text-muted">Relisez d'abord le projet, le plan et le budget du dossier.</p>
        <Button className="mt-3" onClick={() => { setSeen(relecture.versions); setSent(false) }}>Rédiger un avis</Button>
      </Card>
    )
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    give.mutate(
      { scope, verdict, opinion, reservations, seen_versions: seen!, request_id: requestId.current },
      {
        onSuccess: () => {
          requestId.current = newRequestId()
          setSeen(null)
          setScope([])
          setVerdict('')
          setOpinion('')
          setReservations('')
          setSent(true)
        },
      },
    )
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <h2 className="font-semibold">Donner un avis</h2>
        <p className="text-sm text-muted">Version relue : {versionsText(seen)}.</p>
        {error && (
          <Alert tone="danger" role="alert" title={error.code === 'conflit' ? 'Le dossier a changé' : 'Avis non enregistré'}>
            {error.message}
            {error.code === 'conflit' && (
              <button type="button" className="ml-1 font-medium underline" onClick={() => { setSeen(relecture.versions); give.reset() }}>
                J'ai relu la version actuelle
              </button>
            )}
          </Alert>
        )}
        <fieldset className="space-y-1">
          <legend className="font-medium">Périmètre relu</legend>
          {relecture.choices.sections.map((s) => (
            <label key={s.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-5 accent-brand-700"
                checked={scope.includes(s.value as Section)}
                onChange={(e) =>
                  setScope((cur) => (e.target.checked ? [...cur, s.value as Section] : cur.filter((x) => x !== s.value)))
                }
              />
              {s.label}
            </label>
          ))}
          {error?.fieldMessage('scope') && <p className="text-sm font-medium text-danger-700">{error.fieldMessage('scope')}</p>}
        </fieldset>
        <fieldset className="space-y-1">
          <legend className="font-medium">Conclusion sur ce périmètre</legend>
          {relecture.choices.verdicts.map((v) => (
            <label key={v.value} className="flex items-center gap-2">
              <input type="radio" name="verdict" className="size-5 accent-brand-700" checked={verdict === v.value} onChange={() => setVerdict(v.value)} />
              {v.label}
            </label>
          ))}
          {error?.fieldMessage('verdict') && <p className="text-sm font-medium text-danger-700">{error.fieldMessage('verdict')}</p>}
        </fieldset>
        <Field label="Avis" error={error?.fieldMessage('opinion')} required>
          {(p) => <textarea {...p} rows={4} className={inputClass} value={opinion} onChange={(e) => setOpinion(e.target.value)} />}
        </Field>
        <Field label="Réserves" help="Obligatoire si vous concluez « avec réserves »." error={error?.fieldMessage('reservations')} required={verdict === 'avec_reserves'}>
          {(p) => <textarea {...p} rows={3} className={inputClass} value={reservations} onChange={(e) => setReservations(e.target.value)} />}
        </Field>
        <div className="flex gap-3">
          <Button type="submit" busy={give.isPending}>{error?.network ? 'Réessayer' : 'Enregistrer l’avis'}</Button>
          <Button type="button" variant="ghost" onClick={() => setSeen(null)}>Annuler</Button>
        </div>
      </form>
    </Card>
  )
}

const TARGET_PREFIX: Record<Message['target_type'], string> = {
  dossier: '',
  information: 'Information',
  demarche: 'Démarche',
  poste: 'Poste de budget',
}

function Messages({ dossierId, relecture, writable }: { dossierId: number; relecture: Relecture; writable: boolean }) {
  const [params] = useSearchParams()
  const cible = params.get('cible') // ex. « demarche:12 »
  const [targetType, targetRef] = cible?.includes(':') ? cible.split(':', 2) : ['dossier', '']
  const canWrite = writable && (relecture.role === 'porteur' || relecture.can_review)
  return (
    <section aria-labelledby="messages" className="space-y-3">
      <h2 id="messages" className="text-lg font-semibold">Questions et commentaires</h2>
      {relecture.threads.length === 0 && <p className="text-muted">Aucun message.</p>}
      <ul className="space-y-3">
        {relecture.threads.map((m) => <Thread key={m.id} message={m} dossierId={dossierId} canWrite={canWrite} />)}
      </ul>
      {canWrite && <NewMessage dossierId={dossierId} targetType={targetType ?? 'dossier'} targetRef={targetRef ?? ''} />}
    </section>
  )
}

function Thread({ message, dossierId, canWrite }: { message: Message; dossierId: number; canWrite: boolean }) {
  const resolve = useResolve(dossierId)
  const reply = usePostMessage(dossierId)
  const requestId = useRef(newRequestId())
  const [body, setBody] = useState('')
  useUnsavedChanges(body.trim() !== '')
  const isQuestion = message.kind === 'question'
  return (
    <Card as="li">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm text-muted">
          {message.kind_label} de {message.author.display_name} ({message.author_role}) · {formatDateTime(message.created_at)}
          {message.target_label && <> · {TARGET_PREFIX[message.target_type]} : « {message.target_label} »</>}
        </p>
        {isQuestion && (message.resolved_at ? <Badge tone="ok">Résolue</Badge> : <Badge tone="warn">Ouverte</Badge>)}
      </div>
      <p className="mt-1 whitespace-pre-line">{message.body}</p>
      {message.replies.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-4 border-line pl-3">
          {message.replies.map((r) => (
            <li key={r.id}>
              <p className="text-sm text-muted">{r.author.display_name} ({r.author_role}) · {formatDateTime(r.created_at)}</p>
              <p className="whitespace-pre-line">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
      {canWrite && (
        <form
          className="mt-3 space-y-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            reply.mutate(
              { parent_id: message.id, body, request_id: requestId.current },
              { onSuccess: () => { setBody(''); requestId.current = newRequestId() } },
            )
          }}
        >
          {reply.error && <Alert tone="danger" role="alert">{reply.error.message}</Alert>}
          <Field label="Répondre">
            {(p) => <textarea {...p} rows={2} className={inputClass} value={body} onChange={(e) => setBody(e.target.value)} />}
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="secondary" busy={reply.isPending} disabled={!body.trim()}>Envoyer la réponse</Button>
            {isQuestion && !message.resolved_at && (
              <Button type="button" variant="ghost" busy={resolve.isPending} onClick={() => resolve.mutate(message.id)}>
                Marquer comme résolue
              </Button>
            )}
          </div>
        </form>
      )}
    </Card>
  )
}

function NewMessage({ dossierId, targetType, targetRef }: { dossierId: number; targetType: string; targetRef: string }) {
  const post = usePostMessage(dossierId)
  const requestId = useRef(newRequestId())
  const [kind, setKind] = useState<'question' | 'commentaire'>('question')
  const [body, setBody] = useState('')
  useUnsavedChanges(body.trim() !== '')
  const [sent, setSent] = useState(false)
  const error = post.error instanceof ApiError ? post.error : null
  return (
    <Card>
      <form
        className="space-y-3"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setSent(false)
          post.mutate(
            { kind, body, target_type: targetType, target_ref: targetRef, request_id: requestId.current },
            { onSuccess: () => { setBody(''); setSent(true); requestId.current = newRequestId() } },
          )
        }}
      >
        <h3 className="font-semibold">Nouveau message</h3>
        {targetType !== 'dossier' && (
          <p className="text-sm text-muted">À propos d'un élément précis du dossier ({TARGET_PREFIX[targetType as Message['target_type']] ?? targetType}).</p>
        )}
        {sent && <p role="status" className="font-medium text-ok-700">Message envoyé.</p>}
        {error && <Alert tone="danger" role="alert">{error.message}</Alert>}
        <fieldset className="flex flex-wrap gap-4">
          <legend className="sr-only">Type de message</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="kind" className="size-5 accent-brand-700" checked={kind === 'question'} onChange={() => setKind('question')} /> Question
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="kind" className="size-5 accent-brand-700" checked={kind === 'commentaire'} onChange={() => setKind('commentaire')} /> Commentaire
          </label>
        </fieldset>
        <Field label="Message" error={error?.fieldMessage('body') ?? error?.fieldMessage('target_ref')}>
          {(p) => <textarea {...p} rows={3} maxLength={4000} className={inputClass} value={body} onChange={(e) => setBody(e.target.value)} />}
        </Field>
        <Button type="submit" busy={post.isPending} disabled={!body.trim()}>{error?.network ? 'Réessayer' : 'Envoyer'}</Button>
      </form>
    </Card>
  )
}

function DecisionForm({ dossierId, relecture }: { dossierId: number; relecture: Relecture }) {
  const decide = useDecision(dossierId)
  const requestId = useRef(newRequestId())
  const [choice, setChoice] = useState('')
  const [reason, setReason] = useState('')
  useUnsavedChanges(choice !== '' || reason.trim() !== '')
  const [sent, setSent] = useState(false)
  const error = decide.error instanceof ApiError ? decide.error : null
  return (
    <Card>
      <form
        className="space-y-3"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setSent(false)
          decide.mutate(
            { choice, reason, request_id: requestId.current },
            { onSuccess: () => { setChoice(''); setReason(''); setSent(true); requestId.current = newRequestId() } },
          )
        }}
      >
        <h3 className="font-semibold">Enregistrer une décision</h3>
        <p className="text-sm text-muted">Différer un projet mal préparé peut être une bonne décision.</p>
        {sent && <p role="status" className="font-medium text-ok-700">Décision enregistrée.</p>}
        {error && <Alert tone="danger" role="alert">{error.message}</Alert>}
        <fieldset className="space-y-1">
          <legend className="font-medium">Décision</legend>
          {relecture.choices.decisions.map((d) => (
            <label key={d.value} className="flex items-center gap-2">
              <input type="radio" name="choice" className="size-5 accent-brand-700" checked={choice === d.value} onChange={() => setChoice(d.value)} />
              {d.label}
            </label>
          ))}
          {error?.fieldMessage('choice') && <p className="text-sm font-medium text-danger-700">{error.fieldMessage('choice')}</p>}
        </fieldset>
        <Field label="Motifs" error={error?.fieldMessage('reason')} required>
          {(p) => <textarea {...p} rows={3} className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />}
        </Field>
        <Button type="submit" busy={decide.isPending}>{error?.network ? 'Réessayer' : 'Enregistrer la décision'}</Button>
      </form>
    </Card>
  )
}
