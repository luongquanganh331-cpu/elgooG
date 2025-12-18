
import React, { useState, useEffect } from 'react';
import { Power, RotateCcw, Timer } from 'lucide-react';

export const FanLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [isOn, setIsOn] = useState(false);
  const [speed, setSpeed] = useState(1); // 1, 2, 3
  const [isReversed, setIsReversed] = useState(false);

  if (!active) return null;

  const getRotationDuration = () => {
    if (!isOn) return '0s';
    if (speed === 1) return '2s';
    if (speed === 2) return '1s';
    return '0.4s';
  };

  return (
    <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Fan Header Info */}
        <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl font-black flex gap-1 justify-center mb-2">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
            <span className="ml-2 text-gray-400">FAN</span>
          </h2>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Cooling the Mirror Dimension</p>
        </div>

        {/* Fan Assembly */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* Wire Cage Background */}
          <div className="absolute inset-0 border-[6px] border-slate-300 rounded-full shadow-inner opacity-40"></div>
          <div className="absolute inset-0 border-[1px] border-slate-400 rounded-full scale-75 opacity-20"></div>
          <div className="absolute inset-0 border-[1px] border-slate-400 rounded-full scale-50 opacity-10"></div>
          
          {/* Fan Blades Wrapper */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
            style={{ 
              animation: isOn ? `rotateFan ${getRotationDuration()} linear infinite ${isReversed ? 'reverse' : 'normal'}` : 'none',
              transform: isOn ? 'none' : 'rotate(45deg)'
            }}
          >
            {/* Top Blade - Yellow */}
            <div className="absolute top-4 w-16 h-32 md:w-20 md:h-40 bg-yellow-400 rounded-full opacity-90 blur-[0.5px] origin-bottom shadow-lg" />
            {/* Right Blade - Green */}
            <div className="absolute right-4 w-32 h-16 md:w-40 md:h-20 bg-green-500 rounded-full opacity-90 blur-[0.5px] origin-left shadow-lg" />
            {/* Bottom Blade - Blue */}
            <div className="absolute bottom-4 w-16 h-32 md:w-20 md:h-40 bg-blue-500 rounded-full opacity-90 blur-[0.5px] origin-top shadow-lg" />
            {/* Left Blade - Red */}
            <div className="absolute left-4 w-32 h-16 md:w-40 md:h-20 bg-red-500 rounded-full opacity-90 blur-[0.5px] origin-right shadow-lg" />
            
            {/* Center Cap */}
            <div className="absolute w-16 h-16 bg-white rounded-full shadow-xl border-4 border-slate-100 flex items-center justify-center overflow-hidden z-10">
              <div className="grid grid-cols-2 w-full h-full">
                <div className="bg-red-500"></div>
                <div className="bg-yellow-400"></div>
                <div className="bg-blue-500"></div>
                <div className="bg-green-500"></div>
              </div>
            </div>
          </div>

          {/* Cage Wire Details */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {[...Array(12)].map((_, i) => (
               <div 
                 key={i} 
                 className="absolute w-full h-[1px] bg-slate-400/20" 
                 style={{ transform: `rotate(${i * 30}deg)` }}
               />
             ))}
          </div>
        </div>

        {/* Fan Base */}
        <div className="relative -mt-4 w-48 h-32 flex flex-col items-center">
          {/* Neck */}
          <div className="w-8 h-12 bg-slate-200 shadow-inner" />
          
          {/* Base Plate */}
          <div className="w-64 h-24 bg-teal-900 rounded-full shadow-2xl flex flex-col items-center justify-center border-b-8 border-black/20">
            <div className="flex gap-2 p-2 bg-white/10 rounded-xl">
              <button 
                onClick={() => setIsOn(!isOn)}
                className={`p-3 rounded-lg transition-all ${isOn ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-500 shadow-sm hover:bg-gray-50'}`}
              >
                <Power size={20} />
              </button>
              <button 
                onClick={() => setIsReversed(!isReversed)}
                className={`p-3 rounded-lg transition-all ${isReversed ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-500 shadow-sm hover:bg-gray-50'}`}
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={() => setSpeed(prev => (prev % 3) + 1)}
                className="p-3 bg-white text-blue-500 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Timer size={20} />
                <span className="text-[10px] font-bold">{speed}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rotateFan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
