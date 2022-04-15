import { GraphQLResult } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";
import { ZenObservable } from "zen-observable-ts";

async function callGraphQL<T>(
  query: any,
  variables?: object
): Promise<GraphQLResult<T>>;

async function callGraphQL<T, TV>(
  query: any,
  variables: TV
): Promise<GraphQLResult<T>>;

async function callGraphQL<T, TV>(
  query: any,
  variables?: TV | object
): Promise<GraphQLResult<T>> {
  try {
    const result = await (API.graphql(
      graphqlOperation(query, variables)
    ) as Promise<GraphQLResult<T>>);

    return result;
  } catch (e) {
    console.debug(e);

    const otherThanUnauth = ((e as any).errors || []).reduce(
      (r: boolean, err: any) => {
        if ((err as any).errorType !== "Unauthorized") {
          return true;
        } else {
          return r;
        }
      },
      false
    );

    if (otherThanUnauth) {
      console.error(e);

      throw e;
    } else {
      console.debug("Ignoring unauthorized errors");
    }

    return e as GraphQLResult<T>;
  }
}

interface SubscriptionCallbacks<T> {
  next: (value: { provider: string; value: GraphQLResult<T> }) => void;
  error?: (error: any) => void;
  complete?: () => void;
}

function subscribeGraphQL<T, TV>(
  query: any,
  variables: TV,
  callbacks: SubscriptionCallbacks<T>
): ZenObservable.Subscription {
  const call = API.graphql(graphqlOperation(query, variables));

  if ("subscribe" in call) {
    return call.subscribe(callbacks);
  } else {
    throw new Error("Not a valid subscription");
  }
}

export { callGraphQL, subscribeGraphQL };

