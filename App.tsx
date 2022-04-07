import { Amplify, Auth } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserContext, UserContextObject } from "./context/UserContext";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import awsconfig from "./src/aws-exports";
import configureUser from "./utils/configureUser";

Amplify.configure(awsconfig);

export default function App() {
  const [userLoading, setUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const cachedLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [userContext, setUserContext] = useState<UserContextObject>({
    email: "",
    sub: "",
    signedIn: false,
  });

  useEffect(() => {
    async function onLoad() {
      try {
        const contextObj = await configureUser();
        setUserContext(contextObj);
      } catch (e) {
        console.error(e);
      }
    }

    onLoad().finally(() => {
      setUserLoading(false);
    });
  }, []);

  useEffect(() => {
    if (cachedLoadingComplete && !userLoading) {
      setIsLoading(false);
    }
  }, [userLoading, cachedLoadingComplete]);

  if (isLoading) {
    return null;
  } else {
    return (
      <UserContext.Provider value={[userContext, setUserContext]}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </UserContext.Provider>
    );
  }
}
