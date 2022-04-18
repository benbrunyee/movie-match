import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth } from "aws-amplify";
import { brand } from "expo-device";
import React from "react";
import { Alert, Pressable } from "react-native";
import Colors from "../constants/Colors";
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
const Tab = createNativeStackNavigator<any>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [, setUserContext] = useUserContext();

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
        }}
      />
      <BottomTab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          title: "Matches",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="circle-o" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => {
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
              }}
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

  return (
    <FontAwesome
      size={25}
      color={Colors[colorScheme].text}
      style={{ marginRight: 15 }}
      {...props}
    />
  );
}

export default BottomTabNavigator;
