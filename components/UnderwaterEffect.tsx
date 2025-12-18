
import React from 'react';

export const UnderwaterEffect: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="bubble" 
          style={{
            left: `${Math.random() * 100}%`,
            width: `${10 + Math.random() * 40}px`,
            height: `${10 + Math.random() * 40}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 7}s`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px]"></div>
    </div>
  );
};
