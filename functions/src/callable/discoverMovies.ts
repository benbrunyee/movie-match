import axios from "axios";
import { https, logger } from "firebase-functions";
import { firestore } from "..";
import {
  CreateMovieInput,
  DiscoverSearchOptions,
  Genre,
  MovieBase
} from "../util/apiTypes";
import { MOVIE_API_KEY, MOVIE_API_URL } from "../util/common";

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

const URL_PARAMS: { [k in keyof DiscoverSearchOptions]: string } = {
  genres: "with_genres",
  region: "region",
  includeAdult: "include_adult",
  page: "page",
  releasedAfterYear: "primary_release_date.gte",
};

export default async (
  data: DiscoverSearchOptions,
  context: https.CallableContext
) => {
  const input = data;

  // ! TODO: Don't show movies that have not yet been released
  // ! TODO: Most movies being shown are not popular and some are YouTube videos
  const urlParams = await createUrlParams(input);

  logger.debug(`URL Params for movie discovery: "${urlParams}"`);

  const discoverUrl = `${MOVIE_API_URL}/discover/movie?api_key=${MOVIE_API_KEY}${
    urlParams ? `&${urlParams}` : ""
  }`;

  logger.debug(`URL Request: ${discoverUrl}`);

  // Get the movies
  const movies = await (context.auth?.uid
    ? getNewMovies(context.auth.uid, discoverUrl, input || {})
    : ((
        await axios.get(discoverUrl)
      ).data as Promise<DiscoverMovieApi>));

  if (typeof movies.success !== "undefined" && !movies.success) {
    throw new Error(
      `Failed to discover movies: ${JSON.stringify(movies, null, 2)}`
    );
  }

  logger.debug(`Movies found: ${JSON.stringify(movies, null, 2)}`);

  // Add them to the database
  const movieEntries = await addMoviesToDb(movies);

  return movieEntries;
};

/**
 * Generates a random number between 2 specified values
 * @param {number} min Minimum number
 * @param {number} max Maximum number
 * @return {number} Random number between min and max
 */
function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Gets movies from TMDB using the "discover" url.
 * @param {string} uid Unique ID of the user
 * @param {string} initialUrl A URL to query first
 * @param {DiscoverSearchOptions} searchOptions Search options as object for initialUrl
 * @return {Promise<DiscoverMovieApi>} Output from TMDB
 */
async function getNewMovies(
  uid: string,
  initialUrl: string,
  searchOptions: DiscoverSearchOptions
): Promise<DiscoverMovieApi> {
  let validMovies = false;
  let movies: DiscoverMovieApi | undefined;
  let url = initialUrl;
  let attempt = 0;
  let maxPages: number | undefined = undefined;
  const triedPages: number[] = [];

  logger.debug(
    "Attempting to find movies that the user has not already reacted to"
  );

  while (!validMovies) {
    attempt += 1;

    if (attempt >= 50) {
      throw new Error("Tried 50 times to find new movies.");
    }

    if (typeof maxPages !== "undefined" && triedPages.length === maxPages) {
      // ! TODO: Return movies out of their selection
      throw new Error(
        "Tried all available pages. Cannot find undiscovered movies"
      );
    }

    // If not the first attempt, then alter the page for the API call
    if (attempt > 1) {
      logger.debug("Using a random page for next api call");
      const page = generateRandomNumber(
        1,
        // Use the max page from the first loop API call
        // If that is undefined then we just get the 1st page as that will then set "maxPages"
        maxPages || 1
      );
      logger.debug(`Page to be used for next API call: ${page}`);

      const newParams = await createUrlParams({
        ...searchOptions,
        page,
      });

      url = `${url.replace(/\?.*/, "")}?api_key=${MOVIE_API_KEY}${
        newParams ? `&${newParams}` : ""
      }`;

      triedPages.push(page);
    }

    logger.debug(`Calling API, attempt number: ${attempt}`);
    logger.debug(`Calling URL: ${url}`);
    movies = (await (await axios.get(url)).data) as DiscoverMovieApi;

    logger.debug(`Output from Movie API: ${JSON.stringify(movies, null, 2)}`);

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
      logger.debug("Could not find first movie ID... Continuing");
      continue;
    }

    validMovies = !(await hasUserReacted(firstMovieIdentifier, uid));

    logger.debug(
      `User ${validMovies ? "has not" : "has"} reacted to this set of movies.`
    );
  }

  logger.debug("Found a set of movies that the user has not reacted to");

  if (!movies) {
    throw new Error(
      "Failed to find movies the user has not already reacted to"
    );
  }

  return movies;
}

