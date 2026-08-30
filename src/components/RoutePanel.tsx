import React from 'react';
import { NetworkNode } from '../types/network';
import { Server, AlertOctagon, CheckCircle2, ArrowRight, ShieldAlert, RefreshCw } from 'lucide-react';
import { playSound } from '../lib/sound';

interface RoutePanelProps {
  nodes: NetworkNode[];
  failedNodeIds: string[];
  onSelectNode: (node: NetworkNode) => void;
  selectedNode: NetworkNode | null;
  onToggleFailNode: (nodeId: string) => void;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  nodes,
  failedNodeIds,
  onSelectNode,
  selectedNode,
  onToggleFailNode
}) => {
  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 lg:p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wide">
            CURRENT ROUTE PIPELINE
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 px-2.5 py-1 rounded border border-cyan-800/40">
          {nodes.length} ACTIVE HOPS
        </span>
      </div>

      {/* Visual Pipeline */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {nodes.map((node, index) => {
          const isFailed = failedNodeIds.includes(node.id);
          const isSelected = selectedNode?.id === node.id;
          const isOrigin = index === 0;
          const isDest = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                onClick={() => {
                  playSound.nodePulse();
                  onSelectNode(node);
                }}
                className={`flex-shrink-0 cursor-pointer p-3 rounded-xl border transition-all duration-300 relative group min-w-[130px] ${
                  isFailed
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                    : isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    HOP 0{index + 1}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFailed
                        ? 'bg-rose-500 animate-ping'
                        : isDest
                        ? 'bg-emerald-400 animate-pulse'
                        : isOrigin
                        ? 'bg-cyan-400'
                        : 'bg-purple-400'
                    }`}
                  />
                </div>

                <div className="font-mono font-bold text-xs text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                  {node.city}
                </div>

                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {node.country}
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{node.avgLatency}ms</span>
                  <span
                    className={`font-semibold ${
                      isFailed ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isFailed ? 'OFFLINE' : 'ONLINE'}
                  </span>
                </div>
              </div>

              {/* Connecting Arrow */}
              {index < nodes.length - 1 && (
                <div className="flex-shrink-0 flex items-center justify-center text-slate-600 px-0.5">
                  <ArrowRight
                    className={`w-4 h-4 ${
                      isFailed || failedNodeIds.includes(nodes[index + 1].id)
                        ? 'text-rose-500/50'
                        : 'text-cyan-400/70 animate-pulse'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                <span>{selectedNode.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                  {selectedNode.type} NODE
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedNode.city}, {selectedNode.country} (Coordinates: {selectedNode.lat.toFixed(2)}°N, {selectedNode.lng.toFixed(2)}°E)
              </p>
            </div>

            {/* Toggle Node Status Button */}
            <button
              onClick={() => onToggleFailNode(selectedNode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                failedNodeIds.includes(selectedNode.id)
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              {failedNodeIds.includes(selectedNode.id) ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  RESTORE NODE
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  FAIL THIS NODE
                </>
              )}
            </button>
          </div>

          <p className="text-slate-300 text-xs mt-3 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Switch Load:</span>
              <span className="text-slate-200 font-bold">{selectedNode.load}% capacity</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Avg Hop Latency:</span>
              <span className="text-cyan-400 font-bold">{selectedNode.avgLatency} ms</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Processed:</span>
              <span className="text-purple-300 font-bold">{selectedNode.packetsProcessed.toLocaleString()} pkts</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block">Current Status:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  failedNodeIds.includes(selectedNode.id)
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {failedNodeIds.includes(selectedNode.id) ? (
                  <>
                    <AlertOctagon className="w-3 h-3" />
                    OFFLINE
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    ONLINE
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
