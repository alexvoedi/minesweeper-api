import { BoardSettings } from '../classes/board';
import { SerializedCell } from './serialized-cell';

export type SerializedBoard = {
  cells: SerializedCell[];
  settings: BoardSettings;
};
