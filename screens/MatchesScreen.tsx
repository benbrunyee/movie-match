import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import MoviePreview from "../components/MoviePreview";
import { Box, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import { MovieBase } from "../functions/src/util/apiTypes";
import { RootTabScreenProps } from "../types";

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

const MatchesScreen = ({
  navigation,
}: RootTabScreenProps<"Matches">): JSX.Element => {
  const [matches, dispatchMatches] = useReducer(movieReducer, [], () => []);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userContext] = useUserContext();
  const [viewMovie, setViewMovie] = useState<MovieBase | undefined>();

  // ! TODO: Pagination here
  const loadMatches = useCallback(
    async (actionType?: MovieReducerAction["type"]) => {
      if (!userContext.connectedPartner) {
        console.debug("No connected partner so nothing to load");
        return;
      }

      try {
        const userLikedInnerIds = (
          await getDocs(
            query(
              collection(db, "movieReactions"),
              where("owner", "==", userContext.uid),
              where("reaction", "==", "LIKE"),
              orderBy("createdAt", "desc")
            )
          )
        ).docs.map((doc) => doc.data().movieId);

        const partnerLikedMovieIds = (
          await getDocs(
            query(
              collection(db, "movieReactions"),
              where("owner", "==", userContext.connectedPartner),
              where("reaction", "==", "LIKE"),
              orderBy("createdAt", "desc")
            )
          )
        ).docs.map((reactionDoc) => reactionDoc.data().movieId);

        const matchedIds = userLikedInnerIds.filter((id) =>
          partnerLikedMovieIds.includes(id)
        );

        const movies = (
          await Promise.all(
            matchedIds.map((id) => getDoc(doc(db, "movies", id)))
          )
        ).map((movie) => ({ ...movie.data(), id: movie.id } as MovieBase));

        if (movies.length > 0) {
          dispatchMatches({
            items: movies,
            type: actionType || "APPEND",
          });
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load movies");
        return;
      }
    },
    [userContext]
  );

  // Load the matched movies
  useFocusEffect(
    useCallback(() => {
      // Don't reload if we are coming from movie details modal
      if (!viewMovie) {
        // Don't flash loading if there are matches present
        !matches.length && setIsLoading(true);
        loadMatches("PREPEND").finally(() => setIsLoading(false));
        setViewMovie(undefined);
      }
    }, [viewMovie])
  );

  useEffect(() => {
    if (viewMovie) {
      navigation.navigate("MovieDetailsModal", viewMovie);
    }
  }, [viewMovie]);

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
    <Box style={[styles.container, styles.fill]}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setViewMovie(item);
            }}
          >
            <MoviePreview {...item} />
          </Pressable>
        )}
        onEndReached={() => loadMatches()}
      />
    </Box>
  ) : (
    <Box style={styles.messageContainer}>
      <Text variant="title">Nothing to load</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Styling.spacingMedium,
  },
  fill: {
    flex: 1,
  },
  container: {
    padding: Styling.spacingMedium,
  },
});

export default MatchesScreen;
