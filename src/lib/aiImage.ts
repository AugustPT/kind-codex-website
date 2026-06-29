// AI image generation via OpenRouter (Gemini image model). Returns a data:image/png
// base64 URL or null. Used for photo-style and illustration-style content cards so
// posts use REAL imagery instead of flat template cards. No new API key needed.

const BASE = "https://openrouter.ai/api/v1/chat/completions";
const IMG_MODEL = process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-2.5-flash-image";

export async function generateImage(prompt: string): Promise<string | null> {
  if (!process.env.OPENROUTER_API_KEY) return null;
  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kindcodex.com",
        "X-Title": "KindCodex Content Engine",
      },
      body: JSON.stringify({
        model: IMG_MODEL,
        modalities: ["image", "text"],
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    const imgs = d?.choices?.[0]?.message?.images || [];
    const url = imgs[0]?.image_url?.url;
    return typeof url === "string" && url.startsWith("data:image") ? url : null;
  } catch {
    return null;
  }
}

// Build the image prompt per visual style. We never ask the model to render TEXT
// (AI text-in-image is unreliable) — text is overlaid by us afterward.
export function imagePromptFor(style: string, brief: string): string {
  const noText = "Absolutely no text, no words, no letters, no logos anywhere in the image.";
  if (style === "illustration") {
    return `Minimal modern editorial illustration, warm cream (#faf9f5) background with terracotta (#c2410c) and charcoal accents, flat vector style, lots of negative space, 4:5 vertical. Subject: ${brief}. ${noText}`;
  }
  // photo styles
  return `Editorial documentary photograph, 4:5 vertical, natural warm cinematic lighting, shallow depth of field, muted realistic tones, candid and authentic (not stocky). Subject: ${brief}. ${noText}`;
}
