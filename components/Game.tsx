
import React, { useState, useEffect, useReducer, useRef, useCallback, useMemo } from 'react';
import { TOWER_TYPES, BALLOON_TYPES, WAVES, PROJECTILE_TYPES, WAVE_COOLDOWN_MS, DIFFICULTY_SETTINGS, MAPS } from '../constants';
import type { BalloonType, TowerType, TowerInstance, BalloonInstance, ProjectileInstance, Vector2D, PopAnimationInstance, ExplosionInstance, Difficulty, GameMode, Wave, MuzzleFlashInstance, CashPopInstance, MapId, MapData } from '../types';
import { produce } from 'immer';

// UTILITY FUNCTIONS
const getDistance = (p1: Vector2D, p2: Vector2D) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
const getAngle = (p1: Vector2D, p2: Vector2D) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const getTowerStats = (tower: TowerInstance, costMultiplier: number): TowerType & { totalSpent: number } => {
    const baseTower = TOWER_TYPES[tower.typeId];
    if (!baseTower) throw new Error(`Unknown tower type: ${tower.typeId}`);

    let totalSpent = Math.floor(baseTower.cost * costMultiplier);

    const stats = produce(baseTower, draft => {
        const path1Upgrades = baseTower.upgrades[0].slice(0, tower.upgrades.path1);
        const path2Upgrades = baseTower.upgrades[1].slice(0, tower.upgrades.path2);

        [...path1Upgrades, ...path2Upgrades].forEach(upgrade => {
            totalSpent += Math.floor(upgrade.cost * costMultiplier);
            const { projectile, ...otherEffects } = upgrade.effects;
            Object.assign(draft, otherEffects);
            if (projectile) {
                Object.assign(draft.projectile, projectile);
            }
        });
    });
    
    return { ...stats, totalSpent };
}

const generateInfinityWave = (waveNumber: number): Wave => {
    const wave: Wave = [];
    const healthMultiplier = 1 + (waveNumber - 40) * 0.1;
    const countMultiplier = 1 + (waveNumber - 40) * 0.05;

    if (waveNumber % 10 === 0) {
        wave.push({ balloonTypeId: 'moab', count: Math.floor(1 + (waveNumber - 40) / 10), spawnDelay: 2000 });
        const moabType = { ...BALLOON_TYPES.moab };
        moabType.health = Math.floor(moabType.health * healthMultiplier);
        BALLOON_TYPES[`moab_w${waveNumber}`] = moabType;
    }
    
    const ceramicCount = Math.floor(10 * countMultiplier);
    wave.push({ balloonTypeId: 'ceramic', count: ceramicCount, spawnDelay: 150 });
    
    const leadZebraCount = Math.floor(15 * countMultiplier);
    wave.push({ balloonTypeId: 'lead', count: leadZebraCount, spawnDelay: 250 });
    wave.push({ balloonTypeId: 'zebra', count: leadZebraCount, spawnDelay: 250 });
    
    return wave;
};


// GAME STATE & REDUCER
interface GameState {
    towers: TowerInstance[];
    balloons: BalloonInstance[];
    projectiles: ProjectileInstance[];
    popAnimations: PopAnimationInstance[];
    explosions: ExplosionInstance[];
    muzzleFlashes: MuzzleFlashInstance[];
    cashPops: CashPopInstance[];
    money: number;
    health: number;
    waveNumber: number;
    waveSpawning: boolean;
    balloonsToSpawn: { typeId: string; spawnTime: number }[];
    gameTime: number;
    selectedTowerId: string | null;
    timeToNextWave: number;
}

type GameAction =
    | { type: 'TICK'; payload: { deltaTime: number, gameMode: GameMode, costMultiplier: number } }
    | { type: 'PLACE_TOWER'; payload: { tower: TowerInstance, cost: number } }
    | { type: 'START_WAVE'; payload: { gameMode: GameMode } }
    | { type: 'SELECT_TOWER'; payload: { towerId: string | null } }
    | { type: 'UPGRADE_TOWER'; payload: { pathIndex: 0 | 1, cost: number } }
    | { type: 'SELL_TOWER'; payload: { sellValue: number } };

const createInitialState = (difficulty: Difficulty): GameState => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    return {
        towers: [],
        balloons: [],
        projectiles: [],
        popAnimations: [],
        explosions: [],
        muzzleFlashes: [],
        cashPops: [],
        money: settings.initialMoney,
        health: settings.initialHealth,
        waveNumber: 0,
        waveSpawning: false,
        balloonsToSpawn: [],
        gameTime: 0,
        selectedTowerId: null,
        timeToNextWave: 0,
    };
}

