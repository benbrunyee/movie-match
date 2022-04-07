export default interface EventIdentity {
  identity: {
    username?: string;
    sub: string;
    claims: {
      "cognito:username"?: string;
    };
  };
  request: {
    headers: {
      "x-api-key": string;
    };
  };
}
