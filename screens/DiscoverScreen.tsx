import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Box, Button, Container, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  CreateMovieReactionMutation,
  CreateMovieReactionMutationVariables,
  DiscoverMoviesQuery,
  DiscoverMoviesQueryVariables,
  Movie,
  Reaction
} from "../src/API";
import { createMovieReaction } from "../src/graphql/mutations";
import { discoverMovies as discoverMoviesApi } from "../src/graphql/queries";
import { RootTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";

const IMAGE_PREFIX = "https://image.tmdb.org/t/p/w220_and_h330_face";

export default function Discover({
  navigation,
}: RootTabScreenProps<"Discover">) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [userContext] = useUserContext();

  const findMovies = useCallback(async () => {
    const movies = await discoverMovies(page);

    // Next search to be on the next page
    setPage((cur) => cur + 1);

    // Set the movies
    setMovies(movies);

    // Reset the index
    setIndex(0);
  }, [page]);

  // Load movies on mount
  useEffect(() => {
    findMovies();
  }, []);

  useEffect(() => {
    // Load more movies if we are at the end
    if (index === movies.length) {
      findMovies();
    }
  }, [index]);

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
                {movies[index].name}
              </Text>
              <View style={styles.buttonControls}>
                <Button
                  onPress={() => {
                    const movie = movies[index];

                    if (!movie.id) {
                      console.warn("Could not find ID from movie");
                      return;
                    }

                    addReaction(userContext.sub, movie.id, Reaction.DISLIKE);

                    setIndex((cur) => cur + 1);
                  }}
                  style={{ backgroundColor: "#DC143C" }}
                >
                  <Text>No</Text>
                </Button>
                <Button
                  onPress={() => {
                    const movie = movies[index];

                    if (!movie.id) {
                      console.warn("Could not find ID from movie");
                      return;
                    }

                    addReaction(userContext.sub, movie.id, Reaction.LIKE);
                    setIndex((cur) => cur + 1);
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
async function discoverMovies(page?: number) {
  const movies = await callGraphQL<
    DiscoverMoviesQuery,
    DiscoverMoviesQueryVariables
  >(discoverMoviesApi, {
    input: {
      ...(page && { page }),
    },
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
});
