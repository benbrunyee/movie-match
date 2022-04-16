import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Amplify } from "aws-amplify";
import { brand } from "expo-device";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserContext, UserContextObject } from "./context/UserContext";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import {
  AcceptRequestMutation,
  AcceptRequestMutationVariables,
  OnCreateConnectionRequestSubscription
} from "./src/API";
import awsconfig from "./src/aws-exports";
import { acceptRequest } from "./src/graphql/mutations";
import { callGraphQL } from "./utils/amplify";
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
    connectedPartner: "",
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

function onSubscriptionMessage({
  value,
}: {
  provider: string;
  value: GraphQLResult<OnCreateConnectionRequestSubscription>;
}) {
  const id = value.data?.onCreateConnectionRequest?.id;

  if (!id) {
    console.error("Could not find data from subscription");
    return;
  }

  // Brand returns null if on web
  if (!brand) {
    alert(`Accepting connection request: ${id}`);

    // If web, just sign out
    acceptConnectionRequest(id);
    return;
  }

  Alert.alert("Connection request received", "", [
    {
      text: "Accept",
      onPress: () => acceptConnectionRequest(id),
    },
    {
      text: "Decline",
    },
  ]);
}

async function acceptConnectionRequest(id: string) {
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
  }
}
