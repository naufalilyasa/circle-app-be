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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.deserializeUser = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_1 = require("../utils/jwt");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const auth_1 = require("../services/auth");
const lodash_1 = require("lodash");
const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let access_token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("bearer")) {
            access_token = req.headers.authorization.split("")[1];
        }
        else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }
        if (!access_token)
            return next(new appError_1.default(401, "You're not logged in"));
        // validate the access token
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            return next(new appError_1.default(401, "Invalid token or session has expired"));
        // check if user has valid session
        const session = yield connectRedis_1.default.get(decoded.sub);
        if (!session)
            return next(new appError_1.default(401, "Invalid token or session has expired"));
        // check if user still exist
        const user = yield (0, auth_1.findUniqueUser)({ id: JSON.parse(session).id });
        if (!user)
            return next(new appError_1.default(401, "Invalid token or session has expired"));
        // add user to res.locals
        res.locals.user = (0, lodash_1.omit)(user, auth_1.excludedFields);
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.deserializeUser = deserializeUser;
const requireUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        if (!user)
            return next(new appError_1.default(401, "Session has expired or user doesn't exist"));
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.requireUser = requireUser;
//# sourceMappingURL=auth.js.map