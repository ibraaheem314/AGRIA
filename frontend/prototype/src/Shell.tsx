import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatch, useNavigate, useNavigationType } from 'react-router'
import { UnsavedChangesProvider, useConfirmLeave } from '../../src/shared/unsaved'
import { pendingRequest, PEOPLE, questionState, staleSections } from './data/model'
import { useOwnDossier, useStore, type Sim, type Viewer } from './data/store'

const ROLES: { value: Viewer; label: string }[] = [
  { value: 'awa', label: 'Awa — débutante' },
  { value: 'modou', label: 'Modou — producteur' },
  { value: 'ndiaye', label: 'Mme Ndiaye — conseillère' },
]

/** Bandeau de démonstration : il n'appartient pas au produit (pas de choix de rôle dans l'application). */
function DemoBar() {
  const { viewer, setViewer, state, ops, sim, setSim } = useStore()
  const navigate = useNavigate()
  const confirmLeave = useConfirmLeave()
  const [confirmReset, setConfirmReset] = useState(false)
  const awaDossier = state.dossiers.find((d) => d.owner === 'awa')
  return (
    <div className="no-print bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 text-sm">
        <p className="font-semibold">
          Prototype<span className="hidden sm:inline"> UX1</span> <span className="font-normal text-white/80">· fictif<span className="hidden md:inline"> : données gardées dans ce navigateur, rien n'est envoyé</span></span>
        </p>
        <label className="flex items-center gap-1.5">
          <span className="text-white/80">Voir comme</span>
          <select
            className="min-h-9 rounded-md border border-white/30 bg-ink px-1.5 py-1 text-white"
            value={viewer}
            onChange={(e) => {
              const v = e.target.value as Viewer
              confirmLeave(() => {
                setViewer(v)
                navigate('/')
              })
            }}
          >
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <details className="relative open:w-full sm:open:w-auto">
          <summary className="flex min-h-9 cursor-pointer items-center rounded-md px-1 underline underline-offset-2">Outils<span className="hidden sm:inline">&nbsp;de démonstration</span></summary>
          <div className="mt-2 w-full space-y-4 rounded-xl bg-surface p-4 text-ink shadow-lg ring-1 ring-line sm:absolute sm:left-0 sm:top-full sm:z-30 sm:w-[22rem]">
            <div>
              <p className="font-semibold">Attribution d'un conseiller</p>
              <p className="text-sm text-muted">Dans le produit, l'équipe AGRIA attribue un conseiller par une commande d'exploitation, hors de l'application.</p>
              {awaDossier && awaDossier.advisors.length === 0 ? (
                <button type="button" className="mt-2 rounded-lg px-3 py-2 font-medium text-brand-800 ring-1 ring-brand-700/60" onClick={() => ops.assignAdvisor(awaDossier.id)}>
                  Attribuer Mme Ndiaye au dossier d'Awa
                </button>
              ) : (
                <p className="mt-1 text-sm">{awaDossier ? 'Mme Ndiaye est attribuée au dossier d’Awa.' : 'Awa n’a pas encore de dossier.'}</p>
              )}
            </div>
            <fieldset>
              <legend className="font-semibold">Afficher l'état du dossier</legend>
              {(['normal', 'chargement', 'erreur'] as Sim[]).map((s) => (
                <label key={s} className="mt-1 flex items-center gap-2">
                  <input type="radio" name="sim" className="size-4 accent-brand-700" checked={sim === s} onChange={() => setSim(s)} />
                  {s === 'normal' ? 'Normal' : s === 'chargement' ? 'Chargement (simulé)' : 'Erreur de connexion (simulée)'}
                </label>
              ))}
            </fieldset>
            <div>
              <p className="font-semibold">Revenir à l'état initial</p>
              {!confirmReset ? (
                <button type="button" className="mt-2 rounded-lg px-3 py-2 font-medium text-danger-700 ring-1 ring-danger-700/60" onClick={() => setConfirmReset(true)}>
                  Réinitialiser la démonstration
                </button>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="rounded-lg bg-danger-700 px-3 py-2 font-medium text-white" onClick={() => { ops.reset(); setSim('normal'); setConfirmReset(false); navigate('/') }}>
                    Confirmer : tout effacer
                  </button>
                  <button type="button" className="rounded-lg px-3 py-2 font-medium" onClick={() => setConfirmReset(false)}>Annuler</button>
                </div>
              )}
            </div>
            <Link to="/prototype" className="block font-medium text-brand-800 underline">Comment fonctionne ce prototype</Link>
          </div>
        </details>
      </div>
    </div>
  )
}

type NavItem = { to: string; label: string; end?: boolean; badge?: number }

