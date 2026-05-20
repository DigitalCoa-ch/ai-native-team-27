"use client";

import { useState, useEffect } from "react";

type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

interface GeopoliticalEvent {
  id: number;
  region: string;
  country: string;
  event: string;
  description: string;
  indicators: string[];
  forecast: string;
  source: string;
  risk: RiskLevel;
  timestamp: string;
}

const MOCK_EVENTS: GeopoliticalEvent[] = [
  { id: 1, region: "Middle East", country: "Iran", event: "Regional Alliance Summit", description: "Tehran hosting senior diplomats from Syria, Lebanon, and Iraq. Intelligence suggests weapons discussions and coordinated military planning.", indicators: ["SIGINT Spike", "Diplomatic Traffic", "Military Comms"], forecast: "Escalation risk: HIGH. Anticipated joint military exercises within 14 days. Recommendation: Increase surveillance.", source: "SIGINT/HUMINT", risk: "HIGH", timestamp: "2024-07-15T06:30:00Z" },
  { id: 2, region: "East Africa", country: "Kenya", event: "Election Rally Violence", description: "Clashes at opposition gathering in Nairobi. Police deploy tear gas. Two killed, twelve injured. Tensions align with August primaries.", indicators: ["Social Media Surge", "Civil Unrest", "Security Response"], forecast: "Escalation risk: MEDIUM. Pre-election volatility increasing. Monitor for coordinated violence.", source: "OSINT/HUMINT", risk: "MEDIUM", timestamp: "2024-07-15T08:15:00Z" },
  { id: 3, region: "Baltic", country: "Estonia", event: "Border Incident", description: "Russian MIG-31 intercepted near Estonian airspace. Incursion lasted 4 minutes. NATO scrambles response. Short-range radar active.", indicators: ["ADIZ Penetration", "Military Aircraft", "NATO Response"], forecast: "Escalation risk: LOW. Probe of NATO response times. No sustained presence.", source: "SIGINT/RADAR", risk: "LOW", timestamp: "2024-07-15T09:00:00Z" },
  { id: 4, region: "Southeast Asia", country: "Philippines", event: "Maritime Standoff", description: "Chinese Coast Guard blocks Philippines resupply mission to Thitu Island. Water cannon deployed. No injuries. Serious damage to vessels.", indicators: ["Naval Presence", "Vessel Intercept", "Geopolitical Posture"], forecast: "Escalation risk: MEDIUM. Ongoing territorial disputes likely to continue.", source: "OSINT/SATINT", risk: "MEDIUM", timestamp: "2024-07-15T10:30:00Z" },
  { id: 5, region: "West Africa", country: "Mali", event: "UN Peacekeeping Withdrawal", description: "Wagner Group reinforcements arrive at Bamako airport. 300 personnel. Local sources confirm. French MINUSMA drawdown accelerating.", indicators: ["Mercenary Activity", "Military Buildup", "Diplomatic Shift"], forecast: "Escalation risk: HIGH. Wagner consolidation enables expanded operations. Regional destabilization likely.", source: "HUMINT/SIGINT", risk: "HIGH", timestamp: "2024-07-15T11:45:00Z" },
  { id: 6, region: "East Asia", country: "Japan", event: "Olympics Security Operation", description: "Japan Coast Guard establishes 30nm security perimeter around Tokyo Bay. Naval assets positioned. Intelligence indicates terrorism threat Level ORANGE.", indicators: ["Naval Deployment", "Counter-Terrorism", "Public Safety"], forecast: "Escalation risk: LOW. Security operation standard protocol for high-profile event.", source: "SIGINT/OSINT", risk: "LOW", timestamp: "2024-07-15T13:00:00Z" },
  { id: 7, region: "Central America", country: "Mexico", event: "Cartel Territory Dispute", description: "Sinaloa vs Jalisco cartels clash in Sonora. 18 killed over border control. Firefights near US border. Arizona感受到 cross-border spillover.", indicators: ["Violence Surge", "Cartel Warfare", "Border Tension"], forecast: "Escalation risk: MEDIUM. Cartel conflict likely to intensify through election cycle.", source: "HUMINT/OSINT", risk: "MEDIUM", timestamp: "2024-07-15T14:30:00Z" },
  { id: 8, region: "Eastern Europe", country: "Ukraine", event: "Drone Strike Deep Strike", description: "Long-range drones strike Russian airfield 450km from frontline. Infrastructure damage reported. New indigenous drone capability confirmed.", indicators: ["Drone Technology", "Deep Strike", "Domestic Production"], forecast: "Escalation risk: HIGH. Ukraine expanding strategic strike capability. Russian retaliation likely.", source: "SIGINT/IMINT", risk: "HIGH", timestamp: "2024-07-15T15:00:00Z" },
  { id: 9, region: "Arctic", country: "Russia", event: "Northern Fleet Exercise", description: "Kola Peninsula: 40+ vessels at sea. Missile test detected in Barents Sea. FAA closes airspace. Nuclear-capable assets confirmed.", indicators: ["Naval Exercise", "Nuclear Posture", "Arctic Control"], forecast: "Escalation risk: MEDIUM. Show of force in strategic region. Monitor for equipment degradation.", source: "SIGINT/METT", risk: "MEDIUM", timestamp: "2024-07-15T16:30:00Z" },
  { id: 10, region: "South Asia", country: "India-Pakistan", event: "Kashmir Ceasefire Breach", description: "Cross-border firing in Kupwara sector. 2 injured. Indian army retaliates. DGMO hotline activated. Tensions remain contained.", indicators: ["Military Exchange", "Ceasefire Violation", "Diplomatic Channel"], forecast: "Escalation risk: LOW. Existing hotline protocols managing incident. No escalation expected.", source: "SIGINT/ISGS", risk: "LOW", timestamp: "2024-07-15T17:00:00Z" },
];

const RISK_SUMMARY = {
  HIGH: MOCK_EVENTS.filter((e) => e.risk === "HIGH"),
  MEDIUM: MOCK_EVENTS.filter((e) => e.risk === "MEDIUM"),
  LOW: MOCK_EVENTS.filter((e) => e.risk === "LOW"),
};

type Mission = { id: string; name: string; region: string; startDate: string; status: string };

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

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
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontSize: "12px", fontWeight: 700, transition: "all 0.5s",
            backgroundColor: i + 1 < step ? "#00ff88" : i + 1 === step ? "#ff6b00" : "#1a1a2e",
            color: i + 1 < step || i + 1 === step ? "#000" : "#8888aa"
          }}>{i + 1 < step ? "✓" : i + 1}</div>
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
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.15)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ""; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}>
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
  const phases = ["Establishing secure feed...", "Collect