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
exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.refreshAccessTokenHandler = exports.handleLogout = exports.verifyEmailHandler = exports.handleRegister = exports.handleLogin = void 0;
const auth_1 = require("../services/auth");
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const client_1 = require("../generated/client");
const jwt_1 = require("../utils/jwt");
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const email_1 = __importDefault(require("../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cookiesOptions = {
    httpOnly: true,
    sameSite: "lax",
};
if (process.env.NODE_ENV === "production")
    cookiesOptions.secure = true;
const accessTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get("accessTokenExpiresIn") * 60 * 1000), maxAge: config_1.default.get("accessTokenExpiresIn") * 60 * 1000 });
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get("refreshTokenExpiresIn") * 60 * 1000), maxAge: config_1.default.get("refreshTokenExpiresIn") * 60 * 1000 });
const handleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const { access_token, refresh_token } = yield (0, auth_1.loginUser)(email, password);
        res.cookie("access_token", access_token, accessTokenCookieOptions);
        res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        res.status(200).json({ status: "Success", access_token });
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e);
            res.status(500).json({ message: e.message });
        }
    }
});
exports.handleLogin = handleLogin;
const handleRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    // if (!req.file) {
    //   res.status(400).json({ message: "Error uploading file" });
    //   return;
    // }
    // const photoProfile = req.file.filename;
    try {
        const user = yield (0, auth_1.createUser)({
            name,
            username,
            email: email.toLowerCase(),
            password,
            // photoProfile,
        });
        const redirectUrl = `${config_1.default.get("origin")}/api/v1/auth/verifyEmail/${user.verifyCode}`;
        try {
            yield new email_1.default(user.user, redirectUrl).sendVerificationCode();
            yield (0, auth_1.updateUser)({ id: user.user.id }, { verificationCode: user.verificationCode });
            return res.status(201).json({
                status: "success",
                message: "User registered successfully. please check your email with a verification code has been sent to your email",
            });
        }
        catch (err) {
            yield (0, auth_1.updateUser)({ id: user.user.id }, { verificationCode: null });
            return res.status(500).json({
                status: "error",
                message: "There was an error sending email, please try again",
            });
        }
        // return res.status(201).json({
        //   message: "Registered user successfully",
        //   data: user.user,
        // });
    }
    catch (err) {
        console.error(err);
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({
                    status: "fail",
                    message: "Email already exist, please use another email address",
                });
            }
        }
        next(err);
    }
});
exports.handleRegister = handleRegister;
const refreshAccessTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        const message = "Could not refresh access token";
        if (!refresh_token)
            return next(new appError_1.default(401, message));
        // validate a refresh token
        const decoded = (0, jwt_1.verifyJwt)(refresh_token, "refreshTokenPublicKey");
        if (!decoded)
            return next(new appError_1.default(401, message));
        // check if user has a valid session
        const session = yield connectRedis_1.default.get(decoded.sub);
        if (!session)
            return next(new appError_1.default(401, message));
        // check if user still exist
        const user = yield (0, auth_1.findUniqueUser)({ id: JSON.parse(session).id });
        if (!user)
            return next(new appError_1.default(401, message));
        // sign new access token
        const access_token = (0, jwt_1.signJwt)({ sub: user.id }, "accessTokenPrivateKey", {
            expiresIn: `${config_1.default.get("accessTokenExpiresIn")}m`,
        });
        // add cookies
        res.cookie("access_token", access_token, accessTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        // send response
        res.status(200).json({
            status: "success",
            access_token,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
const verifyEmailHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationCode = crypto_1.default
            .createHash("sha256")
            .update(req.params.verificationCode)
            .digest("hex");
        const user = yield (0, auth_1.updateUser)({ verificationCode }, { verified: true, verificationCode: null }, { email: true });
        if (!user)
            return next(new appError_1.default(401, "Could not verify email"));
        res.render("emailVerificationSuccess");
    }
    catch (err) {
        if (err.code === "P2025") {
            return res.status(403).json({
                status: "fail",
                message: "Verification code is invalid or user doesn't exist",
            });
        }
    }
});
exports.verifyEmailHandler = verifyEmailHandler;
const logout = (res) => {
    res.cookie("access_token", "", { maxAge: -1 });
    res.cookie("refresh_token", "", { maxAge: -1 });
    res.cookie("logged_in", "", { maxAge: -1 });
};
const handleLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectRedis_1.default.del(res.locals.user.id);
        logout(res);
        res.status(200).json({ status: "success" });
    }
    catch (err) {
        next(err);
    }
});
exports.handleLogout = handleLogout;
const forgotPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user from database
        const user = yield (0, auth_1.findUser)({ email: req.body.email.toLowerCase() });
        if (!user) {
            return res.status(403).json({
                status: "fail",
                message: "You will receive a reset email if user with that email exist",
            });
        }
        if (!user.verified) {
            return res.status(403).json({
                status: "fail",
                message: "Account with that email not verified",
            });
        }
        if (user.provider) {
            return res.status(403).json({
                status: "fail",
                message: "We found your account. It looks like you registered with a social auth account. Try signing in with social auth.",
            });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        yield (0, auth_1.updateUser)({ id: user.id }, {
            passwordResetToken,
            passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
        }, { email: true });
        try {
            const url = `http://localhost:5173/resetPassword/${resetToken}`;
            yield new email_1.default(user, url).sendPasswordResetToken();
            res.status(200).json({
                status: "success",
                message: "You will receive a reset email if user with that email exist",
            });
        }
        catch (err) {
            yield (0, auth_1.updateUser)({ id: user.id }, { passwordResetToken: null, passwordResetAt: null }, {});
            return res.status(500).json({
                status: "error",
                message: "There was an error sending email",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.forgotPasswordHandler = forgotPasswordHandler;
const resetPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(req.params.resetToken)
            .digest("hex");
        const user = yield (0, auth_1.findUser)({
            passwordResetToken,
            passwordResetAt: { gt: new Date() },
        });
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token or token has expired",
            });
        }
        const password = req.body.password;
        const saltRounds = 12;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        yield (0, auth_1.updateUser)({ id: user.id }, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetAt: null,
        }, { email: true });
        logout(res);
        res.status(200).json({
            status: "success",
            message: "Password data updated successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.resetPasswordHandler = resetPasswordHandler;
//# sourceMappingURL=auth.js.map