import { Link } from 'react-router'
import { Alert, Badge, Card, Loading, PageTitle } from '../../shared/ui'
import { useBudget } from '../budget/api'
import { budgetSentence } from '../budget/BudgetPage'
import { formatDateTime } from '../../shared/format'
import type { Dossier, FactItem } from './api'
import { describeValue, STATUS_LABEL, STATUS_TONE } from './factDisplay'
import { useCurrentDossier } from './DossierLayout'

export function factCounts(dossier: Dossier) {
  const counts = { total: dossier.facts.length, non_renseigne: 0, inconnu: 0, declare: 0, estime: 0, verifie: 0 }
  for (const fact of dossier.facts) counts[fact.state.status] += 1
  return counts
}

export function ProjectPage() {
  const dossier = useCurrentDossier()
  const counts = factCounts(dossier)
  const owner = dossier.role === 'porteur'

  return (
    <div className="space-y-6">
      <PageTitle subtitle={`${dossier.label} · ${dossier.project.profile_label}`}>{dossier.project.name}</PageTitle>

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
                <FactRow key={fact.key} fact={fact} dossierId={dossier.id} editable={owner && !dossier.archived} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function FactRow({ fact, dossierId, editable }: { fact: FactItem; dossierId: number; editable: boolean }) {
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
      {fact.state.updated_at && (
        <p className="mt-1 text-xs text-muted">
          Modifié le {formatDateTime(fact.state.updated_at)} par {fact.state.updated_by?.display_name}
        </p>
      )}
      {empty && <p className="mt-1 text-sm text-muted">{fact.why}</p>}
      <p className="mt-2">
        <Link to={`/d/${dossierId}/projet/${fact.key}`} className="font-medium text-brand-700 underline">
          {editable ? (empty ? 'Compléter' : 'Mettre à jour') : 'Voir le détail et l’historique'}
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
