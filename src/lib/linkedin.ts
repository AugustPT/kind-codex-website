// LinkedIn OAuth + posting helpers. Personal-profile text posts via w_member_social.
// Token storage is client-side (admin browser localStorage) for the human-in-the-loop
// flow; the post endpoint also accepts an env token for future autonomous posting.

const AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const SCOPES = "openid profile w_member_social";

export function authorizeUrl(state: string): string {
  const p = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID || "",
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI || "",
    scope: SCOPES,
    state,
  });
  return `${AUTH_URL}?${p.toString()}`;
}

export async function exchangeCode(code: string): Promise<{ access_token: string; expires_in: number }> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.LINKEDIN_CLIENT_ID || "",
    client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI || "",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`token exchange ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

// OpenID Connect userinfo -> the member's stable id (the "sub" claim).
export async function getPersonSub(accessToken: string): Promise<string> {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`userinfo ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const d = await res.json();
  return String(d.sub || "");
}

// Publish a plain-text post to the member's feed.
export async function postText(
  text: string,
  token?: string,
  urn?: string
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const accessToken = token || process.env.LINKEDIN_ACCESS_TOKEN;
  const sub = urn || process.env.LINKEDIN_PERSON_URN;
  if (!accessToken || !sub) return { ok: false, error: "LinkedIn not connected (no token). Click Connect LinkedIn first." };

  const author = sub.startsWith("urn:") ? sub : `urn:li:person:${sub}`;
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    return { ok: false, error: `LinkedIn ${res.status}: ${detail}` };
  }
  return { ok: true, id: res.headers.get("x-restli-id") || "" };
}

// Publish a post WITH an image (PNG bytes) to the member's feed. Uses the legacy
// v2 assets + ugcPosts flow, which works with w_member_social (no gated API).
// pngBase64 may be a raw base64 string or a data:image/png;base64,... URL.
export async function postImage(
  text: string,
  pngBase64: string,
  token?: string,
  urn?: string
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const accessToken = token || process.env.LINKEDIN_ACCESS_TOKEN;
  const sub = urn || process.env.LINKEDIN_PERSON_URN;
  if (!accessToken || !sub) return { ok: false, error: "LinkedIn not connected (no token). Click Connect LinkedIn first." };
  const author = sub.startsWith("urn:") ? sub : `urn:li:person:${sub}`;
  const auth = { Authorization: `Bearer ${accessToken}` };

  // 1) register the upload
  const reg = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json", "X-Restli-Protocol-Version": "2.0.0" },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: author,
        serviceRelationships: [{ relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }],
      },
    }),
  });
  if (!reg.ok) return { ok: false, error: `register ${reg.status}: ${(await reg.text()).slice(0, 200)}` };
  const regData = await reg.json();
  const uploadUrl =
    regData?.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl;
  const asset: string = regData?.value?.asset;
  if (!uploadUrl || !asset) return { ok: false, error: "register: no uploadUrl/asset returned" };

  // 2) upload the PNG bytes
  const bytes = Buffer.from(String(pngBase64).replace(/^data:image\/\w+;base64,/, ""), "base64");
  const up = await fetch(uploadUrl, { method: "PUT", headers: { ...auth, "Content-Type": "image/png" }, body: bytes });
  if (!up.ok && up.status !== 201) return { ok: false, error: `upload ${up.status}: ${(await up.text().catch(() => "")).slice(0, 150)}` };

  // 3) create the post referencing the uploaded image
  const post = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json", "X-Restli-Protocol-Version": "2.0.0" },
    body: JSON.stringify({
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "IMAGE",
          media: [{ status: "READY", media: asset, title: { text: "KindCodex" } }],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  if (!post.ok) return { ok: false, error: `post ${post.status}: ${(await post.text()).slice(0, 200)}` };
  return { ok: true, id: post.headers.get("x-restli-id") || "" };
}
