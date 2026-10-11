import { Link } from 'react-router'
import { PageTitle } from '../shared/ui'

export function NotFoundPage() {
  return (
    <div>
      <PageTitle>Page introuvable</PageTitle>
      <Link to="/" className="font-medium text-brand-700 underline">Retour à l’accueil</Link>
    </div>
  )
}
