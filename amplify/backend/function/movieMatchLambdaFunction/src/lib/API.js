"use strict";
exports.__esModule = true;
exports.ModelSortDirection = exports.Reaction = exports.ConnectionRequestStatus = exports.ModelAttributeTypes = exports.Genre = exports.Region = void 0;
var Region;
(function (Region) {
    Region["US"] = "US";
    Region["GB"] = "GB";
    Region["DE"] = "DE";
    Region["CN"] = "CN";
    Region["JP"] = "JP";
    Region["FR"] = "FR";
    Region["IN"] = "IN";
    Region["PL"] = "PL";
})(Region = exports.Region || (exports.Region = {}));
var Genre;
(function (Genre) {
    Genre["Action"] = "Action";
    Genre["Adventure"] = "Adventure";
    Genre["Animation"] = "Animation";
    Genre["Comedy"] = "Comedy";
    Genre["Crime"] = "Crime";
    Genre["Documentary"] = "Documentary";
    Genre["Drama"] = "Drama";
    Genre["Family"] = "Family";
    Genre["Fantasy"] = "Fantasy";
    Genre["History"] = "History";
    Genre["Horror"] = "Horror";
    Genre["Music"] = "Music";
    Genre["Mystery"] = "Mystery";
    Genre["Romance"] = "Romance";
    Genre["Fiction"] = "Fiction";
    Genre["Movie"] = "Movie";
    Genre["Thriller"] = "Thriller";
    Genre["War"] = "War";
    Genre["Western"] = "Western";
})(Genre = exports.Genre || (exports.Genre = {}));
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
    ConnectionRequestStatus["PENDING"] = "PENDING";
    ConnectionRequestStatus["ACCEPTED"] = "ACCEPTED";
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
