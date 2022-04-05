"use strict";
exports.__esModule = true;
exports.ModelSortDirection = exports.Reaction = exports.ConnectionRequestStatus = exports.ModelAttributeTypes = void 0;
var ModelAttributeTypes;
(function (ModelAttributeTypes) {
    ModelAttributeTypes["binary"] = "binary";
    ModelAttributeTypes["binarySet"] = "binarySet";
    ModelAttributeTypes["bool"] = "bool";
    ModelAttributeTypes["list"] = "list";
    ModelAttributeTypes["map"] = "map";
    ModelAttributeTypes["number"] = "number";
    ModelAttributeTypes["numberSet"] = "numberSet";
    ModelAttributeTypes["string"] = "string";
    ModelAttributeTypes["stringSet"] = "stringSet";
    ModelAttributeTypes["_null"] = "_null";
})(ModelAttributeTypes = exports.ModelAttributeTypes || (exports.ModelAttributeTypes = {}));
var ConnectionRequestStatus;
(function (ConnectionRequestStatus) {
    ConnectionRequestStatus["OPEN"] = "OPEN";
    ConnectionRequestStatus["ACCEPTED"] = "ACCEPTED";
    ConnectionRequestStatus["REJECTED"] = "REJECTED";
    ConnectionRequestStatus["DELETED"] = "DELETED";
})(ConnectionRequestStatus = exports.ConnectionRequestStatus || (exports.ConnectionRequestStatus = {}));
var Reaction;
(function (Reaction) {
    Reaction["LIKE"] = "LIKE";
    Reaction["DISLIKE"] = "DISLIKE";
})(Reaction = exports.Reaction || (exports.Reaction = {}));
var ModelSortDirection;
(function (ModelSortDirection) {
    ModelSortDirection["ASC"] = "ASC";
    ModelSortDirection["DESC"] = "DESC";
})(ModelSortDirection = exports.ModelSortDirection || (exports.ModelSortDirection = {}));
