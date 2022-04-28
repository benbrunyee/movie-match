import React from "react";
import { StyleSheet, View } from "react-native";
import SearchOptionsForm from "../components/SearchOptionsForm";
import { Container, Text, useThemeColor } from "../components/Themed";
import Styling from "../constants/Styling";
import { SettingsTabScreenProps } from "../types";

const SearchOptionsScreen = (
  props: SettingsTabScreenProps<"SearchOptions">
): JSX.Element => {
  const borderBottomColor = useThemeColor({}, "borderColor");

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.titleContainer,
          {
            borderBottomColor,
          },
        ]}
      >
        <Text variant="title">Search settings</Text>
      </View>
      <View style={[styles.centered, styles.contentContainer]}>
        <Container style={styles.formContainer}>
          <SearchOptionsForm />
        </Container>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    padding: Styling.spacingMedium,
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    padding: Styling.spacingLarge,
  },
  formContainer: {
    flex: 1,
    padding: Styling.spacingLarge,
  },
});

export default SearchOptionsScreen;
