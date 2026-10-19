export function Header() {
  return <>
    <a className="skip-link" href="#main">Passer au contenu principal</a>
    <header className="header">
      <a className="brand" href="#main">atelier<span>+</span></a>
      <span className="header-caption">Votre espace abonnement</span>
      <span className="demo-badge">Démonstration locale</span>
    </header>
    <nav className="navigation" aria-label="Navigation principale">
      <a href="#main">Mon abonnement</a><a href="#help">Aide et informations</a>
    </nav>
  </>;
}
