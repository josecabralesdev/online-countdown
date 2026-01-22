import React, { useState, useEffect, useRef } from 'react';
import { RetroButton } from './RetroButton';

export type ClockType = 'digital' | 'nixie' | 'analog' | 'talking';

export interface ClockTheme {
  id: string;
  name: string;
  type: ClockType;
  icon: string;
  description: string;
}

interface ClocksEngineProps {
  theme: ClockTheme;
  onBack: () => void;
}

export const ClocksEngine: React.FC<ClocksEngineProps> = ({ theme, onBack }) => {
  const [now, setNow] = useState(new Date());
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Smooth animation ref for analog
  const requestRef = useRef<number>();

  useEffect(() => {
    const updateTime = () => {
      setNow(new Date());
      requestRef.current = requestAnimationFrame(updateTime);
    };
    
    requestRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  // --- Talking Clock Logic ---
  const speakTime = () => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Convert to 12h format for natural speech
    const h12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const minStr = minutes < 10 && minutes > 0 ? `oh ${minutes}` : minutes === 0 ? "o'clock" : minutes;
    
    const text = `The time is ${h12} ${minStr} ${ampm}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- Render Helpers ---

  const renderDigital = () => {
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <div className="flex flex-col items-center">
        <div className="bg-black border-8 border-gray-800 rounded-xl p-8 shadow-[0_0_50px_rgba(51,255,0,0.1)]">
           <div className="font-retro text-7xl sm:text-9xl text-retro-green drop-shadow-[0_0_10px_rgba(51,255,0,0.8)] tracking-widest">
             {timeStr}
           </div>
        </div>
        <div className="mt-8 font-pixel text-retro-amber text-lg sm:text-xl uppercase tracking-wider">
          {dateStr}
        </div>
      </div>
    );
  };

  const renderNixie = () => {
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    
    const renderTube = (digit: string) => (
      <div className="relative w-16 h-24 sm:w-24 sm:h-36 bg-black/80 border border-gray-700 rounded-t-full rounded-b-lg flex items-center justify-center overflow-hidden mx-1 shadow-inner">
         {/* Glass reflection */}
         <div className="absolute top-2 right-2 w-4 h-16 bg-white/10 rounded-full blur-[1px]"></div>
         {/* Filament Glow */}
         <div className="absolute inset-0 bg-orange-500/10 rounded-t-full blur-md"></div>
         {/* Digit */}
         <span className="font-mono text-6xl sm:text-8xl text-orange-500 drop-shadow-[0_0_15px_rgba(255,100,0,0.9)] z-10 relative" style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>
           {digit}
         </span>
         {/* Wire mesh effect */}
         <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.3)_3px)] pointer-events-none"></div>
      </div>
    );

    return (
      <div className="flex flex-col items-center bg-gray-900 p-8 border-t-4 border-b-4 border-wood-pattern rounded-lg shadow-2xl">
         <div className="flex items-end bg-black/40 p-6 rounded-xl border border-gray-600">
            <div className="flex">{h.split('').map((d, i) => <div key={`h-${i}`}>{renderTube(d)}</div>)}</div>
            <div className="pb-8 mx-2 animate-pulse text-orange-500 text-6xl opacity-50">•</div>
            <div className="flex">{m.split('').map((d, i) => <div key={`m-${i}`}>{renderTube(d)}</div>)}</div>
            <div className="pb-8 mx-2 animate-pulse text-orange-500 text-6xl opacity-50">•</div>
            <div className="flex">{s.split('').map((d, i) => <div key={`s-${i}`}>{renderTube(d)}</div>)}</div>
         </div>
         <div className="mt-6 text-orange-400 font-retro text-xl opacity-60">VINTAGE TUBE DISPLAY</div>
      </div>
    );
  };

  const renderAnalog = () => {
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hour = now.getHours();
    const ms = now.getMilliseconds();

    // Smooth angles
    const secAngle = ((sec + ms / 1000) / 60) * 360;
    const minAngle = ((min + sec / 60) / 60) * 360;
    const hourAngle = ((hour % 12 + min / 60) / 12) * 360;

    return (
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-retro-green bg-black shadow-[0_0_30px_rgba(51,255,0,0.2)] flex items-center justify-center">
         {/* Clock Face Markers */}
         {[...Array(12)].map((_, i) => (
           <div 
             key={i} 
             className="absolute w-1 h-4 bg-retro-green/50"
             style={{ 
               top: '10px', 
               left: '50%', 
               marginLeft: '-2px',
               transformOrigin: '50% calc(50% + 140px)', // Pivot around center (radius ~150px)
               transform: `rotate(${i * 30}deg) translateY(0)` // Simple method relies on center pivot logic or absolute positioning tricks.
               // Let's use a simpler absolute positioning approach
             }}
           ></div>
         ))}
         
         {/* Correct Markers using transform origin center of clock */}
         {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
               <div className="w-1 h-3 bg-retro-green/60 mx-auto mt-2"></div>
            </div>
         ))}

         {/* Hour Hand */}
         <div 
            className="absolute w-1.5 h-20 bg-retro-green rounded-full origin-bottom"
            style={{ 
              bottom: '50%', 
              transform: `rotate(${hourAngle}deg)`,
              boxShadow: '0 0 5px rgba(51,255,0,0.5)'
            }} 
         />
         
         {/* Minute Hand */}
         <div 
            className="absolute w-1 h-28 bg-retro-green/80 rounded-full origin-bottom"
            style={{ 
              bottom: '50%', 
              transform: `rotate(${minAngle}deg)`,
              boxShadow: '0 0 5px rgba(51,255,0,0.5)'
            }} 
         />

         {/* Second Hand */}
         <div 
            className="absolute w-0.5 h-32 bg-retro-red rounded-full origin-bottom"
            style={{ 
              bottom: '50%', 
              transform: `rotate(${secAngle}deg)`,
              boxShadow: '0 0 5px rgba(255,51,51,0.5)'
            }} 
         />
         
         {/* Center Cap */}
         <div className="absolute w-4 h-4 bg-retro-green border-2 border-black rounded-full z-10"></div>
      </div>
    );
  };

  const renderTalking = () => {
    return (
       <div className="flex flex-col items-center gap-8">
          {renderDigital()}
          
          <button 
            onClick={speakTime}
            disabled={isSpeaking}
            className={`
               w-64 h-24 rounded-full border-4 flex items-center justify-center gap-4 transition-all
               ${isSpeaking 
                 ? 'border-retro-green bg-retro-green text-black scale-95' 
                 : 'border-retro-green text-retro-green hover:bg-retro-green/10 hover:scale-105 active:scale-95'}
            `}
          >
             <span className="text-4xl">🗣️</span>
             <span className="font-pixel text-lg">{isSpeaking ? 'SPEAKING...' : 'TELL TIME'}</span>
          </button>
       </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 border-b border-retro-green/30 pb-4">
          <RetroButton label="< Back" onClick={onBack} variant="neutral" className="py-2 px-4" />
          <h2 className="font-pixel text-lg sm:text-xl text-retro-amber uppercase truncate ml-4">{theme.name}</h2>
      </div>

      <div className="flex-grow flex items-center justify-center py-8 w-full">
         {theme.type === 'digital' && renderDigital()}
         {theme.type === 'nixie' && renderNixie()}
         {theme.type === 'analog' && renderAnalog()}
         {theme.type === 'talking' && renderTalking()}
      </div>
      
      <p className="font-retro text-gray-500 mt-8 text-center max-w-md">
        {theme.description}
      </p>
    </div>
  );
};