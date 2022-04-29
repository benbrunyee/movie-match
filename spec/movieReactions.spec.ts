import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment
} from "@firebase/rules-unit-testing";
import { defaultEmail, Firebase, setup, teardown } from "./helpers";

describe("Movie Reaction rules", () => {
  let authDb1: Firebase,
    authDb2: Firebase,
    unAuthDb: Firebase,
    app: RulesTestEnvironment;

  beforeAll(async () => {
    const conf = await setup("movieReactions", [
      {
        uid: "authUid1",
        options: {
          email: defaultEmail,
        },
        object: {
          uid: "authUid1",
          email: defaultEmail,
        },
      },
      {
        uid: "authUid2",
        options: {
          email: defaultEmail,
        },
      },
    ]);

    app = conf.app;
    unAuthDb = conf.users.unAuth;
    authDb1 = conf.users.authUid1;
    authDb2 = conf.users.authUid2;
  });

  afterAll(async () => {
    await teardown(app);
  });

  /**
   * Create
   */

  test("can create movie reaction doc as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.collection("movieReactions").add({
          movieId: "movieId",
          reaction: "LIKE",
          owner: "authUid1",
        })
      )
    );
  });

  test("cannot create movie reaction doc as unauth user", async () => {
    expect(
      await assertFails(
        unAuthDb.collection("movieReactions").add({
          movieId: "movieId",
          reaction: "LIKE",
          owner: "authUid1",
        })
      )
    );
  });

  test("cannot create movie reaction doc with incorrect owner as auth user", async () => {
    expect(
      await assertFails(
        authDb1.collection("movieReactions").add({
          movieId: "movieId",
          reaction: "LIKE",
          owner: "authUid2",
        })
      )
    );
  });

  test("cannot create movie reaction doc with other fields as auth user", async () => {
    expect(
      await assertFails(
        authDb1.collection("movieReactions").add({
          movieId: "movieId",
          reaction: "LIKE",
          owner: "authUid1",
          newField: "newField"
        })
      )
    );
  });

  test("cannot create movie reaction doc as auth user without user doc", async () => {
    expect(
      await assertFails(
        authDb2.collection("movieReactions").add({
          movieId: "movieId",
          reaction: "LIKE",
          owner: "authUid2",
        })
      )
    );
  });
});
