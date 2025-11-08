
import React, { useState } from 'react';
import type { Difficulty, GameMode, MapId } from '../types.ts';
import { MAPS } from '../constants.ts';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, mode: GameMode, map: MapId) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [mode, setMode] = useState<GameMode | null>(null);
  const [selectedMap, setSelectedMap] = useState<MapId | null>(null);

  const handleStart = () => {
    if (difficulty && mode && selectedMap) {
      onStart(difficulty, mode, selectedMap);
    }
  };
  
  const OptionButton: React.FC<{
      label: string;
      onClick: () => void;
      isActive: boolean;
    }> = ({ label, onClick, isActive }) => {
      const baseClasses = 'px-6 py-2 rounded-lg font-bold text-lg transition-all duration-200 border-2';
      const activeClasses = `bg-yellow-600 border-yellow-500 shadow-lg scale-105 text-black`;
      const inactiveClasses = 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white';
      return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
      )
  };

  return (
    <div className="text-center bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl border-2 border-slate-700 flex flex-col items-center space-y-6">
      <div>
        <h1 className="text-8xl font-bold mb-2 text-yellow-400 font-bangers tracking-wider" style={{ textShadow: '4px 4px 0px #000' }}>Balloon TD Arena</h1>
        <p className="text-lg text-slate-300 max-w-lg mx-auto">Place monkeys, pop bloons, and survive the waves.</p>
      </div>

      <div className="space-y-4 w-full max-w-xl">
        <h2 className="text-3xl font-bangers tracking-wider text-cyan-300">Select Map</h2>
        <div className="flex justify-center space-x-4">
            {Object.values(MAPS).map(map => (
                <button key={map.id} onClick={() => setSelectedMap(map.id)} className={`rounded-lg overflow-hidden border-4 transition-all duration-200 ${selectedMap === map.id ? 'border-yellow-500 scale-105 shadow-xl' : 'border-slate-700 hover:border-slate-500'}`}>
                   <div className="w-48 h-32 bg-slate-800">{map.thumbnail}</div>
                   <p className={`font-bold py-1 ${selectedMap === map.id ? 'bg-yellow-600 text-black' : 'bg-slate-800 text-white'}`}>{map.name}</p>
                </button>
            ))}
        </div>
      </div>

      <div className="flex space-x-12">
        <div className="space-y-4">
            <h2 className="text-3xl font-bangers tracking-wider text-cyan-300">Game Mode</h2>
            <div className="flex justify-center space-x-4">
                <OptionButton label="Fixed Rounds" onClick={() => setMode('fixed')} isActive={mode === 'fixed'} />
                <OptionButton label="Infinity Mode" onClick={() => setMode('infinity')} isActive={mode === 'infinity'} />
            </div>
        </div>
        
        <div className="space-y-4">
            <h2 className="text-3xl font-bangers tracking-wider text-cyan-300">Difficulty</h2>
            <div className="flex flex-wrap justify-center gap-4">
                <OptionButton label="Easy" onClick={() => setDifficulty('easy')} isActive={difficulty === 'easy'} />
                <OptionButton label="Medium" onClick={() => setDifficulty('medium')} isActive={difficulty === 'medium'} />
                <OptionButton label="Hard" onClick={() => setDifficulty('hard')} isActive={difficulty === 'hard'} />
            </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={!difficulty || !mode || !selectedMap}
        className="px-10 py-4 game-button green text-3xl tracking-widest mt-4"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;