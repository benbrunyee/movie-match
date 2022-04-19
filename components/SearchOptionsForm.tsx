import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Switch,
  View
} from "react-native";
import { sizes } from "../constants/Font";
import Styling from "../constants/Styling";
import { useUserContext } from "../context/UserContext";
import {
  Genre,
  GetUserQuery,
  GetUserQueryVariables,
  Region,
  SearchOptions,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from "../src/API";
import { updateUser } from "../src/graphql/mutations";
import { getUser } from "../src/graphql/queries";
import { callGraphQL } from "../utils/amplify";
import MultiSelectModal, { SelectObject } from "./MultiSelectModal";
import { Box, Button, Text, useThemeColor } from "./Themed";

export interface SearchOptionsFormProps extends ScrollViewProps {
  afterSubmit?: (values: Omit<SearchOptions, "__typename">) => void;
}

const SearchOptionsForm: React.FC<SearchOptionsFormProps> = ({
  afterSubmit,
  ...otherProps
}) => {
  const borderTopColor = useThemeColor({}, "borderColor");
  const [userContext] = useUserContext();

  const [initialValues, setInitialValues] = useState<
    Omit<SearchOptions, "__typename">
  >({
    genres: [],
    includeAdult: false,
    region: undefined,
    releasedAfterYear: undefined,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);

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

          console.log(currentOptions.genres);
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
    <>
      <Formik
        initialValues={Object.assign({}, Object.freeze(initialValues))}
        onSubmit={(values) => {
          {
            console.log(values);
            handleFormSubmit(values, userContext.sub).finally(
              () => afterSubmit && afterSubmit(values)
            );
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <ScrollView showsVerticalScrollIndicator={false} {...otherProps}>
              <FormField
                label="Region:"
                field={
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
                }
              />
              <FormField
                label="Show adult movies?"
                field={
                  <Switch
                    value={Boolean(values.includeAdult)}
                    onValueChange={(val) => setFieldValue("includeAdult", val)}
                  />
                }
              />
              <FormField
                label="Show movies after year:"
                field={
                  <Picker
                    selectedValue={(values.releasedAfterYear || "").toString()}
                    onValueChange={(v) =>
                      setFieldValue("releasedAfterYear", parseInt(v))
                    }
                    style={styles.picker}
                    itemStyle={[styles.pickerItem, styles.formField]}
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
                }
              />
              <FormField
                field={
                  <Button onPress={() => setModal(true)}>
                    <Text>Select Categories</Text>
                  </Button>
                }
              />
              <MultiSelectModal
                selection={Object.values(Genre)
                  .sort()
                  .map((genre) => ({
                    text: genre.toString(),
                    value: genre,
                  }))}
                initialSelected={formatGenres(values.genres || [])}
                visible={modal}
                onRequestClose={() => setModal(false)}
                onSave={(val) => {
                  setFieldValue(
                    "genres",
                    val.map((selection) => selection.value)
                  );
                }}
              />
            </ScrollView>
            <View style={[styles.submitContainer, { borderTopColor }]}>
              <Button onPress={() => handleSubmit()}>
                <Text>Submit</Text>
              </Button>
            </View>
          </>
        )}
      </Formik>
    </>
  );
};

const formatGenres = (genres: (Genre | null)[]): SelectObject[] => {
  return genres.reduce<SelectObject[]>((r, genre) => {
    if (genre) {
      r.push({
        text: genre.toString(),
        value: genre,
      });
    }

    return r;
  }, []);
};

interface FormFieldProps {
  label?: string;
  field: JSX.Element;
}

const FormField = ({ label, field }: FormFieldProps): JSX.Element => {
  return (
    <View style={styles.formFieldContainer}>
      {label ? <Text style={styles.formLabel}>{label}</Text> : null}
      <View style={styles.formField}>{field}</View>
    </View>
  );
};

const handleFormSubmit = async (
  values: Omit<SearchOptions, "__typename">,
  userId: string
) => {
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
  formFieldContainer: {
    flexDirection: "row",
    marginBottom: Styling.spacingMedium,
    alignItems: "center",
    minWidth: 270,
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
    height: 150,
    width: 120,
  },
  pickerItem: {
    fontSize: sizes.body,
  },
  submitContainer: {
    alignItems: "center",
    paddingTop: Styling.spacingMedium,
    borderTopWidth: 1,
  },
});

export default SearchOptionsForm;
