import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MovieCard from "../components/MovieCard";
import { Box, Swiper, Text } from "../components/Themed";
import { useUserContext } from "../context/UserContext";
import {
  CreateMovieReactionMutation,
  CreateMovieReactionMutationVariables,
  DiscoverMoviesInput,
  DiscoverMoviesQuery,
  DiscoverMoviesQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  ListPartnerPendingMovieMatchesQuery,
  Movie as MovieApi,
  Reaction
} from "../src/API";
import { createMovieReaction } from "../src/graphql/mutations";
import {
  discoverMovies as discoverMoviesApi,
  getUser,
  listPartnerPendingMovieMatches
} from "../src/graphql/queries";
import { RootTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";

const MIN_PAGE = 1;
const MAX_PAGE = 500;

export interface Movie extends MovieApi {
  isPartnerMovie?: boolean;
}

export default function DiscoverScreen({
  navigation,
}: RootTabScreenProps<"Discover">) {
  const [userContext] = useUserContext();
  const firstLoad = useRef(true);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Use a random page
  const [page, setPage] = useState(generateRandomNumber(MIN_PAGE, MAX_PAGE));

  const findMovies = useCallback(async () => {
    try {
      const userData = await callGraphQL<GetUserQuery, GetUserQueryVariables>(
        getUser,
        {
          id: userContext.sub,
        }
      );

      if (!userData.data?.getUser) {
        throw new Error("Could not load user data");
      }

      let partnerMovies: Movie[] = [];

      if (userContext.connectedPartner) {
        partnerMovies = await loadPartnerPendingMatches();
      }

      // Mark all parter movies as partner movies
      partnerMovies = partnerMovies.map((movie) => ({
        ...movie,
        isPartnerMovie: true,
      }));

      // Set the partner movies
      setMovies(partnerMovies);

      const searchOptions = userData.data.getUser.searchOptions;
      const discoveredMovies = await discoverMovies({
        page,
        ...(searchOptions || {}),
      });

      // Add the discovered movies to the end
      setMovies((cur) => [...cur, ...discoveredMovies]);
    } catch (e) {
      console.error(e);
      setError("Failed to load movies");
      return;
    }

    // Use another random number
    setPage(generateRandomNumber(MIN_PAGE, MAX_PAGE));
  }, [page]);

  const reloadMovies = useCallback(() => {
    setIsLoading(true);
    findMovies().then(() => setIsLoading(false));
  }, [findMovies]);

  const likeMovie = useCallback((movie: Movie) => {
    addReaction(userContext.sub, movie.id, Reaction.LIKE);
    if (movie.isPartnerMovie) {
      alert("You found a match!");
    }
  }, []);

  const dislikeMovie = useCallback((movie: Movie) => {
    addReaction(userContext.sub, movie.id, Reaction.DISLIKE);
  }, []);

  const swipeRight = useCallback(
    (i: number) => {
      const movie = movies[i];
      if (movie) {
        likeMovie(movie);
      } else {
        console.error("Could not find movie based on swipe index");
      }
    },
    [likeMovie]
  );

  const swipeLeft = useCallback(
    (i: number) => {
      const movie = movies[i];
      if (movie) {
        dislikeMovie(movie);
      } else {
        console.error("Could not find movie based on swipe index");
      }
    },
    [dislikeMovie]
  );

  // This will load movies on mount as well
  useEffect(() => {
    if (firstLoad.current) {
      // No longer first load
      firstLoad.current = false;

      findMovies().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  if (isLoading) {
    return (
      <Box style={styles.container}>
        <Text variant="title">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={styles.container}>
        <Text variant="body">{error}</Text>
      </Box>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Swiper
          cards={movies}
          keyExtractor={(movie) => movie.id}
          renderCard={(movie) => <MovieCard movie={movie} />}
          onSwipedLeft={swipeLeft}
          onSwipedRight={swipeRight}
          onSwipedAll={() => {
            reloadMovies();
          }}
          verticalSwipe={false}
        />
      </View>
    </>
  );
}

async function loadPartnerPendingMatches(): Promise<Movie[]> {
  const movies = await callGraphQL<ListPartnerPendingMovieMatchesQuery>(
    listPartnerPendingMovieMatches
  );

  if (!movies.data?.listPartnerPendingMovieMatches?.items) {
    throw new Error("Failed to list partner pending movies");
  }

  return movies.data.listPartnerPendingMovieMatches.items;
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// TODO: Shouldn't create mulitple reactions per movie
async function addReaction(
  userId: string,
  movieId: string,
  reaction: Reaction
) {
  return await callGraphQL<
    CreateMovieReactionMutation,
    CreateMovieReactionMutationVariables
  >(createMovieReaction, {
    input: {
      reaction,
      userMovieReactionsId: userId,
      movieReactionMovieId: movieId,
    },
  });
}

async function discoverMovies(
  searchOptions?: DiscoverMoviesInput
): Promise<Movie[]> {
  const movies = await callGraphQL<
    DiscoverMoviesQuery,
    DiscoverMoviesQueryVariables
  >(discoverMoviesApi, {
    input: searchOptions,
  });

  if (!movies.data?.discoverMovies) {
    throw new Error("Could not find any movies");
  }

  return movies.data.discoverMovies.items;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
