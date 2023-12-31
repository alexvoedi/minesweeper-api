import { GameDifficulty } from '../enums/game-difficulty';

export type CreateGameDto =
  | {
      difficulty:
        | GameDifficulty.BEGINNER
        | GameDifficulty.INTERMEDIATE
        | GameDifficulty.EXPERT;
    }
  | {
      difficulty: GameDifficulty.CUSTOM;
      readonly rows: number;
      readonly cols: number;
      readonly mines: number;
    };
