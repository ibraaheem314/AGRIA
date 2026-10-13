import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Link, Outlet, useLocation, useMatch, useNavigate } from 'react-router'
import { useLogout, useMe } from '../features/auth/session'
import { useDossiers } from '../features/dossiers/api'
import { forgetDossier, lastDossier } from '../features/dossiers/lastDossier'
import { words } from '../features/dossiers/roles'
import { UnsavedChangesProvider, useConfirmLeave } from '../shared/unsaved'

/** En-tête, navigation principale par espace (porteur : Projet · Démarches · Budget · Conseiller · Aide) et contenu. */
function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

/** Indication du navigateur : utile pour prévenir, pas une garantie de connexion. */
function useOnline() {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true)
}

export function AppLayout() {
  return (
    <UnsavedChangesProvider>
      <Layout />
    </UnsavedChangesProvider>
  )
}

function Layout() {
  const confirmLeave = useConfirmLeave()
  const me = useMe()
  const online = useOnline()
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const lastPath = useRef(location.pathname)

  // Après une navigation (pas au premier affichage), le focus va au contenu (lecteurs d'écran, clavier).
  useEffect(() => {
    if (lastPath.current === location.pathname) return
    lastPath.current = location.pathname
    // Une adresse avec ancre place le focus sur sa cible (voir shared/hash.ts).
    if (location.hash) return
    mainRef.current?.focus()
  }, [location.pathname, location.hash])
  const logout = useLogout()
  const navigate = useNavigate()
  const match = useMatch('/d/:dossierId/*')
  const dossierId = match?.params.dossierId ?? lastDossier()?.toString()
  const user = me.data?.user
  const dossiers = useDossiers({ enabled: Boolean(user) })
  // Le conseiller consulte le dossier d'un autre : libellés adaptés, même structure.
  const current = dossiers.data?.find((d) => String(d.id) === dossierId)
  const w = words(current ?? { role: 'porteur', archived: false })

  const advisor = current?.role === 'conseiller'
  const base = `/d/${dossierId}`
  const path = location.pathname
  // Lien actif selon l'espace : la synthèse, les sujets et les informations relèvent de « Projet ».
  const links: { to: string; label: string; active: boolean }[] = dossierId
    ? advisor
      ? [
          { to: base, label: w.homeNav, active: path === base },
          { to: `${base}/projet`, label: w.projectNav, active: path.startsWith(`${base}/projet`) || path.startsWith(`${base}/sujet`) },
          { to: `${base}/plan`, label: w.planNav, active: path.startsWith(`${base}/plan`) },
          { to: `${base}/relecture`, label: w.exchangesNav, active: path.startsWith(`${base}/relecture`) || path.startsWith(`${base}/synthese`) },
          { to: '/aide', label: 'Aide', active: path === '/aide' },
        ]
      : [
          {
            to: base,
            label: w.homeNav,
            active: path === base || path.startsWith(`${base}/sujet`) || path.startsWith(`${base}/demarrer`) ||
              (path.startsWith(`${base}/projet`) && !path.startsWith(`${base}/projet/budget`)),
          },
          { to: `${base}/plan`, label: w.planNav, active: path.startsWith(`${base}/plan`) },
          { to: `${base}/projet/budget`, label: 'Budget', active: path.startsWith(`${base}/projet/budget`) },
          { to: `${base}/relecture`, label: w.exchangesNav, active: path.startsWith(`${base}/relecture`) || path.startsWith(`${base}/synthese`) },
          { to: '/aide', label: 'Aide', active: path === '/aide' },
        ]
    : [{ to: '/aide', label: 'Aide', active: path === '/aide' }]

  return (
    <div className="min-h-dvh pb-20 sm:pb-0">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        Aller au contenu
      </a>
      <header className="no-print border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-brand-700">AGRIA</Link>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <Link to="/dossiers" className="text-brand-700 underline">Mes dossiers</Link>
              <span className="hidden text-muted sm:inline">{user.display_name}</span>
              <button
                type="button"
                className="min-h-11 rounded-md px-2 text-brand-800 underline"
                onClick={() =>
                  confirmLeave(() =>
                    logout.mutate(undefined, {
                      onSuccess: () => {
                        forgetDossier()
                        navigate('/connexion')
                      },
                    }),
                  )
                }
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
        {user && (
          <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface sm:static sm:border-t-0">
            <ul className="mx-auto flex max-w-5xl">
              {links.map((link) => (
                <li key={link.to} className="flex-1 sm:flex-none">
                  <Link
                    to={link.to}
                    aria-current={link.active ? 'page' : undefined}
                    className={`flex min-h-12 items-center justify-center whitespace-nowrap border-t-4 px-1 text-sm font-medium sm:border-b-4 sm:border-t-0 sm:px-4 ${
                      link.active ? 'border-brand-700 text-brand-800' : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      {!online && (
        <div role="status" className="no-print border-b border-warn-700/30 bg-warn-50 px-4 py-2 text-center text-sm text-warn-700">
          Vous semblez hors connexion : rien ne pourra être enregistré avant le retour du réseau. Votre saisie reste à l'écran.
        </div>
      )}
      <main id="contenu" ref={mainRef} tabIndex={-1} className="mx-auto max-w-5xl px-4 py-6 focus:outline-none">
        {logout.isError && (
          <p role="alert" className="mb-4 text-danger-700">Déconnexion impossible : {logout.error.message}</p>
        )}
        <Outlet />
      </main>
    </div>
  )
}
