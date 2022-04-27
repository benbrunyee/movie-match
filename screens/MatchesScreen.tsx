import { useTheme } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where
} from "firebase/firestore/lite";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import CategoryLabel from "../components/CategoryLabel";
import { Box, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import { MovieBase } from "../functions/src/util/apiTypes";
import { RootTabScreenProps } from "../types";
import { IMAGE_PREFIX } from "../utils/movieApi";

const MatchesScreen = ({
  navigation,
}: RootTabScreenProps<"Matches">): JSX.Element => {
  const [matches, setMatches] = useState<MovieBase[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userContext] = useUserContext();

  const loadMatches = useCallback(async () => {
    if (!userContext.connectedPartner) {
      console.debug("No connected partner so nothing to load");
      return;
    }

    try {
      const partnerLikedMovieIds = (
        await getDocs(
          query(
            collection(db, "movieReactions"),
            where("owner", "==", userContext.connectedPartner),
            where("reaction", "==", "LIKE"),
            // TODO: Lazy load more if scrolled
            limit(100)
          )
        )
      ).docs.map((doc) => doc.data().movieId);
      const userLikedMovieIds = (
        await getDocs(
          query(
            collection(db, "movieReactions"),
            where("owner", "==", userContext.uid),
            where("reaction", "==", "LIKE"),
            // TODO: Lazy load more if scrolled
            limit(100)
          )
        )
      ).docs.map((doc) => doc.data().movieId);

      const matchedIds = partnerLikedMovieIds.filter((movie) =>
        userLikedMovieIds.includes(movie)
      );

      // TODO: Doesn't get new matches
      const movies = (
        await Promise.all(matchedIds.map((id) => getDoc(doc(db, "movies", id))))
      ).map((movie) => ({ ...movie.data(), id: movie.id } as MovieBase));

      setMatches(movies);
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
  }, [userContext]);

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
    <Box style={[styles.container, styles.fill]}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieBox {...item} />}
      />
    </Box>
  ) : (
    <Box style={styles.messageContainer}>
      <Text variant="title">Nothing to load</Text>
    </Box>
  );
};

const MovieBox = (item: MovieBase): JSX.Element => {
  const { dark } = useTheme();

  return (
    <Box
      style={[
        styles.movieBox,
        dark ? { borderWidth: 1, borderColor: "rgba(225, 225, 225, 0.5)" } : {},
      ]}
      lightColor="#FFF"
      darkColor="#000"
    >
      <View style={styles.movieBackground}>
        {item.coverUri ? (
          <Image
            source={{ uri: IMAGE_PREFIX + item.coverUri }}
            resizeMode="cover"
            style={styles.movieBackground}
          />
        ) : null}
        <CoverGradient />
      </View>
      <View style={styles.fill} />
      <View style={[styles.fill, styles.contentSection]}>
        <View style={styles.movieTitleContainer}>
          <Text
            style={[styles.movieTitle, styles.spacingRight]}
            variant="title"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text style={styles.releaseYear} variant="smallCaption">
            {item.releaseYear}
          </Text>
        </View>
        <View style={[styles.categoryLabels]}>
          {item.genres.map((genre, i) =>
            i < 4 ? (
              <CategoryLabel
                key={genre}
                labelText={i < 3 ? genre : "..."}
                style={[
                  styles.categoryLabel,
                  i !== item.genres.length - 1 ? styles.spacingRight : {},
                ]}
              />
            ) : null
          )}
        </View>
        <View style={styles.fill}>
          <Text variant="smallCaption" style={styles.description}>
            {item.description}
          </Text>
        </View>
      </View>
    </Box>
  );
};

const CoverGradient = () => {
  const { dark } = useTheme();

  return (
    <Svg height="100%" width="100%">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
          <Stop
            offset="0.55"
            stopColor={dark ? "#000" : "#FFF"}
            stopOpacity={1}
          />
          <Stop offset="1" stopColor={dark ? "#000" : "#FFF"} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill={`url(#grad)`} />
    </Svg>
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
  spacingRight: {
    marginRight: Styling.spacingSmall,
  },
  container: {
    padding: Styling.spacingMedium,
  },
  movieBox: {
    borderRadius: Styling.borderRadius,
    overflow: "hidden",
    height: 270,
    marginBottom: Styling.spacingMedium,
  },
  movieBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  contentSection: {
    margin: Styling.spacingMedium,
  },
  movieTitleContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start",
    marginBottom: Styling.spacingSmall,
  },
  movieTitle: {
    flex: 1,
    fontFamily: "montserrat-bold",
  },
  releaseYear: {
    fontFamily: "montserrat-italic",
  },
  categoryLabel: {
    marginBottom: Styling.spacingSmall,
  },
  categoryLabels: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  description: {
    textAlign: "justify",
  },
});

export default MatchesScreen;
