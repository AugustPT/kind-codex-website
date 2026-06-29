"use client";

import React, { useEffect, useRef, useState } from "react";

interface Score { grade: string; band: string; headline: string; context: string; tip: string; cure: string; minutes: number; }

const cream = "#faf9f5", ink = "#1c1917", terra = "#c2410c", muted = "#57534e", line = "#e7e5e4";

export default function GradePage() {
  const [stage, setStage] = useState<"form" | "sent" | "scored">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<Score | null>(null);
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);
  const tries = useRef(0);

  useEffect(() => () => { if (poll.current) clearInterval(poll.current); }, []);

  async function submit() {
    setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Enter a valid business email."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, business, website }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Something went wrong."); setBusy(false); return; }
      setStage("sent");
      startPolling();
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function startPolling() {
    if (poll.current) clearInterval(poll.current);
    tries.current = 0;
    poll.current = setInterval(async () => {
      tries.current++;
      if (tries.current > 24) { if (poll.current) clearInterval(poll.current); return; } // ~10 min, then rely on email
      try {
        const r = await fetch(`/api/grade/status?email=${encodeURIComponent(email)}`);
        const d = await r.json();
        if (d.status === "scored" && d.score) {
          if (poll.current) clearInterval(poll.current);
          setScore(d.score);
          setStage("scored");
        }
      } catch { /* keep polling */ }
    }, 25_000);
  }

  const wrap: React.CSSProperties = { minHeight: "100vh", background: cream, color: ink, fontFamily: "system-ui, sans-serif" };
  const inner: React.CSSProperties = { maxWidth: 600, margin: "0 auto", padding: "52px 20px 90px" };
  const input: React.CSSProperties = { width: "100%", padding: "13px 14px", border: `1px solid ${line}`, borderRadius: 10, fontSize: 15, marginBottom: 12, boxSizing: "border-box", background: "#fff" };

  return (
    <div style={wrap}>
      <div style={inner}>
        <div style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: terra, fontWeight: 700 }}>
          KindCodex · Free tool
        </div>

        {stage === "form" && (
          <>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, lineHeight: 1.1, margin: "10px 0 10px", fontWeight: 700 }}>
              How fast do you reply to a new lead<span style={{ color: terra }}>?</span>
            </h1>
            <p style={{ color: muted, fontSize: 17, lineHeight: 1.55, margin: "0 0 8px", maxWidth: 540 }}>
              We&apos;ll send a sample buyer inquiry to your inbox. Reply to it like you would any real lead, and you&apos;ll
              get an honest read on your response time plus a quick tip to make it faster. Speed is the #1 thing that wins
              buyers, and it&apos;s the easiest thing to improve.
            </p>
            <p style={{ color: "#a8a29e", fontSize: 13, margin: "0 0 26px" }}>It&apos;s a friendly test from our address — reply naturally, we&apos;ll do the rest. No catch.</p>

            <input style={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <input style={input} placeholder="Business email (where leads reach you)" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
            <input style={input} placeholder="Brokerage / business name (optional)" value={business} onChange={(e) => setBusiness(e.target.value)} />
            <input style={input} placeholder="Website (optional)" value={website} onChange={(e) => setWebsite(e.target.value)} />
            {err && <p style={{ color: terra, fontSize: 13, margin: "2px 0 12px" }}>{err}</p>}
            <button onClick={submit} disabled={busy} style={{ width: "100%", padding: "15px", background: terra, color: "#fff", border: 0, borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
              {busy ? "Sending your test…" : "Grade my lead response →"}
            </button>
          </>
        )}

        {stage === "sent" && (
          <div style={{ marginTop: 28 }}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34, lineHeight: 1.15, margin: "0 0 14px", fontWeight: 700 }}>
              Check your inbox<span style={{ color: terra }}>.</span>
            </h1>
            <p style={{ color: muted, fontSize: 16, lineHeight: 1.6, margin: "0 0 14px" }}>
              A sample buyer just messaged you (subject: <strong>&ldquo;Is this property still available?&rdquo;</strong>).
              <strong> Reply to that message to get your score</strong> — the clock is running.
            </p>
            <p style={{ color: muted, fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>
              Don&apos;t see it? Check your spam or promotions folder (if it landed there, that&apos;s a clue in itself).
              No reply, no score — but reply any time and we&apos;ll send it.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#a8a29e", fontSize: 14, padding: "14px 16px", border: `1px solid ${line}`, borderRadius: 10, background: "#fff" }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: terra, animation: "kcpulse 1.2s infinite" }} />
              Waiting for your reply… your score appears here the moment you send it (and we&apos;ll email it too).
            </div>
            <style>{`@keyframes kcpulse{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}`}</style>
          </div>
        )}

        {stage === "scored" && score && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#a8a29e", fontWeight: 700 }}>Your score</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 120, lineHeight: 1, fontWeight: 700, color: score.band === "elite" ? "#15803d" : terra, margin: "4px 0 8px" }}>
              {score.grade}
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, lineHeight: 1.2, margin: "0 0 14px", fontWeight: 700 }}>{score.headline}</h1>
            <p style={{ color: muted, fontSize: 16, lineHeight: 1.6, margin: "0 0 18px" }}>{score.context}</p>
            <div style={{ border: `1px solid ${line}`, borderRadius: 12, background: "#fff", padding: "16px 18px", margin: "0 0 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: terra, marginBottom: 6 }}>One quick win you can use today</div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: ink }}>{score.tip}</div>
            </div>
            <p style={{ color: ink, fontSize: 17, lineHeight: 1.6, fontWeight: 600, margin: "0 0 26px" }}>{score.cure}</p>
            <a href="/demo?ref=grader" style={{ display: "inline-block", background: terra, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 16, padding: "15px 24px", borderRadius: 10 }}>
              See how it works →
            </a>
            <p style={{ color: "#a8a29e", fontSize: 13, margin: "20px 0 0" }}>We also emailed this to you. Reply any time and August will walk you through it.</p>
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 18, borderTop: `1px solid ${line}`, fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700 }}>
          KindCodex<span style={{ color: terra }}>.</span>
          <span style={{ fontFamily: "system-ui", fontWeight: 400, color: "#a8a29e", fontSize: 13, marginLeft: 10 }}>Invisible systems. Visible results.</span>
        </div>
      </div>
    </div>
  );
}
