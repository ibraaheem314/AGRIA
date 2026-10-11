import { useEffect, useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

/* Composants d'interface communs. La couleur accompagne toujours un texte explicite. */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 disabled:bg-brand-700/60',
  secondary: 'bg-surface text-brand-800 border border-brand-700 hover:bg-brand-50',
  ghost: 'text-brand-800 hover:bg-brand-50',
  danger: 'bg-surface text-danger-700 border border-danger-700 hover:bg-danger-50',
}

const BUTTON_BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium ' +
  'transition-colors disabled:cursor-not-allowed'

export function Button({
  variant = 'primary',
  busy = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; busy?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={`${BUTTON_BASE} ${VARIANTS[variant]} ${className}`}
    >
      {busy && <Spinner />}
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'primary', className = '', ...props }: LinkProps & { variant?: Variant }) {
  return <Link {...props} className={`${BUTTON_BASE} ${VARIANTS[variant]} ${className}`} />
}

export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  )
}

export function Card({ children, className = '', as: Tag = 'section' }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' | 'li' }) {
  return <Tag className={`rounded-lg border border-line bg-surface p-4 ${className}`}>{children}</Tag>
}

type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info'
const TONES: Record<Tone, string> = {
  neutral: 'bg-canvas text-muted border-line',
  ok: 'bg-ok-50 text-ok-700 border-ok-700/30',
  warn: 'bg-warn-50 text-warn-700 border-warn-700/30',
  danger: 'bg-danger-50 text-danger-700 border-danger-700/30',
  info: 'bg-info-50 text-info-700 border-info-700/30',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-sm font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}

export function Alert({
  tone = 'info',
  title,
  children,
  role,
}: {
  tone?: Tone
  title?: string
  children?: ReactNode
  role?: 'alert' | 'status'
}) {
  return (
    <div role={role} className={`rounded-md border p-3 ${TONES[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
    </div>
  )
}

/** Champ de formulaire : libellé, aide et erreur reliés au contrôle (aria-describedby). */
export function Field({
  label,
  help,
  error,
  required,
  children,
}: {
  label: string
  help?: string
  error?: string
  required?: boolean
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
}) {
  const id = useId()
  const helpId = help ? `${id}-aide` : undefined
  const errorId = error ? `${id}-erreur` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-medium">
        {label}
        {required && <span className="text-muted"> (obligatoire)</span>}
      </label>
      {help && (
        <p id={helpId} className="text-sm text-muted">
          {help}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p id={errorId} className="text-sm font-medium text-danger-700">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'block w-full min-h-11 rounded-md border border-line bg-surface px-3 py-2 text-base ' +
  'aria-[invalid=true]:border-danger-700'

export function PageTitle({ children, subtitle }: { children: ReactNode; subtitle?: ReactNode }) {
  useEffect(() => {
    if (typeof children === 'string') document.title = `${children} — AGRIA`
  }, [children])
  return (
    <header className="mb-4">
      <h1 className="text-2xl font-semibold text-ink">{children}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </header>
  )
}

export function Loading({ label = 'Chargement…' }: { label?: string }) {
  return (
    <p role="status" className="flex items-center gap-2 text-muted">
      <Spinner /> {label}
    </p>
  )
}
