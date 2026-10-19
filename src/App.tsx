'use client';

import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ReasonForm, type Cancellation } from './components/ReasonForm';
import { OrderChoice } from './components/OrderChoice';
import { PersonalDetailsForm, type PersonalDetails } from './components/PersonalDetailsForm';
import { SummaryStep } from './components/SummaryStep';
import { SafePaymentStep } from './components/SafePaymentStep';
import { LoadingStep } from './components/LoadingStep';
import { ConfirmationStep } from './components/ConfirmationStep';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Flow = 'annulation' | 'remboursement';
const SESSION_ID_KEY = 'prime-flow-session-id';
const SESSION_VISIT_KEY = 'prime-flow-visit-time';

function roundedVisitTime() {
  const date = new Date();
  date.setSeconds(0, 0);
  return date.toISOString();
}

function getOrCreateSessionId() {
  const existingId = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (existingId) {
    if (!window.sessionStorage.getItem(SESSION_VISIT_KEY)) {
      window.sessionStorage.setItem(SESSION_VISIT_KEY, roundedVisitTime());
    }
    return existingId;
  }

  const newId = window.crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_ID_KEY, newId);
  window.sessionStorage.setItem(SESSION_VISIT_KEY, roundedVisitTime());
  return newId;
}

export default function App({ initialStep = 1, initialFlow = 'annulation' }: { initialStep?: Step; initialFlow?: Flow }) {
  const [value, setValue] = useState<Cancellation>({ selected: [], detail: '' });
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    adresse: '',
    codePostal: '',
    ville: '',
  });
  const [step, setStep] = useState<Step>(initialStep);
  const [flow, setFlow] = useState<Flow>(initialFlow);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    if (!sessionId || window.location.pathname !== '/informations') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('sessionid') === sessionId) return;
    url.searchParams.set('sessionid', sessionId);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [sessionId]);

  function goTo(nextStep: Step, selectedFlow = flow) {
    setStep(nextStep);
    const nextPath = nextStep === 1
      ? '/'
      : nextStep === 2
        ? `/${selectedFlow}`
        : nextStep <= 4
          ? '/informations'
          : nextStep <= 6
            ? '/moyendepaiement'
            : '/confirmation';
    const destination = nextPath === '/informations'
      ? `${nextPath}?sessionid=${encodeURIComponent(sessionId || getOrCreateSessionId())}`
      : nextPath;
    if (`${window.location.pathname}${window.location.search}` !== destination) window.history.pushState({}, '', destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startFlow(selectedFlow: Flow) {
    setFlow(selectedFlow);
    goTo(2, selectedFlow);
  }

  return <div className="amz-page" data-session-id={sessionId || undefined}><Header/><main className="amz-prime-main" id="main">
    <div className="amz-prime-container">
      {step > 1 && step < 6 && <div className="amz-prime-progress" aria-label={`Progression étape ${Math.min(step - 1, 4)} sur 4`}>
        <p className="amz-prime-progress__label">Étape {Math.min(step - 1, 4)} sur 4</p>
        <div className="amz-prime-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={Math.min(step - 1, 4)}>
          <span className="amz-prime-progress__fill" style={{ width: `${Math.min(step - 1, 4) * 25}%` }}/>
        </div>
      </div>}
      <section className="amz-prime-card">
        {step === 1 && <OrderChoice onCancel={() => startFlow('annulation')} onRefund={() => startFlow('remboursement')}/>}
        {step === 2 && <>
          <h1 className="amz-prime-title">{flow === 'annulation' ? <>Annulation de l&apos;abonnement</> : <>Demande de remboursement</>}</h1>
          <p className="amz-prime-lead">{flow === 'annulation' ? 'Indiquez pourquoi vous souhaitez annuler, puis vos coordonnées.' : 'Indiquez pourquoi vous souhaitez être remboursé, puis vos coordonnées.'}</p>
          <ReasonForm initial={value} onBack={() => goTo(1)} onContinue={next => { setValue(next); goTo(3); }}/>
        </>}
        {step === 3 && <PersonalDetailsForm initial={personalDetails} onBack={() => goTo(2)} onContinue={details => { setPersonalDetails(details); goTo(4); }}/>}
        {step === 4 && <SummaryStep onBack={() => goTo(3)} onContinue={() => goTo(5)}/>}
        {step === 5 && <SafePaymentStep onBack={() => goTo(4)} onContinue={() => goTo(6)}/>}
        {step === 6 && <LoadingStep onComplete={() => goTo(7)}/>}
        {step === 7 && <ConfirmationStep/>}
      </section>
    </div>
  </main><Footer/></div>;
}
