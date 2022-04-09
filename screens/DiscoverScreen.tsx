import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text, Box, TextInput, Button, Container } from "../components/Themed";
import {
  CreateMovieInput,
  CreateMovieMutation,
  CreateMovieMutationVariables,
  DiscoverMovieApi,
  DiscoverMoviesQuery,
  DiscoverMoviesQueryVariables,
  Movie as MovieApi,
} from "../src/API";
import { RootTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";
import { discoverMovies as discoverMoviesApi } from "../src/graphql/queries";
import Styling from "../constants/Styling";
import { createMovie } from "../src/graphql/mutations";
import { GraphQLResult } from "@aws-amplify/api-graphql";

export type Movie = Omit<
  MovieApi,
  "__typename" | "createdAt" | "updatedAt" | "id"
> & { id?: string; createdAt?: Date; updatedAt?: Date };

const IMAGE_PREFIX = "https://image.tmdb.org/t/p/w220_and_h330_face";

export default function Discover({
  navigation,
}: RootTabScreenProps<"Discover">) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);

  const findMovies = useCallback(async () => {
    const movies = formatMoviesApi(await discoverMovies(page));

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
      <Text style={styles.title}>Daisy you stink!!!</Text>
      <Box
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Box>
        <TextInput
          onChangeText={(text) => setSearchValue(text)}
          placeholder="Enter a movie to search"
        />
      </Box>
      <Box>
        <Button
          onPress={async () => {
            if (!searchValue) {
              return;
            }

            const movies = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=0dd0cb2ac703e890ab3573c95612498a&query=${encodeURIComponent(
                searchValue
              )}`
            );
            const json = await movies.json();

            setMovies(json?.results || []);
          }}
        >
          <Text>Search</Text>
        </Button>
      </Box>
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
                  onPress={() => setIndex((cur) => cur + 1)}
                  style={{ backgroundColor: "#DC143C" }}
                >
                  <Text>No</Text>
                </Button>
                <Button
                  onPress={() => setIndex((cur) => cur + 1)}
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

function formatMoviesApi(movies: DiscoverMovieApi): Movie[] {
  return movies.results.map((movie) => ({
    name: movie.title,
    categories: [],
    identifier: movie.id.toString(),
    description: movie.overview,
    rating: movie.vote_average,
    ratingCount: movie.vote_count,
    coverUri: movie.poster_path || null,
  }));
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

  addMoviesToDb(movies.data.discoverMovies);

  return movies.data.discoverMovies;
}

async function addMoviesToDb(discoveredMovies: DiscoverMovieApi) {
  const newMovies = discoveredMovies.results.map<CreateMovieInput>((movie) => ({
    id: movie.id,
    categories: movie.genre_ids.map((id) => id.toString()),
    description: movie.overview,
    name: movie.title,
    rating: movie.vote_average,
    ratingCount: movie.vote_count,
    ...(movie.poster_path && { coverUri: movie.poster_path }),
  }));

  let promises: Promise<GraphQLResult<CreateMovieMutation>>[] = [];

  for (let movie of newMovies) {
    // TODO: Do this in one API call
    // TODO: Don't make the call if already saved
    promises.push(
      callGraphQL<CreateMovieMutation, CreateMovieMutationVariables>(
        createMovie,
        {
          input: movie,
        }
      )
    );
  }

  await Promise.all(promises).catch((e) => {});
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
