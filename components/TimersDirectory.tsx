import React, { useState } from 'react';
import { RetroButton } from './RetroButton';
import { TimerEngine, TimerTheme } from './TimerEngine';

const FUNCTIONAL_TIMERS: TimerTheme[] = [
  { 
    id: 'bar', 
    name: 'Bar Timer', 
    type: 'bar', 
    icon: '📊', 
    color: 'green' 
  },
  { 
    id: 'bomb', 
    name: 'Bomb Timer', 
    type: 'bomb', 
    icon: '💣', 
    endIcon: '💥', 
    color: 'red' 
  },
  { 
    id: 'magic', 
    name: 'Magic Number', 
    type: 'random_number', 
    icon: '🎲', 
    color: 'amber' 
  },
  { 
    id: 'egg', 
    name: 'Egg Timer', 
    type: 'classic', 
    icon: '🥚', 
    endIcon: '🐣', 
    color: 'green' 
  }
];

export const TimersDirectory: React.FC = () => {
  const [activeTimer, setActiveTimer] = useState<TimerTheme | null>(null);

  if (activeTimer) {
    return <TimerEngine theme={activeTimer} onBack={() => setActiveTimer(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">VER 3.0</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-2 text-center">
          CLASSROOM TOOLS
        </h2>
        <p className="font-retro text-lg text-center text-retro-green opacity-80">
          Select a utility to initialize.
        </p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {FUNCTIONAL_TIMERS.map((timer) => (
          <button
            key={timer.id}
            onClick={() => setActiveTimer(timer)}
            className="group relative bg-black border-2 border-gray-700 hover:border-retro-green transition-all duration-200 p-8 flex flex-row items-center gap-6 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(51,255,0,0.2)] text-left"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform duration-200">
              {timer.icon}
            </div>
            <div>
              <h3 className="font-pixel text-sm text-retro-green group-hover:text-retro-amber uppercase tracking-widest mb-1">
                {timer.name}
              </h3>
              <p className="font-retro text-gray-500 text-xs uppercase">
                {timer.type.replace('_', ' ')}
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