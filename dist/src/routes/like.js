"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const like_1 = require("../controllers/like");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", like_1.getLikes);
router.post("/likeTweet/:targetTweetId", like_1.userLikeTweet);
router.delete("/unlikeTweet/:targetTweetId", like_1.userUnlikeTweet);
router.post("/likeReply/:targetReplyId", like_1.userLikeReply);
router.delete("/unlikeReply/:targetReplyId", like_1.userUnlikeReply);
//# sourceMappingURL=like.js.map