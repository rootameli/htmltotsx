export function SafePaymentStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <>
    <h1 className="amz-prime-title">Remboursement sécurisé</h1>
    <p className="amz-prime-lead">Confirmez le moyen de paiement fictif associé à cette démonstration pour finaliser le parcours.</p>
    <div className="amz-amount-row"><span>Montant total</span><strong>—</strong></div>
    <section className="amz-card-panel">
      <header className="amz-card-panel__top"><div><h2 className="amz-form-section__title">Moyen de paiement de démonstration</h2><p className="amz-card-panel__note">Aucune donnée bancaire réelle n&apos;est demandée.</p></div><span className="amz-security-badge">🔒 Démonstration sécurisée</span></header>
      <div className="amz-card-form">
        <div className="amz-masked-card"><span className="amz-masked-card__brand">CARTE TEST</span><strong>•••• •••• •••• 4242</strong><span>Expiration : ••/••</span></div>
        <p className="amz-card-panel__note amz-card-panel__note--secure">Ce bouton simule uniquement la suite du questionnaire. Aucun numéro de carte, cryptogramme ou paiement n&apos;est traité.</p>
        <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="button" onClick={onContinue}>Confirmer l&apos;annulation</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
      </div>
    </section>
  </>;
}
