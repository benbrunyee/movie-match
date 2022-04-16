import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Box, Button, Container, Text } from "../components/Themed";
import Styling from "../constants/Styling";
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
import { IMAGE_PREFIX } from "../utils/movieApi";

const MIN_PAGE = 1;
const MAX_PAGE = 500;

export interface Movie extends MovieApi {
  isPartnerMovie?: boolean;
}

export default function DiscoverScreen({
  navigation,
}: RootTabScreenProps<"Discover">) {
  const [userContext] = useUserContext();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [index, setIndex] = useState(0);
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
        ...searchOptions,
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

    // Reset the index
    setIndex(0);
  }, [page]);

  const likeMovie = useCallback((movie: Movie) => {
    addReaction(userContext.sub, movie.id, Reaction.LIKE);
    if (movie.isPartnerMovie) {
      alert("You found a match!");
    }
    setIndex((cur) => cur + 1);
  }, []);

  const dislikeMovie = useCallback((movie: Movie) => {
    addReaction(userContext.sub, movie.id, Reaction.DISLIKE);
    setIndex((cur) => cur + 1);
  }, []);

  // This will load movies on mount as well
  useEffect(() => {
    // Load more movies if we are at the end
    if (index === movies.length) {
      if (!isLoading) {
        setIsLoading(true);
      }

      findMovies().then(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      });
    }
  }, [index]);

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
    <Box style={styles.container}>
      <Box>
        {(() => {
          const selectedMovie = movies[index];

          if (!selectedMovie) {
            return;
          }

          return (
            <Container style={styles.movieContainer}>
              {selectedMovie.coverUri ? (
                <Image
                  source={{
                    uri: IMAGE_PREFIX + selectedMovie.coverUri,
                    height: 330,
                    width: 220,
                  }}
                />
              ) : null}
              <Text variant="subtitle" style={styles.movieTitle}>
                {selectedMovie.name}
              </Text>
              {selectedMovie.rating ? (
                <View style={styles.rating}>
                  <FontAwesome name="star" size={10} style={styles.star} />
                  <Text variant="smallCaption">{selectedMovie.rating}/10</Text>
                  {selectedMovie.ratingCount ? (
                    <Text variant="smallCaption">
                      {` - ${selectedMovie.ratingCount}`}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                variant="caption"
                style={styles.movieDescription}
              >
                {selectedMovie.description}
              </Text>
              <View style={styles.buttonControls}>
                <Button
                  onPress={() => {
                    dislikeMovie(selectedMovie);
                  }}
                  style={{ backgroundColor: "#DC143C" }}
                >
                  <Text>No</Text>
                </Button>
                <Button
                  onPress={() => {
                    likeMovie(selectedMovie);
                  }}
                  style={{ backgroundColor: "#7FFFD4" }}
                >
                  <Text>Yes</Text>
                </Button>
              </View>
            </Container>
          );
        })()}
      </Box>
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </Box>
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

// TODO: First load movies that the connected partner has liked
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  movieContainer: {
    padding: Styling.spacingLarge,
  },
  movieTitle: {
    textAlign: "center",
    margin: Styling.spacingSmall,
    maxWidth: 220,
  },
  buttonControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  movieDescription: {
    maxWidth: 220,
    marginBottom: Styling.spacingSmall,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Styling.spacingSmall,
  },
  star: {
    display: "flex",
    marginRight: 5,
  },
});
