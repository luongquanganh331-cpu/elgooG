
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';

export const ZipperLayer: React.FC<{ active: boolean; onClose: () => void }> = ({ active, onClose }) => {
  const [zipperPos, setZipperPos] = useState(10); // Percentage from top
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      setZipperPos(10);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      let percent = (y / rect.height) * 100;
      percent = Math.max(10, Math.min(105, percent));
      setZipperPos(percent);

      if (percent > 95) {
        // Fully unzipped - trigger a "crack" and maybe go back to classic or stay open
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [active, isDragging]);

  if (!active) return null;

  const splitAngle = (zipperPos / 100) * 15; // Max 15 degree split
  const offsetX = (zipperPos / 100) * 100; // Max 100px shift

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-white overflow-hidden select-none pointer-events-auto">
      {/* Tooltip */}
      {zipperPos < 20 && (
        <div 
          className="absolute top-[5%] left-1/2 -translate-x-full mr-12 px-4 py-2 bg-yellow-100 rounded-lg text-sm font-bold shadow-sm animate-bounce z-[210]"
          style={{ transform: `translateX(calc(-50% - 40px))` }}
        >
          Pull to unzip! 👉
        </div>
      )}

      {/* Esc hint */}
      <div className="absolute top-4 right-4 z-[210] flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
        <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded">Esc</span> to go back
      </div>

      {/* Track */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-[#f0f0f0] border-x border-gray-300 z-[190] flex flex-col items-center">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="w-full h-4 border-b border-gray-400 opacity-20" />
        ))}
      </div>

      {/* Left Half */}
      <div 
        className="absolute inset-y-0 left-0 w-1/2 bg-white flex flex-col items-end justify-center pr-12 transition-transform duration-75 origin-bottom-right"
        style={{ transform: `translateX(${-offsetX}px) rotate(${-splitAngle}deg)` }}
      >
        <div className="flex text-8xl font-black italic scale-x-[-1] opacity-80 stitched-text">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
        </div>
        <div className="mt-12 mr-[-100px] w-[400px] h-14 bg-white border border-gray-200 rounded-full shadow-sm flex items-center px-6 gap-4">
           <Search className="text-gray-400" size={20} />
           <span className="text-gray-400 text-lg">Try Logo↑ for a surprise!</span>
        </div>
        <button className="mt-8 mr-[-50px] px-6 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm font-medium hover:bg-gray-100">Google Search</button>
      </div>

      {/* Right Half */}
      <div 
        className="absolute inset-y-0 right-0 w-1/2 bg-white flex flex-col items-start justify-center pl-12 transition-transform duration-75 origin-bottom-left"
        style={{ transform: `translateX(${offsetX}px) rotate(${splitAngle}deg)` }}
      >
        <div className="flex text-8xl font-black italic opacity-80 stitched-text">
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
        </div>
        <div className="mt-12 ml-[-100px] w-full h-14 flex items-center justify-end pr-6">
           <Mic className="text-blue-500" size={20} />
        </div>
        <button className="mt-8 ml-[-50px] px-6 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm font-medium hover:bg-gray-100">I'm Feeling Lucky</button>
      </div>

      {/* Zipper Handle */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-16 h-24 z-[205] cursor-grab active:cursor-grabbing transition-all duration-75"
        style={{ top: `${zipperPos}%` }}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="relative w-full h-full bg-gradient-to-b from-gray-300 to-gray-400 border-2 border-gray-500 rounded-xl shadow-2xl flex flex-col items-center">
          <div className="w-10 h-1 bg-white/50 mt-2 rounded-full" />
          <div className="w-8 h-8 mt-4 border-4 border-gray-500/50 rounded-full" />
          {/* Detailed zipper track lines */}
          <div className="absolute inset-x-0 bottom-0 h-4 flex justify-around px-2">
            <div className="w-1 h-full bg-gray-500/30 rounded-t-full" />
            <div className="w-1 h-full bg-gray-500/30 rounded-t-full" />
            <div className="w-1 h-full bg-gray-500/30 rounded-t-full" />
          </div>
        </div>
      </div>

      <style>{`
        .stitched-text {
          filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.1));
          position: relative;
        }
        .stitched-text::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
