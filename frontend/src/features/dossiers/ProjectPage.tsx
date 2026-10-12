import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ApiError, newRequestId } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { Alert, Badge, Button, ButtonLink, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { useBudget } from '../budget/api'
import { budgetSentence } from '../budget/BudgetPage'
import { formatDateTime } from '../../shared/format'
import { usePreparation, type Check } from '../plan/api'
import { useCreateCampaign, type Dossier, type FactItem } from './api'
import { describeValue, STATUS_LABEL, STATUS_TONE } from './factDisplay'
import { useCurrentDossier } from './DossierLayout'
import { words } from './roles'

export function factCounts(dossier: Dossier) {
  const counts = { total: dossier.facts.length, non_renseigne: 0, inconnu: 0, declare: 0, estime: 0, verifie: 0 }
  for (const fact of dossier.facts) counts[fact.state.status] += 1
  return counts
}

export function ProjectPage() {
  const dossier = useCurrentDossier()
  const counts = factCounts(dossier)
  const owner = dossier.role === 'porteur'
  const openPoints = useOpenPoints(dossier.id)

  return (
    <div className="space-y-6">
      <PageTitle
        subtitle={`${dossier.label} · ${dossier.project.profile_label}${owner ? '' : ` · porteur : ${dossier.project.owner.display_name}`}`}
      >
        {dossier.project.name}
      </PageTitle>

      <Card>
        <h2 className="font-semibold">Ce que contient le dossier</h2>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
          <li>Vérifiées : <strong>{counts.verifie}</strong></li>
          <li>Déclarées ou estimées : <strong>{counts.declare + counts.estime}</strong></li>
          <li>« Je ne sais pas » : <strong>{counts.inconnu}</strong></li>
          <li>Non renseignées : <strong>{counts.non_renseigne}</strong></li>
          <li>Total : <strong>{counts.total}</strong></li>
        </ul>
        <p className="mt-2 text-sm text-muted">
          Un dossier complet n'est pas une garantie de faisabilité : il rend visibles ce qui est connu et ce qui reste à vérifier.
        </p>
        {owner && !dossier.archived && dossier.project.profile === 'debutant' && counts.non_renseigne > 0 && (
          <ButtonLink to={`/d/${dossier.id}/projet/pas-a-pas`} className="mt-3">
            Renseigner pas à pas ({counts.non_renseigne} restante{counts.non_renseigne > 1 ? 's' : ''})
          </ButtonLink>
        )}
      </Card>

      <BudgetCard dossierId={dossier.id} />

      {dossier.sections.map((section) => {
        const items = dossier.facts.filter((f) => f.section === section.key)
        if (items.length === 0) return null
        return (
          <section key={section.key} aria-labelledby={`section-${section.key}`} className="space-y-3">
            <h2 id={`section-${section.key}`} className="text-lg font-semibold">{section.label}</h2>
            <ul className="space-y-3">
              {items.map((fact) => (
                <FactRow
                  key={fact.key}
                  fact={fact}
                  dossierId={dossier.id}
                  editable={owner && !dossier.archived}
                  openPoint={openPoints.get(fact.key)}
                />
              ))}
            </ul>
          </section>
        )
      })}

      {owner && <NewCampaignCard dossier={dossier} />}
    </div>
  )
}

function NewCampaignCard({ dossier }: { dossier: Dossier }) {
  const create = useCreateCampaign(dossier.project.id)
  const navigate = useNavigate()
  const requestId = useRef(newRequestId())
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [reuse, setReuse] = useState(true)
  const { allowNextNavigation } = useUnsavedChanges(open && label.trim() !== '')
  const error = create.error instanceof ApiError ? create.error : null

  function submit(event: FormEvent) {
    event.preventDefault()
    create.mutate(
      { label, request_id: requestId.current, copy_from: reuse ? dossier.id : null },
      {
        onSuccess: (d) => {
          allowNextNavigation()
          navigate(`/d/${d.id}/projet`, { state: { flash: `Campagne « ${d.label} » créée.` } })
        },
      },
    )
  }

  return (
    <Card>
      <h2 className="font-semibold">Préparer une autre campagne</h2>
      <p className="mt-1 text-sm text-muted">
        Pour la saison suivante du même projet. Ce dossier-ci reste inchangé{dossier.archived ? ' (archivé)' : ''}.
      </p>
      {!open ? (
        <Button variant="secondary" className="mt-3" onClick={() => setOpen(true)}>Nouvelle campagne</Button>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-4" noValidate>
          {error && <Alert tone="danger" role="alert">{error.message}</Alert>}
          <Field label="Campagne préparée" help="Par exemple : « Contre-saison 2028 »." error={error?.fieldMessage('label')} required>
            {(p) => <input {...p} className={inputClass} maxLength={120} value={label} onChange={(e) => setLabel(e.target.value)} />}
          </Field>
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-brand-700" checked={reuse} onChange={(e) => setReuse(e.target.checked)} />
            <span>
              Reprendre les informations sur le lieu (localisation, terrain, eau) comme point de départ. Elles seront
              marquées « à revérifier » ; démarches, budget et résultats ne sont pas recopiés.
            </span>
          </label>
          <div className="flex gap-3">
            <Button type="submit" busy={create.isPending}>{error?.network ? 'Réessayer' : 'Créer la campagne'}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      )}
    </Card>
  )
}

function FactRow({
  fact,
  dossierId,
  editable,
  openPoint,
}: {
  fact: FactItem
  dossierId: number
  editable: boolean
  openPoint?: Check
}) {
  const lines = describeValue(fact, fact.state.value)
  const empty = fact.state.status === 'non_renseigne'
  return (
    <Card as="li">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium">{fact.label}</h3>
        <Badge tone={STATUS_TONE[fact.state.status]}>{STATUS_LABEL[fact.state.status]}</Badge>
      </div>
      {lines.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {lines.map((line) => (
            <li key={line} className="break-words">{line}</li>
          ))}
        </ul>
      )}
      {fact.state.source && (
        <p className="mt-1 text-sm text-muted break-words">Source ou précision : {fact.state.source}</p>
      )}
      {openPoint && <SituationLine check={openPoint} dossierId={dossierId} />}
      {fact.state.updated_at && (
        <p className="mt-1 text-xs text-muted">
          Modifié le {formatDateTime(fact.state.updated_at)} par {fact.state.updated_by?.display_name}
        </p>
      )}
      {empty && <p className="mt-1 text-sm text-muted">{fact.why}</p>}
      <p className="mt-2">
        <Link to={`/d/${dossierId}/projet/${fact.key}`} className="font-medium text-brand-700 underline">
          {editable ? (empty ? 'Compléter' : 'Mettre à jour') : 'Consulter l’information'}
          <span className="sr-only"> : {fact.label}</span>
        </Link>
      </p>
    </Card>
  )
}

