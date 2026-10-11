/**
 * Client HTTP unique de l'interface.
 *
 * - Cookies de session sur la même origine (proxy Vite en développement).
 * - Jeton CSRF ajouté à toute requête qui modifie des données.
 * - Toute erreur devient une ApiError lisible ; une coupure réseau n'est jamais
 *   présentée comme un succès.
 */

export type FieldErrors = Record<string, unknown>

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields?: FieldErrors
  /** true si la requête n'a pas atteint le serveur (ou si la réponse s'est perdue). */
  readonly network: boolean

  constructor(opts: { status: number; code: string; message: string; fields?: FieldErrors; network?: boolean }) {
    super(opts.message)
    this.name = 'ApiError'
    this.status = opts.status
    this.code = opts.code
    this.fields = opts.fields
    this.network = opts.network ?? false
  }

  /** Message d'un champ précis, s'il existe. */
  fieldMessage(name: string): string | undefined {
    const value = this.fields?.[name]
    if (Array.isArray(value)) return value.map(String).join(' ')
    if (typeof value === 'string') return value
    return undefined
  }
}

const UNSAFE = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

/** Obtient le cookie CSRF (posé par /auth/me) s'il n'est pas encore présent. */
async function ensureCsrfCookie(force = false): Promise<void> {
  if (!force && readCookie('csrftoken')) return
  try {
    await fetch('/api/auth/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
  } catch {
    /* l'erreur réseau sera signalée par la requête principale */
  }
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const unsafe = UNSAFE.has(options.method ?? 'GET')
  if (unsafe) await ensureCsrfCookie()
  try {
    return await send<T>(path, options)
  } catch (error) {
    // Refus CSRF : le serveur a rejeté la requête avant tout traitement (aucun effet).
    // On renouvelle le jeton et on renvoie une seule fois.
    if (unsafe && error instanceof ApiError && error.code === 'csrf') {
      await ensureCsrfCookie(true)
      return send<T>(path, options)
    }
    throw error
  }
}

async function send<T>(path: string, { method = 'GET', body, signal }: Options): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (UNSAFE.has(method)) {
    const token = readCookie('csrftoken')
    if (token) headers['X-CSRFToken'] = decodeURIComponent(token)
  }

  let response: Response
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError({
      status: 0,
      code: 'reseau',
      network: true,
      message: 'Connexion au serveur impossible. Vos saisies sont conservées : réessayez.',
    })
  }

  if (response.status === 204) return undefined as T

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload: unknown = isJson ? await response.json().catch(() => undefined) : undefined

  if (response.ok) {
    if (payload === undefined) {
      throw new ApiError({ status: response.status, code: 'reponse_invalide', message: 'Réponse du serveur illisible.' })
    }
    return payload as T
  }

  const err = (payload as { error?: { code?: string; message?: string; fields?: FieldErrors } } | undefined)?.error
  if (err?.code) {
    throw new ApiError({ status: response.status, code: err.code, message: err.message ?? 'Erreur.', fields: err.fields })
  }
  // Réponse non JSON : typiquement le proxy qui ne joint pas le serveur (502/504).
  throw new ApiError({
    status: response.status,
    code: 'serveur_injoignable',
    network: response.status >= 502,
    message:
      response.status >= 502
        ? 'Le serveur ne répond pas. Vos saisies sont conservées : réessayez.'
        : `Erreur inattendue (${response.status}).`,
  })
}

/** Identifiant stable d'une création, réutilisé lors des nouvelles tentatives (évite les doublons). */
export function newRequestId(): string {
  // randomUUID n'existe qu'en contexte sécurisé (https ou localhost) ; getRandomValues partout.
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
