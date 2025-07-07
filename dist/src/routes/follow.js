"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const follow_1 = require("../controllers/follow");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/followers/:userId", follow_1.getUserFollowers);
router.get("/suggested/:userId", follow_1.getUserFollowersToSuggest);
router.get("/usersIsFollowing/:userId", follow_1.getUserIsFollowFollowings);
router.get("/usersIsFollower/:userId", follow_1.getUserIsFollowFollowers);
router.get("/followings/:userId", follow_1.getUserFollowings);
router.post("/follow/:targetUserId", follow_1.userFollow);
router.delete("/unfollow/:targetUserId", follow_1.userUnfollow);
//# sourceMappingURL=follow.js.map