export function BudgetCard({ dossierId }: { dossierId: number }) {
  const budget = useBudget(dossierId)
  return (
    <Card>
      <h2 className="font-semibold">Budget provisoire</h2>
      {budget.isPending && <Loading />}
      {budget.isError && <Alert tone="danger">Budget indisponible : {budget.error.message}</Alert>}
      {budget.data && (
        <p className={`mt-1 ${budget.data.totals.overall.status === 'incomplet' ? 'text-warn-700' : ''}`}>
          {budgetSentence(budget.data.totals.overall)}
        </p>
      )}
      <Link to={`/d/${dossierId}/projet/budget`} className="mt-2 inline-block font-medium text-brand-700 underline">
        Voir le budget provisoire
      </Link>
    </Card>
  )
}

/** Points encore ouverts (hors simple saisie manquante), par information. */
export function useOpenPoints(dossierId: number): Map<string, Check> {
  const prep = usePreparation(dossierId)
  const map = new Map<string, Check>()
  for (const check of prep.data?.checks ?? []) {
    if (check.level !== 'a_completer') map.set(check.fact_key, check)
  }
  return map
}

/** Le statut dit d'où vient l'information ; la situation, elle, peut rester à régler. */
export function SituationLine({ check, dossierId }: { check: Check; dossierId: number }) {
  const w = words(useCurrentDossier())
  return (
    <p className="mt-2 rounded-md border border-warn-700/30 bg-warn-50 px-2 py-1 text-sm text-warn-700">
      <strong>Situation : point encore ouvert.</strong> {check.message}.{' '}
      <Link to={check.action ? `/d/${dossierId}/plan/${check.action.id}` : `/d/${dossierId}/plan`} className="underline">
        {check.action ? 'Voir la démarche' : w.seePlan}
      </Link>
    </p>
  )
}
