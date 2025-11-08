
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import type { GameStatus, Difficulty, GameMode } from './types';

// Sound Assets
const soundFiles = {
    music: 'https://cdn.pixabay.com/audio/2022/08/04/audio_35255a2897.mp3',
    pop: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3',
    place: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7547146b2a.mp3',
    upgrade: 'https://cdn.pixabay.com/audio/2022/11/22/audio_75b47b9739.mp3',
    sell: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c898993693.mp3',
    leak: 'https://cdn.pixabay.com/audio/2023/08/13/audio_1cc3c3298c.mp3',
    start_wave: 'https://cdn.pixabay.com/audio/2021/10/14/audio_a725e63841.mp3',
    game_over: 'https://cdn.pixabay.com/audio/2022/03/14/audio_3d12a6288b.mp3',
    click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_51c27e323c.mp3',
    victory: 'https://cdn.pixabay.com/audio/2022/09/23/audio_03f74e3009.mp3',
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

  const handleStartGame = useCallback(async (diff: Difficulty, mode: GameMode) => {
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
      const scale = Math.min(scaleX, scaleY);
      gameWrapperRef.current.style.transform = `scale(${scale})`;
    }
  }, []);

  useEffect(() => {
    const audioContext = audioContextRef.current;

    if (gameStatus === 'playing' && audioContext) {
        updateGameScale();
        window.addEventListener('resize', updateGameScale);

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
                
                gainNode.gain.setValueAtTime(isMuted ? 0 : 0.2, audioContext.currentTime);
                source.start();
            }
        }
        return () => window.removeEventListener('resize', updateGameScale);
    } else {
        if (musicSourceRef.current) {
            musicSourceRef.current.stop();
            musicSourceRef.current.disconnect();
            musicSourceRef.current = null;
            musicGainRef.current = null;
        }
    }
  }, [gameStatus, updateGameScale, isMuted]);

  useEffect(() => {
    if (musicGainRef.current && audioContextRef.current) {
        musicGainRef.current.gain.linearRampToValueAtTime(
            isMuted ? 0 : 0.2,
            audioContextRef.current.currentTime + 0.1
        );
    }
  }, [isMuted]);

  const MuteIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-6-6m0 6l6-6" /></svg>;
  const UnmuteIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;

  return (
    <div className="bg-gray-800 text-white w-screen h-screen flex items-center justify-center font-sans overflow-hidden">
        <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-50 p-2 bg-slate-900/50 rounded-full hover:bg-slate-700/80 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
      {gameStatus === 'start_screen' && <StartScreen onStart={handleStartGame} />}
      {gameStatus === 'playing' && (
          <div ref={gameWrapperRef} style={{ width: 1200 + 320, height: 800, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}>
             <Game 
                key={`${difficulty}-${gameMode}-${Date.now()}`} 
                onGameOver={handleGameOver} 
                playSound={playSound}
                difficulty={difficulty}
                gameMode={gameMode}
              />
          </div>
      )}
      {gameStatus === 'game_over' && <GameOverScreen wave={finalWave} result={gameResult} onPlayAgain={handlePlayAgain} onMenuReturn={handleReturnToMenu} />}
    </div>
  );
};

export default App;
