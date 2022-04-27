import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore
} from "firebase/firestore/lite";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  // TODO: Put into .extra file or env equivalent
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
connectFunctionsEmulator(functions, origin, 5001);

export const db = getFirestore(app);
connectFirestoreEmulator(db, origin, 8080);

export const auth = getAuth(app);
connectAuthEmulator(auth, `http://${origin}:9099`);