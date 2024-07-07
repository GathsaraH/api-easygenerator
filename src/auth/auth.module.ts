import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema, AuthSchemaClass } from './schemas/auth.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthSchemaClass.name,
        schema: AuthSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
