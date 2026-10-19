export function Footer() {
  return <footer id="help">
    <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Retour en haut ↑</button>
    <div className="footer-content"><div><strong>atelier+</strong><p>Une interface de démonstration React.</p></div><div><strong>À propos de cette page</strong><p>Exemple indépendant, sans affiliation commerciale.<br/>Aucune collecte de coordonnées ou de paiement.</p></div><div><strong>Langue et région</strong><p>Français · France</p></div></div>
    <p className="copyright">Démonstration locale · Gestion d’abonnement</p>
  </footer>;
}
