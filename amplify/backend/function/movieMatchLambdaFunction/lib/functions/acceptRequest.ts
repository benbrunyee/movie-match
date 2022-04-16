import {
  AcceptRequestInput,
  ConnectionRequest,
  DeleteConnectionRequestMutation,
  DeleteConnectionRequestMutationVariables,
  ListConnectionRequestsQuery,
  ListConnectionRequestsQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from "../lib/API";
import callGraphQl from "../lib/appSync";
import { acceptRequest, getConnectionRequest, getUser } from "../lib/common";
import EventIdentity from "../lib/eventIdentity";
import { deleteConnectionRequest, updateUser } from "../lib/graphql/mutations";
import { listConnectionRequests } from "../lib/graphql/queries";

export interface EventInterface extends EventIdentity {
  arguments: {
    input: AcceptRequestInput;
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

  // Clear partners
  await clearPartners([request.sender, request.receiver]);

  console.debug("Successfully cleared partners");

  // Update the users
  await updateUsers(request.sender, request.receiver);

  return {
    status: true,
  };
};

async function clearExistingConReq([userIdOne, userIdTwo]: string[]) {
  const existingReq = await callGraphQl<
    ListConnectionRequestsQuery,
    ListConnectionRequestsQueryVariables
  >(
    { listConnectionRequests },
    {
      filter: {
        and: [
          {
            or: [
              { receiver: { eq: userIdOne } },
              { sender: { eq: userIdOne } },
            ],
          },
          {
            or: [
              { receiver: { eq: userIdTwo } },
              { sender: { eq: userIdTwo } },
            ],
          },
        ],
      },
    }
  );

  if (!existingReq.data?.listConnectionRequests) {
    throw new Error(
      `Failed to list existing connection request for user: ${userIdOne} and partner: ${userIdTwo}`
    );
  }

  const existingReqItems = existingReq.data.listConnectionRequests.items;

  for (let reqId of existingReqItems) {
    if (!reqId?.id) {
      throw new Error("Failed to find ID from existing connection request");
    }

    console.debug(
      `Deleting existing request ID: ${reqId.id} for user: ${userIdOne} and old partner: ${userIdTwo}`
    );

    await callGraphQl<
      DeleteConnectionRequestMutation,
      DeleteConnectionRequestMutationVariables
    >(
      { deleteConnectionRequest },
      {
        input: {
          id: reqId.id,
        },
      }
    );

    console.debug(
      `Successfully deleted existing request ID: ${reqId.id} for user: ${userIdOne} and old partner: ${userIdTwo}`
    );
  }
}

async function clearPartners(userIds: string[]) {
  for (let id of userIds) {
    const user = await getUser(id);
    const partner = user.connectedUser;

    if (!partner) {
      // Nothing to do
      console.debug(`User: ${id} does not have a connected partner to clear`);
      continue;
    }

    await callGraphQl<UpdateUserMutation, UpdateUserMutationVariables>(
      { updateUser },
      {
        input: {
          id: partner,
          connectedUser: null,
        },
      }
    );

    console.debug(`Set connected partner for user: ${partner} to "null"`);

    await clearExistingConReq([id, partner]);
  }
}

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
