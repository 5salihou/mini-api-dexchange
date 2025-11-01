import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swaguer
  const config = new DocumentBuilder()
    .setTitle('mini-api-dexchange')
    .setDescription('une mini-API de gestion de transferts sécurisée')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api'); // L'ajout d'un préfixe pour les routes de l'API.

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(
    `MINI-API-DEXCHANGE IS RUNNING ON PORT ${port}: ${await app.getUrl()}`,
  );
}
bootstrap();
