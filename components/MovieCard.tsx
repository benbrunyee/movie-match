import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { brand } from "expo-device";
import React from "react";
import {
  Image,
  Pressable,
  PressableProps,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import TMDBLogo from "../assets/images/tmdb-logo.svg";
import Styling from "../constants/Styling";
import { MovieBase } from "../functions/src/util/apiTypes";
import { IMAGE_PREFIX } from "../utils/movieApi";
import CategoryLabel from "./CategoryLabel";
import { Box, BoxProps, Text } from "./Themed";

export interface MovieCardProps extends BoxProps {
  movie: MovieBase;
  onCrossPress?: () => void;
  onCheckPress?: () => void;
  onRefreshPress?: () => void;
  isPartner?: boolean;
}

const MovieCard = ({
  movie,
  style,
  onCrossPress,
  onCheckPress,
  onRefreshPress,
  isPartner,
  ...otherProps
}: MovieCardProps): JSX.Element => {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const { height } = useWindowDimensions();

  return (
    <Box
      {...otherProps}
      style={[styles.fill, style]}
      lightColor="#FFF"
      darkColor="#000"
    >
      <View style={styles.background}>
        {movie.coverUri ? (
          <>
            <Image
              source={{
                uri: IMAGE_PREFIX + movie.coverUri,
              }}
              resizeMode="cover"
              style={styles.background}
            />
            <View style={styles.attributionLogo}>
              {brand ? (
                <TMDBLogo width="auto" height={25} opacity={0.3} />
              ) : null}
            </View>
          </>
        ) : null}
        <CoverGradient />
        {movie.youTubeTrailerKey ? (
          <Pressable
            onPress={() => {
              if (movie.youTubeTrailerKey) {
                navigation.navigate("YouTubePlayerModal", {
                  key: movie.youTubeTrailerKey,
                });
              }
            }}
            style={[styles.playCover, { bottom: height / 4 }]}
          >
            <Box style={[styles.playIcon]}>
              <View style={styles.playIconContainer}>
                <FontAwesome
                  name="play"
                  color={dark ? "#FFF" : "#000"}
                  size={15}
                />
              </View>
            </Box>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.fill} pointerEvents="none" />
      <View style={styles.fill} pointerEvents="none" />
      {isPartner ? (
        <Box style={styles.partnerStar}>
          <View style={styles.partnerStarContainer}>
            <FontAwesome name="star" size={8} color="#FFD700" />
          </View>
        </Box>
      ) : null}
      <View style={styles.content}>
        <View style={[styles.titleContainer, styles.contentSection]}>
          <Text
            variant="bigTitle"
            style={[styles.spacingRight, styles.movieTitle]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {movie.name}
          </Text>
          <Text variant="smallCaption" style={styles.year}>
            {movie.releaseYear}
          </Text>
        </View>
        <View style={styles.categoryLabels}>
          {movie.genres.map((genre, i) =>
            // Only show 8 labels in total
            i < 8 ? (
              <CategoryLabel
                key={genre}
                labelText={i < 7 ? genre : "..."}
                style={[
                  i !== movie.genres.length - 1 ? styles.spacingRight : {},
                  styles.categoryLabel,
                ]}
              />
            ) : null
          )}
        </View>
        <View style={styles.fill}>
          {
            // TODO: This is currently not scrollable with the swipe cards
          }
          <ScrollView style={styles.fill}>
            <Text variant="smallCaption" style={styles.description}>
              {movie.description}
            </Text>
          </ScrollView>
        </View>
        {onCrossPress || onRefreshPress || onCheckPress ? (
          <View style={[styles.actionButtons]}>
            {onCrossPress ? (
              <ActionButton
                name="times"
                style={styles.rightButtonMargin}
                color="#F62323"
                onPress={() => onCrossPress()}
              />
            ) : null}
            {onRefreshPress ? (
              <ActionButton
                name="refresh"
                style={styles.rightButtonMargin}
                color="#CCC"
                size="small"
                onPress={() => onRefreshPress()}
              />
            ) : null}
            {onCheckPress ? (
              <ActionButton
                name="check"
                color="#1EEC64"
                onPress={() => onCheckPress()}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </Box>
  );
};

function CoverGradient() {
  const { dark } = useTheme();

  return (
    <Svg height="100%" width="100%">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0.4">
          <Stop
            offset="0.65"
            stopColor={dark ? "#000" : "#FFF"}
            stopOpacity={1}
          />
          <Stop offset="1" stopColor={dark ? "#000" : "#FFF"} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill={`url(#grad)`} />
    </Svg>
  );
}

type ActionButtonProps = Pick<
  React.ComponentProps<typeof FontAwesome>,
  "name" | "color"
> &
  PressableProps & { size?: "small" | "regular" };

function ActionButton({
  name,
  color,
  style,
  size = "regular",
  ...otherProps
}: ActionButtonProps) {
  const { dark } = useTheme();

  return (
    <Pressable
      {...otherProps}
      style={({ pressed }) => [
        styles.actionButton,
        size === "regular"
          ? styles.actionRegularButton
          : styles.actionSmallButton,
        {
          backgroundColor: dark
            ? pressed
              ? "#202020"
              : "#101010"
            : pressed
            ? "#DDDDDD"
            : "#EEEEEE",
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <FontAwesome
        name={name}
        size={size === "regular" ? 15 : 10}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    flex: 1.45,
    paddingHorizontal: Styling.spacingLarge,
  },
  contentSection: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  movieTitle: {
    flex: 1,
    fontFamily: "montserrat-bold",
  },
  year: {
    fontFamily: "montserrat-italic",
  },
  spacingRight: {
    marginRight: Styling.spacingSmall,
  },
  categoryLabel: {
    marginBottom: Styling.spacingSmall,
  },
  categoryLabels: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  partnerStar: {
    borderRadius: 100,
    padding: Styling.spacingSmall / 1.2,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  partnerStarContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    textAlign: "justify",
  },
  actionButtons: {
    paddingVertical: Styling.spacingMedium,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  actionButton: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  actionRegularButton: {
    height: 50,
    width: 50,
  },
  actionSmallButton: {
    height: 40,
    width: 40,
  },
  rightButtonMargin: {
    marginRight: Styling.spacingLarge,
  },
  attributionLogo: {
    position: "absolute",
    right: Styling.spacingMedium,
    top: Styling.spacingLarge,
    height: 25,
    width: 40,
  },
  playCover: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  playIcon: {
    padding: Styling.spacingMedium * 1.5,
    borderRadius: 100,
    opacity: 0.8,
  },
  playIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default MovieCard;
