import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { brand } from "expo-device";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import { Box, MenuItem, MenuItemProps, Text } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  AcceptRequestMutation,
  AcceptRequestMutationVariables,
  ConnectionRequestStatus,
  ListConnectionRequestsQuery,
  ListConnectionRequestsQueryVariables
} from "../src/API";
import { acceptRequest } from "../src/graphql/mutations";
import { listConnectionRequests } from "../src/graphql/queries";
import { SettingsParamList, SettingsTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";

interface ScreenInterface {
  text: string;
  iconName: React.ComponentProps<typeof FontAwesome>["name"];
}

const SCREENS: { [key in keyof Partial<SettingsParamList>]: ScreenInterface } =
  {
    ConnectPartner: {
      text: "Connect to partner",
      iconName: "group",
    },
    SearchOptions: {
      text: "Search options",
      iconName: "search",
    },
  };

const SettingsScreen: React.FC<SettingsTabScreenProps<"SettingsScreen">> = ({
  navigation,
}) => {
  const [userContext] = useUserContext();
  // Store the ID of the connection request if there is one
  const [connectionRequest, setConnectionRequest] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  const reloadConReq = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
    }

    try {
      const requests = await callGraphQL<
        ListConnectionRequestsQuery,
        ListConnectionRequestsQueryVariables
      >(listConnectionRequests, {
        filter: {
          and: [
            {
              receiver: { eq: userContext.sub },
            },
            {
              status: { eq: ConnectionRequestStatus.PENDING },
            },
          ],
        },
      });

      const conReqs = requests.data?.listConnectionRequests?.items;

      if (!conReqs) {
        throw new Error("Failed to load connection requests");
      }

      setConnectionRequest(conReqs?.[0]?.id || "");
    } catch (e) {
      console.error(e);
      alert("Failed to load connection requests");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Run on focus
    const unsubscribe = navigation.addListener("focus", reloadConReq);
    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return (
      <Box style={[styles.container, styles.centered]}>
        <Text variant="title">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box style={styles.container} darkColor="#000">
      <View style={styles.profileSection}>
        <ProfileHeader />
      </View>
      <View style={styles.menuContainer}>
        {connectionRequest ? (
          <MenuOption
            iconName="bell"
            iconColor="#1EEC64"
            text="Connection Request!"
            bottomSpacing={true}
            onPress={async () => {
              setIsAccepting(true);
              await showPendingConReq(connectionRequest);
              await reloadConReq();
              setIsAccepting(false);
            }}
            disabled={isAccepting}
          />
        ) : null}
        {Object.entries(SCREENS).map(([modal, obj], i) => (
          <MenuOption
            key={modal}
            onPress={() => {
              navigation.navigate(modal as keyof SettingsParamList);
            }}
            iconName={obj.iconName}
            text={obj.text}
            bottomSpacing={i + 1 < Object.entries(SCREENS).length}
          >
            <Text>{obj.text}</Text>
          </MenuOption>
        ))}
      </View>
    </Box>
  );
};

interface MenuOptionProps extends MenuItemProps {
  bottomSpacing?: boolean;
  iconName: React.ComponentProps<typeof FontAwesome>["name"];
  iconColor?: string;
  text: string;
}

const MenuOption = ({
  text,
  iconName,
  iconColor,
  bottomSpacing,
  ...otherProps
}: MenuOptionProps) => {
  const { dark } = useTheme();

  if (!iconColor) {
    iconColor = dark ? "#FFF" : "#111";
  }

  return (
    <MenuItem
      {...otherProps}
      style={[menuStyles.container, menuStyles.bottomSpacing]}
    >
      <View style={menuStyles.content}>
        <View style={menuStyles.iconContainer}>
          <FontAwesome name={iconName} size={25} color={iconColor} />
        </View>
        <View>
          <Text variant="caption" style={menuStyles.text}>
            {text}
          </Text>
        </View>
      </View>
      <FontAwesome
        name="arrow-right"
        size={10}
        color={dark ? "#FFF" : "#111"}
      />
    </MenuItem>
  );
};

const showPendingConReq = async (id: string) => {
  if (!brand) {
    alert("Accepting connection request");
    await acceptConReq(id);
    return;
  }

  await new Promise<void>((resolve) => {
    Alert.alert("Accept connection request?", undefined, [
      {
        text: "Yes",
        onPress: () => acceptConReq(id).finally(resolve),
      },
      {
        text: "No",
        onPress: () => resolve(),
      },
    ]);
  });
};

const acceptConReq = async (id: string) => {
  try {
    await callGraphQL<AcceptRequestMutation, AcceptRequestMutationVariables>(
      acceptRequest,
      {
        input: {
          requestId: id,
        },
      }
    );
  } catch (e) {
    console.error(e);
    alert("Failed to accept connection request");
  }
};

const menuStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSpacing: {
    marginBottom: Styling.spacingSmall,
  },
  iconContainer: {
    width: 35,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Styling.spacingSmall,
  },
  text: {
    fontFamily: "montserrat-semibold",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    padding: Styling.spacingLarge,
  },
  menuContainer: {
    paddingHorizontal: Styling.spacingMedium,
  },
});

export default SettingsScreen;
