import { GameState } from '../enums/game-state';
import { SerializedCell } from './serialized-cell';
import { Time } from './time';

export type SerializedGame = {
  id: string;
  state: GameState;
  time: Time;
  cells?: SerializedCell[];
};
