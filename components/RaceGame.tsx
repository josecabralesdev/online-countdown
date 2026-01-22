import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RetroButton } from './RetroButton';
import { DigitalDisplay } from './DigitalDisplay';

export type RaceTheme = {
  id: string;
  name: string;
  icon: string; // Default icon
  isRandomEmoji?: boolean;
};

interface Racer {
  id: number;
  name: string;
  icon: string;
  progress: number; // 0-100
  rank: number | null;
  speedFactor: number;
  wobble: number; // Visual y-axis offset for animation
}

interface RaceGameProps {
  theme: RaceTheme;
  onBack: () => void;
}

const RANDOM_EMOJIS = ['👽', '👾', '🤖', '🎃', '🤡', '🤠', '👻', '💩', '🐵', '🦄', '🐝', '🦀', '🎲', '💎', '🚀'];

export const RaceGame: React.FC<RaceGameProps> = ({ theme, onBack }) => {
  const [gameState, setGameState] = useState<'CONFIG' | 'RACING' | 'FINISHED'>('CONFIG');
  const [racers, setRacers] = useState<Racer[]>([
    { id: 1, name: 'Player 1', icon: theme.icon, progress: 0, rank: null, speedFactor: 1, wobble: 0 },
    { id: 2, name: 'Player 2', icon: theme.icon, progress: 0, rank: null, speedFactor: 1, wobble: 0 },
  ]);
  const [raceTime, setRaceTime] = useState(0);
  const [winner, setWinner] = useState<Racer | null>(null);

  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();
  const finishedCountRef = useRef<number>(0);

  // --- Configuration Logic ---

  const addRacer = () => {
    if (racers.length >= 6) {
      alert("FREE VERSION LIMIT: Upgrade to PREMIUM for up to 100 racers!");
      return;
    }
    const newId = racers.length > 0 ? Math.max(...racers.map(r => r.id)) + 1 : 1;
    setRacers([...racers, { 
      id: newId, 
      name: `Player ${newId}`, 
      icon: theme.isRandomEmoji ? RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)] : theme.icon, 
      progress: 0, 
      rank: null,
      speedFactor: 1,
      wobble: 0
    }]);
  };

  const removeRacer = (id: number) => {
    setRacers(racers.filter(r => r.id !== id));
  };

  const updateRacerName = (id: number, name: string) => {
    setRacers(racers.map(r => r.id === id ? { ...r, name } : r));
  };

  const randomizeIcons = () => {
    if (!theme.isRandomEmoji) return;
    setRacers(racers.map(r => ({
      ...r,
      icon: RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)]
    })));
  };

  // --- Race Logic ---

  const startRace = () => {
    // Reset state
    setRacers(racers.map(r => ({ 
      ...r, 
      progress: 0, 
      rank: null, 
      speedFactor: 0.8 + Math.random() * 0.4, // Base speed variance
      wobble: 0
    })));
    setRaceTime(0);
    setWinner(null);
    finishedCountRef.current = 0;
    
    setGameState('RACING');
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = useCallback(() => {
    const now = Date.now();
    setRaceTime(now - startTimeRef.current);

    setRacers(prevRacers => {
      let allFinished = true;
      const updatedRacers = prevRacers.map(r => {
        if (r.progress >= 100) {
          return r; // Already finished
        }

        allFinished = false;
        
        // Random movement burst
        const move = (Math.random() * 0.5 + 0.1) * r.speedFactor;
        const newProgress = Math.min(100, r.progress + move);
        
        // Animation wobble
        const newWobble = Math.sin(now / 100 + r.id) * 2;

        let newRank = r.rank;
        if (newProgress >= 100 && r.rank === null) {
          finishedCountRef.current += 1;
          newRank = finishedCountRef.current;
        }

        return {
          ...r,
          progress: newProgress,
          wobble: newWobble,
          rank: newRank
        };
      });

      if (allFinished) {
        setGameState('FINISHED');
        // Find winner
        const win = updatedRacers.find(r => r.rank === 1);
        if (win) setWinner(win);
      } else {
        requestRef.current = requestAnimationFrame(gameLoop);
      }

      return updatedRacers;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // --- Renders ---

  if (gameState === 'CONFIG') {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber">{theme.name}</h2>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        <div className="w-full max-w-2xl bg-retro-green/5 border border-retro-green p-4 sm:p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-pixel text-sm text-retro-green uppercase">Participants ({racers.length}/6)</h3>
            {theme.isRandomEmoji && (
              <button onClick={randomizeIcons} className="text-xs font-retro border border-retro-green/50 px-2 py-1 hover:bg-retro-green hover:text-black transition-colors">
                Re-roll Icons 🎲
              </button>
            )}
          </div>
          
          <div className="space-y-3 mb-6">
            {racers.map((racer, index) => (
              <div key={racer.id} className="flex gap-2 items-center">
                <span className="font-retro text-xl w-8 text-center select-none">{index + 1}.</span>
                <div className="w-10 h-10 flex items-center justify-center bg-black border border-retro-green/50 text-2xl select-none">
                  {racer.icon}
                </div>
                <input 
                  type="text" 
                  value={racer.name}
                  onChange={(e) => updateRacerName(racer.id, e.target.value)}
                  className="flex-grow bg-black border border-retro-green/50 text-retro-green font-retro text-xl px-2 focus:outline-none focus:border-retro-green h-10"
                  maxLength={20}
                />
                <button 
                  onClick={() => removeRacer(racer.id)}
                  disabled={racers.length <= 2}
                  className="w-10 h-10 flex items-center justify-center border border-retro-red text-retro-red hover:bg-retro-red hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-retro-red transition-colors"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <RetroButton 
              label="+ Add Racer" 
              onClick={addRacer} 
              variant="neutral"
              disabled={racers.length >= 6}
              className="text-xs disabled:opacity-50"
            />
            <div className="text-retro-green/50 font-retro text-sm self-center hidden sm:block">
              Free Version: Max 6 Racers
            </div>
          </div>
        </div>

        <RetroButton label="START RACE" onClick={startRace} className="w-full max-w-sm text-lg py-4" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 transform scale-75 sm:scale-100 transition-transform">
        <DigitalDisplay timeMs={raceTime} />
      </div>

      <div className="w-full bg-black border-4 border-gray-700 relative overflow-hidden p-2">
        {/* Track Background Elements */}
        <div className="absolute top-0 bottom-0 right-12 w-4 bg-white/20 z-0"></div> {/* Finish Line Stripe */}
        <div className="absolute top-0 bottom-0 right-12 w-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-50 z-0"></div>
        
        {racers.map((racer, idx) => (
          <div key={racer.id} className="relative h-16 sm:h-20 border-b border-dashed border-gray-700/50 flex items-center">
            {/* Lane Number */}
            <div className="absolute left-2 font-pixel text-xs text-gray-600 z-0">{idx + 1}</div>
            
            {/* Racer */}
            <div 
              className="absolute transition-transform duration-100 will-change-transform z-10 flex flex-col items-center"
              style={{ 
                left: `calc(${racer.progress}% - 3rem)`, // Offset to keep visually on track
                transform: `translateY(${racer.wobble}px)`
              }}
            >
              <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {racer.icon}
              </span>
              <span className="text-[10px] font-retro text-gray-400 bg-black/50 px-1 rounded whitespace-nowrap overflow-hidden max-w-[80px]">
                {racer.name}
              </span>
            </div>

            {/* Rank Indicator (if finished) */}
            {racer.rank && (
               <div className="absolute right-2 font-pixel text-retro-amber animate-pulse z-20 bg-black/80 px-2">
                 {racer.rank === 1 ? '1st 👑' : racer.rank === 2 ? '2nd' : racer.rank === 3 ? '3rd' : `${racer.rank}th`}
               </div>
            )}
          </div>
        ))}
      </div>

      {gameState === 'FINISHED' && winner && (
        <div className="mt-8 text-center animate-bounce">
          <p className="font-retro text-gray-400 text-xl">Winner</p>
          <h2 className="font-pixel text-3xl sm:text-4xl text-retro-green mb-4">{winner.name}</h2>
          <div className="text-6xl mb-6">{winner.icon}</div>
          <div className="flex gap-4 justify-center">
             <RetroButton label="Race Again" onClick={() => setGameState('CONFIG')} />
             <RetroButton label="Exit" onClick={onBack} variant="danger" />
          </div>
        </div>
      )}
      
      {gameState === 'RACING' && (
          <div className="mt-4">
             <RetroButton label="Abort" onClick={() => setGameState('CONFIG')} variant="danger" className="opacity-50 hover:opacity-100" />
          </div>
      )}
    </div>
  );
};