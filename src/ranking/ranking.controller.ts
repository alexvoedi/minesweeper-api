import { Controller, Get } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { GameDifficulty } from '../game/enums/game-difficulty';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  getRankings() {
    return {
      [GameDifficulty.BEGINNER]: this.rankingService.getRankingsByDifficulty(
        GameDifficulty.BEGINNER,
      ),
      [GameDifficulty.INTERMEDIATE]:
        this.rankingService.getRankingsByDifficulty(
          GameDifficulty.INTERMEDIATE,
        ),
      [GameDifficulty.EXPERT]: this.rankingService.getRankingsByDifficulty(
        GameDifficulty.EXPERT,
      ),
    };
  }
}
