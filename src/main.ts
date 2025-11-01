import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // L'ajout d'un préfixe pour les routes de l'API.

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(
    `MINI-API-DEXCHANGE IS RUNNING ON PORT ${port}: ${await app.getUrl()}`,
  );
}
bootstrap();
