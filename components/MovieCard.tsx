import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
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
import Styling from "../constants/Styling";
import { Movie } from "../src/API";
import { IMAGE_PREFIX } from "../utils/movieApi";
import { Box, BoxProps, ContainerProps, Text } from "./Themed";

export interface MovieCardProps extends ContainerProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  style,
  ...otherProps
}) => {
  return (
    <Box
      {...otherProps}
      style={[styles.fill, style]}
      lightColor="#FFF"
      darkColor="#000"
    >
      <View style={styles.background}>
        <Image
          source={{
            uri: IMAGE_PREFIX + movie.coverUri,
          }}
          resizeMode="cover"
          style={styles.background}
        />
        <CoverGradient />
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
            i + 1 < 9 ? (
              <CategoryLabel
                key={genre}
                labelText={i + 1 < 8 ? genre : "..."}
                style={i !== movie.genres.length - 1 ? styles.spacingRight : {}}
              />
            ) : null
          )}
        </View>
        <View style={styles.fill}>
          {
            // TODO: This is currently not scrollable
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
            style={styles.leftActionButton}
            color="#F62323"
          />
          <ActionButton name="check" color="#1EEC64" />
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
        <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0.5">
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
  PressableProps;

function ActionButton({
  name,
  color,
  style,
  ...otherProps
}: ActionButtonProps) {
  const { dark } = useTheme();

  return (
    <Pressable
      {...otherProps}
      style={({ pressed }) => [
        styles.actionButton,
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
      <FontAwesome name={name} size={15} color={color} />
    </Pressable>
  );
}

interface CategoryLabelProps extends BoxProps {
  labelText: string;
}

function CategoryLabel({
  labelText,
  style,
  ...otherProps
}: CategoryLabelProps) {
  return (
    <Box
      {...otherProps}
      style={[styles.categoryLabel, style]}
      lightColor="#EEEEEE"
      darkColor="#101010"
    >
      <Text variant="smallCaption" lightColor="#555555" darkColor="#555555">
        {labelText}
      </Text>
    </Box>
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
    flex: 1.1,
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
    borderRadius: 100,
    paddingHorizontal: Styling.spacingSmall,
    paddingVertical: 2,
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
  },
  actionButton: {
    height: 50,
    width: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  leftActionButton: {
    marginRight: Styling.spacingLarge * 2,
  },
});
export default MovieCard;
