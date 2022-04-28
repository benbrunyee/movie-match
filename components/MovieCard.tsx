import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { brand } from "expo-device";
import React from "react";
import {
  Image,
  Pressable,
  PressableProps,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import TMDBLogo from "../assets/images/tmdb-logo.svg";
import Styling from "../constants/Styling";
import { MovieBase } from "../functions/src/util/apiTypes";
import { IMAGE_PREFIX } from "../utils/movieApi";
import CategoryLabel from "./CategoryLabel";
import { Box, ContainerProps, Text } from "./Themed";

export interface MovieCardProps extends ContainerProps {
  movie: MovieBase;
  onCrossPress?: () => void;
  onCheckPress?: () => void;
  onRefreshPress?: () => void;
}

const MovieCard = ({
  movie,
  style,
  onCrossPress = () => {},
  onCheckPress = () => {},
  onRefreshPress = () => {},
  ...otherProps
}: MovieCardProps): JSX.Element => {
  return (
    <Box
      {...otherProps}
      style={[styles.fill, style]}
      lightColor="#FFF"
      darkColor="#000"
    >
      <View style={styles.background}>
        {movie.coverUri ? (
          <Image
            source={{
              uri: IMAGE_PREFIX + movie.coverUri,
            }}
            resizeMode="cover"
            style={styles.background}
          />
        ) : null}
        <CoverGradient />
        <View style={styles.attributionLogo}>
          {brand ? <TMDBLogo width="auto" height={25} opacity={0.3} /> : null}
        </View>
      </View>
      <View style={styles.fill} />
      <View style={styles.fill} />
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
            // TODO: This is currently not scrollable
            // ! TODO: Implement view to see movie in detail
          }
          <ScrollView
            style={styles.fill}
            showsVerticalScrollIndicator
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Text variant="smallCaption" style={styles.description}>
              {movie.description}
            </Text>
          </ScrollView>
        </View>
        <View style={[styles.actionButtons]}>
          <ActionButton
            name="times"
            style={styles.rightButtonMargin}
            color="#F62323"
            onPress={() => onCrossPress()}
          />
          <ActionButton
            name="refresh"
            style={styles.rightButtonMargin}
            color="#CCC"
            size="small"
            onPress={() => onRefreshPress()}
          />
          <ActionButton
            name="check"
            color="#1EEC64"
            onPress={() => onCheckPress()}
          />
        </View>
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
    flex: 1.4,
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
});
export default MovieCard;
