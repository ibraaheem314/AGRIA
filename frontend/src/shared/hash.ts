import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Amène à l'ancre de l'adresse (#messages, #decisions…) une fois le contenu affiché, et y place le
 * focus : un lien « Répondre au conseiller » mène bien à l'échange, pas au haut de la page.
 */
export function useScrollToHash(ready: boolean) {
  const { hash } = useLocation()
  useEffect(() => {
    if (!ready || !hash) return
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!target) return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }, [ready, hash])
}
