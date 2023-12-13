import { Settings } from '../classes/board';
import { SerializedCell } from './serialized-cell';

export type SerializedBoard = {
  cells: SerializedCell[];
  settings: Settings;
};
