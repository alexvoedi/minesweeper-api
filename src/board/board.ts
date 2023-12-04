import { Cell } from '../cell/cell';

export type BoardSettings = {
  rows: number;
  cols: number;
  mines: number;
};

export class Board {
  private cells: Cell[][];
  private revealedCellCount: number;

  constructor(private readonly boardSettings: BoardSettings) {
    this.createCells();
  }

  private createCells() {
    this.cells = [];

    for (let x = 0; x < this.boardSettings.rows; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.boardSettings.cols; y++) {
        this.cells[x][y] = new Cell(x, y);
      }
    }
  }

  getSurroundingCells(x: number, y: number): Cell[] {
    const neighborCells: Cell[] = [];

    for (let i = x - 1; i <= x + 1; i++) {
      if (this.cells[i]) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (this.cells[i][j]) {
            neighborCells.push(this.cells[i][j]);
          }
        }
      }
    }

    return neighborCells;
  }

  getSettings(): BoardSettings {
    return this.boardSettings;
  }

  private placeMines() {
    let minesPlaced = 0;

    while (minesPlaced < this.boardSettings.mines) {
      const x = Math.floor(Math.random() * this.boardSettings.cols);
      const y = Math.floor(Math.random() * this.boardSettings.rows);

      const cell = this.cells[x][y];

      if (!cell.hasMine() && !cell.isRevealed()) {
        cell.setMine(true);

        minesPlaced++;
      }
    }
  }

  revealCell(x: number, y: number) {
    const cell = this.cells[x][y];

    cell.setRevealed(true);

    this.revealedCellCount++;

    if (this.revealedCellCount === 1) {
      this.placeMines();
    }
  }
}
