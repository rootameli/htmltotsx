import Image from 'next/image';
import visaLogo from '../../assets/images/visa.png';
import mastercardLogo from '../../assets/images/mastercard.png';
import amexLogo from '../../assets/images/amex.png';

export function SafePaymentStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <>
    <h1 className="amz-prime-title">Remboursement sécurisé</h1>
    <p className="amz-prime-lead">Confirmez le moyen de paiement fictif associé à cette démonstration pour finaliser le parcours.</p>
    <div className="amz-amount-row"><span>Montant total</span><strong>249,90 EUR</strong></div>
    <section className="amz-card-panel">
      <header className="amz-card-panel__top"><div><h2 className="amz-form-section__title">Moyen de paiement de démonstration</h2><p className="amz-card-panel__note">Aucune donnée bancaire réelle n&apos;est demandée.</p></div><div className="amz-card-brands amz-card-brands--header" aria-label="Réseaux de paiement pris en charge"><span><Image src={visaLogo} alt="Visa"/></span><span><Image src={mastercardLogo} alt="Mastercard"/></span><span><Image src={amexLogo} alt="American Express"/></span></div></header>
      <div className="amz-card-form">
        <p className="amz-card-form-intro" id="prototype-card-note">Champs visuels en lecture seule. Ils utilisent exclusivement les valeurs de test publiques de Stripe.</p>
        <div className="amz-form-grid amz-card-demo-fields" aria-describedby="prototype-card-note">
          <div className="amz-field amz-field--full"><label htmlFor="demo-card-number">Numéro de carte test</label><input className="amz-input" id="demo-card-number" inputMode="numeric" autoComplete="off" readOnly value="4242 4242 4242 4242"/></div>
          <div className="amz-field amz-field--full"><label htmlFor="demo-card-holder">Nom du titulaire</label><input className="amz-input" id="demo-card-holder" autoComplete="off" readOnly value="UTILISATEUR TEST"/></div>
          <div className="amz-field"><label htmlFor="demo-card-expiry">Expiration (MM/AA)</label><input className="amz-input" id="demo-card-expiry" inputMode="numeric" autoComplete="off" readOnly value="12/34"/></div>
          <div className="amz-field"><label htmlFor="demo-card-cvv">CVV de test</label><input className="amz-input" id="demo-card-cvv" inputMode="numeric" autoComplete="off" readOnly value="123"/></div>
        </div>
        <p className="amz-card-panel__note amz-card-panel__note--secure">Ces champs ne sont associés à aucun formulaire, état applicatif ou appel réseau. Aucun paiement n&apos;est traité.</p>
        <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="button" onClick={onContinue}>Confirmer l&apos;annulation</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
      </div>
    </section>
  </>;
}
