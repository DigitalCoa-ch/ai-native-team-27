"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface Mission {
  id: string;
  name: string;
  region: string;
  startDate: string;
  status: string;
}

const MOCK_EVENTS: GeopoliticalEvent[] = [
  {
    id: 1,
    region: "Middle East",
    country: "Iran",
    event: "Regional Alliance Summit",
    description: "Tehran hosting senior diplomats from Syria, Lebanon, and Iraq. Intelligence suggests weapons discussions and coordinated military planning.",
    indicators: ["SIGINT Spike", "Diplomatic Traffic", "Military Comms"],
    forecast: "Escalation risk: HIGH. Anticipated joint military exercises within 14 days. Recommendation: Increase surveillance.",
    source: "SIGINT/HUMINT",
    risk: "HIGH",
    timestamp: "2024-07-15T06:30:00Z",
  },
  {
    id: 2,
    region: "East Africa",
    country: "Kenya",
    event: "Election Rally Violence",
    description: "Clashes at opposition gathering in Nairobi. Police deploy tear gas. Two killed, twelve injured. Tensions align with August primaries.",
    indicators: ["Social Media Surge", "Civil Unrest", "Security Response"],
    forecast: "Escalation risk: MEDIUM. Pre-election volatility increasing. Monitor for coordinated violence.",
    source: "OSINT/HUMINT",
    risk: "MEDIUM",
    timestamp: "2024-07-15T08:15:00Z",
  },
  {
    id: 3,
    region: "Baltic",
    country: "Estonia",
    event: "Border Incident",
    description: "Russian MIG-31 intercepted near Estonian airspace. Incursion lasted 4 minutes. NATO scrambles response. Short-range radar active.",
    indicators: ["ADIZ Penetration", "Military Aircraft", "NATO Response"],
    forecast: "Escalation risk: LOW. Probe of NATO response times. No sustained presence.",
    source: "SIGINT/RADAR",
    risk: "LOW",
    timestamp: "2024-07-15T09:00:00Z",
  },
  {
    id: 4,
    region: "Southeast Asia",
    country: "Philippines",
    event: "Maritime Standoff",
    description: "Chinese Coast Guard blocks Philippines resupply mission to Thitu Island. Water cannon deployed. No injuries. Serious damage to vessels.",
    indicators: ["Naval Presence", "Vessel Intercept", "Geopolitical Posture"],
    forecast: "Escalation risk: MEDIUM. Ongoing territorial disputes likely to continue.",
    source: "OSINT/SATINT",
    risk: "MEDIUM",
    timestamp: "2024-07-15T10:30:00Z",
  },
  {
    id: 5,
    region: "West Africa",
    country: "Mali",
    event: "UN Peacekeeping Withdrawal",
    description: "Wagner Group reinforcements arrive at Bamako airport. 300 personnel. Local sources confirm. French MINUSMA drawdown accelerating.",
    indicators: ["Mercenary Activity", "Military Buildup", "Diplomatic Shift"],
    forecast: "Escalation risk: HIGH. Wagner consolidation enables expanded operations. Regional destabilization likely.",
    source: "HUMINT/SIGINT",
    risk: "HIGH",
    timestamp: "2024-07-15T11:45:00Z",
  },
  {
    id: 6,
    region: "East Asia",
    country: "Japan",
    event: "Olympics Security Operation",
    description: "Japan Coast Guard establishes 30nm security perimeter around Tokyo Bay. Naval assets positioned. Intelligence indicates terrorism threat Level ORANGE.",
    indicators: ["Naval Deployment", "Counter-Terrorism", "Public Safety"],
    forecast: "Escalation risk: LOW. Security operation standard protocol for high-profile event.",
    source: "SIGINT/OSINT",
    risk: "LOW",
    timestamp: "2024-07-15T13:00:00Z",
  },
  {
    id: 7,
    region: "Central America",
    country: "Mexico",
    event: "Cartel Territory Dispute",
    description: "Sinaloa vs Jalisco cartels clash in Sonora. 18 killed over border control. Firefights near US border. Arizona感受到 cross-border spillover.",
    indicators: ["Violence Surge", "Cartel Warfare", "Border Tension"],
    forecast: "Escalation risk: MEDIUM. Cartel conflict likely to intensify through election cycle.",
    source: "HUMINT/OSINT",
    risk: "MEDIUM",
    timestamp: "2024-07-15T14:30:00Z",
  },
  {
    id: 8,
    region: "Eastern Europe",
    country: "Ukraine",
    event: "Drone Strike Deep Strike",
    description: "Long-range drones strike Russian airfield 450km from frontline. Infrastructure damage reported. New indigenous drone capability confirmed.",
    indicators: ["Drone Technology", "Deep Strike", "Domestic Production"],
    forecast: "Escalation risk: HIGH. Ukraine expanding strategic strike capability. Russian retaliation likely.",
    source: "SIGINT/IMINT",
    risk: "HIGH",
    timestamp: "2024-07-15T15:00:00Z",
  },
  {
    id: 9,
    region: "Arctic",
    country: "Russia",
    event: "Northern Fleet Exercise",
    description: "Kola Peninsula: 40+ vessels at sea. Missile test detected in Barents Sea. FAA closes airspace. Nuclear-capable assets confirmed.",
    indicators: ["Naval Exercise", "Nuclear Posture", "Arctic Control"],
    forecast: "Escalation risk: MEDIUM. Show of force in strategic region. Monitor for equipment degradation.",
    source: "SIGINT/METT",
    risk: "MEDIUM",
    timestamp: "2024-07-15T16:30:00Z",
  },
  {
    id: 10,
    region: "South Asia",
    country: "India-Pakistan",
    event: "Kashmir Ceasefire Breach",
    description: "Cross-border firing in Kupwara sector. 2 injured. Indian army retaliates. DGMO hotline activated. Tensions remain contained.",
    indicators: ["Military Exchange", "Ceasefire Violation", "Diplomatic Channel"],
    forecast: "Escalation risk: LOW. Existing hotline protocols managing incident. No escalation expected.",
    source: "SIGINT/ISGS",
    risk: "LOW",
    timestamp: "2024-07-15T17:00:00Z",
  },
];

