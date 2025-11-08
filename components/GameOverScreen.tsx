
import React from 'react';

interface GameOverScreenProps {
  wave: number;
  result: 'win' | 'loss';
  onPlayAgain: () => void;
  onMenuReturn: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ wave, result, onPlayAgain, onMenuReturn }) => {
  const isWin = result === 'win';

  return (
    <div className="text-center bg-gray-900/80 backdrop-blur-sm p-12 rounded-lg shadow-2xl border-2 border-slate-700 flex flex-col items-center space-y-6">
      <h1 className={`text-6xl font-bold font-bangers tracking-wider ${isWin ? 'text-yellow-400' : 'text-red-500'}`}>
        {isWin ? 'Victory!' : 'Game Over'}
      </h1>
      <p className="text-2xl">
        {isWin ? 'You successfully defended against all waves!' : (
            <>You made it to wave <span className="font-bold text-yellow-400">{wave}</span>!</>
        )}
      </p>
      <div className="flex space-x-4 pt-4">
        <button
            onClick={onMenuReturn}
            className="px-8 py-3 bg-gray-600 text-white font-bold text-xl rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all font-bangers tracking-wider"
        >
            Main Menu
        </button>
        <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all font-bangers tracking-wider"
        >
            Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;