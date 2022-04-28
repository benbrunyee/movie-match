import { https } from "firebase-functions";

export const MOVIE_API_URL = "https://api.themoviedb.org/3";
export const MOVIE_API_KEY = "0dd0cb2ac703e890ab3573c95612498a";

export interface WrapOptions {
  authRoute?: boolean;
}

export const callWrap =
  (
    handler: (data: any, context: https.CallableContext) => Promise<any>,
    props?: WrapOptions
  ) =>
  async (data: any, context: https.CallableContext) => {
    if (props?.authRoute && !context.auth) {
      return { status: 401, message: "Unauthorized" };
    } else {
      try {
        return await handler(data, context);
      } catch (e) {
        return {
          status: 500,
          message: "Internal server error",
          error: (e as any).toString(),
        };
      }
    }
  };

export const stringify = (json: object) =>
  JSON.stringify(json, getCircularReplacer(), 2);

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
