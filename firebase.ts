import Constants from "expo-constants";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const DEV = process.env.NODE_ENV === "development";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBpgBc0NSABm0qj0ud4UBTERyHH-CYpuQQ",
  authDomain: "movie-match-fdfc2.firebaseapp.com",
  projectId: "movie-match-fdfc2",
  storageBucket: "movie-match-fdfc2.appspot.com",
  messagingSenderId: "44369667763",
  appId: "1:44369667763:web:b6397eaa8bddd01eb1f2c6",
};

const origin =
  Constants.manifest?.debuggerHost?.split(":").shift() || "localhost";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);
// DEV && connectFunctionsEmulator(functions, origin, 5001);

initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
export const db = getFirestore(app);
// DEV && connectFirestoreEmulator(db, origin, 8080);

export const auth = getAuth(app);
// Localize the OAuth the flow to the user's preferred language
auth.languageCode = "it";
// DEV && connectAuthEmulator(auth, `http://${origin}:9099`);
