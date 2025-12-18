
import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const spawnFood = useCallback((currentSnake: typeof INITIAL_SNAKE) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      };
      // Ensure food doesn't spawn on snake
      if (!currentSnake.some(s => s.x === newFood!.x && s.y === newFood!.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(spawnFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, direction]);

  useEffect(() => {
    if (!active || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Wall collisions
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Self collisions
        if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [active, direction, food, gameOver, spawnFood]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const size = canvasRef.current.width / GRID_SIZE;

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw grid lines
    ctx.strokeStyle = '#e8eaed';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvasRef.current.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvasRef.current.width, i * size);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? '#4285f4' : ['#ea4335', '#fbbc05', '#34a853'][i % 3];
      ctx.beginPath();
      ctx.roundRect(part.x * size + 2, part.y * size + 2, size - 4, size - 4, 4);
      ctx.fill();
    });

    // Draw Food
    ctx.fillStyle = '#ea4335';
    ctx.font = `${size * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', food.x * size + size / 2, food.y * size + size / 2);

  }, [active, snake, food]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
      <div className="mb-6 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-2 flex gap-2">
          <span className="text-blue-500">S</span>
          <span className="text-red-500">n</span>
          <span className="text-yellow-500">a</span>
          <span className="text-blue-500">k</span>
          <span className="text-green-500">e</span>
        </h2>
        <div className="text-xl font-mono text-gray-600">Score: {score}</div>
      </div>
      
      <div className="relative border-8 border-gray-100 rounded-3xl overflow-hidden shadow-2xl">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="bg-white"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm animate-in fade-in duration-300">
            <h3 className="text-3xl font-black mb-4">GAME OVER</h3>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-bold transition-all transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-400 flex flex-col items-center gap-2">
        <p className="text-sm font-bold uppercase tracking-widest">Controls</p>
        <div className="flex gap-4">
          <div className="px-3 py-1 bg-gray-100 rounded border border-gray-200 text-xs font-mono">ARROWS</div>
          <div className="px-3 py-1 bg-gray-100 rounded border border-gray-200 text-xs font-mono">WASD</div>
        </div>
      </div>
    </div>
  );
};
