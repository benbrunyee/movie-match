import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import YouTubePlayer from "react-native-youtube-iframe";
import { Box } from "../components/Themed";
import Styling from "../constants/Styling";
import { RootStackScreenProps } from "../types";

const YouTubePlayerModal = ({
  navigation,
  route,
}: RootStackScreenProps<"YouTubePlayerModal">): JSX.Element => {
  // Autoplay
  const [playing, setPlaying] = useState(true);

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        // Close the modal
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Root");
      }}
    >
      <Box
        style={[styles.container, styles.padding]}
        darkColor="rgba(0, 0, 0, 0.9)"
        lightColor="rgba(0, 0, 0, 0.9)"
      >
        <Pressable
          onPress={(e) => {
            // When pressing the YouTube player, do not trigger the close
            e.stopPropagation();
          }}
        >
          <YouTubePlayer
            height={300}
            play={playing}
            onChangeState={(state) => state === "ended" && setPlaying(false)}
            videoId={route.params.key}
          />
        </Pressable>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  padding: {
    padding: Styling.spacingMedium,
  },
});

export default YouTubePlayerModal;
