import { useState } from 'react'
import { useNavigate } from 'react-router'
import { formatDay, OUTCOME_LABEL } from '../data/model'
import { useStore } from '../data/store'
import { Button, Chip, Field, Highlight, input, PageHeader, SectionTitle, TextLink } from '../ui'

/** Producteur : ses campagnes, et la préparation de la suivante à partir de la précédente. */
export function Campaigns() {
  const { state, viewer, ops } = useStore()
  const navigate = useNavigate()
  const own = state.dossiers.filter((d) => d.owner === viewer)
  const active = own.find((d) => !d.archivedAt)
  const archived = own.filter((d) => d.archivedAt)
  const last = archived[archived.length - 1]
  const [label, setLabel] = useState('Contre-saison 2027')
  return (
    <div className="space-y-8">
      <PageHeader title="Mes campagnes">Chaque campagne a son dossier. Une campagne archivée reste consultable ; elle ne se modifie plus.</PageHeader>
      {!active && last && (
        <Highlight eyebrow="Prochaine campagne" title={`Préparer la suite de « ${last.campaign} »`}>
          <p>Le lieu, le terrain et l'eau sont repris, à reconfirmer. Démarches, résultats et budget ne sont pas recopiés : ils restent consultables dans la campagne précédente.</p>
          <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); if (!label.trim()) return; const id = ops.startNextCampaign(last.id, label.trim()); navigate(`/d/${id}/reprise`) }}>
            <div className="min-w-56 flex-1 text-ink [&_label]:text-white [&_p]:text-brand-100">
              <Field label="Nom de la nouvelle campagne">{(p) => <input {...p} className={input} value={label} onChange={(e) => setLabel(e.target.value)} />}</Field>
            </div>
            <Button type="submit" variant="onDark">Créer et voir ce qui est repris</Button>
          </form>
        </Highlight>
      )}
      {active && (
        <section aria-labelledby="active">
          <SectionTitle id="active">Campagne en préparation</SectionTitle>
          <p><TextLink to={`/d/${active.id}`}>{active.projectName} — {active.campaign}</TextLink></p>
        </section>
      )}
      <section aria-labelledby="archives">
        <SectionTitle id="archives">Campagnes archivées</SectionTitle>
        <ul className="divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
          {archived.map((d) => (
            <li key={d.id} className="px-4 py-4">
              <p className="flex flex-wrap items-center gap-2"><TextLink to={`/d/${d.id}`}>{d.projectName} — {d.campaign}</TextLink><Chip tone="neutral">Archivée le {formatDay(d.archivedAt!)}</Chip></p>
              <p className="mt-1 text-sm text-muted">
                Résultats notés : {d.actions.filter((a) => a.result).map((a) => `${a.title} (${OUTCOME_LABEL[a.result!.outcome].toLowerCase()})`).join(' · ') || 'aucun'}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
