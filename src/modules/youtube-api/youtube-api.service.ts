import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class YoutubeApiService {
  constructor(private readonly httpService: HttpService) {}
}
