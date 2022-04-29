import {
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment,
  TokenOptions
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";

export const defaultEmail = "test@email.com";

console.error = () => {};
console.warn = () => {};

export type Firebase = ReturnType<RulesTestContext["firestore"]>;

export const setup = async (
  id: string,
  users: { uid: string; options?: TokenOptions; object?: object }[]
) => {
  const projectId = `rules-spec-${Date.now()}-${id}`;
  const app = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: "0.0.0.0",
      port: 8080,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });

  const dbUsers: { [key: string]: Firebase } = {
    unAuth: app.unauthenticatedContext().firestore(),
  };

  for (let user of users) {
    const db = app
      .authenticatedContext(user.uid, user.options || {})
      .firestore();

    dbUsers[user.uid] = db;

    if (user.object && Object.keys(user.object).length) {
      await db.doc(`users/${user.uid}`).set(user.object);
    }
  }

  return { app, users: dbUsers };
};

export const teardown = async (app: RulesTestEnvironment) => {
  await app.clearFirestore();
  await app.cleanup();
};

export const cleanDb = async (app: RulesTestEnvironment) => {
  await app.clearFirestore();
};
