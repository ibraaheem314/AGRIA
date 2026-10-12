import { useMemo } from 'react'
import { Link, Outlet, useOutletContext, useParams } from 'react-router'
import { computeChecks, PEOPLE, roleOf, type Check, type Dossier } from './data/model'
import { useDossier, useStore, type Viewer } from './data/store'
import { Button, Note, Panel, Skeleton } from './ui'

export type DossierCtx = {
  dossier: Dossier
  checks: Check[]
  viewer: Viewer
  role: 'porteur' | 'conseiller'
  /** Même règle que le serveur : seul le porteur d'un dossier non archivé modifie. */
  canEdit: boolean
  base: string
}

/** Charge le dossier de l'adresse, vérifie que le rôle choisi y a accès, simule chargement et erreur. */
export function DossierGate() {
  const { dossierId } = useParams()
  const dossier = useDossier(dossierId)
  const { viewer, sim, setSim } = useStore()
  const checks = useMemo(() => (dossier ? computeChecks(dossier) : []), [dossier])
  if (sim === 'chargement') return <Skeleton />
  if (sim === 'erreur') {
    return (
      <Panel>
        <h1 className="text-xl font-semibold">Dossier indisponible</h1>
        <p className="mt-1">Connexion au serveur impossible. Rien n'a été perdu : réessayez dans un instant.</p>
        <p className="mt-1 text-sm text-muted">État simulé par l'outil de démonstration ; dans l'application, le message vient de l'erreur réelle.</p>
        <Button className="mt-3" onClick={() => setSim('normal')}>Réessayer</Button>
      </Panel>
    )
  }
  const allowed = dossier && (dossier.owner === viewer || dossier.advisors.some((a) => a.id === viewer))
  if (!dossier || !allowed) {
    return (
      <Panel>
        <h1 className="text-xl font-semibold">Dossier introuvable pour ce rôle</h1>
        <p className="mt-1">
          Ce dossier n'existe pas ou n'est pas accessible à {PEOPLE[viewer].name}. Dans l'application, un porteur ne voit que ses
          dossiers et un conseiller ceux qui lui sont attribués.
        </p>
        <Link to="/" className="mt-3 inline-block font-medium text-brand-800 underline">Revenir à l'accueil de ce rôle</Link>
      </Panel>
    )
  }
  const role = roleOf(dossier, viewer)
  const ctx: DossierCtx = { dossier, checks, viewer, role, canEdit: role === 'porteur' && !dossier.archivedAt, base: `/d/${dossier.id}` }
  return (
    <>
      {dossier.archivedAt && (
        <div className="mb-4">
          <Note tone="neutral">Campagne archivée : consultation seulement. Les résultats affichés sont l'historique de cette campagne, pas des prévisions.</Note>
        </div>
      )}
      <Outlet context={ctx} />
    </>
  )
}

export function useDossierCtx(): DossierCtx {
  return useOutletContext<DossierCtx>()
}
