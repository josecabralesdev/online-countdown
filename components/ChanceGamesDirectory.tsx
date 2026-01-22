import React, { useState } from 'react';
import { ChanceGameTheme, ChanceGamesEngine } from './ChanceGamesEngine';

const CHANCE_THEMES: ChanceGameTheme[] = [
  {
    id: 'dice',
    name: 'Online Dice',
    type: 'dice',
    icon: '🎲',
    description: "Standard 6-sided dice roll. Pure random chance."
  },
  {
    id: '8ball',
    name: 'Magic 8-Ball',
    type: '8ball',
    icon: '🎱',
    description: "Ask a yes/no question and reveal your destiny."
  },
  {
    id: 'coin',
    name: 'Flip a Coin',
    type: 'coin',
    icon: '🪙',
    description: "Heads or Tails? Settle disputes instantly."
  },
  {
    id: 'rps',
    name: 'RPS Battle',
    type: 'rps',
    icon: '✂️',
    description: "Rock, Paper, Scissors against the CPU."
  }
];

export const ChanceGamesDirectory: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ChanceGameTheme | null>(null);

  if (activeTheme) {
    return <ChanceGamesEngine theme={activeTheme} onBack={() => setActiveTheme(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">LUCK_OS</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-2 text-center">
          CHANCE GAMES
        </h2>
        <div className="font-retro text-lg text-center text-retro-green opacity-80">
          <p>Tools of probability and fate.</p>
          <div className="mt-2 text-sm text-retro-red border-t border-retro-green/20 pt-2">
            NO SKILL REQUIRED. 100% RANDOM.
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {CHANCE_THEMES.map((theme) => (
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