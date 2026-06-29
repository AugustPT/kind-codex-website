"use client";

import React, { useState } from "react";

// Capture CTA shown under the live demo. Turns a viewer (who came from an ad/post)
// into a tracked KindCodex lead, tagged with the channel (ref) + funnel they want.

const INK = "#1c1917";
const TERRA = "#c2410c";
const MUTE = "#8a8a93";
const LINE = "#e7e5e4";

export default function DemoCTA({ ref_, funnel }: { ref_: string; funnel: string }) {
  const [f, setF] = useState({ name: "", email: "", business: "", company_website: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) { setState("error"); return; }
    setState("sending");
    try {
      const r = await fetch("/api/demo-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, ref: ref_, funnel }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ marginTop: 28, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: 22 }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        Want this catching <em>your</em> leads<span style={{ color: TERRA }}>?</span>
      </div>
      <p style={{ color: "#57534e", fontSize: 15, lineHeight: 1.5, margin: "0 0 16px", maxWidth: 540 }}>
        I&apos;ll build it for your business, free. Run it free for 30 days — then it&apos;s $1,000/mo only if you
        keep it. If it doesn&apos;t pull its weight, you owe nothing.
      </p>

      {state === "done" ? (
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "#ecfdf5", color: "#166534", fontSize: 15 }}>
          Got it{f.name ? `, ${f.name.split(" ")[0]}` : ""} — I&apos;ll reach out shortly. Watch your inbox.
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 460 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input placeholder="Your name" value={f.name} onChange={(e) => set("name", e.target.value)} style={{ ...inp, flex: 1, minWidth: 180 }} />
            <input placeholder="Brokerage / business" value={f.business} onChange={(e) => set("business", e.target.value)} style={{ ...inp, flex: 1, minWidth: 180 }} />
          </div>
          <input type="email" required placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} style={inp} />
          <input
            value={f.company_website}
            onChange={(e) => set("company_website", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
          />
          <button type="submit" disabled={state === "sending"} style={{ ...btn, opacity: state === "sending" ? 0.7 : 1 }}>
            {state === "sending" ? "Sending…" : "Set it up for my business →"}
          </button>
          {state === "error" && <p style={{ color: TERRA, fontSize: 13, margin: 0 }}>Add your email and try again.</p>}
        </form>
      )}
      <p style={{ color: MUTE, fontSize: 12, marginTop: 12 }}>No call required to start. Reply to my email if you have questions.</p>
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "11px 13px", border: `1px solid ${LINE}`, borderRadius: 8, fontSize: 14, color: INK, boxSizing: "border-box" };
const btn: React.CSSProperties = { padding: "13px", background: TERRA, color: "#fff", border: 0, borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" };
