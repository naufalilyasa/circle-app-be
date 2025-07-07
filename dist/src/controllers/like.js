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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUnlikeReply = exports.userLikeReply = exports.userUnlikeTweet = exports.userLikeTweet = exports.getLikesByUserId = exports.getLikes = void 0;
const client_1 = require("../prisma/client");
const jwt_1 = require("../utils/jwt");
const getLikes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client_1.prisma.like.findMany({
            include: {
                reply: true,
                tweet: true,
                user: true,
            },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "server internal error" });
    }
});
exports.getLikes = getLikes;
const getLikesByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield client_1.prisma.like.findMany({
            where: {
                user: {
                    id,
                },
            },
            include: {
                reply: true,
                tweet: true,
                user: true,
            },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "server internal error" });
    }
});
exports.getLikesByUserId = getLikesByUserId;
const userLikeTweet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetTweetId = req.params.targetTweetId;
        const { userId } = req.body;
        const existing = yield client_1.prisma.like.findUnique({
            where: {
                userId_tweetId: {
                    tweetId: targetTweetId,
                    userId,
                },
            },
        });
        if (existing)
            throw new Error("You already like this tweet");
        const result = yield client_1.prisma.like.create({
            data: {
                tweetId: targetTweetId,
                userId,
            },
        });
        res.status(200).json({ status: "success", message: "Like success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "server internal error" });
    }
});
exports.userLikeTweet = userLikeTweet;
const userUnlikeTweet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetTweetId = req.params.targetTweetId;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const userId = decoded.sub;
        const result = yield client_1.prisma.like.delete({
            where: {
                userId_tweetId: {
                    tweetId: targetTweetId,
                    userId,
                },
            },
        });
        res.status(200).json({ status: "success", message: "Unlike success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "server internal error" });
    }
});
exports.userUnlikeTweet = userUnlikeTweet;
const userLikeReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetReplyId = req.params.targetReplyId;
        const { userId } = req.body;
        const existing = yield client_1.prisma.like.findUnique({
            where: {
                userId_replyId: {
                    replyId: targetReplyId,
                    userId,
                },
            },
        });
        if (existing)
            throw new Error("You already like this reply");
        const result = yield client_1.prisma.like.create({
            data: {
                replyId: targetReplyId,
                userId,
            },
        });
        res.status(200).json({ status: "success", message: "Like success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "server internal error" });
    }
});
exports.userLikeReply = userLikeReply;
const userUnlikeReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetReplyId = req.params.targetReplyId;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const userId = decoded.sub;
        const result = yield client_1.prisma.like.delete({
            where: {
                userId_replyId: {
                    replyId: targetReplyId,
                    userId,
                },
            },
        });
        res.status(200).json({ status: "success", message: "Unlike success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "server internal error" });
    }
});
exports.userUnlikeReply = userUnlikeReply;
//# sourceMappingURL=like.js.map