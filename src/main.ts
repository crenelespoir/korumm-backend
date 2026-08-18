import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true});
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Korumm backend running on http://localhost:${port}`);
}
bootstrap();
