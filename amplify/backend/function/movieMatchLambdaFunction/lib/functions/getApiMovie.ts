import { MovieApiOutput } from "../lib/API";
import { getApiMovie } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";

export interface EventInterface extends EventIdentity {
  arguments?: {
    input?: {
      id: number;
    };
  };
}

export default async function (event: EventInterface): Promise<Omit<MovieApiOutput, "__typename">> {
  const movieId = event.arguments?.input?.id;

  if (!movieId) {
    throw new Error("Please provide an ID for a movie to get");
  }

  return await getApiMovie(movieId);
}
