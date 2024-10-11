export interface YoutubeVideoListResponse {
  kind: string;
  etag: string;
  items: VideoItem[];
  pageInfo: PageInfo;
}

export interface VideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: VideoSnippet;
  statistics: VideoStatistics;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: VideoThumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: LocalizedInfo;
  defaultAudioLanguage?: string;
  defaultLanguage?: string;
}

export interface VideoThumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface LocalizedInfo {
  title: string;
  description: string;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount?: string;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
