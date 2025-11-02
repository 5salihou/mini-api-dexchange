import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configure le préfixe global avant Swagger
  app.setGlobalPrefix('api');

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('mini-api-dexchange')
    .setDescription('une mini-API de gestion de transferts sécurisée')
    .setVersion('0.1')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .addSecurityRequirements('x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Change le chemin de Swagger à /docs

  // Configuration de CORS
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Content-Type, x-api-key, Access-Control-Allow-Origin, x-access-token, Accept',
    ],
    methods: 'POST,GET,PUT,PATCH,DELETE',
    // credentials: true,
  });

  app.useGlobalGuards(new ApiKeyGuard(configService));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(
    `MINI-API-DEXCHANGE IS RUNNING ON PORT ${port}: ${await app.getUrl()}`,
  );
}
bootstrap();
