import { useTheme } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  PressableProps,
  StyleSheet,
  Switch,
  View
} from "react-native";
import DarkBackground from "../assets/images/login/background-dark.png";
import LightBackground from "../assets/images/login/background-light.png";
import LinearBar from "../components/LinearBar";
import Seperator from "../components/Seperator";
import SocialButton from "../components/SocialButton";
import {
  Logo,
  Text as DefaultText,
  TextInput,
  TextInputProps,
  TextProps
} from "../components/Themed";
import Styling from "../constants/Styling";
import { RootStackScreenProps } from "../types";

export type LoginType = "SIGNIN" | "SIGNUP";

const textLightColor = "#6C6C6C";
const textDarkColor = "#E1E1E1";

const LoginScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"Login">): JSX.Element => {
  const [type, setType] = useState<LoginType>("SIGNIN");
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dark } = useTheme();
  const backgroundImage = dark ? DarkBackground : LightBackground;
  const windowWidth = Dimensions.get("window").width;

  const handleSubmit = useCallback(
    async (providedType?: typeof type) => {
      const innerType = providedType || type;

      if (innerType === "SIGNIN") {
        // Sign the user in
        await signInWithEmailAndPassword(getAuth(), form.email, form.password);
      } else if (innerType === "SIGNUP") {
        if (form.password !== form.repeatPassword) {
          console.warn("Passwords do not match");
          setError("Passwords do not match");
          return;
        }

        // Sign up the user
        await createUserWithEmailAndPassword(
          getAuth(),
          form.email,
          form.password
        );
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
    <View style={styles.pageContainer}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.pageContainer}
      >
        {
          // Logo
        }
        <View style={styles.logo}>
          <Logo height={25} width="auto" />
        </View>
        <View style={styles.content}>
          {
            // Top Bar Text
          }
          <View style={styles.contentSection}>
            <Text
              style={styles.topText}
              lightColor={textLightColor}
              darkColor={textDarkColor}
              variant="subtitle"
            >
              Let's get you started
            </Text>
            <Seperator style={{ width: 250 }} />
          </View>
          {
            // Switch
          }
          <View style={styles.contentSection}>
            <View style={styles.switchContainer}>
              <Text style={styles.marginRight} variant="smallCaption">
                Sign In
              </Text>
              <View style={styles.marginRight}>
                <Switch
                  trackColor={{ false: "#D0D0D0", true: "#D0D0D0" }}
                  ios_backgroundColor="#D0D0D0"
                  value={!Boolean(type === "SIGNIN")}
                  onValueChange={(val) => {
                    setType(val ? "SIGNUP" : "SIGNIN");
                  }}
                />
              </View>
              <Text variant="smallCaption">Sign Up</Text>
            </View>
          </View>
          {
            // Input fields
          }
          <View style={styles.contentSection}>
            <View style={styles.inputFieldContainer}>
              <Text variant="smallCaption">Email</Text>
              <StyledTextInput
                value={form.email}
                autoCorrect={false}
                autoCompleteType="email"
                editable={!isSubmitting}
                {...(isSubmitting && { style: styles.submittingInput })}
                onChangeText={(text) =>
                  setForm((cur) => ({ ...cur, email: text }))
                }
              />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text variant="smallCaption">Password</Text>
              <StyledTextInput
                value={form.password}
                autoCompleteType="password"
                autoCorrect={false}
                textContentType="password"
                secureTextEntry={true}
                editable={!isSubmitting}
                {...(isSubmitting && { style: styles.submittingInput })}
                onChangeText={(text) =>
                  setForm((cur) => ({ ...cur, password: text }))
                }
              />
            </View>
            {type === "SIGNUP" ? (
              <View style={styles.inputFieldContainer}>
                <Text variant="smallCaption">Repeat Password</Text>
                <StyledTextInput
                  value={form.repeatPassword}
                  autoCompleteType="password"
                  autoCorrect={false}
                  textContentType="password"
                  secureTextEntry={true}
                  editable={!isSubmitting}
                  {...(isSubmitting && { style: styles.submittingInput })}
                  onChangeText={(text) =>
                    setForm((cur) => ({ ...cur, repeatPassword: text }))
                  }
                />
              </View>
            ) : null}
          </View>
          {
            // Or seperator
          }
          <View style={styles.contentSection}>
            <View style={styles.orSeparator}>
              <Seperator style={[{ width: 50 }, styles.marginRight]} />
              <DefaultText
                lightColor={textLightColor}
                darkColor={textDarkColor}
                style={styles.marginRight}
                variant="smallCaption"
              >
                or
              </DefaultText>
              <Seperator style={{ width: 50 }} />
            </View>
          </View>
          {
            // Social buttons
          }
          <View style={styles.contentSection}>
            <SocialButton type="APPLE" style={styles.socialButton} />
            <SocialButton type="GOOGLE" style={styles.socialButton} />
          </View>
        </View>
        {
          // Error message
        }
        {error ? (
          <View style={styles.errorMessage}>
            <Text
              variant="smallCaption"
              lightColor="#FF5F5F"
              darkColor="#FF5F5F"
            >
              {error}
            </Text>
          </View>
        ) : null}
        {
          // Submit button
        }
        <LargeButton
          onPress={() => handleSubmitWrapper()}
          disabled={isSubmitting}
        >
          <LinearBar
            height={2}
            width={windowWidth}
            startColor="#00FF66"
            endColor="#FF0000"
          />
          <Text
            variant="title"
            lightColor="#fff"
            darkColor="#111"
            style={styles.submitButton}
          >
            {isSubmitting
              ? "Loading..."
              : type === "SIGNIN"
              ? "Sign In"
              : "Sign Up"}
          </Text>
        </LargeButton>
      </ImageBackground>
    </View>
  );
};

