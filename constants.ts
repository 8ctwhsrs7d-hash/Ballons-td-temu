
import type { TowerType, BalloonType, Wave, Vector2D, ProjectileType, Difficulty } from './types';
import React from 'react';

// GAME CONFIG
export const WAVE_COOLDOWN_MS = 5000;

export const DIFFICULTY_SETTINGS: Record<Difficulty, { initialMoney: number; initialHealth: number; towerCostMultiplier: number }> = {
    easy: { initialMoney: 650, initialHealth: 150, towerCostMultiplier: 0.9 },
    medium: { initialMoney: 500, initialHealth: 100, towerCostMultiplier: 1.0 },
    hard: { initialMoney: 400, initialHealth: 75, towerCostMultiplier: 1.1 },
    'ultra nightmare': { initialMoney: 300, initialHealth: 50, towerCostMultiplier: 1.25 }
};

// VISUALS
const DartMonkeyVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-yellow-900 rounded-full" }), React.createElement('div', { className: "absolute w-7 h-7 bg-orange-200 rounded-full -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-2 bg-black rounded-full -translate-x-2 -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-2 bg-black rounded-full translate-x-2 -translate-y-1" }));
const TackShooterVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-10 h-10 bg-gray-600 rounded-md" }), [...Array(8)].map((_, i) => React.createElement('div', { key: i, className: "absolute w-2 h-4 bg-gray-800", style: { transform: `rotate(${i * 45}deg) translateY(-1.25rem)` } })));
const IceMonkeyVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-blue-300 rounded-full" }), React.createElement('div', { className: "absolute w-7 h-7 bg-white rounded-full -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-2 bg-black rounded-full -translate-x-2 -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-2 bg-black rounded-full translate-x-2 -translate-y-1" }));
const BombShooterVisual = React.createElement('div', { className: "relative w-14 h-14 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-10 h-10 bg-gray-900 rounded-full" }), React.createElement('div', { className: "absolute w-4 h-8 bg-gray-700 -translate-y-4 rounded-t-md border-2 border-b-0 border-gray-600" }));
const SuperMonkeyVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-10 h-10 bg-red-600 rounded-b-full rotate-12" }), React.createElement('div', { className: "absolute w-8 h-8 bg-blue-800 rounded-full" }), React.createElement('div', { className: "absolute w-7 h-7 bg-orange-200 rounded-full -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-3 bg-yellow-300 rounded-full -translate-x-2 -translate-y-0.5 border border-black" }), React.createElement('div', { className: "absolute w-2 h-3 bg-yellow-300 rounded-full translate-x-2 -translate-y-0.5 border border-black" }));
const SniperMonkeyVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-green-900 rounded-full" }), React.createElement('div', { className: "absolute w-2 h-12 bg-gray-800 border-2 border-gray-900 rounded-sm" }));
const GlueGunnerVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-yellow-900 rounded-full" }), React.createElement('div', { className: "absolute w-4 h-8 bg-lime-500 -translate-y-2 rounded-md border-2 border-gray-900" }), React.createElement('div', { className: "absolute w-8 h-8 border-4 border-lime-700 rounded-full -translate-y-3" }));
const NinjaMonkeyVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-gray-800 rounded-full" }), React.createElement('div', { className: "absolute w-9 h-3 bg-red-600 -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-2 bg-white rounded-full -translate-x-2 -translate-y-1" }), React.createElement('div', { className: "absolute w-2 h-2 bg-white rounded-full translate-x-2 -translate-y-1" }));
const AlchemistVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-purple-900 rounded-full" }), React.createElement('div', { className: "absolute w-4 h-6 bg-green-400/50 border-2 border-green-300 rounded-t-full rounded-b-lg -translate-y-2" }));
const DruidVisual = React.createElement('div', { className: "relative w-12 h-12 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-8 h-8 bg-green-800 rounded-full" }), React.createElement('div', { className: "absolute w-2 h-4 bg-yellow-900 -translate-x-3 -translate-y-4 rotate-[-30deg] rounded-sm" }), React.createElement('div', { className: "absolute w-2 h-4 bg-yellow-900 translate-x-3 -translate-y-4 rotate-[30deg] rounded-sm" }));
const MortarTowerVisual = React.createElement('div', { className: "relative w-14 h-14 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-10 h-10 bg-gray-700 rounded-full" }), React.createElement('div', { className: "absolute w-6 h-10 bg-gray-900 -translate-y-2 border-4 border-gray-600 rounded-t-md" }));
const SpikeFactoryVisual = React.createElement('div', { className: "relative w-14 h-14 flex items-center justify-center" }, React.createElement('div', { className: "absolute w-12 h-12 bg-orange-700 rounded-md" }), React.createElement('div', { className: "absolute w-3 h-3 bg-gray-400 rotate-45 -translate-x-4" }), React.createElement('div', { className: "absolute w-3 h-3 bg-gray-400 rotate-45 translate-x-4" }), React.createElement('div', { className: "absolute w-3 h-3 bg-gray-400 rotate-45 -translate-y-4" }), React.createElement('div', { className: "absolute w-3 h-3 bg-gray-400 rotate-45 translate-y-4" }));
const MOABVisual = React.createElement('div', { className: "relative w-full h-full" }, React.createElement('div', { className: "absolute w-full h-full bg-blue-800 rounded-full" }), React.createElement('div', { className: "absolute w-[90%] h-[90%] left-[5%] top-[5%] bg-blue-900 rounded-full" }), React.createElement('div', { className: "absolute w-full h-1/2 bg-white/20 top-0 rounded-t-full" }), React.createElement('div', { className: "absolute top-1/2 -translate-y-1/2 left-1/4 text-white font-black text-2xl -rotate-12" }, "MOAB"));

