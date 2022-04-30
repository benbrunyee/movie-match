import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where
} from "firebase/firestore";
import { useCallback, useEffect, useReducer, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import MoviePreview from "../components/MoviePreview";
import { Box, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import { MovieBase } from "../functions/src/util/apiTypes";
import { SettingsTabScreenProps } from "../types";

type MovieReducerAction = {
  items: MovieBase[];
  type: "PREPEND" | "APPEND" | "REMOVE";
};

const movieReducer = (state: MovieBase[], action: MovieReducerAction) => {
  switch (action.type) {
    case "PREPEND":
      return [
        ...action.items.filter(
          (actionItem) =>
            !state.map((stateItem) => stateItem.id).includes(actionItem.id)
        ),
        ...state,
      ];
    case "APPEND":
      return [
        ...state,
        ...action.items.filter(
          (actionItem) =>
            !state.map((stateItem) => stateItem.id).includes(actionItem.id)
        ),
      ];
    case "REMOVE":
      return state.filter(
        (stateItem) =>
          !action.items
            .map((actionItem) => actionItem.id)
            .includes(stateItem.id)
      );
  }
};

const LikedMoviesScreen = ({
  navigation,
}: SettingsTabScreenProps<"LikedMovies">): JSX.Element => {
  const [userContext] = useUserContext();
  // const [movies, setMovies] = useState<MovieBase[]>([]);
  const [movies, dispatchMovies] = useReducer(movieReducer, [], () => []);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastLoaded, setLastLoaded] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >();
  const [viewMovieId, setViewMovieId] = useState("");

  const queryFromIndex = useCallback(() => {
    const loadLimit = 2;

    return lastLoaded
      ? getDocs(
          query(
            collection(db, "movieReactions"),
            where("owner", "==", userContext.uid),
            where("reaction", "==", "LIKE"),
            orderBy("createdAt", "desc"),
            limit(loadLimit),
            startAfter(lastLoaded)
          )
        )
      : getDocs(
          query(
            collection(db, "movieReactions"),
            where("owner", "==", userContext.uid),
            where("reaction", "==", "LIKE"),
            orderBy("createdAt", "desc"),
            limit(loadLimit)
          )
        );
  }, [lastLoaded]);

  const loadLikesMovies = useCallback(
    async (addType?: MovieReducerAction["type"]) => {
      try {
        // TODO: Still attemps to load even if we are at the end
        const reactionDocs = (await queryFromIndex()).docs;

        setLastLoaded(reactionDocs[reactionDocs.length - 1]);

        const movies = (
          await Promise.all(
            reactionDocs.map((reactionDoc) =>
              getDoc(doc(db, "movies", reactionDoc.data().movieId))
            )
          )
        ).map(
          (movieDoc) => ({ ...movieDoc.data(), id: movieDoc.id } as MovieBase)
        );

        dispatchMovies({
          type: addType || "APPEND",
          items: movies,
        });
      } catch (e) {
        setError("Failed to load movies");
        console.error(e);
      }

      setIsLoading(false);
    },
    [userContext.uid, queryFromIndex]
  );

  useFocusEffect(
    useCallback(() => {
      loadLikesMovies("PREPEND");
      setViewMovieId("");
    }, [])
  );

  useEffect(() => {
    if (viewMovieId) {
      const parentNav = navigation.getParent();

      if (parentNav) {
        parentNav.navigate("MovieDetailsModal", {
          movieId: viewMovieId,
        });
      }
    }
  }, [viewMovieId]);

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
          renderItem={({ item: movie }) => (
            <Pressable
              onPress={() => {
                setViewMovieId(movie.id);
              }}
            >
              <MoviePreview {...movie} />
            </Pressable>
          )}
          data={movies}
          onEndReached={() => {
            loadLikesMovies();
          }}
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
