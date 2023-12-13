import { GameDifficulty } from '../../game/enums/game-difficulty';

export type Score = {
  id: string;
  time: number;
  difficulty: GameDifficulty;
  date: Date;
};
