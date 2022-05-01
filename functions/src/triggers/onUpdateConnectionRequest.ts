import * as admin from "firebase-admin";
import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  Transaction
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
      // ! TODO: Delete the old connection request entry (this is currently staying in the database as an "ACCEPTED" entry)
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

/**
 * Removes connected partners for a specified list of users
 * @param {admin.firestore.Transaction} transaction Firestore transaction
 * @param {string[]} uids Array of uids to clear connected partners for
 * @return {Promise<admin.firestore.Transaction>} Firestore transaction
 */
async function transactionRemoveUsersPartners(
  transaction: admin.firestore.Transaction,
  uids: string[]
): Promise<Transaction> {
  const refsToBeUpdated: DocumentReference<DocumentData>[] = [];

  // Run all the gets first and add to array if the connectedUser
  // has a database object
  for (const uid of uids) {
    const userDoc = (
      await transaction.get(firestore.collection("users").doc(uid))
    ).data();

    const connectedUserDoc = userDoc?.connectedUser
      ? await transaction.get(
          firestore.collection("users").doc(userDoc.connectedUser)
        )
      : undefined;

    connectedUserDoc?.exists && refsToBeUpdated.push(connectedUserDoc.ref);
  }

  // Set the connectedUser to null for the older partners
  for (const ref of refsToBeUpdated) {
    transaction.update(ref, {
      connectedUser: null,
    });
  }

  return transaction;
}
