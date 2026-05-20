"use client";

import { useState, useEffect } from "react";

type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

interface GeopoliticalEvent {
  id: number; region: string; country: string; event: string;
  description: string; indicators: string[]; forecast: string; source: string; risk: RiskLevel; timestamp: string;
}

const MOCK_EVENTS: GeopoliticalEvent[] = [
  { id: 1, region: "Middle East", country: "Iran", event: "Regional Alliance Summit", description: "Tehran hosting senior diplomats from Syria, Lebanon, and Iraq. Intelligence suggests weapons discussions and coordinated military planning.", indicators: ["SIGINT Spike", "Diplomatic Traffic", "Military Comms"], forecast: "Escalation risk: HIGH. Anticipated joint military exercises within 14 days. Recommendation: Increase surveillance.", source: "SIGINT/HUMINT", risk: "HIGH", timestamp: "2024-07-15T06:30:00Z" },
  { id: 2, region: "East Africa", country: "Kenya", event: "Election Rally Violence", description: "Clashes at opposition gathering in Nairobi. Police deploy tear gas. Two killed, twelve injured. Tensions align with August primaries.", indicators: ["Social Media Surge", "Civil Unrest", "Security Response"], forecast: "Escalation risk: MEDIUM. Pre-election volatility increasing. Monitor for coordinated violence.", source: "OSINT/HUMINT", risk: "MEDIUM", timestamp: "2024-07-15T08:15:00Z" },
  { id: 3, region: "Baltic", country: "Estonia", event: "Border Incident", description: "Russian MIG-31 intercepted near Estonian airspace. Incursion lasted 4 minutes. NATO scrambles response. Short-range radar active.", indicators: ["ADIZ Penetration", "Military Aircraft", "NATO Response"], forecast: "Escalation risk: LOW. Probe of NATO response times. No sustained presence.", source: "SIGINT/RADAR", risk: "LOW", timestamp: "2024-07-15T09:00:00Z" },
  { id: 4, region: "Southeast Asia", country: "Philippines", event: "Maritime Standoff", description: "Chinese Coast Guard blocks Philippines resupply mission to Thitu Island. Water cannon deployed. No injuries. Serious damage to vessels.", indicators: ["Naval Presence", "Vessel Intercept", "Geopolitical Posture"], forecast: "Escalation risk: MEDIUM. Ongoing territorial disputes likely to continue.", source: "OSINT/SATINT", risk: "MEDIUM", timestamp: "2024-07-15T10:30:00Z" },
  { id: 5, region: "West Africa", country: "Mali", event: "UN Peacekeeping Withdrawal", description: "Wagner Group reinforcements arrive at Bamako airport. 300 personnel. Local sources confirm. French MINUSMA drawdown accelerating.", indicators: ["Mercenary Activity", "Military Buildup", "Diplomatic Shift"], forecast: "Escalation risk: HIGH. Wagner consolidation enables expanded operations. Regional destabilization likely.", source: "HUMINT/SIGINT", risk: "HIGH", timestamp: "2024-07-15T11:45:00Z" },
  { id: 6, region: "East Asia", country: "Japan", event: "Olympics Security Operation", description: "Japan Coast Guard establishes 30nm security perimeter around Tokyo Bay. Naval assets positioned. Intelligence indicates terrorism threat Level ORANGE.", indicators: ["Naval Deployment", "Counter-Terrorism", "Public Safety"], forecast: "Escalation risk: LOW. Security operation standard protocol for high-profile event.", source: "SIGINT/OSINT", risk: "LOW", timestamp: "2024-07-15T13:00:00Z" },
  { id: 7, region: "Central America", country: "Mexico", event: "Cartel Territory Dispute", description: "Sinaloa vs Jalisco cartels clash in Sonora. 18 killed over border control. Firefights near US border.", indicators: ["Violence Surge", "Cartel Warfare", "Border Tension"], forecast: "Escalation risk: MEDIUM. Cartel conflict likely to intensify through election cycle.", source: "HUMINT/OSINT", risk: "MEDIUM", timestamp: "2024-07-15T14:30:00Z" },
  { id: 8, region: "Eastern Europe", country: "Ukraine", event: "Drone Strike Deep Strike", description: "Long-range drones strike Russian airfield 450km from frontline. Infrastructure damage reported. New indigenous drone capability confirmed.", indicators: ["Drone Technology", "Deep Strike", "Domestic Production"], forecast: "Escalation risk: HIGH. Ukraine expanding strategic strike capability. Russian retaliation likely.", source: "SIGINT/IMINT", risk: "HIGH", timestamp: "2024-07-15T15:00:00Z" },
  { id: 9, region: "Arctic", country: "Russia", event: "Northern Fleet Exercise", description: "Kola Peninsula: 40+ vessels at sea. Missile test detected in Barents Sea. FAA closes airspace. Nuclear-capable assets confirmed.", indicators: ["Naval Exercise", "Nuclear Posture", "Arctic Control"], forecast: "Escalation risk: MEDIUM. Show of force in strategic region.", source: "SIGINT/METT", risk: "MEDIUM", timestamp: "2024-07-15T16:30:00Z" },
  { id: 10, region: "South Asia", country: "India-Pakistan", event: "Kashmir Ceasefire Breach", description: "Cross-border firing in Kupwara sector. 2 injured. Indian army retaliates. DGMO hotline activated. Tensions remain contained.", indicators: ["Military Exchange", "Ceasefire Violation", "Diplomatic Channel"], forecast: "Escalation risk: LOW. Existing hotline protocols managing incident. No escalation expected.", source: "SIGINT/ISGS", risk: "LOW", timestamp: "2024-07-15T17:00:00Z" },
];

