import { BrowserRouter, Route, Routes } from 'react-router'
import { BudgetPage } from '../features/budget/BudgetPage'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { DossierLayout } from '../features/dossiers/DossierLayout'
import { DossiersPage, HomeRedirect } from '../features/dossiers/DossiersPage'
import { FactEditPage } from '../features/dossiers/FactEditPage'
import { NewProjectPage } from '../features/dossiers/NewProjectPage'
import { ProjectPage } from '../features/dossiers/ProjectPage'
import { TodayPage } from '../features/dossiers/TodayPage'
import { HelpPage } from '../features/help/HelpPage'
import { RelecturePage } from '../features/reviews/RelecturePage'
import { SynthesePage } from '../features/reviews/SynthesePage'
import { ActionPage } from '../features/plan/ActionPage'
import { PlanPage } from '../features/plan/PlanPage'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { RequireAuth } from './RequireAuth'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
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
              <Route path="projet" element={<ProjectPage />} />
              <Route path="projet/:factKey" element={<FactEditPage />} />
              <Route path="projet/budget" element={<BudgetPage />} />
              <Route path="plan" element={<PlanPage />} />
              <Route path="plan/:actionId" element={<ActionPage />} />
              <Route path="relecture" element={<RelecturePage />} />
              <Route path="synthese" element={<SynthesePage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
