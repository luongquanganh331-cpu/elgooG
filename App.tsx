
import React, { useState, useEffect, useCallback } from 'react';
import { AppMode } from './types';
import { Logo } from './components/Logo';
import { PhysicsLayer } from './components/PhysicsLayer';
import { UnderwaterEffect } from './components/UnderwaterEffect';
import { TerminalLayer } from './components/TerminalLayer';
import { ZergRushLayer } from './components/ZergRushLayer';
import { SnakeLayer } from './components/SnakeLayer';
import { BreakoutLayer } from './components/BreakoutLayer';
import { ThanosLayer } from './components/ThanosLayer';
import { BatmanLayer } from './components/BatmanLayer';
import { GuitarLayer } from './components/GuitarLayer';
import { DinoLayer } from './components/DinoLayer';
import { PacmanLayer } from './components/PacmanLayer';
import { TetrisLayer } from './components/TetrisLayer';
import { SuperMarioLayer } from './components/SuperMarioLayer';
import { Game2048Layer } from './components/Game2048Layer';
import { LetItSnowLayer } from './components/LetItSnowLayer';
import { EasterEggHub } from './components/EasterEggHub';
import { MatrixEffect } from './components/MatrixEffect';
import { BlackHoleEffect } from './components/BlackHoleEffect';
import { FanLayer } from './components/FanLayer';
import { Retro1998Layer } from './components/Retro1998Layer';
import { ZipperLayer } from './components/ZipperLayer';
import { SpaceInvadersLayer } from './components/SpaceInvadersLayer';
import { fetchElgoogSearch } from './services/geminiService';
import { 
  Search, RotateCcw, Anchor, Waves, Ghost, Terminal, 
  Triangle, Info, Menu, X, Bug, Zap, Sparkles, Volume2, Gamepad2, Blocks, Monitor, Cherry, Activity, LayoutGrid, Dna, Wind, History, Scissors, Rocket, ChevronLeft, ChevronRight, Music, Shield, Boxes, Star, CloudSnow
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CLASSIC);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);

  useEffect(() => {
    const classes = ['mirror-mode', 'rotate-1', 'scale-105', 'transition-all', 'duration-500', 'grayscale', 'sepia', 'animate-barrel-roll', 'matrix-mode', 'black-hole-pull'];
    document.body.classList.remove(...classes);

    if (mode === AppMode.MIRROR) {
      document.body.classList.add('mirror-mode');
    } else if (mode === AppMode.ASKEW) {
      document.body.classList.add('rotate-1', 'scale-105');
    } else if (mode === AppMode.BARREL_ROLL) {
      document.body.classList.add('animate-barrel-roll');
      setTimeout(() => handleModeChange(AppMode.CLASSIC), 4000);
    } else if (mode === AppMode.MATRIX) {
      document.body.classList.add('matrix-mode');
    } else if (mode === AppMode.BLACK_HOLE) {
      document.body.classList.add('black-hole-pull');
    }
  }, [mode]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMode(AppMode.CLASSIC);
        setShowResults(false);
        setIsHubOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = async (q: string = query) => {
    if (!q.trim()) return;

    setIsLoading(true);
    setShowResults(true);
    const response = await fetchElgoogSearch(q, mode);
    setResult(response);
    setIsLoading(false);
  };

  const handleLucky = () => {
    const modes = Object.values(AppMode).filter(m => m !== AppMode.HUB);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    handleModeChange(randomMode);
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setShowResults(false);
    setResult(null);
    setIsMenuOpen(false);
    setIsHubOpen(false);
  };

  const modesConfig = [
    { id: AppMode.CLASSIC, label: 'Classic', icon: RotateCcw, color: 'bg-blue-600' },
    { id: AppMode.HUB, label: 'Egg Hub', icon: LayoutGrid, color: 'bg-indigo-500' },
    { id: AppMode.MARIO, label: 'Mario', icon: Star, color: 'bg-red-500' },
    { id: AppMode.GAME_2048, label: '2048', icon: Boxes, color: 'bg-yellow-500' },
    { id: AppMode.LET_IT_SNOW, label: 'Snow', icon: CloudSnow, color: 'bg-sky-200' },
    { id: AppMode.TETRIS, label: 'Tetris', icon: Boxes, color: 'bg-blue-400' },
    { id: AppMode.THANOS, label: 'Thanos Snap', icon: Zap, color: 'bg-indigo-800' },
    { id: AppMode.BATMAN, label: 'Batman', icon: Shield, color: 'bg-slate-900' },
    { id: AppMode.GUITAR, label: 'Guitar', icon: Music, color: 'bg-orange-500' },
    { id: AppMode.SPACE_INVADERS, label: 'Invaders', icon: Rocket, color: 'bg-green-600' },
    { id: AppMode.ZIPPER, label: 'Zipper', icon: Scissors, color: 'bg-gray-400' },
    { id: AppMode.RETRO_1998, label: 'Google 1998', icon: History, color: 'bg-orange-800' },
    { id: AppMode.FAN, label: 'Google Fan', icon: Wind, color: 'bg-teal-700' },
    { id: AppMode.MIRROR, label: 'Mirror', icon: Ghost, color: 'bg-red-600' },
    { id: AppMode.GRAVITY, label: 'Gravity', icon: Anchor, color: 'bg-yellow-600' },
    { id: AppMode.UNDERWATER, label: 'Underwater', icon: Waves, color: 'bg-cyan-500' },
    { id: AppMode.BBS, label: 'BBS Terminal', icon: Monitor, color: 'bg-emerald-900' },
    { id: AppMode.DINO, label: 'T-Rex Game', icon: Activity, color: 'bg-gray-700' },
    { id: AppMode.PACMAN, label: 'Pac-man', icon: Cherry, color: 'bg-yellow-500' },
    { id: AppMode.MATRIX, label: 'Matrix', icon: Dna, color: 'bg-green-800' },
    { id: AppMode.ZERG_RUSH, label: 'Zerg Rush', icon: Bug, color: 'bg-orange-600' },
    { id: AppMode.SNAKE, label: 'Snake', icon: Gamepad2, color: 'bg-emerald-600' },
    { id: AppMode.BREAKOUT, label: 'Breakout', icon: Blocks, color: 'bg-red-500' },
  ];

  const isFullLayerActive = [
    AppMode.BBS, AppMode.SNAKE, AppMode.BREAKOUT, AppMode.DINO, 
    AppMode.PACMAN, AppMode.FAN, AppMode.RETRO_1998, AppMode.ZIPPER, 
    AppMode.SPACE_INVADERS, AppMode.THANOS, AppMode.BATMAN, AppMode.GUITAR, 
    AppMode.TETRIS, AppMode.MARIO, AppMode.GAME_2048
  ].includes(mode);

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-all duration-700 overflow-hidden ${mode === AppMode.UNDERWATER ? 'underwater-bg' : mode === AppMode.MATRIX ? 'bg-black' : 'bg-white'}`}>
      <PhysicsLayer mode={mode} />
      <UnderwaterEffect active={mode === AppMode.UNDERWATER} />
      <TerminalLayer active={mode === AppMode.BBS} onSearch={handleSearch} />
      <ZergRushLayer active={mode === AppMode.ZERG_RUSH} />
      <SnakeLayer active={mode === AppMode.SNAKE} />
      <BreakoutLayer active={mode === AppMode.BREAKOUT} />
      <DinoLayer active={mode === AppMode.DINO} />
      <PacmanLayer active={mode === AppMode.PACMAN} />
      <SpaceInvadersLayer active={mode === AppMode.SPACE_INVADERS} />
      <ThanosLayer active={mode === AppMode.THANOS} />
      <BatmanLayer active={mode === AppMode.BATMAN} />
      <GuitarLayer active={mode === AppMode.GUITAR} />
      <TetrisLayer active={mode === AppMode.TETRIS} />
      <SuperMarioLayer active={mode === AppMode.MARIO} />
      <Game2048Layer active={mode === AppMode.GAME_2048} />
      <LetItSnowLayer active={mode === AppMode.LET_IT_SNOW} />
      <MatrixEffect active={mode === AppMode.MATRIX} />
      <BlackHoleEffect active={mode === AppMode.BLACK_HOLE} />
      <FanLayer active={mode === AppMode.FAN} />
      <Retro1998Layer active={mode === AppMode.RETRO_1998} onSearch={handleSearch} />
      <ZipperLayer active={mode === AppMode.ZIPPER} onClose={() => setMode(AppMode.CLASSIC)} />
      
      <EasterEggHub active={mode === AppMode.HUB || isHubOpen} onSelect={handleModeChange} onClose={() => setIsHubOpen(false)} />

      <nav className="fixed top-0 left-0 right-0 z-[150] p-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50 transition-all shadow-xl border border-white/40 group">
            {isMenuOpen ? <X className="text-gray-800" /> : <Menu className="text-gray-800 group-hover:rotate-90 transition-transform" />}
          </button>
          <button onClick={() => setIsHubOpen(true)} className="p-3 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50 transition-all shadow-xl border border-white/40 flex items-center gap-2 pr-6">
            <LayoutGrid size={20} className="text-gray-800" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-800">Hub</span>
          </button>
        </div>
        <div className={`absolute top-20 left-4 bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl p-6 border border-gray-100 flex flex-col gap-3 transition-all duration-500 ease-out pointer-events-auto ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-90 pointer-events-none'}`}>
          <div className="text-[10px] font-black text-gray-400 px-3 pb-3 border-b border-gray-100 mb-2 uppercase tracking-[0.3em]">Quick Access</div>
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {modesConfig.map((m) => (
              <button key={m.id} onClick={() => handleModeChange(m.id)} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${mode === m.id ? `${m.color} text-white shadow-lg shadow-${m.color.split('-')[1]}-200 scale-105` : 'hover:bg-gray-50 text-gray-700 active:scale-95'}`}>
                <m.icon size={18} />
                <span className="text-sm font-bold tracking-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className={`z-40 transition-all duration-1000 flex flex-col items-center w-full max-w-4xl px-8 ${showResults || isFullLayerActive ? 'transform -translate-y-48 scale-90 opacity-0 pointer-events-none' : ''}`}>
        <Logo mode={mode} />
        <div className="w-full relative group max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="w-full">
            <div className={`flex items-center w-full px-7 py-5 rounded-full border border-gray-200 transition-all bg-white/90 backdrop-blur-sm ${mode === AppMode.MATRIX ? 'border-green-500/50 bg-black/50 text-green-500' : 'hover:shadow-2xl focus-within:shadow-2xl hover:border-blue-200'}`}>
              <Search className={`${mode === AppMode.MATRIX ? 'text-green-500' : 'text-blue-500'} mr-5`} size={26} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={mode === AppMode.MATRIX ? "Analyzing system..." : "Search the Void..."} className={`flex-1 outline-none text-2xl bg-transparent font-light placeholder:text-gray-300 ${mode === AppMode.MATRIX ? 'text-green-400 font-mono' : 'text-gray-800'}`} />
            </div>
            <div className="flex justify-center gap-8 mt-12">
              <button type="submit" className="px-10 py-4 bg-gray-50/80 backdrop-blur-md border border-gray-100 hover:border-blue-400 hover:text-blue-600 hover:shadow-xl rounded-2xl text-gray-500 transition-all text-sm font-black uppercase tracking-[0.2em]">elgooG Search</button>
              <button type="button" onClick={handleLucky} className="px-10 py-4 bg-gray-50/80 backdrop-blur-md border border-gray-100 hover:border-red-400 hover:text-red-600 hover:shadow-xl rounded-2xl text-gray-500 transition-all text-sm font-black uppercase tracking-[0.2em]">Lucky Hop</button>
            </div>
          </form>
        </div>
      </div>

      {showResults && !isFullLayerActive && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-8 pointer-events-none animate-in fade-in zoom-in-95 duration-700 ease-out">
          <div className="w-full max-w-3xl bg-white/90 backdrop-blur-3xl p-12 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-white/50 ring-1 ring-black/5 pointer-events-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4 text-[12px] text-blue-600 font-black uppercase tracking-[0.4em]">
                <Sparkles size={20} />
                <span>Mirrored Intelligence</span>
              </div>
              <button onClick={() => setShowResults(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
            </div>
            {isLoading ? (
              <div className="space-y-8 py-4">
                <div className="h-6 bg-gray-100 rounded-full w-full animate-pulse"></div>
                <div className="h-6 bg-gray-100 rounded-full w-4/5 animate-pulse"></div>
              </div>
            ) : (
              <div className="prose prose-2xl prose-slate max-w-none">
                <p className="text-4xl leading-tight text-gray-900 font-serif italic font-semibold tracking-tight">{result}</p>
                <div className="mt-16 flex items-center justify-between border-t border-gray-100 pt-10">
                  <button onClick={() => setShowResults(false)} className="text-sm font-black bg-gray-900 text-white px-10 py-4 rounded-2xl hover:bg-blue-600 transition-all hover:shadow-2xl active:scale-95 uppercase tracking-widest">New Quest</button>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Source: The Other Side</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isFullLayerActive && (
        <div className="fixed top-4 right-4 z-[210] flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-xl text-gray-800 rounded-full text-xs font-bold border border-white/40 shadow-xl pointer-events-auto cursor-pointer" onClick={() => handleModeChange(AppMode.CLASSIC)}>
          <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">Esc</span> to go back
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-md border-t border-gray-100/50 z-[50]">
        <div className="px-10 py-5 flex flex-wrap justify-between items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          <div className="flex gap-10"><a href="#" className="hover:text-blue-500 transition-colors">Void Maps</a><a href="#" className="hover:text-blue-500 transition-colors">Shadow Ads</a></div>
          <div className="bg-gray-100/50 px-4 py-1.5 rounded-full text-gray-500">Dimension ID: {mode.toUpperCase()}</div>
          <div className="flex gap-10"><a href="#" className="hover:text-blue-500 transition-colors">Privacy</a><a href="#" className="hover:text-blue-500 transition-colors">Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
