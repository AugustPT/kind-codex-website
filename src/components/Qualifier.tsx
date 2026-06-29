"use client";

import React, { useEffect, useRef, useState } from "react";
import { STEPS, type QStep } from "@/lib/qualifyFlow";

// Interactive tap-to-qualify experience — the buyer answers in taps (not paragraphs)
// while the agent's lead card fills in live. Used by /demo (canned scenario) and
// /capture/[clientId] (real buyer -> POSTs to /api/leads/[clientId]).

const INK = "#1c1917";
const TERRA = "#c2410c";
const CREAM = "#faf9f5";
const MUTE = "#8a8a93";
const LINE = "#e7e5e4";

type Mode = "demo" | "capture";

interface Props {
  mode: Mode;
  agentName: string;
  brokerage?: string;
  area?: string;
  clientId?: string; // capture mode
  buyerName?: string; // demo default
  property?: string; // demo default
  seedAnswer?: string; // first answer the buyer already tapped in the email
  knownName?: string; // we already have it (from the qualifier email token)
  knownEmail?: string; // we already have it — confirm instead of retype
}

type Msg = { who: "ag" | "by"; text: string };

export default function Qualifier(props: Props) {
  const { mode } = props;
  const initialName = mode === "demo" ? (props.buyerName || "Jordan") : "";
  const initialProp = mode === "demo" ? (props.property || "the listing you asked about") : (props.area || "your area");
  const agent = props.agentName || "the team";

  const opener =
    mode === "demo"
      ? `Aloha ${initialName}, ${agent} here. Great taste, ${initialProp} is a stunner. Three quick taps and I'll fast-track you.`
      : `Aloha! ${agent} here. Happy to help fast. Tap a few quick answers and I'll get you exactly what you need.`;

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [idx, setIdx] = useState(0);
  const [taps, setTaps] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<"chat" | "contact" | "done">("chat");
  const [contact, setContact] = useState({ name: props.knownName || "", email: props.knownEmail || "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seed = (props.seedAnswer || "").trim();
    // Came in from an email tap-button: jump straight past Q1 with their answer recorded.
    if (seed && STEPS[0].opts.includes(seed)) {
      setMsgs([{ who: "ag", text: opener }, { who: "ag", text: STEPS[0].q }, { who: "by", text: seed }]);
      setAnswers({ [STEPS[0].field]: seed });
      setTaps(1);
      setIdx(1);
      const t = setTimeout(() => {
        setTyping(true);
        setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: "ag", text: STEPS[1].q }]); }, 600);
      }, 400);
      return () => clearTimeout(t);
    }
    // Normal start.
    setMsgs([{ who: "ag", text: opener }]);
    const t = setTimeout(() => {
      setTyping(true);
      setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: "ag", text: STEPS[0].q }]); }, 600);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { chatRef.current?.scrollTo({ top: 9e9 }); }, [msgs, typing, phase]);

  function pick(step: QStep, val: string) {
    setTaps((n) => n + 1);
    setAnswers((a) => ({ ...a, [step.field]: val }));
    setMsgs((m) => [...m, { who: "by", text: val }]);
    const next = idx + 1;
    setIdx(next);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (next < STEPS.length) {
        setMsgs((m) => [...m, { who: "ag", text: STEPS[next].q }]);
      } else if (mode === "capture") {
        setMsgs((m) => [...m, { who: "ag", text: "Perfect. Last thing — where should I send the details?" }]);
        setPhase("contact");
      } else {
        setMsgs((m) => [...m, { who: "ag", text: `You're all set${initialName ? `, ${initialName}` : ""}. I've got everything and I'll reach out within the hour. Talk soon.` }]);
        setPhase("done");
        maybeAlertDemo();
      }
    }, 650);
  }

  // Demo mode: optionally fire a real alert to August so he sees the qualified lead land.
  const [demoAlert, setDemoAlert] = useState("");
  async function maybeAlertDemo() {
    if (mode !== "demo" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(demoAlert)) return;
    try {
      await fetch("/api/lead-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: initialName, property: initialProp, agentName: agent, brokerage: props.brokerage,
          alertEmail: demoAlert,
          message: `Qualified via tap-flow. Timeline: ${answers.Timeline}. Financing: ${answers.Financing}. Wants: ${answers.Wants}.`,
        }),
      });
    } catch { /* non-fatal */ }
  }

  async function submitCapture(e?: React.FormEvent) {
    e?.preventDefault();
    if (!contact.email.trim()) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/leads/${props.clientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name, email: contact.email, phone: contact.phone, property: props.area || "",
          qualified: true, // came from the on-page tap flow → send a confirmation, not another qualifier
          message: `New inquiry. Timeline: ${answers.Timeline}. Financing: ${answers.Financing}. Wants: ${answers.Wants}.`,
        }),
      });
      if (r.ok) {
        setSent(true);
        setMsgs((m) => [...m, { who: "ag", text: `Got it${contact.name ? `, ${contact.name}` : ""}. Check your email in a moment, I'm sending details now.` }]);
        setPhase("done");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const hot = (answers.Timeline === "ASAP" || answers.Timeline === "1-3 months") && (answers.Financing === "Pre-approved" || answers.Financing === "Cash buyer");
  const step = STEPS[idx];
  const showChips = phase === "chat" && !typing && idx < STEPS.length && msgs.some((m) => m.text === step?.q);

  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
      {/* buyer phone */}
      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: MUTE, marginBottom: 6 }}>
          {mode === "demo" ? "The buyer's phone" : "Tell us what you need"}
        </div>
        <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: `1px solid ${LINE}` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: TERRA, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>
              {agent.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{agent}</div>
              <div style={{ fontSize: 12, color: MUTE }}><span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#1d9e75", verticalAlign: 1, marginRight: 4 }} />{props.brokerage ? `${props.brokerage} · ` : ""}replying now</div>
            </div>
          </div>

          <div ref={chatRef} style={{ display: "flex", flexDirection: "column", padding: "14px 12px", maxHeight: 320, overflowY: "auto" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                maxWidth: "85%", padding: "9px 13px", borderRadius: 14, fontSize: 14, lineHeight: 1.5, marginBottom: 8,
                ...(m.who === "ag"
                  ? { background: CREAM, color: INK, borderBottomLeftRadius: 4, alignSelf: "flex-start" }
                  : { background: TERRA, color: "#fff", borderBottomRightRadius: 4, alignSelf: "flex-end", marginLeft: "auto" }),
              }}>{m.text}</div>
            ))}
            {typing && (
              <div style={{ alignSelf: "flex-start", background: CREAM, borderRadius: 14, borderBottomLeftRadius: 4, padding: "10px 13px", marginBottom: 8 }}>
                <Dots />
              </div>
            )}
          </div>

          {showChips && (
            <div style={{ padding: "2px 12px 14px", display: "flex", flexWrap: "wrap" }}>
              {step.opts.map((o) => (
                <button key={o} onClick={() => pick(step, o)} style={chip}>{o}</button>
              ))}
            </div>
          )}

          {phase === "contact" && !sent && (
            props.knownEmail && !editing ? (
              <div style={{ padding: "2px 12px 14px" }}>
                <div style={{ fontSize: 13, color: MUTE, marginBottom: 8 }}>
                  Send the details to <strong style={{ color: INK }}>{props.knownEmail}</strong>?
                </div>
                <button onClick={() => submitCapture()} disabled={submitting} style={{ ...primaryBtn, width: "100%", marginBottom: 8, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Sending…" : "Yes, send it there"}
                </button>
                <button onClick={() => setEditing(true)} style={{ ...ghostBtn, width: "100%" }}>Update my info</button>
              </div>
            ) : (
              <form onSubmit={submitCapture} style={{ padding: "2px 12px 14px", display: "grid", gap: 8 }}>
                <input placeholder="Your name" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} style={inp} />
                <input type="email" required placeholder="Email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} style={inp} />
                <input placeholder="Phone (optional)" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} style={inp} />
                <button type="submit" disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}>{submitting ? "Sending…" : "Send it to " + agent}</button>
              </form>
            )
          )}
        </div>
      </div>

      {/* agent live card */}
      <div style={{ flex: 1, minWidth: 250 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: MUTE, marginBottom: 6 }}>
          {mode === "demo" ? `What ${agent} sees, live` : "Captured instantly"}
        </div>
        <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>New lead</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
              ...(phase === "done"
                ? (hot ? { background: "#fee2e2", color: "#b91c1c" } : { background: "#ffedd5", color: "#9a3412" })
                : { background: "#f5f5f4", color: MUTE }),
            }}>{phase === "done" ? (hot ? "HOT LEAD" : "WARM LEAD") : "capturing…"}</span>
          </div>
          {mode === "demo" && <Row label="Buyer" value={initialName} set />}
          {mode === "demo" && <Row label="Property" value={initialProp} set />}
          {mode === "capture" && contact.name ? <Row label="Buyer" value={contact.name} set /> : null}
          <Row label="Timeline" value={answers.Timeline || "—"} set={!!answers.Timeline} />
          <Row label="Financing" value={answers.Financing || "—"} set={!!answers.Financing} />
          <Row label="Wants" value={answers.Wants || "—"} set={!!answers.Wants} />
          {phase === "done" && (
            <div style={{ marginTop: 10, padding: "9px 11px", borderRadius: 8, background: "#eff6ff", color: "#1e40af", fontSize: 13 }}>
              {hot ? "Call within the hour — qualified, motivated buyer." : "Add to nurture, follow up this week."}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Metric label="Taps" value={String(taps)} />
            <Metric label="Sentences typed" value="0" />
          </div>
          {mode === "demo" && phase !== "done" && (
            <input
              value={demoAlert}
              onChange={(e) => setDemoAlert(e.target.value)}
              placeholder="Email the alert to me (optional)"
              style={{ ...inp, marginTop: 10 }}
            />
          )}
          {mode === "demo" && phase === "done" && (
            <button onClick={() => { setMsgs([]); setIdx(0); setTaps(0); setAnswers({}); setPhase("chat"); setSent(false); setTimeout(() => { setMsgs([{ who: "ag", text: opener }]); setTyping(true); setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: "ag", text: STEPS[0].q }]); }, 600); }, 50); }} style={{ ...ghostBtn, marginTop: 10, width: "100%" }}>↻ Replay</button>
          )}
        </div>
        {mode === "demo" && phase === "done" && (
          <p style={{ color: MUTE, fontSize: 13, lineHeight: 1.5, marginTop: 12 }}>
            That just happened with no typing and no one at the keyboard. For your business, this is the page every lead lands on, day or night.
          </p>
        )}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span aria-label="typing">
      <Dot d={0} /><Dot d={150} /><Dot d={300} />
      <style>{`@keyframes kcb{0%,60%,100%{opacity:.3}30%{opacity:1}}`}</style>
    </span>
  );
}
function Dot({ d }: { d: number }) {
  return <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: MUTE, margin: "0 1px", animation: `kcb 1s ${d}ms infinite` }} />;
}
function Row({ label, value, set }: { label: string; value: string; set?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 0", fontSize: 13, borderTop: `1px solid #f0efea` }}>
      <span style={{ color: MUTE }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: "right", color: set ? INK : "#d6d3d1" }}>{value}</span>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: CREAM, borderRadius: 8, padding: "8px 10px" }}>
      <div style={{ fontSize: 11, color: MUTE }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const chip: React.CSSProperties = { display: "inline-flex", alignItems: "center", padding: "8px 13px", margin: "0 6px 6px 0", border: `1px solid ${LINE}`, borderRadius: 999, background: "#fff", fontSize: 13, color: INK, cursor: "pointer" };
const inp: React.CSSProperties = { width: "100%", padding: "9px 11px", border: `1px solid ${LINE}`, borderRadius: 8, fontSize: 14, boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { padding: "11px", background: TERRA, color: "#fff", border: 0, borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${LINE}`, borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" };
