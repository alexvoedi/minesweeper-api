import { GameDifficulty } from './game-difficulty';

export type GameSettings =
  | {
      difficulty:
        | GameDifficulty.BEGINNER
        | GameDifficulty.INTERMEDIATE
        | GameDifficulty.EXPERT;
    }
  | {
      difficulty: GameDifficulty.CUSTOM;
      cols: number;
      rows: number;
      mines: number;
    };
