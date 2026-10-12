import { useState } from 'react'
import { useUnsavedChanges } from '../../../src/shared/unsaved'
import { factLabel } from '../data/facts'
import { describe, EMPTY, OUTCOME_LABEL, type Dossier } from '../data/model'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, ButtonLink, Chip, Field, input, Note, PageHeader, Panel, SectionTitle, TextLink } from '../ui'

/** Producteur : ce qui est repris (à reconfirmer), ce qui change, ce qui reste dans l'historique. */
export function CarryOver() {
  const { dossier: d, canEdit, viewer, base } = useDossierCtx()
  const { ops, state } = useStore()
  const prev = state.dossiers.find((x) => x.id === d.previousId) as Dossier | undefined
  const carriedKeys = ['localisation', 'acces_terrain', 'eau'].filter((k) => prev?.facts[k] && d.history.some((h) => h.key === k))
  const changes = d.facts.changements
  const [text, setText] = useState('')
  const { allowNextNavigation } = useUnsavedChanges(text.trim() !== '')
  if (!prev) return <p>Cette campagne n'a pas été créée à partir d'une précédente. <TextLink to={base}>Retour au projet</TextLink></p>
  const pending = carriedKeys.filter((k) => d.facts[k]?.carried)
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={d.campaign} title={`Reprise de « ${prev.campaign} »`}>
        Vérifiez ce qui reste vrai cette saison, notez ce qui change, puis passez directement aux démarches et au budget.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section aria-labelledby="repris">
            <SectionTitle id="repris" aside={<span className="text-sm text-muted">{pending.length} à reconfirmer</span>}>Repris de la campagne précédente</SectionTitle>
            <ul className="space-y-3">
              {carriedKeys.map((k) => {
                const f = d.facts[k] ?? EMPTY
                return (
                  <li key={k}>
                    <Panel as="article" label={factLabel(k, d.profile)}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold">{factLabel(k, d.profile)}</h3>
                        {f.carried ? <Chip tone="warn">À reconfirmer</Chip> : <Chip tone="neutral">Reconfirmé ou modifié</Chip>}
                      </div>
                      <p className="mt-1 text-lg">{describe(k, f)}</p>
                      <p className="mt-1 text-sm text-muted">{f.source}</p>
                      {canEdit && f.carried && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="secondary" onClick={() => ops.reconfirm(d.id, k, viewer)}>Toujours vrai cette saison<span className="sr-only"> : {factLabel(k, d.profile)}</span></Button>
                          <ButtonLink to={`${base}/info/${k}`} variant="quiet">A changé : modifier<span className="sr-only"> {factLabel(k, d.profile)}</span></ButtonLink>
                        </div>
                      )}
                    </Panel>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-sm text-muted">« Toujours vrai » enregistre votre affirmation pour cette saison ; une preuve se renseigne en modifiant l'information.</p>
          </section>
          <Panel>
            <SectionTitle>Ce qui change cette saison</SectionTitle>
            {changes && changes.status !== 'non_renseigne' ? (
              <p>{describe('changements', changes)}</p>
            ) : canEdit ? (
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; ops.saveFact(d.id, 'changements', { status: 'declare', value: { description: text.trim() }, source: '' }, viewer); allowNextNavigation(); setText('') }}>
                <Field label="Qu'allez-vous faire différemment ?" help="Culture, surface, période, acheteur, organisation…">{(p) => <textarea {...p} rows={3} className={input} value={text} onChange={(e) => setText(e.target.value)} />}</Field>
                <Button type="submit" variant="secondary" disabled={!text.trim()}>Enregistrer</Button>
              </form>
            ) : <p className="text-muted">Non renseigné.</p>}
          </Panel>
        </div>
        <aside className="space-y-4" aria-label="Historique de la campagne précédente">
          <Panel>
            <SectionTitle>Non recopié</SectionTitle>
            <p className="text-sm">Démarches, résultats et budget de « {prev.campaign} » restent dans cette campagne. Ce sont des résultats passés, pas des prévisions.</p>
            <ul className="mt-2 space-y-1 text-sm">
              {prev.actions.filter((a) => a.result).map((a) => <li key={a.id}>{a.title} — {OUTCOME_LABEL[a.result!.outcome].toLowerCase()}</li>)}
            </ul>
            <TextLink to={`/d/${prev.id}`} className="mt-2 inline-block">Consulter la campagne précédente</TextLink>
          </Panel>
          <Note tone="neutral">Vue directe : vous pouvez aller aux démarches et au budget sans passer par un parcours d'initiation.</Note>
          <div className="flex flex-wrap gap-2">
            <ButtonLink to={base}>Aller au projet</ButtonLink>
            <ButtonLink to={`${base}/budget`} variant="secondary">Budget</ButtonLink>
          </div>
        </aside>
      </div>
    </div>
  )
}
