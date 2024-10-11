import { Module } from '@nestjs/common';
import { Mp3ApiService } from './mp3-api.service';
import { Mp3ApiController } from './mp3-api.controller';

@Module({
  controllers: [Mp3ApiController],
  providers: [Mp3ApiService],
})
export class Mp3ApiModule {}
