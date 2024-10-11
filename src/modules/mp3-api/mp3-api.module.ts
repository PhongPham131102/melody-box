import { Module } from '@nestjs/common';
import { Mp3ApiService } from './mp3-api.service';
import { Mp3ApiController } from './mp3-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [Mp3ApiController],
  providers: [Mp3ApiService],
})
export class Mp3ApiModule {}