const RISK_SUMMARY = {
  HIGH: MOCK_EVENTS.filter((e) => e.risk === "HIGH"),
  MEDIUM: MOCK_EVENTS.filter((e) => e.risk === "MEDIUM"),
  LOW: MOCK_EVENTS.filter((e) => e.risk === "LOW"),
};

type Mission = { id: string; name: string; region: string; startDate: string; status: string };

function formatDate(d: Date) {
  return d.toISOString().slice(0, 16).replace("T", " · ").toUpperCase();
}

function Header({ mission }: { mission: Mission | null }) {
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "rgba(5,5,8,0.92)", borderBottom: "1px solid #1a1a2e", backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ff6b00", animation: "pulse 2s ease-in-out infinite" }} />
        <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", color: "#ff6b00", textTransform: "uppercase" }}>Sentinel Risk</span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#8888aa" }}>
        {mission ? mission.name + " · " + mission.region : "GEOPOLITICAL BRIEFING SYSTEM"}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#8888aa" }} className="hidden md:block">
        {new Date().toUTCString().slice(0, 16).toUpperCase()}
      </div>
    </header>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["SETUP", "SCANNING", "BRIEFING", "APPROVAL"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, transition: "all 0.5s", backgroundColor: i + 1 < step ? "#00ff88" : i + 1 === step ? "#ff6b00" : "#1a1a2e", color: i + 1 < step || i + 1 === step ? "#000" : "#8888aa" }}>
            {i + 1 < step ? "✓" : i + 1}
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.05em", display: i + 1 <= step ? "inline" : "none" }} className="hidden lg:inline">{label}</span>
          {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", margin: "0 8px", backgroundColor: i + 1 < step ? "#00ff88" : "#1a1a2e" }} />}
        </div>
      ))}
    </div>
  );
}

