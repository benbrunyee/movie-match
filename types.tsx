/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  Login: LoginTabParamList | undefined;
  Verification: undefined;
};

export type ModalStackParamList = {
  ConnectParter: undefined;
  SearchOptions: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Discover: undefined;
  Matches: undefined;
  Settings: NavigatorScreenParams<SettingsParamList> | undefined;
};

export type SettingsParamList = {
  SettingsScreen: undefined;
  ConnectPartnerModal: undefined;
  SearchOptions: undefined;
};

export type LoginTabParamList = {
  fromVerification?: boolean;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type SettingsTabScreenProps<Screen extends keyof SettingsParamList> =
  NativeStackScreenProps<SettingsParamList, Screen>;
