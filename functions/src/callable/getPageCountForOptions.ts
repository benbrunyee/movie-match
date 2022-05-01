import axios from "axios";
import { https, logger } from "firebase-functions";
import { DiscoverSearchOptions, TMDBApiOutput } from "../util/apiTypes";
import { stringify, TMDB_API_KEY, TMDB_API_URL } from "../util/common";
import { createUrlParams } from "./discoverMovies";

export default async (
  data: Omit<DiscoverSearchOptions, "page">,
  context: https.CallableContext
) => {
  const urlParams = await createUrlParams(data);

  logger.debug(`URL Params for determing page count: "${urlParams}"`);

  const discoverUrl = `${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}${
    urlParams ? `&${urlParams}` : ""
  }`;

  logger.debug(`URL Request: ${discoverUrl}`);

  // Make the request
  const movies = (await (
    await axios.get(discoverUrl)
  ).data) as TMDBApiOutput;

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
};
