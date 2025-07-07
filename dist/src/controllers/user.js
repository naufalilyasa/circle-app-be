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
exports.searchUsers = exports.updateUserHandler = exports.deleteUser = exports.getUserTweets = exports.getUserById = exports.getUsers = exports.getMeHandler = void 0;
const client_1 = require("../prisma/client");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const jwt_1 = require("../utils/jwt");
const getMeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMeHandler = getMeHandler;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield client_1.prisma.user.findMany({
            omit: {
                password: true,
                passwordResetAt: true,
                passwordResetToken: true,
                verificationCode: true,
                provider: true,
            },
            take: 3,
        });
        res.status(200).json({ allUsers });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan users" });
    }
});
exports.getUsers = getUsers;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        if (!search) {
            res.status(200).json({ data: [] });
            return;
        }
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const authUserId = decoded.sub;
        const allUsers = yield client_1.prisma.user.findMany({
            where: {
                username: {
                    startsWith: String(search),
                    mode: "insensitive",
                },
                AND: {
                    id: {
                        not: authUserId,
                    },
                },
            },
            omit: {
                password: true,
                passwordResetAt: true,
                passwordResetToken: true,
                verificationCode: true,
                provider: true,
            },
        });
        res.status(200).json({ data: allUsers });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan users" });
    }
});
exports.searchUsers = searchUsers;
const getUserTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const allUserTweets = yield client_1.prisma.user.findUnique({
            where: { id },
            include: { tweets: true },
        });
        res.status(200).json(allUserTweets);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan user threads" });
    }
});
exports.getUserTweets = getUserTweets;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramsId = req.params.id;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("Invalid token or session has expired");
        const currentUserId = decoded.sub;
        const user = yield client_1.prisma.user.findUnique({
            where: { id: paramsId },
            omit: {
                password: true,
                passwordResetAt: true,
                passwordResetToken: true,
                verificationCode: true,
                provider: true,
            },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        });
        const isFollowed = yield client_1.prisma.follow.findFirst({
            where: {
                followingId: paramsId,
                followerId: currentUserId,
            },
        });
        res.status(200).json(Object.assign(Object.assign({}, user), { isFollowedByCurrentUser: !!isFollowed }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan user" });
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield client_1.prisma.user.delete({ where: { id: id } });
        res.status(201).json({ message: "Berhasil menghapus user" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan user" });
    }
});
exports.deleteUser = deleteUser;
const updateUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const id = req.params.id;
        const { name, username, bio } = req.body;
        const files = req.files;
        const photoProfilePath = (_b = (_a = files["photoProfile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
        const bannerPath = (_d = (_c = files["banner"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
        let imagePhotoProfile = null;
        let imageBanner = null;
        if (photoProfilePath) {
            imagePhotoProfile = yield (0, cloudinary_1.default)(photoProfilePath);
        }
        if (bannerPath) {
            imageBanner = yield (0, cloudinary_1.default)(bannerPath);
        }
        const updateUserData = Object.assign(Object.assign({ name: String(name), username: String(username), bio: String(bio) }, (imagePhotoProfile !== null && { photoProfile: imagePhotoProfile })), (imageBanner !== null && { banner: imageBanner }));
        const user = yield client_1.prisma.user.update({
            where: { id: id },
            data: updateUserData,
        });
        res.status(200).json({ user, message: "berhasil mengupdate user" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan user" });
    }
});
exports.updateUserHandler = updateUserHandler;
//# sourceMappingURL=user.js.map