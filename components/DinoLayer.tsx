
import React, { useState, useEffect, useRef, useCallback } from 'react';

export const DinoLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'OVER'>('START');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  // Game state refs for the loop
  const dinoY = useRef(150);
  const dinoVelocity = useRef(0);
  const obstacles = useRef<{ x: number; width: number }[]>([]);
  const frameCount = useRef(0);
  const gravity = 0.6;
  const jumpStrength = -12;
  const groundY = 150;

  const resetGame = useCallback(() => {
    dinoY.current = groundY;
    dinoVelocity.current = 0;
    obstacles.current = [];
    frameCount.current = 0;
    setScore(0);
    setGameState('PLAYING');
  }, []);

  const jump = useCallback(() => {
    if (dinoY.current === groundY) {
      dinoVelocity.current = jumpStrength;
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameState === 'PLAYING') jump();
        else resetGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, gameState, jump, resetGame]);

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    // Update Dino
    dinoVelocity.current += gravity;
    dinoY.current += dinoVelocity.current;
    if (dinoY.current > groundY) {
      dinoY.current = groundY;
      dinoVelocity.current = 0;
    }

    // Update obstacles (moving right to left in mirrored world)
    if (frameCount.current % 100 === 0) {
      obstacles.current.push({ x: 600, width: 20 + Math.random() * 30 });
    }

    obstacles.current = obstacles.current.map(obs => ({ ...obs, x: obs.x - 5 }));
    
    // Check collisions
    const dinoBox = { x: 50, y: dinoY.current, w: 40, h: 40 };
    for (const obs of obstacles.current) {
      if (
        dinoBox.x < obs.x + obs.width &&
        dinoBox.x + dinoBox.w > obs.x &&
        dinoBox.y + dinoBox.h > 150
      ) {
        setGameState('OVER');
      }
    }

    // Cleanup and scoring
    obstacles.current = obstacles.current.filter(obs => obs.x > -100);
    setScore(s => s + 1);
    frameCount.current++;
    requestRef.current = requestAnimationFrame(update);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, 600, 200);
      
      // Ground
      ctx.strokeStyle = '#535353';
      ctx.beginPath();
      ctx.moveTo(0, 190);
      ctx.lineTo(600, 190);
      ctx.stroke();

      // Dino
      ctx.fillStyle = '#535353';
      ctx.fillRect(50, dinoY.current, 40, 40);
      // Eye
      ctx.fillStyle = 'white';
      ctx.fillRect(80, dinoY.current + 10, 5, 5);

      // Obstacles
      ctx.fillStyle = '#535353';
      obstacles.current.forEach(obs => {
        ctx.fillRect(obs.x, 150, obs.width, 40);
      });
    };

    render();
  }, [active, score]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-auto">
      <div className="text-4xl font-black mb-4 flex gap-1">
        <span className="text-gray-700">T-Rex</span>
        <span className="text-gray-400">Runner</span>
      </div>
      <div className="text-xl font-mono mb-6">HI {Math.floor(score / 10).toString().padStart(5, '0')}</div>
      <div className="relative border-2 border-gray-100 p-4 rounded-xl bg-gray-50 shadow-inner">
        <canvas ref={canvasRef} width={600} height={200} onClick={gameState === 'PLAYING' ? jump : resetGame} />
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm transition-all">
            <div className="text-6xl mb-4">🦖</div>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-[#535353] text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
              {gameState === 'START' ? 'START RUN' : 'TRY AGAIN'}
            </button>
            <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest">Press Space to Jump</p>
          </div>
        )}
      </div>
    </div>
  );
};
