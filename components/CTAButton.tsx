import React from "react";
import { StyleSheet } from "react-native";
import { Button, ButtonProps, Text, TextProps } from "./Themed";

export interface CTAButtonProps extends ButtonProps {
  text: string;
  textProps?: Omit<TextProps, "children">;
}

const CTAButton = ({
  text,
  textProps,
  ...otherProps
}: CTAButtonProps): JSX.Element => {
  return (
    <Button {...otherProps} lightColor="#1EEC64" darkColor="#1EEC64">
      <Text
        {...textProps}
        style={styles.text}
        lightColor="#FFF"
        darkColor="#000"
      >
        {text}
      </Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "montserrat-bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default CTAButton;
