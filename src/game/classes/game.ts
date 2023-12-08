import { randomUUID } from 'crypto';
import { Board, BoardSettings } from './board';
import { Xy } from '../types/xy';
import { CellState } from '../enums/cell-state';

export class Game {
  private readonly id: string;
  private readonly board: Board;
  private readonly startTime: number;

  private gameOver: boolean;

  private endTime?: number;

  constructor(boardSettings: BoardSettings) {
    this.id = randomUUID();
    this.board = new Board(boardSettings);
    this.startTime = Date.now();

    this.gameOver = false;
  }

  getId(): string {
    return this.id;
  }

  getBoard() {
    return this.board;
  }

  getSerializedBoard() {
    return this.board.serialize();
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  openCell([x, y]: Xy) {
    const cell = this.board.getCell([x, y]);

    const isMine = cell.isMine();

    if (isMine) {
      return this.handleGameOver();
    }

    const xyArr = this.board.openCellsRecursively([x, y], []);

    const cells = this.board.getCells(xyArr);

    const serializedCells = cells.map((cell) => ({
      ...cell.serialize(),
      adjacentMines: this.board.countAdjacentMines([cell.x, cell.y]),
    }));

    return {
      cells: serializedCells,
    };
  }

  private handleGameOver() {
    this.gameOver = true;

    return {
      gameOver: this.gameOver,
      board: this.board.serialize({
        withMines: true,
      }),
    };
  }

  flagCell([x, y]: Xy) {
    const cell = this.board.getCell([x, y]);

    cell.setState(CellState.FLAGGED);

    return {
      cells: [cell.serialize()],
    };
  }

  markCell([x, y]: Xy) {
    const cell = this.board.getCell([x, y]);

    cell.setState(CellState.MARKED);

    return {
      cells: [cell.serialize()],
    };
  }

  clearCell([x, y]: Xy) {
    const cell = this.board.getCell([x, y]);

    cell.setState(CellState.CLOSED);

    return {
      cells: [cell.serialize()],
    };
  }
}
