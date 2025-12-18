
import React from 'react';

export const ThanosEffect: React.FC<{ snapped: boolean }> = ({ snapped }) => {
  if (!snapped) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-1 bg-gray-600/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `disintegrate ${1 + Math.random() * 2}s forwards`,
            animationDelay: `${Math.random() * 1.5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes disintegrate {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; filter: blur(0px); }
          100% { transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px) rotate(360deg); opacity: 0; filter: blur(4px); }
        }
      `}</style>
    </div>
  );
};
