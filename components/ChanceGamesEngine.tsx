import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from './RetroButton';

export type ChanceGameType = 'dice' | '8ball' | 'coin' | 'rps';

export interface ChanceGameTheme {
  id: string;
  name: string;
  type: ChanceGameType;
  icon: string;
  description: string;
}

interface ChanceGamesEngineProps {
  theme: ChanceGameTheme;
  onBack: () => void;
}

const MAGIC_8_ANSWERS = [
  "IT IS CERTAIN", "WITHOUT A DOUBT", "YES DEFINITELY", "YOU MAY RELY ON IT",
  "AS I SEE IT YES", "MOST LIKELY", "OUTLOOK GOOD", "YES",
  "REPLY HAZY TRY AGAIN", "ASK AGAIN LATER", "BETTER NOT TELL YOU", "CANNOT PREDICT NOW",
  "DON'T COUNT ON IT", "MY REPLY IS NO", "MY SOURCES SAY NO", "OUTLOOK NOT SO GOOD"
];

const RPS_OPTIONS = [
  { id: 'rock', icon: '🪨', beats: 'scissors' },
  { id: 'paper', icon: '📄', beats: 'rock' },
  { id: 'scissors', icon: '✂️', beats: 'paper' }
];

export const ChanceGamesEngine: React.FC<ChanceGamesEngineProps> = ({ theme, onBack }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'RESULT'>('IDLE');
  const [result, setResult] = useState<any>(null); // Generic result container
  
  // Specific states
  const [diceFace, setDiceFace] = useState(1);
  const [magicAnswer, setMagicAnswer] = useState('');
  const [coinSide, setCoinSide] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [rpsUserPick, setRpsUserPick] = useState<string | null>(null);
  const [rpsCpuPick, setRpsCpuPick] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);

  // --- Sound Effects ---
  const playSound = (type: 'tick' | 'win' | 'loss') => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (type === 'tick') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'win') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'loss') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  };

  // --- Game Logic ---

  const rollDice = () => {
    setGameState('PLAYING');
    let rolls = 0;
    const maxRolls = 15;
    
    const interval = setInterval(() => {
      setDiceFace(Math.floor(Math.random() * 6) + 1);
      playSound('tick');
      rolls++;
      
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setGameState('RESULT');
        playSound('win');
      }
    }, 100);
  };

  const shake8Ball = () => {
    setGameState('PLAYING');
    setMagicAnswer('');
    
    setTimeout(() => {
      const answer = MAGIC_8_ANSWERS[Math.floor(Math.random() * MAGIC_8_ANSWERS.length)];
      setMagicAnswer(answer);
      setGameState('RESULT');
      playSound('win');
    }, 1500);
  };

  const flipCoin = () => {
    setGameState('PLAYING');
    let flips = 0;
    const maxFlips = 20;

    const interval = setInterval(() => {
      setCoinSide(prev => prev === 'HEADS' ? 'TAILS' : 'HEADS');
      playSound('tick');
      flips++;

      if (flips >= maxFlips) {
        clearInterval(interval);
        const final = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
        setCoinSide(final);
        setGameState('RESULT');
        playSound('win');
      }
    }, 80);
  };

  const playRPS = (userChoice: string) => {
    setRpsUserPick(userChoice);
    setGameState('PLAYING');
    
    // Simulate thinking
    setTimeout(() => {
      const cpuChoice = RPS_OPTIONS[Math.floor(Math.random() * RPS_OPTIONS.length)].id;
      setRpsCpuPick(cpuChoice);
      
      // Determine winner
      const userBeat = RPS_OPTIONS.find(o => o.id === userChoice)?.beats;
      if (userChoice === cpuChoice) {
        setResult('DRAW');
        playSound('tick');
      } else if (userBeat === cpuChoice) {
        setResult('WIN');
        playSound('win');
      } else {
        setResult('LOSE');
        playSound('loss');
      }
      
      setGameState('RESULT');
    }, 1000);
  };

  const reset = () => {
    setGameState('IDLE');
    setResult(null);
    setMagicAnswer('');
    setRpsUserPick(null);
    setRpsCpuPick(null);
  };

  // --- Renderers ---

  const renderDice = () => {
    // Helper to render dots
    const dots = [];
    if ([1, 3, 5].includes(diceFace)) dots.push('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'); // Center
    if ([2, 3, 4, 5, 6].includes(diceFace)) dots.push('top-4 right-4'); // Top Right
    if ([2, 3, 4, 5, 6].includes(diceFace)) dots.push('bottom-4 left-4'); // Bottom Left
    if ([4, 5, 6].includes(diceFace)) dots.push('top-4 left-4'); // Top Left
    if ([4, 5, 6].includes(diceFace)) dots.push('bottom-4 right-4'); // Bottom Right
    if ([6].includes(diceFace)) dots.push('top-1/2 left-4 -translate-y-1/2'); // Middle Left
    if ([6].includes(diceFace)) dots.push('top-1/2 right-4 -translate-y-1/2'); // Middle Right

    return (
      <div className={`
        w-48 h-48 bg-white rounded-3xl relative shadow-[0_0_30px_rgba(255,255,255,0.2)] border-8 border-gray-300
        ${gameState === 'PLAYING' ? 'animate-[spin_0.3s_linear_infinite]' : ''}
        ${gameState === 'RESULT' ? 'animate-bounce' : ''}
      `}>
        {dots.map((pos, i) => (
          <div key={i} className={`absolute w-8 h-8 bg-black rounded-full shadow-inner ${pos}`}></div>
        ))}
      </div>
    );
  };

  const render8Ball = () => {
    return (
      <div className={`
        relative w-64 h-64 bg-black rounded-full border-b-8 border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden
        ${gameState === 'PLAYING' ? 'animate-[shake_0.5s_infinite]' : ''}
      `}>
        {/* Shine */}
        <div className="absolute top-4 right-8 w-16 h-8 bg-white/10 rounded-full rotate-[-45deg] blur-md"></div>
        
        {/* Inner Window */}
        <div className="w-32 h-32 rounded-full bg-blue-900 border-4 border-gray-800 flex items-center justify-center text-center p-4 shadow-inner">
           {gameState === 'IDLE' && <span className="font-pixel text-4xl text-white/20">8</span>}
           {gameState === 'PLAYING' && <div className="w-full h-full bg-blue-800 animate-pulse rounded-full"></div>}
           {gameState === 'RESULT' && (
             <div className="text-retro-green font-pixel text-[10px] leading-relaxed animate-pulse uppercase">
               {magicAnswer}
             </div>
           )}
        </div>
      </div>
    );
  };

  const renderCoin = () => {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className={`
          w-48 h-48 rounded-full border-8 border-yellow-600 bg-yellow-400 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,215,0,0.4)]
          ${gameState === 'PLAYING' ? 'animate-[flip_0.2s_linear_infinite]' : ''}
        `}>
           <div className="absolute inset-2 border-2 border-yellow-600/50 rounded-full border-dashed"></div>
           <span className="font-retro text-8xl text-yellow-700 drop-shadow-md">
             {coinSide === 'HEADS' ? '$' : '¢'}
           </span>
        </div>
        
        <div className="font-pixel text-2xl text-retro-amber min-h-[32px]">
          {gameState === 'RESULT' ? coinSide : (gameState === 'PLAYING' ? 'FLIPPING...' : 'HEADS OR TAILS?')}
        </div>
      </div>
    );
  };

  const renderRPS = () => {
    if (gameState === 'IDLE') {
      return (
        <div className="flex gap-4">
          {RPS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => playRPS(opt.id)}
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-retro-green bg-black hover:bg-retro-green/20 flex items-center justify-center text-5xl sm:text-6xl transition-all hover:-translate-y-2 rounded-lg"
            >
              {opt.icon}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-8 w-full">
         <div className="flex justify-between items-center w-full max-w-md px-4">
            {/* Player */}
            <div className="flex flex-col items-center">
               <span className="font-pixel text-xs text-retro-green mb-2">YOU</span>
               <div className="w-24 h-24 border-4 border-retro-green bg-black flex items-center justify-center text-5xl rounded-lg">
                  {RPS_OPTIONS.find(o => o.id === rpsUserPick)?.icon}
               </div>
            </div>

            <div className="font-retro text-4xl text-gray-500">VS</div>

            {/* CPU */}
            <div className="flex flex-col items-center">
               <span className="font-pixel text-xs text-retro-red mb-2">CPU</span>
               <div className="w-24 h-24 border-4 border-retro-red bg-black flex items-center justify-center text-5xl rounded-lg">
                  {gameState === 'PLAYING' 
                    ? <span className="animate-spin">❓</span> 
                    : RPS_OPTIONS.find(o => o.id === rpsCpuPick)?.icon
                  }
               </div>
            </div>
         </div>

         {gameState === 'RESULT' && (
           <div className={`
             font-pixel text-2xl sm:text-4xl animate-bounce mt-4
             ${result === 'WIN' ? 'text-retro-green' : result === 'LOSE' ? 'text-retro-red' : 'text-retro-amber'}
           `}>
             {result === 'WIN' ? 'YOU WIN!' : result === 'LOSE' ? 'YOU LOSE!' : 'DRAW!'}
           </div>
         )}
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-lg sm:text-xl text-retro-amber uppercase truncate ml-4">{theme.name}</h2>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center py-8 w-full min-h-[300px]">
         {theme.type === 'dice' && renderDice()}
         {theme.type === '8ball' && render8Ball()}
         {theme.type === 'coin' && renderCoin()}
         {theme.type === 'rps' && renderRPS()}
      </div>
      
      <div className="mt-8 flex gap-4">
        {theme.type === 'dice' && (
          <RetroButton label="ROLL DICE" onClick={rollDice} disabled={gameState === 'PLAYING'} className="w-48" />
        )}
        {theme.type === '8ball' && (
          <RetroButton label="SHAKE" onClick={shake8Ball} disabled={gameState === 'PLAYING'} className="w-48" />
        )}
        {theme.type === 'coin' && (
          <RetroButton label="FLIP COIN" onClick={flipCoin} disabled={gameState === 'PLAYING'} className="w-48" />
        )}
        {/* RPS controls are inside the game area for selection, but we need a Reset button if result is shown */}
        {theme.type === 'rps' && gameState === 'RESULT' && (
           <RetroButton label="PLAY AGAIN" onClick={reset} className="w-48" />
        )}
      </div>
    </div>
  );
};