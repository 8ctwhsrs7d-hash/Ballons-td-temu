
import type { TowerType, BalloonType, Wave, Vector2D, ProjectileType, Difficulty, MapData, MapId } from './types.ts';
import React from 'react';

// GAME CONFIG
export const WAVE_COOLDOWN_MS = 5000;

export const DIFFICULTY_SETTINGS: Record<Difficulty, { initialMoney: number; initialHealth: number; towerCostMultiplier: number }> = {
    easy: { initialMoney: 650, initialHealth: 150, towerCostMultiplier: 0.9 },
    medium: { initialMoney: 500, initialHealth: 100, towerCostMultiplier: 1.0 },
    hard: { initialMoney: 400, initialHealth: 75, towerCostMultiplier: 1.1 },
    'ultra nightmare': { initialMoney: 300, initialHealth: 50, towerCostMultiplier: 1.25 }
};

// ==================================================================
// PROFESSIONAL VISUAL ASSETS
// ==================================================================

// --- TOWER VISUALS ---
const DartMonkeyVisual = React.createElement("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", { clipPath: "url(#clip_dart)" }, React.createElement("path", { d: "M24 42C17.37 42 12 36.63 12 30V29C12 22.37 17.37 17 24 17C30.63 17 36 22.37 36 29V30C36 36.63 30.63 42 24 42Z", fill: "#8C5A2B" }), React.createElement("path", { d: "M24 17C17.37 17 12 22.37 12 29V30C12 29.5 12.5 29 13 29H35C35.5 29 36 29.5 36 30V29C36 22.37 30.63 17 24 17Z", fill: "#A67B5B" }), React.createElement("path", { d: "M31 28C31 29.89 30.05 31.6 28.53 32.5C28.2 30.58 26.3 29 24 29C21.7 29 19.8 30.58 19.47 32.5C17.95 31.6 17 29.89 17 28C17 24.13 20.13 21 24 21C27.87 21 31 24.13 31 28Z", fill: "#F3EAD3" }), React.createElement("path", { d: "M20 25C19.45 25 19 25.45 19 26C19 26.55 19.45 27 20 27C20.55 27 21 26.55 21 26C21 25.45 20.55 25 20 25Z", fill: "#111827" }), React.createElement("path", { d: "M28 25C27.45 25 27 25.45 27 26C27 26.55 27.45 27 28 27C28.55 27 29 26.55 29 26C29 25.45 28.55 25 28 25Z", fill: "#111827" }), React.createElement("path", { d: "M24 33C25.1 33 26 32.1 26 31H22C22 32.1 22.9 33 24 33Z", fill: "#111827" })), React.createElement("defs", null, React.createElement("clipPath", { id: "clip_dart" }, React.createElement("rect", { width: "48", height: "48", fill: "white" }))));
const TackShooterVisual = React.createElement("svg", { width: "48", height: "48", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("rect", { x: "10", y: "10", width: "28", height: "28", rx: "6", fill: "#4B5563", stroke: "#1F2937", strokeWidth: "2" }), React.createElement("rect", { x: "12", y: "12", width: "24", height: "24", rx: "4", fill: "#6B7280" }), React.createElement("circle", { cx: "24", cy: "24", r: "5", fill: "#374151" }), ...[...Array(8)].map((_, i) => React.createElement("g", { key: i, transform: `rotate(${i * 45} 24 24)` }, React.createElement("path", { d: "M22,4 L26,4 L26,14 L22,14 Z", fill: "#4B5563" }), React.createElement("path", { d: "M22.5,4.5 L25.5,4.5 L25.5,6.5 L22.5,6.5 Z", fill: "#9CA3AF" })))));
const SuperMonkeyVisual = React.createElement("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("path", { d: "M11 20L24 10L37 20V32C37 36.4183 31.1797 40 24 40C16.8203 40 11 36.4183 11 32V20Z", fill: "#1E3A8A" }), React.createElement("path", { d: "M12 21L24 30L36 21L24 12L12 21Z", fill: "#2563EB" }), React.createElement("path", { d: "M14 30C14 34 18.4772 37 24 37C29.5228 37 34 34 34 30V24L24 32L14 24V30Z", fill: "#3B82F6" }), React.createElement("path", { d: "M11 20L6 16L24 4L42 16L37 20", fill: "#DC2626" }), React.createElement("path", { d: "M6 16L11 32H37L42 16", fill: "#B91C1C" }), React.createElement("path", { d: "M24,4 L26,7 L24,8 L22,7 Z", fill: "yellow" }));
const BombShooterVisual = React.createElement("svg", { width: "56", height: "56", viewBox: "0 0 56 56", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("circle", { cx: "28", cy: "28", r: "20", fill: "#1F2937" }), React.createElement("circle", { cx: "28", cy: "28", r: "18", fill: "#374151", stroke: "#4B5563", strokeWidth: "2" }), React.createElement("path", { d: "M22 28V12C22 10.8954 22.8954 10 24 10H32C33.1046 10 34 10.8954 34 12V28H22Z", fill: "#111827", stroke: "#4B5563", strokeWidth: "2" }), React.createElement("path", { d: "M24 10H32C33.1 10 34 11 34 12V14H22V12C22 11 22.9 10 24 10Z", fill: "#4B5563" })));
const NinjaMonkeyVisual = React.createElement("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("path", { d: "M24 42C17.37 42 12 36.63 12 30V29C12 22.37 17.37 17 24 17C30.63 17 36 22.37 36 29V30C36 36.63 30.63 42 24 42Z", fill: "#374151" }), React.createElement("path", { d: "M24 17C17.37 17 12 22.37 12 29V30C12 29.5 12.5 29 13 29H35C35.5 29 36 29.5 36 30V29C36 22.37 30.63 17 24 17Z", fill: "#4B5563" }), React.createElement("path", { d: "M31 28C31 29.89 30.05 31.6 28.53 32.5C28.2 30.58 26.3 29 24 29C21.7 29 19.8 30.58 19.47 32.5C17.95 31.6 17 29.89 17 28C17 24.13 20.13 21 24 21C27.87 21 31 24.13 31 28Z", fill: "#1F2937" }), React.createElement("rect", { x: "15", y: "24", width: "18", height: "4", fill: "#DC2626" }), React.createElement("rect", { x: "17", y: "25", width: "14", height: "2", fill: "#F87171" })));
const IceMonkeyVisual = React.createElement("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("path", { d: "M12 30C12 36.6274 17.3726 42 24 42C30.6274 42 36 36.6274 36 30V24H12V30Z", fill: "#60A5FA" }), React.createElement("path", { d: "M12 24V20C12 15.5817 15.5817 12 20 12H28C32.4183 12 36 15.5817 36 20V24H12Z", fill: "#93C5FD" }), React.createElement("path", { d: "M31 28C31 29.6569 29.6569 31 28 31H20C18.3431 31 17 29.6569 17 28V26C17 24.3431 18.3431 23 20 23H28C29.6569 23 31 24.3431 31 26V28Z", fill: "#2563EB" }), React.createElement("rect", { x: "10", y: "10", width: "28", height: "14", rx: "7", fill: "#E0F2FE" }), React.createElement("rect", { x: "8", y: "17", width: "32", height: "8", fill: "#E0F2FE" }), React.createElement("path", { d: "M20 25C19.45 25 19 25.45 19 26C19 26.55 19.45 27 20 27C20.55 27 21 26.55 21 26C21 25.45 20.55 25 20 25Z", fill: "#F9FAFB" }), React.createElement("path", { d: "M28 25C27.45 25 27 25.45 27 26C27 26.55 27.45 27 28 27C28.55 27 29 26.55 29 26C29 25.45 28.55 25 28 25Z", fill: "#F9FAFB" })));
const GlueGunnerVisual = React.createElement("svg", { width: "56", height: "56", viewBox: "0 0 56 56", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("path", { d: "M28 48C21.37 48 16 42.63 16 36V35C16 28.37 21.37 23 28 23C34.63 23 40 28.37 40 35V36C40 42.63 34.63 48 28 48Z", fill: "#8C5A2B" }), React.createElement("path", { d: "M35 34C35 35.6569 33.6569 37 32 37H24C22.3431 37 21 35.6569 21 34V32C21 30.3431 22.3431 29 24 29H32C33.6569 29 35 30.3431 35 32V34Z", fill: "#F3EAD3" }), React.createElement("rect", { x: "18", y: "16", width: "20", height: "8", rx: "4", fill: "#16A34A" }), React.createElement("rect", { x: "20", y: "17", width: "16", height: "6", rx: "3", fill: "#6EE7B7" }), React.createElement("path", { d: "M38 18H46L50 20V24L46 26H38V18Z", fill: "#4B5563" }), React.createElement("circle", { cx: "14", cy: "28", r: "8", fill: "#166534" }), React.createElement("circle", { cx: "14", cy: "28", r: "6", fill: "#34D399" })));
const AlchemistVisual = React.createElement("svg", { width: "56", height: "56", viewBox: "0 0 56 56", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("path", { d: "M28 48C21.37 48 16 42.63 16 36V35C16 28.37 21.37 23 28 23C34.63 23 40 28.37 40 35V36C40 42.63 34.63 48 28 48Z", fill: "#8C5A2B" }), React.createElement("path", { d: "M35 34C35 35.6569 33.6569 37 32 37H24C22.3431 37 21 35.6569 21 34V32C21 30.3431 22.3431 29 24 29H32C33.6569 29 35 30.3431 35 32V34Z", fill: "#F3EAD3" }), React.createElement("circle", { cx: "22", cy: "32", r: "1.5", fill: "black" }), React.createElement("circle", { cx: "34", cy: "32", r: "1.5", fill: "black" }), React.createElement("circle", { cx: "20", cy: "32", r: "3", fill: "#D1D5DB", stroke: "black" }), React.createElement("circle", { cx: "36", cy: "32", r: "3", fill: "#D1D5DB", stroke: "black" }), React.createElement("path", { d: "M36,10 C38,10 40,12 40,14 L40,20 C40,22 38,24 36,24 L32,24 L32,28 C32,32 28,34 24,34 C20,34 16,32 16,28 L16,24 L12,24 C10,24 8,22 8,20 L8,14 C8,12 10,10 12,10 Z", fill: "#99F6E4" }), React.createElement("path", { d: "M10,12 C12,12 30,12 38,12", stroke: "#2DD4BF", strokeWidth: "2" }), React.createElement("path", { d: "M16,28 C16,24 20,22 24,22 C28,22 32,24 32,28", fill: "#14B8A6" })));
const SniperMonkeyVisual = React.createElement("svg", { width: "56", height: "56", viewBox: "0 0 56 56", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("path", { d: "M28 48C21.37 48 16 42.63 16 36V35C16 28.37 21.37 23 28 23C34.63 23 40 28.37 40 35V36C40 42.63 34.63 48 28 48Z", fill: "#166534" }), React.createElement("path", { d: "M35 34C35 35.6569 33.6569 37 32 37H24C22.3431 37 21 35.6569 21 34V32C21 30.3431 22.3431 29 24 29H32C33.6569 29 35 30.3431 35 32V34Z", fill: "#F3EAD3" }), React.createElement("path", { d: "M36 20L54 20L52 24L36 24Z", fill: "#374151" }), React.createElement("rect", { x: "32", y: "24", width: "4", height: "10", fill: "#374151" }), React.createElement("rect", { x: "28", y: "16", width: "12", height: "4", rx: "2", fill: "#4B5563" })));
const DruidMonkeyVisual = React.createElement("svg", { width: "56", height: "56", viewBox: "0 0 56 56", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React.createElement("g", null, React.createElement("path", { d: "M28 48C21.37 48 16 42.63 16 36V35C16 28.37 21.37 23 28 23C34.63 23 40 28.37 40 35V36C40 42.63 34.63 48 28 48Z", fill: "#8C5A2B" }), React.createElement("path", { d: "M35 34C35 35.6569 33.6569 37 32 37H24C22.3431 37 21 35.6569 21 34V32C21 30.3431 22.3431 29 24 29H32C33.6569 29 35 30.3431 35 32V34Z", fill: "#F3EAD3" }), React.createElement("path", { d: "M16 26C10 20 10 10 16 6", stroke: "#A67B5B", strokeWidth: "4", strokeLinecap: "round" }), React.createElement("path", { d: "M40 26C46 20 46 10 40 6", stroke: "#A67B5B", strokeWidth: "4", strokeLinecap: "round" }), React.createElement("path", { d: "M38 10L42 28L46 10Z", fill: "#16A34A" }), React.createElement("circle", { cx: "42", cy: "28", r: "3", fill: "#EF4444" })));


// --- PROJECTILE VISUALS ---
const DartVisual = React.createElement("div", { className: "relative w-[8px] h-[28px]" }, React.createElement("div", { style: { width: '100%', height: '100%', background: '#374151', clipPath: 'polygon(50% 0, 100% 80%, 50% 100%, 0 80%)' } }), React.createElement("div", { style: { width: '100%', height: '5px', background: '#9CA3AF', position: 'absolute', bottom: '2px' } }));
const TackVisual = React.createElement("div", { style: { width: '6px', height: '18px', background: 'linear-gradient(to top, #6B7280, #D1D5DB)', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' } });
const BombVisual = React.createElement("div", { className: "w-4 h-4 bg-gray-900 rounded-full border-2 border-gray-600 relative shadow-md" }, React.createElement("div", { className: "absolute -top-1.5 left-1/2 w-1 h-2 bg-gray-400 transform -translate-x-1/2" }), React.createElement("div", { className: "absolute top-1 left-1 w-1 h-2 bg-white/50 rounded-full transform rotate-45" }));
const PlasmaVisual = React.createElement("div", { className: "w-4 h-4 bg-pink-400 rounded-full shadow-[0_0_10px_4px_#ec4899] border-2 border-white/80" });

// --- BALLOON VISUALS ---
const RedBalloonVisual = React.createElement("svg", { viewBox: "0 0 100 120", className: "w-full h-full" }, React.createElement("defs", null, React.createElement("radialGradient", { id: "grad_red", cx: "30%", cy: "30%", r: "80%", fx: "35%", fy: "25%" }, React.createElement("stop", { offset: "0%", style: { stopColor: "#F87171" } }), React.createElement("stop", { offset: "100%", style: { stopColor: "#B91C1C" } }))), React.createElement("path", { d: "M 50,110 C 20,110 0,85 0,55 C 0,25 25,0 50,0 C 75,0 100,25 100,55 C 100,85 80,110 50,110 Z", fill: "url(#grad_red)" }), React.createElement("path", { d: "M 45,108 L 50,118 L 55,108 Z", fill: "#B91C1C" }), React.createElement("path", { d: "M 30,30 C 40,20 60,20 70,35 C 65,25 45,25 30,30 Z", fill: "rgba(255,255,255,0.4)", transform: "rotate(10 50 50)" }));
const BlueBalloonVisual = React.createElement("svg", { viewBox: "0 0 100 120", className: "w-full h-full" }, React.createElement("defs", null, React.createElement("radialGradient", { id: "grad_blue", cx: "30%", cy: "30%", r: "80%", fx: "35%", fy: "25%" }, React.createElement("stop", { offset: "0%", style: { stopColor: "#93C5FD" } }), React.createElement("stop", { offset: "100%", style: { stopColor: "#2563EB" } }))), React.createElement("path", { d: "M 50,110 C 20,110 0,85 0,55 C 0,25 25,0 50,0 C 75,0 100,25 100,55 C 100,85 80,110 50,110 Z", fill: "url(#grad_blue)" }), React.createElement("path", { d: "M 45,108 L 50,118 L 55,108 Z", fill: "#2563EB" }), React.createElement("path", { d: "M 30,30 C 40,20 60,20 70,35 C 65,25 45,25 30,30 Z", fill: "rgba(255,255,255,0.4)", transform: "rotate(10 50 50)" }));
const MOABVisual = React.createElement("svg", { viewBox: "0 0 160 80", className: "w-full h-full" }, React.createElement("defs", null, React.createElement("linearGradient", { id: "grad_moab_body", x1: "0", y1: "0", x2: "0", y2: "1" }, React.createElement("stop", { offset: "0%", stopColor: "#60A5FA" }), React.createElement("stop", { offset: "100%", stopColor: "#1E40AF" })), React.createElement("linearGradient", { id: "grad_moab_fin", x1: "0", y1: "0", x2: "0", y2: "1" }, React.createElement("stop", { offset: "0%", stopColor: "#E2E8F0" }), React.createElement("stop", { offset: "100%", stopColor: "#94A3B8" }))), React.createElement("path", { d: "M 15,40 A 65 35 0 0 1 145,40 A 65 35 0 0 1 15,40 Z", fill: "url(#grad_moab_body)", stroke: "#0F172A", strokeWidth: "2" }), React.createElement("path", { d: "M 15,40 A 65 35 0 0 0 145,40 L 145,35 A 65 30 0 0 0 15,35 Z", fill: "rgba(255,255,255,0.3)" }), React.createElement("path", { d: "M 145,35 L 160,25 L 160,55 L 145,45 Z", fill: "url(#grad_moab_fin)", stroke: "#475569", strokeWidth: "1" }), React.createElement("path", { d: "M 15,35 L 0,25 L 0,55 L 15,45 Z", fill: "url(#grad_moab_fin)", stroke: "#475569", strokeWidth: "1" }), React.createElement("text", { x: "80", y: "55", textAnchor: "middle", fill: "white", fontSize: "28", fontFamily: "Bangers", stroke: "black", strokeWidth: "1", letterSpacing: "0.1em" }, "MOAB"));

// PROJECTILES
export const PROJECTILE_TYPES: Record<string, ProjectileType> = {
    dart: { id: 'dart', speed: 800, damage: 1, visual: DartVisual, pierce: 2 },
    tack: { id: 'tack', speed: 600, damage: 1, visual: TackVisual, pierce: 1 },
    bomb: { id: 'bomb', speed: 400, damage: 2, visual: BombVisual, pierce: 1, aoeRange: 50, canPopLead: true },
    plasma: { id: 'plasma', speed: 1000, damage: 1, visual: PlasmaVisual, pierce: 2, canPopLead: true },
    shuriken: { id: 'shuriken', speed: 1000, damage: 1, visual: React.createElement("div", { className: "w-5 h-5 bg-gray-700 shuriken-spin", style: { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' } }), pierce: 2 },
    ice_shard: { id: 'ice_shard', speed: 700, damage: 0, visual: React.createElement("div", { className: "w-3 h-3 bg-cyan-200 rounded-full shadow-[0_0_8px_2px_#67e8f9]" }), pierce: 1, aoeRange: 40, slow: { factor: 0.5, duration: 1500 } },
    glue: { id: 'glue', speed: 500, damage: 0, visual: React.createElement("div", { className: "w-4 h-4 bg-lime-400 rounded-full shadow-[0_0_8px_2px_#a3e635]" }), pierce: 1, slow: { factor: 0.3, duration: 4000 } },
    acid_potion: { id: 'acid_potion', speed: 400, damage: 1, visual: React.createElement("div", { className: "w-5 h-5 rounded-full bg-green-500 flex items-center justify-center" }, React.createElement("div", { className: "w-3 h-3 rounded-full bg-green-300 animate-pulse" })), pierce: 1, aoeRange: 40, canPopLead: true },
    sniper_bullet: { id: 'sniper_bullet', speed: 2000, damage: 5, visual: React.createElement("div", { className: "w-1 h-3 bg-yellow-300 rounded-full" }), pierce: 2, canPopLead: true },
    thorn: { id: 'thorn', speed: 0, damage: 1, visual: React.createElement("div", { className: "w-6 h-6 text-green-500" }, React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" }))), pierce: 5, isStationary: true, duration: 5000 },
};

// TOWERS
export const TOWER_TYPES: Record<string, TowerType> = {
    dart_monkey: { 
        id: 'dart_monkey', name: 'Dart Monkey', cost: 150, range: 150, fireRate: 1.2, projectile: PROJECTILE_TYPES.dart, size: 25, 
        visual: DartMonkeyVisual,
        shop: { portrait: DartMonkeyVisual, description: "Throws a single dart that pops 2 bloons." },
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
        id: 'tack_shooter', name: 'Tack Shooter', cost: 250, range: 100, fireRate: 0.8, projectile: PROJECTILE_TYPES.tack, size: 30, 
        visual: TackShooterVisual,
        shop: { portrait: TackShooterVisual, description: "Shoots 8 tacks in a circle." },
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
     ninja_monkey: {
        id: 'ninja_monkey', name: 'Ninja Monkey', cost: 400, range: 160, fireRate: 1.8, projectile: PROJECTILE_TYPES.shuriken, size: 25,
        visual: NinjaMonkeyVisual,
        shop: { portrait: NinjaMonkeyVisual, description: "Throws sharp shurikens with speed and precision." },
        upgrades: [
            [
                { name: 'Sharp Shurikens', cost: 250, description: 'Shurikens pop 2 extra bloons.', effects: { projectile: { pierce: 4 } } },
                { name: 'Double Shot', cost: 450, description: 'Throws 2 shurikens at once.', effects: { /* Handled in code */ } },
            ],
            [
                { name: 'Ninja Discipline', cost: 200, description: 'Increases attack speed.', effects: { fireRate: 2.4 } },
                { name: 'Seeking Shuriken', cost: 350, description: 'Shurikens are faster and sharper.', effects: { projectile: { speed: 1200, pierce: 5 } } },
            ]
        ]
    },
    bomb_shooter: { 
        id: 'bomb_shooter', name: 'Bomb Shooter', cost: 420, range: 160, fireRate: 0.6, projectile: PROJECTILE_TYPES.bomb, size: 30, 
        visual: BombShooterVisual,
        shop: { portrait: BombShooterVisual, description: "Lobs bombs that explode on impact." },
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
        id: 'sniper_monkey', name: 'Sniper Monkey', cost: 350, range: 9999, fireRate: 0.5, projectile: PROJECTILE_TYPES.sniper_bullet, size: 25,
        visual: SniperMonkeyVisual,
        shop: { portrait: SniperMonkeyVisual, description: "Shoots single, powerful darts at long range." },
        upgrades: [
            [
                { name: 'Full Metal Jacket', cost: 250, description: 'Shots can pop Lead and do more damage.', effects: { projectile: { damage: 10 } } },
                { name: 'Large Calibre', cost: 500, description: 'Shots do massive damage.', effects: { projectile: { damage: 25 } } },
            ],
            [
                { name: 'Fast Firing', cost: 300, description: 'Increases attack speed.', effects: { fireRate: 0.8 } },
                { name: 'Semi-Automatic', cost: 600, description: 'Fires very rapidly.', effects: { fireRate: 1.5 } },
            ]
        ]
    },
    ice_monkey: {
        id: 'ice_monkey', name: 'Ice Monkey', cost: 450, range: 120, fireRate: 0.8, projectile: PROJECTILE_TYPES.ice_shard, size: 30,
        visual: IceMonkeyVisual,
        shop: { portrait: IceMonkeyVisual, description: "Freezes nearby bloons, stopping them in their tracks." },
        upgrades: [
            [
                { name: 'Larger Radius', cost: 200, description: 'Increases freeze area.', effects: { range: 140, projectile: { aoeRange: 60 } } },
                { name: 'Ice Shards', cost: 350, description: 'Frozen bloons pop when thawed.', effects: { projectile: { damage: 1 } } },
            ],
            [
                { name: 'Permafrost', cost: 300, description: 'Slows bloons permanently.', effects: { projectile: { slow: { factor: 0.7, duration: 3000 } } } },
                { name: 'Deep Freeze', cost: 400, description: 'Can freeze more layers of bloons.', effects: { /* Aesthetic/Conceptual */ } },
            ]
        ]
    },
    glue_gunner: {
        id: 'glue_gunner', name: 'Glue Gunner', cost: 220, range: 160, fireRate: 0.7, projectile: PROJECTILE_TYPES.glue, size: 25,
        visual: GlueGunnerVisual,
        shop: { portrait: GlueGunnerVisual, description: "Shoots glue that slows down bloons." },
        upgrades: [
            [
                { name: 'Glue Splatter', cost: 300, description: 'Glue hits multiple bloons.', effects: { projectile: { aoeRange: 20, pierce: 6 } } },
                { name: 'Corrosive Glue', cost: 400, description: 'Glue dissolves bloons over time.', effects: { projectile: { damage: 1 } } },
            ],
            [
                { name: 'Stickier Glue', cost: 250, description: 'Slows bloons down even more.', effects: { projectile: { slow: { factor: 0.1, duration: 5000 } } } },
                { name: 'Glue Hose', cost: 420, description: 'Shoots glue much faster.', effects: { fireRate: 1.4 } },
            ]
        ]
    },
    alchemist: {
        id: 'alchemist', name: 'Alchemist', cost: 500, range: 150, fireRate: 0.8, projectile: PROJECTILE_TYPES.acid_potion, size: 25,
        visual: AlchemistVisual,
        shop: { portrait: AlchemistVisual, description: "Throws acid potions that can melt Lead." },
        upgrades: [
            [
                { name: 'Larger Potions', cost: 300, description: 'Increases splash radius.', effects: { projectile: { aoeRange: 60 } } },
                { name: 'Acidic Mixture Dip', cost: 500, description: 'Acid is more potent.', effects: { projectile: { damage: 2, pierce: 3 } } },
            ],
            [
                { name: 'Faster Throwing', cost: 350, description: 'Throws potions faster.', effects: { fireRate: 1.2 } },
                { name: 'Unstable Concoction', cost: 600, description: 'Potions are more damaging.', effects: { projectile: { damage: 3 } } },
            ]
        ]
    },
    druid: {
        id: 'druid', name: 'Druid', cost: 400, range: 170, fireRate: 0.6, projectile: PROJECTILE_TYPES.thorn, size: 25,
        visual: DruidMonkeyVisual,
        shop: { portrait: DruidMonkeyVisual, description: "Summons thorn patches on the track." },
        upgrades: [
            [
                { name: 'Heart of Vengeance', cost: 250, description: 'Attacks faster as lives are lost.', effects: { /* Handled in code */ } },
                { name: 'Druid of the Jungle', cost: 450, description: 'Thorns last longer.', effects: { projectile: { duration: 8000 } } },
            ],
            [
                { name: 'Hard Thorns', cost: 300, description: 'Thorns can pop more bloons.', effects: { projectile: { pierce: 10 } } },
                { name: 'Heart of Thunder', cost: 600, description: 'Summons lightning strikes.', effects: { /* Handled in code */ } },
            ]
        ]
    },
    super_monkey: { 
        id: 'super_monkey', name: 'Super Monkey', cost: 1800, range: 200, fireRate: 5, projectile: PROJECTILE_TYPES.plasma, size: 30, 
        visual: SuperMonkeyVisual,
        shop: { portrait: SuperMonkeyVisual, description: "Shoots plasma blasts at super speed." },
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
};

// BALLOONS
export const BALLOON_TYPES: Record<string, BalloonType> = {
    red: { id: 'red', health: 1, speed: 75, money: 3, color: '#ef4444', size: 15, visual: RedBalloonVisual },
    blue: { id: 'blue', health: 1, speed: 90, money: 3, color: '#3b82f6', size: 16, children: ['red'], visual: BlueBalloonVisual },
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

// MAPS
const meadowPath: Vector2D[] = [ { x: -50, y: 150 }, { x: 150, y: 150 }, { x: 150, y: 400 }, { x: 400, y: 400 }, { x: 400, y: 100 }, { x: 650, y: 100 }, { x: 650, y: 500 }, { x: 900, y: 500 }, { x: 900, y: 250 }, { x: 1150, y: 250 }, { x: 1150, y: 650 }, { x: 1250, y: 650 }];
const candyPath: Vector2D[] = [ { x: -50, y: 400 }, { x: 150, y: 400 }, { x: 250, y: 300 }, { x: 150, y: 200 }, { x: 250, y: 100 }, { x: 450, y: 100 }, { x: 550, y: 200 }, { x: 450, y: 300 }, { x: 550, y: 400 }, { x: 450, y: 500 }, { x: 550, y: 600 }, { x: 750, y: 600 }, { x: 850, y: 500 }, { x: 750, y: 400 }, { x: 850, y: 300 }, { x: 1000, y: 300 }, { x: 1100, y: 400 }, { x: 1250, y: 400 }];
const volcanicPath: Vector2D[] = [ { x: 600, y: 850 }, { x: 600, y: 650 }, { x: 200, y: 650 }, { x: 200, y: 150 }, { x: 1000, y: 150 }, { x: 1000, y: 650 }, { x: 750, y: 650 }, { x: 750, y: 400 }, { x: 450, y: 400 }, { x: 450, y: 850 }];

const MeadowVisual = () => React.createElement("svg", { width: "1200", height: "800", viewBox: "0 0 1200 800", className: "absolute top-0 left-0 pointer-events-none" }, React.createElement("defs", null, React.createElement("filter", { id: "shadow" }, React.createElement("feDropShadow", { dx: "2", dy: "4", stdDeviation: "3", floodColor: "#000000", floodOpacity: "0.3" })), React.createElement("radialGradient", { id: "grassGrad", cx: "50%", cy: "50%", r: "70%" }, React.createElement("stop", { offset: "0%", stopColor: "#84cc16" }), React.createElement("stop", { offset: "100%", stopColor: "#4d7c0f" }))), React.createElement("rect", { width: "1200", height: "800", fill: "url(#grassGrad)" }), React.createElement("path", { d: meadowPath.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#a17b54", strokeWidth: "44", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }), React.createElement("path", { d: meadowPath.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#7a5c3e", strokeWidth: "38", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "1 15" }), React.createElement("path", { d: "M 950 50 C 850 100, 850 200, 950 250 C 1050 200, 1050 100, 950 50 Z", fill: "#38bdf8", stroke: "#0ea5e9", strokeWidth: "4" }), React.createElement("path", { d: "M 50 500 C -50 550, -50 650, 50 700 C 150 650, 150 550, 50 500 Z", fill: "#38bdf8", stroke: "#0ea5e9", strokeWidth: "4" }), React.createElement("circle", { cx: "970", cy: "70", r: "10", fill: "white" }), React.createElement("circle", { cx: "1000", cy: "90", r: "15", fill: "white" }), React.createElement("circle", { cx: "940", cy: "100", r: "20", fill: "white" }), React.createElement("g", { filter: "url(#shadow)" }, React.createElement("path", { d: "M100 250 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0", fill: "#22c55e" }), React.createElement("path", { d: "M120 280 L130 350 L110 350 Z", fill: "#8c5a2b" }), React.createElement("path", { d: "M1100 150 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0", fill: "#16a34a" }), React.createElement("path", { d: "M1120 180 L1130 240 L1110 240 Z", fill: "#8c5a2b" }), React.createElement("path", { d: "M700 700 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0", fill: "#22c55e" }), React.createElement("path", { d: "M720 730 L740 820 L700 820 Z", fill: "#8c5a2b" })));
const CandyVisual = () => React.createElement("svg", { width: "1200", height: "800", viewBox: "0 0 1200 800", className: "absolute top-0 left-0 pointer-events-none" }, React.createElement("defs", null, React.createElement("radialGradient", { id: "candyGrad", cx: "50%", cy: "50%", r: "70%" }, React.createElement("stop", { offset: "0%", stopColor: "#fbcfe8" }), React.createElement("stop", { offset: "100%", stopColor: "#f472b6" })), React.createElement("pattern", { id: "sprinkles", patternUnits: "userSpaceOnUse", width: "50", height: "50" }, React.createElement("circle", { cx: "10", cy: "10", r: "3", fill: "#3b82f6" }), React.createElement("rect", { x: "20", y: "30", width: "10", height: "4", fill: "#22c55e", transform: "rotate(45 25 32)" }), React.createElement("circle", { cx: "40", cy: "40", r: "2", fill: "#facc15" }))), React.createElement("rect", { width: "1200", height: "800", fill: "url(#candyGrad)" }), React.createElement("rect", { width: "1200", height: "800", fill: "url(#sprinkles)", opacity: "0.5" }), React.createElement("path", { d: "M0,700 C 300,650 900,750 1200,700 L 1200,800 L 0,800 Z", fill: "#7c3a2e" }), React.createElement("path", { d: candyPath.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#d97706", strokeWidth: "44", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }), React.createElement("path", { d: candyPath.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#f59e0b", strokeWidth: "38", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "10 10" }), React.createElement("g", null, React.createElement("circle", { cx: "100", cy: "100", r: "30", fill: "#ef4444" }), React.createElement("circle", { cx: "100", cy: "100", r: "15", fill: "white" }), React.createElement("path", { d: "M100 130 L 100 200", stroke: "#fef3c7", strokeWidth: "10" }), React.createElement("circle", { cx: "300", cy: "600", r: "40", fill: "#3b82f6" }), React.createElement("path", { d: "M300 640 L 300 750", stroke: "#fef3c7", strokeWidth: "10" }), React.createElement("circle", { cx: "900", cy: "150", r: "50", fill: "#facc15" }), React.createElement("circle", { cx: "900", cy: "150", r: "25", fill: "#f87171" }), React.createElement("path", { d: "M900 200 L 900 300", stroke: "#fef3c7", strokeWidth: "10" })));
const VolcanicVisual = () => React.createElement("svg", { width: "1200", height: "800", viewBox: "0 0 1200 800", className: "absolute top-0 left-0 pointer-events-none" }, React.createElement("defs", null, React.createElement("radialGradient", { id: "volcanicGrad", cx: "50%", cy: "50%", r: "70%" }, React.createElement("stop", { offset: "0%", stopColor: "#262626" }), React.createElement("stop", { offset: "100%", stopColor: "#0a0a0a" }))), React.createElement("rect", { width: "1200", height: "800", fill: "url(#volcanicGrad)" }), React.createElement("path", { d: volcanicPath.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#171717", strokeWidth: "46", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }), React.createElement("path", { d: volcanicPath.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#404040", strokeWidth: "40", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }), React.createElement("ellipse", { cx: "300", cy: "500", rx: "200", ry: "100", fill: "#dc2626", filter: "url(#glow)" }), React.createElement("ellipse", { cx: "900", cy: "500", rx: "250", ry: "120", fill: "#dc2626", filter: "url(#glow)" }), React.createElement("ellipse", { cx: "600", cy: "250", rx: "300", ry: "80", fill: "#dc2626", filter: "url(#glow)" }), React.createElement("g", null, React.createElement("path", { d: "M50 50 L 100 100 L 70 120 Z", fill: "#a16207" }), React.createElement("path", { d: "M1100 700 L 1150 750 L 1120 770 Z", fill: "#a16207" }), React.createElement("path", { d: "M1150 50 L 1180 80 L 1140 90 Z", fill: "#f59e0b", filter: "url(#glow)" }), React.createElement("path", { d: "M80 750 L 120 780 L 90 790 Z", fill: "#f59e0b", filter: "url(#glow)" })), React.createElement("filter", { id: "glow" }, React.createElement("feGaussianBlur", { stdDeviation: "10", result: "coloredBlur" }), React.createElement("feMerge", null, React.createElement("feMergeNode", { in: "coloredBlur" }), React.createElement("feMergeNode", { in: "SourceGraphic" }))));

export const MAPS: Record<MapId, MapData> = {
    green_meadow: {
        id: 'green_meadow',
        name: 'Green Meadow',
        path: meadowPath,
        visual: React.createElement(MeadowVisual),
        thumbnail: React.createElement("svg", { viewBox: "0 0 120 80" }, React.createElement("rect", { width: "120", height: "80", fill: "#65a30d" }), React.createElement("path", { d: meadowPath.map(p => ({ x: p.x / 10, y: p.y / 10 })).map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#a17b54", strokeWidth: "4", fill: "none" }), React.createElement("circle", { cx: "10", cy: "60", r: "10", fill: "#38bdf8" }))
    },
    candy_canyon: {
        id: 'candy_canyon',
        name: 'Candy Canyon',
        path: candyPath,
        visual: React.createElement(CandyVisual),
        thumbnail: React.createElement("svg", { viewBox: "0 0 120 80" }, React.createElement("rect", { width: "120", height: "80", fill: "#f472b6" }), React.createElement("path", { d: "M0,70 L 30,65 L 90,75 L 120,70", stroke: "#7c3a2e", strokeWidth: "10", fill: "none" }), React.createElement("path", { d: candyPath.map(p => ({ x: p.x / 10, y: p.y / 10 })).map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#f59e0b", strokeWidth: "4", fill: "none" }), React.createElement("circle", { cx: "10", cy: "10", r: "5", fill: "#ef4444" }), React.createElement("path", { d: "M10 15 L 10 25", stroke: "white", strokeWidth: "2" }))
    },
    volcanic_pass: {
        id: 'volcanic_pass',
        name: 'Volcanic Pass',
        path: volcanicPath,
        visual: React.createElement(VolcanicVisual),
        thumbnail: React.createElement("svg", { viewBox: "0 0 120 80" }, React.createElement("rect", { width: "120", height: "80", fill: "#171717" }), React.createElement("path", { d: volcanicPath.map(p => ({ x: p.x / 10, y: p.y / 10 })).map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '), stroke: "#525252", strokeWidth: "4", fill: "none" }), React.createElement("circle", { cx: "60", cy: "25", r: "20", fill: "#dc2626" }), React.createElement("circle", { cx: "30", cy: "50", r: "15", fill: "#dc2626" })),
        unplaceableAreas: [
            { x: 100, y: 400, width: 400, height: 200 }, // lava pool 1
            { x: 650, y: 380, width: 500, height: 240 }, // lava pool 2
            { x: 300, y: 170, width: 600, height: 160 }, // lava pool 3
        ]
    }
};


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
