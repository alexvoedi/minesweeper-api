import { CellState } from '../enums/cell-state';
import { CellNotFoundError } from '../erros/cell-not-found.error';
import { OutOfBoundsError } from '../erros/out-of-bounds.error';
import { TooManyMinesError } from '../erros/too-many-mines.error';
import { xyToString } from '../helpers/xy-to-string';
import { SerializedBoard } from '../types/serialized-board';
import { SerializedCell } from '../types/serialized-cell';
import { Xy } from '../types/xy';
import { Cell } from './cell';

export type Settings = {
  rows: number;
  cols: number;
  mines: number;
};

export class Board {
  private cells: Map<string, Cell>;
  private openedCells: Cell[];
  private minesPlaced: boolean;

  constructor(readonly settings: Settings) {
    if (this.settings.mines >= this.settings.rows * this.settings.cols) {
      throw new TooManyMinesError();
    }

    this.minesPlaced = false;
    this.openedCells = [];

    this.createCells();
  }

  createCells(): void {
    this.cells = new Map();

    for (let x = 0; x < this.settings.cols; x++) {
      for (let y = 0; y < this.settings.rows; y++) {
        const cell = new Cell(x, y);

        this.cells.set(xyToString([x, y]), cell);
      }
    }
  }

  getSettings() {
    return this.settings;
  }

  isInBounds([x, y]: Xy) {
    return 0 <= x && x < this.settings.cols && 0 <= y && y < this.settings.rows;
  }

  checkWinCondition() {
    let closedCells = 0;

    for (const cell of this.cells.values()) {
      const isMine = cell.isMine();

      if (isMine) {
        closedCells++;
      }
    }

    return closedCells === this.settings.mines;
  }

  getCell([x, y]: Xy): Cell {
    const isInBounds = this.isInBounds([x, y]);

    if (!isInBounds) {
      throw new OutOfBoundsError({
        x,
        y,
        xMin: 0,
        xMax: this.settings.cols - 1,
        yMin: 0,
        yMax: this.settings.rows - 1,
      });
    }

    const cell = this.cells.get(xyToString([x, y]));

    if (!cell) {
      throw new CellNotFoundError([x, y]);
    }

    return cell;
  }

  getCells(xyArr: Xy[]): Cell[] {
    const cells = xyArr.map(([x, y]) => this.getCell([x, y]));
    return cells;
  }

  getSerializedCell([x, y]: Xy, options: { withMine?: boolean } = {}) {
    const cell = this.getCell([x, y]);
    const serializedCell = cell.serialize(options);
    return serializedCell;
  }

  getSerializedCells(xyArr: Xy[], options: { withMine?: boolean } = {}) {
    const cells = this.getCells(xyArr);
    const serializedCells = cells.map((cell) => cell.serialize(options));
    return serializedCells;
  }

  getAdjacentCells([x, y]: Xy): Cell[] {
    const adjacentCells: Cell[] = [];

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i === x && j === y) continue;

        const isInBounds = this.isInBounds([i, j]);

        if (!isInBounds) continue;

        const cell = this.getCell([i, j]);

        adjacentCells.push(cell);
      }
    }

    return adjacentCells;
  }

  getOpenedCells(): Cell[] {
    return this.openedCells;
  }

  getClosedCells(): Cell[] {
    const closedCells = Array.from(this.cells.values()).filter((cell) =>
      cell.isClosed(),
    );

    return closedCells;
  }

  getAdjacentCellsWithMine([x, y]: Xy): Cell[] {
    const adjacentCells = this.getAdjacentCells([x, y]);

    const adjacentCellsWithMine = adjacentCells.filter((cell) => cell.isMine());

    return adjacentCellsWithMine;
  }

  getAdjacentCellsWithFlag([x, y]: Xy): Cell[] {
    const adjacentCells = this.getAdjacentCells([x, y]);

    const adjacentCellsWithFlag = adjacentCells.filter((cell) =>
      cell.isFlagged(),
    );

    return adjacentCellsWithFlag;
  }

  countAdjacentMines([x, y]: Xy): number {
    const adjacentCellsWithMines = this.getAdjacentCellsWithMine([x, y]);

    return adjacentCellsWithMines.length;
  }

  countAdjacentFlags([x, y]: Xy): number {
    const adjacentCellsWithFlag = this.getAdjacentCellsWithFlag([x, y]);

    return adjacentCellsWithFlag.length;
  }

  hasAdjacentMines([x, y]: Xy): boolean {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i === x && j === y) continue;

        const cell = this.getCell([i, j]);

        const isMine = cell.isMine();

        if (isMine) {
          return true;
        }
      }
    }

    return false;
  }

  private placeMines(): void {
    let mines = 0;

    while (mines < this.settings.mines) {
      const x = Math.floor(Math.random() * this.settings.cols);
      const y = Math.floor(Math.random() * this.settings.rows);

      const cell = this.getCell([x, y]);

      const valid = !cell.isMine() && !cell.isOpened();

      if (valid) {
        cell.setMine(true);

        mines++;
      }
    }

    this.minesPlaced = true;
  }

  openCellRecursively([x, y]: Xy, openedXyArr?: Xy[]): Xy[] {
    const cell = this.getCell([x, y]);

    const isAlreadyOpen = cell.isOpened();

    if (isAlreadyOpen) {
      return openedXyArr;
    }

    const isFlagged = cell.isFlagged();

    if (isFlagged) {
      return openedXyArr;
    }

    cell.setState(CellState.OPENED);
    openedXyArr.push([cell.x, cell.y]);

    this.openedCells.push(cell);

    if (!this.minesPlaced) {
      this.placeMines();
    }

    const adjacentCellsWithMines = this.getAdjacentCellsWithMine([x, y]);

    if (adjacentCellsWithMines.length === 0) {
      const closedAdjacentCells = this.getAdjacentCells([x, y]).filter(
        (cell) => !cell.isOpened(),
      );

      closedAdjacentCells.forEach(({ x, y }) =>
        this.openCellRecursively([x, y], openedXyArr),
      );
    }

    return openedXyArr;
  }

  serialize({ withMines }: { withMines?: boolean } = {}): SerializedBoard {
    const serializedCells: SerializedCell[] = [];

    for (const cell of this.cells.values()) {
      const serializedCell = {
        ...cell.serialize({ withMine: withMines }),
        adjacentMines: this.countAdjacentMines([cell.x, cell.y]),
      };

      serializedCells.push(serializedCell);
    }

    return {
      cells: serializedCells,
      settings: this.settings,
    };
  }
}
