export type TelegramPayload = {
  title?: string;
  fields: Record<string, unknown>;
};

export async function sendToTelegram(payload: TelegramPayload) {
  try {
    const body = {
      ...payload.fields,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    const res = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });

    return await res.json();
  } catch (err) {
    console.error("sendToTelegram failed:", err);
    return { ok: false };
  }
}