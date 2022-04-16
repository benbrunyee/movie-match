import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
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

const MatchesScreen: React.FC<RootTabScreenProps<"Matches">> = ({
  navigation,
}) => {
  const [matches, setMatches] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState("");

  const loadMatches = useCallback(async () => {
    try {
      const movies = await callGraphQL<FindMovieMatchesQuery>(findMovieMatches);

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
  }, []);

  // Load the matched movies
  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      loadMatches().finally(() => setIsLoading(false));
    });

    loadMatches().finally(() => setIsLoading(false));

    return unsubscribe;
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

  return matches.length > 0 ? (
    <View>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItem
            key={item.id}
            bottomBorder={true}
            onPress={() => {
              setSelectedMovie(item.id);
            }}
          >
            <View style={styles.menuItem}>
              {item.coverUri ? (
                <Image
                  source={{
                    uri: IMAGE_PREFIX + item.coverUri,
                    height: 66,
                    width: 44,
                  }}
                  style={styles.movieImage}
                />
              ) : null}
              <View>
                <Text variant="subtitle">{item.name}</Text>
                <Text
                  variant="caption"
                  {...(selectedMovie !== item.id && {
                    style: styles.movieDescription,
                    numberOfLines: 1,
                    ellipsizeMode: "tail",
                  })}
                >
                  {item.description}
                </Text>
                {item.isNew ? <Text variant="caption">New Match!</Text> : null}
              </View>
            </View>
          </MenuItem>
        )}
      />
    </View>
  ) : (
    <View style={styles.messageContainer}>
      <Text variant="title">Nothing to load</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Styling.spacingMedium,
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
