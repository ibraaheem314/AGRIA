import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ApiError, newRequestId } from '../../shared/api'
import { useUnsavedChanges } from '../../shared/unsaved'
import { Alert, Button, Card, Field, inputClass, PageTitle } from '../../shared/ui'
import { useCreateProject, type Profile } from './api'

const PROFILE_CHOICES: { value: Profile; title: string; text: string }[] = [
  {
    value: 'debutant',
    title: 'Je prépare ma première campagne',
    text: "J'ai un projet concret et un terrain envisagé ou accessible.",
  },
  {
    value: 'producteur',
    title: 'Je prépare ma prochaine campagne',
    text: 'Je produis déjà et je veux mieux préparer la suite.',
  },
]

export function NewProjectPage() {
  const create = useCreateProject()
  const navigate = useNavigate()
  // Identifiant stable tant que la page est ouverte : un nouvel essai après une erreur
  // réseau retrouve le projet déjà créé au lieu d'en créer un second.
  const requestId = useRef(newRequestId())
  const [form, setForm] = useState<{ name: string; profile: Profile | ''; campaign_label: string }>({
    name: '',
    profile: '',
    campaign_label: '',
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const { allowNextNavigation } = useUnsavedChanges(Boolean(form.name || form.profile || form.campaign_label))

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!form.profile) {
      setLocalError('Choisissez votre situation.')
      return
    }
    setLocalError(null)
    create.mutate(
      { name: form.name, profile: form.profile, campaign_label: form.campaign_label, request_id: requestId.current },
      {
        onSuccess: (dossier) => {
          allowNextNavigation()
          // Débutant : les premières questions ; producteur : l'écran existant (reprise en UX3-B).
          const to = dossier.project.profile === 'debutant' ? `/d/${dossier.id}/demarrer` : `/d/${dossier.id}/projet`
          navigate(to, { state: { flash: 'Projet créé.' } })
        },
      },
    )
  }

  const error = create.error instanceof ApiError ? create.error : null
  return (
    <div className="mx-auto max-w-xl">
      <PageTitle subtitle="Vous compléterez les informations ensuite, à votre rythme. « Je ne sais pas » est une réponse acceptée.">
        Nouveau projet
      </PageTitle>
      <Card>
        <form onSubmit={submit} className="space-y-5" noValidate>
          {error && (
            <Alert tone="danger" role="alert" title={error.network ? 'Projet non enregistré' : undefined}>
              {error.message}
            </Alert>
          )}
          <fieldset className="space-y-2">
            <legend className="font-medium">Votre situation</legend>
            {PROFILE_CHOICES.map((choice) => (
              <label
                key={choice.value}
                className="flex cursor-pointer gap-3 rounded-md border border-line p-3 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50"
              >
                <input
                  type="radio"
                  name="profile"
                  value={choice.value}
                  checked={form.profile === choice.value}
                  onChange={() => setForm((f) => ({ ...f, profile: choice.value }))}
                  className="mt-1 size-5 shrink-0 accent-brand-700"
                />
                <span>
                  <span className="block font-medium">{choice.title}</span>
                  <span className="block text-sm text-muted">{choice.text}</span>
                </span>
              </label>
            ))}
            {(localError || error?.fieldMessage('profile')) && (
              <p className="text-sm font-medium text-danger-700">{localError ?? error?.fieldMessage('profile')}</p>
            )}
          </fieldset>
          <Field label="Nom du projet" help="Par exemple : « Parcelle de Keur Massar »." error={error?.fieldMessage('name')} required>
            {(p) => (
              <input {...p} className={inputClass} maxLength={120} value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            )}
          </Field>
          <Field label="Campagne préparée" help="Par exemple : « Contre-saison 2027 »." error={error?.fieldMessage('campaign_label')} required>
            {(p) => (
              <input {...p} className={inputClass} maxLength={120} value={form.campaign_label}
                onChange={(e) => setForm((f) => ({ ...f, campaign_label: e.target.value }))} />
            )}
          </Field>
          <Button type="submit" busy={create.isPending} className="w-full">
            {error?.network ? 'Réessayer' : 'Créer le projet'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
