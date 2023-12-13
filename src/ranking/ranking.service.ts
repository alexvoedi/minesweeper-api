import { Injectable, Logger } from '@nestjs/common';
import { Score } from './types/score';
import { GameDifficulty } from '../game/enums/game-difficulty';
import { OnEvent } from '@nestjs/event-emitter';
import { Event } from '../event/enum/event';

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  rankings: Map<GameDifficulty, Score[]>;

  constructor() {
    this.rankings = new Map();

    this.rankings.set(GameDifficulty.BEGINNER, []);
    this.rankings.set(GameDifficulty.INTERMEDIATE, []);
    this.rankings.set(GameDifficulty.EXPERT, []);
  }

  @OnEvent(Event.NEW_SCORE)
  addScore(score: Score) {
    const rankings = this.rankings.get(score.difficulty);

    rankings.push(score);
    rankings.sort((a, b) => a.time - b.time);

    const rank = this.getRank(score.id, score.difficulty);

    this.logger.log(
      `Score (${score.time / 1000}s) added to ${score.difficulty} rankings on ${
        score.date
      }. The achieved rank is ${rank + 1}.`,
    );
  }

  getRankingsByDifficulty(difficulty: GameDifficulty) {
    return this.rankings.get(difficulty);
  }

  getRank(id: string, difficulty: GameDifficulty) {
    const rankings = this.rankings.get(difficulty);

    return rankings.findIndex((ranking) => ranking.id === id) + 1;
  }
}
