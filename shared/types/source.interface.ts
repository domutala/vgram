export const SourceMediaType = {
  MOVIE: 'movie',
  EPISODE: 'episode',
} as const;
export type SourceMediaType =
  (typeof SourceMediaType)[keyof typeof SourceMediaType];

export const SourceType = {
  STREAMING: 'streaming',
  RENT: 'rent',
  BUY: 'buy',
  FREE: 'free',
  ADS: 'ads',
  DOWNLOAD: 'download',
  TORRENT: 'torrent',
  EMBED: 'embed',
} as const;
export type SourceType = (typeof SourceType)[keyof typeof SourceType];

export interface SourceData {
  id: string;
  databaseId: number;
  mediaType: SourceMediaType;
  tvId: number | null;
  seasonNumber: number | null;
  episodeNumber: number | null;
  type: SourceType;
  url: string;
  provider: string;
  providerId: number | null;
  country: string | null;
  language: string | null;
  subtitles: string[];
  quality: string | null;
  price: string | null;
  currency: string | null;
  isActive: boolean;
}
