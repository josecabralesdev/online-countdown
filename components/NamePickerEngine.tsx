import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from './RetroButton';

export type PickerType = 'slot' | 'wheel' | 'box' | 'card';

interface NamePickerEngineProps {
  title: string;
  icon: string;
  type: PickerType;
  onBack: () => void;
}

export const NamePickerEngine: React.FC<NamePickerEngineProps> = ({ title, icon, type, onBack }) => {
  const [mode, setMode] = useState<'INPUT' | 'READY' | 'PICKING' | 'RESULT'>('INPUT');
  const [namesText, setNamesText] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string>('READY');
  const [winner, setWinner] = useState<string | null>(null);
  
  const spinIntervalRef = useRef<number | null>(null);

  // Parse names from textarea
  const handleLoadNames = () => {
    const rawNames = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    
    if (rawNames.length === 0) {
      alert("Please enter at least one name.");
      return;
    }

    if (rawNames.length > 100) {
      alert("FREE USER LIMIT: Maximum 100 names. Upgrade to Premium for 10,000!");
      setNames(rawNames.slice(0, 100));
    } else {
      setNames(rawNames);
    }
    setMode('READY');
    setCurrentDisplay('READY');
  };

  const playTickSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  };

  const playWinSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'triangle';
    // Arpeggio effect
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(554, audioCtx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.6);
  };

  const spin = () => {
    if (names.length === 0) return;
    
    setWinner(null);
    setMode('PICKING');
    
    // Determine animation duration
    let speed = 50;
    let duration = 0;
    const maxDuration = 2500; // 2.5s spin

    // Logic depending on type
    // Slot/Wheel: Cycle names
    // Box/Card: Just wait for timer then reveal
    
    const runLoop = () => {
      // Logic for updating display text during spin
      if (type === 'slot' || type === 'wheel') {
        const randomIdx = Math.floor(Math.random() * names.length);
        setCurrentDisplay(names[randomIdx]);
        playTickSound();
      }

      duration += speed;
      
      // Decelerate
      if (duration > maxDuration * 0.7) {
        speed += 30;
      }

      if (duration < maxDuration) {
        spinIntervalRef.current = window.setTimeout(runLoop, speed);
      } else {
        // Final Winner
        const finalWinner = names[Math.floor(Math.random() * names.length)];
        setCurrentDisplay(finalWinner);
        setWinner(finalWinner);
        setMode('RESULT');
        playWinSound();
      }
    };

    runLoop();
  };

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearTimeout(spinIntervalRef.current);
    };
  }, []);

  const reset = () => {
    setMode('INPUT');
    setWinner(null);
    setCurrentDisplay('READY');
  };

  // --- Render Helpers ---

  const renderVisuals = () => {
    // 1. RESULT STATE
    if (mode === 'RESULT' && winner) {
       return (
         <div className="flex flex-col items-center animate-bounce">
            {type === 'box' && <div className="text-8xl mb-4 animate-[ping_0.5s_ease-out]">✨</div>}
            {type === 'card' && <div className="text-8xl mb-4">🃏</div>}
            <h1 className="font-retro text-5xl sm:text-7xl md:text-8xl text-retro-amber text-center leading-tight drop-shadow-[0_0_10px_rgba(255,176,0,0.8)]">
              {winner}
            </h1>
            <p className="font-pixel text-xs text-gray-500 mt-4">WINNER SELECTED</p>
         </div>
       );
    }

    // 2. PICKING STATE (Animating)
    if (mode === 'PICKING' && !winner) {
      if (type === 'slot') {
         return (
           <h1 className="font-retro text-6xl sm:text-8xl text-retro-green opacity-80 blur-[1px]">
             {currentDisplay}
           </h1>
         );
      }
      if (type === 'wheel') {
        return (
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-dashed border-retro-green animate-spin flex items-center justify-center">
             <div className="text-4xl sm:text-6xl animate-pulse">{icon}</div>
          </div>
        );
      }
      if (type === 'box') {
        return (
          <div className="text-9xl animate-[spin_0.5s_ease-in-out_infinite] origin-bottom">
            📦
          </div>
        );
      }
      if (type === 'card') {
        return (
          <div className="w-48 h-64 bg-retro-green/10 border-4 border-retro-green flex items-center justify-center animate-[pulse_0.2s_ease-in-out_infinite]">
             <div className="font-pixel text-retro-green text-opacity-50 text-6xl">?</div>
          </div>
        );
      }
    }

    // 3. READY STATE (Idle)
    return (
      <div className="flex flex-col items-center opacity-50">
         <div className="text-8xl mb-4">{icon}</div>
         <h1 className="font-retro text-4xl text-retro-green">READY</h1>
         <p className="font-pixel text-xs text-gray-500 mt-2 animate-pulse">PRESS SPIN</p>
      </div>
    );
  };

  if (mode === 'INPUT') {
    return (
      <div className="w-full flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-lg sm:text-xl text-retro-amber uppercase truncate ml-4">{title}</h2>
        </div>

        <div className="w-full bg-retro-dark border border-gray-700 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
             <label className="font-pixel text-xs text-retro-green">ENTER NAMES (One per line)</label>
             <span className="font-retro text-xs text-retro-amber">Free Limit: 100</span>
          </div>
          
          <textarea 
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            className="w-full h-64 bg-black border-2 border-retro-green/50 text-retro-green font-retro text-xl p-4 focus:outline-none focus:border-retro-green scrollbar-thin scrollbar-thumb-retro-green scrollbar-track-gray-900"
            placeholder={`John\nJane\nBob\nAlice...`}
          />
          
          <RetroButton label="LOAD DATA >" onClick={handleLoadNames} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-6">
          <RetroButton label="Edit List" onClick={reset} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-xs sm:text-sm text-gray-500 uppercase">{names.length} ENTRIES LOADED</h2>
       </div>

      <div className="mb-8 relative w-full max-w-3xl">
         {/* Main Display Box */}
         <div className={`
           w-full h-80 bg-black border-4 
           flex flex-col justify-center items-center relative overflow-hidden transition-all duration-300
           ${mode === 'RESULT' ? 'border-retro-amber shadow-[0_0_30px_rgba(255,176,0,0.3)]' : 'border-gray-700'}
         `}>
            
            {renderVisuals()}

            {/* Decorative Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
         </div>
      </div>

      <div className="flex gap-4">
         <RetroButton 
           label={mode === 'RESULT' ? "SPIN AGAIN" : "SPIN!"} 
           onClick={spin} 
           className="w-48 sm:w-64 text-lg"
           disabled={mode === 'PICKING' || mode === 'INPUT'}
         />
         <RetroButton label="EXIT" onClick={onBack} variant="danger" />
      </div>
    </div>
  );
};