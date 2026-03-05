import { Router } from "express";
import {
  getLikes,
  userLikeReply,
  userLikeTweet,
  userUnlikeReply,
  userUnlikeTweet,
} from "../controllers/like";
import { deserializeUser, requireUser } from "../middlewares/auth";

const router = Router();

router.get("/", getLikes);
router.post("/likeTweet/:targetTweetId", deserializeUser, requireUser, userLikeTweet);
router.delete("/unlikeTweet/:targetTweetId", deserializeUser, requireUser, userUnlikeTweet);
router.post("/likeReply/:targetReplyId", deserializeUser, requireUser, userLikeReply);
router.delete("/unlikeReply/:targetReplyId", deserializeUser, requireUser, userUnlikeReply);

export { router };

