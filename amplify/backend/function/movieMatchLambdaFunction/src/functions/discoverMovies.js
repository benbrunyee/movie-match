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
exports.createUrlParams = void 0;
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
        var input, urlParams, discoverUrl, movies, _b, movieEntries;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    input = (_a = event.arguments) === null || _a === void 0 ? void 0 : _a.input;
                    if (!input) return [3, 2];
                    return [4, createUrlParams(input)];
                case 1:
                    urlParams = _c.sent();
                    _c.label = 2;
                case 2:
                    console.debug("URL Params for movie discovery: \"" + urlParams + "\"");
                    discoverUrl = common_1.API_URL + "/discover/movie?api_key=" + common_1.API_KEY + (urlParams ? "&" + urlParams : "");
                    console.debug("URL Request: " + discoverUrl);
                    if (!event.identity.username) return [3, 3];
                    _b = getNewMovies(event.identity.username, discoverUrl, input || {});
                    return [3, 5];
                case 3: return [4, fetch(discoverUrl)];
                case 4:
                    _b = (_c.sent()).json();
                    _c.label = 5;
                case 5: return [4, (_b)];
                case 6:
                    movies = _c.sent();
                    if (typeof movies.success !== "undefined" && !movies.success) {
                        throw new Error("Failed to discover movies: " + JSON.stringify(movies, null, 2));
                    }
                    console.debug("Movies found: " + JSON.stringify(movies, null, 2));
                    return [4, addMoviesToDb(movies)];
                case 7:
                    movieEntries = _c.sent();
                    return [2, { items: movieEntries }];
            }
        });
    });
}
exports["default"] = default_1;
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getNewMovies(sub, initialUrl, searchOptions) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var validMovies, movies, url, attempt, user, page, newParams, firstMovieIdentifier;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    validMovies = false;
                    url = initialUrl;
                    attempt = 0;
                    console.debug("Attempting to find movies that the user has not already reacted to");
                    return [4, common_1.getUser(sub)];
                case 1:
                    user = _d.sent();
                    _d.label = 2;
                case 2:
                    if (!!validMovies) return [3, 8];
                    attempt += 1;
                    if (attempt >= 50) {
                        throw new Error("Tried 50 times to find new movies.");
                    }
                    if (!(attempt > 1)) return [3, 4];
                    console.debug("Using a random page for next api call");
                    page = generateRandomNumber(1, searchOptions.page || 500);
                    console.debug("Page to be used for next API call: " + page);
                    return [4, createUrlParams(__assign(__assign({}, searchOptions), { page: page }))];
                case 3:
                    newParams = _d.sent();
                    url = url.replace(/\?.*/, "") + "?api_key=" + common_1.API_KEY + (newParams ? "&" + newParams : "");
                    _d.label = 4;
                case 4:
                    console.debug("Calling API, attempt number: " + attempt);
                    console.debug("Calling URL: " + url);
                    return [4, fetch(url)];
                case 5: return [4, (_d.sent()).json()];
                case 6:
                    movies = (_d.sent());
                    console.debug("Output from Movie API: " + JSON.stringify(movies, null, 2));
                    if (typeof movies.success !== "undefined" && !movies.success) {
                        throw new Error("Failed to discover movies: " + JSON.stringify(movies, null, 2));
                    }
                    firstMovieIdentifier = (_b = (_a = movies === null || movies === void 0 ? void 0 : movies.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id;
                    if (!firstMovieIdentifier) {
                        console.debug("Could not find first movie ID... Continuing");
                        return [3, 2];
                    }
                    return [4, hasUserReacted(firstMovieIdentifier, ((_c = user.movieReactions) === null || _c === void 0 ? void 0 : _c.items) || [])];
                case 7:
                    validMovies = !(_d.sent());
                    console.debug("User " + (validMovies ? "has not" : "has") + " reacted to this set of movies.");
                    return [3, 2];
                case 8:
                    console.debug("Found a set of movies that the user has not reacted to");
                    if (!movies) {
                        throw new Error("Failed to find movies the user has not already reacted to");
                    }
                    return [2, movies];
            }
        });
    });
}
function hasUserReacted(identifier, movieReactions) {
    return __awaiter(this, void 0, void 0, function () {
        var movie;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, common_1.getMovieByIdentifier(identifier)];
                case 1:
                    movie = _a.sent();
                    if (!movie) {
                        console.debug("Movie identifier: " + identifier + " not yet discovered in our database, the user would've inheritely not have reacted to this movie");
                        return [2, false];
                    }
                    if (movieReactions.find(function (reaction) { return reaction.movie.identifier === identifier; })) {
                        console.debug("User has already reacted to movie with identifier: " + identifier);
                        return [2, true];
                    }
                    return [2, false];
            }
        });
    });
}
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
                    newMovies = (discoveredMovies.results || []).map(function (movie) {
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
function createUrlParams(searchOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var urlParams, searchOption, _loop_2, _a, _b, _i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    urlParams = "";
                    _loop_2 = function () {
                        var searchValue, genres_1;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    searchValue = searchOptions[searchOption];
                                    if (searchValue == null) {
                                        return [2, "continue"];
                                    }
                                    if (!(searchOption !== "genres")) return [3, 1];
                                    urlParams += URL_PARAMS[searchOption] + "=" + searchValue + "&";
                                    return [3, 3];
                                case 1:
                                    if (!(searchValue && Array.isArray(searchValue) && searchValue.length > 0)) return [3, 3];
                                    urlParams += URL_PARAMS[searchOption] + "=";
                                    return [4, getGenreIds()];
                                case 2:
                                    genres_1 = (_d.sent()).genres.reduce(function (r, genre) {
                                        r[genre.name] = genre;
                                        return r;
                                    }, {});
                                    urlParams += searchValue.reduce(function (r, genreName) {
                                        if (genreName && genres_1[genreName.toString()]) {
                                            r += genres_1[genreName.toString()].id + ",";
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
                    for (_b in searchOptions)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    searchOption = _a[_i];
                    return [5, _loop_2()];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    if (!Object.keys(searchOptions).includes("includeAdult") ||
                        searchOptions["includeAdult"] == null) {
                        urlParams += URL_PARAMS["includeAdult"] + "=false";
                    }
                    urlParams = urlParams.replace(/&$/, "");
                    return [2, urlParams];
            }
        });
    });
}
exports.createUrlParams = createUrlParams;
