'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ReasonForm, type Cancellation } from './components/ReasonForm';
import { OrderChoice } from './components/OrderChoice';
import { PersonalDetailsForm } from './components/PersonalDetailsForm';

export default function App() {
  const [value, setValue] = useState<Cancellation>({ selected: [], detail: '' });
  const [step, setStep] = useState<1 | 2 | 3>(1);

  function goTo(nextStep: 1 | 2 | 3) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return <div className="amz-page"><Header/><main className="amz-prime-main" id="main">
    <div className="amz-prime-container">
      {step > 1 && <div className="amz-prime-progress" aria-label={`Progression étape ${step - 1} sur 4`}>
        <p className="amz-prime-progress__label">Étape {step - 1} sur 4</p>
        <div className="amz-prime-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={step - 1}>
          <span className="amz-prime-progress__fill" style={{ width: `${(step - 1) * 25}%` }}/>
        </div>
      </div>}
      <section className="amz-prime-card">
        {step === 1 && <OrderChoice onCancel={() => goTo(2)}/>}
        {step === 2 && <>
          <h1 className="amz-prime-title">Annulation de l&apos;abonnement</h1>
          <p className="amz-prime-lead">Indiquez pourquoi vous souhaitez annuler, puis vos coordonnées.</p>
          <ReasonForm initial={value} onBack={() => goTo(1)} onContinue={next => { setValue(next); goTo(3); }}/>
        </>}
        {step === 3 && <PersonalDetailsForm onBack={() => goTo(2)}/>}
      </section>
    </div>
  </main><Footer/></div>;
}
