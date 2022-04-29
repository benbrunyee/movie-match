import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { EventContext, logger } from "firebase-functions";
import { firestore } from "..";

export default async (
  snapshot: QueryDocumentSnapshot,
  context: EventContext
) => {
  const email = snapshot.data()?.email;

  try {
    firestore.doc(snapshot.ref.path).update({
      createdAt: snapshot.createTime,
      ...(email && { email: String(email).toLowerCase() }),
    });
  } catch (e) {
    logger.error("Failed to add createdAt field to user: ", e);
  }
};
