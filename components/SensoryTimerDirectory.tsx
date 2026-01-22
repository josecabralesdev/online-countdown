import React, { useState } from 'react';
import { SensoryTheme, SensoryTimerEngine } from './SensoryTimerEngine';

const SENSORY_THEMES: SensoryTheme[] = [
  {
    id: 'liquid',
    name: 'Liquid Bubble',
    type: 'liquid',
    icon: '🧪',
    description: "Relaxing bubbles float as time drains away. Based on classic oil timers."
  },
  {
    id: 'lava',
    name: 'Neon Lava',
    type: 'lava',
    icon: '🌋',
    description: "Hypnotic glowing goo that shifts and moves. Perfect for calming focus."
  },
  {
    id: 'battery',
    name: 'Battery Drain',
    type: 'battery',
    icon: '🔋',
    description: "Watch the energy deplete. A clear visual indicator of remaining time."
  },
  {
    id: 'candle',
    name: 'Pixel Candle',
    type: 'candle',
    icon: '🕯️',
    description: "A candle that slowly melts down. Ideal for storytelling or quiet time."
  }
];

export const SensoryTimerDirectory: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<SensoryTheme | null>(null);

  if (activeTheme) {
    return <SensoryTimerEngine theme={activeTheme} onBack={() => setActiveTheme(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">RELAX_MOD_V1</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-2 text-center">
          SENSORY TIMERS
        </h2>
        <div className="font-retro text-lg text-center text-retro-green opacity-80">
          <p>Visual timekeeping for focus and relaxation.</p>
          <div className="mt-2 text-sm text-retro-red border-t border-retro-green/20 pt-2">
            NO TICKING SOUNDS. PURE VISUAL FLOW.
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {SENSORY_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme)}
            className="group relative bg-black border-2 border-gray-700 hover:border-retro-green transition-all duration-200 p-8 flex flex-col items-center gap-4 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(51,255,0,0.2)] text-center"
          >
            <div className="text-6xl group-hover:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] mb-2">
              {theme.icon}
            </div>
            <div>
              <h3 className="font-pixel text-sm text-retro-green group-hover:text-retro-amber uppercase tracking-widest mb-2">
                {theme.name}
              </h3>
              <p className="font-retro text-gray-500 text-sm">
                {theme.description}
              </p>
            </div>
            
            {/* Decorative Corner lines */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-500 group-hover:border-retro-green"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-500 group-hover:border-retro-green"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-500 group-hover:border-retro-green"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-500 group-hover:border-retro-green"></div>
          </button>
        ))}
      </div>
    </div>
  );
};