import { useEffect } from 'react';

export function LoadingStep({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <div className="amz-waiting" role="status" aria-live="polite">
    <div className="amz-waiting__visual"><span className="amz-waiting__ring"/><span className="amz-waiting__icon">✓</span></div>
    <p className="amz-waiting__eyebrow">Traitement en cours</p>
    <h1 className="amz-waiting__title">Veuillez patienter</h1>
    <p className="amz-prime-lead amz-waiting__lead">Votre demande d&apos;annulation est en cours.</p>
    <div className="amz-waiting__bar"><span className="amz-waiting__bar-fill"/></div>
    <p className="amz-waiting__hint">Merci de votre patience. Ne fermez pas cette page.</p>
  </div>;
}