function useNav(): NavItem[] {
  const { viewer, state } = useStore()
  const own = useOwnDossier()
  const inDossier = useMatch('/d/:dossierId/*')
  if (viewer === 'ndiaye') {
    const id = inDossier?.params.dossierId
    const d = state.dossiers.find((x) => x.id === id)
    const items: NavItem[] = [{ to: '/dossiers', label: 'Dossiers', end: true }]
    if (d && d.owner !== viewer) {
      const waiting = d.threads.filter((m) => questionState(d, m, 'conseiller') === 'a_repondre').length
      items.push(
        { to: `/d/${d.id}`, label: 'Vue d’ensemble', end: true },
        { to: `/d/${d.id}/demarches`, label: 'Démarches' },
        { to: `/d/${d.id}/echanges`, label: 'Échanges et avis', badge: waiting || undefined },
      )
    }
    return items
  }
  if (!own) return []
  const waiting = own.threads.filter((m) => questionState(own, m, 'porteur') === 'a_repondre').length
  const items: NavItem[] = [
    { to: `/d/${own.id}`, label: 'Projet', end: true },
    { to: `/d/${own.id}/demarches`, label: 'Démarches' },
    { to: `/d/${own.id}/budget`, label: 'Budget' },
    { to: `/d/${own.id}/echanges`, label: 'Conseiller', badge: waiting || undefined },
  ]
  if (viewer === 'modou') items.push({ to: '/campagnes', label: 'Campagnes', end: true })
  return items
}

function NavLinks({ items, layout }: { items: NavItem[]; layout: 'side' | 'bottom' }) {
  return (
    <ul className={layout === 'side' ? 'space-y-1' : 'flex'}>
      {items.map((it) => (
        <li key={it.to} className={layout === 'bottom' ? 'flex-1' : ''}>
          <NavLink
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              layout === 'side'
                ? `flex min-h-11 items-center justify-between rounded-lg px-3 font-medium ${isActive ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-700/30' : 'text-ink hover:bg-canvas'}`
                : `flex min-h-14 flex-col items-center justify-center px-1 text-xs font-medium ${isActive ? 'text-brand-800' : 'text-muted'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={layout === 'bottom' && isActive ? 'border-b-2 border-brand-700 pb-0.5' : ''}>{it.label}</span>
                {it.badge ? (
                  <span className="rounded-full bg-warn-700 px-1.5 text-xs font-semibold text-white" aria-label={`${it.badge} en attente de votre réponse`}>
                    {it.badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function Header() {
  const { viewer, state } = useStore()
  const own = useOwnDossier()
  const inDossier = useMatch('/d/:dossierId/*')
  const d = state.dossiers.find((x) => x.id === inDossier?.params.dossierId) ?? (viewer !== 'ndiaye' ? own : null)
  const person = PEOPLE[viewer]
  const advisorView = viewer === 'ndiaye' && d && d.owner !== viewer
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:py-3">
        <div className="min-w-0">
          <Link to="/" className="text-lg font-bold tracking-tight text-brand-700">AGRIA</Link>
          {d && (
            <p className="truncate text-sm text-muted">
              {advisorView ? `Dossier de ${PEOPLE[d.owner].name} · ` : ''}
              {d.projectName} · {d.campaign}
            </p>
          )}
        </div>
        <p className="hidden shrink-0 text-right text-sm sm:block">
          <span className="block font-medium">{person.name}</span>
          <span className="text-muted">{person.role === 'conseiller' ? 'Conseillère' : person.profile === 'producteur' ? 'Producteur' : 'Débutante'}</span>
        </p>
      </div>
    </header>
  )
}

export function Shell() {
  return (
    <UnsavedChangesProvider>
      <ShellInner />
    </UnsavedChangesProvider>
  )
}

function ShellInner() {
  const nav = useNav()
  const location = useLocation()
  const flash = (location.state as { flash?: string } | null)?.flash
  const mainRef = useRef<HTMLElement>(null)
  const last = useRef(location.pathname)
  const navType = useNavigationType()
  useEffect(() => {
    if (last.current === location.pathname) return
    last.current = location.pathname
    // Une redirection (accueil vers la page du rôle) n'est pas une navigation de la personne.
    if (location.hash || navType === 'REPLACE') return
    mainRef.current?.focus()
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash, navType])
  return (
    <div className="min-h-dvh pb-20 lg:pb-0">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        Aller au contenu
      </a>
      <DemoBar />
      <Header />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-4 sm:py-6">
        {nav.length > 0 && (
          <nav aria-label="Navigation principale" className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-4"><NavLinks items={nav} layout="side" /></div>
          </nav>
        )}
        <main id="contenu" ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {flash && <p role="status" className="mb-4 rounded-lg bg-ok-50 px-4 py-3 font-medium text-ok-700 ring-1 ring-ok-700/30">{flash}</p>}
          <Outlet />
        </main>
      </div>
      {nav.length > 0 && (
        <nav aria-label="Navigation principale (mobile)" className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface lg:hidden">
          <NavLinks items={nav} layout="bottom" />
        </nav>
      )}
    </div>
  )
}

/** Indicateurs utiles à la file du conseiller (même calcul que les compteurs de l'application). */
export function advisorReasons(d: import('./data/model').Dossier) {
  const toAnswer = d.threads.filter((m) => questionState(d, m, 'conseiller') === 'a_repondre').length
  const request = pendingRequest(d)
  const last = d.reviews[d.reviews.length - 1]
  const stale = last ? staleSections(d, last) : []
  return { toAnswer, request, stale }
}
