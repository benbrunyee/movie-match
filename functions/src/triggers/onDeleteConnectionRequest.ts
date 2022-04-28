import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { EventContext, logger } from "firebase-functions";
import { firestore } from "..";

export default async (snap: QueryDocumentSnapshot, context: EventContext) => {
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
      logger.error("Failed to update users after request was deleted: ", e);
    }
  }
};
