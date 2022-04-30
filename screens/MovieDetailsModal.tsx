import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MovieCard from "../components/MovieCard";
import { Text } from "../components/Themed";
import { db } from "../firebase";
import { MovieBase } from "../functions/src/util/apiTypes";
import { RootStackScreenProps } from "../types";

const MovieDetailsModal = ({
  navigation,
  route,
}: RootStackScreenProps<"MovieDetailsModal">): JSX.Element => {
  const movieId = route.params.movieId;
  const [movie, setMovie] = useState<MovieBase | undefined>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadMovies = useCallback(async (movieId: string) => {
    try {
      const movie = await getDoc(doc(db, "movies", movieId));
      if (!movie.exists()) {
        return setError("Could not find movie");
      }
      setMovie(movie.data() as MovieBase);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadMovies(movieId).finally(() => {
      setIsLoading(false);
    });
  }, [movieId]);

  if (isLoading) {
    return (
      <View style={styles.messageContainer}>
        <Text variant="subtitle">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!(movieId && movie)) {
    return (
      <View style={styles.messageContainer}>
        <Text>No movie to load</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MovieCard movie={movie} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MovieDetailsModal;
