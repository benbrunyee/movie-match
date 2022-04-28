import * as admin from "firebase-admin";
import { firestore as db, https } from "firebase-functions";
import funcDiscoverMovies from "./callable/discoverMovies";
import funcGetPageCountForOptions from "./callable/getPageCountForOptions";
import funcOnCreateMovieReaction from "./triggers/onCreateMovieReaction";
import funcOnCreateUser from "./triggers/onCreateUser";
import funcOnDeleteConnectionRequests from "./triggers/onDeleteConnectionRequest";
import funcOnUpdateConnectionRequests from "./triggers/onUpdateConnectionRequests";
import { callWrap } from "./util/common";

admin.initializeApp();
export const firestore = admin.firestore();

export const discoverMovies = https.onCall(
  callWrap(funcDiscoverMovies, { authRoute: false })
);

export const getPageCountForOptions = https.onCall(
  callWrap(funcGetPageCountForOptions, { authRoute: false })
);

export const onUpdateConnectionRequest = db
  .document("connectionRequests/{id}")
  .onUpdate(funcOnUpdateConnectionRequests);

export const onDeleteConnectionRequest = db
  .document("connectionRequests/{id}")
  .onDelete(funcOnDeleteConnectionRequests);

export const onCreateMovieReaction = db
  .document("movieReactions/{id}")
  .onCreate(funcOnCreateMovieReaction);

export const onCreateUser = db
  .document("users/{id}")
  .onCreate(funcOnCreateUser);
