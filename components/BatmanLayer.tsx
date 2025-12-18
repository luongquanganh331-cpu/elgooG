
import React, { useState, useEffect } from 'react';
import { Search, Mic } from 'lucide-react';

export const BatmanLayer: React.FC<{ active: boolean }> = ({ active }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const results = [
    { title: "Google Batman Easter Egg — Play on elgooG", url: "https://elgoog.im/batman", snippet: "Relive Google's Batman Easter egg — tap the Bat-Signal to call the Dark Knight and watch him swoop across your screen." },
    { title: "Google Upside Down — Play on elgooG", url: "https://elgoog.im/upside-down", snippet: "Turn the Google Search page upside down — text, images, and UI included. Browse an inverted, fully working version of Google in this playful Easter egg." },
    { title: "Google Wizard of Oz — Play on elgooG", url: "https://elgoog.im/wizard-of-oz", snippet: "Click the ruby slippers and watch your Google results whisk into sepia-toned Kansas. Our restored 'Wizard of Oz' Easter egg brings Dorothy's trip — tornado and all — right to your search page." },
    { title: "Bing's Mirrored Reflection - gniB", url: "https://gnib.org", snippet: "Discover Bing Search Engine's unique mirrored counterpart, gniB, a rotated and reversed version that offers a fresh perspective on your search experience." },
    { title: "Friends Ross \"Pivot\" Easter Egg — Play on elgooG", url: "https://elgoog.im/friends/ross", snippet: "Relive Ross Geller's \"Pivot!\" moment from Google Search. Tap the couch to rotate the page, trigger Ross's audio clips, and watch the couch-saw finale." },
  ];

  useEffect(() => {
    if (!active) {
      setIsActivated(false);
      setShowAnimation(false);
    }
  }, [active]);

  const handleSignal = () => {
    setIsActivated(true);
    // Bat signal sound (synthetic)
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 3);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 3);

    setTimeout(() => {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        setIsActivated(false);
      }, 5000);
    }, 1000);
  };

  if (!active) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-colors duration-1000 overflow-y-auto pointer-events-auto font-sans ${isActivated ? 'bg-slate-950 text-slate-100' : 'bg-white text-gray-900'}`}>
      
      {/* Search Header */}
      <div className={`sticky top-0 border-b px-8 py-6 z-10 flex items-center gap-8 transition-colors duration-1000 ${isActivated ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
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
            value="Google Batman Easter Egg" 
            className={`w-full px-6 py-3 rounded-full border shadow-sm outline-none pl-12 transition-colors duration-1000 ${isActivated ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
          <Mic className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Results List */}
        <div className="space-y-10">
          <div className="text-sm text-gray-500">About 110 results (0.32 seconds)</div>
          
          {results.map((res, i) => (
            <div key={i} className="transition-opacity duration-1000">
              <div className={`text-xs mb-1 ${isActivated ? 'text-slate-400' : 'text-gray-600'}`}>{res.url}</div>
              <a href="#" className={`text-xl block mb-1 font-medium hover:underline ${isActivated ? 'text-blue-400' : 'text-blue-700'}`}>{res.title}</a>
              <p className={`text-sm leading-relaxed ${isActivated ? 'text-slate-300' : 'text-gray-700'}`}>{res.snippet}</p>
            </div>
          ))}
        </div>

        {/* Knowledge Panel */}
        <div className="space-y-4">
          <div className={`border rounded-xl p-6 shadow-sm transition-colors duration-1000 ${isActivated ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-3xl font-medium mb-1">Batman</h3>
                <div className="text-sm text-gray-500">Google Easter Egg</div>
              </div>
              <button 
                onClick={handleSignal}
                className={`p-4 rounded-full transition-all active:scale-90 ${isActivated ? 'bg-yellow-400/20 shadow-[0_0_30px_rgba(250,204,21,0.2)]' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="w-16 h-16 relative">
                  <img 
                    src="https://www.gstatic.com/images/branding/product/2x/batman_signal_96dp.png" 
                    alt="Bat Signal"
                    className={`w-full h-full object-contain ${isActivated ? 'animate-pulse' : ''}`}
                  />
                </div>
              </button>
            </div>
            
            <div className={`border-t pt-4 text-sm leading-relaxed transition-colors duration-1000 ${isActivated ? 'border-slate-800 text-slate-300' : 'border-gray-100 text-gray-700'}`}>
              <p>In February 2022, Google's Batman Easter egg brought the Caped Crusader to your search results. Look up terms like "Bruce Wayne," "Gotham City," or "Bat-Signal" and the iconic yellow signal would appear.</p>
              <p className="mt-4">Although Google retired the feature in February 2023, we've preserved the full experience here. Just click the Bat-Signal and watch Batman swing into action!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Overlay */}
      {isActivated && (
        <div className="fixed inset-0 pointer-events-none z-[110] flex items-center justify-center overflow-hidden">
          {/* Clouds and Signal */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]">
            <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vh] bg-yellow-400/10 blur-[100px] animate-pulse rounded-full" />
            <div className="absolute top-[10%] left-[20%] w-32 h-32 border-[20px] border-yellow-400/20 rounded-full flex items-center justify-center scale-[5] opacity-50">
               <img src="https://www.gstatic.com/images/branding/product/2x/batman_signal_96dp.png" alt="" className="w-20 h-20 invert opacity-40" />
            </div>
          </div>

          {/* Swinging Batman Silhouette (Simple animation) */}
          {showAnimation && (
            <div className="absolute bottom-0 w-full h-[60vh] animate-batman-swing">
              <div className="relative w-40 h-64 mx-auto filter brightness-0 invert">
                 <img src="https://www.gstatic.com/images/branding/product/2x/batman_signal_96dp.png" alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes batmanSwing {
          0% { transform: translateX(-150%) translateY(0) rotate(-45deg); }
          50% { transform: translateX(0) translateY(-100px) rotate(0deg); }
          100% { transform: translateX(150%) translateY(0) rotate(45deg); }
        }
        .animate-batman-swing {
          animation: batmanSwing 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};
