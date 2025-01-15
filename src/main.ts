import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppEnvironment, getAppConfig } from './configs/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // // @ts-expect-error third-party library types mismatch
  // await app.register(fastifyMultipart, {
  //   attachFieldsToBody: true,
  //   limits: {
  //     fieldNameSize: 100,
  //     fieldSize: 100,
  //     fields: 10,
  //     fileSize: 10 * 1024 * 1024,
  //     files: 10,
  //     headerPairs: 2000,
  //     parts: 1000,
  //   },
  // });

  const appConfig = getAppConfig();

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
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

  await app.listen(appConfig.port, '0.0.0.0', () => {
    logger.debug(`Service available on port ${appConfig.port}`);
  });
}

bootstrap();
