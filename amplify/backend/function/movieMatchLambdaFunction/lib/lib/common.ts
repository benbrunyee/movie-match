import {
  ConnectionRequestStatus,
  GetConnectionRequestQuery,
  GetConnectionRequestQueryVariables,
  GetMovieQuery,
  GetMovieQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  ListMoviesQuery,
  ListMoviesQueryVariables,
  Movie,
  MovieApiOutput,
  MovieByIdentifierQuery,
  MovieByIdentifierQueryVariables,
  UpdateConnectionRequestMutation,
  UpdateConnectionRequestMutationVariables
} from "./API";
import callGraphQl from "./appSync";
import { updateConnectionRequest } from "./graphql/mutations";
import {
  getConnectionRequest as getGraphConnectionRequest,
  getMovie as getMovieApi,
  getUser as getGraphUser,
  listMovies as listGraphMovies,
  movieByIdentifier
} from "./graphql/queries";

export const API_URL = "https://api.themoviedb.org/3";
export const API_KEY = "0dd0cb2ac703e890ab3573c95612498a";

export function removeDuplicates(arr: number[]): number[];
export function removeDuplicates(arr: string[]): string[];
export function removeDuplicates(arr: string[] | number[]) {
  return Array.from(new Set<any>(arr));
}

export async function getMovieByIdentifier(
  identifier: number
): Promise<Movie | void> {
  const movie = await callGraphQl<
    MovieByIdentifierQuery,
    MovieByIdentifierQueryVariables
  >(
    { movieByIdentifier },
    {
      identifier,
    }
  );

  if (!movie.data?.movieByIdentifier?.items?.[0]) {
    console.warn(`Couldn't find movie by identifier: ${identifier}`);
    return;
  }

  return movie.data.movieByIdentifier.items[0];
}

export async function getMoviesByIdentifier(
  identifiers: number[]
) {
  const promises: Promise<Movie | void>[] = [];

  for (let identifier of identifiers) {
    promises.push(getMovieByIdentifier(identifier));
  }

  const result = (await Promise.all(promises)).reduce<Movie[]>((r, movie) => {
    if (movie) {
      r.push(movie);
    }

    return r;
  }, []);

  return result;
}

export async function listMovies(vars?: ListMoviesQueryVariables) {
  const movies = await (typeof vars !== "undefined"
    ? callGraphQl<ListMoviesQuery, ListMoviesQueryVariables>(
        { listGraphMovies },
        vars
      )
    : callGraphQl<ListMoviesQuery>({ listGraphMovies }));

  if (!movies.data?.listMovies?.items) {
    throw new Error("Failed to list movies");
  }

  return movies.data.listMovies.items;
}

export async function getApiMovie(id: number) {
  console.debug(`Attempting to get movie: ${id} from the movie api`);

  return (await (
    await fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`)
  ).json()) as MovieApiOutput;
}

export async function getMovie(id: string) {
  const movie = await callGraphQl<GetMovieQuery, GetMovieQueryVariables>(
    { getMovieApi },
    {
      id,
    }
  );

  if (!movie.data?.getMovie) {
    throw new Error(`Failed to get movie: ${id}`);
  }

  return movie.data.getMovie;
}

export async function getMovieByIds(ids: string[]) {
  const promises: Promise<Movie>[] = [];

  for (let id of ids) {
    promises.push(getMovie(id));
  }

  return await Promise.all(promises);
}

export async function getUser(id: string) {
  const request = await callGraphQl<GetUserQuery, GetUserQueryVariables>(
    { getGraphUser },
    {
      id,
    }
  );

  if (!request.data?.getUser) {
    throw new Error(`Couldn't find user database obj: ${id}`);
  }

  return request.data.getUser;
}

export async function acceptRequest(id: string) {
  const status = ConnectionRequestStatus.ACCEPTED;

  const res = await callGraphQl<
    UpdateConnectionRequestMutation,
    UpdateConnectionRequestMutationVariables
  >(
    { updateConnectionRequest },
    {
      input: {
        id,
        status,
      },
    }
  );

  return res;
}

export async function getConnectionRequest(id: string) {
  const request = await callGraphQl<
    GetConnectionRequestQuery,
    GetConnectionRequestQueryVariables
  >(
    { getConnectionRequest: getGraphConnectionRequest },
    {
      id,
    }
  );

  if (!request.data?.getConnectionRequest) {
    throw new Error(`Couldn't find connection request: ${id}`);
  }

  return request.data.getConnectionRequest;
}
