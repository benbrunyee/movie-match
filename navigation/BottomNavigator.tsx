import { FontAwesome } from "@expo/vector-icons";
import {
  BottomTabHeaderProps,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import Styling from "../constants/Styling";
import { useNotificationDispatch } from "../context/NotificationContext";
import useColorScheme from "../hooks/useColorScheme";
import DiscoverScreen from "../screens/DiscoverScreen";
import MatchesScreen from "../screens/MatchesScreen";
import { RootTabParamList } from "../types";
import { DEFAULT_ROOT_ROUTE } from "./defaultRoutes";
import Settings from "./Settings";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

// TODO: React has detected a change in the order of Hooks called by BottomTabNavigator
function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const notificationDispatch = useNotificationDispatch();

  return (
    <BottomTab.Navigator
      initialRouteName={DEFAULT_ROOT_ROUTE}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarShowLabel: false,
      }}
      screenListeners={{
        blur: () => {
          // Remove notifications if switching tab
          console.log("Removing notifications");
          notificationDispatch({
            type: "CLEAR",
          });
        },
      }}
    >
      <BottomTab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          header: BottomTabHeader,
          headerTitle: "Matches",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={25} {...props} />;
}

export const BottomTabHeader: React.FC<BottomTabHeaderProps> = ({
  layout,
  options: { headerTitle, headerRight = () => null, headerLeft = () => null },
}) => {
  const { dark } = useTheme();
  const { top } = useSafeAreaInsets();
  const headerRightElem = headerRight({});
  const headerLeftElem = headerLeft({});

  return (
    <Box
      style={[
        styles.tab,
        {
          paddingTop: top ? top + Styling.spacingSmall : Styling.spacingMedium,
          shadowColor: dark ? "#FFF" : "#000",
          width: layout.width,
        },
      ]}
      darkColor="#000"
      lightColor="#FFF"
    >
      {headerLeftElem}
      <Text variant="caption" style={[styles.text]}>
        {headerTitle}
      </Text>
      {headerRightElem}
    </Box>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    paddingHorizontal: Styling.spacingMedium,
    paddingBottom: Styling.spacingMedium,
  },
  text: {
    textTransform: "uppercase",
    fontFamily: "montserrat-bold",
    letterSpacing: 5,
  },
});

export default BottomTabNavigator;
