import { CellState } from '../enums/cell-state';
import { CellIsAlreadyOpenedError as IsAlreadyOpenedError } from '../erros/cell-is-already-opened.error';
import { xyToString } from '../helpers/xy-to-string';
import { SerializedCell } from '../types/serialized-cell';

export class Cell {
  private mine: boolean;
  private state: CellState;

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.mine = false;
    this.state = CellState.CLOSED;
  }

  setMine(mine: boolean) {
    this.mine = mine;
  }

  setState(state: CellState) {
    if (this.state === CellState.OPENED) {
      throw new IsAlreadyOpenedError();
    }

    this.state = state;
  }

  isMine(): boolean {
    return this.mine;
  }

  isFlagged(): boolean {
    return this.state === CellState.FLAGGED;
  }

  isMarked(): boolean {
    return this.state === CellState.MARKED;
  }

  isOpened(): boolean {
    return this.state === CellState.OPENED;
  }

  isClosed(): boolean {
    return this.state !== CellState.OPENED;
  }

  serialize({ withMine }: { withMine?: boolean } = {}): SerializedCell {
    const { x, y, state, mine } = this;

    const serializedCell = {
      state,
      x,
      y,
      mine: withMine ? mine : undefined,
    };

    return serializedCell;
  }

  toString(): string {
    return xyToString([this.x, this.y]);
  }
}
