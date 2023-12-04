import { Module, forwardRef } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { GameModule } from '../game/game.module';
import { CellModule } from '../cell/cell.module';

@Module({
  imports: [forwardRef(() => GameModule), CellModule],
  providers: [BoardService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
