import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service';

@Injectable()
export class CellService {
  constructor(private readonly gameService: GameService) {}

  revealCell(id: string, x: number, y: number) {
    return {
      id,
      x,
      y,
    };
  }
}
