import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MousePointerClick, Search, Package, Map, Cable, Server, ArrowDown, Sparkles } from 'lucide-react';

interface ScrollStoryProps {
  onExploreSimulation: () => void;
}

export const ScrollStory: React.FC<ScrollStoryProps> = ({ onExploreSimulation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Chapter 1: The Click (0.0 to 0.2)
  const clickScale = useTransform(smoothProgress, [0.02, 0.12], [0.6, 2.2]);
  const clickOpacity = useTransform(smoothProgress, [0.02, 0.08, 0.16, 0.22], [0, 1, 1, 0]);

  // Chapter 2: DNS Transformation (0.16 to 0.38)
  const dnsDomainOpacity = useTransform(smoothProgress, [0.2, 0.28, 0.32], [1, 0.2, 0]);
  const dnsIpOpacity = useTransform(smoothProgress, [0.26, 0.32, 0.38], [0, 0.8, 1]);
  const dnsScale = useTransform(smoothProgress, [0.18, 0.3, 0.38], [0.8, 1.1, 0.9]);

  // Chapter 3: Packetization Blob Split (0.34 to 0.54)
  const blobSplit = useTransform(smoothProgress, [0.36, 0.48], [0, 45]);
  const packetRotation = useTransform(smoothProgress, [0.36, 0.52], [0, 360]);

  // Chapter 4: Routing Path Draw (0.50 to 0.70)
  const pathDrawLength = useTransform(smoothProgress, [0.52, 0.68], [0, 1]);

  // Chapter 5: Transmission Along Cable (0.66 to 0.86)
  const packetFlyX = useTransform(smoothProgress, [0.68, 0.84], [-120, 120]);

  // Chapter 6: Response Arrival (0.82 to 1.0)
  const responsePulse = useTransform(smoothProgress, [0.84, 0.96], [0.8, 1.3]);

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950 text-slate-100">
      {/* Sticky Progress Sidebar Indicator */}
      <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40 space-y-4">
        {[
          { num: '01', title: 'The Click' },
          { num: '02', title: 'DNS Resolve' },
          { num: '03', title: 'Packetization' },
          { num: '04', title: 'Routing' },
          { num: '05', title: 'Transmission' },
          { num: '06', title: 'Response' }
        ].map((item, i) => {
          const stepStart = i * 0.16;
          const stepEnd = (i + 1) * 0.16;
          return (
            <div key={item.num} className="flex items-center gap-3 font-mono text-xs">
              <motion.div
                style={{
                  scale: useTransform(smoothProgress, [stepStart, (stepStart + stepEnd) / 2, stepEnd], [0.8, 1.4, 0.8]),
                  borderColor: useTransform(
                    smoothProgress,
                    [stepStart, (stepStart + stepEnd) / 2, stepEnd],
                    ['rgba(71, 85, 105, 0.4)', 'rgba(0, 240, 255, 1)', 'rgba(71, 85, 105, 0.4)']
                  )
                }}
                className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-cyan-300 bg-slate-900"
              >
                {item.num}
              </motion.div>
              <span className="text-slate-400 hidden xl:inline">{item.title}</span>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          CHAPTER 01 — THE CLICK
      ======================================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative sticky top-0 overflow-hidden border-b border-cyan-500/10">
        <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>CHAPTER 01 // ORIGIN</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100">
            Your Click Created <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
              A Global Journey.
            </span>
          </h2>

          <p className="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            The instant your finger presses the mouse or screen, your operating system triggers an asynchronous kernel socket call. A cascade of invisible light begins.
          </p>

          {/* Interactive Visual Element: Click Pulse */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center mt-6">
            <motion.div
              style={{ scale: clickScale, opacity: clickOpacity }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400 bg-cyan-500/10 blur-sm"
            />
            <motion.div
              style={{ scale: useTransform(clickScale, (s) => s * 0.7), opacity: clickOpacity }}
              className="absolute inset-4 rounded-full border border-purple-400 bg-purple-500/20"
            />
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.6)] z-10">
              <MousePointerClick className="w-8 h-8 text-cyan-300 animate-bounce" />
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1">
            <span>Scroll down to initiate DNS resolution</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 02 — DNS RESOLUTION
      ======================================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative sticky top-0 bg-slate-950/95 overflow-hidden border-b border-purple-500/10">
        <div className="max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>CHAPTER 02 // NAME RESOLUTION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100">
            The Domain Becomes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              A Global Coordinates Vector.
            </span>
          </h2>

          <p className="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Routers don't understand letters like "youtube.com". In under 14 milliseconds, hierarchical DNS servers translate human text into a routable 32-bit IP address.
          </p>

          {/* Morphing Domain -> IP Box */}
          <motion.div
            style={{ scale: dnsScale }}
            className="w-80 sm:w-96 mx-auto p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl relative overflow-hidden"
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">
              DNS TRANSLATION MATRIX (ROOT → TLD → EDGE)
            </div>

            <div className="h-16 relative flex items-center justify-center font-mono font-bold text-xl sm:text-2xl">
              <motion.div
                style={{ opacity: dnsDomainOpacity }}
                className="absolute text-cyan-300 glow-cyan flex items-center gap-2"
              >
                <span>youtube.com</span>
              </motion.div>

              <motion.div
                style={{ opacity: dnsIpOpacity }}
                className="absolute text-purple-300 glow-purple flex items-center gap-2"
              >
                <span>142.250.190.46</span>
              </motion.div>
            </div>

            <div className="text-xs font-mono text-slate-400 pt-3 border-t border-slate-800 flex justify-between">
              <span>QUERY TYPE: A (IPv4)</span>
              <span className="text-emerald-400">TTL: 300s</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 03 — PACKETIZATION
      ======================================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative sticky top-0 bg-slate-950/95 overflow-hidden border-b border-emerald-500/10">
        <div className="max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
            <Package className="w-3.5 h-3.5" />
            <span>CHAPTER 03 // DISSECTION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100">
            Your Data Is Broken <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Into Millions of Packets.
            </span>
          </h2>

          <p className="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Networks cannot send whole files at once. Your request is segmented into standard Maximum Transmission Units (1,500 byte MTUs) labeled with sequence numbers.
          </p>

          {/* Animated Scatter Packets */}
          <div className="relative w-80 sm:w-96 h-40 mx-auto flex items-center justify-center">
            {/* Packet 1 */}
            <motion.div
              style={{ x: useTransform(blobSplit, (v) => -v * 1.5), rotate: packetRotation }}
              className="absolute w-20 h-20 rounded-xl bg-cyan-950/80 border border-cyan-400 p-2 text-left font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <div className="text-[8px] text-slate-400">PKT #001</div>
              <div className="text-[10px] text-cyan-300 font-bold mt-1">TCP SYN</div>
              <div className="text-[8px] text-emerald-400 mt-2">Seq=0</div>
            </motion.div>

            {/* Packet 2 */}
            <motion.div
              style={{ y: useTransform(blobSplit, (v) => -v * 0.8), rotate: packetRotation }}
              className="absolute w-20 h-20 rounded-xl bg-purple-950/80 border border-purple-400 p-2 text-left font-mono shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <div className="text-[8px] text-slate-400">PKT #002</div>
              <div className="text-[10px] text-purple-300 font-bold mt-1">TLS Client</div>
              <div className="text-[8px] text-purple-400 mt-2">1.4 KB</div>
            </motion.div>

            {/* Packet 3 */}
            <motion.div
              style={{ x: useTransform(blobSplit, (v) => v * 1.5), rotate: packetRotation }}
              className="absolute w-20 h-20 rounded-xl bg-emerald-950/80 border border-emerald-400 p-2 text-left font-mono shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            >
              <div className="text-[8px] text-slate-400">PKT #003</div>
              <div className="text-[10px] text-emerald-300 font-bold mt-1">GET /</div>
              <div className="text-[8px] text-amber-400 mt-2">CRC: 0xA9F</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 04 — ROUTING
      ======================================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative sticky top-0 bg-slate-950/95 overflow-hidden border-b border-cyan-500/10">
        <div className="max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Map className="w-3.5 h-3.5" />
            <span>CHAPTER 04 // PATHFINDING</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100">
            Routers Choose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              The Optimal Global Path.
            </span>
          </h2>

          <p className="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            At every exchange point, Border Gateway Protocol (BGP) inspects autonomous systems to route packets across the lowest congestion fiber links.
          </p>

          {/* SVG Animated Route Draw */}
          <div className="w-full max-w-lg mx-auto bg-slate-900/90 border border-cyan-500/30 p-6 rounded-2xl">
            <svg viewBox="0 0 400 120" className="w-full h-auto">
              {/* Background Path */}
              <path
                d="M 40 60 Q 120 20 200 60 T 360 60"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
              />
              {/* Animated Foreground Path */}
              <motion.path
                d="M 40 60 Q 120 20 200 60 T 360 60"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                style={{ pathLength: pathDrawLength }}
              />
              {/* Nodes */}
              <circle cx="40" cy="60" r="8" fill="#00f0ff" />
              <text x="40" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Chennai</text>

              <circle cx="200" cy="60" r="8" fill="#a855f7" />
              <text x="200" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Dubai</text>

              <circle cx="360" cy="60" r="8" fill="#34d399" />
              <text x="360" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Frankfurt</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 05 — TRANSMISSION
      ======================================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative sticky top-0 bg-slate-950/95 overflow-hidden border-b border-purple-500/10">
        <div className="max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs">
            <Cable className="w-3.5 h-3.5" />
            <span>CHAPTER 05 // LIGHT PROPAGATION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100">
            Packets Travel The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Deep Sea Invisible Network.
            </span>
          </h2>

          <p className="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Over 95% of international internet traffic travels through fiber-optic cables resting on ocean floors, pulsed as lasers bouncing through glass threads thinner than human hair.
          </p>

          {/* Subsea Cable Cross Section Animation */}
          <div className="relative w-full max-w-lg mx-auto h-28 bg-slate-900/90 border border-purple-500/30 rounded-2xl flex items-center justify-center overflow-hidden px-8">
            <div className="w-full h-3 bg-slate-800 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/40 to-cyan-500/20" />
            </div>

            <motion.div
              style={{ x: packetFlyX }}
              className="absolute w-12 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_25px_rgba(0,240,255,0.9)] flex items-center justify-center text-[9px] font-mono font-bold text-slate-950"
            >
              200,000 km/s
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 06 — RESPONSE
      ======================================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative sticky top-0 bg-slate-950/95 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
            <Server className="w-3.5 h-3.5" />
            <span>CHAPTER 06 // CONVERGENCE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-100">
            The Destination Answers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              And The Loop Completes.
            </span>
          </h2>

          <p className="text-slate-400 font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            The destination web server reassembles TCP packets, generates HTTP 200 HTML payloads, and sends back the answer — all in under 60 milliseconds.
          </p>

          <motion.div
            style={{ scale: responsePulse }}
            className="w-24 h-24 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(52,211,153,0.5)]"
          >
            <Server className="w-12 h-12 text-emerald-300 animate-pulse" />
          </motion.div>

          <div className="pt-6">
            <button
              onClick={onExploreSimulation}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>LAUNCH LIVE SIMULATION LAB →</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
