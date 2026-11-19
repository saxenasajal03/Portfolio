import React, { useState } from 'react';
import { Compass, Navigation, Radio, MapPin, Sparkles, Shield, Award, Building2, GraduationCap, Home } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { MotionCard3D } from './MotionCard3D';

interface GeoNode {
  id: string;
  name: string;
  region: string;
  role: string;
  coords: string;
  xPercent: number;
  yPercent: number;
  icon: typeof Building2;
  color: string;
  badge: string;
  metrics: string[];
  description: string;
}

const NODES: GeoNode[] = [
  {
    id: 'delhi',
    name: 'New Delhi / Ghitorni HQ',
    region: 'National Capital Region',
    role: 'Central SBC Quality Team · Urban Company',
    coords: '28.4986° N, 77.1558° E',
    xPercent: 37.5,
    yPercent: 34.2,
    icon: Building2,
    color: '#ff9a3c',
    badge: 'ACTIVE HQ OPERATION',
    metrics: [
      'Tier 1 & Tier 2 operational bottleneck resolution & RCA',
      'Jarvis analytics, SQL telemetry & advanced Excel modeling',
      'Real-Time (RT) attendance threshold compliance >80%',
      'Partner Upgrades Training & AI Handholding pilot lead'
    ],
    description: 'Central operations and service-level agreement (SLA) quality management for Urban Company\'s nationwide partner network.'
  },
  {
    id: 'dehradun',
    name: 'Dehradun Academic Hub',
    region: 'Uttarakhand State',
    role: 'B.Tech in Computer Science & Engineering',
    coords: '30.3165° N, 78.0322° E',
    xPercent: 39.2,
    yPercent: 29.8,
    icon: GraduationCap,
    color: '#38bdf8',
    badge: '2021 – 2025 ALMA MATER',
    metrics: [
      'Dev Bhoomi Uttarakhand University (DBUU)',
      'NEP Saarthi — Appointed Ambassador by UGC',
      'Lakshagriha Hackathon 1.0 Finalist',
      'Core focus: Distributed Systems, WebRTC, Deep Learning'
    ],
    description: 'Foundational computer science research and engineering mastery, fostering student innovation and academic leadership.'
  },
  {
    id: 'gola',
    name: 'Gola Gokarannath Base',
    region: 'Lakhimpur Kheri, Uttar Pradesh',
    role: 'Origin Foundry · PIN: 262802',
    coords: '28.0824° N, 80.4706° E',
    xPercent: 44.8,
    yPercent: 35.8,
    icon: Home,
    color: '#10b981',
    badge: 'ROOT ORIGIN NODE',
    metrics: [
      'Bharat Bhushan Colony, Gola Gokarannath (262802)',
      'Class XII (PCM) & Class X: Children\'s Academy Sr. Sec. School',
      'Early software forge: Java, algorithms & relational databases',
      'Origin of full-stack engineering curiosity'
    ],
    description: 'Roots of analytical discipline, mathematical foundations, and initial software development exploration.'
  }
];

