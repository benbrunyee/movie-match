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
var URL_PARAMS = {
    genres: "with_genres",
    region: "region",
    includeAdult: "include_adult",
    page: "page",
    releasedAfterYear: "primary_release_date.gte"
};
var apiGenres;
function default_1(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var input, urlParams, discoverUrl, movies, movieEntries;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    input = (_a = event.arguments) === null || _a === void 0 ? void 0 : _a.input;
                    if (!input) return [3, 2];
                    return [4, createUrlParams(input)];
                case 1:
                    urlParams = _b.sent();
                    _b.label = 2;
                case 2:
                    console.debug("URL Params for movie discovery: \"" + urlParams + "\"");
                    discoverUrl = common_1.API_URL + "/discover/movie?api_key=" + common_1.API_KEY + (urlParams ? "&" + urlParams : "");
                    console.debug("URL Request: " + discoverUrl);
                    return [4, fetch(discoverUrl)];
                case 3: return [4, (_b.sent()).json()];
                case 4:
                    movies = (_b.sent());
                    if (typeof movies.success !== "undefined" && !movies.success) {
                        throw new Error("Failed to discover movies: " + JSON.stringify(movies, null, 2));
                    }
                    console.debug("Movies found: " + JSON.stringify(movies, null, 2));
                    return [4, addMoviesToDb(movies)];
                case 5:
                    movieEntries = _b.sent();
                    return [2, { items: movieEntries }];
            }
        });
    });
}
exports["default"] = default_1;
function addMoviesToDb(discoveredMovies) {
    return __awaiter(this, void 0, void 0, function () {
        var genreFetch, genreObj, newMovies, promises, _loop_1, _i, newMovies_1, movie, dbMovies;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getGenreIds()];
                case 1:
                    genreFetch = _a.sent();
                    genreObj = genreFetch.genres.reduce(function (r, genre) {
                        r[genre.id] = genre;
                        return r;
                    }, {});
                    newMovies = discoveredMovies.results.map(function (movie) {
                        var _a;
                        var movieGenres = [];
                        for (var _i = 0, _b = movie.genre_ids; _i < _b.length; _i++) {
                            var genreId = _b[_i];
                            var genreName = (_a = genreObj[genreId]) === null || _a === void 0 ? void 0 : _a.name;
                            if (genreName && API_1.Genre[genreName]) {
                                movieGenres.push(API_1.Genre[genreName]);
                            }
                        }
                        return __assign(__assign({ identifier: movie.id, genres: movieGenres, description: movie.overview, name: movie.title, rating: movie.vote_average, ratingCount: movie.vote_count }, (movie.release_date && {
                            releaseYear: new Date(movie.release_date).getFullYear()
                        })), (movie.poster_path && { coverUri: movie.poster_path }));
                    });
                    promises = [];
                    _loop_1 = function (movie) {
                        promises.push(new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var movieObj, creation;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4, common_1.getMovieByIdentifier(movie.identifier)];
                                    case 1:
                                        movieObj = _b.sent();
                                        if (!!(movieObj === null || movieObj === void 0 ? void 0 : movieObj.id)) return [3, 3];
                                        console.debug("Movie not found so creating movie entry now for: " + movie.name + ", Idenfifier: " + movie.identifier);
                                        return [4, appSync_1["default"]({ createMovie: mutations_1.createMovie }, {
                                                input: movie
                                            })];
                                    case 2:
                                        creation = _b.sent();
                                        if (!((_a = creation.data) === null || _a === void 0 ? void 0 : _a.createMovie)) {
                                            throw new Error("Failed to create movie for identifier: " + movie.identifier);
                                        }
                                        return [2, resolve(creation.data.createMovie)];
                                    case 3: return [2, resolve(movieObj)];
                                }
                            });
                        }); }));
                    };
                    for (_i = 0, newMovies_1 = newMovies; _i < newMovies_1.length; _i++) {
                        movie = newMovies_1[_i];
                        _loop_1(movie);
                    }
                    return [4, Promise.all(promises)["catch"](function (e) { })];
                case 2:
                    dbMovies = _a.sent();
                    if (!dbMovies) {
                        throw new Error("Failed to create all movies in database");
                    }
                    return [2, dbMovies];
            }
        });
    });
}
function getGenreIds() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!apiGenres) return [3, 3];
                    return [4, fetch(common_1.API_URL + "/genre/movie/list?api_key=" + common_1.API_KEY)];
                case 1: return [4, (_a.sent()).json()];
                case 2:
                    apiGenres = (_a.sent());
                    _a.label = 3;
                case 3: return [2, apiGenres];
            }
        });
    });
}
function createUrlParams(input) {
    return __awaiter(this, void 0, void 0, function () {
        var urlParams, key, _loop_2, _a, _b, _i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    urlParams = "";
                    _loop_2 = function () {
                        var value, genres_1;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    value = input[key];
                                    if (value == null) {
                                        return [2, "continue"];
                                    }
                                    if (!(key !== "genres")) return [3, 1];
                                    urlParams += URL_PARAMS[key] + "=" + value + "&";
                                    return [3, 3];
                                case 1:
                                    if (!(value && Array.isArray(value) && value.length > 0)) return [3, 3];
                                    urlParams += URL_PARAMS[key] + "=";
                                    return [4, getGenreIds()];
                                case 2:
                                    genres_1 = (_d.sent()).genres.reduce(function (r, entry) {
                                        r[entry.name] = entry;
                                        return r;
                                    }, {});
                                    urlParams += value.reduce(function (r, val) {
                                        if (val && genres_1[val.toString()]) {
                                            r += genres_1[val] + ",";
                                        }
                                        return r;
                                    }, "");
                                    urlParams = urlParams.replace(/,$/, "") + "&";
                                    _d.label = 3;
                                case 3: return [2];
                            }
                        });
                    };
                    _a = [];
                    for (_b in input)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    key = _a[_i];
                    return [5, _loop_2()];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    if (!Object.keys(input).includes("includeAdult") ||
                        input["includeAdult"] == null) {
                        urlParams += URL_PARAMS["includeAdult"] + "=false";
                    }
                    urlParams = urlParams.replace(/&$/, "");
                    return [2, urlParams];
            }
        });
    });
}
