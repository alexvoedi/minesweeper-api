import { CellState } from '../enums/cell-state';

export type SerializedCell = {
  x: number;
  y: number;
  state: CellState;
  mine?: boolean;
};
