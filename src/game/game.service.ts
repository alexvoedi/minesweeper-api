import { Injectable, Logger } from '@nestjs/common';
import { Game } from './classes/game';
import { Id } from './types/Id';
import { GameNotFoundError } from './erros/game-not-found.error';
import { Xy } from './types/xy';
import { BoardSettings } from './classes/board';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  private games: Map<Id, Game>;

  constructor() {
    this.games = new Map();
  }

  createGame(settings: BoardSettings) {
    const game = new Game(settings);

    const id = game.getId();
    this.games.set(id, game);

    this.logger.log(
      `Created game with ID ${id} (${settings.rows}x${settings.cols} with ${settings.mines} mines)`,
    );

    return {
      id,
      settings,
    };
  }

  getGame(id: Id) {
    const game = this.games.get(id);

    if (!game) {
      throw new GameNotFoundError(id);
    }

    return game;
  }

  getSerializedBoard(id: Id) {
    const game = this.getGame(id);

    return game.getSerializedBoard();
  }

  getSerializedCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    const board = game.getBoard();

    const cell = board.getSerializedCell([x, y]);

    return cell;
  }

  openCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    return game.openCell([x, y]);
  }

  flagCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    return game.flagCell([x, y]);
  }

  markCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    return game.markCell([x, y]);
  }

  clearCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    return game.clearCell([x, y]);
  }
}
