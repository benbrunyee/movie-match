import { LinkingOptions } from "@react-navigation/native";
import { createURL } from "expo-linking";
import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [createURL("/")],
  config: {
    screens: {
      Login: "login",
      Verification: "verification",
      Root: {
        screens: {
          Discover: {
            screens: {
              DiscoverScreen: "discover",
            },
          },
          Matches: {
            screens: {
              MatchesScreen: "matches",
            },
          },
          Settings: {
            screens: {
              SettingsScreen: {
                screens: {
                  SettingsScreen: "settings",
                },
              },
              ConnectPartner: {
                screens: {
                  ConnectPartner: "connect-partner",
                },
              },
              SearchOptions: {
                screens: {
                  SearchOptions: "search-options",
                },
              },
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};

export default linking;
