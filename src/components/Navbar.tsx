import React, { useState } from 'react';
import { Volume2, VolumeX, Activity, Radio, Compass, BookOpen, Sparkles, Terminal, Gamepad2 } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeDomain: string;
  onTraceDomain: (domain: string) => void;
  onOpenZoomModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeDomain,
  onTraceDomain,
  onOpenZoomModal
}) => {
  const { soundEnabled, toggleSound } = useSound();
  const [inputVal, setInputVal] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onTraceDomain(inputVal.trim());
      setInputVal('');
      onNavigate('simulation-section');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('hero-section')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center overflow-hidden group-hover:border-cyan-300 transition-colors">
            <div className="absolute inset-0 bg-cyan-400/20 animate-pulse-subtle" />
            <Activity className="w-4 h-4 text-cyan-400 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-wider text-slate-100 text-lg group-hover:text-cyan-300 transition-colors">
                INVISIBLE <span className="text-cyan-400 font-mono">//</span> DATA
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2 Scroll
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden md:block">
              "See what happens after you click."
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => onNavigate('story-section')}
            className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Story Chapters
          </button>
          <button
            onClick={() => onNavigate('simulation-section')}
            className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            Trace Simulation
          </button>
          <button
            onClick={() => onNavigate('inspector-section')}
            className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Packets
          </button>
          <button
            onClick={() => onNavigate('game-section')}
            className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors flex items-center gap-1.5"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            Routing Game
          </button>
          <button
            onClick={() => onNavigate('learning-section')}
            className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Infrastructure
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Domain Form */}
          <form onSubmit={handleQuickSubmit} className="hidden sm:flex items-center relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={activeDomain}
              className="bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-36 lg:w-44 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40"
            >
              Go
            </button>
          </form>

          {/* Zoom into the Invisible Button */}
          <button
            onClick={onOpenZoomModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs font-mono text-purple-200 hover:border-purple-400 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ZOOM IN</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Live Status Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">LIVE SIMULATION</span>
            <span className="sm:hidden">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