function LargeButton({ style, ...otherProps }: PressableProps) {
  const { dark } = useTheme();

  return (
    <Pressable
      {...otherProps}
      style={({ pressed }) => [
        styles.submit,
        {
          backgroundColor: dark
            ? pressed || otherProps.disabled
              ? "#EEE"
              : "#FFF"
            : pressed || otherProps.disabled
            ? "#222"
            : "#000",
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    />
  );
}

function StyledTextInput({ style, ...otherProps }: TextInputProps) {
  const { dark } = useTheme();

  return (
    <TextInput
      {...otherProps}
      style={[
        styles.inputField,
        {
          backgroundColor: dark ? "#171717" : "#FFFFFF",
          ...(dark && { borderWidth: 1, borderColor: "#E1E1E1" }),
        },
        style,
      ]}
    />
  );
}

function Text({ lightColor, darkColor, style, ...otherProps }: TextProps) {
  return (
    <DefaultText
      {...otherProps}
      lightColor={lightColor || textLightColor}
      darkColor={darkColor || textDarkColor}
      style={[styles.text, style]}
    />
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  logo: {
    marginVertical: Styling.spacingLarge * 2,
  },
  content: {
    flex: 1,
  },
  contentSection: {
    marginBottom: Styling.spacingLarge,
    alignItems: "center",
  },
  topText: {
    marginBottom: Styling.spacingMedium,
    fontFamily: "montserrat-bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginRight: {
    marginRight: Styling.spacingSmall,
  },
  submit: {
    alignItems: "center",
    paddingBottom: 25,
  },
  submitButton: {
    marginVertical: Styling.spacingMedium,
  },
  gradientBar: {
    height: 2,
  },
  text: {
    textTransform: "uppercase",
  },
  orSeparator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputFieldContainer: {
    alignItems: "center",
  },
  inputField: {
    width: 250,
    borderRadius: 100,
    padding: 10,
  },
  submittingInput: {
    color: "#DDD",
  },
  socialButton: {
    marginBottom: Styling.spacingSmall,
  },
  errorMessage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: Styling.spacingMedium,
  },
});
export default LoginScreen;
