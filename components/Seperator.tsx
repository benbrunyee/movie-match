import React from "react";
import { StyleSheet } from "react-native";
import { Box, BoxProps } from "./Themed";

// TODO: Theme this
const textLightColor = "#6C6C6C";
const textDarkColor = "#E1E1E1";

export interface SeperatorProps
  extends Omit<BoxProps, "lightColor" | "darkColor"> {}

const Seperator = ({ style, ...otherProps }: SeperatorProps): JSX.Element => {
  return (
    <Box
      {...otherProps}
      style={[styles.bar, style]}
      lightColor={textLightColor}
      darkColor={textDarkColor}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    height: 2,
    borderRadius: 10,
  },
});
export default Seperator;
