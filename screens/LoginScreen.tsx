import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth } from "aws-amplify";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, View, Button, Text } from "../components/Themed";
import { useUserContext } from "../context/UserContext";
import { RootStackScreenProps } from "../types";

export type LoginType = "SIGNIN" | "SIGNUP";

const LoginScreen: React.FC<RootStackScreenProps<"Login">> = ({
  navigation,
  route,
}) => {
  const [type, setType] = useState<LoginType>("SIGNIN");
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [, setUserContext] = useUserContext();

  const { fromVerification } = route.params || {};

  useEffect(() => {
    if (fromVerification) {
      // Sign the user in automatically
      handleSubmit("SIGNIN");
    }
  }, [fromVerification]);

  const handleSubmit = useCallback(
    async (providedType?: typeof type) => {
      const innerType = providedType || type;

      if (innerType === "SIGNIN") {
        // Sign the user in
        try {
          await signIn(form.email, form.password);
          setUserContext((cur) => ({
            ...cur,
            signedIn: true,
          }));
        } catch (e) {
          console.error(e);
          setError("Failed to log in");
          return;
        }
      } else if (innerType === "SIGNUP") {
        if (form.password !== form.repeatPassword) {
          console.warn("Passwords do not match");
          setError("Passwords do not match");
          return;
        }

        // Sign up the user
        try {
          await signUp(form.email, form.password);

          // Store the email in storage
          await AsyncStorage.setItem("@signUpUsername", form.email);
        } catch (e) {
          console.error(e);
          setError("Failed to sign up");
          return;
        }

        navigation.navigate("Verification");
      } else {
        console.error(`Login type not configured: ${innerType}`);
        return;
      }
    },
    [type, form]
  );

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.switchTab}>
          <Button title="Sign In" onPress={() => setType("SIGNIN")} />
          <Button title="Sign Up" onPress={() => setType("SIGNUP")} />
        </View>
        <View>
          <TextInput
            value={form.email}
            autoCompleteType="email"
            placeholder="Email"
            autoCorrect={false}
            onChangeText={(text) => setForm((cur) => ({ ...cur, email: text }))}
          />
          <TextInput
            value={form.password}
            autoCompleteType="password"
            placeholder="Password"
            autoCorrect={false}
            textContentType="password"
            secureTextEntry={true}
            onChangeText={(text) =>
              setForm((cur) => ({ ...cur, password: text }))
            }
          />
          {type === "SIGNUP" ? (
            <TextInput
              value={form.repeatPassword}
              placeholder="Repeat password"
              autoCorrect={false}
              textContentType="password"
              secureTextEntry={true}
              onChangeText={(text) =>
                setForm((cur) => ({ ...cur, repeatPassword: text }))
              }
            />
          ) : null}
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          <Button title="Submit" onPress={() => handleSubmit()} />
        </View>
      </View>
    </View>
  );
};

async function signIn(email: string, password: string) {
  await Auth.signIn({
    username: email,
    password: password,
  });
}

async function signUp(email: string, password: string) {
  await Auth.signUp({
    username: email,
    password: password,
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  switchTab: {
    display: "flex",
    flexDirection: "row",
  },
});

export default LoginScreen;
