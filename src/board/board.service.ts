import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { CellService } from '../cell/cell.service';

@Injectable()
export class BoardService {
  constructor(
    private readonly gameService: GameService,
    private readonly cellService: CellService,
  ) {}
}
