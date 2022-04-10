import { MovieReaction } from "../lib/API";
import { getUser, listMovies } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";

export interface EventInterface extends EventIdentity {}

/**
 * Finding movies that the partner has reacted to but the current user has not
 * 1. Get the list of movies that the partner has reacted to
 * 2. Get the list of movies that the user has reacted to
 * 3. Find movies that the partner has reacted to but the user hasn't
 * 4. Return that list
 */
export default async function (event: EventInterface) {
  const username = event.identity.username;

  if (!username) {
    throw new Error(
      "Can only get partner pending matches from a user. Could not determine username from call."
    );
  }

  // Get the user's info
  const user = await getUser(username);

  if (!user.connectedUser) {
    throw new Error("User does not have a connected partner");
  }

  // Get the partner's info
  const connectedPartner = await getUser(user.connectedUser);

  // Get both of their reactions
  const userReactions = user.movieReactions?.items;
  const partnerReactions = connectedPartner.movieReactions?.items;

  if (!(partnerReactions && userReactions)) {
    throw new Error("Could not find movie reactions for partner and/or user");
  }

  // Get the identifiers since that is what we will be using to compare
  const userMovieIds = getMovieIds(userReactions as MovieReaction[]);
  const partnerMovieIds = getMovieIds(partnerReactions as MovieReaction[]);

  const unmatchedPartnerMovies = removeOverlap(partnerMovieIds, userMovieIds);

  // Prevents us from doing a filter with no conditional
  if (unmatchedPartnerMovies.length === 0) {
    return { items: [] };
  }

  const movieData = await listMovies({
    filter: {
      or: unmatchedPartnerMovies.map((id) => ({ identifier: { eq: id } })),
    },
  });

  return { items: movieData };
}

function removeOverlap(base: number[], matches: number[]) {
  let newArr: number[] = [];

  for (let v of base) {
    // If the the value is not in the match array
    // then we add it to a new array
    if (!matches.includes(v) && !newArr.includes(v)) {
      newArr.push(v);
    }
  }

  return newArr;
}

function getMovieIds(movieReactions: MovieReaction[]) {
  return movieReactions.map((reaction) => reaction.movie.identifier);
}
