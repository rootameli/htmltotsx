export function ConfirmationStep() {
  return <div className="amz-success">
    <header className="amz-success__hero"><span className="amz-success__icon">✓</span><p className="amz-success__eyebrow">Demande traitée</p><h1 className="amz-success__title">Demande d&apos;annulation confirmée</h1><p className="amz-success__lead">Votre demande d&apos;annulation de démonstration a bien été enregistrée localement.</p></header>
    <ol className="amz-success__steps"><li className="amz-success__step amz-success__step--done"><span className="amz-success__step-dot"/><span className="amz-success__step-label">Demande reçue</span></li><li className="amz-success__step amz-success__step--active"><span className="amz-success__step-dot"/><span className="amz-success__step-label">Traitement terminé</span></li><li className="amz-success__step"><span className="amz-success__step-dot"/><span className="amz-success__step-label">Annulation effective</span></li></ol>
    <dl className="amz-success__summary"><div className="amz-success__row"><dt className="amz-success__key">N° de demande</dt><dd className="amz-success__val amz-success__val--strong">DEMO-2026-4242</dd></div><div className="amz-success__row"><dt className="amz-success__key">Montant</dt><dd className="amz-success__val">—</dd></div><div className="amz-success__row"><dt className="amz-success__key">Statut</dt><dd className="amz-success__val amz-success__val--status">Simulation terminée</dd></div></dl>
    <p className="amz-success__note">Aucune demande réelle, donnée personnelle ou donnée bancaire n&apos;a été transmise.</p>
  </div>;
}
