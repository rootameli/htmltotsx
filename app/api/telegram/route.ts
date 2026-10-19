import { NextRequest, NextResponse } from "next/server";

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildMessage(data: Record<string, unknown>) {
  const lines: string[] = ["<b>📩 Nouveau formulaire</b>", ""];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    lines.push(`<b>${escapeHtml(key)}</b> : ${escapeHtml(String(value))}`);
  }
  lines.push("", `<i>${new Date().toLocaleString("fr-FR")}</i>`);
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: "Config Telegram manquante" },
        { status: 500 }
      );
    }

    const data = await req.json();

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(data),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Telegram error:", err);
      return NextResponse.json({ ok: false, error: err }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}