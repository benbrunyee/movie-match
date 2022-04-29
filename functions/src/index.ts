import * as admin from "firebase-admin";
import { firestore as db, https } from "firebase-functions";
import funcOnUpdateConnectionRequest from "../triggers/onUpdateConnectionRequest";
import funcDiscoverMovies from "./callable/discoverMovies";
import funcGetPageCountForOptions from "./callable/getPageCountForOptions";
import funcOnCreateMovieReaction from "./triggers/onCreateMovieReaction";
import funcOnCreateUser from "./triggers/onCreateUser";
import funcOnDeleteConnectionRequest from "./triggers/onDeleteConnectionRequest";
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
  .onUpdate(funcOnUpdateConnectionRequest);

export const onDeleteConnectionRequest = db
  .document("connectionRequests/{id}")
  .onDelete(funcOnDeleteConnectionRequest);

export const onCreateMovieReaction = db
  .document("movieReactions/{id}")
  .onCreate(funcOnCreateMovieReaction);

export const onCreateUser = db
  .document("users/{id}")
  .onCreate(funcOnCreateUser);
