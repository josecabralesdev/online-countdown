import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DigitalDisplay } from './DigitalDisplay';
import { RetroButton } from './RetroButton';

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputHours, setInputHours] = useState<string>('');
  const [inputMinutes, setInputMinutes] = useState<string>('');
  const [inputSeconds, setInputSeconds] = useState<string>('');
  const [isFinished, setIsFinished] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  const endTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    const now = Date.now();
    const remaining = Math.max(0, endTimeRef.current - now);
    
    setTimeLeft(remaining);

    if (remaining <= 0) {
      setIsRunning(false);
      setIsFinished(true);
      // Play sound
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Jump to A5
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } else {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      // If resuming or starting fresh
      if (endTimeRef.current === 0 || timeLeft === initialTime) {
         endTimeRef.current = Date.now() + timeLeft;
      } else {
         // Resuming from pause, we need to recalculate end time based on current timeLeft
         endTimeRef.current = Date.now() + timeLeft;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, animate]);

  const handleStart = () => {
    if (timeLeft === 0 && !isFinished) {
      // Parse inputs
      const h = parseInt(inputHours) || 0;
      const m = parseInt(inputMinutes) || 0;
      const s = parseInt(inputSeconds) || 0;
      const totalMs = (h * 3600 + m * 60 + s) * 1000;
      
      if (totalMs > 0) {
        setTimeLeft(totalMs);
        setInitialTime(totalMs);
        setIsRunning(true);
        setIsFinished(false);
      }
    } else {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(0);
    setInitialTime(0);
    setInputHours('');
    setInputMinutes('');
    setInputSeconds('');
    endTimeRef.current = 0;
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, max: number) => {
    // Allow empty string or numbers only
    if (value === '' || /^\d+$/.test(value)) {
        if (value !== '' && parseInt(value) > max) return; // Basic validation
        setter(value);
    }
  };

  const isSettingTime = timeLeft === 0 && !isFinished;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="mb-8 w-full transform transition-all hover:scale-[1.01]">
        <DigitalDisplay 
            timeMs={timeLeft} 
            showMs={false} 
            isFlashing={isFinished} 
            color={isFinished ? 'red' : 'green'}
        />
      </div>

      {isSettingTime && (
        <div className="flex gap-2 sm:gap-4 mb-8 items-end bg-gray-900/80 p-6 rounded-lg border-2 border-gray-700">
          <div className="flex flex-col items-center">
            <label className="text-retro-green font-pixel text-[10px] mb-2 uppercase">HRS</label>
            <input 
              type="text" 
              value={inputHours}
              onChange={(e) => handleInputChange(setInputHours, e.target.value, 99)}
              placeholder="00"
              className="w-16 sm:w-20 bg-black border-2 border-retro-green text-retro-green font-retro text-3xl sm:text-4xl text-center focus:outline-none focus:ring-2 focus:ring-retro-green placeholder-green-900/50 rounded-sm"
              maxLength={2}
            />
          </div>
          <span className="text-retro-green font-retro text-4xl pb-1">:</span>
          <div className="flex flex-col items-center">
            <label className="text-retro-green font-pixel text-[10px] mb-2 uppercase">MIN</label>
            <input 
              type="text" 
              value={inputMinutes}
              onChange={(e) => handleInputChange(setInputMinutes, e.target.value, 59)}
              placeholder="00"
              className="w-16 sm:w-20 bg-black border-2 border-retro-green text-retro-green font-retro text-3xl sm:text-4xl text-center focus:outline-none focus:ring-2 focus:ring-retro-green placeholder-green-900/50 rounded-sm"
              maxLength={2}
            />
          </div>
          <span className="text-retro-green font-retro text-4xl pb-1">:</span>
          <div className="flex flex-col items-center">
            <label className="text-retro-green font-pixel text-[10px] mb-2 uppercase">SEC</label>
            <input 
              type="text" 
              value={inputSeconds}
              onChange={(e) => handleInputChange(setInputSeconds, e.target.value, 59)}
              placeholder="00"
              className="w-16 sm:w-20 bg-black border-2 border-retro-green text-retro-green font-retro text-3xl sm:text-4xl text-center focus:outline-none focus:ring-2 focus:ring-retro-green placeholder-green-900/50 rounded-sm"
              maxLength={2}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 w-full justify-center">
        {!isRunning ? (
             <RetroButton 
                label={timeLeft > 0 && !isFinished ? "Resume" : "Start"} 
                onClick={handleStart} 
                className="w-32"
                disabled={isFinished}
            />
        ) : (
             <RetroButton 
                label="Stop" 
                onClick={handleStop} 
                variant="warning"
                className="w-32"
            />
        )}
        
        <RetroButton 
          label="Reset" 
          onClick={handleReset} 
          variant="danger"
          className="w-32"
          disabled={isSettingTime}
        />
      </div>
      
      {isFinished && (
        <div className="mt-8 text-retro-red font-pixel text-xl sm:text-2xl animate-blink text-center">
          TIME'S UP!
        </div>
      )}
    </div>
  );
};