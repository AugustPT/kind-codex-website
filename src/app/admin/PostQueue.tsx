"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { POST_MANIFEST, type QueuePost } from "@/data/postQueue";

// The approval + posting hub. Seeded from POST_MANIFEST (the ready-made pieces).
// Per-post state (approve/reject, edited caption, schedule, posted) persists in the
// browser (localStorage "kc_queue") — this is a single-admin tool. Approved posts can
// be fired one-click, or auto-posted when they come due (see the banner). True
// server-side "posts while you sleep" needs a datastore + cron (noted in the UI).

type Status = "pending" | "approved" | "rejected" | "posted";
interface PostState {
  status: Status;
  caption?: string; // caption override
  date?: string; // scheduled HST day, "YYYY-MM-DD"
  postedAt?: string; // ISO
  postId?: string;
}
type QState = Record<string, PostState>;

const KEY = "kc_queue";
const AUTO_KEY = "kc_queue_auto"; // "on"/"off"
const AUTORUN_KEY = "kc_queue_autorun"; // last auto-run HST day
const HST = "Pacific/Honolulu";
const SEE_MORE = 210;

const todayYmd = () => new Date().toLocaleDateString("en-CA", { timeZone: HST });
function addWeekday(ymd: string, n = 1): string {
  const d = new Date(ymd + "T12:00:00Z");
  let added = 0;
  while (added < n) {
    d.setUTCDate(d.getUTCDate() + 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
}
const prettyDay = (ymd?: string) =>
  ymd ? new Date(ymd + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }) : "";

function blobToB64(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result).split(",")[1] || "");
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

