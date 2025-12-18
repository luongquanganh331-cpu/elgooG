
import React, { useState, useEffect, useCallback } from 'react';

interface ZergUnit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
}

export const ZergRushLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [units, setUnits] = useState<ZergUnit[]>([]);
  
  useEffect(() => {
    if (!active) {
      setUnits([]);
      return;
    }

    const interval = setInterval(() => {
      if (units.length < 20) {
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        if (side === 0) { x = Math.random() * window.innerWidth; y = -50; }
        else if (side === 1) { x = window.innerWidth + 50; y = Math.random() * window.innerHeight; }
        else if (side === 2) { x = Math.random() * window.innerWidth; y = window.innerHeight + 50; }
        else { x = -50; y = Math.random() * window.innerHeight; }

        setUnits(prev => [...prev, {
          id: Date.now() + Math.random(),
          x, y, vx: 0, vy: 0, hp: 100
        }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [active, units.length]);

  useEffect(() => {
    if (!active) return;

    const moveUnits = () => {
      setUnits(prev => prev.map(u => {
        const targetX = window.innerWidth / 2;
        const targetY = window.innerHeight / 2;
        const dx = targetX - u.x;
        const dy = targetY - u.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Move towards center but stop if close
        if (dist < 100) return u;

        return {
          ...u,
          x: u.x + (dx / dist) * 2,
          y: u.y + (dy / dist) * 2
        };
      }));
    };

    const frame = requestAnimationFrame(moveUnits);
    return () => cancelAnimationFrame(frame);
  }, [active, units]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {units.map(u => (
        <div 
          key={u.id}
          className="absolute w-8 h-8 border-4 border-yellow-500 rounded-full flex items-center justify-center font-bold text-yellow-500 transition-transform duration-100"
          style={{ 
            transform: `translate(${u.x}px, ${u.y}px)`,
            boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)'
          }}
        >
          o
        </div>
      ))}
    </div>
  );
};
