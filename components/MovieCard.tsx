import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Styling from "../constants/Styling";
import { Movie } from "../src/API";
import { IMAGE_PREFIX } from "../utils/movieApi";
import { Container, ContainerProps, Text } from "./Themed";

export interface MovieCardProps extends ContainerProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  style,
  ...otherProps
}) => {
  return (
    <Container style={[styles.movieContainer, style]} {...otherProps}>
      {movie.coverUri ? (
        <Image
          source={{
            uri: IMAGE_PREFIX + movie.coverUri,
            height: 330,
            width: 220,
          }}
        />
      ) : null}
      <Text variant="title" style={styles.movieTitle}>
        {movie.name}
      </Text>
      {movie.releaseYear ? (
        <Text variant="caption" style={styles.movieYear}>
          Released: {movie.releaseYear}
        </Text>
      ) : null}
      {movie.rating ? (
        <View style={styles.rating}>
          <FontAwesome name="star" size={10} style={styles.star} />
          <Text variant="smallCaption">{movie.rating}/10</Text>
          {movie.ratingCount ? (
            <Text variant="smallCaption">{` - ${movie.ratingCount}`}</Text>
          ) : null}
        </View>
      ) : null}
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        variant="caption"
        style={styles.movieDescription}
      >
        {movie.description}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  movieContainer: {
    flex: 1,
    padding: Styling.spacingLarge,
    alignItems: "center",
    justifyContent: "center",
  },
  movieTitle: {
    textAlign: "center",
    margin: Styling.spacingSmall,
    maxWidth: 220,
  },
  movieYear: {
    textAlign: "center",
    marginBottom: Styling.spacingSmall,
  },
  buttonControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  movieDescription: {
    maxWidth: 220,
    marginBottom: Styling.spacingSmall,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Styling.spacingSmall,
  },
  star: {
    display: "flex",
    marginRight: 5,
  },
});
export default MovieCard;
