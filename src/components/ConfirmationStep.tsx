type ConfirmationStepProps = {
  flow: 'annulation' | 'remboursement';
  email?: string;
};

export function ConfirmationStep({ flow, email }: ConfirmationStepProps) {
  const isRefund = flow === 'remboursement';

  return <div className="amz-success">
    <div className="amz-success__hero">
      <div className="amz-success__icon" aria-hidden="true"><svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="17" stroke="#067d62" strokeWidth="2" fill="#f0faf6"/><path d="M11 18.5l4.5 4.5 9.5-10" stroke="#067d62" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
      <p className="amz-success__eyebrow">Demande traitée</p>
      <h1 className="amz-success__title">Demande {isRefund ? 'de remboursement' : 'd’annulation'} confirmée</h1>
      <p className="amz-success__lead">{isRefund ? 'Votre demande a bien été prise en compte. Le montant sera crédité sur la carte indiquée.' : 'Votre demande a bien été prise en compte. Votre abonnement ne sera plus renouvelé automatiquement.'}</p>
    </div>
    <ol className="amz-success__steps" aria-label="Traitement en cours">
      <li className="amz-success__step amz-success__step--done"><span className="amz-success__step-dot" aria-hidden="true"/><span className="amz-success__step-label">Demande reçue</span></li>
      <li className="amz-success__step amz-success__step--active"><span className="amz-success__step-dot" aria-hidden="true"/><span className="amz-success__step-label">Traitement en cours</span></li>
      <li className="amz-success__step"><span className="amz-success__step-dot" aria-hidden="true"/><span className="amz-success__step-label">{isRefund ? 'Crédit sur carte' : 'Annulation effective'}</span></li>
    </ol>
    <div className="amz-success__summary">
      <div className="amz-success__row"><span className="amz-success__key">N° de demande</span><span className="amz-success__val">D01-B29C4C1A-7CBE7C</span></div>
      {isRefund && <div className="amz-success__row"><span className="amz-success__key">Montant</span><span className="amz-success__val amz-success__val--strong">249,90&nbsp;EUR</span></div>}
      <div className="amz-success__row"><span className="amz-success__key">Délai estimé</span><span className="amz-success__val">{isRefund ? '3 à 5 jours ouvrés' : 'Sous 24 heures'}</span></div>
      <div className="amz-success__row"><span className="amz-success__key">Statut</span><span className="amz-success__val amz-success__val--status">En cours de traitement</span></div>
      {email && <div className="amz-success__row"><span className="amz-success__key">Confirmation</span><span className="amz-success__val">{email}</span></div>}
    </div>
    <p className="amz-success__note">Un e-mail de confirmation vous sera envoyé sous peu à l&apos;adresse indiquée.</p>
  </div>;
}