const DartVisual = React.createElement('div', { className: 'w-1 h-4 bg-gray-700 rounded-full rotate-45' });
const TackVisual = React.createElement('div', { className: 'w-0.5 h-3 bg-gray-500' });
const IceShardVisual = React.createElement('div', { className: 'w-2 h-2 bg-cyan-200 rotate-45' });
const BombVisual = React.createElement('div', { className: "w-4 h-4 bg-black rounded-full border-2 border-gray-600" });
const PlasmaVisual = React.createElement('div', { className: 'w-2 h-4 bg-pink-500 rounded-full shadow-[0_0_8px_2px_#ec4899]' });
const BulletVisual = React.createElement('div', { className: 'w-1 h-3 bg-yellow-300' });
const GlueGlobVisual = React.createElement('div', { className: 'w-3 h-3 bg-lime-500 rounded-full opacity-75' });
const ShurikenVisual = React.createElement('div', { className: "relative w-4 h-4" }, React.createElement('div', { className: 'absolute w-1 h-4 bg-gray-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' }), React.createElement('div', { className: 'absolute w-4 h-1 bg-gray-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' }));
const AcidPotionVisual = React.createElement('div', { className: "w-4 h-5 bg-green-500/70 rounded-t-full rounded-b-md border-2 border-green-300" });
const ThornVisual = React.createElement('div', { className: 'w-1 h-5 bg-green-700' });
const MortarShellVisual = React.createElement('div', { className: "w-5 h-5 bg-gray-800 rounded-full" }, React.createElement('div', { className: "w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-red-500 -translate-y-2" }));
const SpikeVisual = React.createElement('div', { className: 'w-1 h-4 bg-gray-400' });

// PROJECTILES
export const PROJECTILE_TYPES: Record<string, ProjectileType> = {
    dart: { id: 'dart', speed: 800, damage: 1, visual: DartVisual, pierce: 2 },
    tack: { id: 'tack', speed: 600, damage: 1, visual: TackVisual, pierce: 1 },
    ice_shard: { id: 'ice_shard', speed: 700, damage: 0, visual: IceShardVisual, pierce: 1, slow: { factor: 0.6, duration: 1500 } },
    bomb: { id: 'bomb', speed: 400, damage: 2, visual: BombVisual, pierce: 1, aoeRange: 50, canPopLead: true },
    plasma: { id: 'plasma', speed: 1000, damage: 1, visual: PlasmaVisual, pierce: 2, canPopLead: true },
    bullet: { id: 'bullet', speed: 2500, damage: 5, visual: BulletVisual, pierce: 1 },
    glue: { id: 'glue', speed: 500, damage: 0, visual: GlueGlobVisual, pierce: 1, slow: { factor: 0.4, duration: 4000 } },
    shuriken: { id: 'shuriken', speed: 900, damage: 1, visual: ShurikenVisual, pierce: 3 },
    acid_potion: { id: 'acid_potion', speed: 400, damage: 1, visual: AcidPotionVisual, pierce: 1, aoeRange: 40, canPopLead: true },
    thorn: { id: 'thorn', speed: 800, damage: 1, visual: ThornVisual, pierce: 5 },
    mortar_shell: { id: 'mortar_shell', speed: 300, damage: 2, visual: MortarShellVisual, pierce: 1, aoeRange: 80, canPopLead: true },
    spike: { id: 'spike', speed: 1000, damage: 1, visual: SpikeVisual, pierce: 10 },
};

