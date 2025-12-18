
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';

export const GuitarLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [activeStrings, setActiveStrings] = useState<number[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const strings = [
    { freq: 164.81, label: 'E3' },
    { freq: 196.00, label: 'G3' },
    { freq: 220.00, label: 'A3' },
    { freq: 246.94, label: 'B3' },
    { freq: 293.66, label: 'D4' },
    { freq: 329.63, label: 'E4' },
    { freq: 392.00, label: 'G4' },
    { freq: 440.00, label: 'A4' },
    { freq: 493.88, label: 'B4' },
    { freq: 587.33, label: 'D5' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (!isNaN(key) && key >= 0 && key < strings.length) {
        pluckString(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pluckString = (index: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    const string = strings[index];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(string.freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);

    setActiveStrings(prev => [...prev, index]);
    setTimeout(() => {
      setActiveStrings(prev => prev.filter(i => i !== index));
    }, 200);
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-auto">
      {/* Search Interface */}
      <div className="w-full max-w-2xl px-8 text-center flex flex-col items-center">
        
        {/* Guitar Assembly */}
        <div className="relative w-full h-48 md:h-64 mb-12 flex items-center justify-center">
           {/* Bridge & Body Parts */}
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-slate-300 rounded-lg shadow-inner flex flex-col justify-around py-4">
              {[...Array(strings.length)].map((_, i) => (
                <div key={i} className="w-4 h-1 bg-slate-400 rounded-full mx-auto" />
              ))}
           </div>

           {/* Strings Container */}
           <div className="relative flex-1 h-32 md:h-40 flex flex-col justify-between py-2 cursor-pointer group">
              {strings.map((s, i) => (
                <div 
                  key={i}
                  onMouseEnter={() => pluckString(i)}
                  className="relative h-2 w-full flex items-center"
                >
                  <div 
                    className={`h-[2px] w-full bg-slate-400 shadow-sm transition-all duration-150 origin-center
                      ${activeStrings.includes(i) ? 'scale-y-[4] bg-slate-500' : 'group-hover:bg-slate-300'}
                    `}
                    style={{ 
                      transform: activeStrings.includes(i) ? 'scaleY(2) translateY(-2px)' : 'none',
                    }}
                  />
                  {/* Decorative Logo Elements on strings */}
                  {i === 3 && (
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-600 shadow-xl flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-900 rounded-full border-2 border-gray-700" />
                    </div>
                  )}
                   {i === 6 && (
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-600 shadow-xl flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-900 rounded-full border-2 border-gray-700" />
                    </div>
                  )}
                </div>
              ))}
           </div>

           {/* Headstock Parts */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-slate-300 rounded-lg shadow-inner flex flex-col justify-around py-4">
              {[...Array(strings.length)].map((_, i) => (
                <div key={i} className="w-8 h-1 bg-slate-400 rounded-full ml-auto mr-[-4px]" />
              ))}
           </div>
        </div>

        <div className="w-full relative group">
          <div className="flex items-center w-full px-6 py-4 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <Search className="text-gray-400 mr-4" size={20} />
            <input 
              type="text" 
              readOnly 
              value="gkjlkgdhf hlkjhgffd gkjlkgdhf hlkjll;jk" 
              className="flex-1 outline-none text-xl font-light text-gray-800"
            />
            <Mic className="text-blue-500" size={20} />
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button className="px-6 py-2 bg-gray-50 border border-gray-100 rounded text-sm font-medium hover:bg-gray-100">Google Search</button>
            <button className="px-6 py-2 bg-gray-50 border border-gray-100 rounded text-sm font-medium hover:bg-gray-100">I'm Feeling Lucky</button>
          </div>
        </div>
        
        <div className="mt-12 text-xs font-bold text-gray-400 uppercase tracking-widest flex flex-col gap-2">
          <p>Hover strings or use 0-9 keys to play</p>
          <div className="flex gap-2 justify-center">
            {strings.map((s, i) => (
              <span key={i} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-[10px]">{i}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[210] flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
        <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded">Esc</span> to go back
      </div>
    </div>
  );
};
