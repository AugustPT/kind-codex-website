import { authorizeUrl } from "@/lib/linkedin";

export const dynamic = "force-dynamic";

// Kicks off the LinkedIn OAuth flow. Reached from the admin "Connect LinkedIn"
// button with ?key=<admin password>. Redirects the browser to LinkedIn's consent.
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== process.env.ADMIN_PASSWORD) {
    return new Response("unauthorized", { status: 401 });
  }
  if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_REDIRECT_URI) {
    return new Response("LinkedIn app not configured", { status: 500 });
  }
  return Response.redirect(authorizeUrl("kc_" + Date.now()), 302);
}
