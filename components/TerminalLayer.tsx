
import React, { useState, useEffect, useRef } from 'react';
import { fetchElgoogSearch } from '../services/geminiService';

export const TerminalLayer: React.FC<{ active: boolean; onSearch: (q: string) => void }> = ({ active, onSearch }) => {
  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [promptMode, setPromptMode] = useState<'CHOICE' | 'SEARCH'>('CHOICE');
  const [inputValue, setInputValue] = useState('');
  const [news, setNews] = useState<string[]>([
    "AL GORE INVENTS THE INTERNET",
    "MICHAEL JACKSON OWNS PLUTO",
    "RONALD REAGAN VISITS BELGIUM BY ACCIDENT",
    "FIRST DEMOCRAT IN SPACE"
  ]);

  const bootSequence = [
    "ROM BIOS (C)1984 MIRROR CORP",
    "CHECKING RAM... 640KB OK",
    "MOUNTING DRIVE A: ... SUCCESS",
    "LOADING ELGOOG.SYS...",
    "ESTABLISHING CONNECTION VIA 2400 BAUD MODEM...",
    "CONNECTING TO THE MIRROR DIMENSION...",
    "HANDSHAKE SUCCESSFUL."
  ];

  useEffect(() => {
    if (!active) {
      setBooting(true);
      setBootLines([]);
      return;
    }

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 800);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (booting) return;

    if (promptMode === 'CHOICE') {
      if (e.key.toLowerCase() === 's') {
        setPromptMode('SEARCH');
      } else if (e.key.toLowerCase() === 'l') {
        onSearch("I'm feeling lucky");
      }
    } else if (promptMode === 'SEARCH') {
      if (e.key === 'Enter') {
        if (inputValue.trim()) {
          onSearch(inputValue);
          setPromptMode('CHOICE');
          setInputValue('');
        }
      } else if (e.key === 'Escape') {
        setPromptMode('CHOICE');
      }
    }
  };

  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black text-[#00FF00] font-mono p-4 flex flex-col select-none overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {booting ? (
        <div className="flex flex-col gap-1">
          {bootLines.map((line, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-75">{line}</div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative border-t-2 border-b-2 border-dashed border-gray-700 py-4">
          <div className="text-center mb-4">
            Welcome back, <span className="text-[#00FF00]">ANONYMOUS</span>. Today is {today.toUpperCase()}!
          </div>

          {/* ASCII LOGO */}
          <div className="flex justify-center my-6 whitespace-pre leading-[1.1] text-[0.6rem] md:text-sm lg:text-base">
{`        .g8""""bgd                                              '7MM
      .dP'      M                                               MM
      dm'       '      ,pW"Wq.   ,pW"Wq.   .P"Ybm mmm   MM    .gP"Ya
      MM              6W'   Wb 6W'   Wb :MI  I8       MM   ,M'   Yb
      MM.      '7MMF' 8M     MB 8M     M8  WmmmP''      MM   8M"""""""
      'Mb       MM   YA.   ,A9 YA.   ,A9 8M           MM   YM.    ,
        "bmmmdPY     'Ybmd9'   'Ybmd9'   YMMMMMb    .JMML. 'Mbmmd'
                                        6'     dP
         NET SEARCH ENGINE              Ybm mmd'`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 mt-8 max-w-4xl mx-auto w-full">
            <div className="font-bold text-[#00FF00]">TODAY'S NEWS :</div>
            <div className="flex flex-col gap-2 border-l border-dashed border-[#00FF00] pl-6">
              {news.map((item, i) => (
                <div key={i} className="hover:bg-[#00FF00]/10 transition-colors cursor-default">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto mb-10 text-center flex flex-col items-center gap-4">
            <div className="text-white text-lg md:text-xl font-bold">
              'Google <span className="text-[#00FF00]">(S)</span>earch' or 'I'm feeling <span className="text-[#00FF00]">(L)</span>ucky'? Choose (S/L)
            </div>
            
            {promptMode === 'SEARCH' && (
              <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 border border-[#00FF00] rounded animate-in zoom-in duration-200">
                <span>QUERY:\></span>
                <input 
                  autoFocus
                  className="bg-transparent border-none outline-none text-[#00FF00] w-64 md:w-96"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
          </div>

          {/* STATUS BAR */}
          <div className="absolute bottom-[-16px] left-[-16px] right-[-16px] bg-[#0000AA] text-white flex divide-x divide-white/30 text-[10px] md:text-xs font-bold uppercase py-1">
            <div className="px-4 flex-1">GOOGLE BBS TUNNEL</div>
            <div className="px-4">Serial</div>
            <div className="px-4">Connected</div>
            <div className="px-4">Login time {new Date().toLocaleTimeString('en-GB', { hour12: false })}</div>
          </div>
        </div>
      )}
    </div>
  );
};
