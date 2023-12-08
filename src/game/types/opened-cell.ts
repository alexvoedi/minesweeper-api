import { CellState } from '../enums/cell-state';

export type OpenedCell = {
  x: number;
  y: number;
  state: CellState;
  adjacentMines: number;
};
