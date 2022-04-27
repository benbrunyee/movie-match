import {
  doc,
  DocumentData, getDoc, setDoc
} from "firebase/firestore/lite";
import { UserContextObject } from "../context/UserContext";
import { auth, db } from "../firebase";

export default async function configureUser(): Promise<UserContextObject> {
  let userDbData: DocumentData | undefined = undefined;

  const { currentUser } = auth;

  if (!currentUser) {
    throw new Error("User not logged in, cannot configure user.");
  }

  console.debug(currentUser);

  // Check the database object
  const userRef = doc(db, "users", currentUser.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const newUserDoc = {
      uid: currentUser.uid,
      email: currentUser.email || "",
    };

    await setDoc(doc(db, "users", currentUser.uid), newUserDoc);

    userDbData = newUserDoc;
  } else {
    userDbData = userDoc.data();
  }

  const userContext = {
    signedIn: true,
    uid: currentUser.uid,
    email: currentUser.email || "",
    connectedPartner: userDbData.connectedUser || "",
    userDbObj: userDbData,
  };

  console.log(`User context: ${JSON.stringify(userContext, null, 2)}`);

  return userContext;
}
