import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { GameService } from './game.service';
import { UpdateCellDto } from './dtos/update-cell.dto';
import { CellAction } from './enums/cell-action';
import { CellIsAlreadyOpenedError } from './erros/cell-is-already-opened.error';
import { Id } from './types/Id';
import { GameNotFoundError } from './erros/game-not-found.error';
import { CreateGameDto } from './dtos/create-game.dto';
import { TooManyMinesError } from './erros/too-many-mines.error';
import { Status } from './enums/status';
import { TriedToOpenFlaggedCellError } from './erros/tried-to-open-flagged-cell.error';
import { TriedToChangeOpenedCellError } from './erros/tried-to-change-opened-cell.error';
import { GetCellDto } from './dtos/get-cell.dto';
import { NotEnoughAdjacentCellsWithFlagError } from './erros/not-enough-adjacent-cells-with-flag.error';

@Controller('games')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  @Put()
  createGame(@Body() dto: CreateGameDto) {
    try {
      return {
        status: Status.SUCCESS,
        data: this.gameService.createGame(dto),
      };
    } catch (error) {
      this.logger.error(error.message);
      switch (error.constructor) {
        case TooManyMinesError: {
          throw new BadRequestException(error.message);
        }
      }
    }
  }

  @Get(':id')
  getGame(@Param('id') id: Id) {
    try {
      return {
        status: Status.SUCCESS,
        data: this.gameService.getSerializedGame(id),
      };
    } catch (error) {
      this.logger.error(error.message);
      switch (error.constructor) {
        case GameNotFoundError: {
          throw new NotFoundException(error.message);
        }
      }
    }
  }

  @Delete(':id')
  deleteGame(@Param('id') id: Id) {
    try {
      this.gameService.deleteGame(id);

      return {
        status: Status.SUCCESS,
      };
    } catch (error) {
      this.logger.error(error.message);
      switch (error.constructor) {
        case GameNotFoundError: {
          throw new NotFoundException(error.message);
        }
      }
    }
  }

  @Get(':id/boards')
  getBoard(@Param('id') id: Id) {
    try {
      return {
        status: Status.SUCCESS,
        data: this.gameService.getSerializedBoard(id),
      };
    } catch (error) {
      this.logger.error(error.message);
      switch (error.constructor) {
        case GameNotFoundError: {
          throw new NotFoundException(error.message);
        }
      }
    }
  }

  @Post(':id/cells')
  getCell(@Param('id') id: Id, @Body() { x, y }: GetCellDto) {
    try {
      return {
        status: Status.SUCCESS,
        data: this.gameService.getSerializedCell(id, [x, y]),
      };
    } catch (error) {
      this.logger.error(error.message);
      switch (error.constructor) {
        case GameNotFoundError: {
          throw new NotFoundException(error.message);
        }
      }
    }
  }

  @Patch(':id/cells')
  updateCell(@Param('id') id: Id, @Body() { action, x, y }: UpdateCellDto) {
    try {
      switch (action) {
        case CellAction.OPEN: {
          return {
            status: Status.SUCCESS,
            data: this.gameService.openCell(id, [x, y]),
          };
        }
        case CellAction.FLAG: {
          return {
            status: Status.SUCCESS,
            data: this.gameService.flagCell(id, [x, y]),
          };
        }
        case CellAction.MARK: {
          return {
            status: Status.SUCCESS,
            data: this.gameService.markCell(id, [x, y]),
          };
        }
        case CellAction.CLEAR: {
          return {
            status: Status.SUCCESS,
            data: this.gameService.clearCell(id, [x, y]),
          };
        }
        case CellAction.OPEN_ADJACENT: {
          return {
            status: Status.SUCCESS,
            data: this.gameService.openAdjacentCells(id, [x, y]),
          };
        }
        default: {
          throw new BadRequestException(`Unknown cell action: ${action}`);
        }
      }
    } catch (error) {
      this.logger.error(error);
      switch (error.constructor) {
        case TriedToChangeOpenedCellError:
        case TriedToOpenFlaggedCellError:
        case NotEnoughAdjacentCellsWithFlagError:
        case CellIsAlreadyOpenedError: {
          throw new BadRequestException(error.message);
        }
        case GameNotFoundError: {
          throw new NotFoundException(error.message);
        }
        default: {
          throw new InternalServerErrorException(error.message);
        }
      }
    }
  }
}
