import React, { useState } from 'react';
import { RetroButton } from './RetroButton';
import { RaceGame, RaceTheme } from './RaceGame';

const GAMES: RaceTheme[] = [
  { id: 'duck', name: 'Duck Race', icon: '🦆' },
  { id: 'dino', name: 'Dino Race', icon: '🦖' },
  { id: 'space', name: 'Space Race', icon: '🚀' },
  { id: 'zombie', name: 'Zombie Race', icon: '🧟' },
  { id: 'car', name: 'Car Race', icon: '🏎️' },
  { id: 'emoji', name: 'Emoji Race', icon: '😀', isRandomEmoji: true },
];

export const RaceTimers: React.FC = () => {
  const [activeGame, setActiveGame] = useState<RaceTheme | null>(null);

  if (activeGame) {
    return <RaceGame theme={activeGame} onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">V 2.0.1</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-4 text-center leading-relaxed">
          RACE ARENA
        </h2>
        
        <div className="font-retro text-lg sm:text-xl text-center space-y-2 text-retro-green opacity-90">
          <p>Select a cartridge to load game module.</p>
          <p className="mt-4 border-t border-retro-green/30 pt-4">
            <span className="text-retro-amber">PREMIUM MEMBERS</span>: Up to <span className="text-white">100 RACERS</span>.
          </p>
          <p className="text-retro-green/70">
            Free users: Up to <span className="text-white">6 RACERS</span>.
          </p>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game)}
            className="group relative bg-black border-2 border-gray-700 hover:border-retro-green transition-all duration-200 p-6 flex flex-col items-center gap-4 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(51,255,0,0.3)]"
          >
            <div className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              {game.icon}
            </div>
            <h3 className="font-pixel text-sm text-retro-green group-hover:text-retro-amber text-center uppercase tracking-widest">
              {game.name}
            </h3>
            
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