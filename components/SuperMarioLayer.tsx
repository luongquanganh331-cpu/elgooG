
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';

export const SuperMarioLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [coins, setCoins] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCoinSound = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1); // E6
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  const handleBlockClick = () => {
    setIsBouncing(true);
    setCoins(prev => prev + 1);
    playCoinSound();
    setTimeout(() => setIsBouncing(false), 100);
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto pointer-events-auto font-sans text-gray-900">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 flex items-center gap-8">
        <div className="flex text-3xl font-bold tracking-tight">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
        </div>
        <div className="flex-1 max-w-2xl relative">
          <input type="text" readOnly value="Super Mario Bros." className="w-full px-6 py-3 rounded-full border border-gray-200 shadow-sm outline-none pl-12" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
          <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-8">
          <div className="text-sm text-gray-500">About 45,200,000 results (0.42 seconds)</div>
          {[1,2,3].map(i => (
            <div key={i} className="max-w-xl">
              <div className="text-xs text-gray-600 mb-1">https://mario.nintendo.com</div>
              <div className="text-xl text-blue-700 hover:underline cursor-pointer mb-1">Super Mario™ - Official Site</div>
              <p className="text-sm text-gray-700">The official home for Super Mario. Watch videos, play games, browse the history, and more!</p>
            </div>
          ))}
        </div>

        <div className="knowledge-panel">
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-2xl font-medium mb-4 self-start">Super Mario Bros.</h3>
            <div 
              onClick={handleBlockClick}
              className={`w-20 h-20 cursor-pointer transition-transform bg-[#fbbc05] border-4 border-[#856404] flex items-center justify-center relative shadow-lg
                ${isBouncing ? '-translate-y-4' : 'hover:scale-105'}
              `}
            >
              <span className="text-4xl font-bold text-[#856404]">?</span>
              {isBouncing && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-coin-float">
                  <div className="w-8 h-10 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center font-bold text-yellow-800">$</div>
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <div className="text-3xl font-mono text-yellow-600">{coins.toString().padStart(3, '0')}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Coins Collected</div>
            </div>
            <p className="mt-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
              Super Mario Bros. is a platform game developed and published by Nintendo. Released in 1985 for the Famicom/NES.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes coinFloat {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -60px) scale(0.5); opacity: 0; }
        }
        .animate-coin-float { animation: coinFloat 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};
