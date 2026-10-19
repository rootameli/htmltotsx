import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ReasonForm, type Cancellation } from './components/ReasonForm';
import { Review } from './components/Review';

export default function App() {
  const [value, setValue] = useState<Cancellation>({ selected: [], detail: '' });
  const [review, setReview] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  function changeStep(next: boolean) {
    setReview(next);
    requestAnimationFrame(() => title.current?.focus());
  }
  return <><Header/><main id="main">
    <p className="breadcrumb">Votre compte <span aria-hidden="true">›</span> Gestion de l’abonnement</p>
    <div className="page-heading"><span className="eyebrow">ESPACE ABONNEMENT</span><h1 tabIndex={-1} ref={title}>{review ? 'Vérifiez vos choix' : 'Annulation de l’abonnement'}</h1><p className="muted">{review ? 'Consultez le récapitulatif de cette simulation.' : 'Dites-nous ce qui motive votre décision.'}</p></div>
    <div className="layout"><section className="card" aria-label="Parcours d’annulation">
      <div className="progress-label"><span>Étape {review ? 2 : 1} sur 2</span><span>{review ? 'Récapitulatif' : 'Vos motifs'}</span></div>
      <progress max={2} value={review ? 2 : 1} aria-label="Progression"/>
      {review ? <Review value={value} onBack={() => changeStep(false)}/> : <ReasonForm initial={value} onContinue={next => { setValue(next); changeStep(true); }}/>}
    </section><aside className="aside"><span className="aside-icon" aria-hidden="true">ⓘ</span><h2>Vous gardez le contrôle</h2><p>Cette page permet de tester le parcours et ses composants, sans agir sur un compte réel.</p><hr/><p className="small">Vos choix restent uniquement en mémoire pendant cette session. Rechargez la page pour recommencer.</p></aside></div>
  </main><Footer/></>;
}
