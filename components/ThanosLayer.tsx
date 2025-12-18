
import React, { useState, useEffect } from 'react';
import { Search, Mic, Zap } from 'lucide-react';

export const ThanosLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [isSnapped, setIsSnapped] = useState(false);
  const [invisibleIndices, setInvisibleIndices] = useState<number[]>([]);

  const results = [
    { title: "Google Atari Breakout — Play on elgooG", url: "https://elgoog.im/breakout", snippet: "Play the restored Google Atari Breakout (aka Google Block Breaker) Easter egg. Turn Google Images into a classic brick-smashing arcade and bounce a ball to clear image tiles!" },
    { title: "Google Zipper Doodle Game — Play on elgooG", url: "https://elgoog.im/zipper", snippet: "Unzip the google homepage with this playful, tactile Easter egg. Drag the zipper to peel the page open and see what's hiding underneath." },
    { title: "Google Space Invaders Arcade — Play on elgooG", url: "https://elgoog.im/space-invaders", snippet: "Repel an alien swarm in a playful, Google-flavored take on Space Invaders. Jump into the arcade classic online — now with Google-letter shields." },
    { title: "Bing's Mirrored Reflection - gniB", url: "https://gnib.org", snippet: "Discover Bing Search Engine's unique mirrored counterpart, gniB, a rotated and reversed version that offers a fresh perspective on your search experience." },
    { title: "Google Snake Game — Play on elgooG", url: "https://elgoog.im/snake", snippet: "Play Google's Snake from the 2013 Chinese New Year Doodle. Steer the snake, grab snacks, and enjoy a faithful remake with polished mobile controls and a comfy dark mode." },
    { title: "IP Address Geolocation Lookup", url: "https://iploc.org", snippet: "Uncover your IP address and pinpoint your current location on an interactive map with our IP Geolocation lookup tool." }
  ];

  useEffect(() => {
    if (!active) {
      setIsSnapped(false);
      setInvisibleIndices([]);
    }
  }, [active]);

  const handleSnap = () => {
    if (isSnapped) {
      setIsSnapped(false);
      setInvisibleIndices([]);
      return;
    }

    setIsSnapped(true);
    // Snap sound effect (synthetic)
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);

    // Randomly choose half of the indices to disappear
    const indices = results.map((_, i) => i);
    const snapCount = Math.floor(results.length / 2);
    const toDisappear: number[] = [];
    while (toDisappear.length < snapCount) {
      const idx = indices[Math.floor(Math.random() * indices.length)];
      if (!toDisappear.includes(idx)) {
        toDisappear.push(idx);
      }
    }

    // Gradually hide results
    toDisappear.forEach((idx, i) => {
      setTimeout(() => {
        setInvisibleIndices(prev => [...prev, idx]);
      }, i * 600);
    });
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto pointer-events-auto font-sans text-gray-900">
      {/* Search Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10 flex items-center gap-8">
        <div className="flex text-3xl font-bold tracking-tight">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
        </div>
        <div className="flex-1 max-w-2xl relative">
          <input 
            type="text" 
            readOnly 
            value="Google Thanos Snap Easter Egg" 
            className="w-full px-6 py-3 rounded-full border border-gray-200 shadow-sm outline-none pl-12"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
          <Mic className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Results List */}
        <div className="space-y-10">
          <div className="text-sm text-gray-500">About 92,299,230 results (0.28 seconds)</div>
          
          {results.map((res, i) => (
            <div 
              key={i} 
              className={`transition-all duration-[2000ms] ease-in-out ${invisibleIndices.includes(i) ? 'opacity-0 scale-95 blur-xl pointer-events-none -translate-y-8' : 'opacity-100'}`}
            >
              <div className="text-xs text-gray-600 mb-1">{res.url}</div>
              <a href="#" className="text-xl text-blue-700 hover:underline block mb-1 font-medium">{res.title}</a>
              <p className="text-sm text-gray-700 leading-relaxed">{res.snippet}</p>
            </div>
          ))}
        </div>

        {/* Knowledge Panel */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-3xl font-medium mb-1">Thanos Snap</h3>
                <div className="text-sm text-gray-500">Google Easter Egg</div>
              </div>
              <button 
                onClick={handleSnap}
                className={`p-4 rounded-full transition-all active:scale-90 ${isSnapped ? 'bg-indigo-100 animate-pulse' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="w-16 h-16 relative">
                  <img 
                    src="https://www.gstatic.com/images/branding/product/2x/thanos_snap_96dp.png" 
                    alt="Gauntlet"
                    className={`w-full h-full object-contain ${isSnapped ? 'grayscale brightness-75' : ''}`}
                  />
                </div>
              </button>
            </div>
            
            <div className="border-t border-gray-100 pt-4 text-sm text-gray-700 leading-relaxed">
              <p>The Thanos Snap — also known as the Google Thanos Easter Egg — arrived in April 2019 alongside "Avengers: Endgame." Click the Infinity Gauntlet and half the page turns to dust, complete with on-point animation and sound. Google retired the effect in 2020, but you can relive it here — snap, restore, repeat!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
