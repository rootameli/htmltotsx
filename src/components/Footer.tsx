import Image from 'next/image';
import amazonLogo from '../../assets/images/amazon-logo-white.png';

export function Footer() {
  return <footer className="amazon-footer">
    <button className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Retour en haut</button>
    <div className="footer-columns">
      <div><h3>Pour mieux nous connaître</h3><a href="#main">À propos d&apos;Amazon</a><a href="#main">Carrières</a><a href="#main">Durabilité</a><a href="#main">Amazon Science</a></div>
      <div><h3>Gagnez de l&apos;argent</h3><a href="#main">Vendez sur Amazon</a><a href="#main">Vendez sur Amazon Business</a><a href="#main">Protégez et développez votre marque</a><a href="#main">Expédié par Amazon</a><a href="#main">Amazon Pay</a></div>
      <div><h3>Moyens de paiement Amazon</h3><a href="#main">Cartes de paiement</a><a href="#main">Paiement en plusieurs fois</a><a href="#main">Convertisseur de devises Amazon</a><a href="#main">Cartes cadeaux</a></div>
      <div><h3>Besoin d&apos;aide ?</h3><a href="#main">Voir ou suivre vos commandes</a><a href="#main">Tarifs et options de livraison</a><a href="#main">Amazon Prime</a><a href="#main">Retours et remplacements</a><a href="#main">Service Client</a></div>
    </div>
    <div className="footer-locale"><span className="footer-logo"><Image src={amazonLogo} alt="Amazon"/></span><button type="button">🌐 Français⌄</button><button type="button">🇫🇷 France</button></div>
    <div className="footer-legal"><span>Conditions générales de vente</span><span>Vos informations personnelles</span><span>Cookies</span><span>Annonces basées sur vos centres d’intérêt</span><small>© 1996-2026, Amazon.com Inc. ou ses affiliés</small></div>
  </footer>;
}
