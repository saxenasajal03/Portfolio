import React from 'react';
import { Volume2, VolumeX, RotateCw, Layers, Sparkles, Sliders, ChevronDown, ChevronUp, User } from 'lucide-react';
import { DisplayMode } from './Sajal3DCanvas';
import { soundEngine } from '../utils/audio';

interface ControlDockProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  explodedOffset: number;
  setExplodedOffset: (val: number) => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  rotationSpeed: number;
  setRotationSpeed: (val: number) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  onOpenDossier: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  backdropMode: 'composite' | '3d-only' | 'video-only';
  setBackdropMode: (mode: 'composite' | '3d-only' | 'video-only') => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  displayMode,
  setDisplayMode,
  explodedOffset,
  setExplodedOffset,
  autoRotate,
  setAutoRotate,
  rotationSpeed,
  setRotationSpeed,
  isMuted,
  setIsMuted,
  onOpenDossier,
  isCollapsed,
  setIsCollapsed,
  backdropMode,
  setBackdropMode,
}) => {
  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    soundEngine.playModeChime(mode === 'hologram' ? 587 : mode === 'wireframe' ? 784 : 440);
  };

  const handleToggleSound = () => {
    const nextState = soundEngine.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95vw] max-w-[940px] pointer-events-none transition-all duration-300">
      {/* Collapse/Expand Toggle Tab */}
      <div className="flex justify-center mb-1 pointer-events-auto">
        <button
          onClick={() => {
            soundEngine.playTick();
            setIsCollapsed(!isCollapsed);
          }}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono tracking-wider uppercase text-neutral-400 hover:text-white bg-[#1a140f]/90 border border-white/10 rounded-t-md hover:bg-[#251d16] transition-colors"
          title="Toggle Controls (Zen Mode)"
        >
          {isCollapsed ? (
            <>
              <ChevronUp size={13} />
              <span>Show 3D Studio Controls</span>
            </>
          ) : (
            <>
              <ChevronDown size={13} />
              <span>Zen View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="pointer-events-auto bg-[#140e0a]/95 border border-white/12 rounded-lg p-3 shadow-2xl backdrop-blur-none text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Mode Selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mr-1 flex items-center gap-1">
                <Sparkles size={11} className="text-[#ff9a3c]" />
                Mode:
              </span>
              {(
                [
                  { id: 'studio', label: 'Studio Amber' },
                  { id: 'hologram', label: 'GenAI Holo' },
                  { id: 'exploded', label: 'Exploded 3D' },
                  { id: 'wireframe', label: 'Wireframe' },
                ] as const
              ).map((m) => {
                const isActive = displayMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className={`px-2.5 py-1 text-xs font-mono tracking-tight transition-all rounded ${
                      isActive
                        ? 'bg-[#ff9a3c] text-[#130e09] font-semibold shadow-sm'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Center: Exploded & Rotation Controls */}
            <div className="flex items-center gap-3">
              {/* Exploded Depth Slider */}
              <div className="flex items-center gap-2">
                <Layers size={13} className="text-neutral-400" />
                <span className="text-[10px] font-mono uppercase text-neutral-400">Depth</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={explodedOffset}
                  onChange={(e) => {
                    setExplodedOffset(parseFloat(e.target.value));
                    if (displayMode !== 'exploded' && parseFloat(e.target.value) > 0.05) {
                      setDisplayMode('exploded');
                    }
                  }}
                  className="w-20 sm:w-24 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff9a3c]"
                />
              </div>

              {/* Auto-Rotate toggle */}
              <button
                onClick={() => {
                  soundEngine.playTick();
                  setAutoRotate(!autoRotate);
                }}
                className={`p-1.5 rounded border transition-colors flex items-center gap-1 text-xs font-mono ${
                  autoRotate
                    ? 'bg-[#ff9a3c]/15 text-[#ff9a3c] border-[#ff9a3c]/40'
                    : 'bg-white/5 text-neutral-400 border-white/5 hover:text-white'
                }`}
                title="Toggle Auto-Rotation"
              >
                <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: `${6 / rotationSpeed}s` }} />
                <span className="text-[10px] hidden sm:inline">Spin</span>
              </button>

              {/* Layer View Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-white/5 p-0.5 rounded border border-white/5 text-[11px] font-mono">
                <button
                  onClick={() => {
                    soundEngine.playTick();
                    setBackdropMode('composite');
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${backdropMode === 'composite' ? 'bg-white/20 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
                >
                  Composite
                </button>
                <button
                  onClick={() => {
                    soundEngine.playTick();
                    setBackdropMode('3d-only');
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${backdropMode === '3d-only' ? 'bg-white/20 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
                >
                  3D Solo
                </button>
                <button
                  onClick={() => {
                    soundEngine.playTick();
                    setBackdropMode('video-only');
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${backdropMode === 'video-only' ? 'bg-white/20 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
                >
                  Atelier Unit
                </button>
              </div>
            </div>

            {/* Right: Sound & Dossier Trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSound}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors"
                title={isMuted ? 'Enable Sound FX' : 'Mute Sound FX'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#ff9a3c]" />}
              </button>

              <button
                onClick={() => {
                  soundEngine.playResonance();
                  onOpenDossier();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#130e09] font-medium text-xs hover:bg-neutral-200 transition-all shadow-md active:scale-95"
              >
                <User size={13} />
                <span>Profile Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
