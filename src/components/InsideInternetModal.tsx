import React, { useState } from 'react';
import { Globe as GlobeIcon, MapPin, Cable, Cpu, Layers, Sparkles, X, ChevronRight } from 'lucide-react';
import { playSound } from '../lib/sound';

interface InsideInternetModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
}

const ZOOM_LEVELS = [
  {
    id: 1,
    title: 'LEVEL 1: PLANETARY SCALE',
    scale: '10,000 km',
    name: 'Global Mesh & BGP Peering',
    icon: GlobeIcon,
    description: 'Over 500 subsea optical cable systems interconnect every continent, spanning more than 1.4 million kilometers on the ocean seabed.',
    visualData: 'BGP AS-PATH: [AS15169 (Google) → AS3356 (Lumen) → AS13335 (Cloudflare)]'
  },
  {
    id: 2,
    title: 'LEVEL 2: METROPOLITAN NODE',
    scale: '50 km',
    name: 'Internet Exchange Point (IXP)',
    icon: MapPin,
    description: 'Massive carrier-neutral datacenters like DE-CIX Frankfurt or Equinix Singapore house thousands of high-density optical cross-connects.',
    visualData: 'THROUGHPUT: 14.2 Terabits/sec | SWITCHING LATENCY: 0.8 µs'
  },
  {
    id: 3,
    title: 'LEVEL 3: PHYSICAL OPTICAL FIBER',
    scale: '125 µm',
    name: 'Subsea Glass Strand',
    icon: Cable,
    description: 'Ultra-pure silica glass core thinner than a strand of human hair. Laser photons bounce via Total Internal Reflection at 200,000 km/s.',
    visualData: 'WAVELENGTH: 1550 nm C-Band | DWDM CHANNELS: 96 wavelengths per fiber pair'
  },
  {
    id: 4,
    title: 'LEVEL 4: SILICON TRANSCEIVER',
    scale: '5 nm',
    name: 'DSP Coherent Optical Modulator',
    icon: Cpu,
    description: 'Digital Signal Processors convert electrical voltages from server motherboards into phase-modulated QAM laser constellations.',
    visualData: 'MODULATION: 64-QAM Constellation | BAUD RATE: 128 GigaBaud'
  },
  {
    id: 5,
    title: 'LEVEL 5: ATOMIC BITSTREAM',
    scale: '1 Byte',
    name: 'Hexadecimal Packet Frame',
    icon: Layers,
    description: 'Binary voltage gates flipping between 0 and 1 billions of times per second to encode the digital memory of human civilization.',
    visualData: '01000101 00000000 0000003c 1a2b4000 4006b52a c0a80168 8efae62e'
  }
];

export const InsideInternetModal: React.FC<InsideInternetModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);

  if (!isOpen) return null;

  const level = ZOOM_LEVELS[currentLevel];
  const Icon = level.icon;

  const handleNext = () => {
    playSound.click();
    setCurrentLevel((prev) => (prev < ZOOM_LEVELS.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    playSound.click();
    setCurrentLevel((prev) => (prev > 0 ? prev - 1 : ZOOM_LEVELS.length - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_80px_rgba(168,85,247,0.25)] relative overflow-hidden font-mono">
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            playSound.click();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
              CINEMATIC MICROSCOPIC DISSECTION
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-100">
              Inside The Internet // Zoom Mode
            </h3>
          </div>
        </div>

        {/* Level Breadcrumb Stepper */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          {ZOOM_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => {
                playSound.click();
                setCurrentLevel(idx);
              }}
              className={`py-2 px-1 rounded-lg text-center text-[10px] font-mono border transition-all ${
                currentLevel === idx
                  ? 'bg-purple-500/20 text-purple-200 border-purple-400 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              L0{lvl.id}
            </button>
          ))}
        </div>

        {/* Main Stage Display */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="text-purple-400 font-bold">{level.title}</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
              SCALE: {level.scale}
            </span>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-100">{level.name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {level.description}
              </p>
            </div>
          </div>

          {/* Technical Telemetry Readout */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 break-all">
            <span className="text-slate-500 text-[9px] block uppercase mb-0.5">Live Hardware Telemetry Vector:</span>
            {level.visualData}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            ← Zoom Out
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
          >
            <span>{currentLevel < ZOOM_LEVELS.length - 1 ? 'Zoom In Further' : 'Restart Zoom Loop'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
