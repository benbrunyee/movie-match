/* Amplify Params - DO NOT EDIT
	API_MOVIEMATCH_GRAPHQLAPIENDPOINTOUTPUT
	API_MOVIEMATCH_GRAPHQLAPIIDOUTPUT
	API_MOVIEMATCH_GRAPHQLAPIKEYOUTPUT
	AUTH_MOVIEMATCH0D4270D1_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import acceptRequest from "./functions/acceptRequest";

const resolvers: {
  Query: { [key: string]: any };
  Mutation: { [key: string]: any };
} = {
  Query: {},
  Mutation: { acceptRequest },
};

export interface ExternalProviderInterface {
  request?: {
    userAttributes?: {
      "cognito:user_status"?: string;
      sub?: string;
      identities?: string;
      email?: string;
      email_verified?: boolean;
    };
  };
}

export interface EventInterface extends ExternalProviderInterface {
  triggerSource?: string;
  typeName?: keyof typeof resolvers;
  fieldName?: string;
}

exports.handler = async (event: EventInterface) => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);

  let typeHandler: any;
  let resolver: any;

  // Set the type handler and resolver
  typeHandler = event.typeName ? resolvers[event.typeName] : null;
  resolver =
    event.fieldName && typeHandler ? typeHandler[event.fieldName] : null;

  console.log(
    `Type Handler: ${event.typeName}, Field Name: ${event.fieldName}`
  );

  // Throw necessary errors
  if (!typeHandler) {
    throw new Error("Type handler not found.");
  }

  if (!resolver) {
    throw new Error("Resolver not found.");
  }

  // Call the appropriate function
  let result;
  try {
    result = await resolver(event);
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
