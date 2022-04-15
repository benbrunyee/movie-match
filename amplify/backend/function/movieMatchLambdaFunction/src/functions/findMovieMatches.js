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
var API_1 = require("../lib/API");
var appSync_1 = require("../lib/appSync");
var common_1 = require("../lib/common");
var mutations_1 = require("../lib/graphql/mutations");
exports["default"] = (function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var requestee, user, connectedUserId, connectedUserObj, movieMatches, movieIds, newMatches;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestee = event.identity.username;
                if (!requestee) {
                    throw new Error("Could not find requestee. Please call this function as a logged in user.");
                }
                return [4, common_1.getUser(requestee)];
            case 1:
                user = _a.sent();
                console.debug("Successfully got user obj for ID: " + requestee);
                connectedUserId = user.connectedUser;
                console.debug("Got connected partner user ID: " + connectedUserId);
                if (!connectedUserId) {
                    throw new Error("Could not find connected user for user database obj: " + requestee);
                }
                return [4, common_1.getUser(connectedUserId)];
            case 2:
                connectedUserObj = _a.sent();
                console.debug("Successfully got connected partner user obj for ID: " + connectedUserId);
                if (!(user.movieReactions && connectedUserObj.movieReactions)) {
                    console.warn("Movie reactions for one or both user's are not present");
                    console.warn("Returning an empty array");
                    return [2, []];
                }
                movieMatches = findMovieMatches(user.movieReactions.items, connectedUserObj.movieReactions.items);
                movieIds = common_1.removeDuplicates(getMovieIdsFromReactions(movieMatches));
                console.debug("Found matches for the following movie IDs: " + JSON.stringify(movieIds, null, 2));
                return [4, updateUserMovieMatches(requestee, movieIds)];
            case 3:
                _a.sent();
                return [4, updateUserMovieMatches(connectedUserId, movieIds)];
            case 4:
                _a.sent();
                newMatches = getNewMatches(user.movieMatches || [], movieIds);
                console.debug("Found new movie matches: " + JSON.stringify(newMatches, null, 2));
                return [2, { allMatches: movieIds, newMatches: newMatches }];
        }
    });
}); });
function getNewMatches(currentMovieMatches, newMovieMatches) {
    return newMovieMatches.filter(function (x) { return !currentMovieMatches.includes(x); });
}
function getMovieIdsFromReactions(movieReactions) {
    return movieReactions.map(function (reaction) { return reaction.movie.id; });
}
function updateUserMovieMatches(id, movieIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, appSync_1["default"]({ updateUser: mutations_1.updateUser }, {
                        input: {
                            id: id,
                            movieMatches: movieIds
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
function findMovieMatches(arr1, arr2) {
    var likeFilter = function (movieReaction) {
        return movieReaction.reaction === API_1.Reaction.LIKE;
    };
    arr1 = arr1.filter(likeFilter);
    arr2 = arr2.filter(likeFilter);
    var _a = arr1.length >= arr2.length ? [arr1, arr2] : [arr2, arr1], largestArr = _a[0], smallestArr = _a[1];
    var match = function (movieReaction1, movieReaction2) { return movieReaction1.movie.id === movieReaction2.movie.id; };
    var matches = largestArr.reduce(function (r, movieReaction) {
        if (smallestArr.some(function (reaction) { return match(reaction, movieReaction); })) {
            r.push(movieReaction);
        }
        return r;
    }, []);
    return matches;
}
