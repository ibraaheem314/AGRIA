import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { ApiError } from '../../shared/api'
import { Alert, Button, Card, Field, inputClass, PageTitle } from '../../shared/ui'
import { useLogin, useMe } from './session'

export function LoginPage() {
  const me = useMe()
  const login = useLogin()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  if (me.data?.user) return <Navigate to={from} replace />

  function submit(event: FormEvent) {
    event.preventDefault()
    login.mutate({ email, password })
  }

  const error = login.error instanceof ApiError ? login.error : null
  return (
    <div className="mx-auto max-w-md">
      <PageTitle subtitle="Préparer sa campagne, avec l'appui d'un conseiller.">Connexion</PageTitle>
      <Card>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {error && (
            <Alert tone="danger" role="alert">
              {error.message}
            </Alert>
          )}
          <Field label="Adresse email" error={error?.fieldMessage('email')}>
            {(p) => (
              <input {...p} type="email" autoComplete="email" required className={inputClass}
                value={email} onChange={(e) => setEmail(e.target.value)} />
            )}
          </Field>
          <Field label="Mot de passe" error={error?.fieldMessage('password')}>
            {(p) => (
              <input {...p} type="password" autoComplete="current-password" required className={inputClass}
                value={password} onChange={(e) => setPassword(e.target.value)} />
            )}
          </Field>
          <Button type="submit" busy={login.isPending} className="w-full">
            Se connecter
          </Button>
        </form>
      </Card>
      {me.data?.signup && (
        <p className="mt-4 text-center">
          Pas encore de compte ? <Link to="/inscription" className="font-medium text-brand-700 underline">Créer un compte</Link>
        </p>
      )}
    </div>
  )
}
