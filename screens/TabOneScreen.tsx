import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View, TextInput, Button } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: number;
  release_date: string;
  popularity: number;
  overview: string;
}

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchValue, setSearchValue] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daisy you stink!!!</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <TextInput
          onChangeText={(text) => setSearchValue(text)}
          placeholder="Enter a movie to search"
        />
      </View>
      <View>
        <Button
          title="Search"
          onPress={async () => {
            if (!searchValue) {
              return;
            }

            const movies = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=0dd0cb2ac703e890ab3573c95612498a&query=${encodeURIComponent(
                searchValue
              )}`
            );
            const json = await movies.json();

            setMovies(json?.results || []);
          }}
        />
      </View>
      <View>
        {movies.map((movie) => (
          <Text key={movie.id}>{movie.title}</Text>
        ))}
      </View>
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