// TOWERS
export const TOWER_TYPES: Record<string, TowerType> = {
    dart_monkey: { 
        id: 'dart_monkey', name: 'Dart Monkey', cost: 150, range: 150, fireRate: 1.2, projectile: PROJECTILE_TYPES.dart, size: 25, visual: DartMonkeyVisual,
        upgrades: [
            [
                { name: 'Sharp Shots', cost: 140, description: 'Darts pop 1 extra balloon.', effects: { projectile: { pierce: 3 } } },
                { name: 'Razor Sharp', cost: 220, description: 'Darts pop 3 extra balloons.', effects: { projectile: { pierce: 6 } } },
            ],
            [
                { name: 'Quick Shots', cost: 100, description: 'Shoots faster.', effects: { fireRate: 1.5 } },
                { name: 'Very Quick Shots', cost: 190, description: 'Shoots even faster.', effects: { fireRate: 2.0 } },
            ]
        ]
    },
    tack_shooter: { 
        id: 'tack_shooter', name: 'Tack Shooter', cost: 250, range: 100, fireRate: 0.8, projectile: PROJECTILE_TYPES.tack, size: 30, visual: TackShooterVisual,
        upgrades: [
            [
                { name: 'Faster Shooting', cost: 150, description: 'Shoots tacks faster.', effects: { fireRate: 1.0 } },
                { name: 'Even Faster', cost: 250, description: 'Shoots tacks even faster.', effects: { fireRate: 1.3 } },
            ],
            [
                { name: 'More Tacks', cost: 200, description: 'Shoots 10 tacks.', effects: { /* Handled in code */ } },
                { name: 'Even More Tacks', cost: 300, description: 'Shoots 12 tacks.', effects: { /* Handled in code */ } },
            ]
        ] 
    },
    ice_monkey: { 
        id: 'ice_monkey', name: 'Ice Monkey', cost: 300, range: 120, fireRate: 1, projectile: PROJECTILE_TYPES.ice_shard, size: 25, visual: IceMonkeyVisual,
        upgrades: [
            [
                { name: 'Enhanced Freeze', cost: 200, description: 'Slows balloons for longer.', effects: { projectile: { slow: { factor: 0.6, duration: 2500 } } } },
                { name: 'Permafrost', cost: 320, description: 'Extends freeze time.', effects: { projectile: { slow: { factor: 0.5, duration: 4000 } } } },
            ],
            [
                { name: 'Increased Range', cost: 150, description: 'Increases attack range.', effects: { range: 150 } },
                { name: 'Arctic Wind', cost: 380, description: 'Greatly increases range.', effects: { range: 180 } },
            ]
        ]
    },
    bomb_shooter: { 
        id: 'bomb_shooter', name: 'Bomb Shooter', cost: 420, range: 160, fireRate: 0.6, projectile: PROJECTILE_TYPES.bomb, size: 30, visual: BombShooterVisual,
        upgrades: [
             [
                { name: 'Bigger Bombs', cost: 300, description: 'Increases explosion radius.', effects: { projectile: { aoeRange: 70 } } },
                { name: 'Really Big Bombs', cost: 500, description: 'Massive explosion radius.', effects: { projectile: { aoeRange: 90 } } },
            ],
            [
                { name: 'Faster Reload', cost: 250, description: 'Shoots bombs faster.', effects: { fireRate: 0.8 } },
                { name: 'Missile Launcher', cost: 450, description: 'Shoots bombs much faster.', effects: { fireRate: 1.2 } },
            ]
        ]
    },
    sniper_monkey: { 
        id: 'sniper_monkey', name: 'Sniper Monkey', cost: 400, range: 1000, fireRate: 0.5, projectile: PROJECTILE_TYPES.bullet, size: 25, visual: SniperMonkeyVisual,
        upgrades: [
            [
                { name: 'Full Metal Jacket', cost: 300, description: 'Can pop Lead balloons.', effects: { projectile: { pierce: 2, canPopLead: true } } },
                { name: 'Armor Piercing Darts', cost: 650, description: 'Bullets pop 5 balloons.', effects: { projectile: { pierce: 5 } } },
            ],
            [
                { name: 'Fast Firing', cost: 250, description: 'Shoots faster.', effects: { fireRate: 0.8 } },
                { name: 'Semi-Automatic', cost: 600, description: 'Shoots much faster.', effects: { fireRate: 1.5 } },
            ]
        ]
    },
    glue_gunner: { 
        id: 'glue_gunner', name: 'Glue Gunner', cost: 200, range: 140, fireRate: 0.9, projectile: PROJECTILE_TYPES.glue, size: 25, visual: GlueGunnerVisual,
        upgrades: [
            [
                { name: 'Stickier Glue', cost: 150, description: 'Glue lasts much longer.', effects: { projectile: { slow: { factor: 0.4, duration: 6000 } } } },
                { name: 'Super Glue', cost: 300, description: 'Glue lasts a long time.', effects: { projectile: { slow: { factor: 0.3, duration: 10000 } } } },
            ],
            [
                { name: 'Glue Soak', cost: 200, description: 'Glue can soak through 2 layers.', effects: { projectile: { pierce: 2 } } },
                { name: 'Corrosive Glue', cost: 350, description: 'Glue damages balloons.', effects: { projectile: { damage: 1, pierce: 3 } } },
            ]
        ]
    },
    super_monkey: { 
        id: 'super_monkey', name: 'Super Monkey', cost: 1800, range: 200, fireRate: 5, projectile: PROJECTILE_TYPES.plasma, size: 30, visual: SuperMonkeyVisual,
        upgrades: [
            [
                { name: 'Laser Blasts', cost: 1200, description: 'Shots pop more balloons.', effects: { projectile: { pierce: 5 } } },
                { name: 'Plasma Blasts', cost: 2500, description: 'Shots pop many more.', effects: { projectile: { pierce: 10 } } },
            ],
            [
                { name: 'Super Range', cost: 800, description: 'Increases attack range.', effects: { range: 250 } },
                { name: 'Epic Range', cost: 1500, description: 'Massive attack range.', effects: { range: 300 } },
            ]
        ]
    },
    ninja_monkey: {
        id: 'ninja_monkey', name: 'Ninja Monkey', cost: 450, range: 160, fireRate: 3.0, projectile: PROJECTILE_TYPES.shuriken, size: 25, visual: NinjaMonkeyVisual,
        upgrades: [
            [
                { name: 'Ninja Discipline', cost: 250, description: 'Increases attack speed.', effects: { fireRate: 4.0 } },
                { name: 'Double Shot', cost: 400, description: 'Throws 2 shurikens at once.', effects: { /* Handled in code */ } },
            ],
            [
                { name: 'Sharp Shurikens', cost: 300, description: 'Shurikens pop 3 extra balloons.', effects: { projectile: { pierce: 6 } } },
                { name: 'Flash Bomb', cost: 600, description: 'Throws a small bomb that can pop Lead.', effects: { projectile: { damage: 2, aoeRange: 30, canPopLead: true } } },
            ]
        ]
    },
    alchemist: {
        id: 'alchemist', name: 'Alchemist', cost: 500, range: 140, fireRate: 0.8, projectile: PROJECTILE_TYPES.acid_potion, size: 25, visual: AlchemistVisual,
        upgrades: [
            [
                { name: 'Larger Potions', cost: 250, description: 'Increases splash radius.', effects: { projectile: { aoeRange: 60 } } },
                { name: 'Perishing Potions', cost: 500, description: 'Potions deal more damage.', effects: { projectile: { damage: 3 } } },
            ],
            [
                { name: 'Faster Throwing', cost: 350, description: 'Throws potions faster.', effects: { fireRate: 1.2 } },
                { name: 'Acidic Mixture Dip', cost: 600, description: 'Potions can dissolve more layers.', effects: { projectile: { pierce: 5 } } },
            ]
        ]
    },
    druid: {
        id: 'druid', name: 'Druid', cost: 350, range: 150, fireRate: 1.0, projectile: PROJECTILE_TYPES.thorn, size: 25, visual: DruidVisual,
        upgrades: [
            [
                { name: 'Hard Thorns', cost: 200, description: 'Thorns can pop more balloons.', effects: { projectile: { pierce: 8 } } },
                { name: 'Heart of Thunder', cost: 750, description: 'Attacks can pop Lead balloons and deal more damage.', effects: { projectile: { damage: 3, canPopLead: true } } },
            ],
            [
                { name: 'Druid of the Jungle', cost: 300, description: 'Increases attack range.', effects: { range: 180 } },
                { name: 'Heart of Vengeance', cost: 400, description: 'Attacks faster.', effects: { fireRate: 1.5 } },
            ]
        ]
    },
    mortar_tower: {
        id: 'mortar_tower', name: 'Mortar Tower', cost: 600, range: 250, fireRate: 0.5, projectile: PROJECTILE_TYPES.mortar_shell, size: 30, visual: MortarTowerVisual,
        upgrades: [
            [
                { name: 'Bigger Blast', cost: 400, description: 'Increases explosion radius.', effects: { projectile: { aoeRange: 100 } } },
                { name: 'Bloon Buster', cost: 800, description: 'Shells deal more damage.', effects: { projectile: { damage: 5 } } },
            ],
            [
                { name: 'Increased Accuracy', cost: 200, description: 'Slightly increases attack speed.', effects: { fireRate: 0.7 } },
                { name: 'Rapid Reload', cost: 700, description: 'Greatly increases attack speed.', effects: { fireRate: 1.2 } },
            ]
        ]
    },
    spike_factory: {
        id: 'spike_factory', name: 'Spike Factory', cost: 700, range: 120, fireRate: 0.3, projectile: PROJECTILE_TYPES.spike, size: 30, visual: SpikeFactoryVisual,
        upgrades: [
            [
                { name: 'Faster Production', cost: 450, description: 'Produces spikes faster.', effects: { fireRate: 0.5 } },
                { name: 'Even Faster Production', cost: 650, description: 'Produces spikes much faster.', effects: { fireRate: 0.8 } },
            ],
            [
                { name: 'Bigger Stacks', cost: 500, description: 'Spikes can pop more balloons.', effects: { projectile: { pierce: 20 } } },
                { name: 'White Hot Spikes', cost: 700, description: 'Spikes can pop Lead balloons.', effects: { projectile: { canPopLead: true } } },
            ]
        ]
    },
};

