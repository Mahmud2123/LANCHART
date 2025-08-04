import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'Uploads'), { prefix: '/Uploads' });
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  // // Seed default rooms
  // const roomsService = app.get(RoomsService);
  // await roomsService.seedRooms();
  
  await app.listen(3001);
  console.log('LANChart Backend running on http://localhost:3001');
}
bootstrap();