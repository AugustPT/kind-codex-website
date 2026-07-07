"use client";

import React, { useEffect, useState, useCallback } from "react";
import PostQueue from "./PostQueue";

interface Row {
  email: string;
  name: string;
  company: string;
  pipeline: string;
  funnel: string;
  ref: string;
  stage: string;
  nurtureStage: number | null;
  booked: boolean;
  outreachStep: number;
  outreachLastSent: string;
  pain: string;
  research: string;
  result: string;
  contactEmail: string;
  contactUrl: string;
  draftedAt: string;
  createdAt: string;
}

interface Reply {
  email: string;
  name: string;
  company: string;
  funnel: string;
  replySubject: string;
  replyText: string;
  replyAt: string;
  intent: string;
  rationale: string;
  aiDraft: string;
  suggestedSubject: string;
}

interface GenPost {
  topic: string;
  format: string;
  angle: string;
  visualStyle: string;
  body: string;
  hashtags: string[];
  fullText: string;
  imageSvg?: string;
  bgImage?: string;
  overlaySvg?: string;
  slidesSvg?: string[];
  chatgptImagePrompt?: string;
  chatgptSlidePrompts?: string[];
}

const OUTBOUND_STAGES = ["researched", "drafted", "sent", "replied", "won", "dead"];

// Hawaii-time date helpers — the sender stamps OUTREACH_LAST_SENT as a UTC ISO
// string, so convert to HST before comparing/displaying.
const HST = "Pacific/Honolulu";
const hstDay = (iso: string) => {
  const t = Date.parse(iso || "");
  return isNaN(t) ? "" : new Date(t).toLocaleDateString("en-CA", { timeZone: HST });
};
const hstShort = (iso: string) => {
  const t = Date.parse(iso || "");
  return isNaN(t) ? "" : new Date(t).toLocaleDateString("en-US", { timeZone: HST, month: "short", day: "numeric" });
};

