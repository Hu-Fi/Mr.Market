import * as fs from 'fs';
import * as crypto from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './modules/infrastructure/logger/logger.service';

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    console.log('JWT_SECRET is not set. Generating a new one...');
    const secret = crypto.randomBytes(32).toString('hex');
    process.env.JWT_SECRET = secret;

    const envFile = '.env';
    try {
      if (fs.existsSync(envFile)) {
        fs.appendFileSync(envFile, `\nJWT_SECRET=${secret}\n`);
      } else {
        fs.writeFileSync(envFile, `JWT_SECRET=${secret}\n`);
      }
      console.log(`JWT_SECRET saved to ${envFile}`);
    } catch (err) {
      console.error('Failed to write JWT_SECRET to .env file', err);
    }
  }
  const logger = new CustomLogger(AppModule.name);
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Global request logging
  app.use((req, _, next) => {
    logger.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Mixin Doc backend API')
    .setDescription('Mixin Doc backend to execute trades and strategies')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // Optional, but helps with proper documentation
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

try {
  bootstrap();
} catch (error) {
  console.error(error);
}
