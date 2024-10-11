export interface ResponseSearchResultInterface {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: PageInfo;
  items: string[];
}
export interface YoutubeSearchRawResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: SearchResult[];
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface SearchResult {
  kind: string;
  etag: string;
  id: VideoId;
}

export interface VideoId {
  kind: string;
  videoId: string;
}
