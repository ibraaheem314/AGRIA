import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { Button, ButtonLink, Chip, Note, PageHeader, Panel, SectionTitle, TextLink } from '../ui'
import {
  daysBetween, DemoProvider, estimatedStage, formatDay, lastObservation, lastOp, OP_LABEL, plan, STAGE_LABEL, TODAY,
  TRANSPLANT_WINDOW, addDays, useDemo, type Entry, type PlanLine,
} from './data'

/*
 * Démonstration du suivi de campagne (mission « démonstration de valeur », 13/10/2026).
 * Isolée du prototype UX1/UX2 (route /suivi, état et stockage propres) et de l'application
 * connectée. Réponses scénarisées : aucun modèle, aucune analyse d'image, aucune consigne
 * agronomique applicable.
 */

export function SuiviLayout() {
  return (
    <DemoProvider>
      <Frame />
    </DemoProvider>
  )
}

function Frame() {
  const { ops } = useDemo()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const links = [
    { to: '/suivi', label: 'Ma campagne', end: true },
    { to: '/suivi/journal', label: 'Journal', end: false },
    { to: '/suivi/bilan', label: 'Bilan', end: false },
    { to: '/suivi/demander', label: 'Demander', end: false },
  ]
  return (
    <div className="min-h-dvh bg-canvas pb-20 sm:pb-0">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        Aller au contenu
      </a>
      <div role="note" className="bg-ink text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 text-sm">
          <p className="font-semibold">Démonstration fictive — réponses scénarisées</p>
          {!confirm ? (
            <button type="button" className="min-h-9 underline underline-offset-2" onClick={() => setConfirm(true)}>Recommencer</button>
          ) : (
            <span className="flex items-center gap-2">
              <button type="button" className="min-h-9 rounded bg-white px-2 font-medium text-ink" onClick={() => { ops.reset(); setConfirm(false); navigate('/suivi') }}>
                Confirmer : revenir au début
              </button>
              <button type="button" className="min-h-9 underline" onClick={() => setConfirm(false)}>Annuler</button>
            </span>
          )}
          <Link to="/suivi/a-propos" className="min-h-9 content-center underline underline-offset-2">À propos</Link>
        </div>
      </div>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <p className="text-lg font-bold text-brand-800">AGRIA <span className="font-normal text-muted">· suivi de campagne</span></p>
        </div>
        <nav aria-label="Navigation de la démonstration" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface sm:static sm:border-t-0">
          <ul className="mx-auto flex max-w-5xl">
            {links.map((l) => (
              <li key={l.to} className="flex-1 sm:flex-none">
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center justify-center whitespace-nowrap border-t-4 px-1 text-sm font-medium sm:border-b-4 sm:border-t-0 sm:px-4 ${
                      isActive ? 'border-brand-700 text-brand-800' : 'border-transparent text-muted hover:text-ink'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="contenu" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-6 focus:outline-none">
        <Outlet />
      </main>
    </div>
  )
}

/** Prévu, observé, réalisé, proposition : toujours écrits en clair. */
export function KindChip({ kind }: { kind: 'prevu' | 'observe' | 'realise' | 'proposition' }) {
  const map = {
    prevu: { tone: 'muted', label: 'Prévu' },
    observe: { tone: 'info', label: 'Observé' },
    realise: { tone: 'ok', label: 'Réalisé' },
    proposition: { tone: 'neutral', label: 'Proposition' },
  } as const
  return <Chip tone={map[kind].tone}>{map[kind].label}</Chip>
}

export function Scripted({ children, sources }: { children: ReactNode; sources: string[] }) {
  return (
    <section aria-label="Réponse de l'assistant" className="rounded-xl bg-surface p-4 ring-2 ring-brand-700/40 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-800">Assistant · réponse scénarisée</p>
      <div className="mt-2 space-y-3">{children}</div>
      <p className="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        S'appuie sur : {sources.map((s) => <Chip key={s}>{s}</Chip>)}
      </p>
    </section>
  )
}

/** Contexte de la campagne, court, en tête de chaque situation. */
export function CampaignContext() {
  const { state } = useDemo()
  const est = estimatedStage(state)
  const obs = lastObservation(state)
  return (
    <Panel label="Contexte de la campagne" className="text-sm">
      <p className="font-semibold text-ink">Ndèye (fictive) · oignon, exemple illustratif · parcelle fictive</p>
      <dl className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-3">
        <div><dt className="text-muted">Repiquage (réalisé)</dt><dd className="font-medium">{formatDay(state.transplant)}</dd></div>
        <div><dt className="text-muted">Stade estimé d'après la date</dt><dd className="font-medium">{STAGE_LABEL[est.stage]} · {est.weeks} semaines</dd></div>
        <div>
          <dt className="text-muted">Dernier stade observé</dt>
          <dd className="font-medium">{obs?.stage ? `${STAGE_LABEL[obs.stage]} · ${formatDay(obs.date)}` : 'Aucune observation'}</dd>
        </div>
      </dl>
    </Panel>
  )
}

// ---- A. Où en est ma culture et que dois-je vérifier maintenant ? ------------------------------

type Check = { key: string; title: string; why: string; action: ReactNode }

export function CampaignHome() {
  const { state } = useDemo()
  const lines = plan(state)
  const obsDue = lines.find((l) => l.key === 'observation' && l.state !== 'a_venir' && !l.done)
  const apport = lines.find((l) => l.key === 'apport' && l.state === 'en_cours' && !l.done)
  const water = lastOp(state, 'arrosage')
  const waterGap = water ? daysBetween(water.date, TODAY) : null
  const followUps = state.problems.filter((p) => p.status === 'ouvert')
  const checks: Check[] = []
  if (state.clarification) {
    checks.push({
      key: 'clarifier',
      title: 'Clarifier une observation qui ne correspond pas à la date de repiquage',
      why: `Vous avez observé « ${STAGE_LABEL[state.clarification.observed]} » le ${formatDay(state.clarification.entryDate)}, alors que la date de repiquage situe la culture à « ${STAGE_LABEL[estimatedStage(state).stage]} ». Tant que ce n'est pas clarifié, les propositions restent prudentes.`,
      action: <ButtonLink to="/suivi/clarifier">Clarifier</ButtonLink>,
    })
  }
  for (const p of followUps) {
    checks.push({
      key: `suivi-${p.id}`,
      title: `Revoir le problème observé le ${formatDay(p.openedOn)}`,
      why: p.followUpOn ? `Revue prévue par vous le ${formatDay(p.followUpOn)}. Décrire les mêmes éléments permet de comparer.` : 'Aucune date de revue choisie. Décrire les mêmes éléments permet de comparer.',
      action: <ButtonLink to={`/suivi/revoir/${p.id}`}>Faire l'observation de suivi</ButtonLink>,
    })
  }
  if (obsDue) {
    const last = lastObservation(state)
    checks.push({
      key: 'observer',
      title: 'Observer les feuilles et les plants',
      why: `${last ? `Dernière observation le ${formatDay(last.date)}. ` : ''}La fiche d'exemple place une observation entre le ${formatDay(obsDue.from)} et le ${formatDay(obsDue.to)}.`,
      action: <ButtonLink to="/suivi/observer">Noter une observation</ButtonLink>,
    })
  }
  if (waterGap !== null && waterGap >= 3) {
    checks.push({
      key: 'arrosage',
      title: `Aucun arrosage déclaré depuis le ${formatDay(water!.date)}`,
      why: "Ce n'est pas la preuve qu'il n'a pas eu lieu : seulement qu'il n'est pas noté. Le noter rend les réponses plus justes.",
      action: <ButtonLink to="/suivi/action?op=arrosage" variant="secondary">Déclarer un arrosage</ButtonLink>,
    })
  }
  if (apport) {
    checks.push({
      key: 'apport',
      title: 'Apport prévu par la fiche : pas encore déclaré',
      why: `Fenêtre de la fiche d'exemple : du ${formatDay(apport.from)} au ${formatDay(apport.to)}. Le contenu de l'apport n'est pas détaillé dans la démonstration.`,
      action: <ButtonLink to="/suivi/action?op=apport" variant="secondary">Déclarer s'il est fait</ButtonLink>,
    })
  }
  const [primary, ...others] = checks

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Situation A" title="Où en est ma culture ?">
        Ce qu'il est utile de vérifier maintenant, d'après votre journal et une fiche d'exemple.
      </PageHeader>
      <CampaignContext />

      {primary && (
        <section aria-label="À vérifier maintenant" className="rounded-xl bg-brand-800 p-5 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">À vérifier maintenant</p>
          <h2 className="mt-1 text-xl font-semibold">{primary.title}</h2>
          <p className="mt-1 text-brand-50">{primary.why}</p>
          <div className="mt-4 [&_a]:bg-surface [&_a]:text-brand-800">{primary.action}</div>
        </section>
      )}
      {others.length > 0 && (
        <Panel label="Aussi à vérifier">
          <SectionTitle>Aussi à vérifier</SectionTitle>
          <ul className="divide-y divide-line">
            {others.map((c) => (
              <li key={c.key} className="py-3">
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted">{c.why}</p>
                <div className="mt-2">{c.action}</div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <ButtonLink to="/suivi/observer?probleme=1" variant="secondary">J'observe un problème sur les feuilles</ButtonLink>
        <ButtonLink to="/suivi/action" variant="secondary">J'ai réalisé une action</ButtonLink>
      </div>

      <PlanPanel lines={plan(state)} />
    </div>
  )
}

function PlanPanel({ lines }: { lines: PlanLine[] }) {
  const { state } = useDemo()
  const sowing = lastOp(state, 'semis')
  const repiq = lastOp(state, 'repiquage')
  const late = sowing && repiq ? daysBetween(addDays(sowing.date, TRANSPLANT_WINDOW[1]), repiq.date) : 0
  return (
    <Panel label="Le plan de la campagne">
      <SectionTitle aside={<Chip tone="muted">Fiche d'exemple, non relue</Chip>}>Le plan, recalé sur vos dates réelles</SectionTitle>
      <ul className="divide-y divide-line">
        {repiq && sowing && (
          <li className="flex flex-wrap items-start justify-between gap-2 py-2.5">
            <span>
              <span className="block font-medium">Repiquage</span>
              <span className="block text-sm text-muted">
                Prévu du {formatDay(addDays(sowing.date, TRANSPLANT_WINDOW[0]))} au {formatDay(addDays(sowing.date, TRANSPLANT_WINDOW[1]))} · réalisé le {formatDay(repiq.date)}
                {late > 0 ? ` (${late} jours après la fenêtre)` : ''}
              </span>
            </span>
            <KindChip kind="realise" />
          </li>
        )}
        {lines.map((l) => (
          <li key={l.key} className="flex flex-wrap items-start justify-between gap-2 py-2.5">
            <span>
              <span className="block font-medium">{l.title}</span>
              <span className="block text-sm text-muted">
                Du {formatDay(l.from)} au {formatDay(l.to)} ·{' '}
                {l.done
                  ? `${l.done.kind === 'realise' ? 'réalisé' : 'observé'} le ${formatDay(l.done.date)}`
                  : l.state === 'a_venir'
                    ? 'à venir'
                    : l.state === 'en_cours'
                      ? 'dans la fenêtre, pas encore déclaré'
                      : 'fenêtre passée, pas encore déclaré'}
              </span>
              {l.note && <span className="block text-sm text-muted">{l.note}</span>}
            </span>
            <KindChip kind={l.done ? (l.done.kind === 'realise' ? 'realise' : 'observe') : 'prevu'} />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted">
        « Pas encore déclaré » ne veut pas dire « pas fait ». Quand une date réelle change, le prévu est recalé ; les opérations déjà
        déclarées restent telles quelles.
      </p>
    </Panel>
  )
}

// ---- Journal -----------------------------------------------------------------------------------

export function JournalPage() {
  const { state } = useDemo()
  const entries = [...state.entries].sort((a, b) => b.date.localeCompare(a.date) || b.recordedOn.localeCompare(a.recordedOn))
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Mémoire de la campagne" title="Journal">
        Ce que vous avez confirmé : opérations réalisées et observations. Une proposition de l'assistant n'y entre qu'après votre confirmation.
      </PageHeader>
      <Panel label="Entrées du journal">
        <ul className="divide-y divide-line">
          {entries.map((e) => <EntryRow key={e.id} e={e} />)}
        </ul>
      </Panel>
      {state.transplantHistory.length > 0 && (
        <Panel label="Corrections">
          <SectionTitle>Corrections de dates</SectionTitle>
          <ul className="space-y-1 text-sm">
            {state.transplantHistory.map((h, i) => (
              <li key={i}>Repiquage : {formatDay(h.from)} → {formatDay(h.to)}, corrigé le {formatDay(h.on)} ({h.reason})</li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}

function EntryRow({ e }: { e: Entry }) {
  const { state } = useDemo()
  const problem = e.problemId ? state.problems.find((p) => p.id === e.problemId) : undefined
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{formatDay(e.date)} · {e.op ? OP_LABEL[e.op] : e.title}</p>
        <KindChip kind={e.kind} />
      </div>
      {e.stage && <p className="text-sm">Stade observé : {STAGE_LABEL[e.stage]}</p>}
      {e.details.length > 0 && (
        <ul className="mt-1 list-disc pl-5 text-sm text-muted">
          {e.details.map((d) => <li key={d}>{d}</li>)}
        </ul>
      )}
      {e.photo && <p className="mt-1 text-sm text-muted">Photo jointe (image d'exemple de la démonstration)</p>}
      {problem && <p className="mt-1 text-sm">Lié au problème observé le {formatDay(problem.openedOn)} ({problem.status === 'ouvert' ? 'suivi en cours' : 'clos'})</p>}
    </li>
  )
}

// ---- Bilan -------------------------------------------------------------------------------------

export function BilanPage() {
  const { state } = useDemo()
  const sowing = lastOp(state, 'semis')
  const repiq = lastOp(state, 'repiquage')
  const late = sowing && repiq ? daysBetween(addDays(sowing.date, TRANSPLANT_WINDOW[1]), repiq.date) : 0
  const done = state.entries.filter((e) => e.kind === 'realise')
  const byOp = Object.entries(
    done.reduce<Record<string, number>>((acc, e) => ({ ...acc, [OP_LABEL[e.op ?? 'autre']]: (acc[OP_LABEL[e.op ?? 'autre']] ?? 0) + 1 }), {}),
  )
  const obs = state.entries.filter((e) => e.kind === 'observe')
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Aperçu" title="Bilan de la campagne">
        Les faits que vous avez déclarés, à la date du {formatDay(TODAY)}. La campagne n'est pas terminée.
      </PageHeader>
      <Panel label="Calendrier">
        <SectionTitle>Prévu et réalisé</SectionTitle>
        {repiq && sowing && (
          <p>
            Repiquage réalisé le {formatDay(repiq.date)}
            {late > 0 ? `, ${late} jours après la fenêtre de la fiche d'exemple` : ', dans la fenêtre de la fiche d\'exemple'}.
            {repiq.details.filter((d) => d.startsWith('Raison')).map((d) => <span key={d}> {d}.</span>)}
          </p>
        )}
        <p className="mt-1 text-sm text-muted">Le plan suivant a été recalé sur cette date ; les opérations déjà déclarées n'ont pas été modifiées.</p>
      </Panel>
      <Panel label="Opérations réalisées">
        <SectionTitle>Opérations réalisées (déclarées)</SectionTitle>
        <ul className="list-disc pl-5">
          {byOp.map(([label, n]) => <li key={label}>{label} : {n}</li>)}
        </ul>
        <p className="mt-1 text-sm text-muted">Une opération non déclarée n'est pas comptée ; elle n'est pas pour autant présumée non faite.</p>
      </Panel>
      <Panel label="Observations et problèmes">
        <SectionTitle>Observations et problèmes</SectionTitle>
        <p>{obs.length} observation{obs.length > 1 ? 's' : ''} enregistrée{obs.length > 1 ? 's' : ''}.</p>
        {state.problems.length === 0 ? (
          <p className="mt-1 text-muted">Aucun problème signalé.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {state.problems.map((p) => {
              const actions = state.entries.filter((e) => e.problemId === p.id && e.kind === 'realise')
              const followUps = state.entries.filter((e) => e.problemId === p.id && e.kind === 'observe').slice(1)
              return (
                <li key={p.id} className="rounded-lg bg-canvas p-3">
                  <p className="font-medium">Problème observé le {formatDay(p.openedOn)} : {p.summary}</p>
                  <p className="text-sm">
                    Actions déclarées : {actions.length ? actions.map((a) => `${OP_LABEL[a.op ?? 'autre'].toLowerCase()} le ${formatDay(a.date)}`).join(', ') : 'aucune'}.
                  </p>
                  <p className="text-sm">
                    Évolution déclarée : {followUps.length ? followUps.map((f) => `${f.details[0]} (${formatDay(f.date)})`).join(', ') : 'pas encore revue'}.
                  </p>
                  <p className="text-sm">{p.status === 'clos' ? `Clos : ${p.closedReason}` : 'Suivi en cours'}</p>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
      <Panel label="Récolte">
        <SectionTitle>Récolte</SectionTitle>
        <p className="text-muted">Pas encore déclarée. Elle sera notée dans l'unité que vous utilisez (sacs, caisses, kilos), sans conversion inventée.</p>
      </Panel>
      <Note tone="neutral">
        Ce bilan rapporte des faits déclarés. Il ne dit pas si une action a causé une évolution, ni ce qu'un retard a coûté.
      </Note>
    </div>
  )
}

// ---- À propos ----------------------------------------------------------------------------------

export function AboutDemo() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Démonstration" title="Ce que montre cette démonstration">
        Le fonctionnement de l'assistance pendant une campagne, sur un scénario fictif.
      </PageHeader>
      <Panel>
        <SectionTitle>Ce qui est fictif</SectionTitle>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>La personne, la parcelle, les dates et la culture : supports d'illustration, pas un choix de marché.</li>
          <li>Les fenêtres du plan viennent d'une <strong>fiche d'exemple non relue</strong> : elles montrent le recalage sur les dates réelles, pas une consigne à appliquer.</li>
          <li>Les réponses de l'assistant sont <strong>écrites à l'avance</strong>. Aucun modèle d'IA n'est appelé, aucune image n'est analysée.</li>
          <li>Aucune dose, aucun volume, aucun traitement ni diagnostic n'est proposé.</li>
          <li>Rien n'est envoyé : l'état reste dans ce navigateur, séparé du prototype UX1/UX2. « Recommencer » revient au scénario de départ.</li>
        </ul>
      </Panel>
      <Panel>
        <SectionTitle>Ce que la démonstration ne prouve pas</SectionTitle>
        <p>Ni l'utilité pour de vrais producteurs, ni la justesse d'un conseil, ni la faisabilité d'un assistant autonome : ce sont les questions des entretiens et des essais.</p>
      </Panel>
      <p className="flex flex-wrap gap-4">
        <TextLink to="/suivi">Revenir à la campagne</TextLink>
        <a href="/" className="font-medium text-brand-800 underline underline-offset-2">Prototype UX1/UX2 (préparation)</a>
      </p>
    </div>
  )
}

export function ConfirmBar({ children, onCancel }: { children: ReactNode; onCancel?: () => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {children}
      {onCancel && <Button variant="quiet" onClick={onCancel}>Retour</Button>}
    </div>
  )
}
