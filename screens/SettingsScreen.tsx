import { brand } from "expo-device";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MenuItem, Text } from "../components/Themed";
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
      <View style={styles.container}>
        <Text variant="title">Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <View>
        {connectionRequest ? (
          <MenuItem
            bottomBorder
            onPress={async () => {
              setIsAccepting(true);
              await showPendingConReq(connectionRequest);
              await reloadConReq();
              setIsAccepting(false);
            }}
            disabled={isAccepting}
          >
            <Text>Pending connection request</Text>
          </MenuItem>
        ) : null}
        {Object.entries(MODALS).map(([modal, obj]) => (
          <MenuItem
            key={modal}
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
    alignItems: "center",
    justifyContent: "center",
  },
});

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

export default SettingsScreen;
