import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ConnectPartnerModal from "../screens/ConnectPartnerModal";
import SearchOptionsScreen from "../screens/SearchOptions";
import SettingsScreen from "../screens/SettingsScreen";
import { SettingsParamList } from "../types";

const Stack = createNativeStackNavigator<SettingsParamList>();

const Settings: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        // options={{
        //   title: "Settings",
        // }}
      />
      <Stack.Screen
        name="SearchOptions"
        component={SearchOptionsScreen}
        options={{ title: "Search Options" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="ConnectPartnerModal"
          component={ConnectPartnerModal}
          options={{
            title: "Connect Partner",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default Settings;
