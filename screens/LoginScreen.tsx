import { Auth } from "aws-amplify";
import React, { useCallback, useEffect, useState } from "react";
import { AsyncStorage, ImageBackground, StyleSheet, View } from "react-native";
import { Button, Container, Tab, Text, TextInput } from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import { RootStackScreenProps } from "../types";
import configureUser from "../utils/configureUser";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fromVerification } = route.params || {};

  useEffect(() => {
    if (fromVerification) {
      // Sign the user in automatically
      handleSubmitWrapper("SIGNIN");
    }
  }, [fromVerification]);

  const handleSubmit = useCallback(
    async (providedType?: typeof type) => {
      const innerType = providedType || type;

      if (innerType === "SIGNIN") {
        // Sign the user in
        try {
          await signIn(form.email, form.password);
          const userData = await configureUser();
          setUserContext(userData);
        } catch (e) {
          throw new Error("Failed to login");
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
          throw new Error("Failed to sign up");
        }

        navigation.navigate("Verification");
      } else {
        console.error(`Login type not configured: ${innerType}`);
        throw new Error("Failed to proceed");
      }
    },
    [type, form]
  );

  const handleSubmitWrapper = useCallback(
    (providedType?: LoginType | undefined) => {
      setIsSubmitting(true);
      handleSubmit(providedType).catch((e) => {
        console.error(e);
        setError(e.message || "Failed to proceed");
        setIsSubmitting(false);
      });
    },
    [handleSubmit]
  );

  return (
    <ImageBackground
      style={styles.pageContainer}
      source={require("../assets/images/movie.jpg")}
    >
      <Container style={styles.container}>
        <View>
          <View style={styles.switchTabContainer}>
            <Tab
              selected={type === "SIGNIN"}
              onPress={() => setType("SIGNIN")}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Sign In</Text>
            </Tab>
            <Tab
              selected={type === "SIGNUP"}
              onPress={() => setType("SIGNUP")}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Sign Up</Text>
            </Tab>
          </View>
          <View>
            <TextInput
              value={form.email}
              autoCompleteType="email"
              placeholder="Email"
              autoCorrect={false}
              onChangeText={(text) =>
                setForm((cur) => ({ ...cur, email: text }))
              }
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
            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
            <View style={styles.submitBtnContainer}>
              <Button
                disabled={isSubmitting}
                style={styles.submitBtn}
                onPress={() => handleSubmitWrapper()}
              >
                <Text disabled={isSubmitting}>Submit</Text>
              </Button>
            </View>
          </View>
        </View>
      </Container>
    </ImageBackground>
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
  pageContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: Styling.spacingLarge,
    borderRadius: Styling.borderRadius,
  },
  switchTabContainer: {
    flexDirection: "row",
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
  },
  submitBtnContainer: {
    alignItems: "center",
  },
  submitBtn: {
    marginTop: Styling.spacingMedium,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
});

export default LoginScreen;
