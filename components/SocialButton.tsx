import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Styling from "../constants/Styling";
import { Text } from "./Themed";

export type SocialType = "APPLE" | "GOOGLE";

export interface SocialButtonProps extends ViewProps {
  type: SocialType;
}

const SocialButton = ({
  type,
  ...otherProps
}: SocialButtonProps): JSX.Element => {
  return type === "APPLE" ? (
    <AppleButton {...otherProps} />
  ) : (
    <GoogleButton {...otherProps} />
  );
};

function GoogleButton({ style, ...otherProps }: View["props"]) {
  return (
    <View
      {...otherProps}
      style={[styles.socialButton, styles.googleButton, style]}
    >
      <FontAwesome
        name="google"
        size={20}
        color="#FFF"
        style={styles.socialIcon}
      />
      <View style={styles.socialButtonText}>
        <Text variant="smallCaption" lightColor="#FFF" darkColor="#FFF">
          Sign in with google
        </Text>
      </View>
    </View>
  );
}

function AppleButton({ style, ...otherProps }: View["props"]) {
  return (
    <View
      {...otherProps}
      style={[styles.socialButton, styles.appleButton, style]}
    >
      <FontAwesome
        name="apple"
        size={20}
        color="#000"
        style={styles.socialIcon}
      />
      <View style={styles.socialButtonText}>
        <Text variant="smallCaption" lightColor="#000" darkColor="#000">
          Sign in with apple
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    borderRadius: Styling.borderRadius,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    padding: Styling.spacingSmall,
  },
  socialIcon: {
    marginRight: Styling.spacingSmall,
  },
  socialButtonText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#DE4032",
  },
  appleButton: {
    backgroundColor: "#FFF",
  },
});

export default SocialButton;
