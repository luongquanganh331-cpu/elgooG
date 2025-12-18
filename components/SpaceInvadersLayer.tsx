
import React, { useState, useEffect, useRef, useCallback } from 'react';

const INVADER_ROWS = 4;
const INVADER_COLS = 10;
const INVADER_WIDTH = 40;
const INVADER_HEIGHT = 30;
const INVADER_PADDING = 15;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

interface Projectile {
  x: number;
  y: number;
}

interface Invader {
  x: number;
  y: number;
  id: number;
  color: string;
  type: string;
}

export const SpaceInvadersLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WON' | 'OVER'>('START');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const playerX = useRef(CANVAS_WIDTH / 2 - 25);
  const invaders = useRef<Invader[]>([]);
  const projectiles = useRef<Projectile[]>([]);
  const invaderDir = useRef(1); // 1 = right, -1 = left
  const invaderStep = useRef(0);
  const lastUpdate = useRef(0);

  const initInvaders = useCallback(() => {
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
    const types = ['G', 'o', 'o', 'g'];
    const newInvaders: Invader[] = [];
    for (let r = 0; r < INVADER_ROWS; r++) {
      for (let c = 0; c < INVADER_COLS; c++) {
        newInvaders.push({
          id: r * INVADER_COLS + c,
          x: c * (INVADER_WIDTH + INVADER_PADDING) + 50,
          y: r * (INVADER_HEIGHT + INVADER_PADDING) + 50,
          color: colors[r % colors.length],
          type: types[r % types.length]
        });
      }
    }
    invaders.current = newInvaders;
    projectiles.current = [];
    playerX.current = CANVAS_WIDTH / 2 - 25;
    invaderDir.current = 1;
    invaderStep.current = 0;
    setScore(0);
    setGameState('PLAYING');
  }, []);

  const shoot = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    if (projectiles.current.length < 3) {
      projectiles.current.push({ x: playerX.current + 22, y: CANVAS_HEIGHT - 60 });
    }
  }, [gameState]);

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'PLAYING') {
        if (e.key === 'ArrowLeft') playerX.current = Math.max(0, playerX.current - 20);
        if (e.key === 'ArrowRight') playerX.current = Math.min(CANVAS_WIDTH - 50, playerX.current + 20);
        if (e.key === ' ' || e.key === 'ArrowUp') shoot();
      } else {
        if (e.key === 'Enter' || e.key === ' ') initInvaders();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, gameState, shoot, initInvaders]);

  const update = useCallback((time: number) => {
    if (gameState !== 'PLAYING') return;

    if (time - lastUpdate.current > 500 - (score / 10)) {
      // Move invaders
      let hitEdge = false;
      invaders.current.forEach(inv => {
        const nextX = inv.x + (invaderDir.current * 15);
        if (nextX > CANVAS_WIDTH - INVADER_WIDTH || nextX < 0) hitEdge = true;
      });

      if (hitEdge) {
        invaderDir.current *= -1;
        invaders.current.forEach(inv => {
          inv.y += 20;
          if (inv.y > CANVAS_HEIGHT - 100) setGameState('OVER');
        });
      } else {
        invaders.current.forEach(inv => {
          inv.x += invaderDir.current * 15;
        });
      }
      lastUpdate.current = time;
    }

    // Move projectiles
    projectiles.current = projectiles.current
      .map(p => ({ ...p, y: p.y - 7 }))
      .filter(p => p.y > 0);

    // Collision check
    projectiles.current.forEach((p, pIdx) => {
      invaders.current.forEach((inv, iIdx) => {
        if (
          p.x > inv.x && p.x < inv.x + INVADER_WIDTH &&
          p.y > inv.y && p.y < inv.y + INVADER_HEIGHT
        ) {
          invaders.current.splice(iIdx, 1);
          projectiles.current.splice(pIdx, 1);
          setScore(s => s + 100);
        }
      });
    });

    if (invaders.current.length === 0) setGameState('WON');

    requestAnimationFrame(update);
  }, [gameState, score]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestAnimationFrame(update);
    }
  }, [gameState, update]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 50; i++) {
        ctx.fillRect((i * 17) % CANVAS_WIDTH, (i * 23) % CANVAS_HEIGHT, 1, 1);
      }

      // Invaders
      invaders.current.forEach(inv => {
        ctx.fillStyle = inv.color;
        ctx.font = 'bold 30px Arial';
        ctx.fillText(inv.type, inv.x, inv.y + 25);
        // Base feet
        ctx.fillRect(inv.x + 5, inv.y + 25, 5, 5);
        ctx.fillRect(inv.x + INVADER_WIDTH - 10, inv.y + 25, 5, 5);
      });

      // Projectiles
      ctx.fillStyle = '#FBBC05';
      projectiles.current.forEach(p => {
        ctx.fillRect(p.x, p.y, 3, 15);
      });

      // Player
      ctx.fillStyle = '#4285F4';
      ctx.beginPath();
      ctx.moveTo(playerX.current, CANVAS_HEIGHT - 20);
      ctx.lineTo(playerX.current + 25, CANVAS_HEIGHT - 50);
      ctx.lineTo(playerX.current + 50, CANVAS_HEIGHT - 20);
      ctx.fill();

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
          SPACE <span className="text-blue-500">I</span><span className="text-red-500">N</span><span className="text-yellow-500">V</span><span className="text-blue-500">A</span><span className="text-green-500">D</span><span className="text-red-500">E</span><span className="text-blue-500">R</span>S
        </h2>
        <div className="text-xl font-mono text-green-500">SCORE: {score.toString().padStart(6, '0')}</div>
      </div>

      <div className="relative border-4 border-gray-800 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.1)]">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          className="bg-black"
        />

        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm p-12 text-center">
            {gameState === 'WON' ? (
              <h3 className="text-6xl font-black text-yellow-400 mb-4">GALAXY SAVED!</h3>
            ) : gameState === 'OVER' ? (
              <h3 className="text-6xl font-black text-red-500 mb-4">DIMENSION INVADED</h3>
            ) : (
              <div className="text-6xl mb-6">🛸</div>
            )}
            
            <button 
              onClick={initInvaders}
              className="px-12 py-4 bg-green-600 text-white font-black text-2xl rounded-full hover:scale-110 hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              {gameState === 'START' ? 'INITIALIZE' : 'REBOOT SYSTEM'}
            </button>
            <div className="mt-8 text-gray-500 text-sm font-bold uppercase tracking-widest flex gap-8">
              <span>Arrows to Move</span>
              <span>Space to Fire</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
