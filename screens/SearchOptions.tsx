import React from "react";
import { StyleSheet, View } from "react-native";
import SearchOptionsForm from "../components/SearchOptionsForm";
import { Container, Text, useThemeColor } from "../components/Themed";
import Styling from "../constants/Styling";
import { SettingsTabScreenProps } from "../types";

const SearchOptionsScreen: React.FC<
  SettingsTabScreenProps<"SearchOptions">
> = () => {
  const borderBottomColor = useThemeColor({}, "borderColor");

  return (
    <View>
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
      <View style={styles.centered}>
        <Container style={styles.formContainer}>
          <SearchOptionsForm style={styles.form} />
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
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    height: "85%",
  },
  form: {
    margin: Styling.spacingLarge,
  },
});

export default SearchOptionsScreen;
