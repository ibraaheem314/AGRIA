import { Link } from 'react-router'
import { advisorReasons } from '../Shell'
import { formatDay, PEOPLE, questionState, SECTION_LABEL, type Dossier } from '../data/model'
import { useStore } from '../data/store'
import { Chip, PageHeader, SectionTitle } from '../ui'

/** File de travail du conseiller : quel dossier demande une intervention, et pourquoi. */
export function AdvisorQueue() {
  const { state, viewer } = useStore()
  const mine = state.dossiers.filter((d) => d.advisors.some((a) => a.id === viewer))
  const active = mine.filter((d) => !d.archivedAt)
  const todo = active.filter((d) => { const r = advisorReasons(d); return r.toAnswer > 0 || r.request || r.stale.length > 0 })
  const waiting = active.filter((d) => !todo.includes(d) && d.threads.some((m) => questionState(d, m, 'conseiller') === 'en_attente'))
  const calm = active.filter((d) => !todo.includes(d) && !waiting.includes(d))
  const archived = mine.filter((d) => d.archivedAt)
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={PEOPLE[viewer].name} title="Dossiers attribués">
        Les dossiers qui attendent une intervention de votre part apparaissent en premier, avec la raison.
      </PageHeader>
      <Group id="todo" title={`À traiter (${todo.length})`} items={todo} empty="Aucun dossier n'attend d'intervention de votre part." />
      {waiting.length > 0 && <Group id="attente" title={`En attente du porteur (${waiting.length})`} items={waiting} />}
      {calm.length > 0 && <Group id="calme" title={`Sans intervention attendue (${calm.length})`} items={calm} />}
      {archived.length > 0 && <Group id="archives" title={`Campagnes archivées (${archived.length})`} items={archived} />}
      {mine.length === 0 && <p className="text-muted">Aucun dossier ne vous est attribué.</p>}
    </div>
  )
}

function Group({ id, title, items, empty }: { id: string; title: string; items: Dossier[]; empty?: string }) {
  return (
    <section aria-labelledby={id}>
      <SectionTitle id={id}>{title}</SectionTitle>
      {items.length === 0 ? <p className="text-muted">{empty}</p> : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
          {items.map((d) => {
            const r = advisorReasons(d)
            const waiting = d.threads.filter((m) => questionState(d, m, 'conseiller') === 'en_attente').length
            return (
              <li key={d.id}>
                <Link to={`/d/${d.id}`} className="block px-4 py-4 hover:bg-canvas sm:px-5">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-brand-800 underline underline-offset-2">{PEOPLE[d.owner].name} — {d.projectName}</span>
                    <span className="text-sm text-muted">{d.campaign} · {d.profile === 'producteur' ? 'producteur' : 'débutant'} · modifié le {formatDay(d.updatedAt)}</span>
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {d.archivedAt && <Chip tone="neutral">Archivée</Chip>}
                    {!d.archivedAt && r.toAnswer > 0 && <Chip tone="warn">{r.toAnswer === 1 ? 'Question du porteur en attente de votre réponse' : `${r.toAnswer} questions en attente de votre réponse`}</Chip>}
                    {!d.archivedAt && r.request && <Chip tone="warn">Relecture demandée le {formatDay(r.request.at)}</Chip>}
                    {!d.archivedAt && !r.request && r.stale.length > 0 && <Chip tone="warn">Avis à réexaminer : {r.stale.map((s) => SECTION_LABEL[s].toLowerCase()).join(', ')} modifié</Chip>}
                    {!d.archivedAt && waiting > 0 && <Chip tone="neutral">Vous attendez une réponse du porteur</Chip>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