const createGameReducer = (map: MapData) => {
    const path = map.path;
    const pathTotalLength = path.slice(1).reduce((acc, p, i) => acc + getDistance(path[i], p), 0);
    
    const getPositionOnPath = (progress: number): Vector2D => {
        const distanceToTravel = progress * pathTotalLength;
        let distanceTraveled = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const start = path[i];
            const end = path[i + 1];
            const segmentLength = getDistance(start, end);

            if (distanceTraveled + segmentLength >= distanceToTravel) {
                const segmentProgress = (distanceToTravel - distanceTraveled) / segmentLength;
                return {
                    x: start.x + (end.x - start.x) * segmentProgress,
                    y: start.y + (end.y - start.y) * segmentProgress,
                };
            }
            distanceTraveled += segmentLength;
        }
        return { ...path[path.length - 1] };
    };

    return produce((draft: GameState, action: GameAction) => {
        switch (action.type) {
            case 'PLACE_TOWER': {
                if (draft.money >= action.payload.cost) {
                    draft.towers.push(action.payload.tower);
                    draft.money -= action.payload.cost;
                }
                break;
            }
            case 'START_WAVE': {
                if (draft.waveSpawning || draft.balloons.length > 0) return;
                const { gameMode } = action.payload;
                const nextWaveNumber = draft.waveNumber + 1;
                
                let wave;
                if (nextWaveNumber <= WAVES.length) {
                    wave = WAVES[draft.waveNumber];
                } else if (gameMode === 'infinity') {
                    wave = generateInfinityWave(nextWaveNumber);
                } else {
                    return; // No more waves
                }
                
                let cumulativeDelay = draft.gameTime + 500;
                wave.forEach(group => {
                    let groupStartTime = cumulativeDelay;
                    for (let i = 0; i < group.count; i++) {
                        draft.balloonsToSpawn.push({ typeId: group.balloonTypeId, spawnTime: groupStartTime });
                        groupStartTime += group.spawnDelay;
                    }
                    cumulativeDelay = groupStartTime;
                });

                draft.waveSpawning = true;
                draft.balloonsToSpawn.sort((a,b) => a.spawnTime - b.spawnTime);
                draft.waveNumber = nextWaveNumber;
                draft.timeToNextWave = 0;
                break;
            }
            case 'SELECT_TOWER': {
                draft.selectedTowerId = action.payload.towerId;
                break;
            }
            case 'SELL_TOWER': {
                if (!draft.selectedTowerId) break;
                const towerIndex = draft.towers.findIndex(t => t.id === draft.selectedTowerId);
                if (towerIndex === -1) break;

                draft.money += action.payload.sellValue;
                draft.towers.splice(towerIndex, 1);
                draft.selectedTowerId = null;
                break;
            }
            case 'UPGRADE_TOWER': {
                if (!draft.selectedTowerId) break;
                
                const towerIndex = draft.towers.findIndex(t => t.id === draft.selectedTowerId);
                if (towerIndex === -1) break;

                if (draft.money < action.payload.cost) break;

                draft.money -= action.payload.cost;
                if (action.payload.pathIndex === 0) {
                    draft.towers[towerIndex].upgrades.path1++;
                } else {
                    draft.towers[towerIndex].upgrades.path2++;
                }
                break;
            }
            case 'TICK': {
                const { deltaTime, gameMode, costMultiplier } = action.payload;
                draft.gameTime += deltaTime * 1000;
                
                // 1. Spawn balloons
                const newBalloons: BalloonInstance[] = [];
                draft.balloonsToSpawn = draft.balloonsToSpawn.filter(b => {
                    if (draft.gameTime >= b.spawnTime) {
                        const typeId = b.typeId.startsWith('moab_w') ? 'moab' : b.typeId;
                        const type = BALLOON_TYPES[typeId];
                        newBalloons.push({ id: `b_${draft.gameTime}_${Math.random()}`, typeId: b.typeId, health: type.health, pathProgress: 0, position: getPositionOnPath(0), effects: {} });
                        return false;
                    }
                    return true;
                });
                if (draft.balloonsToSpawn.length === 0 && draft.waveSpawning) {
                    draft.waveSpawning = false;
                }
                draft.balloons.push(...newBalloons);

                // 2. Move balloons
                let healthLost = 0;
                draft.balloons = draft.balloons.filter(b => {
                    const balloonType = BALLOON_TYPES[b.typeId.startsWith('moab_w') ? 'moab' : b.typeId];
                    let speed = balloonType.speed;
                    if(b.effects.slow && b.effects.slow.until > draft.gameTime) {
                        speed *= b.effects.slow.factor;
                    }
                    b.pathProgress += (speed / pathTotalLength) * deltaTime;
                    if (b.pathProgress >= 1) {
                        healthLost += balloonType.isBlimp ? balloonType.health : balloonType.children ? balloonType.children.length + 1 : 1;
                        return false;
                    }
                    b.position = getPositionOnPath(b.pathProgress);
                    return true;
                });
                draft.health -= healthLost;

                // 3. Move projectiles
                draft.projectiles = draft.projectiles.filter(p => {
                    const type = PROJECTILE_TYPES[p.typeId];
                    const distance = type.speed * deltaTime;
                    p.position.x += Math.cos(p.angle) * distance;
                    p.position.y += Math.sin(p.angle) * distance;
                    p.distanceTraveled += distance;
                    return p.position.x > -100 && p.position.x < 1300 && p.position.y > -100 && p.position.y < 900;
                });

                // 4. Tower targeting and shooting
                draft.towers.forEach(t => {
                    const stats = getTowerStats(t, costMultiplier);
                    const fireInterval = 1000 / stats.fireRate;

                    if (draft.gameTime - t.lastShotTime >= fireInterval) {
                        let target: BalloonInstance | null = null;
                        let minPathProgress = -1;

                        draft.balloons.forEach(b => {
                            if (getDistance(t.position, b.position) <= stats.range) {
                                if (b.pathProgress > minPathProgress) {
                                    minPathProgress = b.pathProgress;
                                    target = b;
                                }
                            }
                        });

                        if (target) {
                            t.targetId = target.id;
                            const angle = getAngle(t.position, target.position);
                            t.angle = angle;
                            t.lastShotTime = draft.gameTime;

                            draft.muzzleFlashes.push({ id: `mf_${t.id}_${draft.gameTime}`, position: { ...t.position }, createdAt: draft.gameTime, angle: angle });

                            if (stats.id === 'tack_shooter') {
                                const tackCount = t.upgrades.path2 >= 1 ? (t.upgrades.path2 >= 2 ? 12 : 10) : 8;
                                for (let i = 0; i < tackCount; i++) {
                                    draft.projectiles.push({
                                        id: `p_${t.id}_${draft.gameTime}_${i}`, typeId: stats.projectile.id,
                                        position: { ...t.position }, angle: (i / tackCount) * 2 * Math.PI,
                                        distanceTraveled: 0, pierceLeft: stats.projectile.pierce ?? 1, hitBalloonIds: []
                                    });
                                }
                            } else if (stats.id === 'ninja_monkey' && t.upgrades.path1 >= 2) {
                                for (let i = 0; i < 2; i++) {
                                    draft.projectiles.push({
                                        id: `p_${t.id}_${draft.gameTime}_${i}`, typeId: stats.projectile.id,
                                        position: { ...t.position }, angle: angle + (i * 0.1 - 0.05),
                                        distanceTraveled: 0, pierceLeft: stats.projectile.pierce ?? 1, hitBalloonIds: []
                                    });
                                }
                            } else {
                                draft.projectiles.push({
                                    id: `p_${t.id}_${draft.gameTime}`, typeId: stats.projectile.id,
                                    position: { ...t.position }, angle: angle,
                                    distanceTraveled: 0, pierceLeft: stats.projectile.pierce ?? 1, hitBalloonIds: []
                                });
                            }
                        }
                    }
                });


                // 5. Collision detection
                let moneyGained = 0;
                const childBalloonsToSpawn: BalloonInstance[] = [];
                const newPopAnimations: PopAnimationInstance[] = [];
                const newExplosions: ExplosionInstance[] = [];
                const poppedBalloonIds = new Set<string>();

                draft.projectiles.forEach(p => {
                    if (p.pierceLeft <= 0) return;
                    for (const b of draft.balloons) {
                        if (poppedBalloonIds.has(b.id) || p.hitBalloonIds.includes(b.id)) continue;
                        const balloonType = BALLOON_TYPES[b.typeId.startsWith('moab_w') ? 'moab' : b.typeId];
                        if (getDistance(p.position, b.position) < balloonType.size) {
                            const projectileType = PROJECTILE_TYPES[p.typeId];
                            
                            // Check immunities
                            if (balloonType.isLead && !projectileType.canPopLead) continue;
                            if (balloonType.immuneToFreeze && projectileType.slow) continue;

                            b.health -= projectileType.damage;
                            p.hitBalloonIds.push(b.id);
                            p.pierceLeft--;
                            if(projectileType.slow && !balloonType.immuneToFreeze) b.effects.slow = { factor: projectileType.slow.factor, until: draft.gameTime + projectileType.slow.duration };
                            
                            if (b.health <= 0) {
                                poppedBalloonIds.add(b.id);
                                moneyGained += balloonType.money;
                                if(balloonType.money > 0) draft.cashPops.push({ id: `cash_${b.id}`, amount: balloonType.money, position: b.position, createdAt: draft.gameTime });
                                newPopAnimations.push({id: `pop_${b.id}`, position: b.position, createdAt: draft.gameTime});
                                if (balloonType.children) {
                                    balloonType.children.forEach(childTypeId => {
                                        childBalloonsToSpawn.push({
                                            id: `b_${childTypeId}_${draft.gameTime}_${Math.random()}`,
                                            typeId: childTypeId,
                                            health: BALLOON_TYPES[childTypeId].health,
                                            pathProgress: b.pathProgress,
                                            position: b.position,
                                            effects: {}
                                        });
                                    });
                                }
                            }
                            if (projectileType.aoeRange) {
                                newExplosions.push({id: `exp_${p.id}`, position: b.position, radius: projectileType.aoeRange, createdAt: draft.gameTime});
                                draft.balloons.forEach(aoeTarget => {
                                    if(aoeTarget.id !== b.id && !poppedBalloonIds.has(aoeTarget.id) && getDistance(b.position, aoeTarget.position) <= projectileType.aoeRange) {
                                        const aoeBalloonType = BALLOON_TYPES[aoeTarget.typeId.startsWith('moab_w') ? 'moab' : aoeTarget.typeId];
                                        if(aoeBalloonType.immuneToExplosions) return;
                                        aoeTarget.health -= projectileType.damage;
                                        if(aoeTarget.health <= 0 && !poppedBalloonIds.has(aoeTarget.id)) {
                                            poppedBalloonIds.add(aoeTarget.id);
                                            moneyGained += aoeBalloonType.money;
                                            if(aoeBalloonType.money > 0) draft.cashPops.push({ id: `cash_${aoeTarget.id}`, amount: aoeBalloonType.money, position: aoeTarget.position, createdAt: draft.gameTime });
                                            newPopAnimations.push({id: `pop_${aoeTarget.id}`, position: aoeTarget.position, createdAt: draft.gameTime});
                                        }
                                    }
                                });
                            }
                            if(p.pierceLeft <= 0) break;
                        }
                    }
                });

                draft.money += moneyGained;
                const remainingBalloons = draft.balloons.filter(b => !poppedBalloonIds.has(b.id));
                draft.balloons = [...remainingBalloons, ...childBalloonsToSpawn];
                draft.projectiles = draft.projectiles.filter(p => p.pierceLeft > 0);
                draft.popAnimations.push(...newPopAnimations);
                draft.explosions.push(...newExplosions);

                // 6. Handle animations
                draft.popAnimations = draft.popAnimations.filter(p => draft.gameTime - p.createdAt < 400);
                draft.cashPops = draft.cashPops.filter(p => draft.gameTime - p.createdAt < 700);
                draft.explosions = draft.explosions.filter(e => draft.gameTime - e.createdAt < 300);
                draft.muzzleFlashes = draft.muzzleFlashes.filter(mf => draft.gameTime - mf.createdAt < 100);

                // 7. Auto-start next wave & give wave bonus
                const isWaveOver = !draft.waveSpawning && draft.balloons.length === 0;
                const hasMoreWaves = gameMode === 'infinity' || draft.waveNumber < WAVES.length;
                if (isWaveOver && draft.waveNumber > 0 && hasMoreWaves && draft.timeToNextWave <= 0) {
                    draft.timeToNextWave = WAVE_COOLDOWN_MS;
                    const waveBonus = 50 + draft.waveNumber * 5;
                    draft.money += waveBonus;
                }

                if(draft.timeToNextWave > 0) {
                    draft.timeToNextWave -= deltaTime * 1000;
                    if(draft.timeToNextWave <= 0) {
                        let wave;
                        const nextWaveNumber = draft.waveNumber + 1;
                        if (nextWaveNumber <= WAVES.length) {
                            wave = WAVES[draft.waveNumber];
                        } else if (gameMode === 'infinity') {
                            wave = generateInfinityWave(nextWaveNumber);
                        }
                        
                        if(wave) {
                        let cumulativeDelay = draft.gameTime + 500;
                        wave.forEach(group => {
                            let groupStartTime = cumulativeDelay;
                            for (let i = 0; i < group.count; i++) {
                                draft.balloonsToSpawn.push({ typeId: group.balloonTypeId, spawnTime: groupStartTime });
                                groupStartTime += group.spawnDelay;
                            }
                            cumulativeDelay = groupStartTime;
                        });
                        draft.waveSpawning = true;
                        draft.balloonsToSpawn.sort((a,b) => a.spawnTime - b.spawnTime);
                        draft.waveNumber = nextWaveNumber;
                        draft.timeToNextWave = 0;
                        }
                    }
                }
                break;
            }
        }
    });
}

