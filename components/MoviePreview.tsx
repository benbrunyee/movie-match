import { useTheme } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import CategoryLabel from "../components/CategoryLabel";
import Styling from "../constants/Styling";
import { MovieBase } from "../functions/src/util/apiTypes";
import { IMAGE_PREFIX } from "../utils/movieApi";
import { Box, Text } from "./Themed";

const MoviePreview = (item: MovieBase): JSX.Element => {
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
          <Text
            variant="smallCaption"
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
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
  fill: {
    flex: 1,
  },
  spacingRight: {
    marginRight: Styling.spacingSmall,
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

export default MoviePreview;
