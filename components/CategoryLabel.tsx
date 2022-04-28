import React from "react";
import { StyleSheet } from "react-native";
import Styling from "../constants/Styling";
import { Box, BoxProps, Text } from "./Themed";

interface CategoryLabelProps extends BoxProps {
  labelText: string;
}

function CategoryLabel({
  labelText,
  style,
  ...otherProps
}: CategoryLabelProps) {
  return (
    <Box
      {...otherProps}
      style={[styles.categoryLabel, style]}
      lightColor="#EEEEEE"
      darkColor="#101010"
    >
      <Text variant="smallCaption" lightColor="#555555" darkColor="#555555">
        {labelText}
      </Text>
    </Box>
  );
}

const styles = StyleSheet.create({
  categoryLabel: {
    borderRadius: 100,
    paddingHorizontal: Styling.spacingSmall,
    paddingVertical: 2,
  },
});

export default CategoryLabel;