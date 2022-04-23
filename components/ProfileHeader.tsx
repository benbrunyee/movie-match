import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import { Text } from "./Themed";

export interface ProfileHeaderProps {}

const ProfileHeader = ({}: ProfileHeaderProps): JSX.Element => {
  const [userContext] = useUserContext();
  const [profileColor, setProfileColor] = useState("#FFF");

  useEffect(() => {
    let string: string = "";

    for (let c of userContext.sub) {
      string += c.charCodeAt(0);
    }

    const number = parseInt(string);

    setProfileColor(genColor(number));
  }, [userContext]);

  return (
    <View style={styles.container}>
      <View style={[styles.profileImage, { backgroundColor: profileColor }]}>
        <Text
          variant="bigTitle"
          style={styles.profileImageText}
          darkColor="#FFF"
          lightColor="#111"
        >
          {userContext.email.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.email} variant="subtitle">
        {userContext.email}
      </Text>
    </View>
  );
};

function genColor(seed: number) {
  let color = Math.floor(Math.abs(Math.sin(seed) * 16777215)).toString(16);

  // pad any colors shorter than 6 characters with leading 0s
  while (color.length < 6) {
    color = "0" + color;
  }

  return `#${color}`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  profileImage: {
    borderRadius: 100,
    width: 100,
    height: 100,
    marginBottom: Styling.spacingSmall,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageText: {
    color: "#FFF",
  },
  email: {
    fontFamily: "montserrat-bold",
  },
});

export default ProfileHeader;
