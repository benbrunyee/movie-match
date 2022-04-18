import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Auth } from "aws-amplify";
import { UserContextObject } from "../context/UserContext";
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  FindMovieMatchesQuery,
  GetUserQuery,
  GetUserQueryVariables
} from "../src/API";
import { createUser } from "../src/graphql/mutations";
import { findMovieMatches, getUser } from "../src/graphql/queries";
import { callGraphQL } from "./amplify";

export default async function configureUser(): Promise<UserContextObject> {
  const authStatus = await Auth.currentAuthenticatedUser();

  console.debug(authStatus);

  // Check the database object
  const userDb: GraphQLResult<GetUserQuery> = await callGraphQL<
    GetUserQuery,
    GetUserQueryVariables
  >(getUser, {
    id: authStatus.attributes.sub,
  });

  if (!userDb?.data?.getUser) {
    // Create the database object since this is first login
    await createDbOj({
      id: authStatus.attributes.sub,
      email: authStatus.attributes.email,
      sub: authStatus.attributes.sub,
    });
  }

  if (userDb?.data?.getUser?.connectedUser) {
    // Refresh matches on load
    await callGraphQL<FindMovieMatchesQuery>(findMovieMatches);
  }

  return {
    signedIn: true,
    sub: authStatus.attributes.sub,
    email: authStatus.attributes.email,
    connectedPartner: userDb?.data?.getUser?.connectedUser || "",
  };
}

async function createDbOj(options: CreateUserInput) {
  await callGraphQL<CreateUserMutation, CreateUserMutationVariables>(
    createUser,
    {
      input: options,
    }
  );
}
