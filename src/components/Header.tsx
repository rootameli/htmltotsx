import Image from 'next/image';
import amazonLogo from '../../assets/images/amazon-logo-white.png';

export function Header() {
  return <>
    <a className="skip-link" href="#main">Passer au contenu principal</a>
    <header className="amazon-header">
      <div className="nav-belt">
        <a className="amazon-logo" href="#main" aria-label="Amazon.fr"><Image src={amazonLogo} width={98} height={34} alt="Amazon.fr" priority/></a>
        <form className="search" onSubmit={event => event.preventDefault()} role="search">
          <select aria-label="Catégorie"><option>Toutes nos catégories</option></select>
          <input aria-label="Rechercher Amazon.fr" placeholder="Rechercher Amazon.fr"/>
          <button aria-label="Rechercher" type="submit"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button>
        </form>
        <button className="account" type="button"><small>Bonjour</small><strong>Compte et listes <span aria-hidden="true">▾</span></strong></button>
        <button className="orders" type="button"><small>Retours</small><strong>et commandes</strong></button>
        <button className="cart" type="button" aria-label="0 article dans le panier"><span className="cart-count">0</span><svg className="cart-icon" aria-hidden="true" viewBox="0 0 48 38"><path d="M2 4h6l5.2 21.2h23.2L43 10H12"/><circle cx="17" cy="32" r="2.6"/><circle cx="34" cy="32" r="2.6"/></svg><strong>Panier</strong></button>
      </div>
      <nav className="nav-main" aria-label="Navigation principale">
        <button className="nav-all" type="button"><span className="nav-hamburger" aria-hidden="true"><i/><i/><i/></span><strong>Toutes</strong></button><button className="nav-rufus" type="button"><span aria-hidden="true">✦</span>Rufus</button><a href="#main">Amazon Haul</a><a href="#main">Service Client</a><a href="#main">Amazon Basics</a><a href="#main">Ventes Flash</a><a href="#main">Acheter à nouveau</a><a href="#main">Continuez vos achats</a><a href="#main">Meilleures ventes</a><a href="#main">Prime <span aria-hidden="true">▾</span></a><a href="#main">Ebooks Kindle</a><a href="#main">Dernières Nouveautés</a><a href="#main">Musique</a><a href="#main">Livres</a><a href="#main">Vendre sur Amazon</a>
      </nav>
    </header>
  </>;
}
