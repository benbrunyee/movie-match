export interface MovieBase {
  id: string;
  identifier: number;
  createdAt: Date;
  name: string;
  coverUri?: string;
  rating?: number;
  ratingCount?: number;
  description: string;
  genres: string[];
  trailerUri?: string;
  releaseYear?: number;
  updatedAt: Date;
  owner?: string;
}

export type CreateMovieInput = Partial<Pick<MovieBase, "id">> &
  Omit<MovieBase, "id">;

export interface MovieReaction {
  movieId: string;
  owner: string;
  reaction: "LIKE" | "DISLIKE"
}

export interface DiscoverSearchOptions {
  page?: number;
  region?: string;
  includeAdult?: boolean;
  releasedAfterYear?: number;
  genres?: string[];
}

export enum Region {
  US = "US",
  GB = "GB",
  DE = "DE",
  CN = "CN",
  JP = "JP",
  FR = "FR",
  IN = "IN",
  PL = "PL",
}

export enum Genre {
  Action = "Action",
  Adventure = "Adventure",
  Animation = "Animation",
  Comedy = "Comedy",
  Crime = "Crime",
  Documentary = "Documentary",
  Drama = "Drama",
  Family = "Family",
  Fantasy = "Fantasy",
  History = "History",
  Horror = "Horror",
  Music = "Music",
  Mystery = "Mystery",
  Romance = "Romance",
  Fiction = "Fiction",
  Movie = "Movie",
  Thriller = "Thriller",
  War = "War",
  Western = "Western",
}

export interface DiscoverMovieApi {
  page?: number;
  results?: MovieApiOutput[];
  total_results?: number;
  total_pages?: number;
  success?: boolean;
  status_message?: string;
  status_code?: number;
}

export interface MovieApiOutput {
  id: number;
  poster_path?: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path?: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}