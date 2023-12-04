import { CellAction } from '../enums/cell-action';

export class RevealCellDto {
  readonly action: CellAction;
  readonly x: number;
  readonly y: number;
}
