import React from "react";
import { StyleSheet, View } from "react-native";
import { MenuItem, Text } from "../components/Themed";
import { RootTabScreenProps } from "../types";

const SettingsScreen: React.FC<RootTabScreenProps<"Settings">> = ({
  navigation,
}) => {
  return (
    <View>
      <View>
        <MenuItem
          bottomBorder
          onPress={() => {
            navigation.navigate("ConnectParter");
          }}
        >
          <Text>Connect to partner</Text>
        </MenuItem>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuItem: {},
});

export default SettingsScreen;
