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
var discoverMovies_1 = require("./discoverMovies");
function default_1(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var input, urlParams, discoverUrl, movies;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    input = (_a = event.arguments) === null || _a === void 0 ? void 0 : _a.input;
                    urlParams = "";
                    if (!input) return [3, 2];
                    return [4, discoverMovies_1.createUrlParams(input)];
                case 1:
                    urlParams = _b.sent();
                    _b.label = 2;
                case 2:
                    console.debug("URL Params for determing page count: \"" + urlParams + "\"");
                    discoverUrl = common_1.API_URL + "/discover/movie?api_key=" + common_1.API_KEY + (urlParams ? "&" + urlParams : "");
                    console.debug("URL Request: " + discoverUrl);
                    return [4, fetch(discoverUrl)];
                case 3: return [4, (_b.sent()).json()];
                case 4:
                    movies = (_b.sent());
                    if (typeof movies.success !== "undefined" && !movies.success || !movies.total_pages) {
                        throw new Error("Failed to determine page count for search options: " + JSON.stringify(movies, null, 2));
                    }
                    console.debug("Total pages for search options: " + movies.total_pages);
                    return [2, movies.total_pages];
            }
        });
    });
}
exports["default"] = default_1;
