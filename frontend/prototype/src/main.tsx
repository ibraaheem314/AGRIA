import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import './proto.css'
import { useOwnDossier, useStore, StoreProvider } from './data/store'
import { DossierGate } from './dossier'
import { Shell } from './Shell'
import { About } from './pages/About'
import { AdvisorQueue } from './pages/AdvisorQueue'
import { Campaigns } from './pages/Campaigns'
import { CarryOver } from './pages/CarryOver'
import { ActionPage, ActionsPage } from './pages/Actions'
import { BudgetPage, LinePage } from './pages/Budget'
import { DossierHome } from './pages/DossierHome'
import { ExchangesPage } from './pages/Exchanges'
import { FactPage } from './pages/FactPage'
import { Onboarding } from './pages/Onboarding'
import { ReviewPage } from './pages/Review'
import { SubjectPage } from './pages/Subject'
import { AssistantPage } from './suivi/Assistant'
import { ActionPage as SuiviAction, ClarifyPage, FollowUpPage, ObservePage } from './suivi/Flows'
import { AboutDemo, BilanPage, CampaignHome, JournalPage, SuiviLayout } from './suivi/SuiviApp'

/** Accueil selon le rôle choisi dans le bandeau de démonstration. */
function Home() {
  const { viewer } = useStore()
  const own = useOwnDossier()
  if (viewer === 'ndiaye') return <Navigate to="/dossiers" replace />
  if (viewer === 'modou') return <Navigate to={own && !own.archivedAt ? `/d/${own.id}` : '/campagnes'} replace />
  return <Navigate to={own ? `/d/${own.id}` : '/demarrer'} replace />
}

function NotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <a href="/" className="font-medium text-brand-800 underline">Revenir à l'accueil</a>
    </div>
  )
}

const router = createBrowserRouter([
  // Démonstration du suivi de campagne : hors de l'enveloppe UX1 (pas de choix de rôle), état propre.
  {
    path: 'suivi',
    element: <SuiviLayout />,
    children: [
      { index: true, element: <CampaignHome /> },
      { path: 'observer', element: <ObservePage /> },
      { path: 'clarifier', element: <ClarifyPage /> },
      { path: 'action', element: <SuiviAction /> },
      { path: 'revoir/:problemId', element: <FollowUpPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'bilan', element: <BilanPage /> },
      { path: 'demander', element: <AssistantPage /> },
      { path: 'a-propos', element: <AboutDemo /> },
    ],
  },
  {
    // État fictif du prototype UX1/UX2 : monté seulement pour ses propres routes.
    element: (
      <StoreProvider>
        <Shell />
      </StoreProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'demarrer', element: <Onboarding /> },
      { path: 'campagnes', element: <Campaigns /> },
      { path: 'dossiers', element: <AdvisorQueue /> },
      { path: 'prototype', element: <About /> },
      {
        path: 'd/:dossierId',
        element: <DossierGate />,
        children: [
          { index: true, element: <DossierHome /> },
          { path: 'sujet/:subjectKey', element: <SubjectPage /> },
          { path: 'info/:factKey', element: <FactPage /> },
          { path: 'demarches', element: <ActionsPage /> },
          { path: 'demarches/:actionId', element: <ActionPage /> },
          { path: 'budget', element: <BudgetPage /> },
          { path: 'budget/poste/:lineId', element: <LinePage /> },
          { path: 'echanges', element: <ExchangesPage /> },
          { path: 'avis', element: <ReviewPage /> },
          { path: 'reprise', element: <CarryOver /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
