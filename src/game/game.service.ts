import { Injectable } from '@nestjs/common';
import { Game } from './game';

@Injectable()
export class GameService {
  private games: Game[];

  constructor() {
    this.games = [];
  }

  createGame() {
    const game = new Game({
      rows: 10,
      cols: 10,
      mines: 10,
    });

    this.games.push(game);

    return {
      id: game.getId(),
      rows: game.board.getSettings(),
    };
  }
}
