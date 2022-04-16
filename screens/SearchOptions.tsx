import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import {
  Box,
  Button,
  Container,
  Text,
  useThemeColor
} from "../components/Themed";
import { sizes } from "../constants/Font";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  GetUserQuery,
  GetUserQueryVariables,
  Region,
  SearchOptions,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from "../src/API";
import { updateUser } from "../src/graphql/mutations";
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
  const [initialValues, setInitialValues] = useState<
    Omit<SearchOptions, "__typename">
  >({
    genres: [],
    includeAdult: false,
    region: undefined,
    releasedAfterYear: undefined,
  });

  const curYear = new Date().getFullYear();
  const oldestYear = 1900;

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
          setInitialValues({
            genres: currentOptions.genres || [],
            includeAdult: Boolean(currentOptions.includeAdult),
            region: currentOptions.region,
            releasedAfterYear: currentOptions.releasedAfterYear,
          });
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
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={Object.assign({}, Object.freeze(initialValues))}
          onSubmit={(values) => handleFormSubmit(values, userContext.sub)}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Container style={styles.form}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={[styles.formFieldContainer, styles.firstFormField]}
                >
                  <Text style={styles.formLabel}>Region: </Text>
                  <View style={styles.formField}>
                    <Picker
                      selectedValue={values.region}
                      onValueChange={(val) => setFieldValue("region", val)}
                      style={styles.picker}
                      itemStyle={[styles.pickerItem, styles.formField]}
                    >
                      <Picker.Item label="Any" value={undefined} />
                      {Object.keys(Region).map((k) => (
                        <Picker.Item key={k} label={k} value={k} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles.formFieldContainer}>
                  <Text style={styles.formLabel}>Show adult movies?</Text>
                  <View style={styles.formField}>
                    <Switch
                      value={Boolean(values.includeAdult)}
                      onValueChange={(val) =>
                        setFieldValue("includeAdult", val)
                      }
                    />
                  </View>
                </View>
                <View style={styles.formFieldContainer}>
                  <Text style={styles.formLabel}>Show movies after year:</Text>
                  <View style={styles.formField}>
                    <Picker
                      selectedValue={(
                        values.releasedAfterYear || ""
                      ).toString()}
                      onValueChange={(v) =>
                        setFieldValue("releasedAfterYear", parseInt(v))
                      }
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Any" value={undefined} />
                      {Array(curYear - oldestYear + 1)
                        .fill(undefined)
                        .map((el, i) => (
                          <Picker.Item
                            key={(oldestYear + i).toString()}
                            label={(oldestYear + i).toString()}
                            value={(oldestYear + i).toString()}
                          />
                        ))}
                    </Picker>
                  </View>
                </View>
                <View style={[styles.submitButton]}>
                  <Button onPress={() => handleSubmit()}>
                    <Text>Submit</Text>
                  </Button>
                </View>
              </ScrollView>
            </Container>
          )}
        </Formik>
      </View>
    </View>
  );
};

const handleFormSubmit = async (
  values: Omit<SearchOptions, "__typename">,
  userId: string
) => {
  console.log(JSON.stringify(values, null, 2));

  try {
    await callGraphQL<UpdateUserMutation, UpdateUserMutationVariables>(
      updateUser,
      {
        input: {
          id: userId,
          searchOptions: {
            ...values,
            releasedAfterYear: values.releasedAfterYear
              ? values.releasedAfterYear
              : undefined,
          },
        },
      }
    );

    alert("Settings saved");
  } catch (e) {
    console.error(e);
    alert("Failed to save settings");
  }
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    padding: Styling.spacingMedium,
    marginBottom: Styling.spacingMedium,
    borderBottomWidth: 1,
  },
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    paddingHorizontal: Styling.spacingLarge,
    width: "90%",
    height: "90%",
  },
  formFieldContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: Styling.spacingMedium,
    alignItems: "center",
  },
  formLabel: {
    flex: 5,
    marginRight: Styling.spacingSmall,
  },
  formField: {
    flex: 3,
    alignItems: "center",
  },
  picker: {
    height: 215,
    width: 120,
  },
  pickerItem: {
    fontSize: sizes.body,
  },
  submitButton: {
    alignSelf: "center",
    marginBottom: Styling.spacingLarge,
  },
  firstFormField: {
    marginTop: Styling.spacingLarge,
  },
});

export default SearchOptionsScreen;
