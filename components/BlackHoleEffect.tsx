
import React from 'react';

export const BlackHoleEffect: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <div className="w-[400px] h-[400px] bg-black rounded-full shadow-[0_0_100px_40px_rgba(0,0,0,1),0_0_150px_60px_rgba(255,255,255,0.1)] animate-pulse" />
      <style>{`
        body {
          transition: transform 0.3s ease-out;
        }
        .black-hole-pull {
          animation: pull 10s infinite alternate;
        }
        @keyframes pull {
          0% { filter: blur(0px) contrast(1); transform: scale(1); }
          100% { filter: blur(2px) contrast(1.5) scale(0.9); }
        }
      `}</style>
    </div>
  );
};
