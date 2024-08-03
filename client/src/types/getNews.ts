export interface GetNews {
  storyList: StoryList[];
  lastUpdatedTime: string;
  appIndex: AppIndex;
}

export interface StoryList {
  story?: Story;
  ad?: Ad;
}

export interface Story {
  id: number;
  hline: string;
  intro: string;
  pubTime: string;
  source: string;
  storyType: string;
  imageId: number;
  seoHeadline: string;
  context: string;
  coverImage: CoverImage;
}

export interface CoverImage {
  id: string;
  caption: string;
  source: string;
}

export interface Ad {
  name: string;
  layout: string;
  position: number;
}

export interface AppIndex {
  seoTitle: string;
  webURL: string;
}
