import * as admin from "firebase-admin";
import { firestore as db, https } from "firebase-functions";
import funcDiscoverMovies from "./callable/discoverMovies";
import funcGetPageCountForOptions from "./callable/getPageCountForOptions";
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

// TODO: Group into files
export const onConnectionAccept = db
  .document("connectionRequests/{id}")
  .onUpdate(funcOnUpdateConnectionRequests);

export const onConnectionDelete = db
  .document("connectionRequests/{id}")
  .onDelete(funcOnDeleteConnectionRequests);
