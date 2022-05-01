import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot
} from "firebase-admin/firestore";
import { Change, EventContext, logger } from "firebase-functions";
import { firestore } from "..";

export default async (
  change: Change<QueryDocumentSnapshot>,
  context: EventContext
) => {
  const before = change.before.data();

  if (change.after.data().status === "ACCEPTED") {
    const sender = before.sender;
    const receiver = before.receiver;

    try {
      await firestore.runTransaction(async (transaction) => {
        const oldPartnerRefs: DocumentReference<DocumentData>[] = [];

        // Run all the gets first and add to array if the previous connectedUser
        // has a database object
        for (const uid of [sender, receiver]) {
          const userDoc = (
            await transaction.get(firestore.collection("users").doc(uid))
          ).data();

          const connectedUserDoc = userDoc?.connectedUser
            ? await transaction.get(
                firestore.collection("users").doc(userDoc.connectedUser)
              )
            : undefined;

          if (connectedUserDoc?.exists) {
            console.log(connectedUserDoc.id);
          }

          connectedUserDoc?.exists && oldPartnerRefs.push(connectedUserDoc.ref);
        }

        // Find any old connectionRequest entries sent from either user
        const conReqRef = firestore.collection("connectionRequests");
        const oldSentAcceptedRequests = await conReqRef
          .where("sender", "in", [sender, receiver])
          .where("status", "==", "ACCEPTED")
          .get();
        const oldReceivedAcceptedRequests = await conReqRef
          .where("receiver", "in", [sender, receiver])
          .where("status", "==", "ACCEPTED")
          .get();

        // Delete the old sent and received "ACCEPTED" requests
        for (const doc of [
          ...oldSentAcceptedRequests.docs,
          ...oldReceivedAcceptedRequests.docs,
        ]) {
          // Don't delete the doc that this update is in relation to
          if (change.before.id === doc.id) {
            continue;
          }
          transaction.delete(doc.ref);
        }

        // Remove the sender and/or receiver from the old partner's user entries
        for (const ref of oldPartnerRefs) {
          transaction.update(ref, {
            connectedUser: null,
          });
        }

        // Set the connectedUser for the sender and receiver
        transaction.update(firestore.collection("users").doc(sender), {
          connectedUser: receiver,
        });
        transaction.update(firestore.collection("users").doc(receiver), {
          connectedUser: sender,
        });
      });
    } catch (e) {
      logger.error("Failed to updated users after request was accepted: ", e);
    }
  }
};
