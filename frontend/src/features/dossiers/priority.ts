import type { Preparation } from '../plan/api'
import type { Relecture } from '../reviews/api'
import type { Dossier } from './api'
import { isDetailed } from './guidance'
import { canEdit } from './roles'

/** Une action proposée à l'accueil : où elle mène et pourquoi elle est proposée. */
export type HomeAction = {
  key: string
  heading: string
  title: string
  why?: string
  to: string
  label: string
}

export type HomePlan = { primary: HomeAction | null; secondary: HomeAction[] }

/**
 * Action principale et actions secondaires de l'accueil du porteur (table de décision dans
 * docs/INTERFACE.md, « Accueil : une seule action principale »). Ordre de présentation seulement :
 * aucune action n'est interdite, aucune dépendance agronomique n'est supposée.
 * Dossier archivé ou consulté par un conseiller : rien à proposer ici.
 */
export function ownerHome(dossier: Dossier, prep: Preparation, questionsToAnswer: number): HomePlan {
  if (!canEdit(dossier)) return { primary: null, secondary: [] }
  const base = `/d/${dossier.id}`
  const debutant = dossier.project.profile === 'debutant'
  // Producteur : vue directe, les justifications restent dans le plan.
  const explain = (text: string | undefined) => (isDetailed(dossier) ? text || undefined : undefined)
  const empty = dossier.facts.filter((f) => f.state.status === 'non_renseigne')
  const blockingEmpty = prep.checks.filter((c) => c.blocking && c.level === 'a_completer')
  const open = prep.actions.filter((a) => a.status !== 'terminee')
  const inProgress = open.find((a) => a.status === 'en_cours')
  const ready = open.find((a) => a.id === prep.next_action_id && a.status === 'a_faire')
  const blocked = open.find((a) => a.status === 'bloquee')

  const candidates: HomeAction[] = []

  if (dossier.status.code === 'differe') {
    candidates.push({
      key: 'reprendre',
      heading: 'Reprise',
      title: 'Reprendre la préparation',
      why: 'Une décision de différer est enregistrée. Pour reprendre, enregistrez une nouvelle décision.',
      to: `${base}/relecture#decisions`,
      label: 'Enregistrer une nouvelle décision',
    })
  }
  if (questionsToAnswer > 0) {
    candidates.push({
      key: 'repondre',
      heading: 'Une réponse est attendue de vous',
      title:
        questionsToAnswer === 1
          ? 'Le conseiller attend votre réponse à une question.'
          : `Le conseiller attend votre réponse à ${questionsToAnswer} questions.`,
      to: `${base}/relecture#messages`,
      label: 'Répondre au conseiller',
    })
  }
  if (inProgress) {
    candidates.push({
      key: 'continuer',
      heading: 'Démarche en cours',
      title: inProgress.title,
      why: explain(inProgress.explanation),
      to: `${base}/plan/${inProgress.id}`,
      label: 'Continuer la démarche',
    })
  }
  const fill: HomeAction | null =
    empty.length === 0
      ? null
      : debutant
        ? {
            key: 'renseigner',
            heading: 'Renseigner le dossier',
            title: `${empty.length} information${empty.length > 1 ? 's' : ''} à renseigner`,
            why: "Une information à la fois, en commençant par le lieu, l'accès au terrain et l'eau. « Je ne sais pas » est une réponse acceptée.",
            to: `${base}/projet/pas-a-pas`,
            label: empty.length === dossier.facts.length ? 'Commencer pas à pas' : 'Continuer pas à pas',
          }
        : (() => {
            const first = blockingEmpty[0]
              ? dossier.facts.find((f) => f.key === blockingEmpty[0]!.fact_key)
              : empty[0]
            const fact = first ?? empty[0]!
            return {
              key: 'renseigner',
              heading: 'Renseigner le dossier',
              title: `Compléter : ${fact.label}`,
              why: explain(fact.why),
              to: `${base}/projet/${fact.key}`,
              label: 'Compléter cette information',
            }
          })()
  const blockingFill: HomeAction | null =
    fill && blockingEmpty.length > 0
      ? {
          ...fill,
          why: `Signalée comme bloquante par les règles : ${blockingEmpty.map((c) => c.fact_label).join(', ')}. ${debutant ? fill.why ?? '' : ''}`.trim(),
        }
      : null
  if (blockingFill) candidates.push(blockingFill)
  if (ready) {
    candidates.push({
      key: 'demarche',
      heading: 'Démarche à réaliser',
      title: ready.title,
      why: blockingFill
        ? `${explain(ready.explanation) ? `${ready.explanation} ` : ''}Elle peut avancer en parallèle de la saisie.`
        : explain(ready.explanation),
      to: `${base}/plan/${ready.id}`,
      label: 'Ouvrir la démarche',
    })
  }
  if (blocked && !inProgress && !ready) {
    candidates.push({
      key: 'bloquee',
      heading: 'Démarche bloquée',
      title: blocked.title,
      why: blocked.blocked_reason ? `Motif : ${blocked.blocked_reason}` : undefined,
      to: `${base}/plan/${blocked.id}`,
      label: 'Faire le point sur la démarche',
    })
  }
  if (fill && !blockingFill) candidates.push(fill)

  const [primary = null, ...secondary] = candidates
  return { primary, secondary }
}

/**
 * Accueil du conseiller : ses interventions utiles (répondre, examiner, réexaminer), pas une copie
 * de l'accueil du porteur. Même table de décision (docs/INTERFACE.md).
 */
export function advisorHome(dossier: Dossier, relecture: Relecture): HomePlan {
  if (dossier.role !== 'conseiller' || dossier.archived) return { primary: null, secondary: [] }
  const base = `/d/${dossier.id}`
  const toAnswer = relecture.threads.filter((m) => m.state === 'a_repondre').length
  const requested = relecture.requests.find((r) => !r.answered)
  const stale = relecture.reviews[0] && !relecture.reviews[0].current
  const candidates: HomeAction[] = []
  if (toAnswer > 0) {
    candidates.push({
      key: 'repondre',
      heading: 'Une réponse est attendue de vous',
      title: toAnswer === 1 ? 'Le porteur attend votre réponse à une question.' : `Le porteur attend votre réponse à ${toAnswer} questions.`,
      to: `${base}/relecture#messages`,
      label: 'Répondre',
    })
  }
  if (requested && relecture.can_review) {
    candidates.push({
      key: 'avis',
      heading: 'Relecture demandée',
      title: 'Examiner le dossier et rédiger un avis',
      why: requested.note || undefined,
      to: `${base}/relecture#donner-avis`,
      label: 'Rédiger un avis',
    })
  } else if (stale && relecture.can_review) {
    candidates.push({
      key: 'reexaminer',
      heading: 'Avis à réexaminer',
      title: 'Le dossier a changé depuis le dernier avis',
      why: `Modifié depuis : ${relecture.reviews[0]!.stale_sections.join(', ')}.`,
      to: `${base}/relecture#donner-avis`,
      label: 'Réexaminer et rédiger un avis',
    })
  }
  const [primary = null, ...secondary] = candidates
  return { primary, secondary }
}
