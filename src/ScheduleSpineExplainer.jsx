import React, { useState } from "react";

// ── palette ──────────────────────────────────────────────────────────────
const COL = {
  order: "#378ADD", conc: "#D85A30", spine: "#7F77DD", node: "#8b8f98",
  ring: "#2c2c2a", edge: "#c2c4ca",
  laneA: "#1D9E75", laneB: "#D4537E", laneC: "#BA7517",
  ink: "#2c2c2a", sub: "#5f5e5a", faint: "#8a8a85", line: "#e4e3de",
  surface: "#faf9f5", panel: "#ffffff",
  safeBg: "#eef6e6", safeFg: "#2c5310", dangerBg: "#fbeaea", dangerFg: "#7d1f1f",
  warnBg: "#fbf0d8", warnFg: "#7a4d09", infoBg: "#e8f1fb", infoFg: "#13518a",
};

// ── schedule data (a graded precedence poset) ─────────────────────────────
const FR = [["A1"], ["B1", "B2", "B3"], ["C1", "C2"], ["D1", "D2", "D3"], ["E1"]];
const CX = [75, 208, 340, 472, 605], CY = 140, GAP = 66;
const N = {}, NL = [];
FR.forEach((f, i) => { const s = f.length; f.forEach((id, j) => { const y = CY + (j - (s - 1) / 2) * GAP; N[id] = { id, fr: i, x: CX[i], y }; NL.push(N[id]); }); });
const ED = []; for (let i = 0; i < 4; i++) FR[i].forEach(u => FR[i + 1].forEach(v => ED.push([u, v])));
const LANES = [["A1", "B1", "C1", "D1", "E1"], ["B2", "C2", "D2"], ["B3", "D3"]];
const LANE_FILL = [COL.laneA, COL.laneB, COL.laneC];
const LANE_OF = {}; LANES.forEach((L, li) => L.forEach(id => (LANE_OF[id] = li)));
const SPINE = ["A1", "B2", "C1", "D2", "E1"], SPSET = {}; SPINE.forEach(x => (SPSET[x] = 1));
const SPOF = { 1: "B2", 2: "C1", 3: "D2" };
const spineOfFront = f => (f === 0 ? "A1" : f === 4 ? "E1" : SPOF[f]);

