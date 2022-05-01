import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Switch,
  View
} from "react-native";
import { sizes } from "../constants/Font";
import Styling from "../constants/Styling";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import {
  DiscoverSearchOptions,
  Genre,
  Region
} from "../functions/src/util/apiTypes";
import CTAButton from "./CTAButton";
import MultiSelectModal, { SelectObject } from "./MultiSelectModal";
import { ErrorText, SuccessText } from "./Notification";
import { Box, BoxProps, Button, Text } from "./Themed";

export interface SearchOptionsFormProps extends ScrollViewProps {
  afterSubmit?: (values: DiscoverSearchOptions) => void;
  onError?: (err: any) => void;
}

const SearchOptionsForm: React.FC<SearchOptionsFormProps> = ({
  afterSubmit = () => {},
  ...otherProps
}) => {
  const [userContext] = useUserContext();
  const { dark } = useTheme();
  const notificationDispatch = useNotificationDispatch();

  const [initialValues, setInitialValues] = useState<DiscoverSearchOptions>({
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

  const handleFormSubmit = useCallback(
    async (values: DiscoverSearchOptions) => {
      try {
        await updateDoc(doc(db, "users", userContext.uid), {
          searchOptions: {
            ...values,
          },
        });

        notificationDispatch({
          type: "ADD",
          item: {
            type: "SUCCESS",
            item: ({ dismiss }) => (
              <SuccessText onPress={dismiss}>Settings saved</SuccessText>
            ),
            position: "TOP",
            autoHideMs: 1000,
          },
        });
      } catch (e) {
        console.error(e);
        notificationDispatch({
          type: "ADD",
          item: {
            type: "ERROR",
            item: ({ dismiss }) => (
              <ErrorText onPress={dismiss}>Failed to save settings</ErrorText>
            ),
            position: "TOP",
            autoHideMs: 1000,
          },
        });
      }
    },
    [userContext.uid]
  );

  useEffect(() => {
    async function onLoad() {
      try {
        const userData = await getDoc(doc(db, "users", userContext.uid));

        const currentOptions = userData.data()
          ?.searchOptions as DiscoverSearchOptions;

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
    <>
      <Formik
        initialValues={Object.assign({}, Object.freeze(initialValues))}
        onSubmit={(values) => {
          {
            handleFormSubmit(values).finally(() => afterSubmit(values));
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <ScrollView {...otherProps}>
              <FormField
                label="Region:"
                field={
                  <Picker
                    selectedValue={values.region}
                    onValueChange={(val) => setFieldValue("region", val)}
                    style={styles.picker}
                    itemStyle={[
                      styles.pickerItem,
                      styles.formField,
                      {
                        color: dark ? "#FFF" : "#000",
                      },
                    ]}
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
                    itemStyle={[
                      styles.pickerItem,
                      styles.formField,
                      {
                        color: dark ? "#FFF" : "#000",
                      },
                    ]}
                  >
                    <Picker.Item label="Any" value={undefined} />
                    {Array(curYear - oldestYear + 1)
                      .fill(undefined)
                      .map((el, i) => (
                        <Picker.Item
                          key={(curYear - i).toString()}
                          label={(curYear - i).toString()}
                          value={(curYear - i).toString()}
                        />
                      ))}
                  </Picker>
                }
              />
              <FormField
                field={
                  <Button
                    onPress={() => setModal(true)}
                    darkColor="#000"
                    lightColor="#EEE"
                  >
                    <Text>Pick</Text>
                  </Button>
                }
                label="Genres"
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
                submitButtonText="Update"
              />
            </ScrollView>
            <CTAButton onPress={() => handleSubmit()} text="Save" />
          </>
        )}
      </Formik>
    </>
  );
};

const formatGenres = (genres: string[]): SelectObject[] => {
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

interface FormFieldProps extends BoxProps {
  label?: string;
  field: JSX.Element;
}

const FormField = ({ label, field, style }: FormFieldProps): JSX.Element => {
  return (
    <Box lightColor="#FFF" style={[styles.formFieldContainer, style]}>
      {label ? <Text style={styles.formLabel}>{label}</Text> : null}
      <View style={styles.formField}>{field}</View>
    </Box>
  );
};

const styles = StyleSheet.create({
  formFieldContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Styling.spacingLarge,
    marginBottom: Styling.spacingSmall,
  },
  marginBottom: {
    marginBottom: Styling.spacingMedium,
  },
  formLabel: {
    flex: 1,
  },
  formField: {
    flex: 1,
    alignItems: "center",
  },
  picker: {
    height: 150,
    width: 120,
  },
  pickerItem: {
    fontSize: sizes.body,
    fontFamily: "montserrat-medium",
  },
  submitText: {
    fontFamily: "montserrat-bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default SearchOptionsForm;
