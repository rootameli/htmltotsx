'use client';

import { useEffect, useState } from 'react';

const SESSION_ID_KEY = 'prime-flow-session-id';
const SESSION_VISIT_KEY = 'prime-flow-visit-time';

type LocalSession = {
  id: string;
  visitedAt: string;
};

function createLocalSession(): LocalSession {
  const existingId = window.sessionStorage.getItem(SESSION_ID_KEY);
  const existingVisit = window.sessionStorage.getItem(SESSION_VISIT_KEY);
  const date = new Date();
  date.setSeconds(0, 0);
  const session = {
    id: existingId || window.crypto.randomUUID(),
    visitedAt: existingVisit || date.toISOString(),
  };
  window.sessionStorage.setItem(SESSION_ID_KEY, session.id);
  window.sessionStorage.setItem(SESSION_VISIT_KEY, session.visitedAt);
  return session;
}

export function SessionPanel() {
  const [session, setSession] = useState<LocalSession | null>(null);

  useEffect(() => {
    setSession(createLocalSession());
  }, []);

  return <main className="session-panel">
    <section className="session-panel__card">
      <header className="session-panel__header">
        <div><p className="session-panel__eyebrow">Panel local</p><h1>Session de cet onglet</h1></div>
        <span className="session-panel__status">Active</span>
      </header>
      <p className="session-panel__note">Ces informations restent uniquement dans ce navigateur.</p>
      <div className="session-panel__table-wrap">
        <table className="session-panel__table">
          <thead><tr><th>Session ID</th><th>Date et heure de visite</th></tr></thead>
          <tbody><tr><td><code>{session?.id ?? 'Chargement…'}</code></td><td>{session ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(session.visitedAt)) : 'Chargement…'}</td></tr></tbody>
        </table>
      </div>
    </section>
  </main>;
}
