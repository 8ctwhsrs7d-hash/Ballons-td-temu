
import type React from 'react';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Upgrade {
    name: string;
    cost: number;
    description: string;
    effects: Partial<Omit<TowerType, 'upgrades' | 'visual' | 'id' | 'name' | 'cost' | 'projectile'>> & {
        projectile?: Partial<ProjectileType>;
    };
}

export type UpgradePath = Upgrade[];

export interface TowerType {
  id: string;
  name:string;
  cost: number;
  range: number;
  fireRate: number; // shots per second
  projectile: ProjectileType;
  size: number; // radius for placement
  visual: React.ReactNode;
  shop: {
      portrait: React.ReactNode;
      description: string;
  }
  upgrades: [UpgradePath, UpgradePath];
}

export interface ProjectileType {
    id: string;
    speed: number;
    damage: number;
    visual: React.ReactNode;
    aoeRange?: number;
    slow?: { factor: number; duration: number };
    pierce?: number;
    canPopLead?: boolean;
    isStationary?: boolean;
    duration?: number;
}

export interface BalloonType {
  id: string;
  health: number;
  speed: number; 
  money: number;
  color: string;
  size: number;
  children?: string[]; 
  immuneToExplosions?: boolean;
  immuneToFreeze?: boolean;
  isLead?: boolean;
  isBlimp?: boolean;
  visual?: React.ReactNode;
}

export interface TowerInstance {
  id: string;
  typeId: string;
  position: Vector2D;
  targetId?: string;
  lastShotTime: number;
  angle: number;
  upgrades: {
    path1: number;
    path2: number;
  }
}

export interface BalloonInstance {
  id: string;
  typeId: string;
  pathProgress: number; 
  health: number;
  position: Vector2D;
  effects: {
    slow?: { factor: number; until: number };
  };
}

export interface ProjectileInstance {
  id: string;
  typeId: string;
  position: Vector2D;
  angle: number;
  distanceTraveled: number;
  pierceLeft: number;
  hitBalloonIds: string[];
  createdAt: number;
}

export interface PopAnimationInstance {
    id: string;
    position: Vector2D;
    createdAt: number;
}

export interface CashPopInstance {
    id: string;
    position: Vector2D;
    amount: number;
    createdAt: number;
}

export interface ExplosionInstance {
    id:string;
    position: Vector2D;
    radius: number;
    createdAt: number;
}

export interface MuzzleFlashInstance {
    id: string;
    position: Vector2D;
    createdAt: number;
    angle: number;
}

export type GameStatus = 'start_screen' | 'playing' | 'game_over';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'ultra nightmare';
export type GameMode = 'fixed' | 'infinity';

export type Wave = {
    balloonTypeId: string;
    count: number;
    spawnDelay: number; // ms between each balloon
}[];

export type MapId = 'green_meadow' | 'candy_canyon' | 'volcanic_pass';

export interface UnplaceableArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MapData {
    id: MapId;
    name: string;
    path: Vector2D[];
    visual: React.ReactNode;
    thumbnail: React.ReactNode;
    unplaceableAreas?: UnplaceableArea[];
}
