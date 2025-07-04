import { Router } from "express";
import {
  getLikes,
  userLikeReply,
  userLikeTweet,
  userUnlikeReply,
  userUnlikeTweet,
} from "../controllers/like";

const router = Router();

router.get("/", getLikes);
router.post("/likeTweet/:targetTweetId", userLikeTweet);
router.delete("/unlikeTweet/:targetTweetId", userUnlikeTweet);
router.post("/likeReply/:targetReplyId", userLikeReply);
router.delete("/unlikeReply/:targetReplyId", userUnlikeReply);

export { router };
