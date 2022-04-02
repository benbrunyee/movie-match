/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Pressable,
  PressableProps,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
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

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
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

export type TextProps = ThemeProps & FontProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & FontProps & DefaultTextInput["props"];
export type ButtonProps = ThemeProps &
  FontProps &
  DefaultView["props"] &
  Pick<PressableProps, "onPress">;
export type TabProps = ThemeProps &
  DefaultView["props"] & { selected?: boolean } & Pick<
    PressableProps,
    "onPress"
  >;
export type ContainerProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { variant, style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const fontSize = useFontSize(variant);

  return <DefaultText style={[{ color, fontSize }, style]} {...otherProps} />;
}

export function Box(props: ViewProps) {
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
  const {
    onPress,
    style,
    children,
    variant,
    lightColor,
    darkColor,
    ...otherProps
  } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const fontSize = useFontSize(variant);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBackground"
  );

  return (
    <Pressable onPress={onPress}>
      <DefaultView
        style={[
          {
            backgroundColor,
            width: "fit-content",
            paddingVertical: Styling.spacingSmall,
            paddingHorizontal: Styling.spacingMedium,
            borderRadius: Styling.borderRadius,
          },
          style,
        ]}
        {...otherProps}
      >
        <DefaultText
          style={[{ color, fontSize, textAlign: "center" }]}
          children={children}
        />
      </DefaultView>
    </Pressable>
  );
}

export function Tab(props: TabProps) {
  const { onPress, selected, style, lightColor, darkColor, ...otherProps } =
    props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    selected ? "tabBackgroundSelected" : "tabBackgroundDefault"
  );

  return (
    <Pressable onPress={onPress}>
      <DefaultView
        style={[
          {
            backgroundColor,
          },
          style,
        ]}
        {...otherProps}
      />
    </Pressable>
  );
}

export function Container(props: ContainerProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "containerBackground"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
