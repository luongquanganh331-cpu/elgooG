
import React from 'react';
import { AppMode } from '../types';
// Import X icon from lucide-react
import { X } from 'lucide-react';

interface HubProps {
  active: boolean;
  onSelect: (mode: AppMode) => void;
  onClose: () => void;
}

export const EasterEggHub: React.FC<HubProps> = ({ active, onSelect, onClose }) => {
  if (!active) return null;

  const officialRestored = [
    { name: 'Thanos Snap', mode: AppMode.THANOS },
    { name: 'Batman', mode: AppMode.BATMAN },
    // Fixed: changed MARARIO to MARIO to match AppMode enum
    { name: 'Super Mario Bros.', mode: AppMode.MARIO },
    { name: 'Wicked', mode: AppMode.CLASSIC },
    { name: 'Dinosaur Game: Birthday', mode: AppMode.DINO },
    { name: 'Zerg Rush', mode: AppMode.ZERG_RUSH },
    { name: 'Underwater Search', mode: AppMode.UNDERWATER },
    { name: 'Friends: Phoebe', mode: AppMode.CLASSIC },
    { name: 'Atari Breakout', mode: AppMode.BREAKOUT },
    { name: 'Google Zipper', mode: AppMode.ZIPPER },
    { name: 'Google Mirror', mode: AppMode.MIRROR },
    { name: 'Let It Snow', mode: AppMode.LET_IT_SNOW },
    { name: 'Wizard of Oz', mode: AppMode.ASKEW },
    { name: 'Google Guitar', mode: AppMode.GUITAR },
    { name: 'The Mandalorian', mode: AppMode.CLASSIC },
    { name: 'Star Wars Opening Crawl', mode: AppMode.CLASSIC },
    { name: 'Google Maps Snake', mode: AppMode.SNAKE },
    { name: 'Legally Blonde', mode: AppMode.CLASSIC },
  ];

  const officialEnhanced = [
    { name: 'Dinosaur Game', mode: AppMode.DINO },
    { name: 'Dinosaur Game: 3D', mode: AppMode.DINO },
    { name: 'Do a Barrel Roll', mode: AppMode.BARREL_ROLL },
    { name: 'Snake Game', mode: AppMode.SNAKE },
    { name: 'Google Gravity', mode: AppMode.GRAVITY },
    { name: 'Floating Google', mode: AppMode.GRAVITY },
    { name: 'Pac-Man Game', mode: AppMode.PACMAN },
    { name: 'Google in 1998', mode: AppMode.RETRO_1998 },
    { name: 'Google Tilt', mode: AppMode.ASKEW },
  ];

  const unofficial = [
    { name: 'Google Tetris', mode: AppMode.TETRIS },
    { name: 'Google Matrix', mode: AppMode.MATRIX },
    { name: 'Google Dark Mode', mode: AppMode.CLASSIC },
    { name: '2048 Game', mode: AppMode.GAME_2048 },
    { name: 'Space Invaders', mode: AppMode.SPACE_INVADERS },
    { name: 'Gooooooooooogle', mode: AppMode.CLASSIC },
    { name: 'əlooǤ', mode: AppMode.MIRROR },
    { name: 'Black Hole Effect', mode: AppMode.BLACK_HOLE },
    { name: 'Google Search Mirror', mode: AppMode.MIRROR },
    { name: 'Google Terminal', mode: AppMode.BBS },
    { name: 'Google FAN', mode: AppMode.FAN },
  ];

  const Section = ({ title, items, color }: { title: string, items: any[], color: string }) => (
    <div className="flex-1 min-w-[320px] bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden border border-gray-800">
      <div className={`${color} p-3 text-center text-white font-bold border-b border-gray-700 text-sm uppercase tracking-widest`}>
        {title}
      </div>
      <div className="p-1">
        {items.map((item, i) => (
          <button
            key={item.name}
            onClick={() => onSelect(item.mode)}
            className="w-full text-left px-4 py-2 border-b border-gray-800 hover:bg-white/5 transition-colors flex items-center group"
          >
            <span className="text-gray-400 text-xs w-6">{i + 1}.</span>
            <span className="text-gray-200 text-sm font-medium flex-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[250] bg-[#0c0c0c]/95 backdrop-blur-3xl overflow-y-auto pointer-events-auto flex flex-col items-center">
      <div className="max-w-7xl w-full p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center p-1">
               <div className="w-full h-full bg-[#0c0c0c] rounded-full flex items-center justify-center text-xl font-black">X</div>
            </div>
            <span>elgooG <span className="text-gray-500 font-light">Hub</span></span>
          </h1>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            {/* Using X component imported from lucide-react */}
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          <Section 
            title="Official Google Easter Eggs — Restored" 
            items={officialRestored} 
            color="bg-blue-600/50" 
          />
          <Section 
            title="Official Google Easter Eggs — Enhanced" 
            items={officialEnhanced} 
            color="bg-red-600/50" 
          />
          <Section 
            title="Unofficial Google Easter Eggs — Enjoy!" 
            items={unofficial} 
            color="bg-yellow-600/50" 
          />
        </div>
      </div>
    </div>
  );
};
