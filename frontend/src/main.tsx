import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    // networkMode « always » : hors connexion, la requête échoue tout de suite avec un
    // message, au lieu d'être mise en pause en silence puis envoyée plus tard.
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 10_000, networkMode: 'always' },
    // Une écriture n'est jamais rejouée automatiquement : la reprise est explicite.
    mutations: { retry: false, networkMode: 'always' },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
