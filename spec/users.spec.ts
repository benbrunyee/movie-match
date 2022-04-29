import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment
} from "@firebase/rules-unit-testing";
import { cleanDb, defaultEmail, Firebase, setup, teardown } from "./helpers";

describe("User rules", () => {
  let authDb1: Firebase,
    authDb2: Firebase,
    unAuthDb: Firebase,
    app: RulesTestEnvironment;

  beforeAll(async () => {
    const conf = await setup("users", [
      {
        uid: "authUid1",
        options: {
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

  afterEach(async () => {
    await cleanDb(app);
  });

  /**
   * Create
   */

  test("can create user doc as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
  });

  test("cannot create user doc with incorrect uid", async () => {
    expect(
      await assertFails(
        authDb1.doc("users/wrongUid").set({
          uid: "wrongUid",
          email: defaultEmail,
        })
      )
    );
    expect(
      await assertFails(
        authDb1.doc("users/wrongUid").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(
      await assertFails(
        authDb1.doc("users/authUid1").set({
          uid: "wrongUid",
          email: defaultEmail,
        })
      )
    );
  });

  test("cannot create user doc as unauth user", async () => {
    expect(
      await assertFails(
        unAuthDb.doc("users/randomUid").set({
          uid: "randomUid",
          email: defaultEmail,
        })
      )
    );
  });

  test("cannot create user doc with incorrect email", async () => {
    expect(
      await assertFails(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: "wrong@email.com",
        })
      )
    );
  });

  test("cannot create user doc without email", async () => {
    expect(
      await assertFails(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
        })
      )
    );
  });

  test("cannot create user doc without uid", async () => {
    expect(
      await assertFails(
        authDb1.doc("users/authUid1").set({
          email: defaultEmail,
        })
      )
    );
  });

  test("cannot create user doc with no fields", async () => {
    expect(await assertFails(authDb1.doc("user/authUid1").set({})));
  });

  test("cannot create user doc with connected user", async () => {
    expect(
      await assertFails(
        authDb1.doc("users/authUid1").set({
          email: defaultEmail,
          uid: "authUid",
          connectedUser: "authUid2",
        })
      )
    );
  });

  /**
   * Read
   */

  test("can read owners user doc as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
  });

  test("can read others user doc as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(await assertSucceeds(authDb2.doc("users/authUid1").get()));
  });

  test("cannot read others user doc as unauth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(await assertFails(unAuthDb.doc("users/authUid1").get()));
  });

  /**
   * Update
   */

  test("cannot update owners user doc with connected user as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(
      await assertFails(
        authDb1.doc("users/authUid1").update({
          connectedUser: "authUid2",
        })
      )
    );
  });

  test("cannot update others user doc with connected user as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(
      await assertFails(
        authDb2.doc("users/authUid1").update({
          connectedUser: "authUid2",
        })
      )
    );
  });

  test("cannot update others user doc with connected user as unauth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(
      await assertFails(
        authDb2.doc("users/authUid1").update({
          connectedUser: "authUid2",
        })
      )
    );
  });

  /**
   * Delete
   */

  test("cannot delete others user doc as auth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(await assertFails(authDb2.doc("users/authUid1").delete()));
  });

  test("cannot delete others user doc as unauth user", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(await assertFails(unAuthDb.doc("users/authUid1").delete()));
  });

  test("cannot delete owners user doc", async () => {
    expect(
      await assertSucceeds(
        authDb1.doc("users/authUid1").set({
          uid: "authUid1",
          email: defaultEmail,
        })
      )
    );
    expect(await assertFails(authDb1.doc("users/authUid1").delete()));
  });
});
