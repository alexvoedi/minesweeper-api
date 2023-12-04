import { Module, forwardRef } from '@nestjs/common';
import { CellService } from './cell.service';
import { CellController } from './cell.controller';
import { GameModule } from '../game/game.module';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [CellService],
  controllers: [CellController],
  exports: [CellService],
})
export class CellModule {}
