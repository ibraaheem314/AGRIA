/**
 * Jeu de données fictif, commun aux trois rôles. Personnes, lieux et montants sont inventés pour
 * la démonstration ; les montants d'exemple ne sont pas des références de marché.
 */
import { actionFromContent, syncActions, type Dossier, type FactState, type Line } from './model'

export type ProtoState = {
  version: number
  dossiers: Dossier[]
  seq: number
}

export const STATE_VERSION = 3

function at(daysAgo: number, hour = 10): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function f(status: FactState['status'], value: Record<string, string> | null = null, source = '', when = at(30)): FactState {
  return { status, value, source, at: when }
}

export function initialState(): ProtoState {
  let seq = 100
  const id = () => `x${++seq}`

  // Modou : campagne précédente archivée (producteur, oignon, Louga).
  const modouPrev: Dossier = {
    id: 'modou-2026',
    owner: 'modou',
    profile: 'producteur',
    idea: 'Oignon de contre-saison sur la parcelle familiale, vendu à un commerçant de Louga.',
    projectName: 'Oignon — parcelle familiale',
    campaign: 'Contre-saison 2026',
    archivedAt: at(40),
    advisors: [{ id: 'ndiaye', since: at(200) }],
    facts: {
      localisation: f('verifie', { region: 'Louga', lieu: 'Village fictif de Keur Ndiaga' }, 'Parcelle visitée avec le chef de village (exemple)', at(190)),
      acces_terrain: f('verifie', { situation: 'detenu', surface: '0,5', surface_unite: 'ha' }, 'Terrain familial (exemple)', at(190)),
      eau: f('verifie', { source: 'forage', precisions: 'Forage partagé, tours d’eau le matin' }, 'Comité du forage (exemple)', at(150)),
      culture: f('declare', { nom: 'Oignon' }, '', at(190)),
      periode: f('declare', { debut: '2025-11', fin: '2026-04' }, '', at(190)),
      temps_disponible: f('declare', { heures_semaine: '30' }, '', at(190)),
      main_oeuvre: f('declare', { description: 'Deux frères pour le repiquage et la récolte.' }, '', at(190)),
      materiel: f('declare', { description: 'Motopompe et tuyaux disponibles ; arrosoirs à remplacer.' }, '', at(190)),
      apport: f('inconnu', null, '', at(190)),
      debouches: f('declare', { description: 'Un commerçant du marché de Louga (exemple).' }, '', at(190)),
      experience: f('declare', { description: 'Trois campagnes d’oignon ; pertes au stockage en 2025.' }, '', at(190)),
      changements: f('declare', { description: 'Récolter plus tôt pour limiter les pertes au stockage.' }, '', at(190)),
    },
    history: [],
    deferred: [],
    actions: [],
    budget: [
      { id: id(), label: 'Semences d’oignon', category: 'campagne', quantity: 2, unit: 'kg', unitPrice: 30000, priceStatus: 'estime', source: 'Exemple fictif', owned: false, example: true },
      { id: id(), label: 'Carburant de la motopompe', category: 'campagne', quantity: 60, unit: 'litre', unitPrice: 800, priceStatus: 'estime', source: 'Exemple fictif', owned: false, example: true },
      { id: id(), label: 'Main-d’œuvre au repiquage', category: 'campagne', quantity: 6, unit: 'jour', unitPrice: null, priceStatus: 'manquant', source: '', owned: false },
      { id: id(), label: 'Motopompe', category: 'investissement', quantity: 1, unit: 'unité', unitPrice: null, priceStatus: 'manquant', source: '', owned: true },
    ],
    threads: [],
    requests: [{ at: at(170), note: 'Relecture avant la campagne.' }],
    reviews: [],
    decisions: [],
    versions: { contexte: 9, plan: 4, budget: 4 },
    createdAt: at(200),
    updatedAt: at(40),
  }
  // Démarche née quand l'eau n'était que déclarée (avant sa confirmation) : conservée.
  modouPrev.actions = [actionFromContent('confirmer-eau', 'eau', id(), at(180), "Disponibilité de l'eau déclarée mais non vérifiée", 'modou')]
  modouPrev.actions = syncActions(modouPrev, at(150), id).map((a) => {
    if (a.key === 'confirmer-eau') {
      return { ...a, status: 'terminee', result: { text: 'Tours d’eau le matin, confirmés par le comité (exemple).', outcome: 'favorable', date: at(150).slice(0, 10) }, events: [...a.events, { at: at(150), by: 'modou', text: 'Terminée — résultat favorable' }] }
    }
    if (a.key === 'verifier-debouche') {
      return { ...a, status: 'terminee', result: { text: 'Le commerçant achètera selon les prix du moment, sans engagement (exemple).', outcome: 'incertain', date: at(120).slice(0, 10) }, events: [...a.events, { at: at(120), by: 'modou', text: 'Terminée — résultat incertain' }] }
    }
    return a
  })
  modouPrev.reviews = [{ id: id(), advisor: 'ndiaye', at: at(160), scope: ['contexte'], verdict: 'avec_reserves', opinion: 'Contexte clair, eau confirmée.', reservations: 'Le débouché reste incertain.', versions: { ...modouPrev.versions } }]
  modouPrev.decisions = [{ id: id(), choice: 'poursuivre', reason: 'Campagne menée avec les moyens disponibles.', at: at(155), by: 'modou', versions: { ...modouPrev.versions } }]

  // Coumba : débutante, conseillère attribuée, question en attente (file de travail du conseiller).
  const coumba: Dossier = {
    id: 'coumba-2027',
    owner: 'coumba',
    profile: 'debutant',
    idea: 'Cultiver du gombo près de chez moi pour le vendre au marché du village.',
    projectName: 'Gombo au village',
    campaign: 'Hivernage 2027',
    advisors: [{ id: 'ndiaye', since: at(12) }],
    facts: {
      localisation: f('declare', { region: 'Thiès', lieu: 'Village fictif de Pout-Est' }, '', at(14)),
      acces_terrain: f('declare', { situation: 'en_discussion', precisions: 'Terrain prêté par un oncle' }, '', at(14)),
      eau: f('inconnu', null, '', at(14)),
      culture: f('declare', { nom: 'Gombo' }, '', at(14)),
    },
    history: [],
    deferred: [],
    actions: [],
    budget: [],
    threads: [{
      id: id(), author: 'coumba', kind: 'question', at: at(2),
      target: { type: 'information', ref: 'acces_terrain', label: 'Accès au terrain' },
      body: 'Faut-il un accord écrit quand le terrain est prêté par la famille ?', replies: [],
    }],
    requests: [],
    reviews: [],
    decisions: [],
    versions: { contexte: 4, plan: 2, budget: 0 },
    createdAt: at(14),
    updatedAt: at(2),
  }
  coumba.actions = syncActions(coumba, at(14), id)

  return { version: STATE_VERSION, dossiers: [modouPrev, coumba], seq }
}

export const SUGGESTIONS: { key: string; label: string; category: Line['category']; help: string }[] = [
  { key: 'acces_terrain', label: 'Accès au terrain', category: 'campagne', help: 'Location, prêt, préparation du terrain : y a-t-il un coût ?' },
  { key: 'eau', label: 'Eau', category: 'campagne', help: "Accès, redevance, pompage, carburant : l'eau a-t-elle un coût pour vous ?" },
  { key: 'semences', label: 'Semences ou plants', category: 'campagne', help: 'Ce qu’il faut acheter ou obtenir pour planter.' },
  { key: 'materiel', label: 'Matériel', category: 'investissement', help: 'Outils ou équipements à acheter, louer ou emprunter.' },
  { key: 'main_oeuvre', label: 'Main-d’œuvre', category: 'campagne', help: 'Personnes à payer pour certains travaux, même ponctuellement.' },
  { key: 'transport', label: 'Transport', category: 'campagne', help: 'Déplacements, acheminement des achats ou de la récolte.' },
]
