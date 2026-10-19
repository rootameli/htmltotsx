export type BinInfo = {
  bin: string;
  bank: string;
  level: string;
  type: string;
  imageUrl?: string;
};

type BinlistResponse = {
  scheme?: string;
  type?: string;
  brand?: string;
  bank?: { name?: string };
};

type CustomBinApiResponse = {
  bank?: string;
  level?: string;
  type?: string;
};

const DEFAULT_BIN_INFO = {
  bank: "Inconnue",
  level: "Standard",
  type: "Inconnue",
};

const sanitizeCardNumber = (cardNumber: string) => cardNumber.replace(/\D/g, "");

const resolveEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key] ?? process.env[`${key}.`];
    if (value) return value;
  }
  return undefined;
};

const withTimeout = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
};

const normalizeLevelFromScheme = (scheme?: string) => {
  const normalizedScheme = scheme?.toLowerCase();
  if (normalizedScheme === "visa") return "CLASSIC";
  if (normalizedScheme === "mastercard") return "STANDARD";
  if (normalizedScheme === "american express") return "PREMIUM";
  return undefined;
};

const fetchCustomBinApi = async (bin: string, timeoutMs: number) => {
  const apiKey = resolveEnv("BIN_API_KEY", "BIN_API_TOKEN");
  const baseUrl = resolveEnv("BIN_API_URL");
  const useCustomApi = resolveEnv("USE_BIN_API", "BIN_API_ENABLED")?.toLowerCase();

  if (!apiKey || !baseUrl || !["1", "true", "yes", "oui"].includes(useCustomApi ?? "")) {
    return undefined;
  }

  const url = baseUrl.includes("{key}") || baseUrl.includes("{bin}")
    ? baseUrl.replace("{key}", encodeURIComponent(apiKey)).replace("{bin}", encodeURIComponent(bin))
    : `${baseUrl}${encodeURIComponent(apiKey)}&bin=${encodeURIComponent(bin)}`;
  const timeout = withTimeout(timeoutMs);

  try {
    const response = await fetch(url, { signal: timeout.signal, cache: "no-store" });
    if (!response.ok) return undefined;
    return (await response.json()) as CustomBinApiResponse;
  } finally {
    timeout.clear();
  }
};

const fetchBinlist = async (bin: string, timeoutMs: number) => {
  const timeout = withTimeout(timeoutMs);

  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`, {
      headers: { "Accept-Version": "3" },
      signal: timeout.signal,
      cache: "no-store",
    });
    if (!response.ok) return undefined;
    return (await response.json()) as BinlistResponse;
  } finally {
    timeout.clear();
  }
};

export const getBinInfo = async (cardNumber: string): Promise<BinInfo> => {
  const sanitizedCardNumber = sanitizeCardNumber(cardNumber);
  const bin = sanitizedCardNumber.slice(0, 6);
  const fallback: BinInfo = {
    bin,
    ...DEFAULT_BIN_INFO,
    imageUrl: bin.length === 6 ? `https://cardimages.imaginecurve.com/cards/${bin}.png` : undefined,
  };

  if (bin.length < 6) return fallback;

  try {
    const timeoutMs = Number(process.env.BIN_LOOKUP_TIMEOUT_MS ?? 2500);
    const customInfo = await fetchCustomBinApi(bin, timeoutMs);
    if (customInfo) {
      return {
        ...fallback,
        bank: customInfo.bank?.trim() || fallback.bank,
        level: customInfo.level?.trim().toUpperCase() || fallback.level,
        type: customInfo.type?.trim().toUpperCase() || fallback.type,
      };
    }

    const binlistInfo = await fetchBinlist(bin, timeoutMs);
    if (!binlistInfo) return fallback;

    return {
      ...fallback,
      bank: binlistInfo.bank?.name?.trim() || fallback.bank,
      level: binlistInfo.brand?.trim().toUpperCase() || normalizeLevelFromScheme(binlistInfo.scheme) || fallback.level,
      type: binlistInfo.type?.trim().toUpperCase() || fallback.type,
    };
  } catch (error) {
    console.error("Erreur bincheck", error);
    return fallback;
  }
};