// BALLOONS
export const BALLOON_TYPES: Record<string, BalloonType> = {
    red: { id: 'red', health: 1, speed: 75, money: 3, color: '#ef4444', size: 15 },
    blue: { id: 'blue', health: 1, speed: 90, money: 3, color: '#3b82f6', size: 16, children: ['red'] },
    green: { id: 'green', health: 1, speed: 110, money: 4, color: '#22c55e', size: 17, children: ['blue'] },
    yellow: { id: 'yellow', health: 1, speed: 150, money: 5, color: '#facc15', size: 18, children: ['green'] },
    pink: { id: 'pink', health: 1, speed: 200, money: 6, color: '#f472b6', size: 19, children: ['yellow'] },
    black: { id: 'black', health: 1, speed: 120, money: 8, color: '#111827', size: 18, immuneToExplosions: true, children: ['pink'] },
    white: { id: 'white', health: 1, speed: 130, money: 8, color: '#f9fafb', size: 18, immuneToFreeze: true, children: ['pink'] },
    lead: { id: 'lead', health: 1, speed: 70, money: 15, color: '#4b5563', size: 20, isLead: true, children: ['black', 'black'] },
    zebra: { id: 'zebra', health: 1, speed: 120, money: 12, color: '#ffffff', size: 19, immuneToExplosions: true, immuneToFreeze: true, children: ['black', 'white'] },
    ceramic: { id: 'ceramic', health: 10, speed: 90, money: 25, color: '#a16207', size: 22, children: ['pink', 'pink']},
    moab: { id: 'moab', health: 200, speed: 40, money: 100, color: '#0000ff', size: 50, isBlimp: true, children: ['ceramic', 'ceramic', 'ceramic', 'ceramic'], visual: MOABVisual },
};

