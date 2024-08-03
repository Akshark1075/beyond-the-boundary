export interface GetRankings {
  rank: Rank[];
  appIndex: AppIndex;
}

export interface Rank {
  id: string;
  rank: string;
  name: string;
  country: string;
  rating: string;
  points: string;
  lastUpdatedOn: string;
  trend: string;
  faceImageId: string;
  difference?: number;
}

export interface AppIndex {
  seoTitle: string;
  webURL: string;
}
