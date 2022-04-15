import {
  ConnectionRequest,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { acceptRequest, getConnectionRequest } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { updateUser } from "../lib/graphql/mutations";

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
  const request = await getConnectionRequest(requestId);

  // Just for TS validation
  if (!request.sender) {
    throw new Error("Could not find sender of the request");
  }

  // Validation checks
  validateRequest(event, request);

  // Accept the request
  await acceptRequest(requestId);

  console.debug("Successfully accepted connection request");

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
