export type TelegramPayload = {
  title?: string;
  fields: Record<string, unknown>;
};

export async function sendToTelegram(payload: TelegramPayload) {
  try {
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return await res.json();
  } catch (err) {
    console.error('sendToTelegram failed:', err);
    return { ok: false };
  }
}
