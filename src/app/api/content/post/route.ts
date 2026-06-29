import { NextResponse } from "next/server";
import { postText, postImage } from "@/lib/linkedin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authed(req: Request): boolean {
  const key = process.env.ADMIN_PASSWORD;
  if (!key) return false;
  return req.headers.get("x-admin-key") === key;
}

// Publish one approved post to LinkedIn. The access token + member urn come from
// the admin browser (localStorage), passed in the body — server doesn't store them.
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { text, token, urn, imagePng } = await req.json();
  if (!text || !String(text).trim()) {
    return NextResponse.json({ error: "empty post" }, { status: 400 });
  }
  const result = imagePng
    ? await postImage(String(text), String(imagePng), token, urn)
    : await postText(String(text), token, urn);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true, id: result.id });
}
