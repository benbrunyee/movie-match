import { brand } from "expo-device";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { animated, Spring } from "react-spring";
import Styling from "../constants/Styling";
import {
  NotificationItemOptions,
  useNotificationDispatch,
  useNotificationState
} from "../context/NotificationContext";
import { Box, Text, TextProps } from "./Themed";

const NotificationItem = ({
  item,
  type = "STANDARD",
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

  return brand === "Apple" ? (
    <SafeAreaView>{notification}</SafeAreaView>
  ) : (
    notification
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

const AnimatedView = animated(View);

export const NotificationDisplay = () => {
  const animationDuration = 100;
  const notification = useNotificationState();
  const [notificationCopy, setNotificationCopy] = useState<
    NotificationItemOptions | undefined
  >();
  const notificationDispatch = useNotificationDispatch();
  const [animate, setAnimate] = useState(false);
  const isAnimating = useRef(false);

  if (typeof notification?.autoHideMs !== "undefined") {
    // Set a timeout to clear the notification
    setTimeout(() => {
      notificationDispatch({
        type: "CLEAR",
      });
    }, notification.autoHideMs);
  }

  useEffect(() => {
    // If there was a notification that we have now cleared
    if (!notification && notificationCopy) {
      // Set item to animate out
      setAnimate(true);
      isAnimating.current = true;
      // Clear the notification from the ref after the animation time
      setTimeout(() => {
        setNotificationCopy(undefined);
        setAnimate(false);
        isAnimating.current = false;
      }, animationDuration);
    }

    if (notification) {
      // If we are animating then
      // ? TODO: Is this reliable as a queuing system?
      if (isAnimating.current) {
        setTimeout(() => {
          // If we are currently in the middle of an animation
          // then we wait the animation duration before setting the state
          setNotificationCopy(notification);
        }, animationDuration);
      } else {
        // We can set the state immediately
        setNotificationCopy(notification);
      }
    }
  }, [notification]);

  return notificationCopy ? (
    <View
      style={{
        ...styles.container,
        ...(notificationCopy.position === "BOTTOM" && styles.bottomContainer),
        ...(notificationCopy.position === "CENTER" && styles.centerContainer),
        ...(notificationCopy.position === "TOP" && styles.topContainer),
        ...(notificationCopy.cover && styles.background),
      }}
      {...(!notificationCopy.cover && { pointerEvents: "box-none" })}
    >
      <Spring
        from={{
          // Only the TOP and BOTTOM notifications are animated with position
          // CENTER is animated with opacity
          // TODO: Dynamic animation height
          ...(notificationCopy.position === "BOTTOM" && { marginBottom: 0 }),
          ...(notificationCopy.position === "CENTER" && { opacity: 1 }),
          ...(notificationCopy.position === "TOP" && { marginTop: 0 }),
        }}
        to={{
          ...(notificationCopy.position === "BOTTOM" && {
            marginBottom: animate ? -100 : 0,
          }),
          ...(notificationCopy.position === "CENTER" && {
            opacity: animate ? 0 : 1,
          }),
          ...(notificationCopy.position === "TOP" && {
            marginTop: animate ? -100 : 0,
          }),
        }}
        config={{
          duration: animationDuration,
        }}
      >
        {(props) => (
          <AnimatedView style={props}>
            <NotificationItem {...notificationCopy} />
          </AnimatedView>
        )}
      </Spring>
    </View>
  ) : null;
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
