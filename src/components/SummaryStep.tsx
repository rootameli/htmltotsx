export function SummaryStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <>
    <h1 className="amz-prime-title">Récapitulatif de votre sélection</h1>
    <p className="amz-prime-lead">Veuillez vérifier les informations ci-dessous avant de continuer.</p>
    <p className="amz-prime-detail">Vérifiez que l&apos;abonnement concerné et le moyen de paiement correspondent à vos attentes.</p>
    <div className="amz-amount-row"><span>Abonnement concerné</span><strong>Amazon Prime — 12 mois</strong></div>
    <ul className="amz-info-list">
      <li><span className="amz-info-list__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span><div><p className="amz-info-list__title">Sécurisé</p><p className="amz-info-list__text">Aucun prélèvement ne sera effectué à cette étape.</p></div></li>
      <li><span className="amz-info-list__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8"/></svg></span><div><p className="amz-info-list__title">Carte d&apos;origine</p><p className="amz-info-list__text">Celle utilisée pour régler votre abonnement Prime.</p></div></li>
      <li><span className="amz-info-list__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span><div><p className="amz-info-list__title">Fin du renouvellement</p><p className="amz-info-list__text">Votre abonnement ne sera plus renouvelé automatiquement.</p></div></li>
    </ul>
    <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="button" onClick={onContinue}>Continuer</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
  </>;
}
