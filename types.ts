
export enum AppMode {
  CLASSIC = 'classic',
  GRAVITY = 'gravity',
  MIRROR = 'mirror',
  UNDERWATER = 'underwater',
  TERMINAL = 'terminal',
  ASKEW = 'askew',
  ZERG_RUSH = 'zerg_rush',
  THANOS = 'thanos',
  SPRING = 'spring',
  SNAKE = 'snake',
  BREAKOUT = 'breakout',
  BBS = 'bbs',
  PACMAN = 'pacman',
  DINO = 'dino',
  BARREL_ROLL = 'barrel_roll',
  MATRIX = 'matrix',
  BLACK_HOLE = 'black_hole',
  FAN = 'fan',
  HUB = 'hub',
  RETRO_1998 = 'retro_1998',
  ZIPPER = 'zipper',
  SPACE_INVADERS = 'space_invaders',
  BATMAN = 'batman',
  GUITAR = 'guitar',
  TETRIS = 'tetris',
  MARIO = 'mario',
  LET_IT_SNOW = 'let_it_snow',
  GAME_2048 = 'game_2048'
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface ZergUnit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
}
