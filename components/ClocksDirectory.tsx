import React, { useState } from 'react';
import { ClockTheme, ClocksEngine } from './ClocksEngine';

const CLOCK_THEMES: ClockTheme[] = [
  {
    id: 'digital',
    name: 'Retro Digital',
    type: 'digital',
    icon: '📟',
    description: "Standard high-precision digital time display with date."
  },
  {
    id: 'nixie',
    name: 'Nixie Tube',
    type: 'nixie',
    icon: '💡',
    description: "Classic cold cathode display technology simulation."
  },
  {
    id: 'analog',
    name: 'Neon Analog',
    type: 'analog',
    icon: '🕑',
    description: "Smooth sweeping second hand on a neon vector face."
  },
  {
    id: 'talking',
    name: 'Talking Clock',
    type: 'talking',
    icon: '🗣️',
    description: "Audible time announcement for accessibility and fun."
  }
];

export const ClocksDirectory: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ClockTheme | null>(null);

  if (activeTheme) {
    return <ClocksEngine theme={activeTheme} onBack={() => setActiveTheme(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">TIME_SYNC</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-2 text-center">
          WORLD CLOCKS
        </h2>
        <div className="font-retro text-lg text-center text-retro-green opacity-80">
          <p>Current local system time visualization.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {CLOCK_THEMES.map((theme) => (
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
                {theme.type === 'nixie' ? 'Vacuum Tube Style' : theme.type === 'analog' ? 'Smooth Sweep' : 'Standard'}
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