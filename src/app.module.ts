import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { HealthModule } from './health/health.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RankingModule } from './ranking/ranking.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    HealthModule,
    GameModule,
    RankingModule,
  ],
})
export class AppModule {}
