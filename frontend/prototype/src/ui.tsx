/* Composants du prototype UX1 : hiérarchie nette, peu de cartes, états toujours écrits en clair. */
import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

type Variant = 'primary' | 'secondary' | 'quiet' | 'danger' | 'onDark'
const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm',
  secondary: 'bg-surface text-brand-800 ring-1 ring-inset ring-brand-700/60 hover:bg-brand-50',
  quiet: 'text-brand-800 underline-offset-4 hover:underline',
  danger: 'bg-surface text-danger-700 ring-1 ring-inset ring-danger-700/60 hover:bg-danger-50',
  onDark: 'bg-surface text-brand-800 hover:bg-brand-50 focus-visible:outline-white',
}
const BASE = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

export function Button({ variant = 'primary', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" {...p} className={`${BASE} ${VARIANT[variant]} ${className}`} />
}
export function ButtonLink({ variant = 'primary', className = '', ...p }: LinkProps & { variant?: Variant }) {
  return <Link {...p} className={`${BASE} ${VARIANT[variant]} ${className}`} />
}
export function TextLink(p: LinkProps) {
  return <Link {...p} className={`font-medium text-brand-800 underline underline-offset-2 hover:text-brand-700 ${p.className ?? ''}`} />
}

export type Tone = 'neutral' | 'warn' | 'info' | 'ok' | 'danger' | 'muted'
const TONE: Record<Tone, string> = {
  neutral: 'bg-canvas text-ink ring-line',
  muted: 'bg-surface text-muted ring-line border-dashed',
  warn: 'bg-warn-50 text-warn-700 ring-warn-700/30',
  info: 'bg-info-50 text-info-700 ring-info-700/30',
  ok: 'bg-ok-50 text-ok-700 ring-ok-700/30',
  danger: 'bg-danger-50 text-danger-700 ring-danger-700/30',
}
/** État écrit en clair ; la couleur ne fait que l'accompagner. */
export function Chip({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ring-1 ring-inset ${TONE[tone]}`}>{children}</span>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wider text-muted">{children}</p>
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: ReactNode; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 space-y-1">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {children && <div className="max-w-2xl text-muted">{children}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function Panel({ children, className = '', as: Tag = 'section', label }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article'; label?: string }) {
  return (
    <Tag aria-label={label} className={`rounded-xl bg-surface p-4 ring-1 ring-line sm:p-5 ${className}`}>
      {children}
    </Tag>
  )
}

export function SectionTitle({ id, children, aside }: { id?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
      <h2 id={id} className="text-lg font-semibold text-ink">{children}</h2>
      {aside}
    </div>
  )
}

/** Mise en avant unique d'une page : ce qu'il est utile de faire maintenant. */
export function Highlight({ eyebrow, title, children, action }: { eyebrow: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <section aria-label={eyebrow} className="rounded-xl bg-brand-800 p-5 text-white shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold">{title}</h2>
      {children && <div className="mt-1 text-brand-50">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </section>
  )
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'neutral' }) {
  const cls = tone === 'warn' ? 'border-warn-700/40 bg-warn-50 text-warn-700' : tone === 'neutral' ? 'border-line bg-canvas text-ink' : 'border-info-700/30 bg-info-50 text-info-700'
  return <div className={`rounded-lg border-l-4 px-3 py-2 text-sm ${cls}`}>{children}</div>
}

export function Field({ label, help, error, required, children }: {
  label: string
  help?: string
  error?: string
  required?: boolean
  children: (p: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean; required?: boolean }) => ReactNode
}) {
  const id = useId()
  const helpId = help ? `${id}-aide` : undefined
  const errId = error ? `${id}-erreur` : undefined
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-medium">
        {label} {required && <span className="font-normal text-muted">(obligatoire)</span>}
      </label>
      {help && <p id={helpId} className="text-sm text-muted">{help}</p>}
      {children({ id, 'aria-describedby': [helpId, errId].filter(Boolean).join(' ') || undefined, 'aria-invalid': error ? true : undefined, required })}
      {error && <p id={errId} className="text-sm font-medium text-danger-700">{error}</p>}
    </div>
  )
}
export const input = 'block w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink shadow-inner focus:border-brand-700'

/** Choix exclusif présenté en options larges (cibles tactiles confortables). */
export function Choice<T extends string>({ legend, help, name, options, value, onChange }: {
  legend: string
  help?: string
  name: string
  options: { value: T; label: string; help?: string }[]
  value: T | ''
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-medium">{legend}</legend>
      {help && <p className="text-sm text-muted">{help}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-surface p-3 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-1 size-5 shrink-0 accent-brand-700" />
            <span>
              <span className="block font-medium">{o.label}</span>
              {o.help && <span className="block text-sm text-muted">{o.help}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Steps({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <ol className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={`h-1.5 w-8 rounded-full ${i < current ? 'bg-brand-700' : 'bg-line'}`} />
        ))}
      </ol>
      <p className="text-sm text-muted">Étape {current} sur {total} · {label}</p>
    </div>
  )
}

export function Skeleton() {
  return (
    <div role="status" aria-label="Chargement (simulé)" className="space-y-3">
      <div className="h-8 w-2/3 animate-pulse rounded bg-line" />
      <div className="h-24 animate-pulse rounded-xl bg-line/70" />
      <div className="h-24 animate-pulse rounded-xl bg-line/70" />
      <p className="text-sm text-muted">Chargement du dossier… (état simulé par l'outil de démonstration)</p>
    </div>
  )
}
