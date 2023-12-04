import { randomUUID } from 'crypto';
import { Board, BoardSettings } from '../board/board';

export class Game {
  private readonly id: string;

  readonly board: Board;

  constructor(boardSettings: BoardSettings) {
    this.board = new Board(boardSettings);
    this.id = randomUUID();
  }

  getId(): string {
    return this.id;
  }
}
