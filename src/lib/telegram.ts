export async function sendToTelegram(data: Record<string, unknown>) {
  try {
    const res = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("sendToTelegram failed:", err);
    return { ok: false };
  }
}