const RISK_SUMMARY = {
  HIGH: MOCK_EVENTS.filter((e) => e.risk === "HIGH"),
  MEDIUM: MOCK_EVENTS.filter((e) => e.risk === "MEDIUM"),
  LOW: MOCK_EVENTS.filter((e) => e.risk === "LOW"),
};

const REGIONS = [
  "Global",
  "East Asia",
  "Eastern Europe",
  "Middle East",
  "South Asia",
  "West Africa",
  "Baltic",
  "Southeast Asia",
  "Central America",
  "Arctic",
  "East Africa",
];

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 16).replace("T", " · ").toUpperCase();
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Header({ mission }: { mission: Mission | null }) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(5,5,8,0.92)",
        borderBottom: "1px solid #1a1a2e",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-2 h-2 rounded-full bg-[#ff6b00]"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="font-mono text-sm font-semibold tracking-widest text-[#ff6b00] uppercase">
          Sentinel Risk
        </span>
      </div>
      <div className="font-mono text-xs text-[#8888aa]">
        {mission ? mission.name + " · " + mission.region : "GEOPOLITICAL BRIEFING SYSTEM"}
      </div>
      <div className="font-mono text-xs text-[#8888aa] hidden md:block">
        {new Date().toUTCString().slice(0, 16).toUpperCase()}
      </div>
    </motion.header>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["SETUP", "SCANNING", "BRIEFING", "APPROVAL"];
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-10"
    >
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              background: i + 1 < step ? "#00ff88" : i + 1 === step ? "#ff6b00" : "#1a1a2e",
            }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 shrink-0",
              i + 1 < step ? "text-black" : i + 1 === step ? "text-black" : "text-[#8888aa]"
            )}
          >
            {i + 1 < step ? "✓" : i + 1}
          </motion.div>
          <span
            className={cn(
              "text-xs font-mono tracking-wider hidden lg:inline",
              i + 1 <= step ? "text-[#f0f0f5]" : "text-[#8888aa]"
            )}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i + 1 < step ? 1 : 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
              className={cn(
                "flex-1 h-px mx-2 origin-left",
                i + 1 < step ? "bg-[#00ff88]" : "bg-[#1a1a2e]"
              )}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
