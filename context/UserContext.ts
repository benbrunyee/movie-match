import { createContext, useContext } from "react";

export interface UserContextObject {
  uid: string;
  email: string;
  signedIn: boolean;
  connectedPartner: string;
  userDbObj: object;
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
