import { Controller } from '@nestjs/common';
import { YoutubeApiService } from './youtube-api.service';

@Controller('youtube-api')
export class YoutubeApiController {
  constructor(private readonly youtubeApiService: YoutubeApiService) {}
}
