import React from "react";
import { StyleSheet, View } from "react-native";
import { SuccessText } from "../components/Notification";
import SearchOptionsForm from "../components/SearchOptionsForm";
import Styling from "../constants/Styling";
import { useNotificationDispatch } from "../context/NotificationContext";
import { SettingsTabScreenProps } from "../types";

const SearchOptionsScreen = (
  props: SettingsTabScreenProps<"SearchOptions">
): JSX.Element => {
  const notificationDispatch = useNotificationDispatch();

  return (
    <View style={styles.container}>
      <SearchOptionsForm
        afterSubmit={() => {
          notificationDispatch({
            type: "ADD",
            item: {
              type: "SUCCESS",
              item: ({ dismiss }) => (
                <SuccessText onPress={dismiss}>Settings saved</SuccessText>
              ),
              position: "TOP",
              autoHideMs: 1000,
            },
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Styling.spacingMedium,
  },
});

export default SearchOptionsScreen;
