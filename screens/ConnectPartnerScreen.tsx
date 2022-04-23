import { BarCodeScannedCallback } from "expo-barcode-scanner";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import QRBorder from "../assets/images/qr-border.svg";
import ProfileHeader from "../components/ProfileHeader";
import QRScanner from "../components/QRScanner";
import SwitchTab from "../components/SwitchTab";
import { Box } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  ConnectionRequestStatus,
  CreateConnectionRequestMutation,
  CreateConnectionRequestMutationVariables,
  ListConnectionRequestsQuery,
  ListConnectionRequestsQueryVariables
} from "../src/API";
import { createConnectionRequest } from "../src/graphql/mutations";
import { listConnectionRequests } from "../src/graphql/queries";
import { SettingsTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";

const TABS = ["SCAN", "MY CODE"] as const;

const ConnectPartnerModal: React.FC<
  SettingsTabScreenProps<"ConnectPartner">
> = () => {
  const [scanned, setScanned] = useState(false);
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>("SCAN");

  const [userContext] = useUserContext();

  useEffect(() => {
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

    createConnectRequest(userContext.sub, data)
      .then(() => {
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

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <SwitchTab
          tabs={TABS}
          selectedTab={selectedTab}
          onSwitch={(tab) => setSelectedTab(tab)}
        />
      </View>
      <View style={styles.content}>
        {selectedTab === "SCAN" ? (
          <View style={styles.scannerContainer}>
            <QRScanner
              barCodeTypes={["qr"]}
              onBarCodeScanned={scanned ? undefined : handleScan}
            >
              <Overlay />
            </QRScanner>
          </View>
        ) : (
          <View style={styles.qrContent}>
            <View style={styles.profileContainer}>
              <ProfileHeader />
            </View>
            <Box style={styles.qrContainer} lightColor="#FFF" darkColor="#FFF">
              <QRCode value={userContext.sub} size={250} />
            </Box>
          </View>
        )}
      </View>
    </View>
  );
};

const Overlay = () => {
  return (
    <View style={styles.overlay}>
      <QRBorder height="60%" width="60%" />
    </View>
  );
};

async function createConnectRequest(senderSub: string, receiverSub: string) {
  // Check if there is an existing entry
  const existingEntries = (
    await callGraphQL<
      ListConnectionRequestsQuery,
      ListConnectionRequestsQueryVariables
    >(listConnectionRequests, {
      filter: {
        and: [
          {
            receiver: { eq: receiverSub },
            sender: { eq: senderSub },
          },
        ],
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
      sender: senderSub,
      receiver: receiverSub,
      status: ConnectionRequestStatus.PENDING,
    },
  });

  return res;
}

export class DuplicateConnectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DuplicateConnectionError";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Styling.spacingMedium,
  },
  switchContainer: {
    padding: Styling.spacingMedium,
  },
  content: {
    flex: 1,
  },
  scannerContainer: {
    flex: 1,
    borderRadius: Styling.borderRadius,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    marginBottom: Styling.spacingMedium,
  },
  qrContent: {
    flex: 1,
    alignItems: "center",
  },
  qrContainer: {
    borderRadius: Styling.borderRadius,
    padding: Styling.spacingMedium,
  },
});

export default ConnectPartnerModal;
