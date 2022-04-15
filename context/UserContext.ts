import { createContext, useContext } from "react";

export interface UserContextObject {
  sub: string;
  email: string;
  signedIn: boolean;
  connectedPartner: string;
}

export const UserContext = createContext<
  [UserContextObject, React.Dispatch<React.SetStateAction<UserContextObject>>]
>([
  {
    email: "",
    sub: "",
    signedIn: false,
    connectedPartner: "",
  },
  () => {},
]);

export const useUserContext = () => useContext(UserContext);
