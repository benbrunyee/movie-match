import { API, Auth, graphqlOperation } from "aws-amplify";
import { UserContextObject } from "../context/UserContext";
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  ListUsersQuery,
} from "../src/API";
import { createUser } from "../src/graphql/mutations";
import { listUsers } from "../src/graphql/queries";
import { callGraphQL } from "./amplify";

export default async function configureUser(): Promise<UserContextObject> {
  try {
    const authStatus = await Auth.currentAuthenticatedUser();

    console.debug(authStatus);

    // Check the database object
    const dbItems = await callGraphQL<ListUsersQuery>(listUsers);

    if (dbItems.data?.listUsers?.items.length || 0 <= 0) {
      // Create the database object since this is first login
      await createDbOj({
        email: authStatus.attributes.email,
        sub: authStatus.attributes.sub,
      });
    }

    return {
      signedIn: true,
      sub: authStatus.attributes.sub,
      email: authStatus.attributes.email,
    };
  } catch (e) {
    console.warn(e);

    return {
      email: "",
      sub: "",
      signedIn: false,
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
