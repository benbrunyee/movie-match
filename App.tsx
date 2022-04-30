import { StatusBar } from "expo-status-bar";
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, LogBox, Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationDisplay } from "./components/Notification";
import { NotificationProvider } from "./context/NotificationContext";
import { UserContext, UserContextObject } from "./context/UserContext";
import { auth, db } from "./firebase";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import configureUser from "./utils/configureUser";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core"]);

const App = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const cachedLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [userContext, setUserContext] = useState<UserContextObject>({
    email: "",
    uid: "",
    signedIn: false,
    connectedPartner: "",
    userDbObj: {},
  });

  useEffect(() => {
    const authSubscription = auth.onAuthStateChanged((user) => {
      if (user) {
        configureUser()
          .then((contextObj) => setUserContext(contextObj))
          .catch((err) => console.debug(err))
          .finally(() => setUserLoading(false));
      } else {
        setUserContext({
          email: "",
          uid: "",
          signedIn: false,
          connectedPartner: "",
          userDbObj: {},
        });
        setUserLoading(false);
      }
    });

    return authSubscription;
  }, []);

  useEffect(() => {
    let userDocSub: Unsubscribe | undefined;

    if (userContext.uid) {
      userDocSub = onSnapshot(doc(db, "users", userContext.uid), (snap) => {
        const newObj = snap.data();

        if (newObj) {
          setUserContext((cur) => ({
            ...cur,
            userDbObj: newObj,
            connectedPartner: newObj.connectedPartner || cur.connectedPartner,
          }));
        }
      });
    }

    return () => userDocSub && userDocSub();
  }, [userContext.uid]);

  useEffect(() => {
    if (cachedLoadingComplete && !userLoading) {
      setIsLoading(false);
    }
  }, [userLoading, cachedLoadingComplete]);

  if (isLoading) {
    return <View></View>;
  } else {
    return (
      <UserContext.Provider value={[userContext, setUserContext]}>
        <NotificationProvider>
          <NotificationDisplay />
          <SafeAreaProvider>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Navigation colorScheme={colorScheme} />
            </KeyboardAvoidingView>
            <StatusBar />
          </SafeAreaProvider>
        </NotificationProvider>
      </UserContext.Provider>
    );
  }
};

export default App;
