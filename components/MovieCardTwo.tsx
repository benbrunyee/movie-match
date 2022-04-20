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
import Seperator from "./Seperator";
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
      <View style={[styles.fill, styles.content]}>
        <View style={[styles.title, styles.contentSection]}>
          <Text variant="bigTitle" style={styles.spacingRight}>
            {movie.name}
          </Text>
          <Text variant="smallCaption" style={styles.year}>
            {movie.releaseYear}
          </Text>
        </View>
        <View style={[styles.contentSection, styles.categoryLabels]}>
          {movie.genres.map((genre, i) => (
            <CategoryLabel
              key={genre}
              labelText={genre}
              style={i !== movie.genres.length - 1 ? styles.spacingRight : {}}
            />
          ))}
        </View>
        <View style={[styles.contentSection, styles.fill]}>
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
          <Seperator style={styles.seperator} />
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
        <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
          <Stop
            offset="0.32"
            stopColor={dark ? "#000" : "#FFF"}
            stopOpacity={1}
          />
          <Stop offset="1" stopColor={dark ? "#000" : "#FFF"} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#grad)" />
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
      <Box darkColor="#101010" lightColor="#EEEEEE">
        <FontAwesome name={name} size={15} color={color} />
      </Box>
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
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    paddingHorizontal: Styling.spacingLarge,
  },
  contentSection: {
    marginBottom: 10,
  },
  title: {
    flexDirection: "row",
    alignItems: "baseline",
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
  },
  categoryLabels: {
    flexDirection: "row",
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
  seperator: {
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowOffset: {
      height: -5,
      width: 0,
    },
  },
});
export default MovieCard;
