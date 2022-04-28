import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Styling from "../constants/Styling";
import { Text } from "./Themed";

export interface SwitchTabProps<T extends string> {
  tabs: T[] | readonly T[];
  onSwitch?: (tab: T) => void;
  selectedTab: T;
}

const SwitchTab = <T extends string>({
  tabs,
  selectedTab,
  onSwitch = () => {},
}: SwitchTabProps<T>): JSX.Element => {
  const { dark } = useTheme();

  const tabColors = {
    selected: {
      light: "#111111",
      dark: "#FFFFFF",
    },
    default: {
      light: "#FFFFFF",
      dark: "#000000",
    },
  };

  const textColors = {
    selected: {
      light: "#EEEEEE",
      dark: "#101010",
    },
    default: {
      light: "#111111",
      dark: "#FFFFFF",
    },
  };

  return (
    <View style={styles.switch}>
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab;

        return (
          <Pressable
            key={tab}
            onPress={() => onSwitch(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: dark
                  ? isSelected
                    ? tabColors.selected.dark
                    : tabColors.default.dark
                  : isSelected
                  ? tabColors.selected.light
                  : tabColors.default.light,
              },
            ]}
          >
            <Text
              variant="caption"
              darkColor={
                isSelected ? textColors.selected.dark : textColors.default.dark
              }
              lightColor={
                isSelected
                  ? textColors.selected.light
                  : textColors.default.light
              }
              style={styles.tabText}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    flexDirection: "row",
    borderRadius: Styling.borderRadius,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Styling.spacingMedium,
    paddingVertical: Styling.spacingSmall,
  },
  tabText: {
    textTransform: "uppercase",
    fontFamily: "montserrat-bold",
  },
});

export default SwitchTab;
