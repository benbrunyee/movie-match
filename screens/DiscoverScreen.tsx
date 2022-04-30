import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import DefaultSwiper from "react-native-deck-swiper";
import MovieCard from "../components/MovieCard";
import { ErrorText, FadedErrorText } from "../components/Notification";
import { Box, Swiper, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import {
  NotificationItemProps,
  useNotificationDispatch
} from "../context/NotificationContext";
import { useUserContext } from "../context/UserContext";
import { db, functions } from "../firebase";
import {
  DiscoverSearchOptions,
  MovieBase,
  MovieReaction
} from "../functions/src/util/apiTypes";
import { RootTabScreenProps } from "../types";

export interface Movie extends MovieBase {
  isPartnerMovie?: boolean;
}

export default function DiscoverScreen({
  navigation,
}: RootTabScreenProps<"Discover">) {
  const [userContext] = useUserContext();
  const firstLoad = useRef(true);
  const bottomBarHeight = useBottomTabBarHeight();
  let swiperRef: DefaultSwiper<Movie> | undefined;
  const notificationDispatch = useNotificationDispatch();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const discoverMovies = useCallback(
    async (searchOptions?: DiscoverSearchOptions): Promise<Movie[]> => {
      const discover = httpsCallable(functions, "discoverMovies");
      const movies = (await discover(searchOptions)).data as Movie[];

      if (!movies.length) {
        throw new Error("Could not find any movies");
      }

      return movies;
    },
    []
  );

  const loadPartnerPendingMatches = useCallback(async (): Promise<Movie[]> => {
    const partnerQ = query(
      collection(db, "movieReactions"),
      where("owner", "==", userContext.connectedPartner),
      where("reaction", "==", "LIKE")
    );
    const partnerMovies = (await getDocs(partnerQ)).docs.map<MovieReaction>(
      (doc) => doc.data() as MovieReaction
    );

    const currentReactionsQ = query(
      collection(db, "movieReactions"),
      where("owner", "==", userContext.uid)
    );
    const reactedMovieIds = (await getDocs(currentReactionsQ)).docs
      .map<MovieReaction>((doc) => doc.data() as MovieReaction)
      .map((reaction) => reaction.movieId);

    const movieIds = partnerMovies
      .filter((reaction) => !reactedMovieIds.includes(reaction.movieId))
      .map<string>((doc) => doc.movieId);

    const movies = (
      await Promise.all(movieIds.map((id) => getDoc(doc(db, "movies", id))))
    ).map((doc) => ({ ...doc.data(), id: doc.id } as Movie));

    return movies;
  }, [userContext.connectedPartner]);

  const addReaction = useCallback(
    async (
      userId: string,
      movieId: string,
      reaction: MovieReaction["reaction"]
    ) => {
      const movieReaction: MovieReaction = {
        movieId,
        owner: userId,
        reaction: reaction,
      };

      try {
        const q = query(
          collection(db, "movieReactions"),
          where("movieId", "==", movieId),
          where("owner", "==", userId)
        );
        const existingReaction = await getDocs(q);

        if (!existingReaction.empty) {
          console.warn(
            "Reaction already exists for this movie, therefore not creating a reaction for this movie"
          );
          return;
        }
      } catch (e) {
        console.error(e);
        throw new Error(
          "Could not determine if user had already reacted to the movie"
        );
      }

      await addDoc(collection(db, "movieReactions"), movieReaction);
    },
    []
  );

  const findMovies = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", userContext.uid));

      if (!userDoc.exists()) {
        throw new Error("Could not load user data");
      }

      let partnerMovies: Movie[] = [];

      if (userContext.connectedPartner) {
        partnerMovies = await loadPartnerPendingMatches();
      } else {
        // Show notification
        notificationDispatch({
          type: "ADD",
          item: {
            item: (props) => (
              <ConnectionNotification
                {...props}
                onPress={() =>
                  navigation.navigate("Settings", {
                    screen: "SettingsScreen",
                  })
                }
              />
            ),
            type: "ERROR",
            position: "TOP",
          },
        });
      }

      // Mark all parter movies as partner movies
      partnerMovies = partnerMovies.map((movie) => ({
        ...movie,
        isPartnerMovie: true,
      }));

      // Set the partner movies
      setMovies(partnerMovies);

      const searchOptions = userDoc.data()
        .searchOptions as DiscoverSearchOptions;

      const maxPage = (
        await httpsCallable(functions, "getPageCountForOptions")(searchOptions)
      ).data as number;

      if (!maxPage) {
        throw new Error("Failed to determine max page for search options");
      }

      const discoveredMovies = await discoverMovies({
        // Maximum page to specify is 500
        page: generateRandomNumber(1, maxPage > 500 ? 500 : maxPage),
        ...(searchOptions || {}),
      });

      setMovies((cur) => [...cur, ...discoveredMovies]);
    } catch (e) {
      console.error(e);
      setError("Failed to load movies");
      return;
    }
  }, [userContext]);

  const reloadMovies = useCallback(() => {
    setIsLoading(true);
    findMovies().then(() => setIsLoading(false));
  }, [findMovies]);

  const likeMovie = useCallback((movie: Movie) => {
    addReaction(userContext.uid, movie.id, "LIKE").catch((err) => {
      console.error(err);
      setError("Failed to add reaction");
    });
    if (movie.isPartnerMovie) {
      alert("You found a match!");
    }
  }, []);

  const dislikeMovie = useCallback((movie: Movie) => {
    addReaction(userContext.uid, movie.id, "DISLIKE").catch((err) => {
      console.error(err);
      setError("Failed to add reaction");
    });
  }, []);

  const swipeRight = useCallback(
    (i: number) => {
      const movie = movies[i];
      if (movie) {
        likeMovie(movie);
      } else {
        console.error("Could not find movie based on swipe index");
      }
    },
    [likeMovie, movies]
  );

  const swipeLeft = useCallback(
    (i: number) => {
      const movie = movies[i];
      if (movie) {
        dislikeMovie(movie);
      } else {
        console.error("Could not find movie based on swipe index");
      }
    },
    [dislikeMovie, movies]
  );

  // This will load movies on mount as well
  useEffect(() => {
    if (firstLoad.current) {
      // No longer first load
      firstLoad.current = false;

      findMovies().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  if (isLoading) {
    return (
      <Box style={styles.container} lightColor="#FFF" darkColor="#000">
        <Text variant="title">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={styles.container} lightColor="#FFF" darkColor="#000">
        <Text variant="body">{error}</Text>
      </Box>
    );
  }

  return (
    <Box style={styles.container} lightColor="#FFF" darkColor="#000">
      <Swiper
        passRef={(swiper) => {
          if (swiper) {
            swiperRef = swiper;
          }
        }}
        cards={movies}
        keyExtractor={(movie) => movie.id}
        renderCard={(movie) => (
          <MovieCard
            movie={movie}
            style={{ marginBottom: bottomBarHeight }}
            onCheckPress={() => {
              console.debug("Check pressed");
              if (swiperRef) {
                swiperRef.swipeRight();
              }
            }}
            onCrossPress={() => {
              console.debug("Cross pressed");
              if (swiperRef) {
                swiperRef.swipeLeft();
              }
            }}
            onRefreshPress={reloadMovies}
          />
        )}
        onSwipedLeft={swipeLeft}
        onSwipedRight={swipeRight}
        onSwipedAll={() => {
          reloadMovies();
        }}
        containerStyle={{ ...styles.cardContainer }}
        verticalSwipe={false}
        cardVerticalMargin={0}
        cardHorizontalMargin={0}
        stackSize={3}
        showSecondCard={true}
      />
    </Box>
  );
}

const ConnectionNotification = ({
  dismiss,
  onPress,
}: NotificationItemProps & PressableProps) => (
  <Pressable
    onPress={(e) => {
      onPress && onPress(e);
      dismiss();
    }}
  >
    <ErrorText
      variant="caption"
      style={[notificationStyles.title, notificationStyles.marginBottom]}
    >
      Warning
    </ErrorText>
    <ErrorText variant="caption" style={notificationStyles.marginBottom}>
      You aren't connected to another user. There will be no matches.
    </ErrorText>
    <FadedErrorText style={notificationStyles.fadedText} variant="smallCaption">
      Click to get connected
    </FadedErrorText>
  </Pressable>
);

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});

const notificationStyles = StyleSheet.create({
  title: {
    fontFamily: "montserrat-bold",
  },
  marginBottom: {
    marginBottom: Styling.spacingSmall,
  },
  fadedText: {
    fontFamily: "montserrat-italic",
  },
});
