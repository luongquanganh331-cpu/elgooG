
import React, { useState, useEffect, useRef } from 'react';

export const LetItSnowLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [frost, setFrost] = useState(0);
  const snowflakes = useRef<{ x: number; y: number; s: number; v: number }[]>([]);

  useEffect(() => {
    if (!active) {
      setFrost(0);
      return;
    }
    
    snowflakes.current = Array(100).fill(0).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * -100,
      s: 2 + Math.random() * 5,
      v: 1 + Math.random() * 2
    }));

    const interval = setInterval(() => {
      setFrost(prev => Math.min(0.8, prev + 0.001));
    }, 100);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[110] pointer-events-none overflow-hidden">
      {/* Snowflakes */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 6}px`,
              height: `${2 + Math.random() * 6}px`,
              animation: `snowfall ${5 + Math.random() * 10}s linear infinite`,
              opacity: 0.8
            }}
          />
        ))}
      </div>

      {/* Frost Overlay */}
      <div 
        className="absolute inset-0 bg-white/20 backdrop-blur-[4px] transition-opacity duration-1000"
        style={{ opacity: frost }}
      />

      {/* Defrost Button */}
      {frost > 0.1 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button 
            onClick={() => setFrost(0)}
            className="px-6 py-2 bg-blue-500/80 backdrop-blur-md text-white rounded-full font-bold shadow-lg border border-white/20 hover:bg-blue-600 transition-all"
          >
            Defrost Screen
          </button>
        </div>
      )}

      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10vh) translateX(0); }
          100% { transform: translateY(110vh) translateX(${Math.random() * 50 - 25}px); }
        }
      `}</style>
    </div>
  );
};
