import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RetroButton } from './RetroButton';
import { DigitalDisplay } from './DigitalDisplay';

export type SensoryType = 'liquid' | 'lava' | 'battery' | 'candle';

export interface SensoryTheme {
  id: string;
  name: string;
  type: SensoryType;
  icon: string;
  description: string;
}

interface SensoryTimerEngineProps {
  theme: SensoryTheme;
  onBack: () => void;
}

export const SensoryTimerEngine: React.FC<SensoryTimerEngineProps> = ({ theme, onBack }) => {
  const [gameState, setGameState] = useState<'CONFIG' | 'RUNNING' | 'FINISHED'>('CONFIG');
  const [duration, setDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const [inputMin, setInputMin] = useState('05');
  const [inputSec, setInputSec] = useState('00');

  const endTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();

  const startTimer = () => {
    const min = parseInt(inputMin) || 0;
    const sec = parseInt(inputSec) || 0;
    const totalMs = (min * 60 + sec) * 1000;

    if (totalMs <= 0) return;

    setDuration(totalMs);
    setTimeLeft(totalMs);
    setGameState('RUNNING');

    endTimeRef.current = Date.now() + totalMs;
    requestRef.current = requestAnimationFrame(loop);
  };

  const loop = useCallback(() => {
    const now = Date.now();
    const remaining = Math.max(0, endTimeRef.current - now);
    
    setTimeLeft(remaining);

    if (remaining <= 0) {
      finishTimer();
    } else {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, []);

  const finishTimer = () => {
    setGameState('FINISHED');
    playAlarm();
  };

  const playAlarm = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Soft chime for sensory timers
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 2);
  };

  const reset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState('CONFIG');
    setTimeLeft(0);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // --- Visual Renderers ---

  const renderVisual = () => {
    const progress = duration > 0 ? timeLeft / duration : 0; // 1.0 down to 0.0
    const percentage = progress * 100;

    // 1. LIQUID / BUBBLE TIMER
    if (theme.type === 'liquid') {
      return (
        <div className="relative w-32 h-64 sm:w-48 sm:h-80 flex flex-col items-center justify-between py-2">
           {/* Top Chamber */}
           <div className="w-full h-1/2 border-4 border-retro-green rounded-t-3xl rounded-b-lg relative overflow-hidden bg-black/50">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-retro-green/80 transition-all duration-100 ease-linear"
                style={{ height: `${percentage}%` }}
              >
                 {/* Surface bubbles */}
                 <div className="absolute top-0 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                 <div className="absolute top-0 right-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              </div>
           </div>
           
           {/* Connector */}
           <div className="w-4 h-8 bg-retro-green/30 border-x-2 border-retro-green relative flex justify-center">
              {gameState === 'RUNNING' && (
                <div className="w-1 h-2 bg-retro-green rounded-full animate-[ping_0.5s_linear_infinite]"></div>
              )}
           </div>

           {/* Bottom Chamber */}
           <div className="w-full h-1/2 border-4 border-retro-green rounded-t-lg rounded-b-3xl relative overflow-hidden bg-black/50">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-retro-green/80 transition-all duration-100 ease-linear"
                style={{ height: `${100 - percentage}%` }}
              >
                 {gameState === 'RUNNING' && (
                    <div className="w-full h-full opacity-50 bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
                 )}
              </div>
           </div>
        </div>
      );
    }

    // 2. LAVA LAMP
    if (theme.type === 'lava') {
       return (
         <div className="relative w-32 h-64 sm:w-40 sm:h-80 bg-gray-900 border-4 border-purple-500 rounded-full overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <div className="absolute inset-0 opacity-30 bg-purple-900"></div>
            
            {/* The "Lava" is actually the background color, and we mask it with the timer progress? 
                Or better: blobs moving that change color based on time. 
                Let's do a simple height fill but with blobby effects. 
            */}
            
            <div 
              className="absolute bottom-0 left-0 right-0 bg-purple-500 transition-all duration-1000 ease-linear blur-md opacity-80"
              style={{ height: `${percentage}%` }}
            >
              {gameState === 'RUNNING' && (
                <>
                  <div className="absolute -top-10 left-4 w-12 h-12 bg-purple-400 rounded-full animate-[bounce_3s_infinite]"></div>
                  <div className="absolute -top-6 right-8 w-8 h-8 bg-purple-400 rounded-full animate-[bounce_4s_infinite_reverse]"></div>
                  <div className="absolute top-10 left-1/2 w-16 h-16 bg-purple-600 rounded-full mix-blend-multiply animate-pulse"></div>
                </>
              )}
            </div>

            {/* Glass shine */}
            <div className="absolute top-4 left-4 w-4 h-24 bg-white/10 rounded-full"></div>
         </div>
       );
    }

    // 3. BATTERY
    if (theme.type === 'battery') {
      // Determine color based on percentage
      let colorClass = 'bg-retro-green';
      if (percentage < 20) colorClass = 'bg-retro-red animate-pulse';
      else if (percentage < 50) colorClass = 'bg-retro-amber';

      return (
        <div className="flex flex-col items-center">
           {/* Terminal */}
           <div className="w-16 h-6 bg-gray-600 rounded-t-sm mb-1"></div>
           {/* Body */}
           <div className="w-32 h-64 border-8 border-gray-600 bg-gray-900 rounded-xl p-2 relative flex flex-col justify-end">
              <div 
                className={`w-full transition-all duration-300 ease-linear rounded-sm ${colorClass} shadow-[0_0_15px_currentColor]`}
                style={{ height: `${percentage}%` }}
              >
                 {/* Glare */}
                 <div className="absolute top-0 right-2 w-2 h-full bg-white/10"></div>
              </div>
              
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
                 <div className="w-full h-0.5 bg-gray-800/50"></div>
                 <div className="w-full h-0.5 bg-gray-800/50"></div>
                 <div className="w-full h-0.5 bg-gray-800/50"></div>
              </div>
           </div>
           <div className="mt-4 font-pixel text-xl">{Math.ceil(percentage)}%</div>
        </div>
      );
    }

    // 4. CANDLE
    if (theme.type === 'candle') {
      return (
        <div className="relative h-64 w-full flex justify-center items-end">
           {/* Candle Stick */}
           <div 
             className="w-16 sm:w-24 bg-white/90 rounded-sm relative transition-all duration-100 ease-linear shadow-inner"
             style={{ height: `${Math.max(5, percentage)}%` }}
           >
              {/* Flame (Only if running or has wax) */}
              {(gameState === 'RUNNING' || percentage > 0) && (
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-orange-500 via-yellow-300 to-white rounded-full animate-[pulse_0.1s_ease-in-out_infinite] filter blur-[1px] shadow-[0_0_20px_orange]">
                    <div className="w-full h-full animate-[wiggle_0.5s_infinite]"></div>
                 </div>
              )}
              
              {/* Dripping wax effect */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 rounded-t-sm"></div>
           </div>
           
           {/* Plate */}
           <div className="absolute bottom-0 w-48 h-4 bg-gray-700 rounded-full shadow-lg"></div>
        </div>
      );
    }

    return null;
  };

  if (gameState === 'CONFIG') {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-xl text-retro-amber uppercase">{theme.name}</h2>
          <div className="w-24"></div>
        </div>

        <div className="bg-black/40 border border-gray-700 p-8 rounded-lg flex flex-col items-center gap-6 mb-8 max-w-lg w-full">
          <div className="text-6xl mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {theme.icon}
          </div>
          <p className="font-retro text-center text-gray-400 px-4">{theme.description}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex flex-col items-center">
              <label className="font-pixel text-xs text-gray-500 mb-2">MIN</label>
              <input
                type="text"
                value={inputMin}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setInputMin(e.target.value);
                }}
                maxLength={2}
                className="w-20 bg-retro-dark border-2 border-retro-green text-3xl font-retro text-center text-retro-green focus:outline-none focus:shadow-[0_0_15px_rgba(51,255,0,0.3)]"
              />
            </div>
            <span className="text-4xl font-retro text-gray-500 mt-6">:</span>
            <div className="flex flex-col items-center">
              <label className="font-pixel text-xs text-gray-500 mb-2">SEC</label>
              <input
                type="text"
                value={inputSec}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setInputSec(e.target.value);
                }}
                maxLength={2}
                className="w-20 bg-retro-dark border-2 border-retro-green text-3xl font-retro text-center text-retro-green focus:outline-none focus:shadow-[0_0_15px_rgba(51,255,0,0.3)]"
              />
            </div>
          </div>
        </div>

        <RetroButton label="START" onClick={startTimer} className="w-64" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Timer Display */}
      <div className="mb-8 transform scale-90 sm:scale-100">
         <DigitalDisplay 
            timeMs={timeLeft} 
            showMs={false}
            color={gameState === 'FINISHED' ? 'red' : 'green'} 
            isFlashing={gameState === 'FINISHED'}
         />
      </div>

      {/* Visual Area */}
      <div className="w-full h-80 sm:h-96 border-4 border-gray-700 bg-black relative flex items-center justify-center overflow-hidden mb-8 p-4">
         {renderVisual()}
         
         {/* Background Effect for ambience */}
         <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]"></div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {gameState === 'RUNNING' && (
           <RetroButton label="RESET" onClick={reset} variant="danger" />
        )}
        {gameState === 'FINISHED' && (
           <RetroButton label="NEW TIMER" onClick={reset} />
        )}
        <RetroButton label="EXIT" onClick={onBack} variant="neutral" />
      </div>
    </div>
  );
};