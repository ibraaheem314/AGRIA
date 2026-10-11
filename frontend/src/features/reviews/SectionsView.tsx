import { formatDate, formatDecimal, formatFcfa } from '../../shared/format'
import { Badge } from '../../shared/ui'
import { budgetSentence } from '../budget/BudgetPage'
import type { Dossier } from '../dossiers/api'
import { describeValue, STATUS_LABEL, STATUS_TONE } from '../dossiers/factDisplay'
import type { Snapshot } from './api'

/** Affichage d'un instantané (avis) ou de la synthèse : inconnues et manques restent visibles. */
export function SectionsView({ snapshot, dossier, level = 3 }: { snapshot: Snapshot; dossier: Dossier; level?: 2 | 3 }) {
  const H = level === 2 ? 'h2' : 'h3'
  const Sub = level === 2 ? 'h3' : 'h4'
  const definitions = Object.fromEntries(dossier.facts.map((f) => [f.key, f]))
  return (
    <div className="space-y-6">
      {snapshot.contexte && (
        <section className="space-y-2 break-inside-avoid-page">
          <H className="text-lg font-semibold">Contexte du projet</H>
          <p className="text-sm text-muted">Profil : {snapshot.contexte.profile_label}</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="py-1 pr-2">Information</th>
                <th scope="col" className="py-1 pr-2">État</th>
                <th scope="col" className="py-1">Valeur et source</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.contexte.facts.map((f) => (
                <tr key={f.key} className="border-b border-line align-top">
                  <th scope="row" className="py-1 pr-2 text-left font-medium">{f.label}</th>
                  <td className="py-1 pr-2"><Badge tone={STATUS_TONE[f.status]}>{STATUS_LABEL[f.status]}</Badge></td>
                  <td className="py-1">
                    {definitions[f.key] ? describeValue(definitions[f.key]!, f.value).join(' · ') : ''}
                    {f.source && <span className="block text-muted">Source : {f.source}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {snapshot.plan && (
        <section className="space-y-2 break-inside-avoid-page">
          <H className="text-lg font-semibold">Plan d'action</H>
          {snapshot.plan.template && (
            <p className="text-sm text-muted">
              Modèle {snapshot.plan.template.code} v{snapshot.plan.template.version} —{' '}
              {snapshot.plan.template.review_status === 'relu' ? 'relu' : 'non relu par un spécialiste'}
            </p>
          )}
          <Sub className="font-medium">Points à vérifier ({snapshot.plan.checks.length})</Sub>
          {snapshot.plan.checks.length === 0 ? (
            <p className="text-sm text-muted">Aucun point signalé.</p>
          ) : (
            <ul className="list-disc space-y-0.5 pl-5 text-sm">
              {snapshot.plan.checks.map((c) => (
                <li key={c.key}>{c.message}{c.blocking ? ' (bloquant)' : ''}</li>
              ))}
            </ul>
          )}
          <Sub className="font-medium">Démarches ({snapshot.plan.actions.length})</Sub>
          {snapshot.plan.actions.length === 0 ? (
            <p className="text-sm text-muted">Aucune démarche.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {snapshot.plan.actions.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}</strong> — {a.status_label}
                  {a.status === 'bloquee' && <> : {a.blocked_reason}</>}
                  {a.status === 'terminee' && <> ({a.result_date && formatDate(a.result_date)}) : {a.result_text}</>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {snapshot.budget && (
        <section className="space-y-2 break-inside-avoid-page">
          <H className="text-lg font-semibold">Budget provisoire</H>
          <p className="font-medium">{budgetSentence(snapshot.budget.totals.overall)}</p>
          {snapshot.budget.lines.length > 0 && (
            <ul className="space-y-1 text-sm">
              {snapshot.budget.lines.map((l, i) => (
                <li key={`${l.label}-${i}`}>
                  <strong>{l.label}</strong> ({l.category_label}) :{' '}
                  {l.quantity !== null ? `${formatDecimal(l.quantity)} ${l.unit_label}` : 'quantité manquante'} ×{' '}
                  {l.unit_price !== null ? formatFcfa(l.unit_price) : 'prix manquant'} ={' '}
                  {l.amount !== null ? formatFcfa(l.amount) : 'montant manquant'}
                  {l.already_owned && ' (déjà détenu, non compté)'}
                  {l.price_status === 'estime' && ' (estimé)'}
                  {l.source && <span className="text-muted"> — source : {l.source}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
