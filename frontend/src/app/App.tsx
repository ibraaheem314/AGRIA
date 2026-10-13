import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { BudgetPage } from '../features/budget/BudgetPage'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { DossierLayout } from '../features/dossiers/DossierLayout'
import { DossiersPage, HomeRedirect } from '../features/dossiers/DossiersPage'
import { FactEditPage } from '../features/dossiers/FactEditPage'
import { NewProjectPage } from '../features/dossiers/NewProjectPage'
import { OnboardingPage } from '../features/dossiers/OnboardingPage'
import { ProjectPage } from '../features/dossiers/ProjectPage'
import { StepByStepPage } from '../features/dossiers/StepByStepPage'
import { SubjectPage } from '../features/dossiers/SubjectPage'
import { TodayPage } from '../features/dossiers/TodayPage'
import { HelpPage } from '../features/help/HelpPage'
import { RelecturePage } from '../features/reviews/RelecturePage'
import { SynthesePage } from '../features/reviews/SynthesePage'
import { ActionPage } from '../features/plan/ActionPage'
import { PlanPage } from '../features/plan/PlanPage'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { RequireAuth } from './RequireAuth'

// Routeur « data » : nécessaire pour intercepter toute navigation (liens, retour du
// navigateur) quand une saisie n'est pas enregistrée (voir shared/unsaved.tsx).
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/aide" element={<HelpPage />} />
      <Route element={<RequireAuth />}>
        <Route index element={<HomeRedirect />} />
        <Route path="/dossiers" element={<DossiersPage />} />
        <Route path="/projets/nouveau" element={<NewProjectPage />} />
        <Route path="/d/:dossierId" element={<DossierLayout />}>
          <Route index element={<TodayPage />} />
          <Route path="demarrer" element={<OnboardingPage />} />
          <Route path="sujet/:subjectKey" element={<SubjectPage />} />
          <Route path="projet" element={<ProjectPage />} />
          <Route path="projet/pas-a-pas" element={<StepByStepPage />} />
          <Route path="projet/:factKey" element={<FactEditPage />} />
          <Route path="projet/budget" element={<BudgetPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="plan/:actionId" element={<ActionPage />} />
          <Route path="relecture" element={<RelecturePage />} />
          <Route path="synthese" element={<SynthesePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
)

export function App() {
  return <RouterProvider router={router} />
}
