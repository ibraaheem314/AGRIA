import { Link, useParams } from 'react-router'
import { FACT_BY_KEY, factLabel, HOW_KNOWN, SUBJECTS } from '../data/facts'
import { describe, EMPTY, OUTCOME_LABEL, QUESTION_STATE_LABEL, questionState, SUBJECT_STATE_LABEL, subjectState, type Level } from '../data/model'
import { useStore } from '../data/store'
import { useDossierCtx } from '../dossier'
import { Button, ButtonLink, Chip, Note, PageHeader, Panel, SectionTitle, TextLink } from '../ui'
import { SUBJECT_TONE } from './DossierHome'

export const LEVEL_LABEL: Record<Level, string> = { a_completer: 'Pas encore abordé', a_clarifier: 'À éclaircir', a_verifier: 'À confirmer' }

export function SubjectPage() {
  const { subjectKey } = useParams()
  const { dossier: d, checks, canEdit, role, base } = useDossierCtx()
  const { ops } = useStore()
  const subject = SUBJECTS.find((s) => s.key === subjectKey)
  if (!subject) return <p>Sujet introuvable. <TextLink to={base}>Retour</TextLink></p>
  const facts = subject.facts.filter((k) => !FACT_BY_KEY[k]!.profiles || FACT_BY_KEY[k]!.profiles!.includes(d.profile))
  const state = subjectState(d, { ...subject, facts }, checks)
  const related = d.actions.filter((a) => a.factKey && facts.includes(a.factKey))
  const threads = d.threads.filter((m) => m.target.type === 'information' && facts.includes(m.target.ref))
  const canAsk = !d.archivedAt && (role === 'conseiller' || d.advisors.length > 0 || canEdit)
  const anyOpen = checks.some((c) => facts.includes(c.factKey) && c.level !== 'a_completer')

  return (
    <div className="space-y-6">
      <p><TextLink to={base}>{role === 'conseiller' ? '← Vue d’ensemble' : '← Projet'}</TextLink></p>
      <PageHeader eyebrow="Sujet" title={subject.title}>
        <Chip tone={SUBJECT_TONE[state]}>{SUBJECT_STATE_LABEL[state]}</Chip>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-4">
          {facts.map((k) => {
            const f = d.facts[k] ?? EMPTY
            const check = checks.find((c) => c.factKey === k)
            const deferred = d.deferred.includes(k)
            return (
              <Panel key={k} as="article" label={factLabel(k, d.profile)}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{factLabel(k, d.profile)}</h2>
                  <span className="flex flex-wrap gap-1.5">
                    <Chip tone={f.status === 'inconnu' ? 'warn' : f.status === 'non_renseigne' ? 'muted' : f.status === 'verifie' ? 'info' : 'neutral'}>{HOW_KNOWN[f.status]}</Chip>
                    {deferred && <Chip tone="muted">Remis à plus tard</Chip>}
                    {f.carried && <Chip tone="warn">Repris, à reconfirmer</Chip>}
                  </span>
                </div>
                {f.status !== 'non_renseigne' && f.status !== 'inconnu' && <p className="mt-2 text-lg">{describe(k, f)}</p>}
                {f.source && <p className="mt-1 text-sm text-muted">Source ou précision : {f.source}</p>}
                <p className="mt-2 text-sm text-muted">{FACT_BY_KEY[k]!.why}</p>
                {check && check.level !== 'a_completer' && (
                  <div className="mt-3">
                    <Note tone="warn">
                      <strong>{LEVEL_LABEL[check.level]}{check.blocking ? ' (bloquant)' : ''} :</strong> {check.message}.
                      {f.status === 'verifie' && ' Une information confirmée peut décrire une situation encore à régler.'}
                    </Note>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {canEdit && (
                    <ButtonLink to={`${base}/info/${k}`} variant={f.status === 'non_renseigne' ? 'primary' : 'secondary'}>
                      {f.status === 'non_renseigne' ? 'Répondre' : 'Modifier'}<span className="sr-only"> : {factLabel(k, d.profile)}</span>
                    </ButtonLink>
                  )}
                  {canEdit && f.status === 'non_renseigne' && !deferred && (
                    <Button variant="quiet" onClick={() => ops.setDeferred(d.id, k, true)}>Plus tard</Button>
                  )}
                  {!canEdit && role === 'porteur' && <TextLink to={`${base}/info/${k}`}>Consulter l'information et son historique</TextLink>}
                  {role === 'conseiller' && <TextLink to={`${base}/info/${k}`}>Consulter l'information et son historique</TextLink>}
                  {canAsk && (
                    <Link to={`${base}/echanges?cible=information:${k}#nouveau`} className="inline-flex min-h-11 items-center px-2 font-medium text-brand-800 underline underline-offset-2">
                      {role === 'conseiller' ? 'Poser une question au porteur' : d.advisors.length ? 'Poser une question au conseiller' : 'Préparer une question'}
                      <span className="sr-only"> sur « {factLabel(k, d.profile)} »</span>
                    </Link>
                  )}
                </div>
              </Panel>
            )
          })}
          {!anyOpen && state !== 'non_aborde' && (
            <p className="text-sm text-muted">Rien n'est signalé sur ce sujet par les règles disponibles. Ce n'est pas une validation du projet.</p>
          )}
        </div>
        <aside className="space-y-4" aria-label="Démarches et questions liées">
          <Panel>
            <SectionTitle>Démarches liées</SectionTitle>
            {related.length === 0 ? (
              <p className="text-sm text-muted">Aucune démarche pour ce sujet. Elles apparaissent quand une information est inconnue ou à confirmer.</p>
            ) : (
              <ul className="space-y-3">
                {related.map((a) => (
                  <li key={a.id}>
                    <TextLink to={`${base}/demarches/${a.id}`}>{a.title}</TextLink>
                    <p className="text-sm text-muted">
                      {a.status === 'terminee' ? `Terminée${a.result ? ` · résultat ${OUTCOME_LABEL[a.result.outcome].toLowerCase()}` : ''}` : a.status === 'en_cours' ? 'En cours' : a.status === 'bloquee' ? 'Bloquée' : 'À faire'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel>
            <SectionTitle>Questions sur ce sujet</SectionTitle>
            {threads.length === 0 ? (
              <p className="text-sm text-muted">Aucune question pour l'instant.</p>
            ) : (
              <ul className="space-y-3">
                {threads.map((m) => {
                  const st = questionState(d, m, role)
                  return (
                    <li key={m.id}>
                      <p className="text-sm">« {m.body} »</p>
                      {st && <Chip tone={st === 'a_repondre' ? 'warn' : st === 'close' ? 'ok' : 'neutral'}>{QUESTION_STATE_LABEL[st]}</Chip>}
                    </li>
                  )
                })}
              </ul>
            )}
            <TextLink to={`${base}/echanges`} className="mt-2 inline-block">Tous les échanges</TextLink>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
