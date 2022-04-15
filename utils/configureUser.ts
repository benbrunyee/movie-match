import { Auth } from "aws-amplify";
import { UserContextObject } from "../context/UserContext";
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  FindMovieMatchesQuery,
  ListUsersQuery
} from "../src/API";
import { createUser } from "../src/graphql/mutations";
import { findMovieMatches, listUsers } from "../src/graphql/queries";
import { callGraphQL } from "./amplify";

export default async function configureUser(): Promise<UserContextObject> {
  try {
    const authStatus = await Auth.currentAuthenticatedUser();

    console.debug(authStatus);

    // Check the database object
    const dbItems = await callGraphQL<ListUsersQuery>(listUsers);

    if (!dbItems.data?.listUsers?.items) {
      throw new Error("Could not list Users");
    }

    if (dbItems.data.listUsers.items.length === 0) {
      // Create the database object since this is first login
      await createDbOj({
        id: authStatus.attributes.sub,
        email: authStatus.attributes.email,
        sub: authStatus.attributes.sub,
      });
    }

    if (dbItems.data.listUsers.items[0]?.connectedUser) {
      // Refresh matches on load
      await callGraphQL<FindMovieMatchesQuery>(findMovieMatches);
    }

    return {
      signedIn: true,
      sub: authStatus.attributes.sub,
      email: authStatus.attributes.email,
      connectedPartner: dbItems.data.listUsers.items[0]?.connectedUser || "",
    };
  } catch (e) {
    console.warn(e);

    return {
      email: "",
      sub: "",
      signedIn: false,
      connectedPartner: "",
    };
  }
}

async function createDbOj(options: CreateUserInput) {
  await callGraphQL<CreateUserMutation, CreateUserMutationVariables>(
    createUser,
    {
      input: options,
    }
  );
}
