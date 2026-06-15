"use client";

import React, { useEffect, useState, useCallback } from "react";

interface Row {
  email: string;
  name: string;
  company: string;
  pipeline: string;
  funnel: string;
  stage: string;
  nurtureStage: number | null;
  booked: boolean;
  pain: string;
  research: string;
  result: string;
  contactUrl: string;
  draftedAt: string;
  createdAt: string;
}

const OUTBOUND_STAGES = ["researched", "drafted", "sent", "replied", "won", "dead"];

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ total: 0, inbound: 0, outbound: 0, booked: 0 });
  const [filter, setFilter] = useState<"all" | "inbound" | "outbound">("all");
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("kc_admin_key") : "";
    if (saved) {
      setKey(saved);
      setAuthed(true);
    }
  }, []);

  const load = useCallback(
    async (k: string) => {
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
        setCounts(d.counts || { total: 0, inbound: 0, outbound: 0, booked: 0 });
        setAuthed(true);
        localStorage.setItem("kc_admin_key", k);
      } catch (e) {
        setErr("Failed to load.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (authed && key) load(key);
  }, [authed, key, load]);

  async function setStage(email: string, stage: string) {
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ email, stage }),
    });
    load(key);
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
          <button
            onClick={() => load(key)}
            style={{ width: "100%", marginTop: 12, padding: "10px", background: "#c2410c", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
          >
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
      const s = `${r.name} ${r.company} ${r.email} ${r.funnel} ${r.pain} ${r.research}`.toLowerCase();
      return s.includes(q.toLowerCase());
    });

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f5", color: "#1c1917", padding: "24px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h1 style={{ fontWeight: 700, fontSize: 22 }}>Pipeline<span style={{ color: "#c2410c" }}>.</span></h1>
          <button onClick={() => load(key)} style={btnGhost}>↻ Refresh</button>
        </div>

        {/* counts */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <Stat label="Total" value={counts.total} />
          <Stat label="Inbound (audit)" value={counts.inbound} />
          <Stat label="Outbound (prospects)" value={counts.outbound} />
          <Stat label="Booked calls" value={counts.booked} accent />
        </div>

        {/* filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          {(["all", "inbound", "outbound"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={f === filter ? btnActive : btnGhost}>
              {f}
            </button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, company, pain…" style={{ marginLeft: "auto", padding: "8px 12px", border: "1px solid #e7e5e4", borderRadius: 8, fontSize: 13, minWidth: 240 }} />
        </div>

        {loading && <p style={{ color: "#8a8a93" }}>Loading…</p>}

        <div style={{ overflowX: "auto", border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#8a8a93", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>
                <th style={th}>Who</th>
                <th style={th}>Pipeline</th>
                <th style={th}>Funnel</th>
                <th style={th}>Stage</th>
                <th style={th}>Pain / Research</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.email} style={{ borderTop: "1px solid #f0efea", verticalAlign: "top" }}>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    {r.company && r.company !== r.name && <div style={{ color: "#8a8a93" }}>{r.company}</div>}
                    <div style={{ color: "#a8a29e", fontSize: 11 }}>{r.email}</div>
                    {r.contactUrl && (
                      <a href={r.contactUrl} target="_blank" rel="noreferrer" style={{ color: "#c2410c", fontSize: 11 }}>site ↗</a>
                    )}
                  </td>
                  <td style={td}>
                    <span style={{ ...pill, background: r.pipeline === "inbound" ? "#dcfce7" : "#dbeafe", color: r.pipeline === "inbound" ? "#166534" : "#1e40af" }}>{r.pipeline}</span>
                  </td>
                  <td style={td}>{r.funnel}</td>
                  <td style={td}>
                    <span style={{ ...pill, background: r.booked ? "#c2410c" : "#f5f5f4", color: r.booked ? "#fff" : "#44403c" }}>{r.stage}</span>
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
                    ) : (
                      <span style={{ color: "#a8a29e", fontSize: 11 }}>auto</span>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && !loading && (
                <tr><td style={td} colSpan={6}><span style={{ color: "#8a8a93" }}>No one here yet.</span></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 12px" };
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
