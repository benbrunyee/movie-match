import {
  ConnectionRequest,
  ConnectionRequestStatus,
  GetConnectionRequestQuery,
  GetConnectionRequestQueryVariables,
  UpdateConnectionRequestMutation,
  UpdateConnectionRequestMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import EventIdentity from "../lib/eventIdentity";
import { updateConnectionRequest, updateUser } from "../lib/graphql/mutations";
import { getConnectionRequest } from "../lib/graphql/queries";

export interface EventInterface extends EventIdentity {
  arguments: {
    input: {
      requestId: string;
    };
  };
}

export default async (event: EventInterface) => {
  const requestId = event.arguments.input.requestId;

  console.debug(`Connection Request ID: ${requestId}`);

  // Get the request
  const request = await getRequest(requestId);

  // Just for TS validation
  if (!request.sender) {
    throw new Error("Could not find sender of the request");
  }

  // Validation checks
  validateRequest(event, request);

  // Accept the request
  await acceptRequest(requestId);

  // Update the users
  await updateUsers(request.sender, request.receiver);

  return {
    status: true,
  };
};

async function updateUsers(senderId: string, receiverId: string) {
  // Update the receiver
  await callGraphQl<UpdateUserMutation, UpdateUserMutationVariables>(
    {
      updateUser,
    },
    {
      input: {
        id: receiverId,
        connectedUser: senderId,
      },
    }
  );

  console.debug("Successfully updated the receiver's user obj");

  // Update the sender
  await callGraphQl<UpdateUserMutation, UpdateUserMutationVariables>(
    {
      updateUser,
    },
    {
      input: {
        id: senderId,
        connectedUser: receiverId,
      },
    }
  );

  console.debug("Successfully updated the sender's user obj");
}

async function acceptRequest(id: string) {
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

function validateRequest(event: EventInterface, request: ConnectionRequest) {
  const sender = request.sender;
  const receiver = request.receiver;

  if (!event.identity.username) {
    throw new Error("Call this function as a logged in user");
  }

  if (!sender) {
    throw new Error("Could not find sender associated with connection request");
  }

  if (receiver !== event.identity.username) {
    throw new Error(
      "Cannot accept connection request that was not sent to you"
    );
  }

  console.debug(`Sender ID: ${sender}`);
  console.debug(`Receiver ID: ${receiver}`);

  if (sender === receiver) {
    throw new Error("Cannot accept a request to yourself");
  }

  console.debug("Request to accept connection request is valid");
}

async function getRequest(id: string) {
  const request = await callGraphQl<
    GetConnectionRequestQuery,
    GetConnectionRequestQueryVariables
  >(
    { getConnectionRequest },
    {
      id,
    }
  );

  if (!request.data?.getConnectionRequest) {
    throw new Error("Couldn't find connection request");
  }

  console.debug("Successfully got the connection request database obj");

  return request.data.getConnectionRequest;
}
