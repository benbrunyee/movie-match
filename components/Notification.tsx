import { brand } from "expo-device";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styling from "../constants/Styling";
import {
  NotificationItemOptions,
  useNotificationDispatch,
  useNotificationState
} from "../context/NotificationContext";
import { Box, Text, TextProps } from "./Themed";

const NotificationItem = ({
  item,
  position = "CENTER",
  type = "STANDARD",
  cover = false,
}: NotificationItemOptions): JSX.Element => {
  const dispatch = useNotificationDispatch();

  const backgroundColor = {
    lightColor: "#FFFFFF",
    darkColor: "#1C1C1C",
  };

  if (type === "ERROR") {
    backgroundColor.lightColor = "#FF5F5F";
    backgroundColor.darkColor = "#FF5F5F";
  } else if (type === "SUCCESS") {
    backgroundColor.lightColor = "#1EEC64";
    backgroundColor.darkColor = "#1EEC64";
  }

  const notification = (
    <Box {...backgroundColor} style={styles.notificationBox}>
      {item({
        dismiss: () => dispatch({ type: "CLEAR" }),
      })}
    </Box>
  );

  return (
    <View
      style={{
        ...styles.container,
        ...(position === "BOTTOM" && styles.bottomContainer),
        ...(position === "CENTER" && styles.centerContainer),
        ...(position === "TOP" && styles.topContainer),
        ...(cover && styles.background),
      }}
      {...(!cover && { pointerEvents: "box-none" })}
    >
      {brand === "Apple" ? (
        <SafeAreaView>{notification}</SafeAreaView>
      ) : (
        notification
      )}
    </View>
  );
};

export const ErrorText = (props: TextProps): JSX.Element => {
  return <Text {...props} lightColor="#FFF" darkColor="#FFF" />;
};

export const SuccessText = (props: TextProps): JSX.Element => {
  return <Text {...props} lightColor="#FFF" darkColor="#FFF" />;
};

export const FadedErrorText = (props: TextProps): JSX.Element => {
  return (
    <Text
      {...props}
      lightColor="rgba(255, 255, 255, 0.25)"
      darkColor="rgba(255, 255, 255, 0.25)"
    />
  );
};

export const FadedSuccessText = (props: TextProps): JSX.Element => {
  return (
    <Text
      {...props}
      lightColor="rgba(0, 0, 0, 0.1)"
      darkColor="rgba(0, 0, 0, 0.1)"
    />
  );
};

export const NotificationDisplay = () => {
  const notification = useNotificationState();

  return notification ? <NotificationItem {...notification} /> : null;
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    zIndex: 1,
  },
  centerContainer: {
    justifyContent: "center",
  },
  topContainer: {
    justifyContent: "flex-start",
  },
  bottomContainer: {
    justifyContent: "flex-end",
  },
  notificationBox: {
    borderRadius: Styling.borderRadius,
    margin: Styling.spacingSmall,
    padding: Styling.spacingMedium,
  },
});
