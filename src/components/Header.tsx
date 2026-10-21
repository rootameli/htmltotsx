import Image from 'next/image';
import amazonLogo from '../../assets/images/amazon-logo-white.png';

export function Header() {
  return <>
    <a className="skip-link" href="#main">Passer au contenu principal</a>
    <header className="amazon-header">
      <div className="nav-belt">
        <button className="mobile-nav-all" type="button" aria-label="Ouvrir le menu Toutes les catégories"><span className="nav-hamburger" aria-hidden="true"><i/><i/><i/></span></button>
        <a className="amazon-logo" href="#main" aria-label="Amazon.fr"><Image src={amazonLogo} width={98} height={34} alt="Amazon.fr" priority/></a>
        <form className="search" onSubmit={event => event.preventDefault()} role="search">
          <select aria-label="Catégorie"><option>Toutes nos catégories</option></select>
          <input aria-label="Rechercher Amazon.fr" placeholder="Rechercher Amazon.fr"/>
          <button aria-label="Rechercher" type="submit"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button>
        </form>
        <button className="account" type="button"><small>Bonjour</small><strong>Compte et listes <span aria-hidden="true">▾</span></strong></button>
        <button className="orders" type="button"><small>Retours</small><strong>et commandes</strong></button>
        <a href="/gp/cart/view.html?ref_=nav_cart" aria-label="0 article dans le panier" className="cart nav-a nav-a-2 nav-progressive-attribute" id="nav-cart">
          <div id="nav-cart-count-container" aria-hidden="true">
            <span id="nav-cart-count" className="cart-count nav-cart-count nav-cart-0 nav-progressive-attribute nav-progressive-content">0</span>
            <svg className="cart-icon nav-cart-icon" viewBox="0 0 48 38"><path d="M2 4h6l5.2 21.2h23.2L43 10H12"/><circle cx="17" cy="32" r="2.6"/><circle cx="34" cy="32" r="2.6"/></svg>
          </div>
          <div id="nav-cart-text-container" className="nav-progressive-attribute" aria-hidden="true">
            <span className="nav-line-1">&nbsp;</span>
            <span className="nav-line-2">Panier</span>
          </div>
        </a>
      </div>
      <nav className="nav-main" aria-label="Navigation principale">
        <button className="nav-all" type="button"><span className="nav-hamburger" aria-hidden="true"><i/><i/><i/></span><strong>Toutes</strong></button><button className="nav-rufus" type="button"><span aria-hidden="true">✦</span>Rufus</button><a href="#main">Amazon Haul</a><a href="#main">Service Client</a><a href="#main">Amazon Basics</a><a href="#main">Ventes Flash</a><a href="#main">Acheter à nouveau</a><a href="#main">Continuez vos achats</a><a href="#main">Meilleures ventes</a><a href="#main">Prime <span aria-hidden="true">▾</span></a><a href="#main">Ebooks Kindle</a><a href="#main">Dernières Nouveautés</a><a href="#main">Musique</a><a href="#main">Livres</a><a href="#main">Vendre sur Amazon</a>
      </nav>
      <nav className="amazon-subnav" aria-label="Navigation Amazon">
        <a className="amazon-subnav__home" href="#main">Amazon.fr</a>
        <a href="#main">Points de retrait Amazon Hub</a>
        <SubnavMenu label="Ventes Flash"/>
        <a href="#main">Outlet</a>
        <a href="#main">Coupons</a>
        <SubnavMenu label="Meilleures ventes"/>
        <a href="#main">Amazon Seconde main</a>
        <SubnavMenu label="Nos idées cadeaux"/>
        <SubnavMenu label="Services Amazon"/>
      </nav>
    </header>
  </>;
}

function SubnavMenu({ label }: { label: string }) {
  return <span className="amazon-subnav__menu"><a href="#main">{label}</a><button type="button" aria-label={`Ouvrir le menu ${label}`}><span aria-hidden="true"/></button></span>;
}
