import { useState, useEffect, useRef } from "react";

const orders = [
  { id: "O00001", restaurant: "Tandoor House", before: { kptErr: 5, wait: 0, etaErr: 5, delayed: false }, after: { kptErr: 3, wait: 2, etaErr: 4, delayed: false } },
  { id: "O00002", restaurant: "Idli Express", before: { kptErr: 4, wait: 0, etaErr: 5, delayed: false }, after: { kptErr: 3, wait: 0, etaErr: 4, delayed: false } },
  { id: "O00003", restaurant: "Idli Express", before: { kptErr: 7, wait: 3, etaErr: 8, delayed: false }, after: { kptErr: 6, wait: 4, etaErr: 7, delayed: false } },
  { id: "O00023", restaurant: "Idli Express", before: { kptErr: 12, wait: 11, etaErr: 12, delayed: true }, after: { kptErr: 8, wait: 9, etaErr: 8, delayed: false } },
  { id: "O00028", restaurant: "Burger Barn", before: { kptErr: 14, wait: 9, etaErr: 14, delayed: true }, after: { kptErr: 5, wait: 2, etaErr: 4, delayed: false } },
  { id: "O00031", restaurant: "Biryani Bros", before: { kptErr: 14, wait: 14, etaErr: 15, delayed: true }, after: { kptErr: 8, wait: 11, etaErr: 9, delayed: false } },
  { id: "O00034", restaurant: "Tandoor House", before: { kptErr: 20, wait: 20, etaErr: 20, delayed: true }, after: { kptErr: 12, wait: 17, etaErr: 13, delayed: true } },
  { id: "O00036", restaurant: "Biryani Bros", before: { kptErr: 17, wait: 9, etaErr: 16, delayed: true }, after: { kptErr: 7, wait: 1, etaErr: 7, delayed: false } },
  { id: "O00052", restaurant: "Healthy Hub", before: { kptErr: 19, wait: 13, etaErr: 19, delayed: true }, after: { kptErr: 4, wait: 4, etaErr: 5, delayed: false } },
  { id: "O00056", restaurant: "Idli Express", before: { kptErr: 25, wait: 23, etaErr: 26, delayed: true }, after: { kptErr: 8, wait: 12, etaErr: 7, delayed: false } },
  { id: "O00055", restaurant: "Cloud Bites", before: { kptErr: 16, wait: 3, etaErr: 15, delayed: true }, after: { kptErr: 5, wait: 0, etaErr: 4, delayed: false } },
  { id: "O00045", restaurant: "Tandoor House", before: { kptErr: 17, wait: 12, etaErr: 17, delayed: true }, after: { kptErr: 9, wait: 9, etaErr: 10, delayed: false } },
  { id: "O00039", restaurant: "Wok & Roll", before: { kptErr: 17, wait: 13, etaErr: 16, delayed: true }, after: { kptErr: 10, wait: 8, etaErr: 9, delayed: false } },
  { id: "O00042", restaurant: "Midnight Munchies", before: { kptErr: 10, wait: 5, etaErr: 11, delayed: true }, after: { kptErr: 5, wait: 1, etaErr: 4, delayed: false } },
  { id: "O00083", restaurant: "Cloud Bites", before: { kptErr: 13, wait: 9, etaErr: 14, delayed: true }, after: { kptErr: 5, wait: 6, etaErr: 4, delayed: false } },
];

const summaryMetrics = [
  { label: "Avg KPT Error", before: 7.88, after: 4.08, unit: "min", icon: "⏱" },
  { label: "Avg Rider Wait", before: 4.1, after: 2.83, unit: "min", icon: "🏍" },
  { label: "Avg ETA Error", before: 7.86, after: 4.11, unit: "min", icon: "📍" },
  { label: "Delay Rate", before: 28, after: 3, unit: "%", icon: "🚨" },
];

const signals = [
  { name: "Weather", impact: 2.03, pct: 100, color: "#60a5fa" },
  { name: "Complexity", impact: 1.84, pct: 83, color: "#a78bfa" },
  { name: "Hidden Load", impact: 1.6, pct: 100, color: "#34d399" },
  { name: "Rush/Peak", impact: 4.3, pct: 100, color: "#f97316" },
  { name: "Queue", impact: 0.11, pct: 14, color: "#fbbf24" },
  { name: "Reliability", impact: 0.79, pct: 100, color: "#f472b6" },
];

