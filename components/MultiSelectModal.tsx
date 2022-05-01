import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { brand } from "expo-device";
import debounce from "lodash.debounce";
import React, { Reducer, useCallback, useReducer, useState } from "react";
import { ScrollView, StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styling from "../constants/Styling";
import {
  Box,
  Button,
  MenuItem,
  MenuItemProps,
  Modal,
  ModalProps,
  Text,
  TextInput,
  TextInputProps,
  useThemeColor
} from "./Themed";

type SelectedAction<T> = {
  type: "ADD" | "REMOVE" | "TOGGLE";
  item: T;
};

export type SelectObject = { value: string; text: string };

export interface MultiSelectModalProps<T extends SelectObject>
  extends ModalProps {
  selection: T[];
  initialSelected?: T[];
  onSelectionChange?: (value: T, selection: T[]) => void;
  onSelect?: (value: T, selection: T[]) => void;
  onDeselect?: (value: T, selection: T[]) => void;
  onSave?: (selection: T[]) => void;
  submitButtonText: string;
}

const MultiSelectModal = <T extends SelectObject>({
  selection = [],
  initialSelected = [],
  onSelectionChange = () => {},
  onSelect = () => {},
  onDeselect = () => {},
  onSave = () => {},
  submitButtonText,
  ...otherProps
}: MultiSelectModalProps<T>): JSX.Element => {
  const borderTopColor = useThemeColor({}, "borderColor");
  const [searchValue, setSearchValue] = useState("");
  const [filteredList, setFilteredList] = useState<T[]>([...selection]);

  const selectionReducer = useCallback(
    (state: T[], action: SelectedAction<T>): T[] => {
      const isSelected = Boolean(
        state.find((item) => item.value === action.item.value)
      );

      const select = () => {
        if (!isSelected) {
          const newState = [...state, action.item];
          onSelect(action.item, newState);
          return newState;
        } else {
          return state;
        }
      };
      const deselect = () => {
        if (isSelected) {
          const newState = state.filter(
            (item) => item.value !== action.item.value
          );
          onDeselect(action.item, newState);
          return newState;
        } else {
          return state;
        }
      };

      switch (action.type) {
        case "ADD":
          if (!isSelected) {
            state = select();
          } else {
            return state;
          }
          break;
        case "REMOVE":
          if (isSelected) {
            state = deselect();
          } else {
            return state;
          }
          break;
        case "TOGGLE":
          state = !isSelected ? select() : deselect();
      }

      onSelectionChange(action.item, state);
      return state;
    },
    []
  );

  const [selectedEntries, dispatchSelectedEntries] = useReducer<
    Reducer<T[], SelectedAction<T>>
  >(selectionReducer, [...initialSelected]);

  // Filter the list based on the search
  const searchChangeHandler = useCallback(
    (val: string) => {
      setFilteredList(selection.filter((item) => item.text.match(val)));
    },
    [selection]
  );

  // Debounce input so that filtering isn't applied until
  // there is a break in user input
  const onSearchChange = useCallback(debounce(searchChangeHandler, 300), []);

  const content = (
    <Box
      onTouchEnd={(e) => e.stopPropagation()}
      style={[styles.container, styles.boxContainer]}
      lightColor="#FFF"
    >
      <ModalHeader
        value={searchValue}
        onChangeText={(val) => {
          setSearchValue(val);
          onSearchChange(val);
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredList.map((item) => {
            return (
              <SelectItem
                key={item.value}
                onPress={() =>
                  dispatchSelectedEntries({
                    item,
                    type: "TOGGLE",
                  })
                }
                selected={Boolean(
                  selectedEntries.find(
                    (selectedItem) => selectedItem.value === item.value
                  )
                )}
              >
                <Text variant="caption">{item.text}</Text>
              </SelectItem>
            );
          })}
        </ScrollView>
      </View>
      <View style={[styles.submitContainer, { borderTopColor }]}>
        <Button
          onPress={() => {
            onSave(selectedEntries);
            otherProps.onRequestClose && otherProps.onRequestClose();
          }}
          style={{ alignItems: "center" }}
          lightColor="#1EEC64"
          darkColor="#1EEC64"
        >
          <Text
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              fontFamily: "montserrat-bold",
            }}
            lightColor="#FFF"
            darkColor="#000"
          >
            {submitButtonText}
          </Text>
        </Button>
      </View>
    </Box>
  );

  return (
    <Modal {...otherProps} transparent={true}>
      <View
        style={styles.modal}
        onTouchEnd={() =>
          otherProps.onRequestClose && otherProps.onRequestClose()
        }
      >
        {brand === "Apple" ? (
          <SafeAreaView style={[styles.container, styles.outerPadding]}>
            {content}
          </SafeAreaView>
        ) : (
          content
        )}
      </View>
    </Modal>
  );
};

interface SelectItem extends MenuItemProps {
  selected?: boolean;
}

const SelectItem = ({
  selected,
  style,
  children,
  ...otherProps
}: SelectItem) => {
  const { dark } = useTheme();

  return (
    <MenuItem
      {...otherProps}
      style={({ pressed }) => [
        styles.menuItem,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {children}
      {selected ? (
        <FontAwesome name="check" size={10} color={dark ? "#FFF" : "#000"} />
      ) : null}
    </MenuItem>
  );
};

type ModalHeaderProps = ViewProps &
  Pick<TextInputProps, "value" | "onChangeText">;

const ModalHeader = ({
  style,
  value,
  onChangeText,
  ...otherProps
}: ModalHeaderProps): JSX.Element => {
  const borderBottomColor = useThemeColor({}, "borderColor");

  return (
    <Box
      {...otherProps}
      style={[styles.header, { borderBottomColor }, style]}
      lightColor="#FFF"
    >
      <TextInput
        placeholder="Search..."
        value={value}
        onChangeText={onChangeText}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    borderRadius: Styling.borderRadius,
    overflow: "hidden",
  },
  outerPadding: {
    padding: Styling.spacingLarge,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: Styling.spacingMedium,
    paddingLeft: Styling.spacingSmall,
  },
  submitContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Styling.spacingMedium,
    borderTopWidth: 1,
  },
});

export default MultiSelectModal;
