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
exports.getConnectionRequest = exports.acceptRequest = exports.getUser = exports.getMovieByIds = exports.getMovie = exports.getApiMovie = exports.listMovies = exports.getMoviesByIdentifier = exports.getMovieByIdentifier = exports.removeDuplicates = exports.API_KEY = exports.API_URL = void 0;
var API_1 = require("./API");
var appSync_1 = require("./appSync");
var mutations_1 = require("./graphql/mutations");
var queries_1 = require("./graphql/queries");
exports.API_URL = "https://api.themoviedb.org/3";
exports.API_KEY = "0dd0cb2ac703e890ab3573c95612498a";
function removeDuplicates(arr) {
    return Array.from(new Set(arr));
}
exports.removeDuplicates = removeDuplicates;
function getMovieByIdentifier(identifier) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var movie;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, appSync_1["default"]({ movieByIdentifier: queries_1.movieByIdentifier }, {
                        identifier: identifier
                    })];
                case 1:
                    movie = _d.sent();
                    if (!((_c = (_b = (_a = movie.data) === null || _a === void 0 ? void 0 : _a.movieByIdentifier) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c[0])) {
                        console.warn("Couldn't find movie by identifier: " + identifier);
                        return [2];
                    }
                    return [2, movie.data.movieByIdentifier.items[0]];
            }
        });
    });
}
exports.getMovieByIdentifier = getMovieByIdentifier;
function getMoviesByIdentifier(identifiers) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, _i, identifiers_1, identifier, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = [];
                    for (_i = 0, identifiers_1 = identifiers; _i < identifiers_1.length; _i++) {
                        identifier = identifiers_1[_i];
                        promises.push(getMovieByIdentifier(identifier));
                    }
                    return [4, Promise.all(promises)];
                case 1:
                    result = (_a.sent()).reduce(function (r, movie) {
                        if (movie) {
                            r.push(movie);
                        }
                        return r;
                    }, []);
                    return [2, result];
            }
        });
    });
}
exports.getMoviesByIdentifier = getMoviesByIdentifier;
function listMovies(vars) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var movies;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, (typeof vars !== "undefined"
                        ? appSync_1["default"]({ listGraphMovies: queries_1.listMovies }, vars)
                        : appSync_1["default"]({ listGraphMovies: queries_1.listMovies }))];
                case 1:
                    movies = _c.sent();
                    if (!((_b = (_a = movies.data) === null || _a === void 0 ? void 0 : _a.listMovies) === null || _b === void 0 ? void 0 : _b.items)) {
                        throw new Error("Failed to list movies");
                    }
                    return [2, movies.data.listMovies.items];
            }
        });
    });
}
exports.listMovies = listMovies;
function getApiMovie(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("Attempting to get movie: " + id + " from the movie api");
                    return [4, fetch(exports.API_URL + "/movie/" + id + "?api_key=" + exports.API_KEY)];
                case 1: return [4, (_a.sent()).json()];
                case 2: return [2, (_a.sent())];
            }
        });
    });
}
exports.getApiMovie = getApiMovie;
function getMovie(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var movie;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, appSync_1["default"]({ getMovieApi: queries_1.getMovie }, {
                        id: id
                    })];
                case 1:
                    movie = _b.sent();
                    if (!((_a = movie.data) === null || _a === void 0 ? void 0 : _a.getMovie)) {
                        throw new Error("Failed to get movie: " + id);
                    }
                    return [2, movie.data.getMovie];
            }
        });
    });
}
exports.getMovie = getMovie;
function getMovieByIds(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, _i, ids_1, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = [];
                    for (_i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                        id = ids_1[_i];
                        promises.push(getMovie(id));
                    }
                    return [4, Promise.all(promises)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.getMovieByIds = getMovieByIds;
function getUser(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var request;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, appSync_1["default"]({ getGraphUser: queries_1.getUser }, {
                        id: id
                    })];
                case 1:
                    request = _b.sent();
                    if (!((_a = request.data) === null || _a === void 0 ? void 0 : _a.getUser)) {
                        throw new Error("Couldn't find user database obj: " + id);
                    }
                    return [2, request.data.getUser];
            }
        });
    });
}
exports.getUser = getUser;
function acceptRequest(id) {
    return __awaiter(this, void 0, void 0, function () {
        var status, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = API_1.ConnectionRequestStatus.ACCEPTED;
                    return [4, appSync_1["default"]({ updateConnectionRequest: mutations_1.updateConnectionRequest }, {
                            input: {
                                id: id,
                                status: status
                            }
                        })];
                case 1:
                    res = _a.sent();
                    return [2, res];
            }
        });
    });
}
exports.acceptRequest = acceptRequest;
function getConnectionRequest(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var request;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, appSync_1["default"]({ getConnectionRequest: queries_1.getConnectionRequest }, {
                        id: id
                    })];
                case 1:
                    request = _b.sent();
                    if (!((_a = request.data) === null || _a === void 0 ? void 0 : _a.getConnectionRequest)) {
                        throw new Error("Couldn't find connection request: " + id);
                    }
                    return [2, request.data.getConnectionRequest];
            }
        });
    });
}
exports.getConnectionRequest = getConnectionRequest;
