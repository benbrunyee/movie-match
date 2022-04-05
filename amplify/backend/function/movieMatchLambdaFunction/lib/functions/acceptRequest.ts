import EventIdentity from "../lib/eventIdentity";

export interface EventInterface extends EventIdentity {}

export default (event: EventInterface) => {
  // Accept the request

  return {
    status: true,
  };
};
