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
var mutations_1 = require("../lib/graphql/mutations");
var queries_1 = require("../lib/graphql/queries");
exports["default"] = (function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var requestId, request;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestId = event.arguments.input.requestId;
                console.debug("Connection Request ID: " + requestId);
                return [4, getRequest(requestId)];
            case 1:
                request = _a.sent();
                if (!request.sender) {
                    throw new Error("Could not find sender of the request");
                }
                validateRequest(event, request);
                return [4, acceptRequest(requestId)];
            case 2:
                _a.sent();
                return [4, updateUsers(request.sender, request.receiver)];
            case 3:
                _a.sent();
                return [2, {
                        status: true
                    }];
        }
    });
}); });
function updateUsers(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, appSync_1["default"]({
                        updateUser: mutations_1.updateUser
                    }, {
                        input: {
                            id: receiverId,
                            connectedUser: senderId
                        }
                    })];
                case 1:
                    _a.sent();
                    console.debug("Successfully updated the receiver's user obj");
                    return [4, appSync_1["default"]({
                            updateUser: mutations_1.updateUser
                        }, {
                            input: {
                                id: senderId,
                                connectedUser: receiverId
                            }
                        })];
                case 2:
                    _a.sent();
                    console.debug("Successfully updated the sender's user obj");
                    return [2];
            }
        });
    });
}
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
                    console.debug("Successfully updated connection request to: " + status);
                    return [2, res];
            }
        });
    });
}
function validateRequest(event, request) {
    var sender = request.sender;
    var receiver = request.receiver;
    if (!event.identity.username) {
        throw new Error("Call this function as a logged in user");
    }
    if (!sender) {
        throw new Error("Could not find sender associated with connection request");
    }
    if (receiver !== event.identity.username) {
        throw new Error("Cannot accept connection request that was not sent to you");
    }
    console.debug("Sender ID: " + sender);
    console.debug("Receiver ID: " + receiver);
    if (sender === receiver) {
        throw new Error("Cannot accept a request to yourself");
    }
    console.debug("Request to accept connection request is valid");
}
function getRequest(id) {
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
                        throw new Error("Couldn't find connection request");
                    }
                    console.debug("Successfully got the connection request database obj");
                    return [2, request.data.getConnectionRequest];
            }
        });
    });
}
