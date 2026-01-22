import React, { useState } from 'react';
import { NumberTheme, RandomNumberEngine } from './RandomNumberEngine';

const NUMBER_THEMES: NumberTheme[] = [
  {
    id: 'digital',
    name: 'Neon Digital',
    type: 'digital',
    icon: '📟',
    defaultMin: 1,
    defaultMax: 100
  },
  {
    id: 'bingo',
    name: 'Bingo Caller',
    type: 'bingo',
    icon: '🎱',
    defaultMin: 1,
    defaultMax: 75
  },
  {
    id: 'magic',
    name: 'Magic Hat',
    type: 'magic',
    icon: '🎩',
    defaultMin: 1,
    defaultMax: 10
  },
  {
    id: 'dice',
    name: 'Dice Roller',
    type: 'dice',
    icon: '🎲',
    defaultMin: 1,
    defaultMax: 6
  }
];

export const RandomNumberDirectory: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<NumberTheme | null>(null);

  if (activeTheme) {
    return <RandomNumberEngine theme={activeTheme} onBack={() => setActiveTheme(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">RNG_V1.0</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-2 text-center">
          RANDOM NUMBER GENERATOR
        </h2>
        <div className="font-retro text-lg text-center text-retro-green opacity-80">
          <p>Generate random integers within a specified range.</p>
          <div className="mt-2 text-sm text-retro-red border-t border-retro-green/20 pt-2">
            PERFECT FOR COMPETITIONS & PRIZE DRAWS
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {NUMBER_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme)}
            className="group relative bg-black border-2 border-gray-700 hover:border-retro-green transition-all duration-200 p-8 flex flex-row items-center gap-6 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(51,255,0,0.2)] text-left"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
              {theme.icon}
            </div>
            <div>
              <h3 className="font-pixel text-sm text-retro-green group-hover:text-retro-amber uppercase tracking-widest mb-1">
                {theme.name}
              </h3>
              <p className="font-retro text-gray-500 text-xs uppercase">
                Range: {theme.defaultMin}-{theme.defaultMax}
              </p>
            </div>
            
            {/* Decorative Corner lines */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-500 group-hover:border-retro-green"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-500 group-hover:border-retro-green"></div>
          </button>
        ))}
      </div>
    </div>
  );
};