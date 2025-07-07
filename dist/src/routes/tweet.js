"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const tweet_1 = require("../controllers/tweet");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", tweet_1.getAllTweets);
router.get("/all/:userId", tweet_1.getAllTweetsById);
router.get("/:tweetId", tweet_1.getTweetById);
router.get("/media/:tweetId", tweet_1.getAllTweetsWithMediaById);
router.post("/", multer_1.default.single("image"), tweet_1.createTweet);
router.delete("/:tweetId", tweet_1.deleteTweet);
router.patch("/:tweetId", multer_1.default.single("image"), tweet_1.updateTweet);
//# sourceMappingURL=tweet.js.map