function Dashboard({
  onStart,
  setMission,
}: {
  onStart: () => void;
  setMission: (m: Mission) => void;
}) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("Global");

  const handleStart = () => {
    setMission({
      id: "MSN-" + Date.now(),
      name: name || "Global Threat Assessment",
      region,
      startDate: new Date().toISOString(),
      status: "briefing",
    });
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="grid-bg absolute inset-0 opacity-40" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[#ff6b00]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-xs tracking-[0.3em] text-[#8888aa] uppercase">
              Security Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Global Sports Event
            <br />
            <span className="text-[#ff6b00]">Geopolitical Briefing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#8888aa] text-base leading-relaxed"
          >
            Level 1 Functional Simulation — Security Directors.
            <br />
            Real-time threat monitoring, risk assessment, and distribution.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 glow-orange"
        >
          <div className="font-mono text-xs tracking-widest text-[#ff6b00] uppercase mb-6">
            Mission Configuration
          </div>

          <div className="space-y-5">
            <div>
              <label className="font-mono text-xs text-[#8888aa] uppercase tracking-wider mb-2 block">
                Mission Designation
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Operation Desert Shield / Olympics 2028"
                className="w-full bg-[#0c0c14] border border-[#1a1a2e] rounded-lg px-4 py-3 text-white placeholder:text-[#444466] focus:border-[#ff6b00] outline-none transition-colors font-mono text-sm"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-[#8888aa] uppercase tracking-wider mb-2 block">
                Region of Interest
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-[#0c0c14] border border-[#1a1a2e] rounded-lg px-4 py-3 text-white focus:border-[#ff6b00] outline-none transition-colors font-mono text-sm appearance-none cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1a1a2e]"
            >
              {[
                ["High Risk", RISK_SUMMARY.HIGH.length, "#ff3344"],
                ["Med Risk", RISK_SUMMARY.MEDIUM.length, "#ffd000"],
                ["Low Risk", RISK_SUMMARY.LOW.length, "#00ff88"],
              ].map(([label, count, color], idx) => (
                <div key={label as string} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + idx * 0.1, type: "spring" }}
                    className="text-2xl font-bold"
                    style={{ color: color as string }}
                  >
                    {count as number}
                  </motion.div>
                  <div className="font-mono text-xs text-[#8888aa] uppercase tracking-wider">
                    {label as string}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 107, 0, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="btn-primary w-full mt-8 text-base py-4"
          >
            INITIALIZE BRIEFING SEQUENCE
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[#444466] font-mono text-xs mt-6"
        >
          CLASSIFICATION: UNCLASSIFIED // SENSITIVE // RESTRICTED DISTRIBUTION
        </motion.p>
      </motion.div>
    </div>
  );
}
function Scanning({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = [
    "Establishing secure feed...",
    "Collecting SIGINT data streams...",
    "Cross-referencing HUMINT reports...",
    "Analyzing OSINT telemetry...",
    "Generating risk matrix...",
    "Compiling intelligence package...",
    "Scan complete. Ready for briefing.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onNext, 800);
          return 100;
        }
        return p + 1.5;
      });
      setPhase((p) => Math.min(Math.floor(p / 14.4), phases.length - 1));
    }, 50);
    return () => clearInterval(interval);
  }, [onNext, phases.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="grid-bg absolute inset-0 opacity-20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-xl"
      >
        <div className="relative w-48 h-48 mx-auto mb-10">
          {[0, 16, 32, 48, 64].map((offset, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                inset: offset + "px",
                borderColor: i === 4 ? "rgba(255,107,0,0.15)" : "#1a1a2e",
              }}
            />
          ))}
          <motion.div
            className="radar-sweep absolute inset-0"
            style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,107,0,0.15) 30deg, transparent 60deg)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff6b00]"
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Scanning Intelligence Feed
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-sm text-[#8888aa] mb-8"
        >
          {phases[phase]}
        </motion.p>

        <div className="w-full bg-[#1a1a2e] rounded-full h-1.5 mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-[#ff6b00] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: progress + "%" }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="font-mono text-xs text-[#8888aa] mb-10">
          {Math.round(progress)}% complete
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-6"
        >
          {[
            ["Events Scanned", Math.round(progress * 0.1), "#8888aa"],
            ["High Priority", RISK_SUMMARY.HIGH.length, "#ff3344"],
            ["Regions", 11, "#ff6b00"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="text-3xl font-bold"
                style={{ color: color as string }}
              >
                {value as number}
              </motion.div>
              <div className="font-mono text-xs text-[#8888aa] uppercase tracking-wider mt-1">
                {label as string}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
function RiskCard({ event, index }: { event: GeopoliticalEvent; index: number }) {
  const badgeClass: Record<RiskLevel, string> = {
    HIGH: "badge-high",
    MEDIUM: "badge-medium",
    LOW: "badge-low",
  };
  const glowClass: Record<RiskLevel, string> = {
    HIGH: "glow-red",
    MEDIUM: "glow-yellow",
    LOW: "glow-green",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn("card p-6", glowClass[event.risk])}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-[#8888aa] uppercase tracking-wider mb-1">
            {event.region} · {event.country}
          </div>
          <h3 className="text-white font-semibold leading-tight">{event.event}</h3>
        </div>
        <span
          className={cn(
            "font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ml-4",
            badgeClass[event.risk]
          )}
        >
          {event.risk}
        </span>
      </div>

      <p className="text-[#8888aa] text-sm leading-relaxed mb-4">{event.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {event.indicators.map((ind) => (
          <span
            key={ind}
            className="font-mono text-xs bg-[#1a1a2e] text-[#666688] px-2 py-0.5 rounded border border-[#2a2a3e]"
          >
            {ind}
          </span>
        ))}
      </div>

      <div className="border-t border-[#1a1a2e] pt-3">
        <div className="text-xs font-mono text-[#555577] mb-1">Forecast</div>
        <p className="text-sm text-[#aaaacc]">{event.forecast}</p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a2e]">
        <span className="font-mono text-xs text-[#444466]">{event.source}</span>
        <span className="font-mono text-xs text-[#444466]">
          {formatDate(event.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
function Briefing({ mission }: { mission: Mission }) {
  const riskColors: Record<RiskLevel, { color: string; bg: string }> = {
    HIGH: { color: "#ff3344", bg: "rgba(255,51,68,0.08)" },
    MEDIUM: { color: "#ffd000", bg: "rgba(255,208,0,0.08)" },
    LOW: { color: "#00ff88", bg: "rgba(0,255,136,0.06)" },
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="font-mono text-xs text-[#ff6b00] uppercase tracking-widest mb-2">
            Intelligence Briefing
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">{mission.name}</h2>
          <div className="flex items-center gap-3 text-sm text-[#8888aa] font-mono">
            <span>{mission.region}</span>
            <span>·</span>
            <span>{formatDate(mission.startDate)}</span>
            <span>·</span>
            <span>{MOCK_EVENTS.length} Events</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {(["HIGH", "MEDIUM", "LOW"] as RiskLevel[]).map((risk) => (
            <div
              key={risk}
              className="card p-5 text-center"
              style={{ background: riskColors[risk].bg }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-4xl font-bold mb-1"
                style={{ color: riskColors[risk].color }}
              >
                {RISK_SUMMARY[risk].length}
              </motion.div>
              <div className="font-mono text-xs text-[#8888aa] uppercase tracking-wider">
                {risk} Risk Events
              </div>
            </div>
          ))}
        </motion.div>

        {(["HIGH", "MEDIUM", "LOW"] as RiskLevel[]).map((risk) =>
          RISK_SUMMARY[risk].length > 0 ? (
            <motion.div
              key={risk}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={cn(
                    "font-mono text-sm font-bold uppercase tracking-wider",
                    risk === "HIGH"
                      ? "text-[#ff3344]"
                      : risk === "MEDIUM"
                      ? "text-[#ffd000]"
                      : "text-[#00ff88]"
                  )}
                >
                  {risk} Risk Events
                </span>
                <div className="flex-1 h-px bg-[#1a1a2e]" />
                <span className="font-mono text-xs text-[#8888aa]">
                  {RISK_SUMMARY[risk].length} events
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {RISK_SUMMARY[risk].map((event, i) => (
                  <RiskCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            </motion.div>
          ) : null
        )}
      </div>
    </div>
  );
}
function Approval({ mission }: { mission: Mission }) {
  const [approved, setApproved] = useState(false);

  if (approved) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card p-10 text-center glow-green"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-[#00ff88]/20 flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-8 h-8 text-[#00ff88]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Briefing Approved & Distributed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#8888aa] font-mono text-sm mb-8"
            >
              Mission: {mission.name} · {mission.region} ·{" "}
              {formatDate(mission.startDate)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#0c0c14] rounded-lg p-6 text-left border border-[#1a1a2e]"
            >
              <div className="font-mono text-xs text-[#ff6b00] uppercase tracking-widest mb-4">
                Final Distribution Report
              </div>
              <div className="space-y-3">
                {[
                  ["Total Events", MOCK_EVENTS.length],
                  ["High Risk", RISK_SUMMARY.HIGH.length],
                  ["Medium Risk", RISK_SUMMARY.MEDIUM.length],
                  ["Low Risk", RISK_SUMMARY.LOW.length],
                  ["Classification", "UNCLASSIFIED // SENSITIVE"],
                  [
                    "Distribution",
                    "RESTRICTED — NEED-TO-KNOW basis",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex justify-between font-mono text-sm border-b border-[#1a1a2e] pb-2"
                  >
                    <span className="text-[#8888aa]">{label as string}</span>
                    <span className="text-white font-semibold">
                      {value as unknown as string}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 font-mono text-xs text-[#444466]"
            >
              AUTHORIZED FOR RELEASE ·{" "}
              {new Date().toUTCString().slice(0, 16).toUpperCase()} · SENTINEL
              RISK v2.4.1
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="font-mono text-xs text-[#ff6b00] uppercase tracking-widest mb-2">
            Approval & Distribution
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">{mission.name}</h2>
          <p className="text-[#8888aa] font-mono text-sm mb-10">
            Review the intelligence package below and authorize distribution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            ["HIGH RISK", RISK_SUMMARY.HIGH.length, "#ff3344"],
            ["MEDIUM RISK", RISK_SUMMARY.MEDIUM.length, "#ffd000"],
            ["LOW RISK", RISK_SUMMARY.LOW.length, "#00ff88"],
          ].map(([label, count, color]) => (
            <div key={label as string} className="card p-5 text-center">
              <div
                className="text-3xl font-bold"
                style={{ color: color as string }}
              >
                {count as number}
              </div>
              <div className="font-mono text-xs text-[#8888aa] uppercase">
                {label as string}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-8"
        >
          <div className="font-mono text-sm text-[#8888aa] mb-6 leading-relaxed">
            This briefing package contains {MOCK_EVENTS.length} geopolitical
            events across {mission.region}. All HIGH and MEDIUM risk events
            require attention. Approving this document authorizes its
            distribution to authorized security personnel.
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#0c0c14] rounded-lg border border-[#1a1a2e] mb-6">
            <motion.div
              className="w-3 h-3 rounded-full bg-[#ff6b00]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-sm text-[#8888aa]">
              Awaiting authorization...
            </span>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 107, 0, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setApproved(true)}
              className="btn-primary flex-1 py-4 text-base"
            >
              APPROVE & DISTRIBUTE
            </motion.button>
            <motion.button
              whileHover={{ borderColor: "#ff6b00", color: "#ff6b00" }}
              className="btn-secondary py-4 px-8"
            >
              CANCEL
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default function Home() {
  const [step, setStep] = useState(1);
  const [mission, setMission] = useState<Mission | null>(null);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <div className="scan-line" />
      <Header mission={mission} />
      <div className="pt-20 px-6">
        <AnimatePresence mode="wait">
          {step > 1 && (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              <Stepper step={step} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Dashboard onStart={() => setStep(2)} setMission={setMission} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Scanning onNext={() => setStep(3)} />
            </motion.div>
          )}
          {step === 3 && mission && (
            <motion.div
              key="briefing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Briefing mission={mission} />
            </motion.div>
          )}
          {step === 4 && mission && (
            <motion.div
              key="approval"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Approval mission={mission} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step > 1 && step < 4 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-6 right-6 flex gap-3"
        >
          {step > 1 && step < 3 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep((s) => s - 1)}
              className="btn-secondary py-2 px-5 text-xs"
            >
              BACK
            </motion.button>
          )}
          {step === 3 && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 107, 0, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(4)}
              className="btn-primary py-3 px-6 text-sm"
            >
              PROCEED TO APPROVAL
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
