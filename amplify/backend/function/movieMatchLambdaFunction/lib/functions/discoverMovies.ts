import {
  CreateMovieInput,
  CreateMovieMutation,
  CreateMovieMutationVariables,
  DiscoverMoviesInput,
  Genre,
  Movie,
  MovieApiOutput,
  MovieReaction,
  QueryMovieList
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { API_KEY, API_URL, getMovieByIdentifier, getUser } from "../lib/common";
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
    // TODO: Don't show movies that have not yet been released
    // TODO: Most movies being shown are not popular and some are YouTube videos
    urlParams = await createUrlParams(input);
  }

  console.debug(`URL Params for movie discovery: "${urlParams}"`);

  const discoverUrl = `${API_URL}/discover/movie?api_key=${API_KEY}${
    urlParams ? `&${urlParams}` : ""
  }`;

  console.debug(`URL Request: ${discoverUrl}`);

  // Get the movies
  // TODO: Don't return movies that the user has already reacted to
  const movies = await (event.identity.username
    ? getNewMovies(event.identity.username, discoverUrl, input || {})
    : ((await fetch(discoverUrl)).json() as Promise<DiscoverMovieApi>));

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

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getNewMovies(
  sub: string,
  initialUrl: string,
  searchOptions: DiscoverMoviesInput
): Promise<DiscoverMovieApi> {
  let validMovies = false;
  let movies: DiscoverMovieApi | undefined;
  let url = initialUrl;
  let attempt = 0;
  let maxPages: number | undefined = undefined;
  const triedPages: number[] = [];

  console.debug(
    "Attempting to find movies that the user has not already reacted to"
  );

  const user = await getUser(sub);

  while (!validMovies) {
    attempt += 1;

    if (attempt >= 50) {
      throw new Error("Tried 50 times to find new movies.");
    }

    if (typeof maxPages !=="undefined" && triedPages.length === maxPages) {
      // TODO: Return movies out of their selection
      throw new Error("Tried all available pages. Cannot find undiscovered movies");
    }

    // If not the first attempt, then alter the page for the API call
    if (attempt > 1) {
      console.debug("Using a random page for next api call");
      const page = generateRandomNumber(
        1,
        // Use the max page from the first loop API call
        // If that is undefined then we just get the 1st page as that will then set "maxPages"
        maxPages || 1
      );
      console.debug(`Page to be used for next API call: ${page}`);

      const newParams = await createUrlParams({
        ...searchOptions,
        page,
      });

      url = `${url.replace(/\?.*/, "")}?api_key=${API_KEY}${
        newParams ? `&${newParams}` : ""
      }`;

      triedPages.push(page);
    }

    console.debug(`Calling API, attempt number: ${attempt}`);
    console.debug(`Calling URL: ${url}`);
    movies = (await (await fetch(url)).json()) as DiscoverMovieApi;

    console.debug(`Output from Movie API: ${JSON.stringify(movies, null, 2)}`);

    if (movies.total_pages && typeof maxPages === "undefined") {
      maxPages = movies.total_pages;
    }

    if (typeof movies.success !== "undefined" && !movies.success) {
      throw new Error(
        `Failed to discover movies: ${JSON.stringify(movies, null, 2)}`
      );
    }

    const firstMovieIdentifier = movies?.results?.[0]?.id;

    if (!firstMovieIdentifier) {
      console.debug("Could not find first movie ID... Continuing");
      continue;
    }

    validMovies = !(await hasUserReacted(
      firstMovieIdentifier,
      (user.movieReactions?.items as MovieReaction[]) || []
    ));

    console.debug(
      `User ${validMovies ? "has not" : "has"} reacted to this set of movies.`
    );
  }

  console.debug("Found a set of movies that the user has not reacted to");

  if (!movies) {
    throw new Error(
      "Failed to find movies the user has not already reacted to"
    );
  }

  return movies;
}

async function hasUserReacted(
  identifier: number,
  movieReactions: MovieReaction[]
): Promise<boolean> {
  const movie = await getMovieByIdentifier(identifier);

  if (!movie) {
    // If the movie doesn't exist in our database then it hasn't been discovered
    // before by any user
    console.debug(
      `Movie identifier: ${identifier} not yet discovered in our database, the user would've inheritely not have reacted to this movie`
    );
    return false;
  }

  // TODO: This is not efficient as the user has more movie reactions
  // TODO: Add a secondary index to obtain movie reactions by movie identifier / ID
  if (
    movieReactions.find((reaction) => reaction.movie.identifier === identifier)
  ) {
    console.debug(
      `User has already reacted to movie with identifier: ${identifier}`
    );
    return true;
  }

  return false;
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
