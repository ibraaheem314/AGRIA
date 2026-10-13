/**
 * « Répondre plus tard » n'enregistre rien côté serveur (D-049) : c'est un simple repère de ce
 * navigateur pour passer à la suite. L'information reste « non renseignée » pour le serveur.
 */
const storageKey = (dossierId: number) => `agria.pas-a-pas.${dossierId}`

export function readDeferred(dossierId: number): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey(dossierId))
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : []
  } catch {
    return []
  }
}

export function writeDeferred(dossierId: number, keys: string[]) {
  try {
    if (keys.length) window.localStorage.setItem(storageKey(dossierId), JSON.stringify(keys))
    else window.localStorage.removeItem(storageKey(dossierId))
  } catch {
    // Stockage indisponible : le report vaut pour cette visite seulement.
  }
}
