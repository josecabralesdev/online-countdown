import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RetroButton } from './RetroButton';
import { DigitalDisplay } from './DigitalDisplay';

export interface TimerTheme {
  id: string;
  name: string;
  type: 'classic' | 'bar' | 'random_number' | 'bomb';
  icon: string; // The main icon (e.g., Egg, Bomb)
  endIcon?: string; // The icon to show when finished (e.g., Hatched Egg, Explosion)
  color?: 'green' | 'red' | 'amber';
}

interface TimerEngineProps {
  theme: TimerTheme;
  onBack: () => void;
}

export const TimerEngine: React.FC<TimerEngineProps> = ({ theme, onBack }) => {
  const [gameState, setGameState] = useState<'CONFIG' | 'RUNNING' | 'FINISHED'>('CONFIG');
  const [duration, setDuration] = useState<number>(0); // Total duration in ms
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Input states
  const [inputMin, setInputMin] = useState('05');
  const [inputSec, setInputSec] = useState('00');

  // Random number result
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

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
    setRandomNumber(null);

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
    if (theme.type === 'random_number') {
      setRandomNumber(Math.floor(Math.random() * 100) + 1);
    }
    playSound();
  };

  const playSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Retro alarm sound
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
    oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const reset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState('CONFIG');
    setTimeLeft(0);
  };

  const progressPct = duration > 0 ? (timeLeft / duration) * 100 : 0;
  
  // Visual wobble for Bomb timer when low on time
  const isUrgent = timeLeft < 5000 && timeLeft > 0;
  const shakeClass = isUrgent ? 'animate-[spin_0.1s_ease-in-out_infinite]' : '';

  if (gameState === 'CONFIG') {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-xl text-retro-amber uppercase">{theme.name}</h2>
          <div className="w-24"></div>
        </div>

        <div className="bg-black/40 border border-gray-700 p-8 rounded-lg flex flex-col items-center gap-6 mb-8">
          <div className="text-6xl mb-2 filter drop-shadow-[0_0_10px_rgba(51,255,0,0.3)]">
            {theme.icon}
          </div>
          
          <div className="flex items-center gap-4">
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

        <RetroButton label="START TIMER" onClick={startTimer} className="w-64" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Timer Display */}
      <div className="mb-8 transform scale-90 sm:scale-100">
         <DigitalDisplay 
            timeMs={timeLeft} 
            showMs={theme.type !== 'random_number'} // Hide MS for random number to look cleaner
            color={gameState === 'FINISHED' ? 'red' : theme.color || 'green'} 
            isFlashing={gameState === 'FINISHED'}
         />
      </div>

      {/* Visual Area */}
      <div className="w-full h-48 sm:h-64 border-4 border-gray-700 bg-black relative flex items-center justify-center overflow-hidden mb-8">
        
        {/* Bar Timer Specifics */}
        {theme.type === 'bar' && gameState === 'RUNNING' && (
          <div className="absolute left-4 right-4 h-16 border-2 border-gray-600 p-1">
            <div 
              className="h-full bg-retro-green transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(51,255,0,0.5)]"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        )}

        {/* Central Icon Logic */}
        <div className={`text-8xl sm:text-9xl transition-all duration-300 ${shakeClass}`}>
          {gameState === 'FINISHED' 
            ? (theme.endIcon || theme.icon) 
            : theme.icon
          }
        </div>

        {/* Bomb Fuse (Visual only) */}
        {theme.type === 'bomb' && gameState === 'RUNNING' && (
           <div className="absolute top-4 right-4 font-retro text-retro-red animate-pulse text-xl">
             DANGER
           </div>
        )}

        {/* Random Number Reveal */}
        {theme.type === 'random_number' && gameState === 'FINISHED' && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center flex-col animate-[zoomIn_0.5s_ease-out]">
            <span className="font-pixel text-retro-amber text-xs mb-4">THE MAGIC NUMBER IS</span>
            <span className="font-retro text-9xl text-retro-green drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {randomNumber}
            </span>
          </div>
        )}

        {/* Finished Text Overlay for non-special types */}
        {gameState === 'FINISHED' && theme.type !== 'random_number' && (
          <div className="absolute bottom-4 font-pixel text-retro-red animate-blink text-lg">
            {theme.type === 'bomb' ? 'EXPLOSION!' : "TIME'S UP!"}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {gameState === 'RUNNING' && (
           <RetroButton label="ABORT" onClick={reset} variant="danger" />
        )}
        {gameState === 'FINISHED' && (
           <RetroButton label="NEW TIMER" onClick={reset} />
        )}
        <RetroButton label="EXIT" onClick={onBack} variant="neutral" />
      </div>
    </div>
  );
};