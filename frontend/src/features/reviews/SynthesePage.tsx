import { useState } from 'react'
import { Link } from 'react-router'
import { formatDateTime } from '../../shared/format'
import { Alert, Badge, Button, Card, Loading, PageTitle } from '../../shared/ui'
import { useCurrentDossier } from '../dossiers/DossierLayout'
import { useArchive, useSynthese } from './api'
import { SectionsView } from './SectionsView'

/** Synthèse imprimable : même version pour le porteur et le conseiller, inconnues comprises. */
export function SynthesePage() {
  const dossier = useCurrentDossier()
  const synthese = useSynthese(dossier.id)
  if (synthese.isPending) return <Loading label="Préparation de la synthèse…" />
  if (synthese.isError) return <Alert tone="danger" role="alert" title="Synthèse indisponible">{synthese.error.message}</Alert>
  const s = synthese.data
  const v = s.versions

  return (
    <article className="space-y-6">
      <div className="no-print flex flex-wrap gap-3">
        <Button onClick={() => window.print()}>Imprimer ou enregistrer en PDF</Button>
        <a
          href={`/api/dossiers/${dossier.id}/synthese?telecharger=1`}
          download
          className="inline-flex min-h-11 items-center rounded-md border border-brand-700 px-4 font-medium text-brand-800"
        >
          Télécharger (JSON)
        </a>
      </div>

      <PageTitle subtitle={`${s.dossier.project} — ${s.dossier.label} · porteur : ${s.dossier.owner.display_name}`}>
        Synthèse du dossier
      </PageTitle>
      {s.dossier.is_demo && <Alert tone="warn" title="Exemple de démonstration">Ce dossier est fictif.</Alert>}

      <Card>
        <p>
          <strong>État :</strong> {s.status.label}
        </p>
        <p className="mt-1 text-sm">
          Version : contexte v{v.contexte}, plan v{v.plan}, budget v{v.budget} · établie le {formatDateTime(s.generated_at)}
        </p>
        <p className="mt-1 text-sm">
          <strong>Conseiller :</strong>{' '}
          {s.advisors.length === 0 ? 'aucun conseiller attribué' : s.advisors.map((a) => a.display_name).join(', ')}
        </p>
        <p className="mt-2 text-sm text-muted">{s.notice}</p>
      </Card>

      <SectionsView snapshot={s} dossier={dossier} level={2} />

      <section className="space-y-2 break-inside-avoid-page">
        <h2 className="text-lg font-semibold">Avis du conseiller</h2>
        {s.reviews.length === 0 ? (
          <p className="text-muted">Aucun avis.</p>
        ) : (
          <ul className="space-y-3">
            {s.reviews.map((r) => (
              <li key={r.id} className="rounded-md border border-line p-3">
                <p className="font-medium">
                  {r.verdict_label}{' '}
                  {r.current ? <Badge tone="ok">À jour</Badge> : <Badge tone="warn">À réexaminer</Badge>}
                </p>
                <p className="text-sm text-muted">
                  {r.advisor.display_name} · {formatDateTime(r.created_at)} · périmètre : {r.scope_labels.join(', ')} · version
                  examinée : contexte v{r.versions.contexte}, plan v{r.versions.plan}, budget v{r.versions.budget}
                </p>
                {!r.current && <p className="text-sm text-warn-700">Modifié depuis : {r.stale_sections.join(', ')}.</p>}
                <p className="mt-1 whitespace-pre-line">{r.opinion}</p>
                {r.reservations && <p className="mt-1 whitespace-pre-line"><strong>Réserves :</strong> {r.reservations}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2 break-inside-avoid-page">
        <h2 className="text-lg font-semibold">Questions ouvertes</h2>
        {s.open_questions.length === 0 ? (
          <p className="text-muted">Aucune question ouverte.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {s.open_questions.map((q) => (
              <li key={q.id}>{q.body}{q.target_label && <span className="text-muted"> ({q.target_label})</span>} — {q.author.display_name}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2 break-inside-avoid-page">
        <h2 className="text-lg font-semibold">Décisions</h2>
        {s.decisions.length === 0 ? (
          <p className="text-muted">Aucune décision enregistrée.</p>
        ) : (
          <ul className="space-y-1">
            {s.decisions.map((d) => (
              <li key={d.id}>
                <strong>{d.choice_label}</strong> ({formatDateTime(d.created_at)}, {d.author.display_name}) : {d.reason}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dossier.role === 'porteur' && !dossier.archived && <ArchiveBox dossierId={dossier.id} />}
      <p className="no-print">
        <Link to={`/d/${dossier.id}/relecture`} className="text-brand-700 underline">← Relecture et échanges</Link>
      </p>
    </article>
  )
}

function ArchiveBox({ dossierId }: { dossierId: number }) {
  const archive = useArchive(dossierId)
  const [confirming, setConfirming] = useState(false)
  return (
    <Card className="no-print">
      <h2 className="font-semibold">Archiver le dossier</h2>
      <p className="mt-1 text-sm text-muted">Un dossier archivé reste consultable mais n'est plus modifiable.</p>
      {archive.error && <Alert tone="danger" role="alert">{archive.error.message}</Alert>}
      {!confirming ? (
        <Button variant="danger" className="mt-2" onClick={() => setConfirming(true)}>Archiver…</Button>
      ) : (
        <div className="mt-2 flex gap-2">
          <Button variant="danger" busy={archive.isPending} onClick={() => archive.mutate({})}>Confirmer l'archivage</Button>
          <Button variant="ghost" onClick={() => setConfirming(false)}>Annuler</Button>
        </div>
      )}
    </Card>
  )
}
