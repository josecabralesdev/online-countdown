import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DigitalDisplay } from './DigitalDisplay';
import { RetroButton } from './RetroButton';
import { Lap } from '../types';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);

  const animate = useCallback(() => {
    if (startTimeRef.current > 0) {
      const now = Date.now();
      setTime(previousTimeRef.current + (now - startTimeRef.current));
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = time;
      startTimeRef.current = 0;
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, animate]); // 'time' dependency intentionally omitted to avoid loop

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    previousTimeRef.current = 0;
    startTimeRef.current = 0;
    setLaps([]);
  };

  const handleLap = () => {
    const currentLapTime = time;
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const split = currentLapTime - lastLapTime;

    const newLap: Lap = {
      id: laps.length + 1,
      time: currentLapTime,
      split: split,
    };
    setLaps([newLap, ...laps]);
  };

  const formatLapTime = (ms: number) => {
    const min = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const msec = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${min}:${sec}.${msec}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="mb-8 w-full transform transition-all hover:scale-[1.01]">
        <DigitalDisplay timeMs={time} />
      </div>

      <div className="flex gap-4 mb-8 w-full justify-center">
        <RetroButton 
          label={isRunning ? 'Stop' : 'Start'} 
          onClick={handleStartStop} 
          variant={isRunning ? 'warning' : 'primary'}
          className="w-32"
        />
        <RetroButton 
          label="Lap" 
          onClick={handleLap} 
          disabled={!isRunning && time === 0}
          variant="neutral"
          className="w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <RetroButton 
          label="Reset" 
          onClick={handleReset} 
          disabled={isRunning || time === 0}
          variant="danger"
          className="w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {laps.length > 0 && (
        <div className="w-full border-2 border-gray-700 bg-black/50 rounded p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-retro-green scrollbar-track-gray-900">
           <table className="w-full text-left font-retro text-xl sm:text-2xl text-retro-green">
            <thead className="border-b-2 border-gray-700 text-retro-amber">
              <tr>
                <th className="py-2 px-4">Lap #</th>
                <th className="py-2 px-4 text-right">Split</th>
                <th className="py-2 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap) => (
                <tr key={lap.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                  <td className="py-2 px-4">#{lap.id.toString().padStart(2, '0')}</td>
                  <td className="py-2 px-4 text-right font-mono text-gray-400">+{formatLapTime(lap.split)}</td>
                  <td className="py-2 px-4 text-right">{formatLapTime(lap.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};