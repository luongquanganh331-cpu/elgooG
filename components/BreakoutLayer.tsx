
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 35;

export const BreakoutLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'WON' | 'LOST'>('IDLE');
  const [score, setScore] = useState(0);

  const requestRef = useRef<number>(null);
  const paddleX = useRef(0);
  const ballX = useRef(0);
  const ballY = useRef(0);
  const ballDX = useRef(4);
  const ballDY = useRef(-4);
  const bricks = useRef<any[]>([]);

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    paddleX.current = (canvas.width - PADDLE_WIDTH) / 2;
    ballX.current = canvas.width / 2;
    ballY.current = canvas.height - 30;
    ballDX.current = 4;
    ballDY.current = -4;
    
    const brickWidth = (canvas.width - BRICK_OFFSET_LEFT * 2) / BRICK_COLS - BRICK_PADDING;
    bricks.current = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.current[c] = [];
      for (let r = 0; r < BRICK_ROWS; r++) {
        bricks.current[c][r] = { 
          x: 0, 
          y: 0, 
          status: 1, 
          color: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'][Math.floor(Math.random() * 4)],
          width: brickWidth
        };
      }
    }
    setScore(0);
    setGameState('IDLE');
  }, []);

  useEffect(() => {
    if (active) initGame();
  }, [active, initGame]);

  const draw = useCallback(() => {
    if (!canvasRef.current || gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bricks
    let allCleared = true;
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        const b = bricks.current[c][r];
        if (b.status === 1) {
          allCleared = false;
          const brickX = c * (b.width + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
          b.x = brickX;
          b.y = brickY;
          ctx.beginPath();
          ctx.roundRect(brickX, brickY, b.width, BRICK_HEIGHT, 4);
          ctx.fillStyle = b.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    }

    if (allCleared) {
      setGameState('WON');
      return;
    }

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ballX.current, ballY.current, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#5f6368";
    ctx.fill();
    ctx.closePath();

    // Draw Paddle
    ctx.beginPath();
    ctx.roundRect(paddleX.current, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
    ctx.fillStyle = "#4285F4";
    ctx.fill();
    ctx.closePath();

    // Collision Detection (Walls)
    if (ballX.current + ballDX.current > canvas.width - BALL_RADIUS || ballX.current + ballDX.current < BALL_RADIUS) {
      ballDX.current = -ballDX.current;
    }
    if (ballY.current + ballDY.current < BALL_RADIUS) {
      ballDY.current = -ballDY.current;
    } else if (ballY.current + ballDY.current > canvas.height - BALL_RADIUS - 10) {
      if (ballX.current > paddleX.current && ballX.current < paddleX.current + PADDLE_WIDTH) {
        ballDY.current = -ballDY.current;
        // Add some angle based on where it hit the paddle
        const hitPos = (ballX.current - (paddleX.current + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
        ballDX.current = hitPos * 6;
      } else {
        setGameState('LOST');
      }
    }

    // Collision Detection (Bricks)
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        const b = bricks.current[c][r];
        if (b.status === 1) {
          if (ballX.current > b.x && ballX.current < b.x + b.width && ballY.current > b.y && ballY.current < b.y + BRICK_HEIGHT) {
            ballDY.current = -ballDY.current;
            b.status = 0;
            setScore(s => s + 1);
          }
        }
      }
    }

    ballX.current += ballDX.current;
    ballY.current += ballDY.current;

    requestRef.current = requestAnimationFrame(draw);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, draw]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relativeX = clientX - rect.left;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX.current = relativeX - PADDLE_WIDTH / 2;
    }
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto overflow-hidden">
      <div className="mb-6 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-2 flex gap-1">
          <span className="text-blue-500">B</span>
          <span className="text-red-500">r</span>
          <span className="text-yellow-500">e</span>
          <span className="text-blue-500">a</span>
          <span className="text-green-500">k</span>
          <span className="text-red-500">o</span>
          <span className="text-blue-500">u</span>
          <span className="text-yellow-500">t</span>
        </h2>
        <div className="text-xl font-mono text-gray-500">Bricks Cleared: {score}</div>
      </div>
      
      <div 
        className="relative border-4 border-gray-100 rounded-2xl overflow-hidden shadow-2xl bg-white"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        <canvas 
          ref={canvasRef} 
          width={window.innerWidth < 600 ? window.innerWidth - 40 : 600} 
          height={400} 
        />
        
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <button 
              onClick={() => setGameState('PLAYING')}
              className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105"
            >
              START GAME
            </button>
          </div>
        )}

        {(gameState === 'WON' || gameState === 'LOST') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white animate-in zoom-in duration-300">
            <h3 className="text-5xl font-black mb-6 uppercase">
              {gameState === 'WON' ? 'VICTORY' : 'DIMENSION LOST'}
            </h3>
            <button 
              onClick={initGame}
              className="px-8 py-3 bg-white text-black rounded-full font-bold transition-all hover:bg-gray-200"
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">Move mouse or finger to control paddle</p>
    </div>
  );
};
