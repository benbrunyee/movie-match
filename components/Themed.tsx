/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Pressable,
  PressableProps,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView
} from "react-native";
import Colors from "../constants/Colors";
import { sizes } from "../constants/Font";
import Styling from "../constants/Styling";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  return colorFromProps || Colors[theme][colorName];
}

export function useFontSize(variant?: keyof typeof sizes) {
  return variant ? sizes[variant] : sizes.body;
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type FontProps = {
  variant?: keyof typeof sizes;
};

export type TextProps = ThemeProps &
  FontProps &
  DefaultText["props"] & { disabled?: boolean };
export type BoxProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & FontProps & DefaultTextInput["props"];
export type ButtonProps = ThemeProps & PressableProps;
export type TabProps = ThemeProps & { selected?: boolean } & PressableProps;
export type ContainerProps = ThemeProps & DefaultView["props"];
export type MenuItemProps = ThemeProps &
  PressableProps & { topBorder?: boolean; bottomBorder?: boolean };

export function Text(props: TextProps) {
  const { disabled, variant, style, lightColor, darkColor, ...otherProps } =
    props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    disabled ? "textDisabled" : "text"
  );
  const fontSize = useFontSize(variant);

  return <DefaultText style={[{ color, fontSize }, style]} {...otherProps} />;
}

export function Box(props: BoxProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { variant, style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "placeholderText"
  );
  const fontSize = useFontSize(variant);

  return (
    <DefaultTextInput
      placeholderTextColor={placeholderTextColor}
      style={[{ color, fontSize, margin: Styling.spacingSmall }, style]}
      {...otherProps}
    />
  );
}

export function Button(props: ButtonProps) {
  const { disabled, style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBackgroundDefault"
  );
  const backgroundColorPressed = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBackgroundPressed"
  );

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? backgroundColorPressed : backgroundColor,
          paddingVertical: Styling.spacingSmall,
          paddingHorizontal: Styling.spacingMedium,
          borderRadius: Styling.borderRadius,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...otherProps}
    />
  );
}

export function Tab(props: TabProps) {
  const { onPress, selected, style, lightColor, darkColor, ...otherProps } =
    props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    selected ? "tabBackgroundSelected" : "tabBackgroundDefault"
  );
  const pressedBackgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBackgroundPressed"
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? pressedBackgroundColor : backgroundColor,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...otherProps}
    />
  );
}

export function Container(props: ContainerProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "containerBackgroundDefault"
  );

  return (
    <DefaultView
      style={[{ backgroundColor, borderRadius: Styling.borderRadius }, style]}
      {...otherProps}
    />
  );
}

export function MenuItem(props: MenuItemProps) {
  const {
    bottomBorder,
    topBorder,
    lightColor,
    darkColor,
    style,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "containerBackgroundDefault"
  );
  const backgroundColorPressed = useThemeColor(
    { light: lightColor, dark: darkColor },
    "containerBackgroundPressed"
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "borderColor"
  );

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? backgroundColorPressed : backgroundColor,
          ...(bottomBorder && {
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }),
          ...(topBorder && { borderTopWidth: 1, borderTopColor: borderColor }),
          padding: Styling.spacingMedium,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...otherProps}
    />
  );
}
