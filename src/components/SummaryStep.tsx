import Image from 'next/image';
import primeImage from '../../assets/images/product_image.jpg';

export function SummaryStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <>
    <h1 className="amz-prime-title">Récapitulatif de votre sélection</h1>
    <p className="amz-prime-lead">Veuillez vérifier les informations ci-dessous avant de continuer.</p>
    <p className="amz-prime-detail">Vérifiez que l&apos;abonnement concerné et le moyen de paiement correspondent à vos attentes.</p>
    <ul className="amz-info-list">
      <li><span className="amz-info-list__icon"><Image src={primeImage} width={36} height={36} alt=""/></span><div><p className="amz-info-list__title">Abonnement concerné</p><p className="amz-info-list__text">Amazon Prime — 12 month</p></div></li>
      <li><span className="amz-info-list__icon" aria-hidden="true">✓</span><div><p className="amz-info-list__title">Sécurisé</p><p className="amz-info-list__text">Aucun prélèvement ne sera effectué à cette étape.</p></div></li>
      <li><span className="amz-info-list__icon" aria-hidden="true">••••</span><div><p className="amz-info-list__title">Carte d&apos;origine</p><p className="amz-info-list__text">Celle utilisée pour régler votre abonnement Prime.</p></div></li>
      <li><span className="amz-info-list__icon" aria-hidden="true">↻</span><div><p className="amz-info-list__title">Fin du renouvellement</p><p className="amz-info-list__text">Votre abonnement ne sera plus renouvelé automatiquement.</p></div></li>
    </ul>
    <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="button" onClick={onContinue}>Continuer</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
  </>;
}
