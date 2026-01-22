import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from './RetroButton';

export type NumberThemeType = 'digital' | 'bingo' | 'magic' | 'dice';

export interface NumberTheme {
  id: string;
  name: string;
  type: NumberThemeType;
  icon: string;
  defaultMin: number;
  defaultMax: number;
}

interface RandomNumberEngineProps {
  theme: NumberTheme;
  onBack: () => void;
}

export const RandomNumberEngine: React.FC<RandomNumberEngineProps> = ({ theme, onBack }) => {
  const [minVal, setMinVal] = useState<string>(theme.defaultMin.toString());
  const [maxVal, setMaxVal] = useState<string>(theme.defaultMax.toString());
  const [currentDisplay, setCurrentDisplay] = useState<string | number>('?');
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const rollIntervalRef = useRef<number | null>(null);

  const playTickSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.03);
  };

  const playWinSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  const handleGenerate = () => {
    const min = parseInt(minVal) || 0;
    const max = parseInt(maxVal) || 0;

    if (min >= max) {
      alert("Minimum number must be less than Maximum number.");
      return;
    }

    setIsRolling(true);
    setResult(null);

    let speed = 50;
    let duration = 0;
    const maxDuration = 1500;

    const runLoop = () => {
      // Show random number in range for visual effect
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      setCurrentDisplay(random);
      playTickSound();

      duration += speed;
      if (duration > maxDuration * 0.6) speed += 20;

      if (duration < maxDuration) {
        rollIntervalRef.current = window.setTimeout(runLoop, speed);
      } else {
        // Final Result
        const finalNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        setCurrentDisplay(finalNumber);
        setResult(finalNumber);
        setIsRolling(false);
        playWinSound();
      }
    };

    runLoop();
  };

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearTimeout(rollIntervalRef.current);
    };
  }, []);

  // --- Render Helpers ---
  
  const renderVisuals = () => {
    // Dice specific rendering
    if (theme.type === 'dice') {
       // Only if result is 1-6 show dots, otherwise numbers
       const num = typeof currentDisplay === 'number' ? currentDisplay : 0;
       if (num >= 1 && num <= 6) {
         return (
            <div className={`
              w-32 h-32 bg-white rounded-xl border-4 border-gray-300 flex items-center justify-center shadow-lg
              ${isRolling ? 'animate-spin' : ''}
              ${result ? 'animate-bounce' : ''}
            `}>
               {/* Simple Dot Representation for 1-6 could go here, but number is safer for generic ranges */}
               <span className="font-pixel text-6xl text-black">{currentDisplay}</span>
            </div>
         );
       }
    }

    // Default Rendering
    return (
      <div className="flex flex-col items-center justify-center">
         {theme.type === 'magic' && (
           <div className={`text-8xl mb-4 transition-transform ${isRolling ? 'animate-pulse' : ''} ${result ? '-translate-y-4' : ''}`}>
             {theme.icon}
           </div>
         )}
         
         <div className={`
           font-retro text-9xl text-retro-green drop-shadow-[0_0_10px_rgba(51,255,0,0.5)]
           ${isRolling ? 'blur-[2px] opacity-80' : 'opacity-100'}
           ${result ? 'scale-110 transition-transform duration-300' : ''}
         `}>
           {currentDisplay}
         </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-lg sm:text-xl text-retro-amber uppercase truncate ml-4">{theme.name}</h2>
      </div>

      {/* Main Display Area */}
      <div className="mb-8 w-full max-w-2xl">
         <div className={`
           w-full h-80 bg-black border-4 
           flex flex-col justify-center items-center relative overflow-hidden
           ${result ? 'border-retro-amber shadow-[0_0_20px_rgba(255,176,0,0.3)]' : 'border-gray-700'}
         `}>
            {renderVisuals()}
            
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
         </div>
      </div>

      {/* Input Controls */}
      <div className="flex flex-col sm:flex-row gap-8 items-center bg-gray-900/50 p-6 border border-gray-700 mb-8 rounded-sm">
         <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="font-pixel text-[10px] text-gray-500 mb-1">MINIMUM</label>
              <input 
                type="number" 
                value={minVal}
                onChange={(e) => setMinVal(e.target.value)}
                className="w-24 bg-black border-2 border-retro-green text-retro-green font-retro text-3xl text-center p-2 focus:outline-none focus:ring-2 focus:ring-retro-green"
              />
            </div>
            <span className="font-retro text-4xl text-gray-600 mt-4">-</span>
            <div className="flex flex-col">
              <label className="font-pixel text-[10px] text-gray-500 mb-1">MAXIMUM</label>
              <input 
                type="number" 
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)}
                className="w-24 bg-black border-2 border-retro-green text-retro-green font-retro text-3xl text-center p-2 focus:outline-none focus:ring-2 focus:ring-retro-green"
              />
            </div>
         </div>

         <RetroButton 
           label={isRolling ? "..." : "GENERATE!"} 
           onClick={handleGenerate} 
           className="w-48 h-16 text-lg"
           disabled={isRolling}
         />
      </div>

    </div>
  );
};