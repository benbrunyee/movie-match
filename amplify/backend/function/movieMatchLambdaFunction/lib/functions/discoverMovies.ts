import {
  CreateMovieInput,
  CreateMovieMutation,
  CreateMovieMutationVariables,
  Movie,
  MovieApiOutput
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { API_KEY, API_URL, getMovieByIdentifier } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { createMovie } from "../lib/graphql/mutations";

export interface EventInterface extends EventIdentity {
  arguments?: {
    input?: {
      page?: number;
    };
  };
}

export interface DiscoverMovieApi {
  page: number;
  results: MovieApiOutput[];
  total_results: number;
  total_pages: number;
}

export default async function (event: EventInterface) {
  let page: number = event.arguments?.input?.page || 0;

  // Get the movies
  const movies = (await (
    await fetch(
      `${API_URL}/discover/movie?api_key=${API_KEY}${
        page > 0 ? `&page=${page}` : ""
      }`
    )
  ).json()) as DiscoverMovieApi;

  console.debug(`Movies found: ${JSON.stringify(movies, null, 2)}`);

  // Add them to the database
  const movieEntries = await addMoviesToDb(movies);

  return { items: movieEntries };
}

async function addMoviesToDb(discoveredMovies: DiscoverMovieApi) {
  const newMovies = discoveredMovies.results.map<CreateMovieInput>((movie) => ({
    identifier: movie.id,
    categories: movie.genre_ids.map((id) => id.toString()),
    description: movie.overview,
    name: movie.title,
    rating: movie.vote_average,
    ratingCount: movie.vote_count,
    ...(movie.poster_path && { coverUri: movie.poster_path }),
  }));

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
