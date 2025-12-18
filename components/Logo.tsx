
import React from 'react';

export const Logo: React.FC<{ mode: string }> = ({ mode }) => {
  const letters = [
    { char: 'G', color: 'text-blue-500' },
    { char: 'o', color: 'text-red-500' },
    { char: 'o', color: 'text-yellow-500' },
    { char: 'g', color: 'text-blue-500' },
    { char: 'l', color: 'text-green-500' },
    { char: 'e', color: 'text-red-500' },
  ];

  return (
    <div className={`flex text-7xl font-bold select-none mb-8 ${mode === 'mirror' ? '' : 'scale-x-[-1]'}`}>
      {letters.map((l, i) => (
        <span key={i} className={l.color}>{l.char}</span>
      ))}
    </div>
  );
};
