import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { plural } from '../../shared/format'
import { useConfirmLeave } from '../../shared/unsaved'
import { Alert, Button, ButtonLink, Card, PageTitle } from '../../shared/ui'
import type { Dossier, FactItem } from './api'
import { useCurrentDossier } from './DossierLayout'
import { FactForm } from './FactEditPage'
import { canEdit } from './roles'

/**
 * Ordre de saisie proposé pas à pas : d'abord le lieu, l'accès au terrain et l'eau, dont dépendent
 * beaucoup d'autres vérifications. C'est un ordre de saisie, pas un conseil agronomique.
 */
const ORDER = [
  'localisation', 'acces_terrain', 'eau', 'culture', 'periode', 'debouches',
  'temps_disponible', 'main_oeuvre', 'materiel', 'apport', 'experience', 'changements',
]

export function orderedFacts(dossier: Pick<Dossier, 'facts'>): FactItem[] {
  const rank = (key: string) => {
    const i = ORDER.indexOf(key)
    return i === -1 ? ORDER.length : i
  }
  return [...dossier.facts].sort((a, b) => rank(a.key) - rank(b.key))
}

// « Remettre à plus tard » n'enregistre rien côté serveur : c'est un simple repère de ce
// navigateur pour passer à la suite. L'information reste « non renseignée ».
const storageKey = (dossierId: number) => `agria.pas-a-pas.${dossierId}`

function readDeferred(dossierId: number): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey(dossierId))
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : []
  } catch {
    return []
  }
}

function writeDeferred(dossierId: number, keys: string[]) {
  try {
    if (keys.length) window.localStorage.setItem(storageKey(dossierId), JSON.stringify(keys))
    else window.localStorage.removeItem(storageKey(dossierId))
  } catch {
    // Stockage indisponible : le report vaut pour cette visite seulement.
  }
}

export function StepByStepPage() {
  const dossier = useCurrentDossier()
  const confirmLeave = useConfirmLeave()
  const [deferred, setDeferred] = useState<string[]>(() => readDeferred(dossier.id))
  const [flash, setFlash] = useState<string | null>(null)
  // Après un enregistrement ou un report, le bouton utilisé disparaît : le focus va au titre suivant.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const moveFocus = useRef(false)

  const facts = orderedFacts(dossier)
  // La reprise repose sur ce qui est réellement enregistré : seules les informations encore
  // « non renseignées » sont proposées.
  const empty = facts.filter((f) => f.state.status === 'non_renseigne')
  const later = empty.filter((f) => deferred.includes(f.key))
  const pending = empty.filter((f) => !deferred.includes(f.key))
  const current = pending[0]
  const answered = facts.length - empty.length
  const unknown = facts.filter((f) => f.state.status === 'inconnu').length
  const editable = canEdit(dossier)

  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    headingRef.current?.focus()
  })

  function next(message: string | null) {
    moveFocus.current = true
    setFlash(message)
  }

  function updateDeferred(keys: string[]) {
    setDeferred(keys)
    writeDeferred(dossier.id, keys)
  }

  function defer(fact: FactItem) {
    confirmLeave(() => {
      next(`« ${fact.label} » remis à plus tard : rien n'a été enregistré, l'information reste non renseignée.`)
      updateDeferred([...deferred.filter((k) => k !== fact.key), fact.key])
    })
  }

  return (
    <div className="space-y-6">
      <p className="no-print">
        <Link to={`/d/${dossier.id}/projet`} className="text-brand-700 underline">← Voir tout le projet</Link>
      </p>
      <PageTitle
        subtitle={editable ? 'Une information à la fois. Vous pouvez reprendre plus tard : ce qui est enregistré est conservé.' : undefined}
      >
        {editable ? 'Renseigner mon projet pas à pas' : 'Saisie pas à pas'}
      </PageTitle>

      <p className="text-sm text-muted">
        {plural(answered, 'information a', 'informations ont')} une réponse enregistrée sur {facts.length}
        {unknown > 0 ? `, dont ${unknown} « Je ne sais pas »` : ''}
        {later.length > 0 ? ` ; ${plural(later.length, 'remise', 'remises')} à plus tard` : ''}. C'est l'avancement de la
        saisie, pas une mesure de la faisabilité du projet.
      </p>

      {flash && <Alert tone="ok" role="status">{flash}</Alert>}

      {!editable ? (
        <Alert tone="neutral">
          {dossier.archived
            ? 'Dossier archivé : consultation seulement.'
            : 'Seul le porteur du projet renseigne ces informations.'}{' '}
          <Link to={`/d/${dossier.id}/projet`} className="underline">Voir le projet</Link>
        </Alert>
      ) : current ? (
        <Card>
          <p className="text-sm text-muted">
            {dossier.sections.find((s) => s.key === current.section)?.label} · {plural(pending.length, 'information restante', 'informations restantes')}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-xl font-semibold">{current.label}</h2>
          <p className="mt-1 text-muted">Pourquoi ? {current.why}</p>
          {current.key === ORDER[0] && answered === 0 && (
            <p className="mt-2 text-sm">
              On commence par le lieu, l'accès au terrain et l'eau : beaucoup d'autres vérifications en dépendent.
            </p>
          )}
          <p className="mt-2 text-sm">
            « Je ne sais pas » est enregistré et devient un point à vérifier ; « Remettre à plus tard » n'enregistre rien.
          </p>
          <div className="mt-4">
            <FactForm
              key={current.key}
              fact={current}
              dossierId={dossier.id}
              statuses={dossier.statuses}
              cancelTo={null}
              submitLabel="Enregistrer et continuer"
              onSaved={(message) => next(message)}
              extraActions={
                <Button type="button" variant="secondary" onClick={() => defer(current)}>
                  Remettre à plus tard
                </Button>
              }
            />
          </div>
        </Card>
      ) : (
        <Card>
          {later.length > 0 ? (
            <>
              <h2 ref={headingRef} tabIndex={-1} className="font-semibold">
                {plural(later.length, 'information remise', 'informations remises')} à plus tard
              </h2>
              <ul className="mt-2 list-disc pl-5">
                {later.map((f) => <li key={f.key}>{f.label}</li>)}
              </ul>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button onClick={() => { next(null); updateDeferred([]) }}>Les reprendre maintenant</Button>
                <ButtonLink to={`/d/${dossier.id}/plan`} variant="secondary">Voir Mon plan</ButtonLink>
              </div>
            </>
          ) : (
            <>
              <h2 ref={headingRef} tabIndex={-1} className="font-semibold">Chaque information a une réponse enregistrée</h2>
              <p className="mt-1">
                Cela ne veut pas dire que le projet est faisable. Les points à vérifier et les démarches sont dans Mon plan.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <ButtonLink to={`/d/${dossier.id}/plan`}>Voir Mon plan</ButtonLink>
                <ButtonLink to={`/d/${dossier.id}/projet/budget`} variant="secondary">Préparer le budget provisoire</ButtonLink>
                <ButtonLink to={`/d/${dossier.id}/projet`} variant="ghost">Voir tout le projet</ButtonLink>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
