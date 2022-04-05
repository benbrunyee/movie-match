import { GraphQLResult } from "@aws-amplify/api-graphql";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import BarCodeScanner from "../components/BarCodeScanner";
import { Text, useThemeColor } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  ConnectionRequestStatus,
  CreateConnectionRequestMutation,
  CreateConnectionRequestMutationVariables,
  ListConnectionRequestsQuery,
  ListConnectionRequestsQueryVariables,
  ListUsersQuery,
  User,
} from "../src/API";
import { createConnectionRequest } from "../src/graphql/mutations";
import { listConnectionRequests, listUsers } from "../src/graphql/queries";
import { RootStackScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";

const ConnectPartnerModal: React.FC<RootStackScreenProps<"ConnectParter">> = ({
  navigation,
}) => {
  const [userData, setUserData] = useState<User>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const borderBottomColor = useThemeColor({}, "borderColor");
  const [status, setStatus] = useState<"CONNECTED" | "DISCONNECTED">(
    "DISCONNECTED"
  );
  const [scanned, setScanned] = useState(false);

  const [userContext] = useUserContext();

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);

      // Load the connected partner if there is one
      try {
        const user = await callGraphQL<ListUsersQuery>(listUsers);
        const userObj = user.data?.listUsers?.items?.[0];

        if (!userObj) {
          throw new Error("Could not find user object");
        }

        setUserData(userObj);
      } catch (e) {
        console.error(e);
        setError("Failed to load data");
      }

      setIsLoading(false);
    }

    onLoad();

    // Set a timeout to reset the barcode scanner
    const timeout = setInterval(() => {
      setScanned(false);
    }, 5000);

    return () => {
      clearInterval(timeout);
    };
  }, []);

  const handleScan: BarCodeScannedCallback = useCallback(({ data, type }) => {
    setScanned(true);

    if (type !== "org.iso.QRCode" || !data) {
      alert("Invalid QR Code.");
      return;
    }

    if (data === userContext.sub) {
      alert("Cannot request yourself");
      return;
    }

    createConnectRequest(data)
      .then(() => {
        // setStatus("CONNECTED");
        alert("Sent request");
      })
      .catch((err) => {
        console.error(err);

        if (err.name === "DuplicateConnectionError") {
          alert("Request already made");
          return;
        } else {
          alert("Failed to request user");
          return;
        }
      });
  }, []);

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return <View></View>;
  }

  return (
    <View>
      {isLoading ? (
        <Text variant="title">Loading...</Text>
      ) : (
        <>
          <View
            style={[
              styles.titleContainer,
              {
                borderBottomColor,
              },
            ]}
          >
            <Text variant="title">Connect partner</Text>
          </View>
          <View style={styles.topSection}>
            <Text
              style={{
                color: status === "CONNECTED" ? "green" : "red",
              }}
            >{`Status: ${status}`}</Text>
            <Text>Your QR code</Text>
            <QRCode value={userContext.sub} size={250} />
          </View>
          <View style={styles.bottomSection}>
            <Text variant="subtitle">Scan Partner's QR Code</Text>
            <View style={styles.cameraContainer}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleScan}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

async function createConnectRequest(receiverSub: string) {
  // Check if there is an existing entry
  const existingEntries = (
    await callGraphQL<
      ListConnectionRequestsQuery,
      ListConnectionRequestsQueryVariables
    >(listConnectionRequests, {
      filter: {
        receiver: { eq: receiverSub },
      },
    })
  ).data?.listConnectionRequests?.items;

  if (!existingEntries) {
    throw new Error("Could not list existing connections");
  }

  if (existingEntries.length > 0) {
    throw new DuplicateConnectionError();
  }

  // Create a new entry
  const res = await callGraphQL<
    CreateConnectionRequestMutation,
    CreateConnectionRequestMutationVariables
  >(createConnectionRequest, {
    input: {
      receiver: receiverSub,
      status: ConnectionRequestStatus.PENDING,
    },
  });

  return res;
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    padding: Styling.spacingMedium,
    marginBottom: Styling.spacingMedium,
    borderBottomWidth: 1,
  },
  topSection: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  cameraContainer: {
    width: 250,
    aspectRatio: 1,
    borderRadius: Styling.borderRadius,
    overflow: "hidden",
    marginTop: Styling.spacingMedium,
  },
  bottomSection: {
    alignItems: "center",
    marginTop: Styling.spacingLarge,
  },
});

export class DuplicateConnectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DuplicateConnectionError";
  }
}

export default ConnectPartnerModal;
