import {
  CreateMovieInput,
  CreateMovieMutation,
  CreateMovieMutationVariables,
  Movie,
  MovieApi
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
  results: MovieApi[];
  total_results: number;
  total_pages: number;
}

export default async function (event: EventInterface) {
  let page: number | undefined = event.arguments?.input?.page || 0;

  if (page < 1) {
    page = undefined;
  }

  // Get the movies
  const movies = (await (
    await fetch(
      `${API_URL}/discover/movie?api_key=${API_KEY}${
        page ? `&page=${page}` : ""
      }`
    )
  ).json()) as DiscoverMovieApi;

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
