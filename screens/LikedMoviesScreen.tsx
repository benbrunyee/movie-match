import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import MoviePreview from "../components/MoviePreview";
import { Box, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import { MovieBase } from "../functions/src/util/apiTypes";
import { SettingsTabScreenProps } from "../types";

const LikedMoviesScreen = ({
  navigation,
}: SettingsTabScreenProps<"LikedMovies">): JSX.Element => {
  const [userContext] = useUserContext();
  const [movies, setMovies] = useState<MovieBase[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadLikesMovies = useCallback(async () => {
    try {
      const reactionDocs = (
        await getDocs(
          query(
            collection(db, "movieReactions"),
            where("owner", "==", userContext.uid),
            where("reaction", "==", "LIKE"),
            orderBy("createdAt", "desc"),
            // TODO: Pagination
            limit(100)
          )
        )
      ).docs;

      const movies = (
        await Promise.all(
          reactionDocs.map((reactionDoc) =>
            getDoc(doc(db, "movies", reactionDoc.data().movieId))
          )
        )
      ).map(
        (movieDoc) => ({ ...movieDoc.data(), id: movieDoc.id } as MovieBase)
      );

      setMovies(movies);
    } catch (e) {
      setError("Failed to load movies");
      console.error(e);
    }

    setIsLoading(false);
  }, [userContext.uid]);

  useEffect(() => {
    loadLikesMovies();

    const unsub = navigation.addListener("focus", () => {
      loadLikesMovies();
    });

    return unsub;
  }, []);

  if (isLoading) {
    return (
      <Box style={[styles.flex, styles.center]}>
        <Text variant="title">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={[styles.flex, styles.center]}>
        <Text variant="body">{error}</Text>
      </Box>
    );
  }

  return (
    <Box style={[styles.flex, styles.center, styles.container]}>
      {movies.length > 0 ? (
        <FlatList
          keyExtractor={(movie) => movie.id}
          renderItem={({ item: movie }) => <MoviePreview {...movie} />}
          data={movies}
        />
      ) : (
        <Text variant="title">Nothing to load</Text>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: Styling.spacingMedium,
  },
});

export default LikedMoviesScreen;
