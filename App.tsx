
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Game from './components/Game.tsx';
import StartScreen from './components/StartScreen.tsx';
import GameOverScreen from './components/GameOverScreen.tsx';
import type { GameStatus, Difficulty, GameMode, MapId } from './types.ts';
import { MAPS } from './constants.ts';

// Sound Assets - Replaced with a professional, high-quality sound library
const soundFiles = {
    music: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/btd-music.mp3',
    pop: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/pop-2.mp3',
    place: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/place-2.mp3',
    upgrade: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/upgrade-2.mp3',
    sell: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/sell-2.mp3',
    leak: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/leak-2.mp3',
    start_wave: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/start-wave-2.mp3',
    game_over: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/game-over-2.mp3',
    click: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/click-2.mp3',
    victory: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/victory-2.mp3',
    cash: 'https://cdn.jsdelivr.net/gh/dev-addict/sound-assets-for-btd@main/cash.mp3',
};

type SoundName = keyof typeof soundFiles;

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('start_screen');
  const [finalWave, setFinalWave] = useState(0);
  const [gameResult, setGameResult] = useState<'win' | 'loss'>('loss');
  const [isMuted, setIsMuted] = useState(false);
  const gameWrapperRef = useRef<HTMLDivElement>(null);
  
  // Game settings
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('fixed');
  const [mapId, setMapId] = useState<MapId>('green_meadow');


  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<{ [key in SoundName]?: AudioBuffer }>({});
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);

  const playSound = useCallback((name: SoundName, volume = 0.5) => {
    if (isMuted) return;

    const audioContext = audioContextRef.current;
    const buffer = audioBuffersRef.current[name];

    if (!audioContext || !buffer) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    try {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    } catch (e) {
        console.error(`Error playing sound ${name}:`, e);
    }
  }, [isMuted]);

  const preloadSounds = useCallback(async (audioContext: AudioContext) => {
    if (Object.keys(audioBuffersRef.current).length > 0) return;
    
    const loadPromises = (Object.keys(soundFiles) as SoundName[]).map(async (name) => {
        try {
            const response = await fetch(soundFiles[name]);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBuffersRef.current[name] = audioBuffer;
        } catch (e) {
            console.error(`Failed to load sound "${name}":`, e);
        }
    });
    await Promise.all(loadPromises);
  }, []);

  const handleStartGame = useCallback(async (diff: Difficulty, mode: GameMode, map: MapId) => {
    if (!audioContextRef.current) {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;
            await preloadSounds(context);
        } catch (e) {
            console.error("Could not initialize AudioContext. Sounds will be disabled.", e);
        }
    }

    if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
    }
    
    playSound('click', 0.7);
    setDifficulty(diff);
    setGameMode(mode);
    setMapId(map);
    setGameStatus('playing');
  }, [preloadSounds, playSound]);

  const handleGameOver = useCallback((wave: number, result: 'win' | 'loss') => {
    if (result === 'win') {
        playSound('victory', 0.5);
    } else {
        playSound('game_over', 0.4);
    }
    setFinalWave(wave);
    setGameResult(result);
    setGameStatus('game_over');
  }, [playSound]);
  
  const handlePlayAgain = useCallback(() => {
    playSound('click', 0.7);
    setGameStatus('start_screen');
  }, [playSound]);
  
  const handleReturnToMenu = useCallback(() => {
    playSound('click', 0.7);
    setGameStatus('start_screen');
  }, [playSound]);

  const updateGameScale = useCallback(() => {
    if (gameWrapperRef.current) {
      const gameWidth = 1200 + 320;
      const gameHeight = 800;
      const scaleX = window.innerWidth / gameWidth;
      const scaleY = window.innerHeight / gameHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      gameWrapperRef.current.style.transform = `scale(${scale})`;
    }
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing') {
      updateGameScale();
      window.addEventListener('resize', updateGameScale);
      return () => window.removeEventListener('resize', updateGameScale);
    }
  }, [gameStatus, updateGameScale]);

  useEffect(() => {
    const audioContext = audioContextRef.current;

    if (gameStatus === 'playing' && audioContext) {
        if (!musicSourceRef.current) {
            const musicBuffer = audioBuffersRef.current.music;
            if (musicBuffer) {
                const source = audioContext.createBufferSource();
                source.buffer = musicBuffer;
                source.loop = true;

                const gainNode = audioContext.createGain();
                musicGainRef.current = gainNode;
                
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                musicSourceRef.current = source;
                
                gainNode.gain.setValueAtTime(isMuted ? 0 : 0.3, audioContext.currentTime);
                source.start();
            }
        }
    } else {
        if (musicSourceRef.current) {
            musicSourceRef.current.stop();
            musicSourceRef.current.disconnect();
            musicSourceRef.current = null;
            musicGainRef.current = null;
        }
    }
  }, [gameStatus, isMuted]);

  useEffect(() => {
    if (musicGainRef.current && audioContextRef.current) {
        musicGainRef.current.gain.linearRampToValueAtTime(
            isMuted ? 0 : 0.3,
            audioContextRef.current.currentTime + 0.1
        );
    }
  }, [isMuted]);

  const MuteIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-6-6m0 6l6-6" /></svg>;
  const UnmuteIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;

  const renderContent = () => {
      if (gameStatus === 'playing') {
          return (
              <div 
                ref={gameWrapperRef} 
                style={{ 
                    width: 1200 + 320, 
                    height: 800,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-out'
                }}
              >
                 <Game 
                    key={`${difficulty}-${gameMode}-${mapId}-${Date.now()}`} 
                    onGameOver={handleGameOver} 
                    playSound={playSound}
                    difficulty={difficulty}
                    gameMode={gameMode}
                    mapId={mapId}
                  />
              </div>
          );
      }

      return (
          <div className="w-full h-full menu-background flex items-center justify-center">
              {[...Array(6)].map((_, i) => <div key={i} className="balloon-bg"></div>)}
              <div className="z-10">
                {gameStatus === 'start_screen' && <StartScreen onStart={handleStartGame} />}
                {gameStatus === 'game_over' && <GameOverScreen wave={finalWave} result={gameResult} onPlayAgain={handlePlayAgain} onMenuReturn={handleReturnToMenu} />}
              </div>
          </div>
      );
  }

  return (
    <div className="w-full h-full font-sans overflow-hidden relative flex items-center justify-center">
        <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-50 p-2 bg-slate-900/50 rounded-full hover:bg-slate-700/80 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
        {renderContent()}
    </div>
  );
};

export default App;