/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Modal as DefaultModal,
  Pressable,
  PressableProps,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView
} from "react-native";
import DefaultSwiper from "react-native-deck-swiper";
import LogoDark from "../assets/images/logo-dark.svg";
import LogoLight from "../assets/images/logo-light.svg";
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
export type MenuItemProps = ThemeProps & PressableProps;
export type SwiperProps<T> = DefaultSwiper<T>["props"] & {
  passRef: React.Ref<DefaultSwiper<T>>;
} & ThemeProps;
export type ModalProps = DefaultModal["props"] & ThemeProps;
export type LogoProps = {
  height?: number | string;
  width?: number | string;
};

export function Text(props: TextProps) {
  const { disabled, variant, style, lightColor, darkColor, ...otherProps } =
    props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    disabled ? "textDisabled" : "text"
  );
  const fontSize = useFontSize(variant);

  return (
    <DefaultText
      style={[{ color, fontSize, fontFamily: "montserrat-medium" }, style]}
      {...otherProps}
    />
  );
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
  const placeholderTextColor = useThemeColor({}, "placeholderText");
  const fontSize = useFontSize(variant);

  return (
    <DefaultTextInput
      placeholderTextColor={placeholderTextColor}
      style={[{ color, fontSize, borderRadius: Styling.borderRadius }, style]}
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
  const { lightColor, darkColor, style, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "menuItemDefault"
  );
  const backgroundColorPressed = useThemeColor(
    { light: lightColor, dark: darkColor },
    "menuItemPressed"
  );

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? backgroundColorPressed : backgroundColor,
          padding: Styling.spacingMedium,
          borderRadius: Styling.borderRadius,
        },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...otherProps}
    />
  );
}

export function Swiper<T>({
  lightColor,
  darkColor,
  passRef,
  ...otherProps
}: SwiperProps<T>) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultSwiper
      ref={passRef}
      backgroundColor={backgroundColor}
      {...otherProps}
    />
  );
}

export function Modal({
  lightColor,
  darkColor,
  style,
  ...otherProps
}: ModalProps) {
  const backgroundColor = useThemeColor(
    {
      light: lightColor,
      dark: darkColor,
    },
    "modalBackground"
  );

  return <DefaultModal style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Logo(props: LogoProps) {
  const { dark } = useTheme();

  return dark ? <LogoLight {...props} /> : <LogoDark {...props} />;
}
