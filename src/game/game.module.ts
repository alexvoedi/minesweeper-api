import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { CellModule } from '../cell/cell.module';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [BoardModule, CellModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
