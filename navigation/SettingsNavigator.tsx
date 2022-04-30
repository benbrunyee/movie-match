import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps
} from "@react-navigation/native-stack";
import { brand } from "expo-device";
import React, { useCallback } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import Styling from "../constants/Styling";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useUserContext } from "../context/UserContext";
import { auth } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import ConnectPartnerScreen from "../screens/ConnectPartnerScreen";
import LikedMoviesScreen from "../screens/LikedMoviesScreen";
import SearchOptionsScreen from "../screens/SearchOptions";
import SettingsScreen from "../screens/SettingsScreen";
import { RootTabScreenProps, SettingsParamList } from "../types";
import { DEFAULT_SETTINGS_ROUTE } from "./defaultRoutes";

const SettingsStack = createNativeStackNavigator<SettingsParamList>();

const SettingsNavigator = (
  props: RootTabScreenProps<"Settings">
): JSX.Element => {
  const [, setUserContext] = useUserContext();
  const notificationDispatch = useNotificationDispatch();

  const signOut = useCallback(() => {
    // Brand returns null if on web
    if (!brand) {
      // If web, just sign out
      auth.signOut();
      return;
    }

    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: () => auth.signOut(),
      },
    ]);
  }, [setUserContext]);

  const clearNotifications = useCallback(() => {
    notificationDispatch({
      type: "CLEAR",
    });
  }, [notificationDispatch]);

  return (
    <SettingsStack.Navigator
      initialRouteName={DEFAULT_SETTINGS_ROUTE}
      screenListeners={{
        blur: clearNotifications,
      }}
      screenOptions={{
        header: (props) => <SettingsInnerHeader {...props} />,
      }}
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
          headerRight: () => (
            <Pressable
              onPress={signOut}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <HeaderIcon name="sign-out" />
            </Pressable>
          ),
        }}
      />
      <SettingsStack.Screen
        name="SearchOptions"
        component={SearchOptionsScreen}
        options={{
          headerTitle: "Search Options",
        }}
      />
      <SettingsStack.Screen
        name="LikedMovies"
        component={LikedMoviesScreen}
        options={{
          headerTitle: "Liked Movies",
        }}
      />
      <SettingsStack.Screen
        name="ConnectPartner"
        component={ConnectPartnerScreen}
        options={{
          headerTitle: "Connect",
        }}
      />
    </SettingsStack.Navigator>
  );
};

interface HeaderIconProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  size?: number;
}

function HeaderIcon({ size = 20, ...otherProps }: HeaderIconProps) {
  const colorScheme = useColorScheme();

  return (
    <FontAwesome {...otherProps} size={size} color={Colors[colorScheme].text} />
  );
}

const SettingsInnerHeader = ({
  options: { headerTitle, headerRight = (props) => null },
  navigation,
  route,
}: NativeStackHeaderProps): JSX.Element => {
  const { dark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const headerRightElem = headerRight({ canGoBack: false });

  return (
    <Box
      style={[
        styles.tab,
        {
          paddingTop: insets.top
            ? insets.top + Styling.spacingSmall
            : Styling.spacingMedium,
          // TODO: Shadow not showing
          shadowColor: dark ? "#FFF" : "#000",
          width,
        },
      ]}
      darkColor="#000"
      lightColor="#FFF"
    >
      <View style={styles.left}>
        {route.name !== "SettingsScreen" ? (
          <Pressable onPress={() => navigation.goBack()}>
            <FontAwesome
              name="arrow-left"
              size={20}
              style={styles.leftIcon}
              color={dark ? "#FFF" : "#000"}
            />
          </Pressable>
        ) : null}
        <Text variant="caption" style={[styles.text]}>
          {headerTitle}
        </Text>
      </View>
      {headerRightElem}
    </Box>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    paddingHorizontal: Styling.spacingMedium,
    paddingBottom: Styling.spacingMedium,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    marginRight: Styling.spacingMedium,
  },
  text: {
    textTransform: "uppercase",
    fontFamily: "montserrat-bold",
    letterSpacing: 5,
  },
});

export default SettingsNavigator;
