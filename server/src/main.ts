import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './modules/logger/logger.service';

async function bootstrap() {
  const logger = new CustomLogger(AppModule.name);
  const app = await NestFactory.create(AppModule);
  // app.enableCors();

  // Global request logging
  app.use((req, _, next) => {
    logger.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Mixin Doc backend API')
    .setDescription('Mixin Doc backend to execute trades and strategies')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
