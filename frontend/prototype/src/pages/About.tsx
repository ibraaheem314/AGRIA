import { CONTENT } from '../data/model'
import { Note, PageHeader, Panel, SectionTitle } from '../ui'

export function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Prototype UX1" title="Comment fonctionne ce prototype">
        Une proposition d'organisation et de parcours à essayer, distincte de l'application livrée.
      </PageHeader>
      <Panel>
        <SectionTitle>Ce qui est réel, ce qui est simulé</SectionTitle>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Personnes, lieux, projets et montants d'exemple sont <strong>fictifs</strong>.</li>
          <li>Rien n'est envoyé à un serveur : les changements restent dans le stockage de ce navigateur. « Réinitialiser » revient au jeu de données de départ ; un autre navigateur repart de zéro.</li>
          <li>Les démarches, leurs étapes et les points à éclaircir viennent du contenu réel de préparation (« {CONTENT.title} », version {CONTENT.version}), <strong>non relu par un spécialiste</strong>. Leur calcul est une copie locale du moteur de l'application.</li>
          <li>Le choix du rôle et l'attribution d'un conseiller sont des <strong>outils de démonstration</strong> : dans le produit, chacun se connecte avec son compte et l'équipe AGRIA attribue les conseillers.</li>
          <li>Les états « chargement » et « erreur » sont simulés depuis les outils de démonstration.</li>
        </ul>
      </Panel>
      <Panel>
        <SectionTitle>Ce que le prototype ne démontre pas</SectionTitle>
        <p>Ni l'utilité du produit sur le terrain, ni le besoin commercial, ni la pertinence agronomique : ces questions relèvent de l'enquête G1 et du pilote G2.</p>
      </Panel>
      <Panel>
        <SectionTitle>Démonstration du suivi de campagne</SectionTitle>
        <p>
          Une démonstration séparée montre l'assistance pendant une campagne (observation, problème, action et suivi), avec des réponses
          scénarisées : <a href="/suivi" className="font-medium text-brand-800 underline underline-offset-2">ouvrir la démonstration du suivi</a>.
        </p>
      </Panel>
      <Note tone="neutral">La correspondance de chaque écran avec les fonctions existantes (F1–F6) et les écarts techniques sont décrits dans la documentation du dépôt (avancement, section UX1).</Note>
    </div>
  )
}
