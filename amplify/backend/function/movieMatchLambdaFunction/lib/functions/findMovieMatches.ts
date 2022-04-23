import {
  FindMovieMatchesList,
  MovieReaction,
  Reaction,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { getMovieByIds, getUser, listAllMovieReactions, removeDuplicates } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { updateUser } from "../lib/graphql/mutations";

export interface EventInterface extends EventIdentity {}

export default async (
  event: EventInterface
): Promise<Omit<FindMovieMatchesList, "__typename">> => {
  const requestee = event.identity.username;

  if (!requestee) {
    throw new Error(
      "Could not find requestee. Please call this function as a logged in user."
    );
  }

  const user = await getUser(requestee);
  console.debug(`Successfully got user obj for ID: ${requestee}`);

  const connectedUserId = user.connectedUser;
  console.debug(`Got connected partner user ID: ${connectedUserId}`);

  if (!connectedUserId) {
    console.warn(
      `Could not find connected user for user database obj: ${requestee}`
    );
    console.warn("Returning an empty results");
    return { allMatches: [], newMatches: [] };
  }

  const userMovieReactions = await listAllMovieReactions(requestee);
  const partnerMovieReactions = await listAllMovieReactions(connectedUserId);

  console.debug(
    `User movie reactions: ${JSON.stringify(
      userMovieReactions,
      null,
      2
    )}`
  );
  console.debug(
    `Partner movie reactions: ${JSON.stringify(
      partnerMovieReactions,
      null,
      2
    )}`
  );

  const movieMatches = findMovieMatches(
    userMovieReactions as MovieReaction[],
    partnerMovieReactions as MovieReaction[]
  );

  console.debug(
    `Found movie matches: ${JSON.stringify(movieMatches, null, 2)}`
  );

  const allMatchIds = removeDuplicates(getMovieIdsFromReactions(movieMatches));
  console.debug(
    `Found matches for the following movie IDs: ${JSON.stringify(
      allMatchIds,
      null,
      2
    )}`
  );

  await updateUserMovieMatches(requestee, allMatchIds);
  await updateUserMovieMatches(connectedUserId, allMatchIds);

  const newMatchIds = getUniqueNewMatches(user.movieMatches || [], allMatchIds);
  console.debug(
    `Found additional movie matches, IDs: ${JSON.stringify(
      newMatchIds,
      null,
      2
    )}`
  );

  const allMovies = await getMovieByIds(allMatchIds);
  const newMovies = await getMovieByIds(newMatchIds);

  console.debug(`All matches: ${JSON.stringify(allMovies, null, 2)}`);
  console.debug(`New matches: ${JSON.stringify(newMovies, null, 2)}`);

  return { allMatches: allMovies, newMatches: newMovies };
};

function getUniqueNewMatches(
  currentMovieMatches: string[],
  newMovieMatches: string[]
) {
  return newMovieMatches.filter((x) => !currentMovieMatches.includes(x));
}

function getMovieIdsFromReactions(movieReactions: MovieReaction[]) {
  return movieReactions.map((reaction) => reaction.movie.id);
}

async function updateUserMovieMatches(id: string, movieIds: string[]) {
  await callGraphQl<UpdateUserMutation, UpdateUserMutationVariables>(
    { updateUser },
    {
      input: {
        id,
        movieMatches: movieIds,
      },
    }
  );
}

function findMovieMatches(
  arr1: MovieReaction[],
  arr2: MovieReaction[]
): MovieReaction[] {
  const likeFilter = (movieReaction: MovieReaction) =>
    movieReaction.reaction === Reaction.LIKE;

  // Filter for only the likes
  arr1 = arr1.filter(likeFilter);
  arr2 = arr2.filter(likeFilter);

  console.debug(`Liked movies for array 1: ${JSON.stringify(arr1, null, 2)}`);
  console.debug(`Liked movies for array 2: ${JSON.stringify(arr2, null, 2)}`);

  // Get the largest & smallest out of the 2
  const [largestArr, smallestArr] =
    arr1.length >= arr2.length ? [arr1, arr2] : [arr2, arr1];

  // Convert the smallest array into a key-value object
  const smallObjMap = smallestArr.reduce<{ [key: string]: MovieReaction }>(
    (r, reaction) => {
      r[reaction.movie.id] = reaction;
      return r;
    },
    {}
  );

  let matches: MovieReaction[] = [];

  for (let reaction of largestArr) {
    // Add to the match array if it exist in the larger array
    if (smallObjMap[reaction.movie.id]) {
      matches.push(reaction);
    }
  }

  return matches;
}
