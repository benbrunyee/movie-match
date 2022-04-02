import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput, View } from "../components/Themed";
import { useUserContext } from "../context/UserContext";
import { RootStackScreenProps } from "../types";
import configureUser from "../utils/configureUser";

const VerificationModal: React.FC<RootStackScreenProps<"Verification">> = ({
  navigation,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, setUserContext] = useUserContext();

  return (
    <View style={style.container}>
      <TextInput
        placeholder="Enter your verification code"
        value={code}
        onChangeText={(text) => setCode(text)}
        keyboardType="numeric"
      />
      {error ? <Text>{error}</Text> : null}
      <Button
        onPress={() => {
          if (!code) {
            console.warn("Verification code cannot be empty");
            return;
          }

          submitCode(code)
            .then(async () => {
              navigation.navigate("Login", { fromVerification: true });
            })
            .catch((err) => {
              console.error(err);
              setError("Could not verify user");
            });
        }}
        title="Submit"
      />
    </View>
  );
};

async function submitCode(code: string) {
  if (!code) {
    throw new Error("Verification code cannot be empty");
  }

  const storage_username = await AsyncStorageLib.getItem("@signUpUsername");

  if (!storage_username) {
    throw new Error("Could not find username in storage");
  }

  await Auth.confirmSignUp(storage_username, code);
}

const style = StyleSheet.create({
  container: {},
});

export default VerificationModal;
