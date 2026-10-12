import type { DossierSummary } from './api'

/**
 * Niveau de détail de l'accompagnement à l'écran (même contenu, même moteur) :
 * - détaillé pour un débutant et pour le conseiller qui relit : justifications et étapes visibles ;
 * - direct pour un producteur actif : l'essentiel d'abord, explications à déplier.
 */
export function isDetailed(dossier: Pick<DossierSummary, 'role' | 'project'>): boolean {
  return dossier.role === 'conseiller' || dossier.project.profile === 'debutant'
}
