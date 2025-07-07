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
exports.getAllTweetsWithMediaById = exports.updateTweet = exports.deleteTweet = exports.createTweet = exports.getTweetById = exports.getAllTweetsById = exports.getAllTweets = void 0;
const client_1 = require("../prisma/client");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const jwt_1 = require("../utils/jwt");
const getAllTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy = "createdAt", order = "desc" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const access_token = req.cookies.access_token;
    const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
    if (!decoded)
        throw new Error("You are not logged in");
    const authUserId = decoded.sub;
    try {
        const total = yield client_1.prisma.tweet.count();
        const tweets = yield client_1.prisma.tweet.findMany({
            orderBy: { [sortBy]: order },
            skip,
            take: limit,
            include: {
                author: {
                    omit: {
                        password: true,
                        passwordResetAt: true,
                        passwordResetToken: true,
                        verificationCode: true,
                        provider: true,
                    },
                },
                _count: {
                    select: {
                        replies: true,
                        likes: true,
                    },
                },
            },
        });
        const tweetIdsLiked = yield client_1.prisma.like.findMany({
            where: {
                userId: authUserId,
                tweetId: { not: null },
            },
            select: {
                tweetId: true,
            },
        });
        const followingIdsOfCurrentUser = yield client_1.prisma.follow.findMany({
            where: {
                followerId: authUserId,
            },
            select: {
                followingId: true,
            },
        });
        const setFollowingIdsOfCurrentUser = new Set(followingIdsOfCurrentUser.map((d) => d.followingId));
        const setTweetIsLike = new Set(tweetIdsLiked.map((d) => d.tweetId));
        const tweetsIsLike = tweets.map((tweet) => (Object.assign(Object.assign({}, tweet), { isLike: setTweetIsLike.has(tweet.id), author: Object.assign(Object.assign({}, tweet.author), { isFollowedByCurrentUser: setFollowingIdsOfCurrentUser.has(tweet.authorId) }) })));
        res.status(200).json({
            status: "success",
            data: {
                tweetsIsLike,
                total,
                hasNext: skip + tweetsIsLike.length < total,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.getAllTweets = getAllTweets;
const getAllTweetsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const authUserId = decoded.sub;
        const result = yield client_1.prisma.tweet.findMany({
            where: {
                authorId: userId,
            },
            orderBy: {
                createdAt: "asc",
            },
            skip,
            take: limit,
            include: {
                replies: true,
                likes: true,
                author: {
                    omit: {
                        password: true,
                        passwordResetAt: true,
                        passwordResetToken: true,
                        verificationCode: true,
                        provider: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true,
                    },
                },
            },
        });
        const total = yield client_1.prisma.tweet.count();
        const tweetIds = yield client_1.prisma.like.findMany({
            where: {
                userId: authUserId,
                tweetId: { not: null },
            },
            select: {
                tweetId: true,
            },
        });
        const setTweetIds = new Set(tweetIds.map((d) => d.tweetId));
        const tweetsByIdIsLike = result.map((tweet) => (Object.assign(Object.assign({}, tweet), { isLike: setTweetIds.has(tweet.id) })));
        res.status(200).json({
            data: {
                tweetsByIdIsLike,
                total,
                hasNext: skip + result.length < total,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.getAllTweetsById = getAllTweetsById;
const getAllTweetsWithMediaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const authUserId = decoded.sub;
        const result = yield client_1.prisma.tweet.findMany({
            where: {
                authorId: userId,
                AND: {
                    imageUrl: {
                        not: null,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            skip,
            take: limit,
            include: {
                replies: true,
                likes: true,
                author: {
                    omit: {
                        password: true,
                        passwordResetAt: true,
                        passwordResetToken: true,
                        verificationCode: true,
                        provider: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true,
                    },
                },
            },
        });
        const total = yield client_1.prisma.tweet.count({
            where: {
                imageUrl: {
                    not: null,
                },
            },
        });
        const tweetIds = yield client_1.prisma.like.findMany({
            where: {
                userId: authUserId,
                tweetId: { not: null },
            },
            select: {
                tweetId: true,
            },
        });
        const setTweetIds = new Set(tweetIds.map((d) => d.tweetId));
        const tweetsWithMediaByIdIsLike = result.map((tweet) => (Object.assign(Object.assign({}, tweet), { isLike: setTweetIds.has(tweet.id) })));
        res.status(200).json({
            data: {
                tweetsWithMediaByIdIsLike,
                total,
                hasNext: skip + result.length < total,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "gagal mendapatkan tweets" });
    }
});
exports.getAllTweetsWithMediaById = getAllTweetsWithMediaById;
const getTweetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweetId = req.params.tweetId;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const authUserId = decoded.sub;
        const tweet = yield client_1.prisma.tweet.findUnique({
            where: { id: tweetId },
            include: {
                author: {
                    omit: {
                        password: true,
                        passwordResetAt: true,
                        passwordResetToken: true,
                        verificationCode: true,
                        provider: true,
                    },
                },
                replies: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        author: {
                            omit: {
                                password: true,
                                passwordResetAt: true,
                                passwordResetToken: true,
                                verificationCode: true,
                                provider: true,
                            },
                        },
                        _count: {
                            select: {
                                likes: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true,
                    },
                },
            },
        });
        const replyIdsLiked = yield client_1.prisma.like.findMany({
            where: {
                userId: authUserId,
                replyId: { not: null },
            },
            select: {
                replyId: true,
            },
        });
        const setReplyIdsLiked = new Set(replyIdsLiked.map((d) => d.replyId));
        const tweetIdsLiked = yield client_1.prisma.like.findMany({
            where: {
                userId: authUserId,
                tweetId: { not: null },
            },
            select: {
                tweetId: true,
            },
        });
        const setTweetIdsLiked = new Set(tweetIdsLiked.map((d) => d.tweetId));
        const repliesIsLike = tweet === null || tweet === void 0 ? void 0 : tweet.replies.map((reply) => (Object.assign(Object.assign({}, reply), { isLike: setReplyIdsLiked.has(reply.id) })));
        const tweetsIsLike = Object.assign(Object.assign({}, tweet), { replies: repliesIsLike, isLike: setTweetIdsLiked.has(tweetId) });
        res.status(200).json(tweetsIsLike);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mendapatkan tweet" });
    }
});
exports.getTweetById = getTweetById;
const createTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, authorId } = req.body;
        const imageTweetPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        let image = null;
        if (imageTweetPath) {
            image = yield (0, cloudinary_1.default)(imageTweetPath);
        }
        const newDataTweet = { content, authorId, imageUrl: image };
        const tweet = yield client_1.prisma.tweet.create({ data: newDataTweet });
        res.status(201).json({ tweet, message: "Berhasil membuat tweet" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal membuat tweet" });
    }
});
exports.createTweet = createTweet;
const deleteTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweetId = req.params.tweetId;
        yield client_1.prisma.tweet.delete({ where: { id: tweetId } });
        res.status(200).json({ message: "Berhasil menghapus tweet" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal menghapus tweet" });
    }
});
exports.deleteTweet = deleteTweet;
const updateTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tweetId = req.params.tweetId;
    // const { content, authorId } = req.body;
    const { content } = req.body;
    const imageTweetPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    let image = null;
    if (imageTweetPath) {
        image = yield (0, cloudinary_1.default)(imageTweetPath);
    }
    const updateTweetData = { content, imageUrl: image };
    try {
        // const user = await prisma.user.findUnique({ where: authorId });
        // if (!user) {
        //   res.status(200).json({ message: "harus login" });
        // }
        const tweet = yield client_1.prisma.tweet.update({
            where: { id: tweetId },
            data: updateTweetData,
        });
        res.status(200).json({ tweet, message: "berhasil mengupdate tweet" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "gagal mengupdate tweet" });
    }
});
exports.updateTweet = updateTweet;
//# sourceMappingURL=tweet.js.map