/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ResponseSearchResultInterface,
  YoutubeSearchRawResponse,
} from 'src/interfaces/youtube/youtube-search.interface';
import { YoutubeVideoListResponse } from 'src/interfaces/youtube/youtube-video.interface';
@Injectable()
export class YoutubeApiService {
  private readonly URL: string;
  private readonly SECRET_KEY: string;

  constructor(private readonly httpService: HttpService) {
    this.URL = process.env.YOUTUBE_API_URL;
    this.SECRET_KEY = process.env.YOUTUBE_SECRET_KEY;
  }
  async onModuleInit() {
    // const response: ResponseSearchResultInterface =
    //   await this.getListIdVideoBySearch({ q: 'mtp' });
    // await this.getListVideoByListIdVideo({ ids: response.items });
  }
  async search(search: string) {}
  async getListIdVideoBySearch({
    type = 'video',
    part = 'id',
    maxResults = 50,
    q,
    pageToken = '',
  }: {
    type?: string;
    part?: string;
    maxResults?: number;
    q: string;
    pageToken?: string;
  }): Promise<ResponseSearchResultInterface | null> {
    try {
      const { data }: { data: YoutubeSearchRawResponse } = await firstValueFrom(
        this.httpService.get(
          `${this.URL}/search?type=${type}&part=${part}&maxResults=${maxResults}&q=${q}&key=${this.SECRET_KEY}&pageToken=${pageToken}`,
        ),
      );
      const items = data.items.map((item) => item.id.videoId);
      const response: ResponseSearchResultInterface = {
        pageInfo: data.pageInfo,
        items: items,
        ...(data.nextPageToken && { nextPageToken: data.nextPageToken }),
        ...(data.prevPageToken && { prevPageToken: data.prevPageToken }),
      };
      return response;
    } catch (error) {
      return null;
    }
  }
  async getListVideoByListIdVideo({
    part = ['snippet', 'statistics'],
    ids,
  }: {
    part?: string[];
    ids: string[];
  }) {
    const { data }: { data: YoutubeVideoListResponse } = await firstValueFrom(
      this.httpService.get(
        `${this.URL}/videos?part=${part.join('%2C')}&id=${ids.join('%2C')}&key=${this.SECRET_KEY}`,
      ),
    );
  }
}
