import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Bootstrap');
let app;

async function createApp() {
  app = await NestFactory.create(AppModule);

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

  await app.init();

  logger.log(`Application initialized successfully`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Database: ${process.env.DB_HOST || 'localhost'}`);

  return app;
}

async function startLocalServer() {
  const port = parseInt(process.env.PORT || '9091', 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`GraphQL Playground: http://localhost:${port}/graphql`);
}

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  createApp()
    .then(() => startLocalServer())
    .catch((err) => {
      logger.error('Failed to start application', err);
      process.exit(1);
    });
}

// Para Vercel/Producción - exportar la app inicializada
export default createApp();
