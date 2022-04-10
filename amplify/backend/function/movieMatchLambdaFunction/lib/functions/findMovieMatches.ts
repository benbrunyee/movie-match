import {
  MovieReaction,
  Reaction,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { getUser, removeDuplicates } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { updateUser } from "../lib/graphql/mutations";

export interface EventInterface extends EventIdentity {}

export default async (event: EventInterface) => {
  const requestee = event.identity.username;

  if (!requestee) {
    throw new Error(
      "Could not find requestee. Please call this function as a logged in user."
    );
  }

  const user = await getUser(requestee);

  const connectedUserId = user.connectedUser;

  if (!connectedUserId) {
    throw new Error(
      `Could not find connected user for user database obj: ${requestee}`
    );
  }

  const connectedUserObj = await getUser(connectedUserId);

  if (!(user.movieReactions && connectedUserObj.movieReactions)) {
    console.warn("Movie reactions for one or both user's are not present");
    console.debug("Returning an empty array");
    return [];
  }

  const movieMatches = findMovieMatches(
    user.movieReactions.items as MovieReaction[],
    connectedUserObj.movieReactions.items as MovieReaction[]
  );

  const movieIds = removeDuplicates(getMovieIdsFromReactions(movieMatches));

  await updateUserMovieMatches(requestee, movieIds);
  await updateUserMovieMatches(connectedUserId, movieIds);

  const newMatches = getNewMatches(user.movieMatches || [], movieIds);

  return { allMatches: movieIds, newMatches: newMatches };
};

// TODO: Fix
function getNewMatches(
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

function findMovieMatches(arr1: MovieReaction[], arr2: MovieReaction[]) {
  const likeFilter = (movieReaction: MovieReaction) =>
    movieReaction.reaction === Reaction.LIKE;

  // Filter for only the likes
  arr1 = arr1.filter(likeFilter);
  arr2 = arr2.filter(likeFilter);

  // Get the largest & smallest out of the 2
  const [largestArr, smallestArr] =
    arr1.length >= arr2.length ? [arr1, arr2] : [arr2, arr1];

  const match = (
    movieReaction1: MovieReaction,
    movieReaction2: MovieReaction
  ) => movieReaction1.movie.id === movieReaction2.movie.id;

  // Loop through the biggest array to reduce performance impact (if it were switched around)
  const matches = largestArr.reduce<MovieReaction[]>((r, movieReaction) => {
    // Check if it is in the smaller array
    if (smallestArr.some((reaction) => match(reaction, movieReaction))) {
      r.push(movieReaction);
    }

    return r;
  }, []);

  return matches;
}
