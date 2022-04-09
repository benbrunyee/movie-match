import EventIdentity from "../lib/eventIdentity";

export interface EventInterface extends EventIdentity {
  arguments?: {
    input?: {
      page?: number;
    };
  };
}

export default async function (event: EventInterface) {
  let page: number | undefined = event.arguments?.input?.page || 0;

  if (page < 1) {
    page = undefined;
  }

  return await (
    await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=0dd0cb2ac703e890ab3573c95612498a${
        page ? `&page=${page}` : ""
      }`
    )
  ).json();
}
