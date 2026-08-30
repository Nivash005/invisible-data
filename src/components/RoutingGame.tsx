import React, { useState } from 'react';
import { Gamepad2, Award, ArrowRight, RefreshCw } from 'lucide-react';
import { playSound } from '../lib/sound';

interface RouteChoice {
  id: 'A' | 'B' | 'C';
  name: string;
  hops: string[];
  distanceKm: number;
  simulatedLatencyMs: number;
  congestion: 'LOW' | 'MEDIUM' | 'HIGH';
  isOptimal: boolean;
  score: number;
  explanation: string;
}

const ROUTE_CHOICES: RouteChoice[] = [
  {
    id: 'A',
    name: 'Trans-Arabian Mediterranean Cable (SMW-5)',
    hops: ['Chennai', 'Mumbai', 'Dubai', 'Frankfurt', 'London'],
    distanceKm: 8740,
    simulatedLatencyMs: 51,
    congestion: 'LOW',
    isOptimal: true,
    score: 100,
    explanation: 'OPTIMAL ROUTE! The shortest physical fiber distance utilizing high-capacity optical amplifiers through the Suez-Mediterranean corridor with direct Tier-1 peering at DE-CIX Frankfurt.'
  },
  {
    id: 'B',
    name: 'Trans-Pacific Ring Detour (FASTER / Unity)',
    hops: ['Chennai', 'Singapore', 'Tokyo', 'San Francisco', 'New York', 'London'],
    distanceKm: 24800,
    simulatedLatencyMs: 148,
    congestion: 'HIGH',
    isOptimal: false,
    score: 42,
    explanation: 'SUB-OPTIMAL! Transiting both the Pacific and Atlantic Oceans adds over 16,000 extra kilometers of glass fiber, multiplying speed-of-light propagation latency nearly threefold.'
  },
  {
    id: 'C',
    name: 'Indian Ocean Direct Transit (BBG / EIG)',
    hops: ['Chennai', 'Singapore', 'Dubai', 'London'],
    distanceKm: 11200,
    simulatedLatencyMs: 82,
    congestion: 'MEDIUM',
    isOptimal: false,
    score: 78,
    explanation: 'VIABLE BUT SLOWER. Bypassing Frankfurt reduces intermediate switch hops, but routing through Southeast Asia before swinging west creates a geographic detour.'
  }
];

export const RoutingGame: React.FC = () => {
  const [selectedChoice, setSelectedChoice] = useState<RouteChoice | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (choice: RouteChoice) => {
    playSound.click();
    setSelectedChoice(choice);
    setHasSubmitted(true);
    if (choice.isOptimal) {
      playSound.aiChime();
    } else {
      playSound.failWarning();
    }
  };

  const handleReset = () => {
    playSound.click();
    setSelectedChoice(null);
    setHasSubmitted(false);
  };

  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-amber-500/25 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      {/* Glow Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>INTERACTIVE BGP CHALLENGE</span>
          </div>
          <h3 className="text-2xl font-display font-black text-slate-100">
            Can You Beat The Autonomous Router?
          </h3>
          <p className="text-slate-400 font-mono text-xs mt-1">
            Goal: Route packet from <span className="text-cyan-300">Chennai Gateway</span> to <span className="text-emerald-300">London LINX</span> with minimal latency.
          </p>
        </div>

        {hasSubmitted && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>
        )}
      </div>

      {/* Three Path Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {ROUTE_CHOICES.map((choice) => {
          const isSelected = selectedChoice?.id === choice.id;

          return (
            <div
              key={choice.id}
              onClick={() => !hasSubmitted && handleSelect(choice)}
              className={`p-5 rounded-2xl border font-mono transition-all duration-300 relative ${
                !hasSubmitted ? 'cursor-pointer hover:border-amber-400/60 hover:bg-slate-900' : ''
              } ${
                isSelected
                  ? choice.isOptimal
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : 'bg-rose-950/40 border-rose-500/70 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                  : hasSubmitted && choice.isOptimal
                  ? 'bg-slate-900/60 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-300">
                  PATH {choice.id}
                </span>
                <span className="text-[11px] text-slate-400">
                  {choice.distanceKm.toLocaleString()} km
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-200 mb-3 leading-snug">
                {choice.name}
              </h4>

              {/* Hop Chain */}
              <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 mb-4">
                <div className="text-[9px] uppercase text-slate-500 font-bold">Vector Hops:</div>
                <div className="flex items-center gap-1 flex-wrap text-cyan-300">
                  {choice.hops.map((hop, idx) => (
                    <React.Fragment key={hop}>
                      <span>{hop}</span>
                      {idx < choice.hops.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 inline" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Congestion:</span>
                <span
                  className={`font-bold ${
                    choice.congestion === 'LOW'
                      ? 'text-emerald-400'
                      : choice.congestion === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {choice.congestion}
                </span>
              </div>

              {!hasSubmitted && (
                <button
                  onClick={() => handleSelect(choice)}
                  className="w-full mt-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  SELECT THIS PATH
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Result Breakdown Card */}
      {selectedChoice && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 font-mono animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedChoice.isOptimal
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">ROUTING SCORE:</span>
                <h4 className="text-2xl font-bold text-slate-100">
                  {selectedChoice.score} / 100
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">YOUR SELECTION:</span>
                <span className="text-amber-300 font-bold text-sm">
                  {selectedChoice.simulatedLatencyMs} ms
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">OPTIMAL ROUTE:</span>
                <span className="text-emerald-300 font-bold text-sm">51 ms</span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm mt-4 leading-relaxed">
            {selectedChoice.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
