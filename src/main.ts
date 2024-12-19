import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppEnvironment, getAppConfig } from './configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const appConfig = getAppConfig();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  app.useGlobalInterceptors();
  app.enableShutdownHooks();

  if (appConfig.environment !== AppEnvironment.Production) {
    const documentConfig = new DocumentBuilder()
      .setTitle('Mobi-Craft')
      .setDescription('Documentation of mobi-craft backend API')
      .addBearerAuth()
      .setVersion('1.0')
      .build();

    const options = {
      customCss:
        '.swagger-ui section.models, .response-control-media-type { display: none; }',
    };

    SwaggerModule.setup(
      'docs',
      app,
      SwaggerModule.createDocument(app, documentConfig),
      options,
    );
  }
}

bootstrap();
