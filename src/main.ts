import { NestFactory } from '@nestjs/core';
import { GameModule } from './game/game.module';

async function bootstrap() {
  const app = await NestFactory.create(GameModule);

  app.enableCors();

  await app.listen(3000);
}

bootstrap();
