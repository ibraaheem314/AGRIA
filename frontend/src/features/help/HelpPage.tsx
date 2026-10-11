import { Card, PageTitle } from '../../shared/ui'

export function HelpPage() {
  return (
    <div className="space-y-4">
      <PageTitle>Aide</PageTitle>
      <Card>
        <h2 className="font-semibold">À quoi sert AGRIA ?</h2>
        <p className="mt-1">
          À préparer une campagne agricole : rassembler ce que vous savez, voir ce qu'il reste à vérifier, organiser
          les démarches et le budget, et en discuter avec un conseiller avant de décider de poursuivre, modifier ou
          différer votre projet.
        </p>
      </Card>
      <Card>
        <h2 className="font-semibold">Les états d'une information</h2>
        <dl className="mt-2 space-y-2">
          <div><dt className="font-medium">Non renseigné</dt><dd className="text-muted">Vous n'avez encore rien indiqué.</dd></div>
          <div><dt className="font-medium">Je ne sais pas</dt><dd className="text-muted">Réponse acceptée : l'information devient un point à vérifier.</dd></div>
          <div><dt className="font-medium">Déclaré</dt><dd className="text-muted">Vous l'affirmez, sans preuve enregistrée.</dd></div>
          <div><dt className="font-medium">Estimé</dt><dd className="text-muted">Une approximation.</dd></div>
          <div><dt className="font-medium">Vérifié</dt><dd className="text-muted">Confirmé par un document, une visite ou une personne, que vous indiquez.</dd></div>
        </dl>
      </Card>
      <Card>
        <h2 className="font-semibold">Ce qu'AGRIA ne fait pas</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>AGRIA ne choisit pas votre culture et ne promet aucun rendement ni aucune rentabilité.</li>
          <li>Les explications proposées sont générales ; elles n'ont pas encore été relues par un spécialiste agricole.</li>
          <li>Un dossier complet ne prouve pas qu'un projet est faisable.</li>
          <li>L'application a besoin d'une connexion pour enregistrer : en cas de coupure, votre saisie reste à l'écran et vous pouvez réessayer.</li>
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">Vos données</h2>
        <p className="mt-1">
          Votre dossier n'est visible que par vous et, s'il lui est attribué, par votre conseiller. Chaque modification
          est conservée dans l'historique.
        </p>
      </Card>
    </div>
  )
}
