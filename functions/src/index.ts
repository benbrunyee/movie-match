import * as admin from "firebase-admin";
import { firestore as db, https } from "firebase-functions";
import funcDiscoverMovies from "./functions/discoverMovies";
import funcGetPageCountForOptions from "./functions/getPageCountForOptions";
import { callWrap } from "./util/common";

admin.initializeApp();
export const firestore = admin.firestore();

export const discoverMovies = https.onCall(
  callWrap(funcDiscoverMovies, { authRoute: true })
);

export const getPageCountForOptions = https.onCall(
  callWrap(funcGetPageCountForOptions, { authRoute: false })
);

// TODO: Group into files
export const onConnectionAccept = db
  .document("connectionRequests/{id}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();

    if (change.after.data().status === "ACCEPTED") {
      const sender = before.sender;
      const receiver = before.receiver;

      try {
        const batch = firestore.batch();
        batch.update(firestore.collection("users").doc(sender), {
          connectedUser: receiver,
        });
        batch.update(firestore.collection("users").doc(receiver), {
          connectedUser: sender,
        });
        await batch.commit();
      } catch (e) {
        console.error(e);
      }
    }
  });

export const onConnectionDelete = db
  .document("connectionRequests/{id}")
  .onDelete(async (snap, context) => {
    const snapData = snap.data();

    if (snapData.status === "ACCEPTED") {
      const sender = snapData.sender;
      const receiver = snapData.receiver;

      try {
        const batch = firestore.batch();
        batch.update(firestore.collection("users").doc(sender), {
          connectedUser: null,
        });
        batch.update(firestore.collection("users").doc(receiver), {
          connectedUser: null,
        });
        await batch.commit();
      } catch (e) {
        console.error(e);
      }
    }
  });
