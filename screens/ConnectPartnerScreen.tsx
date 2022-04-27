import { BarCodeScannedCallback } from "expo-barcode-scanner";
import {
  addDoc,
  collection, getDocs,
  getFirestore,
  query, where
} from "firebase/firestore/lite";
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
import { SettingsTabScreenProps } from "../types";

const TABS = ["SCAN", "MY CODE"] as const;

const ConnectPartnerModal: React.FC<
  SettingsTabScreenProps<"ConnectPartner">
> = () => {
  const [scanned, setScanned] = useState(false);
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>("SCAN");

  const [userContext] = useUserContext();

  const createConnectRequest = useCallback(
    async (senderId: string, receiverId: string) => {
      const db = getFirestore();

      // Check if there is an existing entry
      const q = query(
        collection(db, "connectionRequests"),
        where("receivier", "==", receiverId),
        where("sender", "==", senderId)
      );
      const existingEntries = (await getDocs(q)).docs;

      if (existingEntries.length > 0) {
        throw new DuplicateConnectionError();
      }

      // Create a new entry
      await addDoc(collection(db, "connectionRequests"), {
        sender: senderId,
        receiver: receiverId,
        status: "PENDING",
      });
    },
    []
  );

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

    if (data === userContext.uid) {
      alert("Cannot request yourself");
      return;
    }

    createConnectRequest(userContext.uid, data)
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
    <Box style={styles.container} darkColor="#101010" lightColor="#EEEEEE">
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
              <QRCode value={userContext.uid} size={250} />
            </Box>
          </View>
        )}
      </View>
    </Box>
  );
};

const Overlay = () => {
  return (
    <View style={styles.overlay}>
      <QRBorder height="60%" width="60%" />
    </View>
  );
};

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
