import React, { useState } from 'react';
import { Sliders, AlertOctagon, RefreshCw, Zap, ShieldAlert } from 'lucide-react';
import { GLOBAL_NODES } from '../lib/networkData';
import { playSound } from '../lib/sound';

interface NetworkControlsProps {
  latencyMultiplier: number;
  packetLossPercent: number;
  trafficVolume: 'LOW' | 'NORMAL' | 'HIGH' | 'EXTREME';
  failedNodeIds: string[];
  onSetLatency: (val: number) => void;
  onSetPacketLoss: (val: number) => void;
  onSetTraffic: (val: 'LOW' | 'NORMAL' | 'HIGH' | 'EXTREME') => void;
  onFailNode: (nodeId: string) => void;
  onRestoreNode: (nodeId: string) => void;
  onRestoreAll: () => void;
  onSlowNetwork: () => void;
  onTriggerPacketLoss: () => void;
}

export const NetworkControls: React.FC<NetworkControlsProps> = ({
  latencyMultiplier,
  packetLossPercent,
  trafficVolume,
  failedNodeIds,
  onSetLatency,
  onSetPacketLoss,
  onSetTraffic,
  onFailNode,
  onRestoreNode,
  onRestoreAll,
  onSlowNetwork,
  onTriggerPacketLoss
}) => {
  const [showNodeFailModal, setShowNodeFailModal] = useState(false);

  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5 lg:p-6 shadow-2xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wide">
            WHAT IF? // NETWORK CHAOS LAB
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
          REAL-TIME INTERVENTION
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
        {/* Latency Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Artificial Latency Delay:</span>
            <span className="text-cyan-400 font-bold">+{latencyMultiplier} ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={latencyMultiplier}
            onChange={(e) => onSetLatency(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0 ms (Fiber Speed)</span>
            <span>500 ms (Geostationary Satellite)</span>
          </div>
        </div>

        {/* Packet Loss Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Packet Loss Injection:</span>
            <span
              className={`font-bold ${
                packetLossPercent > 0 ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {packetLossPercent}% loss
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={packetLossPercent}
            onChange={(e) => onSetPacketLoss(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0% (Clean Link)</span>
            <span>30% (Severe Cable Degradation)</span>
          </div>
        </div>

        {/* Traffic Density Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Traffic Congestion:</span>
            <span className="text-purple-400 font-bold">{trafficVolume}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(['LOW', 'NORMAL', 'HIGH', 'EXTREME'] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                  playSound.click();
                  onSetTraffic(level);
                }}
                className={`py-1.5 rounded text-[10px] font-mono font-semibold transition-all border ${
                  trafficVolume === level
                    ? 'bg-purple-500/20 text-purple-200 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Quick Actions */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Fail Node Trigger */}
          <button
            onClick={() => {
              playSound.click();
              setShowNodeFailModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>FAIL NODE ({failedNodeIds.length})</span>
          </button>

          {/* Slow Network Trigger */}
          <button
            onClick={onSlowNetwork}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>SLOW NETWORK (240ms)</span>
          </button>

          {/* Packet Loss Trigger */}
          <button
            onClick={onTriggerPacketLoss}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>PACKET LOSS (18%)</span>
          </button>
        </div>

        {/* Restore Normal */}
        <button
          onClick={onRestoreAll}
          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>RESTORE NORMAL NETWORK</span>
        </button>
      </div>

      {/* Fail Node Selection Modal */}
      {showNodeFailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
                <AlertOctagon className="w-4 h-4" />
                <span>SELECT TRANSIT NODE TO FAIL</span>
              </div>
              <button
                onClick={() => setShowNodeFailModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed">
              Failing a major node forces BGP routers to re-converge and reroute packets around the dead link dynamically (e.g. Mumbai offline reroutes via Singapore).
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {Object.values(GLOBAL_NODES).map((node) => {
                const isFailed = failedNodeIds.includes(node.id);
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      if (isFailed) {
                        onRestoreNode(node.id);
                      } else {
                        onFailNode(node.id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left font-mono transition-all flex flex-col justify-between ${
                      isFailed
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{node.city}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded ${
                          isFailed ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isFailed ? 'OFFLINE' : 'ONLINE'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 truncate">
                      {node.country}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowNodeFailModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono hover:bg-cyan-500/30"
              >
                Done / View Rerouting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
