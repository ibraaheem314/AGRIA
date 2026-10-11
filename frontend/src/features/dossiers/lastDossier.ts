// Simple confort : rouvrir le dernier dossier consulté. Le stockage local peut être
// indisponible (navigation privée) : l'application fonctionne alors sans.
const KEY = 'agria.dernier-dossier'

export function rememberDossier(id: number) {
  try {
    localStorage.setItem(KEY, String(id))
  } catch {
    /* stockage indisponible : sans conséquence */
  }
}

export function lastDossier(): number | null {
  try {
    const value = Number(localStorage.getItem(KEY))
    return Number.isInteger(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

export function forgetDossier() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* sans conséquence */
  }
}
