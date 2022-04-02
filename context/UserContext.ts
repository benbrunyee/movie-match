import { createContext, useContext } from "react";

export interface UserContextObject {
  sub: string;
  email: string;
  signedIn?: boolean;
}

export const UserContext = createContext<
  [UserContextObject, React.Dispatch<React.SetStateAction<UserContextObject>>]
>([
  {
    email: "",
    sub: "",
    signedIn: true,
  },
  () => {},
]);

export const useUserContext = () => useContext(UserContext);
