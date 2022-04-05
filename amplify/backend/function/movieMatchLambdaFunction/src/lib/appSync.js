"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var AWSAppSync = require("aws-appsync");
var AWS = require("aws-sdk");
var es6_promise_1 = require("es6-promise");
var graphql_tag_1 = require("graphql-tag");
var appsyncUrl = process.env.API_MOVIEMATCH_GRAPHQLAPIENDPOINTOUTPUT;
var region = process.env.REGION;
es6_promise_1.polyfill();
require("isomorphic-fetch");
AWS.config.update({ region: region });
var AWSAppSyncClient = AWSAppSync["default"];
var mockCredentials = {
    accessKeyId: "ASIAVJKIAM-AuthRole",
    secretAccessKey: "fake"
};
if (!region) {
    throw new Error("Failed to find region from environment");
}
if (!appsyncUrl) {
    throw new Error("Failed to obtain AppSync url from environment");
}
var credentials = process.env.IS_MOCK
    ? mockCredentials
    : AWS.config.credentials;
if (!(appsyncUrl && region && credentials)) {
    throw new Error("Environment variables or AWS credentials not present");
}
var config = {
    url: appsyncUrl,
    region: region,
    auth: {
        type: AWSAppSync.AUTH_TYPE.AWS_IAM,
        credentials: credentials
    },
    disableOffline: true
};
var client = new AWSAppSyncClient(config);
function callGraphQl(operation, vars) {
    var operationName = Object.keys(operation)[0];
    var type = operationName.match(/^(create|update|delete)/i)
        ? "mutation"
        : "query";
    var request = type === "mutation"
        ? client.mutate({
            mutation: graphql_tag_1["default"](operation[operationName]),
            variables: vars,
            fetchPolicy: "no-cache"
        })
        : client.query(__assign(__assign({ query: graphql_tag_1["default"](operation[operationName]) }, (vars && { variables: vars })), { fetchPolicy: "no-cache" }));
    return request;
}
exports["default"] = callGraphQl;
