import { Module } from '@nestjs/common';
import { YoutubeApiService } from './youtube-api.service';
import { YoutubeApiController } from './youtube-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [YoutubeApiController],
  providers: [YoutubeApiService],
})
export class YoutubeApiModule {}
