import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database-config/config/database.config';
import appConfig from './config/app-config/app.config';
import { DatabaseModule } from './config/database-config/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import authConfig from './config/auth-config/auth.config';
import { SessionModule } from './session/session.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig,authConfig],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    SessionModule,
    TerminusModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