/**
 * Determines if a user has reacted to a movie based on movie identifier
 * @param {number} identifier Movie identifier
 * @param {string} uid Unique ID of the user
 * @return {boolean} Whether the user has reacted or not
 */
async function hasUserReacted(
  identifier: number,
  uid: string
): Promise<boolean> {
  const movie = (
    await firestore
      .collection("movies")
      .where("identifier", "==", identifier)
      .get()
  ).docs?.[0]?.data();

  if (!movie) {
    // If the movie doesn't exist in our database then it hasn't been discovered
    // before by any user
    logger.debug(
      `Movie identifier: ${identifier} not yet discovered in our database, the user would've inheritely not have reacted to this movie`
    );
    return false;
  }

  if (
    (
      await firestore
        .collection("movieReactions")
        .where("owner", "==", uid)
        .where("movieId", "==", identifier)
        .get()
    ).docs.length > 0
  ) {
    logger.debug(
      `User has already reacted to movie with identifier: ${identifier}`
    );
    return true;
  }

  return false;
}

/**
 * Adds movies from TMDB to firestore
 * @param {DiscoverMovieApi} discoveredMovies Output from TMDB
 * @return {Promise<MovieBase[]>} Firestore docs for the movies specified
 */
async function addMoviesToDb(
  discoveredMovies: DiscoverMovieApi
): Promise<MovieBase[]> {
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
      const movieGenres: Genre[] = [];

      for (const genreId of movie.genre_ids) {
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
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(movie.release_date && {
          releaseYear: new Date(movie.release_date).getFullYear(),
        }),
        ...(movie.poster_path && { coverUri: movie.poster_path }),
      };
    }
  );

  const promises: Promise<MovieBase>[] = [];

  for (const movie of newMovies) {
    promises.push(
      new Promise<MovieBase>((resolve, reject) => {
        firestore
          .collection("movies")
          .add(movie)
          .then((ref) => {
            return resolve({
              ...movie,
              id: ref.id,
            });
          })
          .catch(reject);
      })
    );
  }

  const dbMovies = await Promise.all(promises).catch((e) => {
    logger.error(e);
  });

  if (!dbMovies) {
    throw new Error("Failed to create all movies in database");
  }

  return dbMovies;
}

/**
 * Calls TMDB for genres and their associated ID
 * @return {MovieGenreApi} Output from TMDB for genres
 */
async function getGenreIds() {
  return (await (
    await axios.get(
      `${MOVIE_API_URL}/genre/movie/list?api_key=${MOVIE_API_KEY}`
    )
  ).data) as MovieGenreApi;
}

/**
 * Creates URL params from search options provided
 * @param {DiscoverSearchOptions} searchOptions Search options to convert into URL params
 * @return {Promise<string>} URL query params
 */
export async function createUrlParams(
  searchOptions?: DiscoverSearchOptions
): Promise<string> {
  let urlParams = "";

  if (searchOptions) {
    let searchOption: keyof typeof searchOptions;
    for (searchOption in searchOptions) {
      if (Object.prototype.hasOwnProperty.call(searchOptions, searchOption)) {
        const searchValue = searchOptions[searchOption];

        if (!searchValue) {
          continue;
        }

        if (searchOption !== "genres") {
          urlParams += `${URL_PARAMS[searchOption]}=${searchValue}&`;
        } else {
          if (
            searchValue &&
            Array.isArray(searchValue) &&
            searchValue.length > 0
          ) {
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
    }
  }

  if (
    !searchOptions ||
    !Object.keys(searchOptions).includes("includeAdult") ||
    searchOptions["includeAdult"] == null
  ) {
    // By default, don't include adult movies
    urlParams += `${URL_PARAMS["includeAdult"]}=false`;
  }

  urlParams = urlParams.replace(/&$/, "");

  return urlParams;
}
