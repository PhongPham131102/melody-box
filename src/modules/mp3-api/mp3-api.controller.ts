import { Controller } from '@nestjs/common';
import { Mp3ApiService } from './mp3-api.service';

@Controller('mp3-api')
export class Mp3ApiController {
  constructor(private readonly mp3ApiService: Mp3ApiService) {}
}
