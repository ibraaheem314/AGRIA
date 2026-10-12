import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useBlocker, useLocation } from 'react-router'
import { Button } from './ui'

/**
 * Protection des saisies non enregistrées.
 *
 * Chaque formulaire déclare s'il contient des modifications (`useUnsavedChanges(dirty)`).
 * Tant qu'une modification existe, quitter la page (lien, menu, retour du navigateur,
 * déconnexion) demande une confirmation, et le rechargement ou la fermeture déclenchent
 * l'avertissement du navigateur. Rien n'est enregistré localement : seul le serveur
 * enregistre, et seulement quand on clique sur « Enregistrer ».
 */

type Ctx = {
  setDirty: (id: string, dirty: boolean) => void
  allowNextNavigation: () => void
  confirmLeave: (action: () => void) => void
}

const UnsavedContext = createContext<Ctx | null>(null)

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const dirtyIds = useRef(new Set<string>())
  const allowOnce = useRef(false)
  // Action différée (ex. déconnexion) en attente de confirmation.
  const [deferred, setDeferred] = useState<{ run: () => void } | null>(null)
  const location = useLocation()

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (allowOnce.current) return false
    return dirtyIds.current.size > 0 && currentLocation.pathname !== nextLocation.pathname
  })

  // Une autorisation ponctuelle (après un enregistrement réussi) ne vaut que pour une navigation.
  useEffect(() => {
    allowOnce.current = false
  }, [location.pathname])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirtyIds.current.size === 0) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  const setDirty = useCallback((id: string, dirty: boolean) => {
    if (dirty) dirtyIds.current.add(id)
    else dirtyIds.current.delete(id)
  }, [])

  const allowNextNavigation = useCallback(() => {
    allowOnce.current = true
  }, [])

  const confirmLeave = useCallback((action: () => void) => {
    if (dirtyIds.current.size === 0) action()
    else setDeferred({ run: action })
  }, [])

  const onProceed = useCallback(() => {
    dirtyIds.current.clear()
    if (deferred) {
      setDeferred(null)
      deferred.run()
    } else {
      blocker.proceed?.()
    }
  }, [blocker, deferred])

  const onCancel = useCallback(() => {
    if (deferred) setDeferred(null)
    else blocker.reset?.()
  }, [blocker, deferred])

  const open = deferred !== null || blocker.state === 'blocked'

  return (
    <UnsavedContext.Provider value={{ setDirty, allowNextNavigation, confirmLeave }}>
      {children}
      {open && <LeaveDialog onProceed={onProceed} onCancel={onCancel} />}
    </UnsavedContext.Provider>
  )
}

function LeaveDialog({ onProceed, onCancel }: { onProceed: () => void; onCancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby="quitter-titre"
      aria-describedby="quitter-texte"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      className="m-auto max-w-md rounded-lg border border-line bg-surface p-5 text-ink backdrop:bg-black/40"
    >
      <h2 id="quitter-titre" className="text-lg font-semibold">Modifications non enregistrées</h2>
      <p id="quitter-texte" className="mt-2">
        Ce que vous avez saisi sur cette page n'est pas enregistré. Si vous quittez maintenant, ces saisies seront perdues.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button autoFocus onClick={onCancel}>Rester sur la page</Button>
        <Button variant="danger" onClick={onProceed}>Quitter sans enregistrer</Button>
      </div>
    </dialog>
  )
}

/** Déclare l'état « modifié » d'un formulaire. `allowNextNavigation` : à appeler juste avant
 * une navigation qui suit un enregistrement réussi. */
export function useUnsavedChanges(dirty: boolean) {
  const ctx = useContext(UnsavedContext)
  const id = useId()
  useEffect(() => {
    ctx?.setDirty(id, dirty)
  }, [ctx, id, dirty])
  useEffect(() => () => ctx?.setDirty(id, false), [ctx, id])
  return {
    allowNextNavigation: () => {
      ctx?.setDirty(id, false)
      ctx?.allowNextNavigation()
    },
  }
}

export function useConfirmLeave() {
  const ctx = useContext(UnsavedContext)
  return (action: () => void) => (ctx ? ctx.confirmLeave(action) : action())
}
