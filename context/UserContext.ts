import { createContext, useContext } from "react";
import { User } from "../src/API";

export interface UserContextObject {
  sub: string;
  email: string;
  signedIn: boolean;
  connectedPartner: string;
  userDbObj: Omit<User, "__typename"> | {}
}

export const UserContext = createContext<
  [UserContextObject, React.Dispatch<React.SetStateAction<UserContextObject>>]
>([
  {
    email: "",
    sub: "",
    signedIn: false,
    connectedPartner: "",
    userDbObj: {}
  },
  () => {},
]);

export const useUserContext = () => useContext(UserContext);
