import { Logger, Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { ErrorInterceptor } from './interceptors/handleError.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      retryAttempts: 10, // thử kết nối 10 lần nếu thất bại
      retryDelay: 5000, //chờ 5s trước khi thử kết nối lại
      connectionFactory: (db) => {
        const logger = new Logger('DATABASE');
        db.on('connected', () => {
          logger.verbose(
            `Kết nối cơ sở dữ liệu ${process.env.DATABASE_URL} thành công`,
          );
        });
        db.on('error', (error) => {
          logger.error(`Kết nối cơ sở dữ liệu thất bại: ${error.message}`);
        });
        db._events.connected();
        return db;
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
