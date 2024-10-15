import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        retryAttempts: 10,
        retryDelay: 5000,
        connectionFactory: (db) => {
          const logger = new Logger('DATABASE');

          if (db.readyState === 1) {
            logger.verbose(
              `Connect to database ${configService.get<string>('DATABASE_URL')} success!`,
            );
          } else {
            logger.warn(`Initial connection state: ${db.readyState}`);
          }

          db.on('error', (error) => {
            logger.error(`Connect to database failed - error ${error.message}`);
          });
          db.on('disconnected', () => {
            logger.error('Database connection lost.');
          });

          return db;
        },
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
