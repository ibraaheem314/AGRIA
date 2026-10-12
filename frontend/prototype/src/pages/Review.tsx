import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { pendingRequest, SECTION_LABEL, staleSections, type Review, type Section } from '../data/model'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, Choice, Field, input, Note, PageHeader, Panel, TextLink } from '../ui'

/** Avis du conseiller : périmètre, conclusion, réserves ; la version examinée est enregistrée. */
export function ReviewPage() {
  const { dossier: d, role, base, viewer } = useDossierCtx()
  const { ops } = useStore()
  const navigate = useNavigate()
  const [scope, setScope] = useState<Section[]>([])
  const [verdict, setVerdict] = useState<Review['verdict'] | ''>('')
  const [opinion, setOpinion] = useState('')
  const [reservations, setReservations] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { allowNextNavigation } = useUnsavedChanges(scope.length > 0 || verdict !== '' || opinion.trim() !== '' || reservations.trim() !== '')
  if (role !== 'conseiller' || d.archivedAt) return <p>Seul un conseiller attribué donne un avis, sur un dossier non archivé. <TextLink to={base}>Retour</TextLink></p>
  const request = pendingRequest(d)
  const last = d.reviews[d.reviews.length - 1]
  const stale = last ? staleSections(d, last) : []

  function save() {
    if (scope.length === 0) return setError('Indiquez ce que vous avez relu.')
    if (!verdict) return setError('Choisissez une conclusion.')
    if (!opinion.trim()) return setError('Rédigez votre avis.')
    if (verdict === 'avec_reserves' && !reservations.trim()) return setError('Précisez vos réserves.')
    ops.giveReview(d.id, { advisor: viewer as 'ndiaye', scope, verdict, opinion: opinion.trim(), reservations: reservations.trim() })
    allowNextNavigation()
    navigate(base, { state: { flash: 'Avis enregistré. Il porte sur la version actuelle du dossier.' } })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p><TextLink to={base}>← Vue d'ensemble</TextLink></p>
      <PageHeader eyebrow="Relecture" title="Rédiger un avis">
        {request ? `Relecture demandée par le porteur${request.note ? ` : « ${request.note} »` : ''}.` : stale.length ? `Votre dernier avis est à réexaminer (modifié depuis : ${stale.map((s) => SECTION_LABEL[s]).join(', ')}).` : 'Avis spontané.'}
      </PageHeader>
      <Panel>
        <form className="space-y-5" noValidate onSubmit={(e) => { e.preventDefault(); save() }}>
          <fieldset className="space-y-2">
            <legend className="font-medium">Ce que vous avez relu</legend>
            {(Object.keys(SECTION_LABEL) as Section[]).map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input type="checkbox" className="size-5 accent-brand-700" checked={scope.includes(s)} onChange={(e) => setScope((x) => (e.target.checked ? [...x, s] : x.filter((y) => y !== s)))} />
                {SECTION_LABEL[s]} <span className="text-sm text-muted">(version {d.versions[s]})</span>
              </label>
            ))}
          </fieldset>
          <Choice<Review['verdict']> legend="Conclusion" name="verdict" value={verdict} onChange={setVerdict} options={[
            { value: 'sans_reserve', label: 'Revu sans réserve', help: 'Sur le périmètre examiné seulement.' },
            { value: 'avec_reserves', label: 'Revu avec réserves' },
          ]} />
          <Field label="Avis" required>{(p) => <textarea {...p} rows={4} className={input} value={opinion} onChange={(e) => setOpinion(e.target.value)} />}</Field>
          <Field label="Réserves" required={verdict === 'avec_reserves'}>{(p) => <textarea {...p} rows={3} className={input} value={reservations} onChange={(e) => setReservations(e.target.value)} />}</Field>
          <Note tone="neutral">« Revu » ne signifie ni faisable ni rentable. Si le porteur modifie ensuite une partie relue, l'avis sera signalé « à réexaminer ».</Note>
          {error && <p role="alert" className="font-medium text-danger-700">{error}</p>}
          <Button type="submit">Enregistrer l'avis</Button>
        </form>
      </Panel>
    </div>
  )
}
