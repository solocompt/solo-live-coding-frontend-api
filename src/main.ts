import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // REST API Documentation (Swagger)
  const config = new DocumentBuilder()
    .setTitle('Solo Live Coding API')
    .setDescription('The REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  app.use(
    '/docs/rest',
    apiReference({
      spec: {
        content: document,
      },
    } as any),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
