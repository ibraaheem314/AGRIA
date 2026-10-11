/** Formats d'affichage (français, Sénégal). Aucun calcul métier ici : les montants viennent du serveur. */

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

/** « 2027-03 » → « mars 2027 ». */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-')
  const name = MONTHS[Number(month) - 1]
  return name ? `${name} ${year}` : value
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Africa/Dakar' })
const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Dakar',
})

export function formatDate(iso: string): string {
  // Une date seule (AAAA-MM-JJ) est un jour calendaire, pas un instant : pas de fuseau.
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number)
    return dateFormatter.format(new Date(Date.UTC(y!, m! - 1, d!, 12)))
  }
  return dateFormatter.format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}

// Espaces insécables (séparateur de milliers et avant l'unité), écrits par code pour rester visibles.
const NBSP = String.fromCharCode(0x00a0)
const THIN_NBSP = String.fromCharCode(0x202f)

/** Nombre décimal reçu en texte (« 0.75 ») → « 0,75 », sans passer par un calcul flottant. */
export function formatDecimal(value: string | number): string {
  const text = String(value)
  const [intPart, frac] = text.split('.')
  const grouped = (intPart ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, THIN_NBSP)
  return frac ? `${grouped},${frac}` : grouped
}

/** Montant entier en francs CFA (XOF n'a pas de subdivision). */
export function formatFcfa(value: number | string): string {
  return `${formatDecimal(value)}${NBSP}FCFA`
}

/** Date du jour à Dakar, au format AAAA-MM-JJ (valeur par défaut des champs date). */
export function todayInDakar(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Dakar' }).format(new Date())
}
