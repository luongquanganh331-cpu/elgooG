
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Mic } from 'lucide-react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

const PIECES: Record<PieceType, { shape: number[][], color: string }> = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-600' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-600' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
};

const SHAPES: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export const TetrisLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const [activePiece, setActivePiece] = useState<{ type: PieceType, pos: { x: number, y: number }, shape: number[][] } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number>(null);

  const spawnPiece = useCallback(() => {
    const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const piece = {
      type,
      shape: PIECES[type].shape,
      pos: { x: Math.floor(COLS / 2) - Math.floor(PIECES[type].shape[0].length / 2), y: 0 }
    };
    
    // Check game over immediately
    if (checkCollision(piece.pos, piece.shape, grid)) {
      setGameOver(true);
      setIsPaused(true);
      return;
    }
    setActivePiece(piece);
  }, [grid]);

  const checkCollision = (pos: { x: number, y: number }, shape: number[][], currentGrid: string[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && currentGrid[newY][newX] !== '')) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = useCallback(() => {
    if (!activePiece) return;
    const newGrid = grid.map(row => [...row]);
    activePiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const gridY = activePiece.pos.y + y;
          const gridX = activePiece.pos.x + x;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = PIECES[activePiece.type].color;
          }
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    const filteredGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell !== '');
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (filteredGrid.length < ROWS) {
      filteredGrid.unshift(Array(COLS).fill(''));
    }

    setGrid(filteredGrid);
    setScore(s => s + linesCleared * 100);
    spawnPiece();
  }, [activePiece, grid, spawnPiece]);

  const moveDown = useCallback(() => {
    if (!activePiece || isPaused || gameOver) return;
    const newPos = { ...activePiece.pos, y: activePiece.pos.y + 1 };
    if (!checkCollision(newPos, activePiece.shape, grid)) {
      setActivePiece({ ...activePiece, pos: newPos });
    } else {
      mergePiece();
    }
  }, [activePiece, grid, mergePiece, isPaused, gameOver]);

  const moveSideways = (dir: number) => {
    if (!activePiece || isPaused || gameOver) return;
    const newPos = { ...activePiece.pos, x: activePiece.pos.x + dir };
    if (!checkCollision(newPos, activePiece.shape, grid)) {
      setActivePiece({ ...activePiece, pos: newPos });
    }
  };

  const rotate = () => {
    if (!activePiece || isPaused || gameOver) return;
    const newShape = activePiece.shape[0].map((_, i) => activePiece.shape.map(row => row[i]).reverse());
    if (!checkCollision(activePiece.pos, newShape, grid)) {
      setActivePiece({ ...activePiece, shape: newShape });
    }
  };

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveSideways(-1);
      if (e.key === 'ArrowRight') moveSideways(1);
      if (e.key === 'ArrowDown') moveDown();
      if (e.key === 'ArrowUp') rotate();
      if (e.key === ' ') rotate();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, activePiece, grid, isPaused, gameOver]);

  useEffect(() => {
    if (active && !gameOver && !isPaused) {
      const interval = setInterval(moveDown, 800);
      return () => clearInterval(interval);
    }
  }, [active, gameOver, isPaused, moveDown]);

  useEffect(() => {
    if (active && !activePiece && !gameOver) {
      spawnPiece();
    }
  }, [active, activePiece, gameOver, spawnPiece]);

  const startGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setActivePiece(null);
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0c0c0c] flex items-center justify-center pointer-events-auto overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative flex flex-col items-center w-full max-w-5xl px-8 z-10">
        
        {/* Blocky Google Logo */}
        <div className="mb-12 flex gap-1 select-none">
          {/* G */}
          <div className="grid grid-cols-4 grid-rows-5 gap-1">
            {[0,1,2,3, 4,0,0,0, 8,0,10,11, 12,0,0,15, 16,17,18,19].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${v !== 0 ? 'bg-blue-500 shadow-[inset_-2px_-2px_rgba(0,0,0,0.3)]' : ''}`} />
            ))}
          </div>
          {/* o */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 self-end mb-1">
             {[1,1,1, 1,0,1, 1,1,1].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${v ? 'bg-red-500 shadow-[inset_-2px_-2px_rgba(0,0,0,0.3)]' : ''}`} />
            ))}
          </div>
          {/* o */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 self-end mb-1">
             {[1,1,1, 1,0,1, 1,1,1].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${v ? 'bg-yellow-500 shadow-[inset_-2px_-2px_rgba(0,0,0,0.3)]' : ''}`} />
            ))}
          </div>
          {/* g */}
          <div className="grid grid-cols-3 grid-rows-5 gap-1 self-end mb-[-4px]">
             {[1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${v ? 'bg-blue-500 shadow-[inset_-2px_-2px_rgba(0,0,0,0.3)]' : ''}`} />
            ))}
          </div>
          {/* l */}
          <div className="grid grid-cols-1 grid-rows-5 gap-1">
             {[1,1,1,1,1].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${v ? 'bg-green-500 shadow-[inset_-2px_-2px_rgba(0,0,0,0.3)]' : ''}`} />
            ))}
          </div>
          {/* e */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 self-end mb-1">
             {[1,1,1, 1,1,0, 1,1,1].map((v, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${v ? 'bg-red-500 shadow-[inset_-2px_-2px_rgba(0,0,0,0.3)]' : ''}`} />
            ))}
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="w-full max-w-2xl relative mb-12 opacity-80 scale-95 pointer-events-none">
          <div className="flex items-center w-full px-6 py-4 rounded-full border border-gray-800 bg-[#1a1a1a] shadow-xl">
            <Search className="text-gray-600 mr-4" size={20} />
            <span className="flex-1 text-gray-500 text-xl font-light">Try Logo↑ for a surprise!</span>
            <Mic className="text-blue-500" size={20} />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <div className="px-6 py-2 bg-[#222] border border-gray-800 rounded text-sm font-medium text-gray-600">Google Search</div>
            <div className="px-6 py-2 bg-[#222] border border-gray-800 rounded text-sm font-medium text-gray-600">I'm Feeling Lucky</div>
          </div>
        </div>

        {/* Game Layout */}
        <div className="flex gap-12 items-start">
          
          {/* Main Grid */}
          <div className="relative border-[12px] border-[#1a1a1a] rounded-xl overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <div 
              className="grid gap-px bg-[#0a0a0a]"
              style={{ 
                gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`
              }}
            >
              {grid.map((row, y) => row.map((color, x) => {
                let currentBlockColor = color;
                if (activePiece) {
                  const py = y - activePiece.pos.y;
                  const px = x - activePiece.pos.x;
                  if (py >= 0 && py < activePiece.shape.length && px >= 0 && px < activePiece.shape[py].length) {
                    if (activePiece.shape[py][px] !== 0) {
                      currentBlockColor = PIECES[activePiece.type].color;
                    }
                  }
                }
                
                return (
                  <div 
                    key={`${x}-${y}`} 
                    className={`w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] rounded-sm transition-colors duration-100 ${currentBlockColor || 'bg-black/20'}`}
                    style={{ 
                      boxShadow: currentBlockColor ? 'inset -3px -3px rgba(0,0,0,0.3), inset 3px 3px rgba(255,255,255,0.1)' : 'none',
                    }}
                  />
                );
              }))}
            </div>

            {/* Overlays */}
            {(gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm p-6 text-center">
                <div className="text-6xl mb-6">🧱</div>
                <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
                  {gameOver ? 'STACK OVERFLOW' : 'SYSTEM PAUSED'}
                </h3>
                <button 
                  onClick={startGame}
                  className="px-12 py-4 bg-blue-600 text-white font-black text-xl rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                >
                  {gameOver ? 'REBOOT' : 'INITIALIZE'}
                </button>
              </div>
            )}
          </div>

          {/* Stats / Controls Sidebar */}
          <div className="flex flex-col gap-8 w-48">
             <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 shadow-xl">
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Total Score</div>
               <div className="text-3xl font-mono text-blue-400">{score.toString().padStart(6, '0')}</div>
             </div>

             <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 shadow-xl">
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Command Deck</div>
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-400">MOVE</span>
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-white">← →</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-400">DROP</span>
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-white">↓</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-400">ROTATE</span>
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-white">↑</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-400">SWAP</span>
                    <span className="px-2 py-0.5 bg-gray-800 rounded text-white">SPACE</span>
                 </div>
               </div>
             </div>

             <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-full py-3 bg-[#222] border border-gray-800 rounded-xl text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-[#333] transition-colors"
             >
                {isPaused ? 'Resume' : 'Pause'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
