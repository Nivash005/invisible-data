import React, { useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { NetworkStats } from '../types/network';

interface TrafficChartProps {
  stats: NetworkStats;
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ stats }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<{ latency: number; throughput: number; loss: number }[]>([]);

  useEffect(() => {
    // Keep last 30 data points
    historyRef.current.push({
      latency: stats.latency,
      throughput: stats.speed,
      loss: stats.packetLossRate
    });

    if (historyRef.current.length > 35) {
      historyRef.current.shift();
    }
  }, [stats.latency, stats.speed, stats.packetLossRate]);

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const history = historyRef.current;
      if (history.length < 2) {
        animId = requestAnimationFrame(render);
        return;
      }

      const stepX = width / 34;

      // 1. Draw Throughput (Amber line)
      ctx.beginPath();
      history.forEach((pt, i) => {
        const x = i * stepX;
        const normalizedY = height - (pt.throughput / 350) * (height - 30) - 10;
        if (i === 0) ctx.moveTo(x, normalizedY);
        else ctx.lineTo(x, normalizedY);
      });
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Draw Latency (Cyan line with glow)
      ctx.beginPath();
      history.forEach((pt, i) => {
        const x = i * stepX;
        const normalizedY = height - (pt.latency / 400) * (height - 30) - 10;
        if (i === 0) ctx.moveTo(x, normalizedY);
        else ctx.lineTo(x, normalizedY);
      });
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Draw Loss spikes (Rose points)
      history.forEach((pt, i) => {
        if (pt.loss > 0) {
          const x = i * stepX;
          const y = height - (pt.loss / 30) * (height - 30) - 10;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 lg:p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wide">
            REAL-TIME TELEMETRY SPECTRUM
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Latency (ms)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Throughput (Mbps)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-300">Loss Events</span>
          </div>
        </div>
      </div>

      {/* HTML5 High-Performance Canvas */}
      <div className="relative w-full h-44 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={640}
          height={180}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500">
          * SIMULATION DATA // LIVE TIME-SERIES
        </div>
      </div>
    </div>
  );
};
