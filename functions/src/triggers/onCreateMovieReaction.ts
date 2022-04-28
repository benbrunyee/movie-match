import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { EventContext, logger } from "firebase-functions";
import { firestore } from "..";

export default async (
  snapshot: QueryDocumentSnapshot,
  context: EventContext
) => {
  try {
    firestore.doc(snapshot.ref.path).update({
      createdAt: snapshot.createTime,
    });
  } catch (e) {
    logger.error("Failed to add createdAt field to movie reaction: ", e);
  }
};
