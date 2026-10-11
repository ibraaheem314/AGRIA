import { Link, NavLink, Outlet, useMatch, useNavigate } from 'react-router'
import { useLogout, useMe } from '../features/auth/session'
import { forgetDossier, lastDossier } from '../features/dossiers/lastDossier'

/** En-tête, navigation principale (Aujourd'hui · Mon projet · Mon plan · Aide) et contenu. */
export function AppLayout() {
  const me = useMe()
  const logout = useLogout()
  const navigate = useNavigate()
  const match = useMatch('/d/:dossierId/*')
  const dossierId = match?.params.dossierId ?? lastDossier()?.toString()
  const user = me.data?.user

  const links = dossierId
    ? [
        { to: `/d/${dossierId}`, label: 'Aujourd’hui', end: true },
        { to: `/d/${dossierId}/projet`, label: 'Mon projet', end: false },
        { to: '/aide', label: 'Aide', end: true },
      ]
    : [{ to: '/aide', label: 'Aide', end: true }]

  return (
    <div className="min-h-dvh pb-20 sm:pb-0">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        Aller au contenu
      </a>
      <header className="no-print border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-brand-700">AGRIA</Link>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <Link to="/dossiers" className="text-brand-700 underline">Mes dossiers</Link>
              <span className="hidden text-muted sm:inline">{user.display_name}</span>
              <button
                type="button"
                className="min-h-11 rounded-md px-2 text-brand-800 underline"
                onClick={() =>
                  logout.mutate(undefined, {
                    onSuccess: () => {
                      forgetDossier()
                      navigate('/connexion')
                    },
                  })
                }
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
        {user && (
          <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface sm:static sm:border-t-0">
            <ul className="mx-auto flex max-w-3xl">
              {links.map((link) => (
                <li key={link.to} className="flex-1 sm:flex-none">
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center justify-center border-t-4 px-4 text-sm font-medium sm:border-b-4 sm:border-t-0 ${
                        isActive ? 'border-brand-700 text-brand-800' : 'border-transparent text-muted hover:text-ink'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <main id="contenu" className="mx-auto max-w-3xl px-4 py-6">
        {logout.isError && (
          <p role="alert" className="mb-4 text-danger-700">Déconnexion impossible : {logout.error.message}</p>
        )}
        <Outlet />
      </main>
    </div>
  )
}
