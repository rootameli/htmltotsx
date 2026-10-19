'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ReasonForm, type Cancellation } from './components/ReasonForm';
import { Review } from './components/Review';

export default function App() {
  const [value, setValue] = useState<Cancellation>({ selected: [], detail: '' });
  const [review, setReview] = useState(false);
  return <div className="amz-page"><Header/><main className="amz-prime-main" id="main">
    <div className="amz-prime-container">
      <div className="amz-prime-progress" aria-label={`Progression étape ${review ? 2 : 1} sur 4`}>
        <p className="amz-prime-progress__label">Étape {review ? 2 : 1} sur 4</p>
        <div className="amz-prime-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={review ? 2 : 1}>
          <span className="amz-prime-progress__fill" style={{ width: review ? '50%' : '25%' }}/>
        </div>
      </div>
      <section className="amz-prime-card">
        <h1 className="amz-prime-title">{review ? 'Vérifiez vos choix' : "Annulation de l'abonnement"}</h1>
        <p className="amz-prime-lead">{review ? 'Consultez votre sélection avant de revenir à votre compte.' : 'Indiquez pourquoi vous souhaitez annuler, puis vos coordonnées.'}</p>
        {review ? (
          <Review value={value} onBack={() => setReview(false)}/>
        ) : (
          <ReasonForm initial={value} onContinue={next => {
            setValue(next);
            setReview(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}/>
        )}
      </section>
    </div>
  </main><Footer/></div>;
}