// CHILD RENDER COMPONENTS
const TowerComponent = React.memo(({ tower, isSelected, onSelect, costMultiplier }: { tower: TowerInstance, isSelected: boolean, onSelect: (id: string) => void, costMultiplier: number }) => {
    const type = TOWER_TYPES[tower.typeId];
    const stats = getTowerStats(tower, costMultiplier);
    return (
        <div 
            className="absolute cursor-pointer group" 
            style={{ left: tower.position.x, top: tower.position.y, transform: `translate(-50%, -50%)`}}
            onClick={(e) => { e.stopPropagation(); onSelect(tower.id); }}
        >
            {isSelected && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-cyan-300 bg-cyan-300 bg-opacity-20 animate-pulse" style={{ width: stats.range * 2, height: stats.range * 2 }} />
            )}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/50 bg-white bg-opacity-10 hidden group-hover:block" style={{ width: stats.range * 2, height: stats.range * 2 }} />
            <div className="w-full h-full flex items-center justify-center transition-transform duration-100" style={{ transform: `rotate(${tower.angle + Math.PI / 2}rad)` }}>
                {type.visual}
            </div>
        </div>
    );
});

const BalloonComponent = React.memo(({ balloon, gameTime }: { balloon: BalloonInstance; gameTime: number; }) => {
    const typeId = balloon.typeId.startsWith('moab_w') ? 'moab' : balloon.typeId;
    const type = BALLOON_TYPES[typeId] || BALLOON_TYPES.red; // Fallback to red
    const isSlowed = balloon.effects.slow && balloon.effects.slow.until > gameTime;

    let visual = type.visual;
    if (!visual) {
        if(type.id === 'ceramic') visual = <div className="w-full h-full rounded-full bg-orange-800 border-4 border-orange-900" />;
        else if(type.isLead) visual = <div className="w-full h-full rounded-full bg-gray-600" />;
        else visual = <div className="w-full h-full rounded-full" style={{backgroundColor: type.color}} />;
    }

    return (
        <div
            className={`absolute transition-all duration-100 ease-linear animate-balloon-bob`}
            style={{ 
                left: balloon.position.x, 
                top: balloon.position.y, 
                width: type.size * 2, 
                height: type.isBlimp ? type.size * 1.2 : type.size * 2.2,
                transform: 'translate(-50%, -50%)',
                zIndex: type.isBlimp ? 10 : Math.floor(balloon.pathProgress * 100),
            }}
        >
           {visual}
           {isSlowed && <div className="absolute top-0 left-0 w-full h-full rounded-full bg-cyan-300 opacity-40 animate-pulse"></div>}
        </div>
    );
});

