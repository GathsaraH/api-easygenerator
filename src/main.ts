import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger-config/swagger';
import validationOptions from './util/validation-options';

global['fetch'] = require('node-fetch');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(process.env.API_PREFIX, {
    exclude: ['/'],
  });

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const configService = app.get(ConfigService);
  //cors configuration
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    origin: '*',
  });
  // Setup Swagger
  setupSwagger(app);
  await app.listen(configService.get('app.port') || 5601, () => {
    console.log(`Server running at port: ${configService.get('app.port')}`);
  });
}
bootstrap();
