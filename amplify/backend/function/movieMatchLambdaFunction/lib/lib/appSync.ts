import { GraphQLResult } from "@aws-amplify/api";
import * as AWSAppSync from "aws-appsync";
import * as AWS from "aws-sdk";
import { polyfill } from "es6-promise";
import gql from "graphql-tag";

const appsyncUrl = process.env.API_MOVIEMATCH_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

// Configure global fetch
polyfill();
require("isomorphic-fetch");

AWS.config.update({ region });
const AWSAppSyncClient = AWSAppSync.default;

// https://github.com/aws-amplify/amplify-cli/issues/9100#issuecomment-991269119
const mockCredentials = {
  accessKeyId: "ASIAVJKIAM-AuthRole",
  secretAccessKey: "fake",
};

if (!region) {
  throw new Error("Failed to find region from environment");
}

if (!appsyncUrl) {
  throw new Error("Failed to obtain AppSync url from environment");
}

const credentials = process.env.IS_MOCK
  ? mockCredentials
  : AWS.config.credentials;

if (!(appsyncUrl && region && credentials)) {
  throw new Error("Environment variables or AWS credentials not present");
}

const config: AWSAppSync.AWSAppSyncClientOptions = {
  url: appsyncUrl,
  region,
  auth: {
    type: AWSAppSync.AUTH_TYPE.AWS_IAM,
    credentials,
  },
  disableOffline: true,
};

const client = new AWSAppSyncClient(config);

function callGraphQl<T>(operations: {
  [key: string]: string;
}): Promise<GraphQLResult<T>>;

function callGraphQl<T, P>(
  operations: {
    [key: string]: string;
  },
  vars: P
): Promise<GraphQLResult<T>>;

function callGraphQl<T, P>(operation: { [key: string]: string }, vars?: P) {
  const operationName = Object.keys(operation)[0];

  const type = operationName.match(/^(create|update|delete)/i)
    ? "mutation"
    : "query";

  const request =
    type === "mutation"
      ? client.mutate<T, P>({
          mutation: gql(operation[operationName]),
          variables: vars,
          fetchPolicy: "no-cache",
        })
      : client.query<T, P>({
          query: gql(operation[operationName]),
          ...(vars && { variables: vars }),
          fetchPolicy: "no-cache",
        });

  return request as Promise<GraphQLResult<T>>;
}

export default callGraphQl;
