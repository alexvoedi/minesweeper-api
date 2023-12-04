import { Controller, Put } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Put()
  createGame() {
    return this.gameService.createGame();
  }
}
