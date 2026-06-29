import { exchangeCode, getPersonSub } from "@/lib/linkedin";

export const dynamic = "force-dynamic";

// LinkedIn redirects here after the user clicks "Allow". We exchange the code for
// an access token, look up the member id, then stash both in the admin browser's
// localStorage (same origin) and bounce to /admin. No server-side token storage.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  const errDesc = url.searchParams.get("error_description") || "";

  if (err) return page(`<h2>LinkedIn didn't connect</h2><p>${esc(err)}: ${esc(errDesc)}</p><p><a href="/admin">Back to panel</a></p>`);
  if (!code) return page(`<h2>Missing authorization code</h2><p><a href="/admin">Back to panel</a></p>`);

  try {
    const tok = await exchangeCode(code);
    const sub = await getPersonSub(tok.access_token);
    if (!sub) throw new Error("Could not read your LinkedIn member id");
    // store client-side, then redirect to the admin Content tab
    const payload = JSON.stringify({ token: tok.access_token, urn: sub, ts: Date.now() });
    return page(
      `<h2>✓ LinkedIn connected</h2><p>Sending you back to your panel…</p>`,
      `try{localStorage.setItem('kc_li', ${JSON.stringify(payload)});}catch(e){}location.replace('/admin');`
    );
  } catch (e) {
    return page(`<h2>Connection error</h2><p>${esc((e as Error).message)}</p><p><a href="/admin">Back to panel</a></p>`);
  }
}

function esc(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function page(bodyHtml: string, script = ""): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KindCodex · LinkedIn</title></head>
<body style="font-family:system-ui,sans-serif;background:#faf9f5;color:#1c1917;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
<div style="text-align:center;padding:32px;border:1px solid #e7e5e4;border-radius:14px;background:#fff;max-width:460px">${bodyHtml}</div>
${script ? `<script>${script}</script>` : ""}
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
