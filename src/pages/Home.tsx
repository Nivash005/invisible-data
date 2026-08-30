import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe as GlobeIcon,
  Radio,
  Sparkles,
  ArrowRight,
  Compass,
  ArrowDown
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { StatsBar } from '../components/StatsBar';
import { Globe } from '../components/Globe';
import { RoutePanel } from '../components/RoutePanel';
import { PacketInspector } from '../components/PacketInspector';
import { NetworkControls } from '../components/NetworkControls';
import { NexusAI } from '../components/NexusAI';
import { TrafficChart } from '../components/TrafficChart';
import { ScrollStory } from '../components/ScrollStory';
import { LearningSection } from '../components/LearningSection';
import { RoutingGame } from '../components/RoutingGame';
import { InsideInternetModal } from '../components/InsideInternetModal';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';

import { useNetworkSimulation } from '../hooks/useNetworkSimulation';
import { useAI } from '../hooks/useAI';
import { playSound } from '../lib/sound';
import { DOMAIN_PRESETS } from '../lib/networkData';

export const Home: React.FC = () => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [domainInput, setDomainInput] = useState('');

  // Main Simulation Hook
  const {
    activeDomain,
    activePreset,
    currentRouteIds,
    currentRouteNodes,
    packets,
    stats,
    failedNodeIds,
    controlState,
    selectedPacket,
    selectedNode,
    setSelectedPacket,
    setSelectedNode,
    traceDomain,
    failNode,
    restoreNode,
    restoreAllNodes,
    slowNetwork,
    triggerPacketLoss,
    setLatencyMultiplier,
    setPacketLossPercent,
    setTrafficVolume
  } = useNetworkSimulation('youtube.com');

  // AI Assistant Hook
  const { messages, isThinking, ask, clearChat } = useAI(
    activeDomain,
    'Chennai',
    activePreset.name,
    currentRouteNodes.map((n) => n.city),
    stats.latency,
    stats.packetLossRate,
    failedNodeIds,
    controlState.trafficVolume
  );

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domainInput.trim()) {
      traceDomain(domainInput.trim());
      setDomainInput('');
      scrollToSection('simulation-section');
    }
  };

  const handlePresetClick = (domain: string) => {
    playSound.click();
    traceDomain(domain);
    scrollToSection('simulation-section');
  };

  const scrollToSection = (id: string) => {
    playSound.click();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fixed Top Navbar */}
      <Navbar
        onNavigate={scrollToSection}
        activeDomain={activeDomain}
        onTraceDomain={traceDomain}
        onOpenZoomModal={() => {
          playSound.click();
          setIsZoomModalOpen(true);
        }}
      />

      {/* ========================================================
          SCREEN 1 — CINEMATIC HERO LANDING
      ======================================================== */}
      <section
        id="hero-section"
        className="min-h-screen flex flex-col items-center justify-center relative pt-20 px-4 overflow-hidden"
      >
        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center z-10 space-y-8 py-12">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MAKING THE INVISIBLE VISIBLE // GLOBAL DATA TRACER</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight text-slate-100">
              INVISIBLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono">//</span> DATA
            </h1>
            <p className="text-xl sm:text-2xl font-mono text-cyan-300 tracking-wide glow-cyan">
              "See what happens after you click."
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Every click creates a journey. Watch your data move through the invisible infrastructure that connects the world — from browser syscalls to oceanic optical fibers.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => scrollToSection('simulation-section')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>EXPLORE THE NETWORK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('story-section')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700 font-mono text-sm tracking-wider uppercase transition-all hover:border-cyan-500/50 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>HOW IT WORKS</span>
            </button>
          </motion.div>

          {/* Quick Trace Domain Input in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="max-w-xl mx-auto pt-6"
          >
            <form onSubmit={handleDomainSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-slate-500">
                <GlobeIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Where do you want your data to go? (e.g. youtube.com)"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-11 pr-36 py-3.5 text-xs sm:text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-2xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span>TRACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Domain Preset Pills */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500">POPULAR DESTINATIONS:</span>
              {DOMAIN_PRESETS.map((preset) => (
                <button
                  key={preset.domain}
                  onClick={() => handlePresetClick(preset.domain)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    activeDomain === preset.domain
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.domain}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Down Indicator */}
          <div className="pt-8 text-slate-500 font-mono text-xs flex flex-col items-center gap-1">
            <span>Scroll to begin the narrative</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400 mt-1" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SCROLL STORY CHAPTERS (SCROLL-SCRUBBED STORYTELLING)
      ======================================================== */}
      <section id="story-section" className="relative">
        <ScrollStory onExploreSimulation={() => scrollToSection('simulation-section')} />
      </section>

      {/* ========================================================
          MAIN EXPERIENCE — TRACE YOUR DATA (PINNED SIMULATION SECTION)
      ======================================================== */}
      <section
        id="simulation-section"
        className="min-h-screen py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-8"
      >
        {/* Section Header & Domain Controls */}
        <ScrollReveal>
          <div className="bg-slate-950/85 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-2">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>PINNED SIMULATION LAB // INTERACTIVE MESH</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-100">
                  Trace Your Data In Real-Time
                </h2>
                <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
                  Active Endpoint: <span className="text-cyan-300 font-bold">{activePreset.name}</span> ({activePreset.domain} • {activePreset.ip})
                </p>
              </div>

              {/* Destination Search Form */}
              <form onSubmit={handleDomainSubmit} className="w-full lg:w-auto flex items-center gap-2">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder={`Change destination (${activeDomain})`}
                  className="flex-1 lg:w-72 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
                >
                  TRACE MY DATA →
                </button>
              </form>
            </div>

            {/* Preset Selector Tags */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono text-slate-500 shrink-0">QUICK PRESETS:</span>
              {DOMAIN_PRESETS.map((preset) => (
                <button
                  key={preset.domain}
                  onClick={() => handlePresetClick(preset.domain)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all shrink-0 ${
                    activeDomain === preset.domain
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.domain}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Live Telemetry Stats Bar */}
        <ScrollReveal delay={0.1}>
          <StatsBar stats={stats} />
        </ScrollReveal>

        {/* 3D Globe Visualization + AI Assistant Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <ScrollReveal delay={0.15}>
              <Globe
                currentRouteIds={currentRouteIds}
                failedNodeIds={failedNodeIds}
                packets={packets}
                onSelectNode={(node) => setSelectedNode(node)}
                selectedNode={selectedNode}
              />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4">
            <ScrollReveal delay={0.2}>
              <NexusAI
                messages={messages}
                isThinking={isThinking}
                onAsk={ask}
                onClear={clearChat}
              />
            </ScrollReveal>
          </div>
        </div>

        {/* Route Pipeline Panel */}
        <ScrollReveal delay={0.1}>
          <RoutePanel
            nodes={currentRouteNodes}
            failedNodeIds={failedNodeIds}
            onSelectNode={setSelectedNode}
            selectedNode={selectedNode}
            onToggleFailNode={(id) => {
              if (failedNodeIds.includes(id)) {
                restoreNode(id);
              } else {
                failNode(id);
              }
            }}
          />
        </ScrollReveal>

        {/* Packet Inspector + Live Telemetry Chart */}
        <div id="inspector-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <ScrollReveal delay={0.1} className="h-full">
              <PacketInspector
                packet={selectedPacket}
                allPackets={packets}
                onSelectPacket={setSelectedPacket}
              />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <ScrollReveal delay={0.15} className="h-full">
              <TrafficChart stats={stats} />
            </ScrollReveal>
          </div>
        </div>

        {/* Chaos Network Controls ("WHAT IF?") */}
        <ScrollReveal delay={0.1}>
          <NetworkControls
            latencyMultiplier={controlState.latencyMultiplier}
            packetLossPercent={controlState.packetLossPercent}
            trafficVolume={controlState.trafficVolume}
            failedNodeIds={failedNodeIds}
            onSetLatency={setLatencyMultiplier}
            onSetPacketLoss={setPacketLossPercent}
            onSetTraffic={setTrafficVolume}
            onFailNode={failNode}
            onRestoreNode={restoreNode}
            onRestoreAll={restoreAllNodes}
            onSlowNetwork={slowNetwork}
            onTriggerPacketLoss={triggerPacketLoss}
          />
        </ScrollReveal>

        {/* Routing Mini-Game */}
        <div id="game-section">
          <ScrollReveal delay={0.1}>
            <RoutingGame />
          </ScrollReveal>
        </div>

        {/* 6-Phase Interactive Learning Section */}
        <div id="learning-section">
          <ScrollReveal delay={0.1}>
            <LearningSection />
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          FINAL SECTION — THE INTERNET IS INVISIBLE. UNTIL NOW.
      ======================================================== */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#090e1c] to-slate-950 border-t border-cyan-500/20 py-20">
        <div className="absolute inset-0 bg-radial-gradient from-purple-950/20 via-cyan-950/20 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE CONCLUSION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-100">
            THE INTERNET IS INVISIBLE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
              UNTIL NOW.
            </span>
          </h2>

          <p className="text-slate-300 font-mono text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every search, message, video, and click creates a journey across a network you rarely see. We turned that invisible journey into something you can explore.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                playSound.click();
                scrollToSection('simulation-section');
              }}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105"
            >
              TRACE ANOTHER JOURNEY →
            </button>
            <button
              onClick={() => {
                playSound.click();
                setIsZoomModalOpen(true);
              }}
              className="px-8 py-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 font-mono text-sm tracking-wider uppercase transition-all"
            >
              ZOOM INTO THE INVISIBLE
            </button>
          </div>
        </div>
      </section>

      {/* Cinematic Zoom Modal */}
      <InsideInternetModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        domain={activeDomain}
      />

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
};
