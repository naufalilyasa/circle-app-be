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
exports.getUserFollowersToSuggest = exports.getUserIsFollowFollowers = exports.getUserIsFollowFollowings = exports.userUnfollow = exports.userFollow = exports.getUserFollowings = exports.getUserFollowers = void 0;
const client_1 = require("../prisma/client");
const jwt_1 = require("../utils/jwt");
const getUserFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const result = yield client_1.prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: {
                    omit: {
                        password: true,
                        passwordResetAt: true,
                        passwordResetToken: true,
                        verificationCode: true,
                        provider: true,
                    },
                },
            },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.getUserFollowers = getUserFollowers;
const getUserFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const result = yield client_1.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    omit: {
                        password: true,
                        passwordResetAt: true,
                        passwordResetToken: true,
                        verificationCode: true,
                        provider: true,
                    },
                },
            },
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.getUserFollowings = getUserFollowings;
const userFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUserId = req.params.targetUserId;
        const { userId } = req.body;
        const existing = yield client_1.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                },
            },
        });
        if (existing) {
            throw new Error("You already follow this user");
        }
        const result = yield client_1.prisma.follow.create({
            data: {
                followerId: userId,
                followingId: targetUserId,
            },
        });
        res.status(200).json({ status: "success", message: "Follow success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.userFollow = userFollow;
const userUnfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUserId = req.params.targetUserId;
        const access_token = req.cookies.access_token;
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded)
            throw new Error("You are not logged in");
        const userId = decoded.sub;
        const result = yield client_1.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                },
            },
        });
        res.status(200).json({
            status: "success",
            message: "Unfollow successful",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.userUnfollow = userUnfollow;
const getUserIsFollowFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Get the ids of login user followings
        const followingIds = yield client_1.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followingId: true,
            },
        });
        const followingIdsArr = followingIds.map((d) => d.followingId);
        // Get all users without current user login
        const allUsers = yield client_1.prisma.user.findMany({
            where: {
                id: { notIn: [userId], in: followingIdsArr },
            },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                photoProfile: true,
            },
        });
        if (!allUsers)
            throw new Error("Users not found");
        // Set login user following ids
        const followingId = new Set(followingIds.map((user) => user.followingId));
        // add isFollowing property to tell status of the user is following login user or not
        const usersIsFollowing = allUsers.map((user) => {
            var _a;
            return (Object.assign(Object.assign({}, user), { isFollowing: (_a = followingId.has(user.id)) !== null && _a !== void 0 ? _a : false }));
        });
        res.status(200).json({ usersIsFollowing, followingIds });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.getUserIsFollowFollowings = getUserIsFollowFollowings;
const getUserIsFollowFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Get the follower ids of login user followers
        const followerIds = yield client_1.prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            select: {
                followerId: true,
            },
        });
        const followerIdsArr = followerIds.map((d) => d.followerId);
        // Get the following ids of login user followings
        const followingIds = yield client_1.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followingId: true,
            },
        });
        // Get all users without current user login
        const allUsers = yield client_1.prisma.user.findMany({
            where: {
                id: { in: followerIdsArr, notIn: [userId] },
            },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                photoProfile: true,
            },
        });
        if (!allUsers)
            throw new Error("Users not found");
        // Set login user following ids
        const followingIdsSet = new Set(followingIds.map((user) => user.followingId));
        // add isFollowing property to tell status of the user is following login user or not
        const usersIsFollower = allUsers.map((user) => {
            var _a;
            return (Object.assign(Object.assign({}, user), { isFollower: (_a = followingIdsSet.has(user.id)) !== null && _a !== void 0 ? _a : false }));
        });
        res.status(200).json({ usersIsFollower });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.getUserIsFollowFollowers = getUserIsFollowFollowers;
const getUserFollowersToSuggest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Request params userId (login user id)
        const userId = req.params.userId;
        // Get following ids of the login user
        const followingsOfUser = yield client_1.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followingId: true,
            },
        });
        const followingsOfUserArr = followingsOfUser.map((d) => d.followingId);
        // Get followers id of the login user
        const followersOfUser = yield client_1.prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            select: {
                followerId: true,
            },
        });
        const followersOfUserArr = followersOfUser.map((d) => d.followerId);
        // Get all login user followers that:
        // 1. Users follow login user
        // 2. Login user not follow the followers
        // 3. filter suggested followers with the most count followers to the least
        const suggestedFollowers = yield client_1.prisma.user.findMany({
            where: {
                id: {
                    in: followersOfUserArr,
                    notIn: [...followingsOfUserArr, userId],
                },
            },
            omit: {
                password: true,
                passwordResetAt: true,
                passwordResetToken: true,
                verificationCode: true,
                provider: true,
                createdAt: true,
                updatedAt: true,
                role: true,
            },
            include: {
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            orderBy: {
                followers: {
                    _count: "desc",
                },
            },
            take: 5,
        });
        // Set flag isFollow
        const followingIdsSet = new Set(followingsOfUser.map((d) => d.followingId));
        const suggestedFollowersIsFollow = suggestedFollowers.map((user) => (Object.assign(Object.assign({}, user), { isFollow: followingIdsSet.has(user.id) })));
        res.status(200).json({ suggestedFollowers, suggestedFollowersIsFollow });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server internal error" });
    }
});
exports.getUserFollowersToSuggest = getUserFollowersToSuggest;
//# sourceMappingURL=follow.js.map