import { CellAction } from '../enums/cell-action';

export class UpdateCellDto {
  readonly action: CellAction;
  readonly x: number;
  readonly y: number;
}
