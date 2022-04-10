import {
  ConnectionRequestStatus,
  GetConnectionRequestQuery,
  GetConnectionRequestQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  ListMoviesQuery,
  ListMoviesQueryVariables,
  Movie,
  MovieByIdentifierQuery,
  MovieByIdentifierQueryVariables,
  UpdateConnectionRequestMutation,
  UpdateConnectionRequestMutationVariables
} from "./API";
import callGraphQl from "./appSync";
import { updateConnectionRequest } from "./graphql/mutations";
import {
  getConnectionRequest as getGraphConnectionRequest,
  getUser as getGraphUser,
  listMovies as listGraphMovies,
  movieByIdentifier
} from "./graphql/queries";

export const API_URL = "https://api.themoviedb.org/3";
export const API_KEY = "0dd0cb2ac703e890ab3573c95612498a";

export function removeDuplicates(arr: string[]) {
  return Array.from(new Set(arr));
}

export async function getMovieByIdentifier(identifier: number): Promise<Movie | void> {
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
    console.warn(`Could find movie by identifier: ${identifier}`)
    return;
  }

  return movie.data.movieByIdentifier.items[0];
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

  return await (
    await fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`)
  ).json();
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

  console.debug(`Successfully updated connection request to: ${status}`);

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
