import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Box, MenuItem, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { FindMovieMatchesQuery, Movie as MovieApi } from "../src/API";
import { findMovieMatches } from "../src/graphql/queries";
import { RootTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";
import { IMAGE_PREFIX } from "../utils/movieApi";

export interface Movie extends MovieApi {
  isNew?: boolean;
}

const MatchesScreen: React.FC<RootTabScreenProps<"Matches">> = () => {
  const [matches, setMatches] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState("");

  // Load the matched movies
  useEffect(() => {
    async function onLoad() {
      try {
        const movies = await callGraphQL<FindMovieMatchesQuery>(
          findMovieMatches
        );

        if (!movies.data?.findMovieMatches) {
          throw new Error("Failed to find movie matches");
        }

        const allMatches = movies.data.findMovieMatches.allMatches;
        const newMatches = movies.data.findMovieMatches.newMatches;

        setMatches([
          ...allMatches,
          ...newMatches.map<Movie>((movie) => ({ ...movie, isNew: true })),
        ]);
      } catch (e) {
        console.error(e);
        setError("Failed to load movies");
        return;
      }
    }

    onLoad().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Box style={styles.messageContainer}>
        <Text variant="title">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={styles.messageContainer}>
        <Text variant="body">{error}</Text>
      </Box>
    );
  }

  return (
    <View>
      {matches.map((movie) => {
        return (
          <MenuItem
            key={movie.id}
            bottomBorder={true}
            onPress={() => {
              setSelectedMovie(movie.id);
            }}
          >
            <View style={styles.menuItem}>
              {movie.coverUri ? (
                <Image
                  source={{
                    uri: IMAGE_PREFIX + movie.coverUri,
                    height: 66,
                    width: 44,
                  }}
                  style={styles.movieImage}
                />
              ) : null}
              <View>
                <Text variant="subtitle">{movie.name}</Text>
                <Text
                  variant="caption"
                  {...(selectedMovie !== movie.id && {
                    style: styles.movieDescription,
                    numberOfLines: 1,
                    ellipsizeMode: "tail",
                  })}
                >
                  {movie.description}
                </Text>
                {movie.isNew ? <Text variant="caption">New Match!</Text> : null}
              </View>
            </View>
          </MenuItem>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
  },
  movieImage: {
    marginRight: Styling.spacingSmall,
    marginVertical: "auto",
  },
  movieDescription: {
    maxWidth: 200,
  },
});

export default MatchesScreen;
