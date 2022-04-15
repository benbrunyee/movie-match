import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Box,
  Button,
  Container,
  Text,
  useThemeColor
} from "../components/Themed";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  GetUserQuery,
  GetUserQueryVariables,
  Region,
  SearchOptions
} from "../src/API";
import { getUser } from "../src/graphql/queries";
import { SettingsTabScreenProps } from "../types";
import { callGraphQL } from "../utils/amplify";

const SearchOptionsScreen: React.FC<
  SettingsTabScreenProps<"SearchOptions">
> = () => {
  const borderBottomColor = useThemeColor({}, "borderColor");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userContext] = useUserContext();
  const [initialValues, setInitialValues] = useState<SearchOptions>();

  const handleFormSubmit = useCallback(async (values: Required<SearchOptions>) => {}, []);

  useEffect(() => {
    async function onLoad() {
      try {
        const userData = await callGraphQL<GetUserQuery, GetUserQueryVariables>(
          getUser,
          {
            id: userContext.sub,
          }
        );

        const currentOptions = userData?.data?.getUser?.searchOptions;

        if (!userData.data?.getUser) {
          throw new Error("Failed to load user data");
        }

        if (currentOptions) {
          setInitialValues(currentOptions);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load user data");
        return;
      }
    }

    onLoad().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Box>
        <Text variant="title">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text variant="body">Failed to load</Text>
      </Box>
    );
  }

  return (
    <View>
      <View
        style={[
          styles.titleContainer,
          {
            borderBottomColor,
          },
        ]}
      >
        <Text variant="title">Change search settings</Text>
        <Formik
          initialValues={Object.assign({}, Object.freeze(initialValues)) as Required<SearchOptions>}
          onSubmit={handleFormSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            setFieldValue,
          }) => (
            <Container style={styles.form}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Region: </Text>
                <Picker
                  selectedValue={values.region}
                  onValueChange={(val) => setFieldValue("region", val)}
                >
                  {Object.keys(Region).map((k) => (
                    <Picker.Item label={k} value={k} />
                  ))}
                </Picker>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Show Adult Movies?</Text>
                {/* <Switch
                  value={values.includeAdult}
                  onValueChange={(val) => setFieldValue("includeAdult", val)}
                /> */}
              </View>
              <View style={styles.formField}>
                <Button onPress={() => handleSubmit()}>
                  <Text>Submit</Text>
                </Button>
              </View>
            </Container>
          )}
        </Formik>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    padding: Styling.spacingMedium,
    marginBottom: Styling.spacingMedium,
    borderBottomWidth: 1,
  },
  form: {
    padding: Styling.spacingLarge,
  },
  formField: {
    flexDirection: "row",
    marginBottom: Styling.spacingMedium,
  },
  formLabel: {
    marginRight: Styling.spacingSmall,
  },
});

export default SearchOptionsScreen;
