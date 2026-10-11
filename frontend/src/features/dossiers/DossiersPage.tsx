import { Link, Navigate } from 'react-router'
import { formatDateTime } from '../../shared/format'
import { Alert, Badge, ButtonLink, Card, Loading, PageTitle } from '../../shared/ui'
import { useDossiers, type DossierSummary } from './api'
import { lastDossier } from './lastDossier'

/** Accueil après connexion : ouvre le dossier en cours, ou propose d'en créer un. */
export function HomeRedirect() {
  const dossiers = useDossiers()
  if (dossiers.isPending) return <Loading />
  if (dossiers.isError) return <Alert tone="danger" role="alert">{dossiers.error.message}</Alert>
  const list = dossiers.data
  if (list.length === 0) return <Welcome />
  const last = lastDossier()
  const target = list.find((d) => d.id === last) ?? (list.length === 1 ? list[0] : undefined)
  if (target) return <Navigate to={`/d/${target.id}`} replace />
  return <Navigate to="/dossiers" replace />
}

function Welcome() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <PageTitle>Bienvenue</PageTitle>
      <Card>
        <p>
          AGRIA vous aide à préparer votre prochaine campagne : rassembler ce que vous savez, repérer ce qu'il faut
          vérifier, organiser les démarches et le budget, puis en parler avec un conseiller.
        </p>
        <p className="mt-2 text-sm text-muted">
          AGRIA ne garantit ni la faisabilité ni la rentabilité d'un projet, et ne remplace pas un conseil local.
        </p>
        <ButtonLink to="/projets/nouveau" className="mt-4">Commencer un projet</ButtonLink>
      </Card>
    </div>
  )
}

export function DossiersPage() {
  const dossiers = useDossiers()
  if (dossiers.isPending) return <Loading />
  if (dossiers.isError) return <Alert tone="danger" role="alert">{dossiers.error.message}</Alert>
  const own = dossiers.data.filter((d) => d.role === 'porteur')
  const assigned = dossiers.data.filter((d) => d.role === 'conseiller')
  return (
    <div className="space-y-6">
      <PageTitle>Mes dossiers</PageTitle>
      {own.length > 0 && <DossierList title="Mes projets" items={own} />}
      {assigned.length > 0 && <DossierList title="Dossiers qui me sont attribués" items={assigned} />}
      {dossiers.data.length === 0 && <p className="text-muted">Aucun dossier pour le moment.</p>}
      <ButtonLink to="/projets/nouveau" variant="secondary">Nouveau projet</ButtonLink>
    </div>
  )
}

function DossierList({ title, items }: { title: string; items: DossierSummary[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="space-y-2">
        {items.map((d) => (
          <Card as="li" key={d.id}>
            <Link to={`/d/${d.id}`} className="font-medium text-brand-700 underline">
              {d.project.name} — {d.label}
            </Link>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              {d.project.profile_label} · modifié le {formatDateTime(d.updated_at)}
              {d.role === 'conseiller' && <> · porteur : {d.project.owner.display_name}</>}
              {d.project.is_demo && <Badge tone="warn">Démonstration</Badge>}
              {d.archived && <Badge>Archivé</Badge>}
            </p>
          </Card>
        ))}
      </ul>
    </section>
  )
}
