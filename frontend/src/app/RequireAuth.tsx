import { Navigate, Outlet, useLocation } from 'react-router'
import { useMe } from '../features/auth/session'
import { Alert, Loading } from '../shared/ui'

/** Confort d'affichage uniquement : les données sont protégées par le serveur. */
export function RequireAuth() {
  const me = useMe()
  const location = useLocation()
  if (me.isPending) return <Loading />
  if (me.isError) {
    return (
      <Alert tone="danger" role="alert" title="Serveur injoignable">
        <p>{me.error.message}</p>
        <button type="button" className="mt-2 font-medium underline" onClick={() => me.refetch()}>Réessayer</button>
      </Alert>
    )
  }
  if (!me.data.user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  return <Outlet />
}
