import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { errorResponses } from 'src/errors/error-response.index';

export function setupSwagger(app: INestApplication): void {
  // cấu hình swagger
  const config = new DocumentBuilder()
    .setTitle('Melody Box API')
    .setDescription('API Documentation for Melody Box')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // tạo tài liệu cho swagger
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: errorResponses,
  });

  // cài đặt swagger module
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
