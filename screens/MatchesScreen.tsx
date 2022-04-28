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
import { FlatList, StyleSheet } from "react-native";
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
  // We only get 100 movies at a time because there should be
  // matches in the first 100. If not then it will be called again and
  // it will continue to call until off matches are off the screen

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
        // setMatches([
        //   {
        //     id: "304ab148-37eb-43ab-a3f2-d857350b72df",
        //     identifier: 347755,
        //     createdAt: "2022-04-20T19:55:19.396Z",
        //     name: "Wind Walkers Wind Walkers Wind Walkers Wind Walkers",
        //     coverUri: "/hDqOR0axvOQGFPt57pwj1Yh7NvW.jpg",
        //     rating: 6.8,
        //     ratingCount: 14,
        //     description: `A group of friends and family descend into the Everglades swamplands for their annual hunting trip only to discover that they are the ones being hunted. A malevolent entity is tracking them and they begin to realise one of their party may be possessed by something brought home from a tour of duty in the Middle East - a demon of war so horrible and deadly they are unaware of its devilish presence. Or are they facing something even more unspeakable, a legendary Native American curse about to unleash its dreadful legacy of thirsting for colonial revenge by claiming more souls?`,
        //     genres: [
        //       Genre.Action,
        //       Genre.Adventure,
        //       Genre.Animation,
        //       Genre.Comedy,
        //       Genre.Crime,
        //       Genre.Documentary,
        //       Genre.Drama,
        //       Genre.Family,
        //       Genre.Fantasy,
        //     ],
        //     trailerUri: null,
        //     releaseYear: 2015,
        //     updatedAt: "2022-04-20T19:55:19.396Z",
        //     owner: null,
        //     __typename: "Movie",
        //   },
        //   {
        //     id: "304ab148-37eb-43ab-a3f2-d857350b72dff",
        //     identifier: 347755,
        //     createdAt: "2022-04-20T19:55:19.396Z",
        //     name: "Wind Walkers",
        //     coverUri: "/hDqOR0axvOQGFPt57pwj1Yh7NvW.jpg",
        //     rating: 6.8,
        //     ratingCount: 14,
        //     description: `A group of friends and family descend into the Everglades swamplands.`,
        //     genres: [Genre.Action, Genre.Adventure, Genre.Animation],
        //     trailerUri: null,
        //     releaseYear: 2015,
        //     updatedAt: "2022-04-20T19:55:19.396Z",
        //     owner: null,
        //     __typename: "Movie",
        //   },
        // ]);
      } catch (e) {
        console.error(e);
        setError("Failed to load movies");
        return;
      }
    },
    [userContext]
  );

  // Load the matched movies
  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      loadMatches("PREPEND").finally(() => setIsLoading(false));
    });

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
    <Box style={[styles.container, styles.fill]}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MoviePreview {...item} />}
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
