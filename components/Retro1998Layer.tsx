
import React, { useState } from 'react';
import { Search, RotateCcw, ArrowLeft, ArrowRight, X, Home, History, Star, Printer, ChevronDown } from 'lucide-react';

export const Retro1998Layer: React.FC<{ active: boolean; onSearch: (q: string) => void }> = ({ active, onSearch }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  if (!active) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(true);
      onSearch(query);
    }
  };

  const results = [
    { title: "Google Search: <Unclesam>", snippet: "...terms. Search the entire web from the Google home page! Copyright...", url: "www.google.com/unclesam" },
    { title: "Google Search: <Linux>", snippet: "...terms. Search the entire web from the Google home page! Copyright...", url: "www.google.com/linux" },
    { title: "www.google.com/search", snippet: "The classic search entry point.", url: "www.google.com/search" },
    { title: "Why Use Google?", snippet: "...Why Use Google? Because Google delivers the most relevant search...", url: "www.google.com/why_use.html" },
    { title: "Google Help", snippet: "...Basic Search To enter a query into Google, just type in a few descriptive...", url: "www.google.com/help.html" }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#C0C0C0] flex flex-col font-serif select-none overflow-hidden text-black">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#000080] to-[#1084D0] p-1 flex justify-between items-center text-white px-2">
        <div className="flex items-center gap-2 text-xs font-bold">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale contrast-200" alt="icon" />
          Google! - Microsoft Internet Explorer
        </div>
        <div className="flex gap-1">
          <button className="w-5 h-5 bg-[#C0C0C0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black text-xs font-bold flex items-center justify-center leading-none">_</button>
          <button className="w-5 h-5 bg-[#C0C0C0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black text-xs font-bold flex items-center justify-center leading-none">□</button>
          <button className="w-5 h-5 bg-[#C0C0C0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black text-xs font-bold flex items-center justify-center leading-none">×</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-0.5 text-xs border-b border-white">
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
          <span key={m} className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{m}</span>
        ))}
      </div>

      {/* Tool Bar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-[#808080] shadow-[inset_0_1px_white]">
        <div className="flex items-center gap-1 pr-2 border-r border-[#808080]">
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8] active:bg-[#D4D0C8] active:border active:border-[#808080]">
            <ArrowLeft size={16} /> <span className="text-[10px]">Back</span>
          </button>
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8] opacity-50">
            <ArrowRight size={16} /> <span className="text-[10px]">Forward</span>
          </button>
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <X size={16} /> <span className="text-[10px]">Stop</span>
          </button>
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <RotateCcw size={16} /> <span className="text-[10px]">Refresh</span>
          </button>
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <Home size={16} /> <span className="text-[10px]">Home</span>
          </button>
        </div>
        <div className="flex items-center gap-1 pr-2 border-r border-[#808080]">
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <Search size={16} /> <span className="text-[10px]">Search</span>
          </button>
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <Star size={16} /> <span className="text-[10px]">Favorites</span>
          </button>
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <History size={16} /> <span className="text-[10px]">History</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex flex-col items-center p-1 hover:bg-[#D4D0C8]">
            <Printer size={16} /> <span className="text-[10px]">Print</span>
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#C0C0C0] border-b border-[#808080] text-xs">
        <span className="text-[#808080]">Address</span>
        <div className="flex-1 bg-white border border-[#808080] flex items-center px-1 py-0.5">
          <img src="https://www.google.com/favicon.ico" className="w-3 h-3 mr-1 grayscale contrast-150" alt="" />
          <span>http://www.google.com/</span>
          <ChevronDown size={12} className="ml-auto" />
        </div>
        <button className="px-2 border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white">Go</button>
        <span className="text-[#808080] px-2 border-l border-[#808080]">Links</span>
      </div>

      {/* Web Content Container */}
      <div className="flex-1 bg-white overflow-y-auto p-8 flex flex-col items-center">
        {/* Retro Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-baseline font-bold italic text-6xl tracking-tight">
            <span className="text-blue-700">G</span>
            <span className="text-red-600">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-700">g</span>
            <span className="text-green-600">l</span>
            <span className="text-red-600">e</span>
            <span className="text-xs italic text-gray-400 align-top ml-1">!</span>
            <span className="text-sm font-normal text-blue-900 ml-2">BETA</span>
          </div>

          <form onSubmit={handleSearch} className="flex flex-wrap items-center justify-center gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-[#808080] px-2 py-1 w-64 md:w-96 outline-none text-base" 
            />
            <select className="border border-[#808080] bg-white text-xs px-1 py-1">
              <option>10 results</option>
              <option>30 results</option>
              <option>100 results</option>
            </select>
            <button type="submit" className="bg-[#D4D0C8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] px-4 py-1 text-sm font-bold active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white">Google Search</button>
            <button type="button" className="bg-[#D4D0C8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] px-4 py-1 text-sm font-bold active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white whitespace-nowrap">I'm feeling lucky</button>
          </form>
        </div>

        {/* Results Area */}
        {showResults && (
          <div className="w-full max-w-4xl border-t border-[#808080] pt-4 animate-in fade-in duration-500">
            <div className="text-xs text-gray-500 mb-6 text-center">
              Showing results 1-10 of approximately 234,000 for {query}. Search took 0.06 seconds.
            </div>
            <div className="space-y-6">
              {results.map((r, i) => (
                <div key={i} className="flex flex-col">
                  <a href="#" className="text-[#0000FF] underline text-xl hover:text-purple-800">{r.title}</a>
                  <p className="text-sm text-black leading-tight mb-1">{r.snippet}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="text-[#008000]">{r.url}/</span>
                    <a href="#" className="text-blue-600 underline">Cached</a>
                    <span className="text-gray-400">-</span>
                    <a href="#" className="text-blue-600 underline">GoogleScout</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-10 text-xs flex flex-col items-center gap-2">
           <a href="#" className="text-blue-700 underline font-bold">google.stanford.edu/</a>
           <p className="text-gray-500 italic">Constructing and refining searches in Google: Detailed Searching Instructions</p>
        </div>
      </div>

      {/* Taskbar */}
      <div className="bg-[#C0C0C0] border-t-2 border-white flex justify-between items-center px-1 text-xs py-0.5">
        <div className="flex gap-2">
          <span className="border-r border-[#808080] pr-2">Done</span>
        </div>
        <div className="flex items-center gap-1 border-l border-[#808080] pl-2">
          <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale contrast-200" alt="" />
          <span>Internet</span>
        </div>
      </div>
    </div>
  );
};
