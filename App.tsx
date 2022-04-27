import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationDisplay } from "./components/Notification";
import { NotificationProvider } from "./context/NotificationContext";
import { UserContext, UserContextObject } from "./context/UserContext";
import { auth } from "./firebase";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import configureUser from "./utils/configureUser";

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
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </NotificationProvider>
      </UserContext.Provider>
    );
  }
};

export default App;
