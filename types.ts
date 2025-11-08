
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
}

export interface PopAnimationInstance {
    id: string;
    position: Vector2D;
    createdAt: number;
}

export interface ExplosionInstance {
    id:string;
    position: Vector2D;
    radius: number;
    createdAt: number;
}

export type GameStatus = 'start_screen' | 'playing' | 'game_over';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'fixed' | 'infinity';

export type Wave = {
    balloonTypeId: string;
    count: number;
    spawnDelay: number; // ms between each balloon
}[];
