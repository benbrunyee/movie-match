import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BottomTabHeaderProps,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { brand } from "expo-device";
import React, { useCallback } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
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
  const [, setUserContext] = useUserContext();

  const signOut = useCallback(() => {
    const onPress = () =>
      Auth.forgetDevice()
        .catch(() => {})
        .finally(() => {
          Auth.signOut().then(async () => {
            await AsyncStorage.clear();

            setUserContext({
              email: "",
              sub: "",
              signedIn: false,
              connectedPartner: "",
              userDbObj: {},
            });
          });
        });

    // Brand returns null if on web
    if (!brand) {
      // If web, just sign out
      onPress();
      return;
    }

    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Yes",
        onPress,
      },
      {
        text: "No",
      },
    ]);
  }, [setUserContext]);

  return (
    <BottomTab.Navigator
      initialRouteName={DEFAULT_ROOT_ROUTE}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="circle-o-notch" color={color} />
          ),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          header: Header,
          headerTitle: "Matches",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="circle-o" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          header: Header,
          headerTitle: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={signOut}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <HeaderRightIcon name="sign-out" />
            </Pressable>
          ),
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

function HeaderRightIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
}) {
  const colorScheme = useColorScheme();

  return <FontAwesome size={20} color={Colors[colorScheme].text} {...props} />;
}

const Header: React.FC<BottomTabHeaderProps> = ({
  layout,
  options: { headerTitle, headerRight = () => null },
}) => {
  const { dark } = useTheme();
  const { top } = useSafeAreaInsets();
  const button = headerRight({});

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
      <Text variant="caption" style={[styles.text]}>
        {headerTitle}
      </Text>
      {button}
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
  },
});

export default BottomTabNavigator;