const ProjectileComponent = React.memo(({ projectile }: { projectile: ProjectileInstance }) => {
    const type = PROJECTILE_TYPES[projectile.typeId];
    if (!type) return null;
    return (
        <div
            className="absolute flex items-center justify-center"
            style={{
                left: projectile.position.x,
                top: projectile.position.y,
                transform: `translate(-50%, -50%) rotate(${projectile.angle + Math.PI / 2}rad)`,
            }}
        >
            {type.visual}
        </div>
    );
});

const PopAnimation = React.memo(({ position }: { position: Vector2D }) => (
    <div className="absolute pointer-events-none" style={{ left: position.x, top: position.y }}>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="pop-particle" style={{ '--i': i } as React.CSSProperties} />
        ))}
    </div>
));
const ExplosionAnimation = React.memo(({ position, radius }: { position: Vector2D; radius: number }) => (
    <div
        className="absolute pointer-events-none"
        style={{
            left: position.x,
            top: position.y,
        }}
    >
        <div className="explosion-core" style={{ width: radius, height: radius }} />
        <div className="explosion-shockwave" style={{ width: radius * 2, height: radius * 2 }} />
    </div>
));
const MuzzleFlash = React.memo(({ position, angle }: { position: Vector2D, angle: number }) => (
    <div 
        className="absolute"
        style={{
            left: position.x,
            top: position.y,
            transform: `rotate(${angle}rad) translateX(20px)`,
            zIndex: 100,
        }}
    >
        <div className="muzzle-flash" />
    </div>
));
const CashPop = React.memo(({ position, amount }: { position: Vector2D; amount: number }) => (
    <div className="cash-pop absolute text-yellow-300 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 500 }}>
        +${amount}
    </div>
));

