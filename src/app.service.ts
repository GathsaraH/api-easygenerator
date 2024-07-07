import { Injectable } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class AppService {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}
  
  healthCheck() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