// ── shared styles ─────────────────────────────────────────────────────────
const S = {
  wrap: { maxWidth: 920, margin: "0 auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: COL.ink, fontSize: 14, lineHeight: 1.5 },
  leg: { display: "flex", flexWrap: "wrap", gap: 14, fontSize: 13, color: COL.sub, margin: "0 0 14px" },
  legItem: { display: "inline-flex", alignItems: "center", gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 3, display: "inline-block" },
  step: { display: "flex", flexWrap: "wrap", gap: 6, margin: "0 0 16px" },
  note: { fontSize: 14, lineHeight: 1.6, color: COL.sub, margin: "10px 0 0" },
  ctrls: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, margin: "0 0 12px" },
  rg: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: COL.sub },
  two: { display: "flex", flexWrap: "wrap", gap: 18 },
  col: { flex: 1, minWidth: 250 },
  badge: { display: "inline-block", fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 8, margin: "0 0 8px" },
  link: { fontSize: 13, padding: "6px 0", border: 0, background: "transparent", color: COL.infoFg, cursor: "pointer", marginTop: 6 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: 12 },
  result: { marginTop: 14, padding: "14px 16px", border: `1px solid ${COL.line}`, borderRadius: 12, background: COL.surface, fontSize: 14, lineHeight: 1.55 },
  foot: { fontSize: 12, lineHeight: 1.5, color: COL.faint, margin: "18px 0 0", borderTop: `1px solid ${COL.line}`, paddingTop: 10 },
  chip: { fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", padding: "4px 8px", borderRadius: 8, border: `1px solid ${COL.line}`, background: COL.surface, color: COL.ink },
};
const stepBtn = on => ({ fontSize: 13, padding: "6px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${on ? COL.faint : COL.line}`, background: on ? COL.surface : "transparent", color: on ? COL.ink : COL.sub });

// ── network diagram ─────────────────────────────────────────────────────
function Network({ mode, focus, front, onPick }) {
  const nodeStyle = o => {
    if (mode === "reframe") {
      if (!focus) return { f: COL.node, ring: false };
      if (o.id === focus) return { f: COL.spine, ring: true };
      if (o.fr === N[focus].fr) return { f: COL.conc, ring: false };
      return { f: COL.order, ring: false };
    }
    if (mode === "lanes") return { f: LANE_FILL[LANE_OF[o.id]], ring: false };
    const selSp = spineOfFront(front);
    return { f: SPSET[o.id] ? COL.spine : COL.node, ring: o.id === selSp };
  };
  let band = null;
  if (mode === "spine") {
    const ys = FR[front].map(id => N[id].y), mn = Math.min(...ys), mx = Math.max(...ys);
    band = { x: CX[front] - 27, y: mn - 27, w: 54, h: mx - mn + 54 };
  }
  return (
    <svg viewBox="0 0 680 268" style={{ width: "100%", height: "auto", display: "block" }} role="img">
      <title>Staged schedule as a partial order</title>
      {ED.map(([u, v], i) => (
        <line key={i} x1={N[u].x} y1={N[u].y} x2={N[v].x} y2={N[v].y} stroke={COL.edge} strokeWidth="0.8" />
      ))}
      {band && <rect {...{ x: band.x, y: band.y, width: band.w, height: band.h }} rx="12" fill={COL.conc} fillOpacity="0.1" stroke={COL.conc} strokeOpacity="0.5" strokeDasharray="4 4" />}
      {mode === "lanes" && LANES.map((L, li) => (
        <polyline key={li} points={L.map(id => `${N[id].x},${N[id].y}`).join(" ")} fill="none" stroke={LANE_FILL[li]} strokeWidth="4" strokeOpacity="0.75" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {mode === "spine" && [1, 2, 3].map(i => FR[i].filter(id => id !== SPOF[i]).map(id => (
        <line key={id} x1={N[id].x} y1={N[id].y} x2={N[SPOF[i]].x} y2={N[SPOF[i]].y} stroke={COL.faint} strokeOpacity="0.7" strokeWidth="1.5" />
      )))}
      {mode === "spine" && <polyline points={SPINE.map(id => `${N[id].x},${N[id].y}`).join(" ")} fill="none" stroke={COL.spine} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />}
      {NL.map(o => {
        const st = nodeStyle(o);
        return (
          <g key={o.id} transform={`translate(${o.x},${o.y})`} style={{ cursor: mode === "reframe" ? "pointer" : "default" }} onClick={() => mode === "reframe" && onPick(o.id)}>
            <circle r="16" fill={st.f} stroke={st.ring ? COL.ring : "rgba(0,0,0,0.15)"} strokeWidth={st.ring ? 3 : 0.5} />
            <text textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="500" fill="#fff" style={{ pointerEvents: "none" }}>{o.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── review-loop unroll ─────────────────────────────────────────────────
function Loop({ n, inf }) {
  const lab = ["Draft", "Rev 0", "Rwk 1", "Rev 1", "Rwk 2", "Rev 2", "Rwk 3"];
  const ux = i => 70 + i * 80;
  return (
    <svg viewBox="0 0 680 226" style={{ width: "100%", height: "auto", display: "block" }} role="img">
      <title>An uncapped review loop unrolled in time</title>
      <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
      <g>
        <circle cx="200" cy="56" r="18" fill="none" stroke={COL.spine} strokeWidth="1.5" />
        <text x="200" y="90" textAnchor="middle" fontSize="12" fill={COL.sub}>Draft</text>
        <circle cx="380" cy="56" r="18" fill="none" stroke={COL.spine} strokeWidth="1.5" />
        <text x="380" y="90" textAnchor="middle" fontSize="12" fill={COL.sub}>Review</text>
        <line x1="218" y1="56" x2="362" y2="56" stroke={COL.faint} strokeWidth="1.2" markerEnd="url(#ar)" />
        <path d="M380 74 C380 112 200 112 200 76" fill="none" stroke={COL.faint} strokeWidth="1.2" markerEnd="url(#ar)" />
        <text x="290" y="126" textAnchor="middle" fontSize="12" fill={COL.sub}>rework — no fixed cap</text>
      </g>
      <text x="40" y="150" fontSize="12" fill={COL.sub}>unrolled in time (acyclic, infinite):</text>
      {lab.map((t, i) => i < n && (
        <g key={i}>
          <circle cx={ux(i)} cy="180" r="12" fill={COL.node} />
          <text x={ux(i)} y="206" textAnchor="middle" fontSize="12" fill={COL.sub}>{t}</text>
          {i < n - 1 && <line x1={ux(i) + 12} y1="180" x2={ux(i + 1) - 12} y2="180" stroke={COL.faint} strokeWidth="1" markerEnd="url(#ar)" />}
        </g>
      ))}
      {inf && <g><line x1="562" y1="180" x2="612" y2="180" stroke={COL.faint} strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#ar)" /><text x="622" y="186" fontSize="14" fontWeight="500" fill={COL.ink}>∞</text></g>}
    </svg>
  );
}

// ── boundary: explicit-spine grid + Hollom's P5 counterexample ─────────
function Grid() {
  const gx = x => 46 + x * 42, gy = y => 250 - y * 42;
  const dg = k => { const x1 = Math.max(0, k - 5), y1 = Math.min(k, 5), x2 = Math.min(k, 5), y2 = Math.max(0, k - 5); return <line key={k} x1={gx(x1)} y1={gy(y1)} x2={gx(x2)} y2={gy(y2)} stroke={COL.conc} strokeOpacity="0.55" strokeWidth="2" strokeDasharray="3 3" />; };
  const dots = []; for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) dots.push(<circle key={`${x},${y}`} cx={gx(x)} cy={gy(y)} r="6" fill={x === 0 ? COL.spine : COL.node} />);
  return (
    <svg viewBox="0 0 320 300" style={{ width: "100%", height: "auto", display: "block" }} role="img">
      <title>A finite window into the coordinatewise omega by omega order</title>
      {[2, 4, 6, 8].map(dg)}
      <line x1={gx(0)} y1={gy(0)} x2={gx(0)} y2={gy(5)} stroke={COL.spine} strokeWidth="3.5" strokeLinecap="round" />
      {dots}
      <text x={gx(5) + 8} y={gy(2)} fontSize="12" fill={COL.sub}>⋯</text>
      <text x={gx(0)} y="26" textAnchor="middle" fontSize="12" fill={COL.sub}>⋮</text>
      <text x="160" y="286" textAnchor="middle" fontSize="12" fill={COL.sub}>backbone = left edge · fronts = diagonals</text>
    </svg>
  );
}
function Tower() {
  const blk = (yt, lab) => { const out = [<rect key="r" x="40" y={yt} width="240" height="78" rx="10" fill="#E24B4A" fillOpacity="0.12" stroke="#A32D2D" strokeOpacity="0.55" />, <text key="l" x="54" y={yt + 18} fontSize="12" fill={COL.sub}>{lab}</text>]; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) out.push(<circle key={`${r}-${c}`} cx={88 + c * 40} cy={yt + 32 + r * 16} r="4" fill={COL.node} />); return out; };
  const ar = yy => <g><line x1="160" y1={yy} x2="160" y2={yy + 20} stroke="#A32D2D" strokeWidth="1.5" markerEnd="url(#ar2)" /><text x="174" y={yy + 14} fontSize="10" fill={COL.sub}>tuned relation</text></g>;
  return (
    <svg viewBox="0 0 320 322" style={{ width: "100%", height: "auto", display: "block" }} role="img">
      <title>Hollom's P5: descending omega by omega levels with tuned relations</title>
      <defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
      {blk(12, "L₀ ≅ ω × ω")}{ar(90)}{blk(118, "L₁ ≅ ω × ω")}{ar(196)}{blk(224, "L₂ ≅ ω × ω")}
      <text x="160" y="316" textAnchor="middle" fontSize="11" fill={COL.sub}>⋮ more ω × ω levels (n increases downward)</text>
    </svg>
  );
}

// ── classifier data ───────────────────────────────────────────────────
const CLASSES = [
  { k: "finite", label: "Finite — any finite schedule model", v: "yes", who: "Finite height layering (Mirsky duality)", law: "Every finite poset has a spine: rank by longest-chain height into antichain layers, then a maximum chain meets every layer.", read: "This covers every finite precedence model; no infinite-case hypothesis is needed." },
  { k: "w2", label: "Width at most 2 — no three pairwise-incomparable tasks", v: "yes", who: "Aharoni–Korman, 1992", law: "Every poset of width at most 2 has a spine.", read: "No antichain contains more than two tasks. This describes the precedence order, not necessarily actual execution overlap." },
  { k: "bdd", label: "FAC with finite intervals", v: "yes", who: "Duffus–Goddard, 2002, Theorem 4.1", law: "No infinite intervals and no infinite antichains together imply a spine.", read: "Every interval between comparable elements is finite, and the order is FAC." },
  { k: "locfin", label: "Locally finite incomparability", v: "yes", who: "Zaguia, 2024", law: "A locally finite incomparability graph implies a spine.", read: "Each task is precedence-incomparable with only finitely many others. This property itself rules out infinite antichains." },
  { k: "nfree", label: "FAC and N-free — no N-shaped suborder", v: "yes", who: "Zaguia, 2024", law: "Every N-free FAC poset has a spine.", read: "The cited result requires FAC as well as exclusion of the four-point N pattern." },
  { k: "vac", label: "Countable, vacillating and FAC", v: "yes", who: "Hollom, 2025, Theorem 1.18", law: "Every countable vacillating FAC poset has a spine.", read: "This class may have infinite chains and unbounded finite antichain sizes. Vacillation excludes a specific contiguous-chain decomposition, not every kind of recursion." },
  { k: "w3", label: "Width 3, infinite, otherwise generic", v: "open", who: "Open problem (Hollom, 2025, Q6.1)", law: "Whether every finite-width poset has a spine is unknown, even for countable width 3.", read: "Width 3 means that no antichain has more than three elements; it does not assert three executing tracks." },
  { k: "tower", label: "Hollom's P5 — tuned ω × ω levels", v: "no", who: "Hollom, 2025, Example 5.6 and Proposition 5.7", law: "P5 is a countable scattered FAC poset with no spine.", read: "P5 has arbitrarily large finite antichains but no infinite antichain (width ℵ₀). Its specially engineered adjacent-level comparisons matter; non-vacillation or width ℵ₀ alone does not imply failure." },
];
const VMAP = { yes: { w: "Spine guaranteed", c: COL.safeFg }, open: { w: "Open — unknown", c: COL.warnFg }, no: { w: "No spine in this example", c: COL.dangerFg } };
const SD = { yes: COL.safeFg, open: COL.warnFg, no: COL.dangerFg };

// ── main component ────────────────────────────────────────────────────
export default function ScheduleSpineExplainer() {
  const [scene, setScene] = useState(0);
  const [focus, setFocus] = useState(null);
  const [mode, setMode] = useState("spine");
  const [front, setFront] = useState(1);
  const [cap, setCap] = useState(3);
  const [inf, setInf] = useState(false);
  const [why, setWhy] = useState(false);
  const [pick, setPick] = useState(null);

  const steps = ["1 · Reframe", "2 · Lanes vs spine", "3 · Why infinity", "4 · The boundary", "5 · Your schedule"];

  const capReframe = () => {
    if (!focus) return <span><b>Click any activity.</b> Blue = precedence-related to it (order is forced). Orange = incomparable (precedence alone permits either order or overlap). That two-way split — comparable vs incomparable — is the raw material of the poset model.</span>;
    const f = N[focus];
    const inc = NL.filter(n => n.fr === f.fr && n.id !== f.id).map(n => n.id);
    const cmp = NL.filter(n => n.fr !== f.fr).map(n => n.id);
    return <span><b>{f.id}</b> — incomparable with {inc.length} ({inc.join(", ") || "none"}); precedence-related to {cmp.length}. A chain through the blue set is a candidate path; the orange set is one antichain front.</span>;
  };
  const capSpine = () => {
    const mem = FR[front], sp = spineOfFront(front);
    if (front === 0 || front === 4) return <span>A spine is one chain (purple) together with an antichain partition of every activity, where the chain meets each part exactly once. Front {front} is the singleton <b>{sp}</b> — the spine runs straight through it.</span>;
    return <span>Front {front} = {`{ ${mem.join(", ")} }`} — pairwise incomparable, hence an antichain. The spine contributes <b>exactly one</b> activity, <b>{sp}</b>; the others ({mem.filter(x => x !== sp).join(", ")}) hang off as ribs in this certificate.</span>;
  };

  return (
    <div style={S.wrap}>
      <div style={S.leg}>
        <span style={S.legItem}><i style={{ ...S.dot, background: COL.order }} />Precedence — one activity waits for another</span>
        <span style={S.legItem}><i style={{ ...S.dot, background: COL.conc }} />Incomparability — precedence permits either order or overlap</span>
        <span style={S.legItem}><i style={{ ...S.dot, background: COL.spine }} />Backbone / spine</span>
      </div>
      <div style={S.step}>
        {steps.map((t, i) => <button key={i} style={stepBtn(scene === i)} onClick={() => setScene(i)}>{t}</button>)}
      </div>

      {scene === 0 && (
        <div>
          <Network mode="reframe" focus={focus} onPick={setFocus} />
          <div style={S.note}>{capReframe()}</div>
        </div>
      )}

      {scene === 1 && (
        <div>
          <div style={S.ctrls}>
            <div style={{ display: "inline-flex", border: `1px solid ${COL.line}`, borderRadius: 8, overflow: "hidden" }}>
              {[["lanes", "Dilworth lanes"], ["spine", "Spine"]].map(([v, t]) => (
                <button key={v} onClick={() => setMode(v)} style={{ fontSize: 13, padding: "6px 12px", border: 0, cursor: "pointer", background: mode === v ? COL.infoBg : "transparent", color: mode === v ? COL.infoFg : COL.sub }}>{t}</button>
              ))}
            </div>
            {mode === "spine" && (
              <label style={S.rg}>Inspect front
                <input type="range" min={0} max={4} step={1} value={front} onChange={e => setFront(+e.target.value)} style={{ width: 150 }} />
              </label>
            )}
          </div>
          <Network mode={mode} front={front} onPick={() => { }} />
          <div style={S.note}>{mode === "lanes" ? "Dilworth (1950): the width here is 3, so the plan splits into 3 chains. These are precedence threads, not evidence of three resources or three tasks actually executing at once." : capSpine()}</div>
        </div>
      )}

      {scene === 2 && (
        <div>
          <Loop n={inf ? 7 : cap} inf={inf} />
          <div style={S.ctrls}>
            <label style={S.rg}>Iteration cap
              <input type="range" min={1} max={7} step={1} value={cap} onChange={e => { setCap(+e.target.value); setInf(false); }} style={{ width: 150 }} />
            </label>
            <button style={{ ...S.link, fontWeight: inf ? 500 : 400 }} onClick={() => setInf(!inf)}>Uncap to ∞</button>
          </div>
          <div style={S.note}>{inf
            ? <span>Uncapped, modelled honestly, the loop unrolls into an <b>infinite chain</b>. Note what did <i>not</i> happen: going infinite broke nothing — a single chain is its own backbone. Sinking a backbone takes a particular shape, not mere endlessness.</span>
            : <span>Capped at {cap} step{cap > 1 ? "s" : ""}: a finite chain. Every finite plan has a backbone trivially — here it <i>is</i> the backbone.</span>}</div>
        </div>
      )}

      {scene === 3 && (
        <div style={S.two}>
          <div style={S.col}>
            <span style={{ ...S.badge, background: COL.safeBg, color: COL.safeFg }}>Safe — a spine exists</span>
            <Grid />
            <div style={S.note}>The coordinatewise order on ω × ω. Its anti-diagonals are finite antichains whose sizes are unbounded; there is no infinite antichain. The purple left-edge chain meets each anti-diagonal exactly once, giving an explicit spine.</div>
          </div>
          {!why ? (
            <div style={S.col}>
              <span style={{ ...S.badge, background: COL.dangerBg, color: COL.dangerFg }}>Counterexample — P5 has no spine</span>
              <Tower />
              <div style={S.note}>Hollom's P5 is a countable scattered FAC poset built from a descending sequence of ω × ω levels with specially defined within- and adjacent-level comparisons. Those relations are essential: a generic non-vacillating tower need not be spineless, and a non-vacillating chain is its own spine.</div>
              <button style={S.link} onClick={() => setWhy(true)}>Why can a strongly maximal chain still fail to be a spine?</button>
            </div>
          ) : (
            <div style={S.col}>
              <span style={{ ...S.badge, background: COL.dangerBg, color: COL.dangerFg }}>Example 5.1 — one SMC is not a spine</span>
              <div style={{ marginTop: 4 }}>
                <div style={{ margin: "0 0 12px" }}>
                  <span style={{ display: "block", fontSize: 13, color: COL.sub, margin: "0 0 6px" }}>C₁ members available after a is paired with (4,0): four</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{["(0,0)", "(1,0)", "(2,0)", "(3,0)"].map(c => <span key={c} style={S.chip}>{c}</span>)}</div>
                </div>
                <div style={{ margin: "0 0 12px" }}>
                  <span style={{ display: "block", fontSize: 13, color: COL.sub, margin: "0 0 6px" }}>Five comparable C₂ members needing distinct antichains</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["(0,1)", "(1,1)", "(2,1)", "(3,1)"].map(c => <span key={c} style={{ ...S.chip, background: COL.infoBg, color: COL.infoFg, borderColor: "#bcd6f1" }}>{c}</span>)}
                    <span style={{ ...S.chip, background: COL.dangerBg, color: COL.dangerFg, borderColor: "#eccaca" }}>✗ (4,1)</span>
                  </div>
                </div>
                <div style={S.note}>If <b>a</b> shares an antichain with (4,0), that member of C₁ is unavailable. Five mutually comparable points cannot be assigned to the four remaining C₁ members, so C₁ is not a spine even though it is strongly maximal. This does <b>not</b> make P1 spineless: Hollom shows that C₂ is a spine. P5 requires a separate global construction.</div>
              </div>
              <button style={S.link} onClick={() => setWhy(false)}>Back to the theorem boundary</button>
            </div>
          )}
        </div>
      )}

      {scene === 4 && (
        <div>
          <div style={S.note}>Set the mathematical shape of the precedence order. Finite schedules are settled by the first result; the other cards are structural conditions that become significant when studying infinite limits.</div>
          <div style={S.cards}>
            {CLASSES.map(c => (
              <button key={c.k} onClick={() => setPick(c.k)} style={{ textAlign: "left", fontSize: 13, lineHeight: 1.45, padding: 12, borderRadius: 12, cursor: "pointer", background: pick === c.k ? COL.surface : COL.panel, border: `1px solid ${pick === c.k ? COL.infoFg : COL.line}`, color: COL.ink, display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", marginTop: 5, flex: "none", background: SD[c.v] }} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
          <div style={S.result}>
            {pick ? (() => { const c = CLASSES.find(x => x.k === pick), v = VMAP[c.v]; return (
              <>
                <div style={{ fontWeight: 500, color: v.c, margin: "0 0 4px" }}>{v.w}</div>
                <div style={{ fontSize: 12, color: COL.faint, margin: "0 0 8px" }}>{c.who}</div>
                <div style={{ color: COL.ink }}>{c.law}</div>
                <div style={{ color: COL.sub, marginTop: 6 }}>{c.read}</div>
              </>
            ); })() : "Pick a shape to see which result governs it."}
          </div>
          <div style={{ fontSize: 13, color: COL.sub, margin: "12px 0 0" }}>Every spine is a strongly maximal chain. Hollom's Theorem 1.15 guarantees a strongly maximal chain in every <i>countable FAC</i> poset, even though such a chain need not be a spine. This is a structural maximality statement, not a duration-optimised critical-path calculation.</div>
        </div>
      )}

      <div style={S.foot}>Reading Hollom, “A resolution of the Aharoni–Korman conjecture” (arXiv:2411.16844, 2024–25). Attributions as cited therein — Dilworth 1950 · Aharoni–Korman 1992 · Duffus–Goddard 2002 · Zaguia 2024. Proposition 5.7 was formally verified in Lean by Bhavik Mehta.</div>
    </div>
  );
}