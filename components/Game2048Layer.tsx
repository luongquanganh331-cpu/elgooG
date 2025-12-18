
import React, { useState, useEffect, useCallback } from 'react';

export const Game2048Layer: React.FC<{ active: boolean }> = ({ active }) => {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = useCallback(() => {
    let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, []);

  const addRandomTile = (currentGrid: number[][]) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    setGrid(prevGrid => {
      let newGrid = prevGrid.map(row => [...row]);
      let changed = false;
      let newScore = score;

      const rotateGrid = (g: number[][]) => g[0].map((_, i) => g.map(row => row[i]).reverse());

      if (direction === 'UP') { newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid))); }
      else if (direction === 'RIGHT') { newGrid = rotateGrid(rotateGrid(newGrid)); }
      else if (direction === 'DOWN') { newGrid = rotateGrid(newGrid); }

      for (let r = 0; r < 4; r++) {
        let row = newGrid[r].filter(v => v !== 0);
        for (let i = 0; i < row.length - 1; i++) {
          if (row[i] === row[i + 1]) {
            row[i] *= 2;
            newScore += row[i];
            row.splice(i + 1, 1);
            changed = true;
          }
        }
        while (row.length < 4) row.push(0);
        if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) changed = true;
        newGrid[r] = row;
      }

      if (direction === 'UP') { newGrid = rotateGrid(newGrid); }
      else if (direction === 'RIGHT') { newGrid = rotateGrid(rotateGrid(newGrid)); }
      else if (direction === 'DOWN') { newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid))); }

      if (changed) {
        addRandomTile(newGrid);
        setScore(newScore);
      }
      return newGrid;
    });
  }, [score]);

  useEffect(() => {
    if (!active) return;
    initGame();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') move('UP');
        if (e.key === 'ArrowDown') move('DOWN');
        if (e.key === 'ArrowLeft') move('LEFT');
        if (e.key === 'ArrowRight') move('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  if (!active) return null;

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-gray-200 text-gray-800',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-orange-600 text-white',
      128: 'bg-yellow-200 text-white text-2xl',
      256: 'bg-yellow-300 text-white text-2xl',
      512: 'bg-yellow-400 text-white text-2xl',
      1024: 'bg-yellow-500 text-white text-xl',
      2048: 'bg-yellow-600 text-white text-xl',
    };
    return colors[val] || 'bg-gray-900 text-white';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-auto">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-black mb-2 flex gap-1 justify-center">
          <span className="text-blue-500">2</span>
          <span className="text-red-500">0</span>
          <span className="text-yellow-500">4</span>
          <span className="text-blue-500">8</span>
        </h2>
        <div className="text-xl font-mono text-gray-500">SCORE: {score}</div>
      </div>
      <div className="p-4 bg-gray-200 rounded-xl shadow-inner">
        <div className="grid grid-cols-4 gap-4">
          {grid.map((row, r) => row.map((val, c) => (
            <div key={`${r}-${c}`} className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-100 ${val === 0 ? 'bg-gray-300/50' : getTileColor(val)}`}>
              {val !== 0 ? val : ''}
            </div>
          )))}
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={initGame} className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold shadow-md hover:bg-blue-600">New Game</button>
      </div>
      <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest">Use Arrow Keys to Move</p>
    </div>
  );
};
