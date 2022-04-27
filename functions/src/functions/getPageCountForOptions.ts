import axios from "axios";
import { https, logger } from "firebase-functions";
import { DiscoverMovieApi, DiscoverSearchOptions } from "../util/apiTypes";
import {
  MOVIE_API_KEY,
  MOVIE_API_URL, stringify
} from "../util/common";
import { createUrlParams } from "./discoverMovies";

export default async function (
  data: Omit<DiscoverSearchOptions, "page">,
  context: https.CallableContext
) {
  let urlParams = await createUrlParams(data);

  logger.debug(`URL Params for determing page count: "${urlParams}"`);

  const discoverUrl = `${MOVIE_API_URL}/discover/movie?api_key=${MOVIE_API_KEY}${
    urlParams ? `&${urlParams}` : ""
  }`;

  logger.debug(`URL Request: ${discoverUrl}`);

  // Make the request
  const movies = (await (
    await axios.get(discoverUrl)
  ).data) as DiscoverMovieApi;

  if (
    (typeof movies.success !== "undefined" && !movies.success) ||
    !movies.total_pages
  ) {
    throw new Error(
      `Failed to determine page count for search options: ${stringify(movies)}`
    );
  }

  logger.debug(`Total pages for search options: ${movies.total_pages}`);

  return movies.total_pages;
}
