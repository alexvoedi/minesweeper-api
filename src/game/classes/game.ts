import { randomUUID } from 'crypto';
import { Board } from './board';
import { Xy } from '../types/xy';
import { CellState } from '../enums/cell-state';
import { GameState } from '../enums/game-state';
import { NotEnoughAdjacentCellsWithFlagError } from '../erros/not-enough-adjacent-cells-with-flag.error';
import { SerializedGame } from '../types/serialized-game';
import { Time } from '../types/time';
import { GameDifficulty } from '../enums/game-difficulty';
import { GameSettings } from '../enums/game-settings';

const BoardSettingPresets = {
  [GameDifficulty.BEGINNER]: {
    cols: 10,
    rows: 10,
    mines: 10,
  },
  [GameDifficulty.INTERMEDIATE]: {
    cols: 16,
    rows: 16,
    mines: 40,
  },
  [GameDifficulty.EXPERT]: {
    cols: 30,
    rows: 16,
    mines: 99,
  },
};

export class Game {
  private readonly id: string;
  private readonly board: Board;

  private state: GameState;
  private time: Time;

  constructor(private readonly gameSettings: GameSettings) {
    const boardConfig = this.getBoardConfigFromGameSettings(gameSettings);

    this.id = randomUUID();
    this.board = new Board(boardConfig);
    this.time = {};
    this.state = GameState.WAITING;
  }

  private getBoardConfigFromGameSettings(gameSettings: GameSettings) {
    if (gameSettings.difficulty === GameDifficulty.CUSTOM) {
      return gameSettings;
    } else {
      return BoardSettingPresets[gameSettings.difficulty];
    }
  }

  isRanked() {
    return [
      GameDifficulty.BEGINNER,
      GameDifficulty.INTERMEDIATE,
      GameDifficulty.EXPERT,
    ].includes(this.gameSettings.difficulty);
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

  getTime() {
    if (!this.time.start || !this.time.end) {
      throw new Error('Time is not initialized');
    }

    return this.time.end - this.time.start;
  }

  getStartTime() {
    return this.time.start;
  }

  getEndTime() {
    return this.time.end;
  }

  getState() {
    return this.state;
  }

  isWin() {
    return this.state === GameState.WIN;
  }

  isOver() {
    return this.state === GameState.WIN || this.state === GameState.LOSE;
  }

  getDifficulty() {
    return this.gameSettings.difficulty;
  }

  updateState() {
    const closedCells = this.board.getClosedCells();
    const openedCells = this.board.getOpenedCells();

    const mineOpened = openedCells.some((cell) => cell.isMine());

    const settings = this.board.getSettings();

    if (mineOpened) {
      this.time.end = Date.now();
      this.state = GameState.LOSE;
    } else if (closedCells.length === settings.mines) {
      this.time.end = Date.now();
      this.state = GameState.WIN;
    } else if (openedCells.length === 0) {
      this.state = GameState.WAITING;
    } else {
      if (this.state === GameState.WAITING) {
        this.time.start = Date.now();
      }

      this.state = GameState.PLAYING;
    }
  }

  openCell([x, y]: Xy) {
    const xyArr = this.board.openCellRecursively([x, y], []);

    const cells = this.board.getCells(xyArr);

    const serializedCells = cells.map((cell) => ({
      ...cell.serialize(),
      adjacentMines: this.board.countAdjacentMines([cell.x, cell.y]),
    }));

    this.updateState();

    return {
      cells: serializedCells,
    };
  }

  openAdjacentCells([x, y]: Xy) {
    const cell = this.board.getCell([x, y]);

    const isOpened = cell.isOpened();

    if (!isOpened) {
      throw new Error('Can not open adjacent cells of closed cells');
    }

    const adjacentFlags = this.board.countAdjacentFlags([x, y]);
    const adjacentMines = this.board.countAdjacentMines([x, y]);

    if (adjacentFlags !== adjacentMines) {
      throw new NotEnoughAdjacentCellsWithFlagError();
    }

    const adjacentCells = this.board.getAdjacentCells([x, y]);

    const xyArr = adjacentCells.reduce((openedXyArr, { x, y }) => {
      return this.board.openCellRecursively([x, y], openedXyArr);
    }, []);

    const cells = this.board.getCells(xyArr);

    const serializedCells = cells.map((cell) => ({
      ...cell.serialize(),
      adjacentMines: this.board.countAdjacentMines([cell.x, cell.y]),
    }));

    this.updateState();

    return {
      cells: serializedCells,
    };
  }

  private handleLose() {
    const serializedBoard = this.board.serialize({
      withMines: true,
    });

    return {
      cells: serializedBoard.cells,
    };
  }

  private handleWin() {
    this.time.end = Date.now();

    const serializedBoard = this.board.serialize({
      withMines: true,
    });

    return {
      cells: serializedBoard.cells,
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

  serialize() {
    const { id, state, time } = this;

    const serializedGame: SerializedGame = {
      id,
      state,
      time,
    };

    if (state === GameState.LOSE || state === GameState.WIN) {
      const { cells } = this.board.serialize({ withMines: true });

      Object.assign(serializedGame, { cells });
    }

    return serializedGame;
  }
}
