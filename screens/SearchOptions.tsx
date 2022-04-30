import React from "react";
import { StyleSheet, View } from "react-native";
import SearchOptionsForm from "../components/SearchOptionsFormTwo";
import Styling from "../constants/Styling";
import { SettingsTabScreenProps } from "../types";

const SearchOptionsScreen = (
  props: SettingsTabScreenProps<"SearchOptions">
): JSX.Element => {
  return (
    <View style={styles.container}>
      <SearchOptionsForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Styling.spacingMedium
  },
});

export default SearchOptionsScreen;
