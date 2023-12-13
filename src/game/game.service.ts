import { Injectable, Logger } from '@nestjs/common';
import { Game } from './classes/game';
import { Id } from './types/Id';
import { GameNotFoundError } from './erros/game-not-found.error';
import { Xy } from './types/xy';
import { xyToString } from './helpers/xy-to-string';
import { CreateGameDto } from './dtos/create-game.dto';
import { GameDifficulty } from './enums/game-difficulty';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from '../event/enum/event';
import { GameState } from './enums/game-state';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  private games: Map<Id, Game>;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.games = new Map();
  }

  createGame(dto: CreateGameDto) {
    let game: Game;

    if (dto.difficulty === GameDifficulty.CUSTOM) {
      game = new Game(dto);

      const id = game.getId();

      this.games.set(id, game);

      this.logger.log(
        `Created game with ID ${id} (${dto.rows}x${dto.cols} with ${dto.mines} mines)`,
      );
    } else {
      game = new Game(dto);

      const id = game.getId();

      this.games.set(id, game);

      this.logger.log(
        `Created game with ID ${id} with preset ${dto.difficulty}`,
      );
    }

    return game.serialize();
  }

  deleteGame(id: Id) {
    this.games.delete(id);

    this.logger.log(`Deleted game with ID ${id}.`);
  }

  getGame(id: Id) {
    const game = this.games.get(id);

    if (!game) {
      throw new GameNotFoundError(id);
    }

    return game;
  }

  getSerializedGame(id: Id) {
    const game = this.getGame(id);

    return game.serialize();
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

    this.logger.log(`Opened cell ${xyToString([x, y])} in game ${id}.`);

    const result = game.openCell([x, y]);

    if (game.isRanked() && game.isWin()) {
      this.emitScore(game);
    }

    return result;
  }

  openAdjacentCells(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    this.logger.log(
      `Opened adjacent cells of ${xyToString([x, y])} in game ${id}.`,
    );

    const result = game.openAdjacentCells([x, y]);

    if (game.isRanked() && game.isWin()) {
      this.emitScore(game);
    }

    return result;
  }

  flagCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    this.logger.log(`Flagged cell ${xyToString([x, y])} in game ${id}.`);

    return game.flagCell([x, y]);
  }

  markCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    this.logger.log(`Marked cell ${xyToString([x, y])} in game ${id}.`);

    return game.markCell([x, y]);
  }

  clearCell(id: Id, [x, y]: Xy) {
    const game = this.getGame(id);

    this.logger.log(`Cleared cell ${xyToString([x, y])} in game ${id}.`);

    return game.clearCell([x, y]);
  }

  deleteGameIfOver(id: Id) {
    const game = this.getGame(id);
    const state = game.getState();

    if (state === GameState.WIN || state === GameState.LOSE) {
      this.deleteGame(id);
    }
  }

  @Cron('0 * * * * *')
  private cleanUpGames() {
    this.logger.log('Cleaning up games...');

    const now = Date.now();

    this.games.forEach((game, id) => {
      const isOver = game.isOver();

      const startTime = game.getStartTime();

      const diff = now - startTime;

      const maxAge = 5 * 60 * 1000; // 5 minutes

      if (isOver && diff > maxAge) {
        this.deleteGame(id);
      }
    });

    this.logger.log('Done cleaning up games.');
  }

  emitScore(game: Game) {
    const date = new Date();

    this.eventEmitter.emit(Event.NEW_SCORE, {
      id: game.getId(),
      time: game.getTime(),
      difficulty: game.getDifficulty(),
      date,
    });
  }
}
