import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = parseInt(process.env.PORT || '9091', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`GraphQL Playground: http://localhost:${port}/graphql`);
  } else {
    await app.init();
  }

  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Database: ${process.env.DB_HOST || 'localhost'}`);

  return app;
}

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  bootstrap().catch((err) => {
    logger.error('Failed to start application', err);
    process.exit(1);
  });
}

export default bootstrap();
