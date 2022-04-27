import { createContext, useContext } from "react";
import { User } from "../src/API";

export interface UserContextObject {
  uid: string;
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
    uid: "",
    signedIn: false,
    connectedPartner: "",
    userDbObj: {}
  },
  () => {},
]);

export const useUserContext = () => useContext(UserContext);
