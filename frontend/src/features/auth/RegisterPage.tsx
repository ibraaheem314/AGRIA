import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { ApiError } from '../../shared/api'
import { Alert, Button, Card, Field, inputClass, Loading, PageTitle } from '../../shared/ui'
import { useMe, useRegister } from './session'

export function RegisterPage() {
  const me = useMe()
  const register = useRegister()
  const [form, setForm] = useState({ display_name: '', email: '', password: '' })

  if (me.isPending) return <Loading />
  if (me.data?.user) return <Navigate to="/" replace />
  if (me.data && !me.data.signup) {
    return (
      <div className="mx-auto max-w-md">
        <PageTitle>Créer un compte</PageTitle>
        <Alert tone="info">
          L'inscription libre est fermée. Demandez un compte à l'équipe AGRIA ou à la personne qui vous accompagne.
        </Alert>
        <p className="mt-4"><Link to="/connexion" className="text-brand-700 underline">Retour à la connexion</Link></p>
      </div>
    )
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    register.mutate(form)
  }

  const error = register.error instanceof ApiError ? register.error : null
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="mx-auto max-w-md">
      <PageTitle>Créer un compte</PageTitle>
      <Card>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {error && (
            <Alert tone="danger" role="alert">
              {error.message}
            </Alert>
          )}
          <Field label="Votre nom" error={error?.fieldMessage('display_name')}>
            {(p) => <input {...p} autoComplete="name" className={inputClass} value={form.display_name} onChange={set('display_name')} />}
          </Field>
          <Field label="Adresse email" error={error?.fieldMessage('email')}>
            {(p) => <input {...p} type="email" autoComplete="email" className={inputClass} value={form.email} onChange={set('email')} />}
          </Field>
          <Field label="Mot de passe" help="10 caractères au moins, pas un mot de passe courant." error={error?.fieldMessage('password')}>
            {(p) => <input {...p} type="password" autoComplete="new-password" className={inputClass} value={form.password} onChange={set('password')} />}
          </Field>
          <Button type="submit" busy={register.isPending} className="w-full">
            Créer mon compte
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-center">
        Déjà un compte ? <Link to="/connexion" className="font-medium text-brand-700 underline">Se connecter</Link>
      </p>
    </div>
  )
}
