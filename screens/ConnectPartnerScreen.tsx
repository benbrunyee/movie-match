import { useTheme } from "@react-navigation/native";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import QRBorder from "../assets/images/qr-border.svg";
import { ErrorText, SuccessText } from "../components/Notification";
import ProfileHeader from "../components/ProfileHeader";
import QRScanner from "../components/QRScanner";
import SwitchTab from "../components/SwitchTab";
import { Box, Button, Text, TextInput } from "../components/Themed";
import Styling from "../constants/Styling";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import { SettingsTabScreenProps } from "../types";

const TABS = ["SCAN", "MY CODE"] as const;

const ConnectPartnerModal = (
  props: SettingsTabScreenProps<"ConnectPartner">
): JSX.Element => {
  const [scanned, setScanned] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>("SCAN");
  const [inputEmail, setInputEmail] = useState("");
  const notificationDispatch = useNotificationDispatch();
  const { dark } = useTheme();

  const [userContext] = useUserContext();

  const createConnectRequest = useCallback(
    async (senderId: string, receiverId: string) => {
      if (senderId === receiverId) {
        notificationDispatch({
          type: "ADD",
          item: {
            item: ({ dismiss }) => (
              <ErrorText onPress={dismiss}>Cannot request yourself</ErrorText>
            ),
            type: "ERROR",
            position: "TOP",
            autoHideMs: 1000,
          },
        });
        throw new SelfRequestError();
      }

      // Check if there is an existing entry
      const q1 = query(
        collection(db, "connectionRequests"),
        where("receiver", "==", receiverId),
        where("sender", "==", senderId)
      );
      const q2 = query(
        collection(db, "connectionRequests"),
        where("receiver", "==", senderId),
        where("sender", "==", receiverId)
      );
      const existingEntries = [
        ...(await getDocs(q1)).docs,
        ...(await getDocs(q2)).docs,
      ];

      if (existingEntries.length > 0) {
        notificationDispatch({
          type: "ADD",
          item: {
            item: ({ dismiss }) => (
              <ErrorText onPress={dismiss}>Request already exists</ErrorText>
            ),
            type: "ERROR",
            position: "TOP",
            autoHideMs: 1000,
          },
        });
        throw new DuplicateConnectionError();
      }

      // Create a new entry
      await addDoc(collection(db, "connectionRequests"), {
        sender: senderId,
        receiver: receiverId,
        status: "PENDING",
      });

      setSentRequest(true);
    },
    [notificationDispatch]
  );

  const emailRequest = useCallback(
    async (email: string) => {
      const userDocs = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", email.toLowerCase())
        )
      );

      if (userDocs.docs.length === 0) {
        notificationDispatch({
          type: "ADD",
          item: {
            item: ({ dismiss }) => (
              <ErrorText onPress={dismiss}>Failed to find user</ErrorText>
            ),
            type: "ERROR",
            position: "TOP",
            autoHideMs: 1000,
          },
        });
      }

      if (userDocs.docs.length > 0) {
        const targetUser = userDocs.docs[0].data().uid;

        try {
          await createConnectRequest(userContext.uid, targetUser);
          notificationDispatch({
            type: "ADD",
            item: {
              item: ({ dismiss }) => (
                <SuccessText onPress={dismiss}>Request sent!</SuccessText>
              ),
              type: "SUCCESS",
              position: "TOP",
              autoHideMs: 1000,
            },
          });
        } catch (e) {
          console.error(e);

          if (
            (e as any).name !== "SelfRequestError" &&
            (e as any).name !== "DuplicateConnectionError"
          ) {
            notificationDispatch({
              type: "ADD",
              item: {
                item: ({ dismiss }) => (
                  <ErrorText onPress={dismiss}>
                    Failed to request user
                  </ErrorText>
                ),
                type: "ERROR",
                position: "TOP",
                autoHideMs: 1000,
              },
            });
            return;
          }
        }
      }
    },
    [notificationDispatch, createConnectRequest, userContext.uid]
  );

  const handleScan = useCallback<BarCodeScannedCallback>(
    ({ data, type }) => {
      setScanned(true);

      if (type !== "org.iso.QRCode" || !data) {
        notificationDispatch({
          type: "ADD",
          item: {
            item: ({ dismiss }) => (
              <ErrorText onPress={dismiss}>Invalid QR Code</ErrorText>
            ),
            type: "ERROR",
            position: "TOP",
            autoHideMs: 1000,
          },
        });
        return;
      }

      createConnectRequest(userContext.uid, data)
        .then(() => {
          notificationDispatch({
            type: "ADD",
            item: {
              item: ({ dismiss }) => (
                <SuccessText onPress={dismiss}>Request sent!</SuccessText>
              ),
              type: "SUCCESS",
              position: "TOP",
              autoHideMs: 1000,
            },
          });
        })
        .catch((err) => {
          console.error(err);
          if (
            err.name !== "SelfRequestError" &&
            err.name !== "DuplicateConnectionError"
          ) {
            notificationDispatch({
              type: "ADD",
              item: {
                item: ({ dismiss }) => (
                  <ErrorText onPress={dismiss}>
                    Failed to request user
                  </ErrorText>
                ),
                type: "ERROR",
                position: "TOP",
                autoHideMs: 1000,
              },
            });
            return;
          }
        });
    },
    [userContext.uid]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <>
              <View style={styles.scannerContainer}>
                <QRScanner
                  onBarCodeScanned={
                    scanned || sentRequest ? undefined : handleScan
                  }
                  barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                >
                  <Overlay />
                </QRScanner>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  value={inputEmail}
                  onChangeText={(text) => setInputEmail(text)}
                  style={[
                    styles.emailInput,
                    {
                      backgroundColor: dark ? "#000" : "#FFF",
                    },
                  ]}
                  placeholder="Or enter user's email"
                  onSubmitEditing={() =>
                    !sentRequest && emailRequest(inputEmail)
                  }
                  autoCorrect={false}
                />
                {
                  // ! TODO: Theme important buttons
                }
                <Button
                  style={styles.sendButton}
                  onPress={() => !sentRequest && emailRequest(inputEmail)}
                  disabled={sentRequest}
                >
                  <Text
                    lightColor={sentRequest ? "#1FC357" : "#FFF"}
                    darkColor={sentRequest ? "#1FC357" : "#FFF"}
                  >
                    Send Request
                  </Text>
                </Button>
              </View>
            </>
          ) : (
            <View style={styles.qrContent}>
              <View style={styles.profileContainer}>
                <ProfileHeader />
              </View>
              <Box
                style={styles.qrContainer}
                lightColor="#FFF"
                darkColor="#FFF"
              >
                <QRCode value={userContext.uid} size={250} />
              </Box>
            </View>
          )}
        </View>
      </Box>
    </TouchableWithoutFeedback>
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

export class SelfRequestError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "SelfRequestError";
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  emailInput: {
    borderRadius: Styling.borderRadius,
    padding: Styling.spacingSmall,
    margin: 0,
  },
  inputContainer: {
    marginTop: Styling.spacingSmall,
  },
  sendButton: {
    marginTop: Styling.spacingSmall,
    alignItems: "center",
    backgroundColor: "#1EEC64",
  },
  seperator: {
    marginHorizontal: Styling.spacingLarge * 4,
    marginVertical: Styling.spacingMedium,
    justifyContent: "center",
  },
});

export default ConnectPartnerModal;