export const IndiaSpatialMap: React.FC = () => {
  const [activeNode, setActiveNode] = useState<GeoNode>(NODES[0]);

  const selectNode = (node: GeoNode) => {
    soundEngine.playTick();
    setActiveNode(node);
  };

  return (
    <section id="spatial-india" className="relative py-24 px-4 sm:px-6 bg-[#090604] border-t border-white/10 overflow-hidden">
      {/* Background Cybernetic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#ff9a3c]/10 via-[#38bdf8]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9a3c] uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-pulse" />
              <span>04 // Geographic Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              SOVEREIGN INDIA METAVERSE MAP
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
            <Radio className="w-3.5 h-3.5 text-[#10b981] animate-pulse" />
            <span>SURVEY OF INDIA CARTOGRAPHIC ALIGNMENT</span>
          </div>
        </div>

        {/* Main Grid: Real India Vector Map + Interactive Telemetry HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Real Sovereign India Vector Map */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <MotionCard3D maxTilt={6} depth={15} className="w-full max-w-[500px]">
              <div className="relative p-6 sm:p-8 rounded-2xl bg-[#120c08]/90 border border-white/15 backdrop-blur-xl shadow-[0_0_50px_rgba(255,154,60,0.1)] overflow-hidden">
                {/* HUD Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#ff9a3c]" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#ff9a3c]" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#ff9a3c]" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#ff9a3c]" />

                {/* Coordinates Watermark */}
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-4 pb-2 border-b border-white/5">
                  <span>LAT: 08°04&apos;N TO 37°06&apos;N</span>
                  <span>LONG: 68°07&apos;E TO 97°25&apos;E</span>
                </div>

                <div className="relative w-full aspect-[400/470]">
                  <svg
                    viewBox="0 0 400 470"
                    className="w-full h-full drop-shadow-[0_0_25px_rgba(255,154,60,0.2)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="sovereignIndiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#25160d" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#1a110a" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#120c08" stopOpacity="0.95" />
                      </linearGradient>
                      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Official Sovereign India Map Outline (Strictly including complete J&K, Ladakh, Arunachal Pradesh & Peninsular contours) */}
                    <path
                      d="M138 20 C146 12, 160 8, 175 14 C186 18, 196 30, 202 44 C205 58, 192 70, 190 80 C187 90, 176 94, 166 100 C156 106, 142 104, 132 112 C122 120, 107 127, 97 142 C87 157, 77 172, 80 192 C82 207, 97 217, 110 222 C117 226, 127 222, 140 230 C152 238, 157 250, 160 267 C164 287, 170 312, 182 337 C192 357, 204 387, 217 412 C220 420, 217 427, 212 430 C207 424, 197 392, 187 367 C177 342, 164 307, 152 287 C142 270, 122 252, 107 247 C92 242, 70 237, 62 217 C54 197, 57 177, 64 162 C72 147, 87 137, 92 122 C97 107, 107 87, 117 67 C127 47, 130 28, 138 20 Z
                         M175 97 C190 94, 215 97, 240 107 C265 117, 290 127, 310 137 C330 147, 355 150, 375 144 C385 142, 392 150, 388 160 C382 172, 365 180, 350 184 C330 188, 315 192, 305 202 C295 212, 280 220, 265 217 C250 214, 235 207, 220 204 C205 200, 190 197, 175 200"
                      fill="url(#sovereignIndiaGrad)"
                      stroke="#ff9a3c"
                      strokeWidth="2.2"
                      filter="url(#neonGlow)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Andaman & Nicobar Islands (Official Sovereign Territory) */}
                    <g opacity="0.8">
                      <circle cx="340" cy="380" r="2" fill="#ff9a3c" />
                      <circle cx="343" cy="390" r="2.2" fill="#ff9a3c" />
                      <circle cx="345" cy="402" r="2.5" fill="#ff9a3c" />
                      <circle cx="348" cy="415" r="2" fill="#ff9a3c" />
                      <text x="355" y="405" fill="#a3a3a3" fontSize="7" fontFamily="monospace">Andaman & Nicobar</text>
                    </g>

                    {/* Lakshadweep Islands */}
                    <g opacity="0.8">
                      <circle cx="120" cy="370" r="1.8" fill="#38bdf8" />
                      <circle cx="122" cy="380" r="1.8" fill="#38bdf8" />
                      <circle cx="124" cy="390" r="1.8" fill="#38bdf8" />
                      <text x="75" y="385" fill="#a3a3a3" fontSize="7" fontFamily="monospace">Lakshadweep</text>
                    </g>

                    {/* Cyber Latitude / Longitude Telemetry Grid */}
                    <line x1="30" y1="140" x2="370" y2="140" stroke="#ff9a3c" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.25" />
                    <line x1="30" y1="250" x2="370" y2="250" stroke="#ff9a3c" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.25" />
                    <line x1="30" y1="360" x2="370" y2="360" stroke="#ff9a3c" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.25" />
                    <line x1="160" y1="20" x2="160" y2="440" stroke="#ff9a3c" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.25" />
                    <line x1="270" y1="90" x2="270" y2="440" stroke="#ff9a3c" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.25" />

                    {/* Glowing Vector Telemetry Paths Connecting Sajal's Nodes */}
                    <line x1="156" y1="140" x2="150" y2="160" stroke="#ff9a3c" strokeWidth="1.8" strokeDasharray="3 3" className="animate-pulse" />
                    <line x1="150" y1="160" x2="179" y2="168" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" className="animate-pulse" />
                  </svg>

                  {/* Dynamic Nodes Markers */}
                  {NODES.map((node) => {
                    const isSelected = activeNode.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => selectNode(node)}
                        style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer z-30"
                        title={`${node.name} (${node.coords})`}
                      >
                        <span className="relative flex h-8 w-8 items-center justify-center">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                            style={{ backgroundColor: node.color }}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-3.5 w-3.5 transition-all duration-300 ${
                              isSelected ? 'scale-125 ring-2 ring-white shadow-[0_0_15px_#ff9a3c]' : 'opacity-80 group-hover:scale-110'
                            }`}
                            style={{ backgroundColor: node.color }}
                          />
                        </span>
                        
                        {/* Hover/Active Label */}
                        <div
                          className={`absolute left-1/2 -bottom-7 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all duration-200 border ${
                            isSelected
                              ? 'bg-black/90 text-white border-[#ff9a3c] shadow-lg scale-105'
                              : 'bg-black/70 text-neutral-400 border-white/10 group-hover:text-white'
                          }`}
                        >
                          {node.name.split(' ')[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Node Switcher Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10">
                  {NODES.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => selectNode(n)}
                      className={`text-[11px] font-mono py-2 px-2 rounded-lg border transition-all text-center flex flex-col items-center gap-1 ${
                        activeNode.id === n.id
                          ? 'bg-[#ff9a3c]/15 border-[#ff9a3c] text-white shadow-[0_0_15px_rgba(255,154,60,0.25)]'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold">{n.name.split('/')[0].trim()}</span>
                      <span className="text-[9px] text-neutral-500 uppercase">{n.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </MotionCard3D>
          </div>

          {/* Active Node Live Telemetry Console */}
          <div className="lg:col-span-5 space-y-4">
            <MotionCard3D maxTilt={5} depth={15} className="w-full">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#120c08] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
                
                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#ff9a3c]" />
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      ACTIVE SPATIAL TELEMETRY
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase font-bold"
                    style={{
                      backgroundColor: `${activeNode.color}15`,
                      borderColor: `${activeNode.color}40`,
                      color: activeNode.color,
                    }}
                  >
                    {activeNode.badge}
                  </span>
                </div>

                {/* Node Title & Role */}
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    {activeNode.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#ff9a3c] mt-1">{activeNode.role}</p>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{activeNode.region}</p>
                </div>

                {/* GPS Coordinates & Description */}
                <div className="p-3.5 rounded-lg bg-black/60 border border-white/5 font-mono text-xs flex items-center justify-between">
                  <span className="text-neutral-500">EXACT GPS:</span>
                  <span className="text-white font-bold tracking-wider">{activeNode.coords}</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {activeNode.description}
                </p>

                {/* Key Metrics Bullet Points */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase block tracking-wider">
                    OPERATIONAL & ACADEMIC METRICS:
                  </span>
                  {activeNode.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] mt-1.5 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>

                {/* Urban Company Live Metric Callout if on Delhi node */}
                {activeNode.id === 'delhi' && (
                  <div className="p-3 rounded-lg bg-[#ff9a3c]/10 border border-[#ff9a3c]/30 flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-300">SLA RT Threshold:</span>
                    <span className="font-bold text-[#10b981] bg-black/50 px-2 py-0.5 rounded border border-[#10b981]/30">
                      &gt; 80% Compliance
                    </span>
                  </div>
                )}
              </div>
            </MotionCard3D>
          </div>

        </div>
      </div>
    </section>
  );
};