function Dashboard({ onStart, setMission }: { onStart: () => void; setMission: (m: Mission) => void }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("Global");
  const regions = ["Global", "East Asia", "Eastern Europe", "Middle East", "South Asia", "West Africa", "Baltic", "Southeast Asia", "Central America", "Arctic", "East Africa"];
  const handleStart = () => {
    setMission({ id: "MSN-" + Date.now(), name: name || "Global Threat Assessment", region, startDate: new Date().toISOString(), status: "briefing" });
    onStart();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "0 24px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.4 }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "576px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ff6b00", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.3em", color: "#8888aa", textTransform: "uppercase" }}>Security Intelligence Platform</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.2 }}>Global Sports Event<br /><span style={{ color: "#ff6b00" }}>Geopolitical Briefing</span></h1>
          <p style={{ color: "#8888aa", fontSize: "16px", lineHeight: 1.6 }}>Level 1 Functional Simulation — Security Directors.<br />Real-time threat monitoring, risk assessment, and distribution.</p>
        </div>
        <div style={{ background: "#0c0c14", border: "1px solid #1a1a2e", borderRadius: "12px", padding: "32px", boxShadow: "0 0 40px rgba(255,107,0,0.1)" }}>
          <div style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.1em", color: "#ff6b00", textTransform: "uppercase", marginBottom: "24px" }}>Mission Configuration</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontFamily: "monospace", fontSize: "12px", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", display: "block" }}>Mission Designation</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Operation Desert Shield / Olympics 2028"
                style={{ width: "100%", background: "#0c0c14", border: "1px solid #1a1a2e", borderRadius: "8px", padding: "12px 16px", color: "#fff", fontFamily: "monospace", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#ff6b00"}
                onBlur={e => e.target.style.borderColor = "#1a1a2e"} />
            </div>
            <div>
              <label style={{ fontFamily: "monospace", fontSize: "12px", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", display: "block" }}>Region of Interest</label>
              <select value={region} onChange={e => setRegion(e.target.value)}
                style={{ width: "100%", background: "#0c0c14", border: "1px solid #1a1a2e", borderRadius: "8px", padding: "12px 16px", color: "#fff", fontFamily: "monospace", fontSize: "14px", outline: "none", appearance: "none", cursor: "pointer" }}>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", paddingTop: "16px", borderTop: "1px solid #1a1a2e" }}>
              {([["High Risk", RISK_SUMMARY.HIGH.length, "#ff3344"], ["Med Risk", RISK_SUMMARY.MEDIUM.length, "#ffd000"], ["Low Risk", RISK_SUMMARY.LOW.length, "#00ff88"]] as [string, number, string][]).map(([label, count, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: color }}>{count}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleStart} style={{ width: "100%", marginTop: "32px", padding: "16px", background: "linear-gradient(135deg, #ff6b00, #ff4500)", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase", fontSize: "14px", transition: "all 0.2s" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.filter = "brightness(1.15)"; b.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.filter = ""; b.style.transform = ""; }}>
            Initialize Briefing Sequence
          </button>
        </div>
        <p style={{ textAlign: "center", color: "#444466", fontFamily: "monospace", fontSize: "12px", marginTop: "24px" }}>CLASSIFICATION: UNCLASSIFIED // SENSITIVE // RESTRICTED DISTRIBUTION</p>
      </div>
    </div>
  );
}

function Scanning({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = ["Establishing secure feed...", "Collecting SIGINT data streams...", "Cross-referencing HUMINT reports...", "Analyzing OSINT telemetry...", "Generating risk matrix...", "Compiling intelligence package...", "Scan complete. Ready for briefing."];
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); setTimeout(onNext, 800); return 100; } return p + 1.5; });
      setPhase(p => Math.min(Math.floor(p / 14.4), phases.length - 1));
    }, 50);
    return () => clearInterval(interval);
  }, [onNext]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "0 24px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.2 }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "576px" }}>
        <div style={{ position: "relative", width: "192px", height: "192px", margin: "0 auto 40px" }}>
          {[0, 16, 32, 48, 64].map((offset, i) => (
            <div key={i} style={{ position: "absolute", borderRadius: "50%", border: "1px solid", inset: offset + "px", borderColor: i === 4 ? "rgba(255,107,0,0.15)" : "#1a1a2e" }} />
          ))}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,107,0,0.3) 30deg, transparent 60deg)", animation: "radarSweep 3s linear infinite" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff6b00", animation: "ping 1.5s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ff6b00" }} />
        </div>
        <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Scanning Intelligence Feed</h2>
        <p style={{ fontFamily: "monospace", fontSize: "14px", color: "#8888aa", marginBottom: "32px" }}>{phases[phase]}</p>
        <div style={{ width: "100%", background: "#1a1a2e", borderRadius: "9999px", height: "6px", marginBottom: "12px", overflow: "hidden" }}>
          <div style={{ height: "100%", backgroundColor: "#ff6b00", borderRadius: "9999px", transition: "width 0.1s", width: progress + "%" }} />
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#8888aa", marginBottom: "40px" }}>{Math.round(progress)}% complete</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {([["Events Scanned", Math.round(progress * 0.1), "#8888aa"], ["High Priority", RISK_SUMMARY.HIGH.length, "#ff3344"], ["Regions", 11, "#ff6b00"]] as [string, number, string][]).map(([label, value, color]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "30px", fontWeight: 700, color: color }}>{value}</div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskCard({ event, index }: { event: GeopoliticalEvent; index: number }) {
  const badgeStyle: Record<RiskLevel, React.CSSProperties> = {
    HIGH: { background: "rgba(255,51,68,0.15)", color: "#ff3344", border: "1px solid rgba(255,51,68,0.3)", padding: "4px 12px", borderRadius: "9999px", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-block" },
    MEDIUM: { background: "rgba(255,208,0,0.12)", color: "#ffd000", border: "1px solid rgba(255,208,0,0.25)", padding: "4px 12px", borderRadius: "9999px", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-block" },
    LOW: { background: "rgba(0,255,136,0.10)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.2)", padding: "4px 12px", borderRadius: "9999px", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-block" },
  };
  const glowStyle: Record<RiskLevel, React.CSSProperties> = {
    HIGH: { background: "#0c0c14", border: "1px solid rgba(255,51,68,0.3)", borderRadius: "12px", padding: "24px", boxShadow: "0 0 30px rgba(255,51,68,0.15)", animation: "fadeInUp 0.4s ease-out " + index * 80 + "ms both" },
    MEDIUM: { background: "#0c0c14", border: "1px solid rgba(255,208,0,0.25)", borderRadius: "12px", padding: "24px", boxShadow: "0 0 30px rgba(255,208,0,0.12)", animation: "fadeInUp 0.4s ease-out " + index * 80 + "ms both" },
    LOW: { background: "#0c0c14", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "12px", padding: "24px", boxShadow: "0 0 30px rgba(0,255,136,0.12)", animation: "fadeInUp 0.4s ease-out " + index * 80 + "ms both" },
  };
  return (
    <div style={glowStyle[event.risk]}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{event.region} · {event.country}</div>
          <h3 style={{ color: "#fff", fontWeight: 600, lineHeight: 1.3 }}>{event.event}</h3>
        </div>
        <span style={{ ...badgeStyle[event.risk], marginLeft: "16px", flexShrink: 0 }}>{event.risk}</span>
      </div>
      <p style={{ color: "#8888aa", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>{event.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {event.indicators.map(ind => <span key={ind} style={{ fontFamily: "monospace", fontSize: "11px", background: "#1a1a2e", color: "#666688", padding: "2px 8px", borderRadius: "4px", border: "1px solid #2a2a3e" }}>{ind}</span>)}
      </div>
      <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: "12px", marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#555577", marginBottom: "4px" }}>Forecast</div>
        <p style={{ fontSize: "14px", color: "#aaaacc" }}>{event.forecast}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #1a1a2e" }}>
        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#444466" }}>{event.source}</span>
        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#444466" }}>{formatDate(new Date(event.timestamp))}</span>
      </div>
    </div>
  );
}

function Briefing({ mission }: { mission: Mission }) {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "96px", paddingBottom: "64px", padding: "0 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#ff6b00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Intelligence Briefing</div>
          <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{mission.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#8888aa", fontFamily: "monospace" }}>
            <span>{mission.region}</span><span>·</span><span>{formatDate(new Date(mission.startDate))}</span><span>·</span><span>{MOCK_EVENTS.length} Events</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {([["HIGH RISK", RISK_SUMMARY.HIGH.length, "#ff3344", "rgba(255,51,68,0.08)"], ["MEDIUM RISK", RISK_SUMMARY.MEDIUM.length, "#ffd000", "rgba(255,208,0,0.08)"], ["LOW RISK", RISK_SUMMARY.LOW.length, "#00ff88", "rgba(0,255,136,0.06)"]] as [string, number, string, string][]).map(([label, count, color, bg]) => (
            <div key={label} style={{ background: bg, border: "1px solid #1a1a2e", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", fontWeight: 700, color: color, marginBottom: "4px" }}>{count}</div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label} Events</div>
            </div>
          ))}
        </div>
        {(["HIGH", "MEDIUM", "LOW"] as RiskLevel[]).map(risk => (
          RISK_SUMMARY[risk].length > 0 && (
            <div key={risk} style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: risk === "HIGH" ? "#ff3344" : risk === "MEDIUM" ? "#ffd000" : "#00ff88" }}>{risk} Risk Events</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#1a1a2e" }} />
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#8888aa" }}>{RISK_SUMMARY[risk].length} events</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
                {RISK_SUMMARY[risk].map((event, i) => <RiskCard key={event.id} event={event} index={i} />)}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function Approval({ mission }: { mission: Mission }) {
  const [approved, setApproved] = useState(false);
  const handleApprove = () => setApproved(true);
  if (approved) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "96px", paddingBottom: "64px", padding: "0 24px" }}>
        <div style={{ maxWidth: "896px", margin: "0 auto" }}>
          <div style={{ background: "#0c0c14", border: "1px solid rgba(0,255,136,0.25)", borderRadius: "12px", padding: "40px", textAlign: "center", boxShadow: "0 0 30px rgba(0,255,136,0.12)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="32" height="32" fill="none" stroke="#00ff88" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Briefing Approved & Distributed</h2>
            <p style={{ fontFamily: "monospace", fontSize: "14px", color: "#8888aa", marginBottom: "32px" }}>Mission: {mission.name} · {mission.region} · {formatDate(new Date(mission.startDate))}</p>
            <div style={{ background: "#0c0c14", borderRadius: "8px", padding: "24px", textAlign: "left", border: "1px solid #1a1a2e", marginBottom: "32px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#ff6b00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Final Distribution Report</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {([["Total Events", MOCK_EVENTS.length], ["High Risk", RISK_SUMMARY.HIGH.length], ["Medium Risk", RISK_SUMMARY.MEDIUM.length], ["Low Risk", RISK_SUMMARY.LOW.length], ["Classification", "UNCLASSIFIED // SENSITIVE"], ["Distribution", "RESTRICTED — NEED-TO-KNOW basis"]] as [string, unknown][]).map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: "14px", borderBottom: "1px solid #1a1a2e", paddingBottom: "8px" }}>
                    <span style={{ color: "#8888aa" }}>{label}</span>
                    <span style={{ color: "#fff", fontWeight: 600 }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#444466", marginTop: "32px" }}>AUTHORIZED FOR RELEASE · {new Date().toUTCString().slice(0, 16).toUpperCase()} · SENTINEL RISK v2.4.1</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh", paddingTop: "96px", paddingBottom: "64px", padding: "0 24px" }}>
      <div style={{ maxWidth: "896px", margin: "0 auto" }}>
        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#ff6b00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Approval & Distribution</div>
        <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{mission.name}</h2>
        <p style={{ color: "#8888aa", fontFamily: "monospace", fontSize: "14px", marginBottom: "40px" }}>Review the intelligence package below and authorize distribution.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {([["HIGH RISK", RISK_SUMMARY.HIGH.length, "#ff3344"], ["MEDIUM RISK", RISK_SUMMARY.MEDIUM.length, "#ffd000"], ["LOW RISK", RISK_SUMMARY.LOW.length, "#00ff88"]] as [string, number, string][]).map(([label, count, color]) => (
            <div key={label} style={{ background: "#0c0c14", border: "1px solid #1a1a2e", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "30px", fontWeight: 700, color: color }}>{count}</div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#8888aa", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0c0c14", border: "1px solid #1a1a2e", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "14px", color: "#8888aa", lineHeight: 1.7, marginBottom: "24px" }}>
            This briefing package contains {MOCK_EVENTS.length} geopolitical events across {mission.region}. All HIGH and MEDIUM risk events require attention. Approving this document authorizes its distribution to authorized security personnel.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "#0c0c14", borderRadius: "8px", border: "1px solid #1a1a2e", marginBottom: "24px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff6b00", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#8888aa" }}>Awaiting authorization...</span>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <button onClick={handleApprove} style={{ flex: 1, padding: "16px", background: "linear-gradient(135deg, #ff6b00, #ff4500)", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase", fontSize: "14px" }}>
              Approve & Distribute
            </button>
            <button style={{ padding: "16px 32px", background: "transparent", color: "#8888aa", border: "1px solid #1a1a2e", borderRadius: "8px", fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer", textTransform: "uppercase", fontSize: "12px" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [mission, setMission] = useState<Mission | null>(null);
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#050508", color: "#fff", overflowX: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.4), transparent)", animation: "scan 4s linear infinite", pointerEvents: "none", zIndex: 9999 }} />
      <Header mission={mission} />
      <div style={{ paddingTop: "80px", padding: "0 24px" }}>
        {step > 1 && <div style={{ maxWidth: "1280px", margin: "0 auto" }}><Stepper step={step} /></div>}
        {step === 1 && <Dashboard onStart={() => setStep(2)} setMission={setMission} />}
        {step === 2 && <Scanning onNext={() => setStep(3)} />}
        {step === 3 && mission && <Briefing mission={mission} />}
        {step === 4 && mission && <Approval mission={mission} />}
      </div>
      {step > 1 && step < 4 && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", display: "flex", gap: "12px" }}>
          {step > 1 && step < 3 && <button onClick={() => setStep(s => s - 1)} style={{ padding: "8px 20px", background: "transparent", color: "#8888aa", border: "1px solid #1a1a2e", borderRadius: "8px", fontFamily: "monospace", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}>Back</button>}
          {step === 3 && <button onClick={() => setStep(4)} style={{ padding: "12px 24px", background: "linear-gradient(135deg, #ff6b00, #ff4500)", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "monospace", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}>Proceed to Approval</button>}
        </div>
      )}
    </div>
  );
}
