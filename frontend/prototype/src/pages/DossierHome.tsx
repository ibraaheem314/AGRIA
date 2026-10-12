import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { advisorReasons } from '../Shell'
import { factLabel, howKnown, SUBJECTS } from '../data/facts'
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

/** Porteur : un résumé bref, une étape mise en avant, puis les sujets ; le détail est dans chaque sujet. */
function Synthesis() {
  const { dossier: d, checks, canEdit, base } = useDossierCtx()
  const [params] = useSearchParams()
  const first = params.get('premiere') === '1'
  const archived = Boolean(d.archivedAt)
  const step = canEdit ? nextStep(d, checks) : null
  const subjects = subjectsFor(d)
  const summaryKeys = ['culture', 'periode', 'localisation', 'acces_terrain', 'eau', 'debouches'].filter((k) => subjects.some((s) => s.facts.includes(k)))

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`${d.campaign}${d.profile === 'producteur' ? ' · producteur' : ''}`} title={d.projectName}>
        {d.idea && <p>« {d.idea} »</p>}
      </PageHeader>

      <section aria-labelledby="resume" className="space-y-2">
        <h2 id="resume" className="text-sm font-semibold uppercase tracking-wider text-muted">
          {first ? 'Votre point de départ' : archived ? 'Ce qui était indiqué' : 'Ce que vous avez indiqué'}
        </h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
          {summaryKeys.map((k) => {
            const f = d.facts[k] ?? EMPTY
            const text = d.deferred.includes(k) && f.status === 'non_renseigne' ? 'à répondre plus tard' : f.status === 'non_renseigne' ? 'pas encore abordé' : f.status === 'inconnu' ? 'inconnu pour l’instant' : describe(k, f)
            return (
              <li key={k} className="text-sm">
                <span className="text-muted">{factLabel(k, d.profile)} : </span>
                <span className={f.status === 'declare' || f.status === 'estime' || f.status === 'verifie' ? 'font-medium' : 'italic text-muted'}>{text}</span>
              </li>
            )
          })}
        </ul>
        {first && <p className="text-sm text-muted">Ce n'est pas un avis sur la faisabilité : c'est ce qui est connu, ce qui ne l'est pas encore, et une première étape.</p>}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-6">
          {canEdit && (step ? (
            <Highlight eyebrow="À faire maintenant" title={step.title} action={<ButtonLink to={`${base}${step.to}`} variant="onDark">{step.label}</ButtonLink>}>
              {step.why}
            </Highlight>
          ) : (
            <Panel>
              <h2 className="font-semibold">Aucune démarche ouverte pour l'instant</h2>
              <p className="mt-1 text-sm text-muted">Vous pouvez compléter un sujet, préparer le budget ou écrire au conseiller.</p>
            </Panel>
          ))}
          {canEdit && (
            <p className="text-sm text-muted">
              Ou bien : <TextLink to={`${base}/demarches`}>choisir une autre démarche</TextLink> · <TextLink to={`${base}/budget`}>préparer le budget</TextLink> · compléter un sujet ci-dessous.
            </p>
          )}

          <section aria-labelledby="sujets">
            <SectionTitle id="sujets">{archived ? 'Les sujets à l’archivage' : 'Les sujets du dossier'}</SectionTitle>
            <ul className="divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-line">
              {subjects.map((s) => {
                const state = subjectState(d, s, checks)
                const open = checks.find((c) => s.facts.includes(c.factKey) && c.level !== 'a_completer')
                const related = d.actions.filter((a) => a.factKey && s.facts.includes(a.factKey))
                const deferred = s.facts.some((k) => d.deferred.includes(k) && (d.facts[k] ?? EMPTY).status === 'non_renseigne')
                const line = open ? open.message : state === 'non_aborde' ? (deferred ? 'Remis à plus tard' : 'Pas encore abordé') : state === 'rien_signale' ? 'Rien n’est signalé par les règles disponibles' : 'Certaines informations restent à donner'
                return (
                  <li key={s.key}>
                    <Link to={`${base}/sujet/${s.key}`} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3.5 hover:bg-canvas focus-visible:bg-canvas sm:px-5">
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{s.title}</span>
                        <span className="block text-sm text-muted">{line}{related.length ? ` · ${related.length} démarche${related.length > 1 ? 's' : ''}` : ''}</span>
                      </span>
                      <Chip tone={SUBJECT_TONE[state]}>{subjectStateLabel(state, archived)}</Chip>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-sm text-muted">Le détail, les démarches et l'historique de chaque sujet s'ouvrent en le sélectionnant. « Rien de signalé » n'est pas une validation.</p>
          </section>
        </div>
        <StatePanel />
      </div>
    </div>
  )
}

/** Un seul panneau d'état : informations, démarches, budget, conseiller, décision. */
function StatePanel() {
  const { dossier: d, base } = useDossierCtx()
  const archived = Boolean(d.archivedAt)
  const facts = subjectsFor(d).flatMap((s) => s.facts)
  const count = (st: string[]) => facts.filter((k) => st.includes((d.facts[k] ?? EMPTY).status)).length
  const by = (s: string) => d.actions.filter((a) => a.status === s).length
  const open = by('a_faire') + by('en_cours') + by('bloquee')
  const t = budgetTotals(d.budget)
  const waiting = d.threads.filter((m) => questionState(d, m, 'porteur') === 'a_repondre').length
  const review = d.reviews[d.reviews.length - 1]
  const decision = d.decisions[d.decisions.length - 1]
  const row = (label: string, body: ReactNode, to?: string, link?: string) => (
    <div className="py-2.5">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm">{body}{to && <> <TextLink to={to}>{link}</TextLink></>}</dd>
    </div>
  )
  return (
    <aside aria-label="État du dossier" className="self-start rounded-xl bg-surface px-4 py-2 ring-1 ring-line sm:px-5">
      <h2 className="pt-2 font-semibold">État du dossier</h2>
      <dl className="divide-y divide-line">
        {row('Informations', `${count(['declare', 'estime', 'verifie'])} connues · ${count(['inconnu'])} inconnues · ${count(['non_renseigne'])} pas encore abordées`)}
        {row('Démarches', archived ? `À l'archivage : ${open} restai${open > 1 ? 'ent' : 't'} à faire · ${by('terminee')} terminée${by('terminee') > 1 ? 's' : ''}.` : `${open} ouverte${open > 1 ? 's' : ''} · ${by('terminee')} terminée${by('terminee') > 1 ? 's' : ''}.`, `${base}/demarches`, 'Voir')}
        {row('Budget', t.count === 0 ? 'Aucun poste pour l’instant.' : <>{t.priced > 0 ? `${formatFcfa(t.priced)} chiffrés` : 'Rien de chiffré'}{t.missing > 0 && <span className="text-warn-700"> · {t.missing} à chiffrer, total inconnu</span>}.</>, `${base}/budget`, 'Ouvrir')}
        {row('Conseiller', <>{d.advisors.length === 0 ? 'Aucun conseiller attribué.' : PEOPLE[d.advisors[0]!.id].name}{waiting > 0 && <span className="font-medium text-warn-700"> Une réponse est attendue de vous.</span>}{review && <> Dernier avis : {VERDICT_LABEL[review.verdict].toLowerCase()}{staleSections(d, review).length ? ', à réexaminer' : ''}.</>}</>, `${base}/echanges`, d.advisors.length ? 'Échanges' : 'Préparer mes questions')}
        {decision && row('Votre dernière décision', <>{DECISION_LABEL[decision.choice]} ({formatDay(decision.at)}). <span className="text-muted">Décision du porteur, pas un avis ni une approbation d'AGRIA.</span></>)}
      </dl>
      <p className="pb-3 pt-1 text-xs text-muted">Démarches proposées à partir d'un contenu générique, non relu par un spécialiste.</p>
    </aside>
  )
}

export function subjectStateLabel(state: SubjectState, archived: boolean): string {
  if (!archived) return SUBJECT_STATE_LABEL[state]
  return { non_aborde: 'Non abordé', inconnu: 'Restait inconnu', ouvert: 'Restait à éclaircir', rien_signale: 'Rien de signalé' }[state]
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
        <aside aria-label="Votre intervention" className="space-y-4 lg:order-2">
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
        <div className="space-y-6 lg:order-1">
          <Panel label="Contexte en bref">
            <SectionTitle>Contexte en bref</SectionTitle>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {keyFacts.map((k) => {
                const f = d.facts[k] ?? EMPTY
                return (
                  <div key={k}>
                    <dt className="text-sm text-muted">{factLabel(k, d.profile, 'conseiller')}</dt>
                    <dd className="font-medium">{describe(k, f)}</dd>
                    {f.status !== 'non_renseigne' && f.status !== 'inconnu' && <dd className="text-sm text-muted">{howKnown(f.status, 'conseiller')}</dd>}
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
            {notYet.length > 0 && <p className="mt-2 text-sm text-muted">Pas encore abordé par le porteur : {notYet.map((c) => factLabel(c.factKey, d.profile, 'conseiller')).join(', ')}.</p>}
          </Panel>
        </div>
      </div>
    </div>
  )
}
