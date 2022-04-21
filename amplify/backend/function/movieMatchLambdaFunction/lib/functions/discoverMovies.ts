import {
  CreateMovieInput,
  CreateMovieMutation,
  CreateMovieMutationVariables,
  DiscoverMoviesInput,
  Genre,
  Movie,
  MovieApiOutput,
  QueryMovieList
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { API_KEY, API_URL, getMovieByIdentifier } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { createMovie } from "../lib/graphql/mutations";

export interface EventInterface extends EventIdentity {
  arguments?: {
    input?: DiscoverMoviesInput;
  };
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

export interface MovieGenreApi {
  genres: MovieGenre[];
}

export interface MovieGenre {
  id: number;
  name: string;
}

const URL_PARAMS: { [k in keyof DiscoverMoviesInput]: string } = {
  genres: "with_genres",
  region: "region",
  includeAdult: "include_adult",
  page: "page",
  releasedAfterYear: "primary_release_date.gte",
};

let apiGenres: MovieGenreApi | undefined;

export default async function (
  event: EventInterface
): Promise<Omit<QueryMovieList, "__typename">> {
  const input = event.arguments?.input;

  let urlParams: string | undefined;

  if (input) {
    urlParams = await createUrlParams(input);
  }

  console.debug(`URL Params for movie discovery: "${urlParams}"`);

  const discoverUrl = `${API_URL}/discover/movie?api_key=${API_KEY}${
    urlParams ? `&${urlParams}` : ""
  }`;

  console.debug(`URL Request: ${discoverUrl}`);

  // Get the movies
  const movies = (await (await fetch(discoverUrl)).json()) as DiscoverMovieApi;

  if (typeof movies.success !== "undefined" && !movies.success) {
    throw new Error(
      `Failed to discover movies: ${JSON.stringify(movies, null, 2)}`
    );
  }

  console.debug(`Movies found: ${JSON.stringify(movies, null, 2)}`);

  // Add them to the database
  const movieEntries = await addMoviesToDb(movies);

  return { items: movieEntries };
}

async function addMoviesToDb(discoveredMovies: DiscoverMovieApi) {
  const genreFetch = await getGenreIds();

  const genreObj = genreFetch.genres.reduce<{ [key: number]: MovieGenre }>(
    (r, genre) => {
      r[genre.id] = genre;
      return r;
    },
    {}
  );

  const newMovies = (discoveredMovies.results || []).map<CreateMovieInput>(
    (movie) => {
      let movieGenres: Genre[] = [];

      for (let genreId of movie.genre_ids) {
        const genreName = genreObj[genreId]?.name;

        if (genreName && (Genre as any)[genreName]) {
          movieGenres.push((Genre as any)[genreName]);
        }
      }

      return {
        identifier: movie.id,
        genres: movieGenres,
        description: movie.overview,
        name: movie.title,
        rating: movie.vote_average,
        ratingCount: movie.vote_count,
        ...(movie.release_date && {
          releaseYear: new Date(movie.release_date).getFullYear(),
        }),
        ...(movie.poster_path && { coverUri: movie.poster_path }),
      };
    }
  );

  let promises: Promise<Movie>[] = [];

  for (let movie of newMovies) {
    // TODO: Do this in one API call
    promises.push(
      new Promise<Movie>(async (resolve) => {
        const movieObj = await getMovieByIdentifier(movie.identifier);

        // If the movie doesn't exist then add it
        if (!movieObj?.id) {
          console.debug(
            `Movie not found so creating movie entry now for: ${movie.name}, Idenfifier: ${movie.identifier}`
          );

          const creation = await callGraphQl<
            CreateMovieMutation,
            CreateMovieMutationVariables
          >(
            { createMovie },
            {
              input: movie,
            }
          );

          if (!creation.data?.createMovie) {
            throw new Error(
              `Failed to create movie for identifier: ${movie.identifier}`
            );
          }

          return resolve(creation.data.createMovie);
        } else {
          return resolve(movieObj);
        }
      })
    );
  }

  const dbMovies = await Promise.all(promises).catch((e) => {});

  if (!dbMovies) {
    throw new Error("Failed to create all movies in database");
  }

  return dbMovies;
}

async function getGenreIds() {
  if (!apiGenres) {
    apiGenres = (await (
      await fetch(`${API_URL}/genre/movie/list?api_key=${API_KEY}`)
    ).json()) as MovieGenreApi;
  }

  return apiGenres;
}

export async function createUrlParams(searchOptions: DiscoverMoviesInput) {
  let urlParams = "";

  let searchOption: keyof typeof searchOptions;
  for (searchOption in searchOptions) {
    const searchValue = searchOptions[searchOption];

    if (searchValue == null) {
      continue;
    }

    if (searchOption !== "genres") {
      urlParams += `${URL_PARAMS[searchOption]}=${searchValue}&`;
    } else {
      if (searchValue && Array.isArray(searchValue) && searchValue.length > 0) {
        urlParams += `${URL_PARAMS[searchOption]}=`;

        const genres = (await getGenreIds()).genres.reduce<{
          [key: string]: MovieGenre;
        }>((r, genre) => {
          r[genre.name] = genre;
          return r;
        }, {});

        urlParams += searchValue.reduce<string>((r, genreName) => {
          if (genreName && genres[genreName.toString()]) {
            r += `${genres[genreName.toString()].id},`;
          }

          return r;
        }, "");

        urlParams = urlParams.replace(/,$/, "") + "&";
      }
    }
  }

  if (
    !Object.keys(searchOptions).includes("includeAdult") ||
    searchOptions["includeAdult"] == null
  ) {
    // By default, don't include adult movies
    urlParams += `${URL_PARAMS["includeAdult"]}=false`;
  }

  urlParams = urlParams.replace(/&$/, "");

  return urlParams;
}
