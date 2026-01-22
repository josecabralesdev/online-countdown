import React, { useState } from 'react';
import { Stopwatch } from './components/Stopwatch';
import { Countdown } from './components/Countdown';
import { RaceTimers } from './components/RaceTimers';
import { TimersDirectory } from './components/TimersDirectory';
import { NamePickerDirectory } from './components/NamePickerDirectory';
import { RandomNumberDirectory } from './components/RandomNumberDirectory';
import { SensoryTimerDirectory } from './components/SensoryTimerDirectory';
import { ClocksDirectory } from './components/ClocksDirectory';
import { ChanceGamesDirectory } from './components/ChanceGamesDirectory';
import { GroupGeneratorDirectory } from './components/GroupGeneratorDirectory';
import { PresentationTimerDirectory } from './components/PresentationTimerDirectory';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.STOPWATCH);

  return (
    <div className="min-h-screen bg-retro-bg text-retro-green p-4 sm:p-8 font-sans selection:bg-retro-green selection:text-black flex flex-col relative z-20">
      
      {/* Header / Title Block */}
      <header className="mb-8 sm:mb-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-5xl font-pixel text-center mb-2 text-transparent bg-clip-text bg-gradient-to-b from-retro-green to-retro-green-dim drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
          ONLINE<br className="sm:hidden" /> COUNTDOWN
        </h1>
        <div className="h-1 w-full max-w-md bg-gradient-to-r from-transparent via-retro-green to-transparent opacity-50"></div>
        <p className="font-retro text-xl mt-2 opacity-80 uppercase tracking-widest">System Ready</p>
      </header>

      {/* Mode Switcher */}
      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
        <button
          onClick={() => setMode(AppMode.STOPWATCH)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.STOPWATCH 
              ? 'border-retro-green text-retro-green bg-retro-green/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-retro-green hover:border-retro-green/30'}
          `}
        >
          Stopwatch
        </button>
        <button
          onClick={() => setMode(AppMode.COUNTDOWN)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.COUNTDOWN 
              ? 'border-retro-amber text-retro-amber bg-retro-amber/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-retro-amber hover:border-retro-amber/30'}
          `}
        >
          Countdown
        </button>
        <button
          onClick={() => setMode(AppMode.RACE_TIMERS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.RACE_TIMERS 
              ? 'border-retro-red text-retro-red bg-retro-red/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-retro-red hover:border-retro-red/30'}
          `}
        >
          Race Timers
        </button>
        <button
          onClick={() => setMode(AppMode.TIMERS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.TIMERS 
              ? 'border-blue-400 text-blue-400 bg-blue-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-blue-400 hover:border-blue-400/30'}
          `}
        >
          Timers
        </button>
        <button
          onClick={() => setMode(AppMode.NAME_PICKERS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.NAME_PICKERS 
              ? 'border-purple-400 text-purple-400 bg-purple-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-purple-400 hover:border-purple-400/30'}
          `}
        >
          Pickers
        </button>
        <button
          onClick={() => setMode(AppMode.RANDOM_NUMBERS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.RANDOM_NUMBERS 
              ? 'border-pink-400 text-pink-400 bg-pink-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-pink-400 hover:border-pink-400/30'}
          `}
        >
          Numbers
        </button>
        <button
          onClick={() => setMode(AppMode.SENSORY_TIMERS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.SENSORY_TIMERS 
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-cyan-400 hover:border-cyan-400/30'}
          `}
        >
          Sensory
        </button>
        <button
          onClick={() => setMode(AppMode.CLOCKS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.CLOCKS 
              ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-yellow-400 hover:border-yellow-400/30'}
          `}
        >
          Clocks
        </button>
        <button
          onClick={() => setMode(AppMode.CHANCE_GAMES)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.CHANCE_GAMES 
              ? 'border-orange-500 text-orange-500 bg-orange-500/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-orange-500 hover:border-orange-500/30'}
          `}
        >
          Chance
        </button>
        <button
          onClick={() => setMode(AppMode.GROUP_GENERATOR)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.GROUP_GENERATOR 
              ? 'border-lime-400 text-lime-400 bg-lime-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-lime-400 hover:border-lime-400/30'}
          `}
        >
          Groups
        </button>
        <button
          onClick={() => setMode(AppMode.PRESENTATION_TIMERS)}
          className={`
            font-pixel text-[10px] sm:text-xs py-3 px-4 sm:px-6 border-b-4 transition-all duration-200 uppercase tracking-wider
            ${mode === AppMode.PRESENTATION_TIMERS 
              ? 'border-rose-400 text-rose-400 bg-rose-400/10 translate-y-[1px]' 
              : 'border-transparent text-gray-500 hover:text-rose-400 hover:border-rose-400/30'}
          `}
        >
          Speech
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="w-full relative">
           {/* Decorative Border Corners */}
           <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
           <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
           <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
           <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
           
           <div className="bg-black/40 border border-gray-800 p-4 sm:p-10 rounded-sm backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {mode === AppMode.STOPWATCH && <Stopwatch />}
            {mode === AppMode.COUNTDOWN && <Countdown />}
            {mode === AppMode.RACE_TIMERS && <RaceTimers />}
            {mode === AppMode.TIMERS && <TimersDirectory />}
            {mode === AppMode.NAME_PICKERS && <NamePickerDirectory />}
            {mode === AppMode.RANDOM_NUMBERS && <RandomNumberDirectory />}
            {mode === AppMode.SENSORY_TIMERS && <SensoryTimerDirectory />}
            {mode === AppMode.CLOCKS && <ClocksDirectory />}
            {mode === AppMode.CHANCE_GAMES && <ChanceGamesDirectory />}
            {mode === AppMode.GROUP_GENERATOR && <GroupGeneratorDirectory />}
            {mode === AppMode.PRESENTATION_TIMERS && <PresentationTimerDirectory />}
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center opacity-40 font-retro text-lg">
        <p>V 1.0.9 // TERMINAL_ACTIVE</p>
      </footer>
    </div>
  );
}

export default App;