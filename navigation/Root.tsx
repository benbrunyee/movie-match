import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../context/UserContext";
import LoginScreenTwo from "../screens/LoginScreenTwo";
import NotFoundScreen from "../screens/NotFoundScreen";
import VerificationModal from "../screens/VerificationModal";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomNavigator";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [{ signedIn }] = useUserContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator} />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreenTwo} />
          <Stack.Group
            screenOptions={{ presentation: "modal", gestureEnabled: false }}
          >
            <Stack.Screen name="Verification" component={VerificationModal} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
