import React from "react";
import { StyleSheet, View } from "react-native";
import { MenuItem, Text } from "../components/Themed";
import { SettingsParamList, SettingsTabScreenProps } from "../types";

interface ModalInterface {
  text: string;
}

const MODALS: { [key in keyof Partial<SettingsParamList>]: ModalInterface } = {
  ConnectPartnerModal: {
    text: "Connect to partner",
  },
  SearchOptions: {
    text: "Search options",
  },
};

const SettingsScreen: React.FC<SettingsTabScreenProps<"Settings">> = ({
  navigation,
}) => {
  return (
    <View>
      <View>
        {Object.entries(MODALS).map(([modal, obj]) => (
          <MenuItem
            bottomBorder
            onPress={() => {
              navigation.navigate(modal as keyof SettingsParamList);
            }}
          >
            <Text>{obj.text}</Text>
          </MenuItem>
        ))}
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
