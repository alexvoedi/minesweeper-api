import { Controller, Get } from '@nestjs/common';
import { Status } from '../game/enums/status';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: Status.SUCCESS,
    };
  }
}
