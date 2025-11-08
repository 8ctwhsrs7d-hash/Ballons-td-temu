
import React, { useState } from 'react';
import type { Difficulty, GameMode } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, mode: GameMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [mode, setMode] = useState<GameMode | null>(null);

  const handleStart = () => {
    if (difficulty && mode) {
      onStart(difficulty, mode);
    }
  };
  
  const OptionButton: React.FC<{
      label: string;
      onClick: () => void;
      isActive: boolean;
      color: string;
    }> = ({ label, onClick, isActive, color }) => {
      const baseClasses = 'px-6 py-2 rounded-lg font-bold text-lg transition-all duration-200 border-2';
      const activeClasses = `bg-${color}-600 border-${color}-500 shadow-lg scale-105`;
      const inactiveClasses = 'bg-slate-700 border-slate-600 hover:bg-slate-600';
      return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
      )
  };

  return (
    <div className="text-center bg-gray-900/80 backdrop-blur-sm p-12 rounded-lg shadow-2xl border-2 border-slate-700 flex flex-col items-center space-y-8">
      <div>
        <h1 className="text-6xl font-bold mb-2 text-yellow-400 font-bangers tracking-wider">Balloon TD Arena</h1>
        <p className="text-lg text-slate-300 max-w-lg mx-auto">Place heroes, pop balloons, and survive the waves.</p>
      </div>

      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bangers tracking-wider text-cyan-300">Game Mode</h2>
        <div className="flex justify-center space-x-4">
            <OptionButton label="Fixed Rounds" onClick={() => setMode('fixed')} isActive={mode === 'fixed'} color="blue" />
            <OptionButton label="Infinity Mode" onClick={() => setMode('infinity')} isActive={mode === 'infinity'} color="purple" />
        </div>
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bangers tracking-wider text-cyan-300">Difficulty</h2>
        <div className="flex justify-center space-x-4">
            <OptionButton label="Easy" onClick={() => setDifficulty('easy')} isActive={difficulty === 'easy'} color="green" />
            <OptionButton label="Medium" onClick={() => setDifficulty('medium')} isActive={difficulty === 'medium'} color="yellow" />
            <OptionButton label="Hard" onClick={() => setDifficulty('hard')} isActive={difficulty === 'hard'} color="red" />
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={!difficulty || !mode}
        className="px-10 py-4 bg-green-600 text-white font-bold text-2xl rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed font-bangers tracking-widest"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
