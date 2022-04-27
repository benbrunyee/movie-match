import { Picker } from "@react-native-picker/picker";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
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
import { useUserContext } from "../context/UserContext";
import { db } from "../firebase";
import {
  DiscoverSearchOptions,
  Genre,
  Region
} from "../functions/src/util/apiTypes";
import MultiSelectModal, { SelectObject } from "./MultiSelectModal";
import { Box, Button, Text, useThemeColor } from "./Themed";

export interface SearchOptionsFormProps extends ScrollViewProps {
  afterSubmit?: (values: DiscoverSearchOptions) => void;
}

const SearchOptionsForm: React.FC<SearchOptionsFormProps> = ({
  afterSubmit,
  ...otherProps
}) => {
  const borderTopColor = useThemeColor({}, "borderColor");
  const [userContext] = useUserContext();

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
        await setDoc(
          doc(db, "users", userContext.uid),
          {
            searchOptions: {
              ...values,
              releasedAfterYear: values.releasedAfterYear
                ? values.releasedAfterYear
                : undefined,
            },
          },
          {
            merge: true,
          }
        );

        alert("Settings saved");
      } catch (e) {
        console.error(e);
        alert("Failed to save settings");
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
            handleFormSubmit(values).finally(
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
