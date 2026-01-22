import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from './RetroButton';

export type GroupThemeType = 'terminal' | 'cogs' | 'magic';

export interface GroupTheme {
  id: string;
  name: string;
  type: GroupThemeType;
  icon: string;
  description: string;
}

interface GroupGeneratorEngineProps {
  theme: GroupTheme;
  onBack: () => void;
}

export const GroupGeneratorEngine: React.FC<GroupGeneratorEngineProps> = ({ theme, onBack }) => {
  const [mode, setMode] = useState<'INPUT' | 'PROCESSING' | 'RESULT'>('INPUT');
  const [namesText, setNamesText] = useState('');
  const [groupCount, setGroupCount] = useState<number>(2);
  const [groups, setGroups] = useState<string[][]>([]);
  
  // Animation state
  const [processProgress, setProcessProgress] = useState(0);

  const processIntervalRef = useRef<number | null>(null);

  const playProcessSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (theme.type === 'cogs') {
      // Mechanical grinding
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    } else if (theme.type === 'magic') {
      // Sparkly
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    } else {
      // Data processing
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    }
    
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  };

  const handleGenerate = () => {
    // 1. Validate Input
    const names = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    
    if (names.length < 2) {
      alert("Please enter at least 2 names.");
      return;
    }
    
    if (groupCount < 2 || groupCount > names.length) {
      alert(`Group count must be between 2 and ${names.length} (the number of names).`);
      return;
    }

    setMode('PROCESSING');
    setProcessProgress(0);

    // 2. Logic: Shuffle and Distribute
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newGroups: string[][] = Array.from({ length: groupCount }, () => []);
    
    shuffled.forEach((name, index) => {
      newGroups[index % groupCount].push(name);
    });

    setGroups(newGroups);

    // 3. Animation Loop
    let progress = 0;
    const speed = theme.type === 'terminal' ? 20 : 50; // Terminal is faster
    const totalSteps = 100;

    const runLoop = () => {
      progress += 2;
      setProcessProgress(progress);
      
      if (progress % 10 === 0) playProcessSound();

      if (progress < totalSteps) {
        processIntervalRef.current = window.setTimeout(runLoop, speed);
      } else {
        setMode('RESULT');
      }
    };

    runLoop();
  };

  const reset = () => {
    setMode('INPUT');
    setGroups([]);
    setProcessProgress(0);
  };

  useEffect(() => {
    return () => {
      if (processIntervalRef.current) clearTimeout(processIntervalRef.current);
    };
  }, []);

  // --- Render Helpers ---

  const renderProcessing = () => {
    if (theme.type === 'terminal') {
      return (
        <div className="flex flex-col items-center justify-center h-64 w-full bg-black border-4 border-retro-green p-4">
           <div className="w-full text-retro-green font-retro text-sm mb-2 text-left">
             {`> INITIATING SORT ALGORITHM...`}
             <br/>
             {`> ALLOCATING MEMORY BLOCKS...`}
             <br/>
             {`> RANDOMIZING SEEDS... [${processProgress}%]`}
           </div>
           <div className="w-full h-4 bg-gray-900 border border-retro-green mt-4">
              <div className="h-full bg-retro-green" style={{ width: `${processProgress}%` }}></div>
           </div>
           <div className="mt-4 font-pixel animate-blink">PROCESSING_DATA</div>
        </div>
      );
    }

    if (theme.type === 'cogs') {
      return (
        <div className="flex flex-col items-center justify-center h-64 relative overflow-hidden">
           <div className="absolute top-0 right-10 text-9xl animate-[spin_3s_linear_infinite] opacity-50">⚙️</div>
           <div className="absolute bottom-0 left-10 text-8xl animate-[spin_4s_linear_infinite_reverse] opacity-50">⚙️</div>
           <div className="z-10 bg-black/80 p-6 border-2 border-gray-500 text-center">
              <h2 className="font-pixel text-xl text-retro-amber mb-2">CRUNCHING</h2>
              <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-retro-amber transition-all" style={{ width: `${processProgress}%` }}></div>
              </div>
           </div>
        </div>
      );
    }

    if (theme.type === 'magic') {
      return (
        <div className="flex flex-col items-center justify-center h-64">
           <div className="text-9xl animate-bounce mb-4">🎩</div>
           <div className="font-retro text-2xl text-purple-400">Castings Spells...</div>
           <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping delay-75"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping delay-150"></div>
           </div>
        </div>
      );
    }
  };

  const renderResults = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-[fadeIn_0.5s_ease-out]">
        {groups.map((group, idx) => (
          <div key={idx} className={`
             border-2 p-4 relative bg-black/80
             ${theme.type === 'magic' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 
               theme.type === 'cogs' ? 'border-gray-500 border-dashed' : 
               'border-retro-green'}
          `}>
             <div className={`
                absolute -top-3 left-4 px-2 font-pixel text-xs bg-black
                ${theme.type === 'magic' ? 'text-purple-400' : theme.type === 'cogs' ? 'text-gray-400' : 'text-retro-green'}
             `}>
               GROUP {idx + 1}
             </div>
             
             <ul className="mt-2 space-y-2">
               {group.map((name, nIdx) => (
                 <li key={nIdx} className="font-retro text-xl border-b border-gray-800 pb-1 last:border-0 text-gray-300">
                   {name}
                 </li>
               ))}
             </ul>
          </div>
        ))}
      </div>
    );
  };

  if (mode === 'INPUT') {
    return (
      <div className="w-full flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-full flex justify-between items-center mb-6 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-lg sm:text-xl text-retro-amber uppercase truncate ml-4">{theme.name}</h2>
        </div>

        <div className="w-full bg-retro-dark border border-gray-700 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
             <label className="font-pixel text-xs text-retro-green">1. ENTER NAMES (One per line)</label>
             <textarea 
               value={namesText}
               onChange={(e) => setNamesText(e.target.value)}
               className="w-full h-48 bg-black border-2 border-retro-green/50 text-retro-green font-retro text-xl p-4 focus:outline-none focus:border-retro-green scrollbar-thin scrollbar-thumb-retro-green scrollbar-track-gray-900 placeholder-green-900/50"
               placeholder={`Alice\nBob\nCharlie\nDave\nEve\nFrank`}
             />
          </div>
          
          <div className="flex flex-col gap-2">
             <label className="font-pixel text-xs text-retro-green">2. NUMBER OF GROUPS</label>
             <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="2" 
                  max="50" 
                  value={groupCount}
                  onChange={(e) => setGroupCount(parseInt(e.target.value))}
                  className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-retro-green"
                />
                <div className="w-16 h-12 flex items-center justify-center bg-black border-2 border-retro-green text-2xl font-retro text-retro-green">
                   {groupCount}
                </div>
             </div>
          </div>
          
          <RetroButton label="CREATE GROUPS >" onClick={handleGenerate} className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-6">
          <RetroButton label={mode === 'PROCESSING' ? "..." : "< Restart"} onClick={reset} variant="neutral" className="py-2 px-4" disabled={mode === 'PROCESSING'} />
          <h2 className="font-pixel text-xs sm:text-sm text-gray-500 uppercase">
             {mode === 'PROCESSING' ? 'GENERATING...' : 'GENERATION COMPLETE'}
          </h2>
       </div>

      <div className="mb-8 relative w-full max-w-5xl min-h-[400px]">
         {mode === 'PROCESSING' ? renderProcessing() : renderResults()}
      </div>

      {mode === 'RESULT' && (
         <div className="flex gap-4">
            <RetroButton label="SHUFFLE AGAIN" onClick={handleGenerate} className="w-64" />
            <RetroButton label="EXIT" onClick={onBack} variant="danger" />
         </div>
      )}
    </div>
  );
};