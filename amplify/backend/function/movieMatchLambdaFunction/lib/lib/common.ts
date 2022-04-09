import {
  ConnectionRequestStatus,
  GetConnectionRequestQuery,
  GetConnectionRequestQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  UpdateConnectionRequestMutation,
  UpdateConnectionRequestMutationVariables,
} from "./API";
import callGraphQl from "./appSync";
import { updateConnectionRequest } from "./graphql/mutations";
import {
  getConnectionRequest as getGraphConnectionRequest,
  getUser as getGraphUser,
} from "./graphql/queries";

export async function getUser(id: string) {
  const request = await callGraphQl<GetUserQuery, GetUserQueryVariables>(
    { getGraphUser },
    {
      id,
    }
  );

  if (!request.data?.getUser) {
    throw new Error(`Couldn't find user database obj: ${id}`);
  }

  console.debug(`Successfully got user database obj: ${id}`);

  return request.data.getUser;
}

export async function acceptRequest(id: string) {
  const status = ConnectionRequestStatus.ACCEPTED;

  const res = await callGraphQl<
    UpdateConnectionRequestMutation,
    UpdateConnectionRequestMutationVariables
  >(
    { updateConnectionRequest },
    {
      input: {
        id,
        status,
      },
    }
  );

  console.debug(`Successfully updated connection request to: ${status}`);

  return res;
}

export async function getConnectionRequest(id: string) {
  const request = await callGraphQl<
    GetConnectionRequestQuery,
    GetConnectionRequestQueryVariables
  >(
    { getConnectionRequest: getGraphConnectionRequest },
    {
      id,
    }
  );

  if (!request.data?.getConnectionRequest) {
    throw new Error(`Couldn't find connection request: ${id}`);
  }

  console.debug(`Successfully got the connection request database obj: ${id}`);

  return request.data.getConnectionRequest;
}
