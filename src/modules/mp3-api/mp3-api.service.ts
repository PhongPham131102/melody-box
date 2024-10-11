import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
@Injectable()
export class Mp3ApiService {
  private VERSION = '1.6.34';
  private URL = 'https://zingmp3.vn';
  private SECRET_KEY = '2aa2d1c561e809b267f3638c4a307aab';
  private API_KEY = '88265e23d4284f25963e6eedac8fbfa3';
  private CTIME = String(Math.floor(Date.now() / 1000));
  private getHash256(str: string) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  private getHmac512(str: string, key: string) {
    return crypto
      .createHmac('sha512', key)
      .update(Buffer.from(str, 'utf8'))
      .digest('hex');
  }

  private hashParam(path: string, id: string) {
    return this.getHmac512(
      path +
        this.getHash256(`ctime=${this.CTIME}id=${id}version=${this.VERSION}`),
      this.SECRET_KEY,
    );
  }
  private hashParamNoId(path: string) {
    return this.getHmac512(
      path + this.getHash256(`ctime=${this.CTIME}version=${this.VERSION}`),
      this.SECRET_KEY,
    );
  }
  private hashParamHome(path: string) {
    return this.getHmac512(
      path +
        this.getHash256(
          `count=30ctime=${this.CTIME}page=1version=${this.VERSION}`,
        ),
      this.SECRET_KEY,
    );
  }
  private hashCategoryMV(path: string, id: string, type: string) {
    return this.getHmac512(
      path +
        this.getHash256(
          `ctime=${this.CTIME}id=${id}type=${type}version=${this.VERSION}`,
        ),
      this.SECRET_KEY,
    );
  }
  private hashListMV(
    path: string,
    id: string,
    type: string,
    page: string,
    count: string,
  ) {
    return this.getHmac512(
      path +
        this.getHash256(
          `count=${count}ctime=${this.CTIME}id=${id}page=${page}type=${type}version=${this.VERSION}`,
        ),
      this.SECRET_KEY,
    );
  }

  private async getCookie(): Promise<string | undefined> {
    try {
      const response = await axios.get(this.URL);
      const cookies = response.headers['set-cookie'];
      if (cookies && cookies.length >= 1) {
        return cookies[1];
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching cookie:', error);
      throw error;
    }
  }
  private async requestZingMp3(path: string, params: object) {
    const client = axios.create({
      baseURL: this.URL,
    });

    client.interceptors.response.use((res) => res.data);

    const cookie = await this.getCookie();
    const response = await client.get(path, {
      headers: { Cookie: cookie },
      params: {
        ...params,
        ctime: this.CTIME,
        version: this.VERSION,
        apiKey: this.API_KEY,
      },
    });

    return response;
  }
  public async getSong(songId: string) {
    const sig = this.hashParam('/api/v2/song/get/streaming', songId);
    return this.requestZingMp3('/api/v2/song/get/streaming', {
      id: songId,
      sig,
    });
  }
  // getDetailPlaylist
  public async getDetailPlaylist(playlistId: string): Promise<any> {
    const sig = this.hashParam('/api/v2/page/get/playlist', playlistId);
    return this.requestZingMp3('/api/v2/page/get/playlist', {
      id: playlistId,
      sig,
    });
  }

  // getHome
  public async getHome(): Promise<any> {
    const sig = this.hashParamHome('/api/v2/page/get/home');
    return this.requestZingMp3('/api/v2/page/get/home', {
      page: 1,
      segmentId: '-1',
      count: '30',
      sig,
    });
  }

  // getTop100
  public async getTop100(): Promise<any> {
    const sig = this.hashParamNoId('/api/v2/page/get/top-100');
    return this.requestZingMp3('/api/v2/page/get/top-100', { sig });
  }

  // getChartHome
  public async getChartHome(): Promise<any> {
    const sig = this.hashParamNoId('/api/v2/page/get/chart-home');
    return this.requestZingMp3('/api/v2/page/get/chart-home', { sig });
  }

  // getNewReleaseChart
  public async getNewReleaseChart(): Promise<any> {
    const sig = this.hashParamNoId('/api/v2/page/get/newrelease-chart');
    return this.requestZingMp3('/api/v2/page/get/newrelease-chart', { sig });
  }

  // getInfoSong
  public async getInfoSong(songId: string): Promise<any> {
    const sig = this.hashParam('/api/v2/song/get/info', songId);
    return this.requestZingMp3('/api/v2/song/get/info', { id: songId, sig });
  }

  // getListArtistSong
  public async getListArtistSong(
    artistId: string,
    page: string,
    count: string,
  ): Promise<any> {
    const sig = this.hashListMV(
      '/api/v2/song/get/list',
      artistId,
      'artist',
      page,
      count,
    );
    return this.requestZingMp3('/api/v2/song/get/list', {
      id: artistId,
      type: 'artist',
      page,
      count,
      sort: 'new',
      sectionId: 'aSong',
      sig,
    });
  }

  // getArtist
  public async getArtist(name: string): Promise<any> {
    const sig = this.hashParamNoId('/api/v2/page/get/artist');
    return this.requestZingMp3('/api/v2/page/get/artist', { alias: name, sig });
  }

  // getLyric
  public async getLyric(songId: string): Promise<any> {
    const sig = this.hashParam('/api/v2/lyric/get/lyric', songId);
    return this.requestZingMp3('/api/v2/lyric/get/lyric', { id: songId, sig });
  }

  // search
  public async search(name: string): Promise<any> {
    const sig = this.hashParamNoId('/api/v2/search/multi');
    return this.requestZingMp3('/api/v2/search/multi', { q: name, sig });
  }

  // getListMV
  public async getListMV(
    id: string,
    page: string,
    count: string,
  ): Promise<any> {
    const sig = this.hashListMV(
      '/api/v2/video/get/list',
      id,
      'genre',
      page,
      count,
    );
    return this.requestZingMp3('/api/v2/video/get/list', {
      id,
      type: 'genre',
      page,
      count,
      sort: 'listen',
      sig,
    });
  }

  // getCategoryMV
  public async getCategoryMV(id: string): Promise<any> {
    const sig = this.hashCategoryMV('/api/v2/genre/get/info', id, 'video');
    return this.requestZingMp3('/api/v2/genre/get/info', {
      id,
      type: 'video',
      sig,
    });
  }

  // getVideo
  public async getVideo(videoId: string): Promise<any> {
    const sig = this.hashParam('/api/v2/page/get/video', videoId);
    return this.requestZingMp3('/api/v2/page/get/video', { id: videoId, sig });
  }
}
