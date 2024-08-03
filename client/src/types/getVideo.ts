export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface VideoId {
  kind: string;
  videoId: string;
}

export interface VideoResource {
  kind: string;
  etag: string;
  id: VideoId;
  snippet: VideoSnippet;
}

export interface YouTubeVideoListResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: PageInfo;
  items: VideoResource[];
}
