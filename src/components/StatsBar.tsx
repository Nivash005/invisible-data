import React from 'react';
import { Gauge, Zap, Package, MapPin, Share2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { NetworkStats } from '../types/network';

interface StatsBarProps {
  stats: NetworkStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 lg:p-5 shadow-2xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">
            LIVE TELEMETRY STREAM
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          SIMULATED VALUES // DETERMINISTIC ENGINE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Latency */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Sim Latency</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-cyan-300">
              {stats.latency}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Speed of light in fiber</p>
        </div>

        {/* Speed */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Throughput</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-300">
              {stats.speed}
            </span>
            <span className="text-xs font-mono text-slate-400">Mbps</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Bandwidth link capacity</p>
        </div>

        {/* Total Packets */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Packets Stream</span>
            <Package className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-300">
              {stats.packetsSent}
            </span>
            <span className="text-xs font-mono text-slate-400">sent</span>
          </div>
          <p className="text-[10px] text-emerald-400/80 font-mono mt-1">
            {stats.packetsDelivered} delivered / {stats.packetsDropped} dropped
          </p>
        </div>

        {/* Distance */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Fiber Route</span>
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-purple-300">
              {stats.distanceKm.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">km</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Great-circle subsea cable</p>
        </div>

        {/* Active Hops */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Total Hops</span>
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-blue-300">
              {stats.nodesCount}
            </span>
            <span className="text-xs font-mono text-slate-400">relays</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Tier-1 peering points</p>
        </div>

        {/* Packet Loss */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase">Packet Loss</span>
            {stats.packetLossRate > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-bold font-mono ${
                stats.packetLossRate > 0 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {stats.packetLossRate}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            {stats.packetLossRate > 0 ? 'TCP SACK retransmitting' : 'Optimal TCP integrity'}
          </p>
        </div>
      </div>
    </div>
  );
};
