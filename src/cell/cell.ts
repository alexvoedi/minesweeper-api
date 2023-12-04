import { Board } from '../board/board';

export class Cell {
  private mine: boolean;
  private revealed: boolean;
  private flagged: boolean;
  private questionMarked: boolean;

  constructor(
    private readonly x: number,
    private readonly y: number,
  ) {
    this.mine = false;
    this.revealed = false;
    this.flagged = false;
    this.questionMarked = false;
  }

  setFlagged(flagged: boolean) {
    this.flagged = flagged;
  }

  setQuestionMarked(questionMarked: boolean) {
    this.questionMarked = questionMarked;
  }

  setMine(mine: boolean) {
    this.mine = mine;
  }

  setRevealed(revealed: boolean) {
    this.revealed = revealed;
  }

  hasMine(): boolean {
    return this.mine;
  }

  isFlagged(): boolean {
    return this.flagged;
  }

  isQuestionMarked(): boolean {
    return this.questionMarked;
  }

  isRevealed(): boolean {
    return this.revealed;
  }

  getSuddoundingMineCount(board: Board): number {
    const neighborCells = board.getSurroundingCells(this.x, this.y);

    return neighborCells.filter((cell) => cell.hasMine()).length;
  }
}
