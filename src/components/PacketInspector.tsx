import React, { useState } from 'react';
import { Packet } from '../types/network';
import { Terminal, Shield, FileText, CheckCircle2, XCircle, Clock, ArrowRight, Layers, Lock, Cpu } from 'lucide-react';
import { playSound } from '../lib/sound';

interface PacketInspectorProps {
  packet: Packet | null;
  allPackets: Packet[];
  onSelectPacket: (pkt: Packet) => void;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({
  packet,
  allPackets,
  onSelectPacket
}) => {
  const [activeTab, setActiveTab] = useState<'HEADER' | 'PAYLOAD' | 'CHECKSUM'>('HEADER');

  // If no packet selected, use the latest packet in transit or delivered
  const displayPacket = packet || allPackets[allPackets.length - 1] || null;

  const handleTabChange = (tab: 'HEADER' | 'PAYLOAD' | 'CHECKSUM') => {
    playSound.click();
    setActiveTab(tab);
  };

  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 lg:p-6 shadow-2xl flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center gap-2">
              PACKET INSPECTOR
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                {displayPacket ? displayPacket.id : 'PKT-STREAM'}
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Deep dissection of OSI Layer 3/4 network frame
            </p>
          </div>
        </div>

        {displayPacket && (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono border flex items-center gap-1 ${
              displayPacket.status === 'DELIVERED'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : displayPacket.status === 'DROPPED'
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 animate-pulse'
            }`}
          >
            {displayPacket.status === 'DELIVERED' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : displayPacket.status === 'DROPPED' ? (
              <XCircle className="w-3 h-3 text-rose-400" />
            ) : (
              <Clock className="w-3 h-3 text-cyan-400" />
            )}
            {displayPacket.status}
          </span>
        )}
      </div>

      {/* Recent Packets Mini Stream Selector */}
      <div className="py-3 border-b border-slate-800/80">
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
          <span>SELECT PACKET TO DISSECT:</span>
          <span className="text-cyan-400">{allPackets.length} in buffer</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {allPackets.slice(-8).map((pkt) => (
            <button
              key={pkt.id}
              onClick={() => {
                playSound.click();
                onSelectPacket(pkt);
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all border whitespace-nowrap flex items-center gap-1 ${
                displayPacket?.id === pkt.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : pkt.status === 'DROPPED'
                  ? 'bg-rose-950/40 border-rose-800/40 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  pkt.status === 'DELIVERED'
                    ? 'bg-emerald-400'
                    : pkt.status === 'DROPPED'
                    ? 'bg-rose-400'
                    : 'bg-cyan-400'
                }`}
              />
              {pkt.id}
            </button>
          ))}
        </div>
      </div>

      {displayPacket ? (
        <div className="flex-1 flex flex-col pt-4 gap-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Type</span>
              <span className="text-xs font-mono font-bold text-cyan-300">{displayPacket.type}</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Size</span>
              <span className="text-xs font-mono font-bold text-slate-200">{displayPacket.size} KB</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Latency</span>
              <span className="text-xs font-mono font-bold text-purple-300">{displayPacket.latency} ms</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Seq Num</span>
              <span className="text-xs font-mono font-bold text-amber-300">
                #{displayPacket.headerData.seqNumber.toString().slice(-6)}
              </span>
            </div>
          </div>

          {/* Route path snippet */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono">
            <div className="text-[10px] text-slate-400 uppercase mb-1">Transit Route Vector</div>
            <div className="flex items-center gap-2 text-slate-300 flex-wrap">
              <span className="text-cyan-400">{displayPacket.source}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="text-emerald-400">{displayPacket.destination}</span>
            </div>
          </div>

          {/* Interactive Three-Part Packet Structure Selector */}
          <div className="border border-cyan-500/20 rounded-xl p-1 bg-slate-900/90">
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleTabChange('HEADER')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'HEADER'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                HEADER
              </button>
              <button
                onClick={() => handleTabChange('PAYLOAD')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'PAYLOAD'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                PAYLOAD
              </button>
              <button
                onClick={() => handleTabChange('CHECKSUM')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'CHECKSUM'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                CHECKSUM
              </button>
            </div>
          </div>

          {/* Active Tab Explanation & Content */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-3">
            {activeTab === 'HEADER' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 text-xs">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p>
                    "The header contains routing and control information used to deliver the packet across intermediate routers."
                  </p>
                </div>
                <div className="space-y-1.5 text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-500">Source IP:</span>
                    <span className="text-cyan-400">{displayPacket.headerData.srcIp}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-500">Destination IP:</span>
                    <span className="text-cyan-400">{displayPacket.headerData.dstIp}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-500">Protocol Layer:</span>
                    <span className="text-purple-400">{displayPacket.headerData.protocol}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-500">Time-To-Live (TTL):</span>
                    <span className="text-slate-300">{displayPacket.headerData.ttl} hops</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">TCP Control Flags:</span>
                    <span className="text-amber-400">{displayPacket.headerData.flags}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PAYLOAD' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-200 text-xs">
                  <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p>
                    "The payload contains the actual data being transported — encrypted via TLS 1.3 in transit."
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {displayPacket.payloadPreview}
                </div>
                <div className="text-[10px] text-slate-500 italic">
                  * Note: Simulated payload representation. Actual real-world internet packets remain encrypted end-to-end.
                </div>
              </div>
            )}

            {activeTab === 'CHECKSUM' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-xs">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    "A checksum helps detect whether data was corrupted or had bit flips during physical fiber optic transmission."
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">CRC32 Polynomial Hash:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {displayPacket.checksum}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Calculated FCS matches received frame (0 parity errors)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs">
          <Terminal className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
          <span>INITIALIZING TELEMETRY STREAM...</span>
        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
        EDUCATIONAL SIMULATION // NO REAL PRIVATE DATA INSPECTED
      </div>
    </div>
  );
};
