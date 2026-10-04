import { SourceData } from './source.interface.js';

export interface Movie {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  officialSite: string | null;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  summary: string | null;
  season: number;
}

export interface MovieSearchResult {
  score: number;
  show: Movie;
}

export interface MovieEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  runtime: number;
  image: { medium: string; original: string } | null;
  summary: string | null;

  // number: number | null;
  type: string;
  airtime: string;
  airstamp: string;
  // runtime: number | null;
  rating: { average: number | null };

  sources: SourceData[];
}
