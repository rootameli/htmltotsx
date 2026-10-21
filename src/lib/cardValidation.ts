export type CardType = "visa" | "mastercard" | "amex" | "unknown";

/** Algorithme de Luhn — vérifie la clé de contrôle du numéro de carte. */
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 12) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

/** Détecte le réseau à partir du préfixe BIN. */
export function detectCardType(cardNumber: string): CardType {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}

function expectedLengths(type: CardType): number[] {
  switch (type) {
    case "visa": return [13, 16, 19];
    case "mastercard": return [16];
    case "amex": return [15];
    default: return [13, 14, 15, 16, 17, 18, 19];
  }
}

export function validateCardNumber(cardNumber: string): { valid: boolean; error?: string } {
  const digits = cardNumber.replace(/\D/g, "");
  if (!digits) return { valid: false, error: "Numéro de carte requis." };
  if (!/^\d+$/.test(digits)) return { valid: false, error: "Chiffres uniquement." };
  if (digits.length < 13) return { valid: false, error: "Numéro de carte trop court." };

  // Refus des numéros manifestement factices
  if (/^(\d)\1+$/.test(digits)) {
    return { valid: false, error: "Numéro de carte invalide." };
  }
  if (digits === "1234567890123456" || digits === "0123456789012345") {
    return { valid: false, error: "Numéro de carte invalide." };
  }

  const type = detectCardType(digits);
  const expected = expectedLengths(type);
  if (!expected.includes(digits.length)) {
    return {
      valid: false,
      error: `Longueur invalide (${digits.length} chiffres). Attendu : ${expected.join(" ou ")} pour ${
        type === "unknown" ? "cette carte" : type
      }.`,
    };
  }

  if (!luhnCheck(digits)) {
    return { valid: false, error: "Numéro de carte invalide." };
  }

  return { valid: true };
}

export function validateExpiry(expiry: string): { valid: boolean; error?: string } {
  const match = expiry.trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return { valid: false, error: "Format MM/AA attendu." };
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return { valid: false, error: "Date d'expiration invalide" };

  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  if (year < nowYear || (year === nowYear && month < nowMonth)) {
    return { valid: false, error: "Carte expirée." };
  }
  if (year > nowYear + 20) {
    return { valid: false, error: "Date d'expiration invalide" };
  }
  return { valid: true };
}

export function validateCvv(cvv: string, cardType: CardType): { valid: boolean; error?: string } {
  const digits = cvv.replace(/\D/g, "");
  const expectedLen = cardType === "amex" ? 4 : 3;
  if (digits.length !== expectedLen) {
    return {
      valid: false,
      error: `CVV : ${expectedLen} chiffres attendus${cardType === "amex" ? " (Amex)" : ""}.`,
    };
  }
  return { valid: true };
}