import React from 'react';
import { Activity, ArrowUp } from 'lucide-react';
import { playSound } from '../lib/sound';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    playSound.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-cyan-500/20 pt-16 pb-12 px-4 sm:px-8 relative overflow-hidden font-mono">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="font-display font-black text-xl text-slate-100 tracking-wider">
                INVISIBLE <span className="text-cyan-400 font-mono">//</span> DATA
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              "See what happens after you click." An interactive creative technology experience demonstrating how packets, fiber cables, BGP routing, and DNS turn human clicks into global transmission.
            </p>
            <div className="text-[11px] text-cyan-400/80 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/40 max-w-md">
              ⚡ Built for the Creative AI-Generation Challenge: Making the Invisible Visible.
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('hero-section')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Landing Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story-section')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Scrollytelling Chapters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulation-section')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  3D Global Simulation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('inspector-section')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Packet Inspector
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('game-section')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Routing Mini-Game
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300">
              {['React 18', 'Vite', 'TypeScript', 'Tailwind CSS', 'Three.js 3D', 'Framer Motion', 'Web Audio API', 'NEXUS AI'].map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="max-w-2xl text-center md:text-left text-[11px] leading-relaxed">
            <p>
              <span className="font-bold text-slate-400">DISCLAIMER:</span> Network routes and metrics shown in simulation mode are illustrative for educational purposes and may not represent exact physical fiber paths or real-time BGP telemetry of individual users.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors shrink-0"
          >
            <span>Return To Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