const restaurants = [
  { name: "Biryani Bros", orders: 13, kptBefore: 6.46, kptAfter: 4, delaysBefore: 4, delaysAfter: 0 },
  { name: "Burger Barn", orders: 9, kptBefore: 7.33, kptAfter: 3, delaysBefore: 3, delaysAfter: 0 },
  { name: "Cloud Bites", orders: 13, kptBefore: 9.23, kptAfter: 4.15, delaysBefore: 5, delaysAfter: 0 },
  { name: "Healthy Hub", orders: 8, kptBefore: 8.5, kptAfter: 2.75, delaysBefore: 4, delaysAfter: 0 },
  { name: "Idli Express", orders: 10, kptBefore: 8.4, kptAfter: 4.2, delaysBefore: 2, delaysAfter: 0 },
  { name: "Midnight Munchies", orders: 6, kptBefore: 8.67, kptAfter: 2.67, delaysBefore: 1, delaysAfter: 0 },
  { name: "Pizza Palace", orders: 13, kptBefore: 5.69, kptAfter: 3.46, delaysBefore: 2, delaysAfter: 1 },
  { name: "Spice Garden", orders: 10, kptBefore: 6.6, kptAfter: 3.2, delaysBefore: 1, delaysAfter: 0 },
  { name: "Tandoor House", orders: 12, kptBefore: 10.58, kptAfter: 6.83, delaysBefore: 5, delaysAfter: 2 },
  { name: "Wok & Roll", orders: 6, kptBefore: 7.83, kptAfter: 6, delaysBefore: 1, delaysAfter: 0 },
];

function AnimatedNumber({ value, duration = 1200, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(null);
  useEffect(() => {
    start.current = null;
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{display.toFixed(1)}{suffix}</>;
}

function MetricCard({ metric, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 150 + 300);
    return () => clearTimeout(t);
  }, [index]);
  const improvement = ((metric.before - metric.after) / metric.before * 100).toFixed(0);
  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 16, padding: "20px 24px", backdropFilter: "blur(12px)",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: "radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent)",
        borderRadius: "0 16px 0 80px" }} />
      <div style={{ fontSize: 24, marginBottom: 6 }}>{metric.icon}</div>
      <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>{metric.label}</div>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "#ef4444", marginBottom: 2 }}>BEFORE</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#ef4444", fontFamily: "monospace" }}>
            {visible ? <AnimatedNumber value={metric.before} suffix={metric.unit} /> : `0${metric.unit}`}
          </div>
        </div>
        <div style={{ color: "#334155", fontSize: 18, paddingBottom: 4 }}>→</div>
        <div>
          <div style={{ fontSize: 10, color: "#22c55e", marginBottom: 2 }}>AFTER</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#22c55e", fontFamily: "monospace" }}>
            {visible ? <AnimatedNumber value={metric.after} suffix={metric.unit} /> : `0${metric.unit}`}
          </div>
        </div>
      </div>
      <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: 8, padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>↓ {improvement}% improvement</span>
      </div>
    </div>
  );
}