// GAME PATH
export const GAME_PATH: Vector2D[] = [
    { x: -50, y: 150 }, { x: 150, y: 150 }, { x: 150, y: 400 }, { x: 400, y: 400 },
    { x: 400, y: 100 }, { x: 650, y: 100 }, { x: 650, y: 500 }, { x: 900, y: 500 },
    { x: 900, y: 250 }, { x: 1150, y: 250 }, { x: 1150, y: 650 }, { x: 1250, y: 650 },
];

// WAVES
export const WAVES: Wave[] = [
    // 1-10
    [{ balloonTypeId: 'red', count: 10, spawnDelay: 800 }],
    [{ balloonTypeId: 'red', count: 15, spawnDelay: 600 }],
    [{ balloonTypeId: 'red', count: 10, spawnDelay: 500 }, { balloonTypeId: 'blue', count: 5, spawnDelay: 700 }],
    [{ balloonTypeId: 'blue', count: 15, spawnDelay: 500 }],
    [{ balloonTypeId: 'green', count: 10, spawnDelay: 600 }, { balloonTypeId: 'blue', count: 5, spawnDelay: 400 }],
    [{ balloonTypeId: 'yellow', count: 8, spawnDelay: 800 }],
    [{ balloonTypeId: 'green', count: 20, spawnDelay: 300 }],
    [{ balloonTypeId: 'yellow', count: 10, spawnDelay: 500 }, { balloonTypeId: 'pink', count: 5, spawnDelay: 1000 }],
    [{ balloonTypeId: 'pink', count: 15, spawnDelay: 400 }],
    [{ balloonTypeId: 'yellow', count: 20, spawnDelay: 200 }, { balloonTypeId: 'pink', count: 10, spawnDelay: 300 }],
    // 11-20
    [{ balloonTypeId: 'red', count: 50, spawnDelay: 100 }],
    [{ balloonTypeId: 'blue', count: 30, spawnDelay: 200 }, { balloonTypeId: 'green', count: 10, spawnDelay: 500 }],
    [{ balloonTypeId: 'yellow', count: 15, spawnDelay: 300 }, { balloonTypeId: 'pink', count: 15, spawnDelay: 400 }],
    [{ balloonTypeId: 'ceramic', count: 2, spawnDelay: 1000 }],
    [{ balloonTypeId: 'pink', count: 30, spawnDelay: 150 }],
    [{ balloonTypeId: 'green', count: 100, spawnDelay: 50 }],
    [{ balloonTypeId: 'yellow', count: 40, spawnDelay: 150 }],
    [{ balloonTypeId: 'ceramic', count: 5, spawnDelay: 800 }, { balloonTypeId: 'blue', count: 20, spawnDelay: 100 }],
    [{ balloonTypeId: 'ceramic', count: 8, spawnDelay: 500 }],
    [{ balloonTypeId: 'ceramic', count: 10, spawnDelay: 400 }, { balloonTypeId: 'pink', count: 20, spawnDelay: 100 }],
    // 21-30
    [{ balloonTypeId: 'black', count: 10, spawnDelay: 600 }],
    [{ balloonTypeId: 'white', count: 10, spawnDelay: 600 }],
    [{ balloonTypeId: 'lead', count: 5, spawnDelay: 1200 }],
    [{ balloonTypeId: 'zebra', count: 8, spawnDelay: 900 }],
    [{ balloonTypeId: 'ceramic', count: 12, spawnDelay: 300 }],
    [{ balloonTypeId: 'lead', count: 10, spawnDelay: 500 }, { balloonTypeId: 'red', count: 50, spawnDelay: 50 }],
    [{ balloonTypeId: 'black', count: 15, spawnDelay: 200 }, { balloonTypeId: 'white', count: 15, spawnDelay: 200 }],
    [{ balloonTypeId: 'yellow', count: 100, spawnDelay: 50 }],
    [{ balloonTypeId: 'ceramic', count: 10, spawnDelay: 200 }, { balloonTypeId: 'lead', count: 5, spawnDelay: 1000 }],
    [{ balloonTypeId: 'zebra', count: 20, spawnDelay: 300 }],
    // 31-40
    [{ balloonTypeId: 'ceramic', count: 20, spawnDelay: 250 }],
    [{ balloonTypeId: 'pink', count: 50, spawnDelay: 50 }, { balloonTypeId: 'lead', count: 10, spawnDelay: 200 }],
    [{ balloonTypeId: 'black', count: 20, spawnDelay: 100 }, { balloonTypeId: 'white', count: 20, spawnDelay: 100 }, { balloonTypeId: 'zebra', count: 10, spawnDelay: 200 }],
    [{ balloonTypeId: 'ceramic', count: 25, spawnDelay: 150 }],
    [{ balloonTypeId: 'lead', count: 15, spawnDelay: 300 }, { balloonTypeId: 'zebra', count: 15, spawnDelay: 400 }],
    [{ balloonTypeId: 'ceramic', count: 15, spawnDelay: 100 }, { balloonTypeId: 'yellow', count: 50, spawnDelay: 30 }],
    [{ balloonTypeId: 'ceramic', count: 30, spawnDelay: 100 }],
    [{ balloonTypeId: 'lead', count: 25, spawnDelay: 200 }],
    [{ balloonTypeId: 'ceramic', count: 20, spawnDelay: 50 }, { balloonTypeId: 'zebra', count: 20, spawnDelay: 100 }],
    [{ balloonTypeId: 'moab', count: 1, spawnDelay: 1000 }],
];