const INTENT_COLOR: Record<string, { bg: string; fg: string }> = {
  interested: { bg: "#dcfce7", fg: "#166534" },
  question: { bg: "#dbeafe", fg: "#1e40af" },
  objection: { bg: "#fef3c7", fg: "#92400e" },
  not_interested: { bg: "#f5f5f4", fg: "#57534e" },
  auto_reply: { bg: "#f5f5f4", fg: "#a8a29e" },
  other: { bg: "#f5f5f4", fg: "#57534e" },
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<"pipeline" | "replies" | "content" | "queue">("pipeline");
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ total: 0, inbound: 0, outbound: 0, booked: 0, queueSize: 0, orphanCount: 0 });
  const [filter, setFilter] = useState<"all" | "inbound" | "outbound">("all");
  const [sort, setSort] = useState<{ col: string; dir: number }>({ col: "createdAt", dir: -1 });
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // replies state
  const [replies, setReplies] = useState<Reply[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({});
  const [repLoading, setRepLoading] = useState(false);
  const [busy, setBusy] = useState<string>("");

  // content state
  const [posts, setPosts] = useState<GenPost[]>([]);
  const [postText, setPostText] = useState<Record<number, string>>({});
  const [genLoading, setGenLoading] = useState(false);

  const generate = useCallback(async (k: string) => {
    setGenLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/content/generate?n=5&fast=1", { headers: { "x-admin-key": k } });
      if (r.status === 401) { setAuthed(false); return; }
      const d = await r.json();
      if (d.error) { setErr(d.error); return; }
      setPosts(d.posts || []);
      const init: Record<number, string> = {};
      (d.posts || []).forEach((p: GenPost, i: number) => (init[i] = p.fullText));
      setPostText(init);
    } catch {
      setErr("Failed to generate.");
    } finally {
      setGenLoading(false);
    }
  }, []);

  function copyText(t: string) {
    try { navigator.clipboard.writeText(t); } catch { /* ignore */ }
  }
  function svgDataUri(svg: string) {
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
  }
  // Robust download. The old path set a.href to a multi-MB data: URL on a DETACHED anchor
  // and clicked it after an await — Chrome/Edge silently refuse that (large data: downloads
  // are blocked, and the user-gesture is lost across the await). Blob + object URL + an
  // anchor attached to the DOM works in every browser.
  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
  }
  function dataUrlToBlob(dataUrl: string): Blob {
    const comma = dataUrl.indexOf(",");
    const head = dataUrl.slice(0, comma);
    const mime = (head.match(/data:([^;]+)/) || [])[1] || "image/png";
    const bin = atob(dataUrl.slice(comma + 1));
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  function downloadPng(svg: string, name: string) {
    svgToPng(svg)
      .then((dataUrl) => downloadBlob(dataUrlToBlob(dataUrl), name))
      .catch(() => alert("Could not render that image."));
  }
  function svgToPng(svg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, 1080, 1350);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("svg render failed"));
      img.src = svgDataUri(svg);
    });
  }
  function loadImg(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error("img load failed"));
      im.src = src;
    });
  }
  // Flatten a post's visual (photo+overlay, or card svg) to a PNG data URL, or null for text.
  async function composePost(p: GenPost): Promise<string | null> {
    try {
      if (p.bgImage) {
        const canvas = document.createElement("canvas");
        canvas.width = 1080; canvas.height = 1350;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        const bg = await loadImg(p.bgImage);
        ctx.drawImage(bg, 0, 0, 1080, 1350);
        if (p.overlaySvg) {
          const ov = await loadImg(svgDataUri(p.overlaySvg));
          ctx.drawImage(ov, 0, 0, 1080, 1350);
        }
        return canvas.toDataURL("image/png");
      }
      if (p.imageSvg) return await svgToPng(p.imageSvg);
    } catch { /* fall through */ }
    return null;
  }
  async function downloadPost(p: GenPost, i: number) {
    const png = await composePost(p);
    if (!png) { alert("Could not render this image — tell me and I'll fix it."); return; }
    downloadBlob(dataUrlToBlob(png), `kindcodex-post-${i + 1}.png`);
  }
  // Assemble a carousel's slides into ONE PDF (each 1080x1350 slide = one page) for upload as a
  // LinkedIn document post. jsPDF is loaded on demand so it never runs during SSR.
  const [pdfBusy, setPdfBusy] = useState<number | null>(null);
  async function downloadCarouselPdf(p: GenPost, i: number) {
    if (!p.slidesSvg || !p.slidesSvg.length) return;
    setPdfBusy(i);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1080, 1350], compress: true });
      for (let s = 0; s < p.slidesSvg.length; s++) {
        const png = await svgToPng(p.slidesSvg[s]);
        if (s > 0) pdf.addPage([1080, 1350], "portrait");
        pdf.addImage(png, "PNG", 0, 0, 1080, 1350);
      }
      downloadBlob(pdf.output("blob"), `kindcodex-carousel-${i + 1}.pdf`);
    } catch {
      alert("Could not build the PDF. Try again.");
    } finally {
      setPdfBusy(null);
    }
  }

  // Voting — stored in this browser so styles can be refined over time.
  const [voted, setVoted] = useState<Record<number, boolean>>({});
  function voteUp(p: GenPost, i: number) {
    try {
      const cur = JSON.parse(localStorage.getItem("kc_votes") || "[]");
      cur.push({ visualStyle: p.visualStyle, angle: p.angle, format: p.format, hook: (postText[i] ?? p.fullText).split("\n")[0].slice(0, 120), ts: Date.now() });
      localStorage.setItem("kc_votes", JSON.stringify(cur));
      setVoted((v) => ({ ...v, [i]: true }));
    } catch { /* ignore */ }
  }

  // Per-post AI edit: tell the AI what to change on this one post.
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [refining, setRefining] = useState<number | null>(null);
  async function applyEdit(i: number) {
    const instr = (feedback[i] || "").trim();
    if (!instr) { alert("Type what to change first."); return; }
    setRefining(i);
    try {
      const r = await fetch("/api/content/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ post: posts[i], instruction: instr }),
      });
      const d = await r.json();
      if (!r.ok) { alert("Edit failed: " + (d.error || r.status)); return; }
      setPosts((arr) => arr.map((x, idx) => (idx === i ? d.post : x)));
      setPostText((s) => ({ ...s, [i]: d.post.fullText }));
      setFeedback((s) => ({ ...s, [i]: "" }));
    } catch {
      alert("Edit failed.");
    } finally {
      setRefining(null);
    }
  }

  // LinkedIn connection (token stored in this browser by the OAuth callback)
  const [liConnected, setLiConnected] = useState(false);
  const [posting, setPosting] = useState<number | null>(null);
  useEffect(() => {
    try { setLiConnected(!!localStorage.getItem("kc_li")); } catch { /* ignore */ }
  }, [view]);

  function connectLinkedIn() {
    window.location.href = `/api/linkedin/start?key=${encodeURIComponent(key)}`;
  }
  async function postToLinkedIn(i: number) {
    let li: { token?: string; urn?: string } | null = null;
    try { li = JSON.parse(localStorage.getItem("kc_li") || "null"); } catch { /* ignore */ }
    if (!li || !li.token) { alert("Connect LinkedIn first (button up top)."); return; }
    const text = postText[i] ?? "";
    if (!text.trim()) { alert("Nothing to post."); return; }
    setPosting(i);
    try {
      let imagePng: string | undefined;
      const composed = posts[i] ? await composePost(posts[i]) : null;
      if (composed) imagePng = composed;
      const r = await fetch("/api/content/post", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ text, token: li.token, urn: li.urn, imagePng }),
      });
      const d = await r.json();
      if (!r.ok) {
        if ((d.error || "").includes("401") || (d.error || "").toLowerCase().includes("not connected")) {
          setLiConnected(false);
          alert("LinkedIn session expired — click Connect LinkedIn again.");
        } else {
          alert("Post failed: " + (d.error || r.status));
        }
        return;
      }
      alert("Posted to LinkedIn ✓");
    } catch {
      alert("Post failed.");
    } finally {
      setPosting(null);
    }
  }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("kc_admin_key") : "";
    if (saved) {
      setKey(saved);
      setAuthed(true);
    }
  }, []);

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/pipeline", { headers: { "x-admin-key": k } });
      if (r.status === 401) {
        setErr("Wrong password.");
        setAuthed(false);
        localStorage.removeItem("kc_admin_key");
        return;
      }
      const d = await r.json();
      setRows(d.rows || []);
      setCounts(d.counts || { total: 0, inbound: 0, outbound: 0, booked: 0, queueSize: 0, orphanCount: 0 });
      setAuthed(true);
      localStorage.setItem("kc_admin_key", k);
    } catch {
      setErr("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReplies = useCallback(async (k: string) => {
    setRepLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/replies", { headers: { "x-admin-key": k } });
      if (r.status === 401) { setAuthed(false); return; }
      const d = await r.json();
      const reps: Reply[] = d.replies || [];
      setReplies(reps);
      const init: Record<string, { subject: string; body: string }> = {};
      for (const rep of reps) init[rep.email] = { subject: rep.suggestedSubject, body: rep.aiDraft };
      setDrafts(init);
    } catch {
      setErr("Failed to scan inbox.");
    } finally {
      setRepLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && key) load(key);
  }, [authed, key, load]);

  useEffect(() => {
    if (authed && key && view === "replies") loadReplies(key);
  }, [authed, key, view, loadReplies]);

  async function setStage(email: string, stage: string) {
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ email, stage }),
    });
    load(key);
  }

  async function sendReply(email: string) {
    const d = drafts[email];
    if (!d || !d.body.trim()) { alert("Nothing to send."); return; }
    setBusy(email);
    try {
      const r = await fetch("/api/admin/reply-send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ email, subject: d.subject, body: d.body }),
      });
      if (!r.ok) { alert("Send failed."); return; }
      setReplies((prev) => prev.filter((x) => x.email !== email));
    } finally {
      setBusy("");
    }
  }

  async function markReply(email: string, stage: string) {
    setBusy(email);
    try {
      await fetch("/api/admin/reply-send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ email, stage }),
      });
      setReplies((prev) => prev.filter((x) => x.email !== email));
    } finally {
      setBusy("");
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f5" }}>
        <div style={{ width: 320, padding: 28, border: "1px solid #e7e5e4", borderRadius: 14, background: "#fff" }}>
          <h1 style={{ fontWeight: 700, fontSize: 18, color: "#1c1917" }}>KindCodex Pipeline</h1>
          <p style={{ fontSize: 13, color: "#8a8a93", margin: "6px 0 16px" }}>Enter admin password.</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(key)}
            placeholder="Password"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 14 }}
          />
          <button onClick={() => load(key)} style={{ width: "100%", marginTop: 12, padding: "10px", background: "#c2410c", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
            Open
          </button>
          {err && <p style={{ color: "#c2410c", fontSize: 12, marginTop: 10 }}>{err}</p>}
        </div>
      </div>
    );
  }

  const visible = rows
    .filter((r) => filter === "all" || r.pipeline === filter)
    .filter((r) => {
      if (!q) return true;
      const s = `${r.name} ${r.company} ${r.email} ${r.funnel} ${r.ref} ${r.pain} ${r.research}`.toLowerCase();
      return s.includes(q.toLowerCase());
    });

  const stageCount = (st: string) => rows.filter((r) => r.pipeline === "outbound" && r.stage === st).length;
  // Activity (not stage) — answers "did emails actually go out today?". A follow-up
  // re-touches a prospect already in "sent", so only these counters move for it.
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: HST });
  const sentTodayCount = rows.filter((r) => r.pipeline === "outbound" && hstDay(r.outreachLastSent) === todayStr).length;
  // Real cumulative EMAIL count: each OUTREACH_STEP = one email actually sent (first touch +
  // each follow-up). THIS is what reconciles with "~30 emails went out" — a distinct-prospect
  // count never could, because a follow-up re-touches someone already counted.
  const totalEmails = rows.reduce((n, r) => n + (r.pipeline === "outbound" ? Math.max(0, r.outreachStep || 0) : 0), 0);
  const sorted = [...visible].sort((a, b) => {
    const va = String((a as unknown as Record<string, unknown>)[sort.col] ?? "").toLowerCase();
    const vb = String((b as unknown as Record<string, unknown>)[sort.col] ?? "").toLowerCase();
    return va.localeCompare(vb, undefined, { numeric: true }) * sort.dir;
  });
  const sortBy = (col: string) => setSort((s) => (s.col === col ? { col, dir: -s.dir } : { col, dir: 1 }));
  const arrow = (col: string) => (sort.col === col ? (sort.dir === 1 ? " ▲" : " ▼") : " ↕");

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f5", color: "#1c1917", padding: "24px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h1 style={{ fontWeight: 700, fontSize: 22 }}>
            {view === "queue" ? "Post Queue" : view === "pipeline" ? "Pipeline" : view === "replies" ? "Replies" : "Content"}<span style={{ color: "#c2410c" }}>.</span>
          </h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setView("pipeline")} style={view === "pipeline" ? btnActive : btnGhost}>Pipeline</button>
            <button onClick={() => setView("replies")} style={view === "replies" ? btnActive : btnGhost}>
              Replies{replies.length ? ` (${replies.length})` : ""}
            </button>
            <button onClick={() => setView("queue")} style={view === "queue" ? btnActive : btnGhost}>Queue</button>
            <button onClick={() => setView("content")} style={view === "content" ? btnActive : btnGhost}>Generate</button>
            <button onClick={() => (view === "pipeline" ? load(key) : view === "replies" ? loadReplies(key) : view === "content" ? generate(key) : undefined)} style={btnGhost}>↻ Refresh</button>
          </div>
        </div>

        {err && <p style={{ color: "#c2410c", fontSize: 13, marginBottom: 12 }}>{err}</p>}

        {view === "queue" ? (
          <PostQueue authKey={key} liConnected={liConnected} onConnect={connectLinkedIn} />
        ) : view === "pipeline" ? (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <Stat label="Total" value={counts.total} />
              <Stat label="Sent today" value={sentTodayCount} accent />
              <Stat label="Emails sent" value={totalEmails} />
              <Stat label="Contacted" value={stageCount("sent")} />
              <Stat label="Drafted" value={stageCount("drafted")} />
              {counts.orphanCount > 0 && <Stat label="Unreachable" value={counts.orphanCount} />}
              <Stat label="Replied" value={stageCount("replied")} accent />
              <Stat label="Won" value={stageCount("won")} />
              <Stat label="Booked calls" value={counts.booked} />
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              {(["all", "inbound", "outbound"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={f === filter ? btnActive : btnGhost}>{f}</button>
              ))}
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, company, pain…" style={{ marginLeft: "auto", padding: "8px 12px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13, minWidth: 240 }} />
            </div>

            {loading && <p style={{ color: "#8a8a93" }}>Loading…</p>}

            <div style={{ overflowX: "auto", border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#8a8a93", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>
                    <th style={thSort} onClick={() => sortBy("name")}>Who{arrow("name")}</th>
                    <th style={thSort} onClick={() => sortBy("pipeline")}>Pipeline{arrow("pipeline")}</th>
                    <th style={thSort} onClick={() => sortBy("funnel")}>Funnel{arrow("funnel")}</th>
                    <th style={thSort} onClick={() => sortBy("stage")}>Stage{arrow("stage")}</th>
                    <th style={thSort} onClick={() => sortBy("outreachLastSent")}>Last touch{arrow("outreachLastSent")}</th>
                    <th style={th}>Pain / Research</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.email} style={{ borderTop: "1px solid #f0efea", verticalAlign: "top" }}>
                      <td style={td}>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        {r.company && r.company !== r.name && <div style={{ color: "#8a8a93" }}>{r.company}</div>}
                        <div style={{ color: "#a8a29e", fontSize: 11 }}>{r.contactEmail || r.email}</div>
                        {r.contactUrl && <a href={r.contactUrl} target="_blank" rel="noreferrer" style={{ color: "#c2410c", fontSize: 11 }}>site ↗</a>}
                      </td>
                      <td style={td}><span style={{ ...pill, background: r.pipeline === "inbound" ? "#dcfce7" : "#dbeafe", color: r.pipeline === "inbound" ? "#166534" : "#1e40af" }}>{r.pipeline}</span></td>
                      <td style={td}>{r.funnel}{r.ref && <div style={{ fontSize: 11, color: "#c2410c", fontWeight: 600 }}>via {r.ref}</div>}</td>
                      <td style={td}><span style={{ ...pill, background: r.booked ? "#c2410c" : "#f5f5f4", color: r.booked ? "#fff" : "#44403c" }}>{r.stage}</span></td>
                      <td style={td}>
                        {r.pipeline === "outbound" && r.outreachStep > 0 ? (
                          <div style={{ whiteSpace: "nowrap" }}>
                            <div style={{ fontWeight: 600, color: hstDay(r.outreachLastSent) === todayStr ? "#c2410c" : "#1c1917" }}>
                              {hstShort(r.outreachLastSent) || "—"}{hstDay(r.outreachLastSent) === todayStr ? " · today" : ""}
                            </div>
                            <div style={{ color: "#a8a29e", fontSize: 11 }}>touch #{r.outreachStep} of {3}</div>
                          </div>
                        ) : <span style={{ color: "#d6d3d1" }}>—</span>}
                      </td>
                      <td style={{ ...td, maxWidth: 360 }}>
                        {r.pain && <div><strong style={{ color: "#9a3412" }}>Pain:</strong> {r.pain}</div>}
                        {r.research && <div style={{ color: "#57534e" }}>{r.research}</div>}
                        {r.result && <div style={{ color: "#57534e" }}><em>{r.result}</em></div>}
                      </td>
                      <td style={td}>
                        {r.pipeline === "outbound" ? (
                          <select value={OUTBOUND_STAGES.includes(r.stage) ? r.stage : "researched"} onChange={(e) => setStage(r.email, e.target.value)} style={{ padding: "5px 8px", border: "1px solid #e7e5e4", borderRadius: 6, fontSize: 12 }}>
                            {OUTBOUND_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : <span style={{ color: "#a8a29e", fontSize: 11 }}>auto</span>}
                      </td>
                    </tr>
                  ))}
                  {sorted.length === 0 && !loading && <tr><td style={td} colSpan={7}><span style={{ color: "#8a8a93" }}>No one here yet.</span></td></tr>}
                </tbody>
              </table>
            </div>
          </>
        ) : view === "replies" ? (
          <>
            <p style={{ color: "#8a8a93", fontSize: 13, marginBottom: 14 }}>
              Live from your inbox. AI drafted each reply — read theirs, tweak the draft, hit send. {repLoading && "Scanning…"}
            </p>
            {!repLoading && replies.length === 0 && (
              <div style={{ padding: 24, border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", color: "#8a8a93" }}>
                No new replies to handle. (Replies you’ve already sent or marked are hidden.)
              </div>
            )}
            <div style={{ display: "grid", gap: 14 }}>
              {replies.map((rep) => {
                const c = INTENT_COLOR[rep.intent] || INTENT_COLOR.other;
                const d = drafts[rep.email] || { subject: rep.suggestedSubject, body: rep.aiDraft };
                return (
                  <div key={rep.email} style={{ border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                      <div>
                        <span style={{ fontWeight: 700 }}>{rep.name}</span>
                        {rep.company && rep.company !== rep.name && <span style={{ color: "#8a8a93" }}> · {rep.company}</span>}
                        <span style={{ color: "#a8a29e", fontSize: 12 }}> · {rep.email}</span>
                      </div>
                      <span style={{ ...pill, background: c.bg, color: c.fg }}>{rep.intent.replace("_", " ")}</span>
                    </div>

                    <div style={{ background: "#faf9f5", border: "1px solid #f0efea", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: "#8a8a93", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>They said</div>
                      <div style={{ whiteSpace: "pre-wrap", fontSize: 13, color: "#44403c" }}>{rep.replyText || "(could not read body — check Gmail)"}</div>
                    </div>

                    <div style={{ fontSize: 11, color: "#8a8a93", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Your reply (AI draft — edit freely)</div>
                    <input
                      value={d.subject}
                      onChange={(e) => setDrafts((p) => ({ ...p, [rep.email]: { ...d, subject: e.target.value } }))}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13, marginBottom: 8 }}
                    />
                    <textarea
                      value={d.body}
                      onChange={(e) => setDrafts((p) => ({ ...p, [rep.email]: { ...d, body: e.target.value } }))}
                      rows={9}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
                    />
                    {rep.rationale && <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 6 }}>AI read: {rep.rationale}</div>}

                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <button onClick={() => sendReply(rep.email)} disabled={busy === rep.email} style={{ ...btnActive, opacity: busy === rep.email ? 0.6 : 1 }}>
                        {busy === rep.email ? "Sending…" : "Send reply"}
                      </button>
                      <button onClick={() => markReply(rep.email, "won")} disabled={busy === rep.email} style={btnGhost}>Mark won</button>
                      <button onClick={() => markReply(rep.email, "dead")} disabled={busy === rep.email} style={btnGhost}>Mark dead</button>
                      <a href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(rep.email)}`} target="_blank" rel="noreferrer" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>Open in Gmail ↗</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              <button onClick={() => generate(key)} disabled={genLoading} style={{ ...btnActive, opacity: genLoading ? 0.6 : 1 }}>
                {genLoading ? "Generating…" : "✨ Generate posts"}
              </button>
              <button onClick={connectLinkedIn} style={liConnected ? btnGhost : btnActive}>
                {liConnected ? "LinkedIn ✓ (reconnect)" : "🔗 Connect LinkedIn"}
              </button>
              <span style={{ color: "#8a8a93", fontSize: 13 }}>AI writes, you approve, then post — one click.</span>
            </div>
            {!genLoading && posts.length === 0 && (
              <div style={{ padding: 24, border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", color: "#8a8a93" }}>
                Click “Generate posts” for a fresh batch of LinkedIn posts, each with a branded image.
              </div>
            )}
            <div style={{ display: "grid", gap: 14 }}>
              {posts.map((p, i) => (
                <div key={i} style={{ border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", padding: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: "0 0 220px" }}>
                    {p.slidesSvg && p.slidesSvg.length ? (
                      <>
                        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: 6, border: "1px solid #f0efea", borderRadius: 10, background: "#faf9f5" }}>
                          {p.slidesSvg.map((sv, si) => (
                            <img key={si} src={svgDataUri(sv)} alt={`slide ${si + 1}`} style={{ width: 92, height: 115, flex: "0 0 auto", borderRadius: 6, border: "1px solid #e7e5e4", display: "block" }} />
                          ))}
                        </div>
                        <button onClick={() => downloadCarouselPdf(p, i)} disabled={pdfBusy === i} style={{ ...btnActive, width: "100%", marginTop: 8, opacity: pdfBusy === i ? 0.6 : 1 }}>
                          {pdfBusy === i ? "Building PDF…" : `⬇ Download carousel (${p.slidesSvg.length} slides, PDF)`}
                        </button>
                        <div style={{ fontSize: 11, color: "#8a8a93", marginTop: 6, lineHeight: 1.45 }}>
                          On LinkedIn: <strong>“+” → Add a document</strong>, upload this PDF, then paste the caption. (Carousels post by hand — LinkedIn’s API can’t.)
                        </div>
                      </>
                    ) : p.bgImage ? (
                      <>
                        <div style={{ position: "relative", width: 220, height: 275, borderRadius: 10, overflow: "hidden", border: "1px solid #f0efea" }}>
                          <img src={p.bgImage} alt="post" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                          {p.overlaySvg && <img src={svgDataUri(p.overlaySvg)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
                        </div>
                        <button onClick={() => downloadPost(p, i)} style={{ ...btnGhost, width: "100%", marginTop: 8 }}>⬇ Download image</button>
                      </>
                    ) : p.imageSvg ? (
                      <>
                        <img src={svgDataUri(p.imageSvg)} alt="post card" style={{ width: 220, height: 275, borderRadius: 10, border: "1px solid #f0efea", display: "block", objectFit: "cover" }} />
                        <button onClick={() => downloadPost(p, i)} style={{ ...btnGhost, width: "100%", marginTop: 8 }}>⬇ Download image</button>
                      </>
                    ) : (
                      <div style={{ width: 220, height: 275, borderRadius: 10, border: "1px dashed #d6d3d1", display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a29e", fontSize: 12, textAlign: "center" }}>Text-only post</div>
                    )}
                  </div>
                  <div style={{ flex: "1 1 360px", minWidth: 280 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <button onClick={() => voteUp(p, i)} title="I like this one" style={{ ...btnGhost, padding: "2px 9px", border: voted[i] ? "1px solid #16a34a" : "1px solid #e7e5e4", color: voted[i] ? "#16a34a" : "#44403c" }}>{voted[i] ? "👍 liked" : "👍"}</button>
                      <span style={{ ...pill, background: "#ecfeff", color: "#155e75", border: "1px solid #a5f3fc" }}>{p.visualStyle}</span>
                      {p.angle && <span style={{ ...pill, background: "#eef2ff", color: "#3730a3", border: "1px solid #c7d2fe" }}>{p.angle}</span>}
                      {p.topic && <span style={{ fontSize: 11, color: "#8a8a93", textTransform: "uppercase", letterSpacing: ".05em" }}>{p.topic}</span>}
                    </div>
                    <textarea
                      value={postText[i] ?? ""}
                      onChange={(e) => setPostText((s) => ({ ...s, [i]: e.target.value }))}
                      rows={10}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      {p.slidesSvg && p.slidesSvg.length ? (
                        <button onClick={() => copyText(postText[i] ?? "")} style={btnActive}>Copy caption</button>
                      ) : (
                        <button onClick={() => postToLinkedIn(i)} disabled={posting === i} style={{ ...btnActive, opacity: posting === i ? 0.6 : 1 }}>
                          {posting === i ? "Posting…" : "Post to LinkedIn"}
                        </button>
                      )}
                      <button onClick={() => copyText(postText[i] ?? "")} style={btnGhost}>Copy text</button>
                      <a href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer" style={{ ...btnGhost, textDecoration: "none" }}>Open LinkedIn ↗</a>
                    </div>
                    {(p.chatgptImagePrompt || (p.chatgptSlidePrompts && p.chatgptSlidePrompts.length)) ? (
                      <div style={{ marginTop: 10, padding: 10, border: "1px solid #e7e5e4", borderRadius: 8, background: "#faf9f5" }}>
                        <div style={{ fontSize: 11, color: "#8a8a93", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
                          ChatGPT image prompt{p.chatgptSlidePrompts && p.chatgptSlidePrompts.length ? ` — ${p.chatgptSlidePrompts.length} slides` : ""}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {p.chatgptSlidePrompts && p.chatgptSlidePrompts.length ? (
                            <>
                              {p.chatgptSlidePrompts.map((sp, si) => (
                                <button key={si} onClick={() => copyText(sp)} style={{ ...btnGhost, padding: "4px 9px" }}>Slide {si + 1}</button>
                              ))}
                              <button onClick={() => copyText((p.chatgptSlidePrompts || []).join("\n\n==== NEXT SLIDE ====\n\n"))} style={{ ...btnGhost, padding: "4px 9px", fontWeight: 700 }}>Copy all</button>
                            </>
                          ) : (
                            <button onClick={() => copyText(p.chatgptImagePrompt || "")} style={btnGhost}>Copy ChatGPT prompt</button>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 6 }}>
                          Paste into ChatGPT (smartest model) to render the image. Carousels: one slide per message, each matches slide 1.
                        </div>
                      </div>
                    ) : null}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <input
                        value={feedback[i] ?? ""}
                        onChange={(e) => setFeedback((s) => ({ ...s, [i]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && applyEdit(i)}
                        placeholder='Tell the AI what to change — "add a caption", "different photo", "punchier"…'
                        style={{ flex: 1, padding: "8px 10px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13 }}
                      />
                      <button onClick={() => applyEdit(i)} disabled={refining === i} style={{ ...btnGhost, opacity: refining === i ? 0.6 : 1, whiteSpace: "nowrap" }}>
                        {refining === i ? "Editing…" : "✎ Apply edit"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 12px" };
const thSort: React.CSSProperties = { padding: "10px 12px", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px" };
const pill: React.CSSProperties = { padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" };
const btnGhost: React.CSSProperties = { padding: "7px 12px", border: "1px solid #e7e5e4", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", textTransform: "capitalize" };
const btnActive: React.CSSProperties = { ...btnGhost, background: "#c2410c", color: "#fff", border: "1px solid #c2410c" };

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ padding: "12px 18px", border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", minWidth: 120 }}>
      <div style={{ fontSize: 11, color: "#8a8a93", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent ? "#c2410c" : "#1c1917" }}>{value}</div>
    </div>
  );
}
