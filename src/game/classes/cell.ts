import { CellState } from '../enums/cell-state';
import { CellIsAlreadyOpenedError as IsAlreadyOpenedError } from '../erros/cell-is-already-opened.error';

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

  serialize({ withMine }: { withMine?: boolean } = {}) {
    const { x, y, state, mine } = this;

    const serializedCell = {
      state,
      x,
      y,
      mine: withMine ? mine : undefined,
    };

    return serializedCell;
  }
}
