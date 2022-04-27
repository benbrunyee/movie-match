import * as admin from "firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
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
        transaction = await transactionRemoveUsersPartners(transaction, [
          sender,
          receiver,
        ]);

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

async function transactionRemoveUsersPartners(
  transaction: admin.firestore.Transaction,
  uids: string[]
) {
  for (let uid of uids) {
    const userDoc = (
      await transaction.get(firestore.collection("users").doc(uid))
    ).data();
    const connectedUserDoc = userDoc?.connectedUser
      ? await transaction.get(
          firestore.collection("users").doc(userDoc.connectedUser)
        )
      : undefined;
    connectedUserDoc?.exists &&
      transaction.update(connectedUserDoc.ref, {
        connectedUser: null,
      });
  }

  return transaction;
}