// MAIN GAME COMPONENT
const Game: React.FC<{ onGameOver: (wave: number, result: 'win' | 'loss') => void, playSound: (name: string, volume?: number) => void, difficulty: Difficulty, gameMode: GameMode, mapId: MapId }> = ({ onGameOver, playSound, difficulty, gameMode, mapId }) => {
    const currentMap = MAPS[mapId];
    const gameReducer = useMemo(() => createGameReducer(currentMap), [currentMap]);
    const [state, dispatch] = useReducer(gameReducer, difficulty, createInitialState);
    
    const [placingTower, setPlacingTower] = useState<TowerType | null>(null);
    const [mousePos, setMousePos] = useState<Vector2D>({ x: 0, y: 0 });
    const gameBoardRef = useRef<HTMLDivElement>(null);
    const lastTimeRef = useRef<number>(performance.now());
    const prevState = usePrevious(state);
    
    // UI state for animations
    const [healthPop, setHealthPop] = useState(false);
    const [moneyPop, setMoneyPop] = useState(false);
    
    const costMultiplier = DIFFICULTY_SETTINGS[difficulty].towerCostMultiplier;

    useEffect(() => {
        let animationFrameId: number;
        const gameLoop = (timestamp: number) => {
            const deltaTime = Math.min(0.05, (timestamp - lastTimeRef.current) / 1000);
            lastTimeRef.current = timestamp;
            dispatch({ type: 'TICK', payload: { deltaTime, gameMode, costMultiplier } });
            animationFrameId = requestAnimationFrame(gameLoop);
        };
        animationFrameId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameMode, costMultiplier, gameReducer]);
    
     useEffect(() => {
        if (!prevState) return;

        if (state.popAnimations.length > prevState.popAnimations.length) playSound('pop', 0.2);
        if (state.towers.length > prevState.towers.length) playSound('place', 0.6);
        if (prevState.selectedTowerId && !state.selectedTowerId && state.towers.length < prevState.towers.length) playSound('sell', 0.6);
        if(state.money > prevState.money && state.cashPops.length > prevState.cashPops.length) playSound('cash', 0.3);

        if (state.health < prevState.health) {
            playSound('leak', 0.6);
            setHealthPop(true);
            setTimeout(() => setHealthPop(false), 150);
        }
        
        if (state.money !== prevState.money) {
            setMoneyPop(true);
            setTimeout(() => setMoneyPop(false), 150);
        }
        
        const prevSelected = prevState.towers.find(t => t.id === prevState.selectedTowerId);
        const currentSelected = state.towers.find(t => t.id === state.selectedTowerId);
        if (currentSelected && prevSelected) {
            if (currentSelected.upgrades.path1 > prevSelected.upgrades.path1 || currentSelected.upgrades.path2 > prevSelected.upgrades.path2) {
                playSound('upgrade', 0.7);
            }
        }
    }, [state, prevState, playSound]);
    
    useEffect(() => {
        if (state.health <= 0) {
            onGameOver(state.waveNumber, 'loss');
        } else if (gameMode === 'fixed' && state.waveNumber > WAVES.length && state.balloons.length === 0) {
            onGameOver(state.waveNumber - 1, 'win');
        }
    }, [state.health, state.waveNumber, state.balloons.length, onGameOver, gameMode]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (gameBoardRef.current) {
            const rect = gameBoardRef.current.getBoundingClientRect();
            const scale = rect.width / 1200;
            const mouseX = (e.clientX - rect.left) / scale;
            const mouseY = (e.clientY - rect.top) / scale;
            setMousePos({ x: mouseX, y: mouseY });
        }
    }, []);
    
    const isPlacementValid = useCallback((position: Vector2D, size: number) => {
        const pathMargin = 20 + size;
        for (let i = 0; i < currentMap.path.length - 1; i++) {
            const start = currentMap.path[i];
            const end = currentMap.path[i+1];
            const distSq = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
            if (distSq === 0) {
                if (getDistance(position, start) < pathMargin) return false;
                continue;
            }
            let t = ((position.x - start.x) * (end.x - start.x) + (position.y - start.y) * (end.y - start.y)) / distSq;
            t = Math.max(0, Math.min(1, t));
            const closestPoint = { x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) };
            if (getDistance(position, closestPoint) < pathMargin) return false;
        }
        for (const tower of state.towers) {
            if (getDistance(position, tower.position) < (TOWER_TYPES[tower.typeId].size + size)) return false;
        }
        if (currentMap.unplaceableAreas) {
            for (const area of currentMap.unplaceableAreas) {
                if (position.x > area.x && position.x < area.x + area.width && position.y > area.y && position.y < area.y + area.height) {
                    return false;
                }
            }
        }
        return true;
    }, [state.towers, currentMap]);

    const handleBoardClick = useCallback(() => {
        if (placingTower) {
            const cost = Math.floor(placingTower.cost * costMultiplier);
            if (isPlacementValid(mousePos, placingTower.size) && state.money >= cost) {
                dispatch({
                    type: 'PLACE_TOWER',
                    payload: { 
                        tower: { id: `t_${placingTower.id}_${Date.now()}`, typeId: placingTower.id, position: mousePos, lastShotTime: 0, angle: 0, upgrades: { path1: 0, path2: 0 } },
                        cost
                    },
                });
            }
        } else {
            dispatch({ type: 'SELECT_TOWER', payload: { towerId: null }});
        }
    }, [placingTower, mousePos, state.money, isPlacementValid, costMultiplier, dispatch]);
    
    const handleSelectTowerToPlace = (tower: TowerType) => {
        playSound('click', 0.6);
        const cost = Math.floor(tower.cost * costMultiplier);
        if (state.money >= cost) {
            setPlacingTower(tower);
            dispatch({ type: 'SELECT_TOWER', payload: { towerId: null } });
        }
    };
    
    const handleSelectTowerOnMap = useCallback((id: string) => {
        setPlacingTower(null);
        dispatch({ type: 'SELECT_TOWER', payload: { towerId: id } });
        playSound('click', 0.6);
    }, [playSound, dispatch]);

    const handleStartWave = useCallback(() => {
        playSound('start_wave', 0.4);
        dispatch({ type: 'START_WAVE', payload: { gameMode } });
    }, [playSound, gameMode, dispatch]);

    const selectedTowerInstance = state.towers.find(t => t.id === state.selectedTowerId);
    const selectedTowerStats = selectedTowerInstance ? getTowerStats(selectedTowerInstance, costMultiplier) : null;
    
    return (
        <div className="flex w-full h-full bg-black shadow-2xl">
            <div ref={gameBoardRef} className="relative w-[1200px] h-[800px] bg-black overflow-hidden cursor-crosshair" onMouseMove={handleMouseMove} onClick={handleBoardClick}>
                {currentMap.visual}

                {state.towers.map(tower => <TowerComponent key={tower.id} tower={tower} isSelected={state.selectedTowerId === tower.id} onSelect={handleSelectTowerOnMap} costMultiplier={costMultiplier} />)}
                {state.balloons.map(balloon => <BalloonComponent key={balloon.id} balloon={balloon} gameTime={state.gameTime} />)}
                {state.projectiles.map(projectile => <ProjectileComponent key={projectile.id} projectile={projectile} />)}
                {state.popAnimations.map(pop => <PopAnimation key={pop.id} position={pop.position} />)}
                {state.explosions.map(exp => <ExplosionAnimation key={exp.id} position={exp.position} radius={exp.radius} />)}
                {state.muzzleFlashes.map(mf => <MuzzleFlash key={mf.id} position={mf.position} angle={mf.angle} />)}
                {state.cashPops.map(cp => <CashPop key={cp.id} position={cp.position} amount={cp.amount} />)}

                {placingTower && (
                    <div className="absolute pointer-events-none" style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)', zIndex: 200 }}>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed ${isPlacementValid(mousePos, placingTower.size) ? 'border-white' : 'border-red-500'} bg-white/20`} style={{ width: TOWER_TYPES[placingTower.id].range * 2, height: TOWER_TYPES[placingTower.id].range * 2 }} />
                        <div className="opacity-70">{placingTower.visual}</div>
                    </div>
                )}
            </div>
            {/* UI Panel */}
            <div className="w-[320px] h-full ui-panel p-2 flex flex-col text-white">
                {/* HUD */}
                 <div className="grid grid-cols-3 gap-2 p-2 bg-black/30 rounded-lg mb-2">
                    <div className="flex items-center justify-center space-x-2 bg-black/30 p-1 rounded">
                        <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z"></path></svg>
                        <span className={`font-bold text-xl text-yellow-300 stat-counter ${moneyPop ? 'stat-counter-pop' : ''}`}>{state.money}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-black/30 p-1 rounded">
                        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                        <span className={`font-bold text-xl text-red-400 stat-counter ${healthPop ? 'stat-counter-pop' : ''}`}>{state.health}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-black/30 p-1 rounded">
                       <svg className="w-6 h-6 text-cyan-300" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 7h10v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"></path></svg>
                        <span className="font-bold text-xl text-cyan-300">{state.waveNumber}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-1 bg-black/30 rounded-lg custom-scrollbar">
                 {selectedTowerInstance && selectedTowerStats ? (
                        <div className="text-center space-y-2">
                           <h2 className="text-3xl font-bangers tracking-wider ui-panel-header py-1 text-yellow-300">{selectedTowerStats.name}</h2>
                           <div className="flex space-x-2 p-1">
                                {[0, 1].map(pathIndex => (
                                    <div key={pathIndex} className="flex-1 space-y-1.5">
                                        {TOWER_TYPES[selectedTowerInstance.typeId].upgrades[pathIndex].map((upgrade, index) => {
                                            const currentLevel = selectedTowerInstance.upgrades[pathIndex === 0 ? 'path1' : 'path2'];
                                            const isPurchased = index < currentLevel;
                                            const isNext = index === currentLevel;
                                            const cost = Math.floor(upgrade.cost * costMultiplier);
                                            const canAfford = state.money >= cost;
                                            
                                            return (
                                                <button
                                                    key={upgrade.name}
                                                    onClick={() => dispatch({ type: 'UPGRADE_TOWER', payload: { pathIndex: pathIndex as 0 | 1, cost } })}
                                                    disabled={!isNext || !canAfford}
                                                    className={`w-full p-2 rounded-lg text-left upgrade-button ${isPurchased ? 'upgrade-button-purchased' : ''} ${!isNext ? 'upgrade-button-unavailable' : ''}`}
                                                >
                                                    <p className="font-bold text-sm">{upgrade.name}</p>
                                                    <p className="text-xs text-slate-300">{upgrade.description}</p>
                                                    {!isPurchased && <p className="text-yellow-400 font-semibold mt-1 text-sm">💰 {cost}</p>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                           </div>
                           <button onClick={() => dispatch({ type: 'SELL_TOWER', payload: { sellValue: Math.floor(selectedTowerStats.totalSpent * 0.8) } })} className="w-full mt-2 py-2 px-4 game-button red text-lg">
                               <span>Sell for 💰 {Math.floor(selectedTowerStats.totalSpent * 0.8)}</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl text-center mb-2 ui-panel-header py-1 font-bangers tracking-wider text-yellow-300">TOWERS</h2>
                            <div className="grid grid-cols-2 gap-2 p-1">
                                {Object.values(TOWER_TYPES).filter(t => t.cost > 0).map(tower => {
                                    const cost = Math.floor(tower.cost * costMultiplier);
                                    const cantAfford = state.money < cost;
                                    return (
                                    <button key={tower.id} onClick={() => handleSelectTowerToPlace(tower)} disabled={cantAfford} className={`tower-card flex flex-col items-center p-1 ${cantAfford ? 'tower-card-disabled' : ''}`}>
                                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center p-1">{tower.shop.portrait}</div>
                                        <div className="text-center">
                                            <p className="font-bold text-sm leading-tight">{tower.name}</p>
                                            <p className="text-yellow-400 font-semibold text-sm">💰 {cost}</p>
                                        </div>
                                    </button>
                                )})}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="pt-2">
                    <button onClick={handleStartWave} disabled={state.waveSpawning || state.balloons.length > 0 || state.timeToNextWave > 0} className="w-full py-2 px-4 game-button green text-3xl tracking-wider">
                         {state.timeToNextWave > 0 ? `NEXT: ${Math.ceil(state.timeToNextWave / 1000)}` : "START WAVE"}
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default Game;
