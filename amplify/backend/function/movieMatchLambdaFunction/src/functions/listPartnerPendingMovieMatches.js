"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var common_1 = require("../lib/common");
function default_1(event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var username, user, connectedPartner, userReactions, partnerReactions, userMovieIds, partnerMovieIds, unmatchedMovieIdentifiers, movieData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    username = event.identity.username;
                    if (!username) {
                        throw new Error("Can only get partner pending matches from a user. Could not determine username from call.");
                    }
                    return [4, common_1.getUser(username)];
                case 1:
                    user = _c.sent();
                    console.debug("Successfully got user info for: " + username);
                    if (!user.connectedUser) {
                        throw new Error("User does not have a connected partner");
                    }
                    return [4, common_1.getUser(user.connectedUser)];
                case 2:
                    connectedPartner = _c.sent();
                    console.debug("Successfully got connected partner's info: " + user.connectedUser);
                    userReactions = (_a = user.movieReactions) === null || _a === void 0 ? void 0 : _a.items;
                    partnerReactions = (_b = connectedPartner.movieReactions) === null || _b === void 0 ? void 0 : _b.items;
                    if (!(partnerReactions && userReactions)) {
                        throw new Error("Could not find movie reactions for partner and/or user");
                    }
                    console.debug("User movie reactions: " + JSON.stringify(userReactions, null, 2));
                    console.debug("Partner movie reactions: " + JSON.stringify(partnerReactions, null, 2));
                    userMovieIds = getMovieIds(userReactions);
                    partnerMovieIds = getMovieIds(partnerReactions);
                    console.debug("User movie ID reactions: " + JSON.stringify(userReactions, null, 2));
                    console.debug("Partner movie ID reactions: " + JSON.stringify(partnerReactions, null, 2));
                    unmatchedMovieIdentifiers = removeOverlap(partnerMovieIds, userMovieIds);
                    console.debug("Result after removing overlap: " + JSON.stringify(unmatchedMovieIdentifiers, null, 2));
                    if (unmatchedMovieIdentifiers.length === 0) {
                        console.debug("Found no remaining identifiers after removing overlap");
                        return [2, { items: [] }];
                    }
                    return [4, common_1.getMoviesByIdentifier(unmatchedMovieIdentifiers)];
                case 3:
                    movieData = _c.sent();
                    console.debug("Listed movies from IDs in overlap: " + JSON.stringify(movieData, null, 2));
                    return [2, { items: movieData }];
            }
        });
    });
}
exports["default"] = default_1;
function removeOverlap(base, matches) {
    var newArr = [];
    for (var _i = 0, base_1 = base; _i < base_1.length; _i++) {
        var v = base_1[_i];
        if (!matches.includes(v) && !newArr.includes(v)) {
            newArr.push(v);
        }
    }
    return newArr;
}
function getMovieIds(movieReactions) {
    return movieReactions.map(function (reaction) { return reaction.movie.identifier; });
}
