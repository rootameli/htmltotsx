export function Header() {
  return <>
    <a className="skip-link" href="#main">Passer au contenu principal</a>
    <header className="amazon-header">
      <div className="nav-belt">
        <a className="amazon-logo" href="#main" aria-label="Amazon.fr"><span>amazon</span><small>.fr</small></a>
        <button className="delivery" type="button"><span aria-hidden="true">⌖</span><span><small>Votre adresse de livraison :</small><strong>France</strong></span></button>
        <form className="search" onSubmit={event => event.preventDefault()} role="search">
          <select aria-label="Catégorie"><option>Toutes nos catégories</option></select>
          <input aria-label="Rechercher Amazon.fr" placeholder="Rechercher Amazon.fr"/>
          <button aria-label="Rechercher" type="submit">⌕</button>
        </form>
        <button className="language" type="button">🇫🇷 <strong>FR</strong>⌄</button>
        <button className="account" type="button"><small>Bonjour</small><strong>Compte et listes ⌄</strong></button>
        <button className="orders" type="button"><small>Retours</small><strong>et commandes</strong></button>
        <button className="cart" type="button"><span>0</span>🛒<strong>Panier</strong></button>
      </div>
      <nav className="nav-main" aria-label="Navigation principale">
        <button type="button">☰ <strong>Toutes</strong></button><a href="#main">Rufus</a><a href="#main">Amazon Haul</a><a href="#main">Service Client</a><a href="#main">Amazon Basics</a><a href="#main">Ventes Flash</a><a href="#main">Acheter à nouveau</a><a href="#main">Continuez vos achats</a><a href="#main">Meilleures ventes</a><a href="#main">Prime⌄</a><a href="#main">Ebooks Kindle</a>
      </nav>
    </header>
  </>;
}
