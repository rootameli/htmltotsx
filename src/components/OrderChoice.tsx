import Image from 'next/image';
import primeImage from '../../assets/images/product_image.jpg';

export function OrderChoice({ onCancel }: { onCancel: () => void }) {
  return <>
    <h1 className="amz-prime-title">Que souhaitez-vous faire ?</h1>
    <div className="amz-confirm-banner" role="status">
      <span className="amz-confirm-banner__icon" aria-hidden="true">✓</span>
      <div><p className="amz-confirm-banner__title">Commande confirmée</p><p className="amz-confirm-banner__text">Votre abonnement Amazon Prime est en cours d&apos;activation.</p></div>
    </div>
    <div className="amz-order-box">
      <div className="amz-order-box__head">
        <div className="amz-order-box__product"><Image className="amz-order-box__product-img" src={primeImage} width={72} height={72} alt="Amazon Prime"/><p className="amz-order-box__name">Amazon Prime — 12 month</p></div>
        <strong className="amz-order-box__price">249,90 EUR</strong>
      </div>
      <dl className="amz-order-meta"><div><dt>N° de commande</dt><dd>D01-151BE0AB-151516</dd></div><div><dt>Date</dt><dd>19 octobre 2026</dd></div></dl>
      <p className="amz-order-status">Statut : <strong>Activation en cours</strong></p>
      <button className="amz-link-detail" type="button">Voir le détail</button>
    </div>
    <div className="amz-choice-grid">
      <button className="amz-choice-card amz-choice-card--primary" type="button" onClick={onCancel}><strong className="amz-choice-card__title">Annuler l&apos;abonnement</strong><span className="amz-choice-card__text">Je ne souhaite plus d&apos;abonnement Amazon Prime.</span></button>
      <button className="amz-choice-card" type="button" onClick={onCancel}><strong className="amz-choice-card__title">Demander un remboursement</strong><span className="amz-choice-card__text">Je souhaite être remboursé de 249,90 EUR.</span></button>
    </div>
  </>;
}
