import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RetroButton } from './RetroButton';
import { DigitalDisplay } from './DigitalDisplay';

export type PresentationThemeType = 'traffic_light' | 'bar' | 'ring';

export interface PresentationTheme {
  id: string;
  name: string;
  type: PresentationThemeType;
  icon: string;
  description: string;
}

interface PresentationTimerEngineProps {
  theme: PresentationTheme;
  onBack: () => void;
}

export const PresentationTimerEngine: React.FC<PresentationTimerEngineProps> = ({ theme, onBack }) => {
  const [gameState, setGameState] = useState<'CONFIG' | 'RUNNING' | 'FINISHED'>('CONFIG');
  const [totalTime, setTotalTime] = useState(0);
  const [warningTime, setWarningTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Inputs
  const [totalMin, setTotalMin] = useState('05');
  const [totalSec, setTotalSec] = useState('00');
  const [warnMin, setWarnMin] = useState('01');
  const [warnSec, setWarnSec] = useState('00');

  // Logic Phase
  const [currentPhase, setCurrentPhase] = useState<'GREEN' | 'AMBER' | 'RED'>('GREEN');

  const endTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();

  // --- Audio ---
  const playChime = (freq: number) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
  };

  const startTimer = () => {
    const tMin = parseInt(totalMin) || 0;
    const tSec = parseInt(totalSec) || 0;
    const totalMs = (tMin * 60 + tSec) * 1000;

    const wMin = parseInt(warnMin) || 0;
    const wSec = parseInt(warnSec) || 0;
    const warnMs = (wMin * 60 + wSec) * 1000;

    if (totalMs <= 0) return;
    if (warnMs >= totalMs) {
      alert("Warning time must be less than total time.");
      return;
    }

    setTotalTime(totalMs);
    setWarningTime(warnMs);
    setTimeLeft(totalMs);
    setCurrentPhase('GREEN');
    setGameState('RUNNING');
    
    // Play start chime
    playChime(600);

    endTimeRef.current = Date.now() + totalMs;
    requestRef.current = requestAnimationFrame(loop);
  };

  const loop = useCallback(() => {
    const now = Date.now();
    const remaining = endTimeRef.current - now; // Allow negative for overtime logic if we wanted, but let's stick to 0
    
    const displayTime = Math.max(0, remaining);
    setTimeLeft(displayTime);

    // Determine Phase
    if (displayTime <= 0) {
      if (currentPhase !== 'RED') {
        setCurrentPhase('RED');
        playChime(200); // Low tone for end
      }
      setGameState('FINISHED');
      // Stop loop at 0
      return; 
    } else if (displayTime <= warningTime) {
      if (currentPhase !== 'AMBER') {
        setCurrentPhase('AMBER');
        playChime(440); // Mid tone for warning
      }
    } else {
      if (currentPhase !== 'GREEN') {
        setCurrentPhase('GREEN');
      }
    }

    requestRef.current = requestAnimationFrame(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningTime, currentPhase]); // Dependencies needed for phase change checks logic inside callback scope? actually useRefs handle most, but state updates trigger re-renders.

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const reset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState('CONFIG');
    setTimeLeft(0);
    setCurrentPhase('GREEN');
  };

  // --- Visuals ---

  const renderTrafficLight = () => {
    return (
      <div className="bg-black p-6 rounded-3xl border-8 border-gray-800 flex flex-col gap-6 shadow-2xl">
         {/* Red Light */}
         <div className={`
            w-24 h-24 rounded-full border-4 border-gray-900 transition-all duration-300
            ${currentPhase === 'RED' || gameState === 'FINISHED' 
               ? 'bg-retro-red shadow-[0_0_50px_rgba(255,51,51,0.8)] scale-110' 
               : 'bg-retro-red/20 opacity-30'}
         `}></div>
         
         {/* Amber Light */}
         <div className={`
            w-24 h-24 rounded-full border-4 border-gray-900 transition-all duration-300
            ${currentPhase === 'AMBER' 
               ? 'bg-retro-amber shadow-[0_0_50px_rgba(255,176,0,0.8)] scale-110' 
               : 'bg-retro-amber/20 opacity-30'}
         `}></div>

         {/* Green Light */}
         <div className={`
            w-24 h-24 rounded-full border-4 border-gray-900 transition-all duration-300
            ${currentPhase === 'GREEN' 
               ? 'bg-retro-green shadow-[0_0_50px_rgba(51,255,0,0.8)] scale-110' 
               : 'bg-retro-green/20 opacity-30'}
         `}></div>
      </div>
    );
  };

  const renderBar = () => {
    const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    
    let barColor = 'bg-retro-green';
    let shadowColor = 'rgba(51,255,0,0.5)';
    if (currentPhase === 'AMBER') {
      barColor = 'bg-retro-amber';
      shadowColor = 'rgba(255,176,0,0.5)';
    } else if (currentPhase === 'RED') {
      barColor = 'bg-retro-red';
      shadowColor = 'rgba(255,51,51,0.5)';
    }

    return (
      <div className="w-full max-w-lg h-32 border-8 border-gray-700 bg-black rounded-lg p-2 flex items-center">
         <div 
           className={`h-full transition-all duration-100 ease-linear ${barColor}`}
           style={{ 
             width: `${progress}%`,
             boxShadow: `0 0 20px ${shadowColor}`
           }}
         ></div>
      </div>
    );
  };

  const renderRing = () => {
    // Circumference for r=80 is ~502
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? (timeLeft / totalTime) : 0;
    const dashOffset = circumference * (1 - progress);

    let strokeColor = '#33ff00'; // Green
    if (currentPhase === 'AMBER') strokeColor = '#ffb000';
    if (currentPhase === 'RED') strokeColor = '#ff3333';

    return (
      <div className="relative w-64 h-64 flex items-center justify-center">
         <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="20" />
            
            {/* Progress Circle */}
            <circle 
              cx="100" 
              cy="100" 
              r={radius} 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-100 ease-linear"
              style={{ filter: `drop-shadow(0 0 10px ${strokeColor})` }}
            />
         </svg>
         <div className="absolute font-pixel text-4xl" style={{ color: strokeColor }}>
            {currentPhase}
         </div>
      </div>
    );
  };

  if (gameState === 'CONFIG') {
    return (
      <div className="w-full flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-lg sm:text-xl text-retro-amber uppercase truncate ml-4">{theme.name}</h2>
        </div>

        <div className="w-full bg-retro-dark border border-gray-700 p-8 rounded-lg flex flex-col gap-8">
           <div className="flex flex-col sm:flex-row gap-8 justify-center">
              
              {/* Total Duration Config */}
              <div className="flex flex-col items-center gap-2">
                 <label className="font-pixel text-xs text-retro-green mb-2">TOTAL DURATION</label>
                 <div className="flex items-center gap-2">
                    <input 
                       type="text" value={totalMin} onChange={e => setTotalMin(e.target.value)} maxLength={2}
                       className="w-16 h-16 bg-black border-2 border-retro-green text-3xl text-center text-retro-green font-retro focus:outline-none focus:shadow-[0_0_10px_rgba(51,255,0,0.5)]"
                    />
                    <span className="text-2xl text-gray-500">:</span>
                    <input 
                       type="text" value={totalSec} onChange={e => setTotalSec(e.target.value)} maxLength={2}
                       className="w-16 h-16 bg-black border-2 border-retro-green text-3xl text-center text-retro-green font-retro focus:outline-none focus:shadow-[0_0_10px_rgba(51,255,0,0.5)]"
                    />
                 </div>
              </div>

              {/* Warning Config */}
              <div className="flex flex-col items-center gap-2">
                 <label className="font-pixel text-xs text-retro-amber mb-2">AMBER WARNING (@ remaining)</label>
                 <div className="flex items-center gap-2">
                    <input 
                       type="text" value={warnMin} onChange={e => setWarnMin(e.target.value)} maxLength={2}
                       className="w-16 h-16 bg-black border-2 border-retro-amber text-3xl text-center text-retro-amber font-retro focus:outline-none focus:shadow-[0_0_10px_rgba(255,176,0,0.5)]"
                    />
                    <span className="text-2xl text-gray-500">:</span>
                    <input 
                       type="text" value={warnSec} onChange={e => setWarnSec(e.target.value)} maxLength={2}
                       className="w-16 h-16 bg-black border-2 border-retro-amber text-3xl text-center text-retro-amber font-retro focus:outline-none focus:shadow-[0_0_10px_rgba(255,176,0,0.5)]"
                    />
                 </div>
              </div>

           </div>
           
           <RetroButton label="START PRESENTATION" onClick={startTimer} className="mt-4" />
        </div>
      </div>
    );
  }

  // Running View
  return (
    <div className="w-full flex flex-col items-center">
       <div className="mb-8 transform scale-90 sm:scale-100">
         <DigitalDisplay 
            timeMs={timeLeft} 
            showMs={false} 
            color={currentPhase === 'RED' ? 'red' : currentPhase === 'AMBER' ? 'amber' : 'green'} 
            isFlashing={gameState === 'FINISHED'}
         />
      </div>

      <div className="mb-12 flex justify-center w-full min-h-[300px] items-center">
         {theme.type === 'traffic_light' && renderTrafficLight()}
         {theme.type === 'bar' && renderBar()}
         {theme.type === 'ring' && renderRing()}
      </div>

      <div className="flex gap-4">
        {gameState === 'RUNNING' && (
           <RetroButton label="STOP / RESET" onClick={reset} variant="danger" />
        )}
        {gameState === 'FINISHED' && (
           <RetroButton label="NEW TIMER" onClick={reset} />
        )}
        <RetroButton label="EXIT" onClick={onBack} variant="neutral" />
      </div>
    </div>
  );
};