function OrderSimulation({ order, isRunning, speed }) {
  const [phase, setPhase] = useState("idle"); // idle, before, transitioning, after
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRunning) { setPhase("idle"); setProgress(0); return; }
    let t;
    const delay = Math.random() * 400;
    t = setTimeout(() => {
      setPhase("before");
      setProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += 2 / speed;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(interval);
          setPhase("transitioning");
          setTimeout(() => {
            setPhase("after");
          }, 300);
        }
      }, 30);
    }, delay);
    return () => clearTimeout(t);
  }, [isRunning, speed]);

  const isDelayed = phase === "before" ? order.before.delayed : order.after.delayed;
  const err = phase === "before" ? order.before.kptErr : order.after.kptErr;

  return (
    <div style={{
      background: phase === "after"
        ? "rgba(34,197,94,0.05)"
        : phase === "before" ? "rgba(239,68,68,0.05)" : "rgba(15,23,42,0.4)",
      border: `1px solid ${phase === "after" ? "rgba(34,197,94,0.3)" : phase === "before" ? "rgba(239,68,68,0.2)" : "rgba(51,65,85,0.4)"}`,
      borderRadius: 10, padding: "10px 14px",
      transition: "all 0.5s ease",
      position: "relative", overflow: "hidden"
    }}>
      {phase === "before" && progress < 100 && (
        <div style={{ position: "absolute", bottom: 0, left: 0, height: 2,
          width: `${progress}%`, background: "linear-gradient(90deg, #ef4444, #f97316)",
          transition: "width 0.03s linear" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>{order.id}</span>
          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 2 }}>{order.restaurant}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          {phase === "idle" && <span style={{ fontSize: 11, color: "#334155" }}>waiting...</span>}
          {(phase === "before" || phase === "transitioning") && (
            <div>
              <div style={{ fontSize: 10, color: "#ef4444" }}>err: {order.before.kptErr}m</div>
              {order.before.delayed && <div style={{ fontSize: 10, color: "#f97316", fontWeight: 700 }}>DELAYED</div>}
            </div>
          )}
          {phase === "after" && (
            <div>
              <div style={{ fontSize: 10, color: "#22c55e" }}>err: {order.after.kptErr}m</div>
              {order.after.delayed
                ? <div style={{ fontSize: 10, color: "#f97316" }}>DELAYED</div>
                : <div style={{ fontSize: 10, color: "#22c55e" }}>✓ on time</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const tabStyle = (t) => ({
    padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
    border: "none", fontFamily: "inherit",
    background: tab === t ? "rgba(99,102,241,0.2)" : "transparent",
    color: tab === t ? "#818cf8" : "#64748b",
    transition: "all 0.2s",
    borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#030712",
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      color: "#e2e8f0", padding: "0 0 60px 0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.08) 100%)",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        padding: "32px 40px 24px"
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 32 }}>🚀</div>
          <div>
            <div style={{ fontSize: 11, color: "#6366f1", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Smart Dispatch System
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, background: "linear-gradient(135deg, #e2e8f0, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Before vs After Simulation
            </h1>
          </div>
        </div>
        <p style={{ margin: "8px 0 0", color: "#475569", fontSize: 13 }}>
          Baseline KPT + Fixed 0.75 Threshold  →  Weather + Load + Queue + Geo + Reliability Signals
        </p>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid rgba(51,65,85,0.5)", padding: "0 40px", display: "flex", gap: 4 }}>
        {[["overview", "📊 Overview"], ["simulation", "⚡ Live Sim"], ["restaurants", "🏪 Restaurants"], ["signals", "🔬 Signals"]].map(([key, label]) => (
          <button key={key} style={tabStyle(key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "32px 40px" }}>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {summaryMetrics.map((m, i) => <MetricCard key={m.label} metric={m} index={i} />)}
            </div>

            {/* Big comparison strip */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "stretch" }}>
              {/* Before */}
              <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>❌</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>BEFORE</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Baseline Dispatch System</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    ["Fixed 0.75 Dispatch Threshold", "❌"],
                    ["Historical KPT Only", "❌"],
                    ["No Weather Awareness", "❌"],
                    ["No Queue Signals", "❌"],
                    ["No Reliability Scoring", "❌"],
                    ["28% Delay Rate", "🔴"],
                    ["7.88 min Avg KPT Error", "🔴"],
                  ].map(([text, icon]) => (
                    <div key={text} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13 }}>
                      <span>{icon}</span>
                      <span style={{ color: "#94a3b8" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 28, color: "#6366f1", textAlign: "center" }}>
                  <div>⚡</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>SMART</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>MODEL</div>
                </div>
              </div>

              {/* After */}
              <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>AFTER</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Smart Dispatch System</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    ["Dynamic Dispatch Threshold", "✅"],
                    ["Multi-Signal KPT Prediction", "✅"],
                    ["Real-time Weather Signals", "✅"],
                    ["Queue Pressure Awareness", "✅"],
                    ["Restaurant Reliability Score", "✅"],
                    ["3% Delay Rate (↓ 25pp)", "🟢"],
                    ["4.08 min Avg KPT Error (↓ 48%)", "🟢"],
                  ].map(([text, icon]) => (
                    <div key={text} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13 }}>
                      <span>{icon}</span>
                      <span style={{ color: "#94a3b8" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIMULATION TAB */}
        {tab === "simulation" && (
          <div>
            {/* Controls */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 28,
              background: "rgba(15,23,42,0.6)", border: "1px solid rgba(51,65,85,0.4)",
              borderRadius: 12, padding: "16px 24px" }}>
              <button onClick={() => setSimRunning(!simRunning)} style={{
                padding: "10px 28px", borderRadius: 8, border: "none", cursor: "pointer",
                background: simRunning ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)",
                color: simRunning ? "#ef4444" : "#818cf8",
                fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                transition: "all 0.2s"
              }}>
                {simRunning ? "⏹ Stop" : "▶ Run Simulation"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Speed:</span>
                {[0.5, 1, 2].map(s => (
                  <button key={s} onClick={() => setSimSpeed(s)} style={{
                    padding: "6px 14px", borderRadius: 6, border: "1px solid",
                    borderColor: simSpeed === s ? "#6366f1" : "rgba(51,65,85,0.5)",
                    background: simSpeed === s ? "rgba(99,102,241,0.15)" : "transparent",
                    color: simSpeed === s ? "#818cf8" : "#64748b",
                    cursor: "pointer", fontSize: 12, fontFamily: "inherit"
                  }}>{s}x</button>
                ))}
              </div>
              {simRunning && (
                <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    <span style={{ color: "#ef4444" }}>■</span> Processing with baseline
                    <span style={{ color: "#22c55e", marginLeft: 12 }}>■</span> Smart model applied
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {orders.map((order) => (
                <OrderSimulation key={order.id} order={order} isRunning={simRunning} speed={simSpeed} />
              ))}
            </div>

            {!simRunning && (
              <div style={{ textAlign: "center", marginTop: 32, color: "#334155", fontSize: 13 }}>
                Press <strong style={{ color: "#6366f1" }}>Run Simulation</strong> to see orders process through the baseline and smart dispatch systems
              </div>
            )}
          </div>
        )}

        {/* RESTAURANTS TAB */}
        {tab === "restaurants" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {restaurants.map((r) => {
                const improvement = ((r.kptBefore - r.kptAfter) / r.kptBefore * 100).toFixed(0);
                const isSelected = selectedRestaurant === r.name;
                return (
                  <div key={r.name}
                    onClick={() => setSelectedRestaurant(isSelected ? null : r.name)}
                    style={{
                      background: isSelected ? "rgba(99,102,241,0.1)" : "rgba(15,23,42,0.6)",
                      border: `1px solid ${isSelected ? "rgba(99,102,241,0.5)" : "rgba(51,65,85,0.4)"}`,
                      borderRadius: 12, padding: "18px 20px", cursor: "pointer",
                      transition: "all 0.2s"
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{r.orders} orders analyzed</div>
                      </div>
                      <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
                        borderRadius: 8, padding: "4px 10px", height: "fit-content", fontSize: 12, color: "#22c55e", fontWeight: 700 }}>
                        ↓ {improvement}%
                      </div>
                    </div>

                    {/* KPT Error Bar */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>KPT ERROR (min)</div>
                      <div style={{ position: "relative", height: 8, background: "rgba(51,65,85,0.3)", borderRadius: 4, marginBottom: 4 }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%",
                          width: `${(r.kptBefore / 12) * 100}%`, background: "rgba(239,68,68,0.6)", borderRadius: 4 }} />
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%",
                          width: `${(r.kptAfter / 12) * 100}%`, background: "rgba(34,197,94,0.8)", borderRadius: 4 }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                        <span style={{ color: "#ef4444" }}>{r.kptBefore}m before</span>
                        <span style={{ color: "#22c55e" }}>{r.kptAfter}m after</span>
                      </div>
                    </div>

                    {/* Delays */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, background: "rgba(239,68,68,0.08)", borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>{r.delaysBefore}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>delays before</div>
                      </div>
                      <div style={{ flex: 1, background: "rgba(34,197,94,0.08)", borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: r.delaysAfter > 0 ? "#f97316" : "#22c55e" }}>{r.delaysAfter}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>delays after</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SIGNALS TAB */}
        {tab === "signals" && (
          <div>
            <div style={{ marginBottom: 24, color: "#64748b", fontSize: 13 }}>
              Six new signals were introduced in the smart model. Each contributes to more accurate KPT prediction and earlier dispatch decisions.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {signals.map((s, i) => (
                <div key={s.name} style={{
                  background: "rgba(15,23,42,0.7)", border: "1px solid rgba(51,65,85,0.4)",
                  borderRadius: 12, padding: "20px 24px",
                  animationDelay: `${i * 100}ms`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{s.name} Signal</span>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#475569" }}>Avg Impact</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.impact} min</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#475569" }}>% Orders Affected</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.pct}%</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "relative", height: 6, background: "rgba(51,65,85,0.3)", borderRadius: 3 }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%",
                      width: `${s.pct}%`, borderRadius: 3,
                      background: `linear-gradient(90deg, ${s.color}80, ${s.color})`,
                      boxShadow: `0 0 8px ${s.color}40`,
                      transition: "width 1s ease"
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Rush/Peak callout */}
            <div style={{ marginTop: 24, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 12, color: "#f97316", fontWeight: 700, marginBottom: 6 }}>⚡ Highest Impact Signal: Rush/Peak Load</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                Combined time-of-day, day-of-week, and real-time order surge index. Average impact of <strong style={{ color: "#f97316" }}>4.3 min</strong> per order — the single biggest driver of delay reduction from 28% → 3%.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
