import { DiscoverMoviesInput } from "../lib/API";
import { API_KEY, API_URL } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { createUrlParams, DiscoverMovieApi } from "./discoverMovies";

export interface EventInterface extends EventIdentity {
  arguments?: {
    input?: DiscoverMoviesInput;
  };
}

export default async function (event: EventInterface) {
  const input = event.arguments?.input;

  let urlParams: string = "";

  if (input) {
    urlParams = await createUrlParams(input);
  }

  console.debug(`URL Params for determing page count: "${urlParams}"`);

  const discoverUrl = `${API_URL}/discover/movie?api_key=${API_KEY}${
    urlParams ? `&${urlParams}` : ""
  }`;

  console.debug(`URL Request: ${discoverUrl}`);

  // Make the request
  const movies = (await (await fetch(discoverUrl)).json()) as DiscoverMovieApi;

  if (typeof movies.success !== "undefined" && !movies.success || !movies.total_pages) {
    throw new Error(
      `Failed to determine page count for search options: ${JSON.stringify(
        movies,
        null,
        2
      )}`
    );
  }

  console.debug(`Total pages for search options: ${movies.total_pages}`);

  return movies.total_pages;
}
