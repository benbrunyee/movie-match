export default interface EventIdentity {
  identity: {
    username: string;
    sub: string;
    claims: {
      sub: string;
      username: string;
    };
  };
  request: {
    headers: {
      "x-api-key": string;
    };
  };
}
