
import React, { useState, useEffect, useRef, useCallback } from 'react';

export const PacmanLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'OVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [pacPos, setPacPos] = useState({ x: 1, y: 1 });
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  
  const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  const initGame = useCallback(() => {
    const newDots = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) newDots.push({ x, y });
      }
    }
    setDots(newDots);
    setPacPos({ x: 1, y: 1 });
    setScore(0);
    setGameState('PLAYING');
  }, []);

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      let nx = pacPos.x;
      let ny = pacPos.y;
      if (e.key === 'ArrowUp') ny--;
      else if (e.key === 'ArrowDown') ny++;
      else if (e.key === 'ArrowLeft') nx--;
      else if (e.key === 'ArrowRight') nx++;
      
      if (maze[ny] && maze[ny][nx] === 0) {
        setPacPos({ x: nx, y: ny });
        // Eat dot
        setDots(prev => {
          const filtered = prev.filter(d => d.x !== nx || d.y !== ny);
          if (filtered.length !== prev.length) setScore(s => s + 10);
          if (filtered.length === 0) setGameState('OVER');
          return filtered;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, gameState, pacPos]);

  if (!active) return null;

  const cellSize = 40;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-auto">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-black mb-2 flex gap-1 justify-center">
          <span className="text-blue-500">P</span>
          <span className="text-red-500">a</span>
          <span className="text-yellow-500">c</span>
          <span className="text-blue-500">m</span>
          <span className="text-green-500">a</span>
          <span className="text-red-500">n</span>
        </h2>
        <div className="text-2xl text-yellow-400 font-mono tracking-widest">SCORE: {score}</div>
      </div>

      <div className="relative bg-gray-900 p-6 rounded-3xl border-4 border-blue-900 shadow-[0_0_50px_rgba(30,58,138,0.5)]">
        <div 
          className="grid" 
          style={{ 
            gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`
          }}
        >
          {maze.map((row, y) => row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`relative ${cell === 1 ? 'bg-blue-800/40 rounded-sm m-0.5' : ''}`}
            >
              {dots.some(d => d.x === x && d.y === y) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full" />
                </div>
              )}
              {pacPos.x === x && pacPos.y === y && (
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full clip-pacman" />
                </div>
              )}
            </div>
          )))}
        </div>

        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-md rounded-2xl">
            <div className="text-6xl mb-6">🍒</div>
            <button 
              onClick={initGame}
              className="px-12 py-4 bg-yellow-400 text-black font-black text-xl rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              {gameState === 'IDLE' ? 'INSERT COIN' : 'PLAY AGAIN'}
            </button>
            <p className="mt-6 text-blue-400 text-xs font-bold uppercase tracking-[0.3em]">Use Arrow Keys to Move</p>
          </div>
        )}
      </div>
      
      <style>{`
        .clip-pacman {
          clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 50%);
          animation: chomp 0.3s infinite alternate;
        }
        @keyframes chomp {
          from { clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 50%); }
          to { clip-path: polygon(100% 40%, 100% 60%, 0% 100%, 0% 0%, 50% 50%); }
        }
      `}</style>
    </div>
  );
};
