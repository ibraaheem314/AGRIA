import { Link, useSearchParams } from 'react-router'
import { advisorReasons } from '../Shell'
import { factLabel, HOW_KNOWN, SUBJECTS } from '../data/facts'
import {
  budgetTotals, describe, DECISION_LABEL, EMPTY, formatDay, formatFcfa, nextStep, OUTCOME_LABEL, PEOPLE, questionState,
  staleSections, SUBJECT_STATE_LABEL, subjectsFor, subjectState, VERDICT_LABEL, type SubjectState,
} from '../data/model'
import { useDossierCtx } from '../dossier'
import { ButtonLink, Chip, Eyebrow, Highlight, Note, PageHeader, Panel, SectionTitle, TextLink, type Tone } from '../ui'

export const SUBJECT_TONE: Record<SubjectState, Tone> = { non_aborde: 'muted', inconnu: 'warn', ouvert: 'info', rien_signale: 'neutral' }

export function DossierHome() {
  const { role } = useDossierCtx()
  return role === 'conseiller' ? <AdvisorOverview /> : <Synthesis />
}

/** Porteur : la synthèse vivante du dossier, lisible dès les premières réponses. */
function Synthesis() {
  const { dossier: d, checks, canEdit, base } = useDossierCtx()
  const [params] = useSearchParams()
  const first = params.get('premiere') === '1'
  const step = canEdit ? nextStep(d, checks) : null
  const subjects = subjectsFor(d)
  const facts = subjects.flatMap((s) => s.facts)
  const known = facts.filter((k) => ['declare', 'estime', 'verifie'].includes((d.facts[k] ?? EMPTY).status))
  const unknown = facts.filter((k) => (d.facts[k] ?? EMPTY).status === 'inconnu')
  const notYet = facts.filter((k) => (d.facts[k] ?? EMPTY).status === 'non_renseigne')
  const open = checks.filter((c) => c.level !== 'a_completer')
  const actionsOpen = d.actions.filter((a) => a.status !== 'terminee')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`${d.campaign}${d.profile === 'producteur' ? ' · producteur' : ''}`} title={d.projectName}>
        <p>« {d.idea} »</p>
      </PageHeader>

      {first && (
        <section aria-labelledby="depart" className="rounded-xl bg-surface p-5 ring-2 ring-brand-700/40">
          <h2 id="depart" className="text-lg font-semibold">Votre point de départ</h2>
          <p className="mt-1 text-sm text-muted">
            Voici ce que votre dossier dit déjà. Ce n'est pas un avis sur la faisabilité : c'est ce qui est connu, ce qui ne l'est pas
            encore, et des démarches pour avancer.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <Eyebrow>Ce que vous savez ({known.length})</Eyebrow>
              <ul className="mt-2 space-y-1 text-sm">
                {known.map((k) => <li key={k}><span className="font-medium">{factLabel(k, d.profile)}</span> : {describe(k, d.facts[k]!)}</li>)}
                {known.length === 0 && <li className="text-muted">Rien pour l'instant.</li>}
              </ul>
            </div>
            <div>
              <Eyebrow>À éclaircir ({open.length})</Eyebrow>
              <ul className="mt-2 space-y-1 text-sm">
                {open.map((c) => <li key={c.key}>{c.message}</li>)}
                {notYet.length > 0 && <li className="text-muted">Pas encore abordé : {notYet.map((k) => factLabel(k, d.profile)).join(', ')}.</li>}
              </ul>
            </div>
            <div>
              <Eyebrow>Démarches proposées ({actionsOpen.length})</Eyebrow>
              <ul className="mt-2 space-y-1 text-sm">
                {actionsOpen.map((a) => <li key={a.id}><TextLink to={`${base}/demarches/${a.id}`}>{a.title}</TextLink></li>)}
                {actionsOpen.length === 0 && <li className="text-muted">Aucune pour l'instant.</li>}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-6">
          {canEdit && (step ? (
            <Highlight eyebrow="À faire maintenant" title={step.title} action={<ButtonLink to={`${base}${step.to}`} variant="onDark">{step.label}</ButtonLink>}>
              {step.why}
            </Highlight>
          ) : (
            <Panel>
              <h2 className="font-semibold">Aucune démarche ouverte pour l'instant</h2>
              <p className="mt-1 text-sm text-muted">Vous pouvez compléter un sujet, préparer le budget ou écrire à votre conseiller.</p>
            </Panel>
          ))}

          <section aria-labelledby="sujets">
            <SectionTitle id="sujets" aside={<span className="text-sm text-muted">{known.length} connus · {unknown.length} inconnus · {notYet.length} pas encore abordés</span>}>
              Où en est le projet
            </SectionTitle>
            <ul className="divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
              {subjects.map((s) => {
                const state = subjectState(d, s, checks)
                const related = d.actions.filter((a) => a.factKey && s.facts.includes(a.factKey))
                const deferred = s.facts.some((k) => d.deferred.includes(k))
                return (
                  <li key={s.key}>
                    <Link to={`${base}/sujet/${s.key}`} className="block px-4 py-4 hover:bg-canvas focus-visible:bg-canvas sm:px-5">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-ink">{s.title}</span>
                        <span className="flex flex-wrap gap-1.5">
                          <Chip tone={SUBJECT_TONE[state]}>{SUBJECT_STATE_LABEL[state]}</Chip>
                          {deferred && <Chip tone="muted">Remis à plus tard</Chip>}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {s.facts.map((k) => `${factLabel(k, d.profile)} : ${describe(k, d.facts[k] ?? EMPTY)}`).join(' · ')}
                      </span>
                      {related.length > 0 && (
                        <span className="mt-1 block text-sm">
                          {related.map((a) => `${a.title} (${a.status === 'terminee' ? `terminée${a.result ? `, résultat ${OUTCOME_LABEL[a.result.outcome].toLowerCase()}` : ''}` : a.status === 'en_cours' ? 'en cours' : a.status === 'bloquee' ? 'bloquée' : 'à faire'})`).join(' · ')}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-sm text-muted">
              « Rien de signalé » veut dire que les règles disponibles ne relèvent rien sur ce sujet : ce n'est pas une validation.
            </p>
          </section>
        </div>

        <aside className="space-y-4" aria-label="Résumés">
          <SideActions />
          <SideBudget />
          <SideAdvisor />
          {d.decisions.length > 0 && <SideDecision />}
        </aside>
      </div>
    </div>
  )
}

function SideActions() {
  const { dossier: d, base } = useDossierCtx()
  const by = (s: string) => d.actions.filter((a) => a.status === s).length
  return (
    <Panel>
      <Eyebrow>Démarches</Eyebrow>
      <p className="mt-1">{by('a_faire')} à faire · {by('en_cours')} en cours · {by('terminee')} terminée{by('terminee') > 1 ? 's' : ''}{by('bloquee') ? ` · ${by('bloquee')} bloquée` : ''}</p>
      <p className="mt-1 text-sm text-muted">Proposées à partir d'un contenu générique, non relu par un spécialiste.</p>
      <TextLink to={`${base}/demarches`} className="mt-2 inline-block">Voir les démarches</TextLink>
    </Panel>
  )
}

function SideBudget() {
  const { dossier: d, base } = useDossierCtx()
  const t = budgetTotals(d.budget)
  return (
    <Panel>
      <Eyebrow>Budget provisoire</Eyebrow>
      {t.count === 0 ? (
        <p className="mt-1">Aucun poste pour l'instant.</p>
      ) : (
        <p className="mt-1">
          {t.priced > 0 ? <>Postes chiffrés : <strong>{formatFcfa(t.priced)}</strong></> : 'Aucun poste chiffré'}
          {t.missing > 0 && <span className="block text-warn-700">{t.missing} poste{t.missing > 1 ? 's' : ''} à chiffrer : le coût total n'est pas connu.</span>}
        </p>
      )}
      <TextLink to={`${base}/budget`} className="mt-2 inline-block">Ouvrir le budget</TextLink>
    </Panel>
  )
}

function SideAdvisor() {
  const { dossier: d, base } = useDossierCtx()
  const waiting = d.threads.filter((m) => questionState(d, m, 'porteur') === 'a_repondre').length
  const last = d.reviews[d.reviews.length - 1]
  return (
    <Panel>
      <Eyebrow>Conseiller</Eyebrow>
      {d.advisors.length === 0 ? (
        <p className="mt-1 text-sm">Aucun conseiller attribué. Vous pouvez déjà noter vos questions ; aucune réponse ne peut être promise.</p>
      ) : (
        <p className="mt-1 text-sm">{PEOPLE[d.advisors[0]!.id].name}</p>
      )}
      {waiting > 0 && <p className="mt-1 font-medium text-warn-700">{waiting === 1 ? 'Une question attend votre réponse.' : `${waiting} questions attendent votre réponse.`}</p>}
      {last && (
        <p className="mt-1 text-sm">
          Dernier avis : {VERDICT_LABEL[last.verdict]}{' '}
          {staleSections(d, last).length ? <Chip tone="warn">À réexaminer</Chip> : <Chip tone="ok">À jour</Chip>}
        </p>
      )}
      <TextLink to={`${base}/echanges`} className="mt-2 inline-block">{d.advisors.length ? 'Échanges et avis' : 'Préparer mes questions'}</TextLink>
    </Panel>
  )
}

function SideDecision() {
  const { dossier: d, base } = useDossierCtx()
  const last = d.decisions[d.decisions.length - 1]!
  return (
    <Panel>
      <Eyebrow>Votre dernière décision</Eyebrow>
      <p className="mt-1 font-semibold">{DECISION_LABEL[last.choice]}</p>
      <p className="text-sm text-muted">{formatDay(last.at)} — {last.reason}</p>
      <p className="mt-1 text-sm text-muted">C'est la décision du porteur, pas un avis du conseiller ni une approbation d'AGRIA.</p>
      <TextLink to={`${base}/echanges#decision`} className="mt-2 inline-block">Revoir</TextLink>
    </Panel>
  )
}

/** Conseiller : comprendre le dossier en une minute, et voir ce qui l'attend. */
function AdvisorOverview() {
  const { dossier: d, checks, base } = useDossierCtx()
  const { toAnswer, request, stale } = advisorReasons(d)
  const open = checks.filter((c) => c.level !== 'a_completer')
  const notYet = checks.filter((c) => c.level === 'a_completer')
  const since = d.advisors.find((a) => a.id === 'ndiaye')?.since
  const keyFacts = ['localisation', 'culture', 'periode', 'acces_terrain', 'eau', 'debouches']
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`Dossier de ${PEOPLE[d.owner].name} · ${d.profile === 'producteur' ? 'producteur' : 'débutant'} · ${d.campaign}`} title={d.projectName}>
        <p>« {d.idea} »</p>
        {since && <p className="text-sm">Vous êtes attribuée à ce dossier depuis le {formatDay(since)}. Les informations du porteur sont en lecture seule.</p>}
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-6">
          <Panel label="Contexte en bref">
            <SectionTitle>Contexte en bref</SectionTitle>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {keyFacts.map((k) => {
                const f = d.facts[k] ?? EMPTY
                return (
                  <div key={k}>
                    <dt className="text-sm text-muted">{factLabel(k, d.profile)}</dt>
                    <dd className="font-medium">{describe(k, f)}</dd>
                    {f.status !== 'non_renseigne' && f.status !== 'inconnu' && <dd className="text-sm text-muted">{HOW_KNOWN[f.status]}</dd>}
                  </div>
                )
              })}
            </dl>
          </Panel>
          <Panel label="Points ouverts">
            <SectionTitle>Points ouverts ({open.length})</SectionTitle>
            <ul className="divide-y divide-line">
              {open.map((c) => {
                const action = d.actions.find((a) => a.key === c.actionKey)
                const subject = SUBJECTS.find((s) => s.facts.includes(c.factKey))!
                return (
                  <li key={c.key} className="py-3">
                    <p className="font-medium">{c.message}{c.blocking && <span className="ml-2"><Chip tone="warn">Bloquant</Chip></span>}</p>
                    <p className="text-sm text-muted">{c.why}</p>
                    <p className="mt-1 text-sm">
                      <TextLink to={`${base}/sujet/${subject.key}`}>Consulter le sujet « {subject.title} »</TextLink>
                      {action && <> · Démarche : {action.title} ({action.status === 'terminee' ? `terminée, résultat ${action.result ? OUTCOME_LABEL[action.result.outcome].toLowerCase() : ''}` : 'non terminée'})</>}
                    </p>
                  </li>
                )
              })}
            </ul>
            {notYet.length > 0 && <p className="mt-2 text-sm text-muted">Pas encore abordé par le porteur : {notYet.map((c) => factLabel(c.factKey, d.profile)).join(', ')}.</p>}
          </Panel>
        </div>
        <aside aria-label="Votre intervention" className="space-y-4">
          <section className="rounded-xl bg-surface p-5 ring-2 ring-brand-700/40">
            <h2 className="text-lg font-semibold">Votre intervention</h2>
            {d.archivedAt ? (
              <p className="mt-1 text-sm">Campagne archivée : consultation seulement.</p>
            ) : (
              <ul className="mt-2 space-y-4">
                {toAnswer > 0 && (
                  <li>
                    <p className="font-medium">{toAnswer === 1 ? 'Une question du porteur attend votre réponse :' : `${toAnswer} questions du porteur attendent votre réponse, dont :`}</p>
                    {(() => { const q = d.threads.find((m) => questionState(d, m, 'conseiller') === 'a_repondre')!; return <p className="mt-1 text-sm">« {q.replies.length ? q.replies[q.replies.length - 1]!.body : q.body} » <span className="text-muted">— à propos de « {q.target.label} »</span></p> })()}
                    <ButtonLink to={`${base}/echanges`} className="mt-2">Répondre</ButtonLink>
                  </li>
                )}
                {request && (
                  <li>
                    <p className="font-medium">Relecture demandée le {formatDay(request.at)}{request.note ? ` : « ${request.note} »` : ''}</p>
                    <ButtonLink to={`${base}/avis`} variant={toAnswer ? 'secondary' : 'primary'} className="mt-2">Rédiger un avis</ButtonLink>
                  </li>
                )}
                {!request && stale.length > 0 && (
                  <li>
                    <p className="font-medium">Votre dernier avis est à réexaminer : le porteur a modifié {stale.map((s) => s === 'contexte' ? 'le projet' : s === 'plan' ? 'les démarches' : 'le budget').join(' et ')} depuis.</p>
                    <ButtonLink to={`${base}/avis`} variant={toAnswer ? 'secondary' : 'primary'} className="mt-2">Réexaminer et rédiger un avis</ButtonLink>
                  </li>
                )}
                {toAnswer === 0 && !request && stale.length === 0 && (
                  <li>
                    <p>Aucune intervention attendue pour l'instant.</p>
                    <p className="mt-1 text-sm text-muted">Vous pouvez poser une question sur un sujet ou donner un avis à tout moment.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ButtonLink to={`${base}/echanges`} variant="secondary">Échanges</ButtonLink>
                      <ButtonLink to={`${base}/avis`} variant="secondary">Donner un avis</ButtonLink>
                    </div>
                  </li>
                )}
              </ul>
            )}
          </section>
          {d.reviews.length > 0 && (
            <Panel>
              <Eyebrow>Dernier avis</Eyebrow>
              <p className="mt-1 font-medium">{VERDICT_LABEL[d.reviews[d.reviews.length - 1]!.verdict]}</p>
              <p className="text-sm text-muted">{formatDay(d.reviews[d.reviews.length - 1]!.at)}</p>
            </Panel>
          )}
          <Note tone="neutral">Votre avis porte sur la préparation du dossier ; il ne garantit ni la faisabilité ni la rentabilité du projet.</Note>
        </aside>
      </div>
    </div>
  )
}
