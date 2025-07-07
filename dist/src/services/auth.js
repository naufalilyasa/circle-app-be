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
exports.findUser = exports.findUniqueUser = exports.updateUser = exports.loginUser = exports.createUser = exports.excludedFields = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const config_1 = __importDefault(require("config"));
const jwt_1 = require("../utils/jwt");
const appError_1 = __importDefault(require("../utils/appError"));
exports.excludedFields = [
    "createdAt",
    "updatedAt",
    "password",
    "confirmPassword",
    "verified",
    "verificationCode",
    "passwordResetAt",
    "passwordResetToken",
];
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    // const { email, password, name, username, photoProfile } = input;
    const { email, password, name, username } = input;
    const verifyCode = crypto_1.default.randomBytes(32).toString("hex");
    const verificationCode = crypto_1.default
        .createHash("sha256")
        .update(verifyCode)
        .digest("hex");
    const saltRounds = 10;
    const salt = yield bcrypt_1.default.genSalt(saltRounds);
    const hashPassword = yield bcrypt_1.default.hash(password, salt);
    const dataUser = {
        name,
        username,
        email,
        password: hashPassword,
        // photoProfile,
        verificationCode,
    };
    const user = (yield client_1.prisma.user.create({ data: dataUser }));
    return { user, verifyCode, verificationCode };
    // return { id: user.id, email: user.email };
});
exports.createUser = createUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUniqueUser)({
        email: email.toLowerCase(),
    }, {
        id: true,
        email: true,
        verified: true,
        password: true,
    });
    // check if user verified
    if (!user.verified)
        throw new appError_1.default(400, "You are not verified, please verify your email to login");
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        throw new appError_1.default(400, "Invalid email or password");
    }
    return yield signTokens(user);
});
exports.loginUser = loginUser;
const updateUser = (where, data, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield client_1.prisma.user.update({
        where,
        data,
        select,
    }));
});
exports.updateUser = updateUser;
const signTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // create session
    connectRedis_1.default.set(`${user.id}`, JSON.stringify(user), {
        EX: config_1.default.get("redisCacheExpiresIn") * 60,
    });
    // Create access and expires token
    const access_token = (0, jwt_1.signJwt)({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${config_1.default.get("accessTokenExpiresIn")}m`,
    });
    const refresh_token = (0, jwt_1.signJwt)({ sub: user.id }, "refreshTokenPrivateKey", {
        expiresIn: `${config_1.default.get("refreshTokenExpiresIn")}m`,
    });
    return { access_token, refresh_token };
});
const findUniqueUser = (where, select) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield client_1.prisma.user.findUnique({
        where,
        select,
    }));
});
exports.findUniqueUser = findUniqueUser;
const findUser = (where, select) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.prisma.user.findFirst({ where, select });
});
exports.findUser = findUser;
//# sourceMappingURL=auth.js.map