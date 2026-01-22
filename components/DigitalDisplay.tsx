import React from 'react';

interface DigitalDisplayProps {
  timeMs: number;
  showMs?: boolean;
  isFlashing?: boolean;
  color?: 'green' | 'red' | 'amber';
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({ 
  timeMs, 
  showMs = true, 
  isFlashing = false,
  color = 'green'
}) => {
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Display 2 digits (00-99)

    return {
      hh: hours.toString().padStart(2, '0'),
      mm: minutes.toString().padStart(2, '0'),
      ss: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0'),
    };
  };

  const { hh, mm, ss, ms } = formatTime(timeMs);

  let textColor = 'text-retro-green';
  let glowColor = 'drop-shadow-[0_0_8px_rgba(51,255,0,0.6)]';
  
  if (color === 'red') {
    textColor = 'text-retro-red';
    glowColor = 'drop-shadow-[0_0_8px_rgba(255,51,51,0.6)]';
  } else if (color === 'amber') {
    textColor = 'text-retro-amber';
    glowColor = 'drop-shadow-[0_0_8px_rgba(255,176,0,0.6)]';
  }

  return (
    <div className={`
      font-retro text-6xl sm:text-8xl md:text-9xl 
      p-4 sm:p-8 bg-retro-dark border-4 border-gray-700 inset-shadow 
      rounded-lg flex justify-center items-center tracking-widest select-none
      ${textColor} ${glowColor}
      ${isFlashing ? 'animate-blink' : ''}
    `}
    style={{ textShadow: '0 0 5px currentColor' }}
    >
      <div className="flex items-baseline">
        <span>{hh}</span>
        <span className={Number(ss) % 2 === 0 ? "opacity-100" : "opacity-70"}>:</span>
        <span>{mm}</span>
        <span className={Number(ss) % 2 === 0 ? "opacity-100" : "opacity-70"}>:</span>
        <span>{ss}</span>
        {showMs && (
          <>
            <span className="text-4xl sm:text-6xl mx-1 sm:mx-2 opacity-60">.</span>
            <span className="text-4xl sm:text-6xl">{ms}</span>
          </>
        )}
      </div>
    </div>
  );
};