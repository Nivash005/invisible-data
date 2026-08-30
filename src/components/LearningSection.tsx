import React, { useState } from 'react';
import { MousePointerClick, Search, Package, Network, Radio, Server, CheckCircle2, ChevronRight } from 'lucide-react';
import { playSound } from '../lib/sound';

const STEPS = [
  {
    number: '01',
    title: 'YOU CLICK',
    subtitle: 'Device Request Creation',
    icon: MousePointerClick,
    color: 'cyan',
    summary: 'Your browser captures user intent and creates an HTTP/3 or HTTPS GET request in memory.',
    technicalDetails: [
      'OS Kernel allocates a dynamic ephemeral source port (e.g. 54219)',
      'TLS 1.3 cryptographic parameters are initialized with Elliptic Curve Diffie-Hellman (ECDHE)',
      'TCP/UDP socket buffer is populated with HTTP request headers'
    ],
    funFact: 'A single modern webpage click can trigger up to 120 asynchronous secondary requests for images, scripts, and stylesheets.'
  },
  {
    number: '02',
    title: 'DNS LOOKUP',
    subtitle: 'Domain to IP Resolution',
    icon: Search,
    color: 'purple',
    summary: 'The human-readable domain is queried against Root, TLD (.com/.org), and Authoritative nameservers.',
    technicalDetails: [
      'Local resolver checks browser cache → OS cache → Router cache',
      'Recursive query dispatched via UDP Port 53 to Anycast DNS (e.g. 1.1.1.1 or 8.8.8.8)',
      'Returns A (IPv4) or AAAA (IPv6) records in ~12-25 ms'
    ],
    funFact: 'There are only 13 logical root server IP addresses in the world, backed by over 1,500 physical server nodes worldwide.'
  },
  {
    number: '03',
    title: 'PACKETIZATION',
    subtitle: 'MTU Segmentation & Headers',
    icon: Package,
    color: 'emerald',
    summary: 'Data is broken down into standard Maximum Transmission Units (1,500 bytes per frame).',
    technicalDetails: [
      'Each segment is stamped with 20-byte IPv4 / 40-byte IPv6 headers',
      'TCP flags set initial SYN / ACK synchronizations and window size scaling',
      '32-bit CRC Checksums attached to Ethernet trailer to guard against optical noise'
    ],
    funFact: 'Streaming a 4K movie breaks the video stream into roughly 10 million distinct network packets traveling independently.'
  },
  {
    number: '04',
    title: 'ROUTING',
    subtitle: 'BGP & Dynamic Path Selection',
    icon: Network,
    color: 'amber',
    summary: 'Tier-1 Internet Service Providers use Border Gateway Protocol to forward packets hop by hop.',
    technicalDetails: [
      'Core routers evaluate Autonomous System (AS) shortest paths and peering agreements',
      'Optical switch transceivers modulate laser wavelengths using Dense Wavelength Division Multiplexing (DWDM)',
      'Time-To-Live (TTL) decrements by 1 at every hop to prevent endless routing loops'
    ],
    funFact: 'Global internet routing relies on over 90,000 active Autonomous Systems cooperating without a central authority.'
  },
  {
    number: '05',
    title: 'TRANSMISSION',
    subtitle: 'Oceanic Subsea Glass Cables',
    icon: Radio,
    color: 'blue',
    summary: 'Laser pulses travel at ~200,000 km/s through undersea glass fiber cables spanning continents.',
    technicalDetails: [
      'Subsea repeaters with Erbium-Doped Fiber Amplifiers (EDFA) boost laser signals every 70 km',
      'Armored steel wire and tar coating protect underwater cables from shark bites and ship anchors',
      'Single fiber pair can carry over 24 Terabits per second across the Atlantic ocean'
    ],
    funFact: 'Over 1.4 million kilometers of subsea fiber cables lie at the bottom of the world’s oceans — enough to wrap around the Earth 35 times.'
  },
  {
    number: '06',
    title: 'RESPONSE',
    subtitle: 'Server Reassembly & Render',
    icon: Server,
    color: 'rose',
    summary: 'The target server receives packets, validates checksums, renders content, and returns response packets.',
    technicalDetails: [
      'TCP sliding window protocol acknowledges received packets and reorders any out-of-order frames',
      'Web server engine executes reverse-proxy logic and generates HTTP 200 payload',
      'Return packets trace optimal return path back to your device screen'
    ],
    funFact: 'The entire round trip from click to full render typically completes in less time than the human eye takes to blink (100–150 ms).'
  }
];

export const LearningSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 lg:p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>EDUCATIONAL ARCHITECTURE // 6 PHASES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-100">
          How The Invisible Journey Works
        </h2>
        <p className="text-slate-400 font-mono text-xs sm:text-sm mt-2">
          From mouse click to server response: step-by-step breakdown of global packet mechanics.
        </p>
      </div>

      {/* Step Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {STEPS.map((step, idx) => {
          const isSelected = activeStepIndex === idx;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              onClick={() => {
                playSound.click();
                setActiveStepIndex(idx);
              }}
              className={`p-3 rounded-xl border font-mono text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400">PHASE {step.number}</span>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />
              </div>
              <div className="font-bold text-xs truncate">{step.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 font-mono">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <activeStep.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                PHASE {activeStep.number} // {activeStep.subtitle}
              </span>
              <h3 className="text-xl font-display font-bold text-slate-100 mt-0.5">
                {activeStep.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound.click();
                setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1));
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
            >
              ← Prev Phase
            </button>
            <button
              onClick={() => {
                playSound.click();
                setActiveStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : 0));
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-mono text-cyan-300 border border-cyan-500/30"
            >
              Next Phase →
            </button>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
          {activeStep.summary}
        </p>

        {/* Technical Specs List */}
        <div className="mt-6 space-y-2">
          <div className="text-xs uppercase text-slate-400 font-bold">
            Technical Execution Pipeline:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeStep.technicalDetails.map((detail, i) => (
              <div
                key={i}
                className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2"
              >
                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact Callout */}
        <div className="mt-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
          <span className="px-2 py-0.5 rounded bg-purple-500/30 text-[10px] font-bold shrink-0">
            NETWORK FACT
          </span>
          <p className="leading-relaxed">{activeStep.funFact}</p>
        </div>
      </div>
    </div>
  );
};
