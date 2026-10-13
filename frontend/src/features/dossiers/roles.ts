import type { DossierSummary } from './api'

type Ctx = Pick<DossierSummary, 'role' | 'archived'>

/**
 * Peut modifier les informations, les démarches et le budget : le porteur d'un dossier non archivé.
 * C'est la règle appliquée par le serveur ; ce module ne fait qu'en déduire le vocabulaire.
 */
export function canEdit(d: Ctx): boolean {
  return d.role === 'porteur' && !d.archived
}

/** Libellés selon le rôle et le contexte : aucun lien ne promet une modification refusée. */
export function words(d: Ctx) {
  const advisor = d.role === 'conseiller'
  const editable = canEdit(d)
  return {
    // Porteur : espaces Projet · Démarches · Budget · Conseiller (UX3-A) ; conseiller : structure existante.
    homeNav: advisor ? 'Aujourd’hui' : 'Projet',
    projectNav: advisor ? 'Projet' : 'Toutes les informations',
    planNav: advisor ? 'Plan' : 'Démarches',
    exchangesNav: advisor ? 'Échanges' : 'Conseiller',
    planTitle: advisor ? 'Plan du projet' : 'Démarches',
    backToProject: advisor ? '← Projet' : '← Projet',
    backToPlan: advisor ? '← Plan du projet' : '← Démarches',
    seePlan: advisor ? 'Voir le plan du projet' : 'Voir les démarches',
    /** Lien vers une information : compléter ou mettre à jour seulement si la destination le permet. */
    factLink: (empty: boolean) => (editable ? (empty ? 'Compléter' : 'Mettre à jour') : 'Consulter l’information'),
  }
}
