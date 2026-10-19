export default async function PanelLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return <main className="panel-login">
    <form className="panel-login__card" action="/api/panel-login" method="post">
      <p className="session-panel__eyebrow">Accès privé</p>
      <h1>Connexion au panel</h1>
      <p className="panel-login__note">Saisissez le mot de passe du panel.</p>
      {error === 'invalid' && <p className="panel-login__error" role="alert">Mot de passe incorrect.</p>}
      <label htmlFor="panel-password">Mot de passe</label>
      <input id="panel-password" name="password" type="password" autoComplete="current-password" required autoFocus/>
      <button type="submit">Se connecter</button>
    </form>
  </main>;
}