export default function PostQueue({
  authKey,
  liConnected,
  onConnect,
}: {
  authKey: string;
  liConnected: boolean;
  onConnect: () => void;
}) {
  const [state, setState] = useState<QState>({});
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "posted" | "rejected">("pending");
  const [busy, setBusy] = useState<string>("");
  const [log, setLog] = useState<string>("");
  const [auto, setAuto] = useState(true);
  const [zoom, setZoom] = useState<string | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      setState(JSON.parse(localStorage.getItem(KEY) || "{}"));
      setAuto((localStorage.getItem(AUTO_KEY) || "on") !== "off");
    } catch {
      /* ignore */
    }
  }, []);
  const persist = useCallback((next: QState) => {
    setState(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const st = (id: string): PostState => state[id] || { status: "pending" };
  const caption = (p: QueuePost) => st(p.id).caption ?? p.caption;

  const approvedDates = () =>
    Object.values(state).filter((s) => s.status === "approved" && s.date).map((s) => s.date!) as string[];

  function nextSlot(): string {
    const days = approvedDates().sort();
    const last = days.length ? days[days.length - 1] : "";
    const start = !last || last < todayYmd() ? todayYmd() : last;
    return addWeekday(start, 1);
  }

  function update(id: string, patch: Partial<PostState>) {
    persist({ ...state, [id]: { ...st(id), ...patch } });
  }
  function approve(id: string) {
    const cur = st(id);
    persist({ ...state, [id]: { ...cur, status: "approved", date: cur.date || nextSlot() } });
  }

  // --- posting ---
  const postOne = useCallback(
    async (p: QueuePost): Promise<{ ok: boolean; id?: string; error?: string }> => {
      let li: { token?: string; urn?: string } | null = null;
      try { li = JSON.parse(localStorage.getItem("kc_li") || "null"); } catch { /* ignore */ }
      if (!li?.token) { onConnect(); return { ok: false, error: "LinkedIn not connected" }; }
      let imagePng: string | undefined;
      if (p.image) {
        const r = await fetch(p.image);
        if (!r.ok) return { ok: false, error: `image ${r.status}` };
        imagePng = await blobToB64(await r.blob());
      }
      const text = st(p.id).caption ?? p.caption;
      const res = await fetch("/api/content/post", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-key": authKey },
        body: JSON.stringify({ text, token: li.token, urn: li.urn, imagePng }),
      });
      const j = await res.json().catch(() => ({}));
      return { ok: res.ok && j.ok !== false, id: j.id, error: j.error };
    },
    [authKey, onConnect, state]
  );

  async function postNow(p: QueuePost) {
    setBusy(p.id);
    setLog("");
    try {
      const r = await postOne(p);
      if (r.ok) update(p.id, { status: "posted", postedAt: new Date().toISOString(), postId: r.id });
      else setLog(`❌ ${p.id}: ${r.error || "post failed"}`);
    } finally {
      setBusy("");
    }
  }

  const duePosts = useMemo(
    () => POST_MANIFEST.filter((p) => { const s = st(p.id); return s.status === "approved" && s.date && s.date <= todayYmd(); }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  async function postAllDue() {
    setBusy("__all__");
    let done = 0;
    const lines: string[] = [];
    for (const p of duePosts) {
      const r = await postOne(p);
      if (r.ok) { update(p.id, { status: "posted", postedAt: new Date().toISOString(), postId: r.id }); done++; lines.push(`✅ ${p.id}`); }
      else lines.push(`❌ ${p.id}: ${r.error || "failed"}`);
      await new Promise((res) => setTimeout(res, 1600));
    }
    setLog(`Posted ${done}/${duePosts.length}. ${lines.join("  ")}`);
    setBusy("");
  }

  // auto-post due items at most once per HST day when the tab is open
  useEffect(() => {
    if (!liConnected || !auto) return;
    if (localStorage.getItem(AUTORUN_KEY) === todayYmd()) return;
    if (!duePosts.length) return;
    localStorage.setItem(AUTORUN_KEY, todayYmd());
    postAllDue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liConnected, auto, duePosts.length]);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, posted: 0, rejected: 0 };
    for (const p of POST_MANIFEST) c[st(p.id).status]++;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const shown = POST_MANIFEST.filter((p) => filter === "all" || st(p.id).status === filter);

  return (
    <>
      {/* toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Stat label="Pending" value={counts.pending} />
        <Stat label="Approved" value={counts.approved} accent />
        <Stat label="Posted" value={counts.posted} />
        <Stat label="Rejected" value={counts.rejected} />
        <button onClick={onConnect} style={liConnected ? btnGhost : btnActive}>
          {liConnected ? "LinkedIn ✓ (reconnect)" : "🔗 Connect LinkedIn"}
        </button>
      </div>

      {/* how it works + due banner */}
      <div style={{ padding: "12px 14px", border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", marginBottom: 14, fontSize: 13, color: "#57534e", lineHeight: 1.5 }}>
        <strong style={{ color: "#1c1917" }}>Green-light a post → it joins the schedule and posts on its day.</strong> Approve to add it to the queue (one per weekday, auto-scheduled — change the date anytime). Reject to drop it.{" "}
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
          <input type="checkbox" checked={auto} onChange={(e) => { setAuto(e.target.checked); localStorage.setItem(AUTO_KEY, e.target.checked ? "on" : "off"); }} />
          Auto-post due items when I open this page
        </label>
        <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 4 }}>Fully hands-off posting (while this page is closed) needs a small datastore + cron — ask me to wire it and it runs itself.</div>
      </div>

      {duePosts.length > 0 && (
        <div style={{ padding: "12px 14px", border: "1px solid #fdba74", borderRadius: 12, background: "#fff7ed", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, color: "#9a3412", fontWeight: 600 }}>{duePosts.length} approved post{duePosts.length > 1 ? "s are" : " is"} due to go out.</span>
          <button onClick={postAllDue} disabled={!!busy} style={{ ...btnActive, opacity: busy ? 0.6 : 1 }}>{busy === "__all__" ? "Posting…" : `Post ${duePosts.length} now`}</button>
        </div>
      )}

      {log && <p style={{ fontSize: 13, color: "#1c1917", marginBottom: 12, background: "#f5f5f4", padding: "8px 12px", borderRadius: 8 }}>{log}</p>}

      {/* filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {(["pending", "approved", "posted", "rejected", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={f === filter ? btnActive : btnGhost}>{f}</button>
        ))}
      </div>

      {/* cards */}
      <div style={{ display: "grid", gap: 14 }}>
        {shown.map((p) => {
          const s = st(p.id);
          const cap = caption(p);
          const visible = cap.slice(0, SEE_MORE);
          return (
            <div key={p.id} style={{ border: `1px solid ${s.status === "approved" ? "#fdba74" : s.status === "posted" ? "#bbf7d0" : "#e7e5e4"}`, borderRadius: 12, background: "#fff", padding: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {/* preview */}
              <div style={{ flex: "0 0 220px" }}>
                {p.image ? (
                  <img src={p.image} alt={p.label} loading="lazy" decoding="async" onClick={() => setZoom(p.image)} title="Click to enlarge" style={{ width: 220, height: 275, borderRadius: 10, border: "1px solid #f0efea", display: "block", objectFit: "cover", background: "#faf9f5", cursor: "zoom-in" }} />
                ) : (
                  <div style={{ width: 220, height: 275, borderRadius: 10, border: "1px dashed #d6d3d1", display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a29e", fontSize: 12 }}>Text-only post</div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ ...pill, background: "#f5f5f4", color: "#57534e" }}>{p.id}</span>
                  <span style={{ ...pill, background: "#eef2ff", color: "#3730a3" }}>{p.label}</span>
                  <StatusBadge status={s.status} />
                </div>
              </div>

              {/* caption + controls */}
              <div style={{ flex: "1 1 380px", minWidth: 300 }}>
                <textarea
                  value={cap}
                  onChange={(e) => update(p.id, { caption: e.target.value })}
                  rows={9}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }}
                />
                <div style={{ fontSize: 11, color: cap.length > SEE_MORE ? "#9a3412" : "#a8a29e", marginTop: 4 }}>
                  {cap.length} chars · first {Math.min(SEE_MORE, cap.length)} show before “see more”: <span style={{ color: "#78716c" }}>“…{visible.slice(-40)}”</span>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                  {s.status !== "approved" && s.status !== "posted" && (
                    <button onClick={() => approve(p.id)} style={{ ...btnActive, background: "#16a34a", border: "1px solid #16a34a" }}>✓ Approve</button>
                  )}
                  {s.status !== "rejected" && s.status !== "posted" && (
                    <button onClick={() => update(p.id, { status: "rejected" })} style={{ ...btnGhost, color: "#b91c1c", borderColor: "#fecaca" }}>✗ Reject</button>
                  )}
                  {(s.status === "rejected" || s.status === "posted") && (
                    <button onClick={() => update(p.id, { status: "pending", postedAt: undefined, postId: undefined })} style={btnGhost}>↺ Reset to pending</button>
                  )}
                  {s.status === "approved" && (
                    <>
                      <label style={{ fontSize: 12, color: "#78716c" }}>Posts on{" "}
                        <input type="date" value={s.date || ""} onChange={(e) => update(p.id, { date: e.target.value })} style={{ padding: "5px 8px", border: "1px solid #e7e5e4", borderRadius: 6, fontSize: 12 }} />
                      </label>
                      <span style={{ fontSize: 12, color: "#a8a29e" }}>{prettyDay(s.date)}</span>
                      <button onClick={() => postNow(p)} disabled={busy === p.id || !liConnected} style={{ ...btnActive, opacity: busy === p.id || !liConnected ? 0.5 : 1 }}>{busy === p.id ? "Posting…" : "Post now"}</button>
                    </>
                  )}
                  {s.status === "posted" && (
                    <span style={{ fontSize: 12, color: "#166534" }}>Posted {s.postedAt ? new Date(s.postedAt).toLocaleDateString("en-US", { timeZone: HST, month: "short", day: "numeric" }) : ""} · <a href="https://www.linkedin.com/in/augustpturner/recent-activity/all/" target="_blank" rel="noreferrer" style={{ color: "#c2410c" }}>view ↗</a></span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {shown.length === 0 && <div style={{ padding: 24, border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", color: "#8a8a93" }}>Nothing in “{filter}”.</div>}
      </div>

      {zoom && (
        <div onClick={() => setZoom(null)} style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "zoom-out", padding: 24 }}>
          <img src={zoom} alt="enlarged post" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "94vw", maxHeight: "94vh", borderRadius: 12, boxShadow: "0 24px 70px rgba(0,0,0,0.6)", cursor: "default" }} />
          <button onClick={() => setZoom(null)} style={{ position: "fixed", top: 20, right: 24, background: "#fff", border: 0, borderRadius: 999, width: 40, height: 40, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; fg: string; t: string }> = {
    pending: { bg: "#f5f5f4", fg: "#57534e", t: "pending" },
    approved: { bg: "#fff7ed", fg: "#9a3412", t: "approved" },
    posted: { bg: "#dcfce7", fg: "#166534", t: "posted" },
    rejected: { bg: "#fef2f2", fg: "#b91c1c", t: "rejected" },
  };
  const s = map[status];
  return <span style={{ ...pill, background: s.bg, color: s.fg }}>{s.t}</span>;
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ padding: "10px 16px", border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff", minWidth: 96 }}>
      <div style={{ fontSize: 11, color: "#8a8a93", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#c2410c" : "#1c1917" }}>{value}</div>
    </div>
  );
}

const pill: React.CSSProperties = { padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" };
const btnGhost: React.CSSProperties = { padding: "7px 12px", border: "1px solid #e7e5e4", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" };
const btnActive: React.CSSProperties = { ...btnGhost, background: "#c2410c", color: "#fff", border: "1px solid #c2410c" };
