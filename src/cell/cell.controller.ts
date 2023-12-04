import { Body, Controller, Param, Post } from '@nestjs/common';
import { CellService } from './cell.service';
import { RevealCellDto } from './dtos/reveal-cell.dto';

@Controller('games/:id/boards/cells/')
export class CellController {
  constructor(private readonly cellService: CellService) {}

  @Post()
  revealCell(@Param('id') id: string, @Body() { action, x, y }: RevealCellDto) {
    return {
      id,
      action,
      x,
      y,
    };
  }
}
