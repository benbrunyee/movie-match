import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps
} from "@react-navigation/native-stack";
import { Auth } from "aws-amplify";
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
import { useUserContext } from "../context/UserContext";
import useColorScheme from "../hooks/useColorScheme";
import ConnectPartner from "../screens/ConnectPartnerScreen";
import SearchOptionsScreen from "../screens/SearchOptions";
import SettingsScreen from "../screens/SettingsScreen";
import { SettingsParamList } from "../types";
import { DEFAULT_SETTINGS_ROUTE } from "./defaultRoutes";

const Stack = createNativeStackNavigator<SettingsParamList>();

const Settings: React.FC = () => {
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
        text: "No",
      },
      {
        text: "Yes",
        onPress,
      },
    ]);
  }, [setUserContext]);

  return (
    <Stack.Navigator initialRouteName={DEFAULT_SETTINGS_ROUTE}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          header: SettingsInnerHeader,
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
      <Stack.Screen
        name="SearchOptions"
        component={SearchOptionsScreen}
        options={{ title: "Search Options", header: SettingsInnerHeader }}
      />
      <Stack.Screen
        name="ConnectPartner"
        component={ConnectPartner}
        options={{
          header: SettingsInnerHeader,
          headerTitle: "Connect",
        }}
      />
    </Stack.Navigator>
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

const SettingsInnerHeader: React.FC<NativeStackHeaderProps> = ({
  options: { headerTitle, headerRight = () => {} },
  navigation,
  route,
}) => {
  const { dark } = useTheme();
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const headerRightElem = headerRight({ canGoBack: false });

  return (
    <Box
      style={[
        styles.tab,
        {
          paddingTop: top ? top + Styling.spacingSmall : Styling.spacingMedium,
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

export default Settings;
