import { Router } from "express";
import {
  getTweetById,
  createTweet,
  deleteTweet,
  updateTweet,
  getAllTweets,
  getAllTweetsById,
  getAllTweetsWithMediaById,
} from "../controllers/tweet";
import upload from "../middlewares/multer";
import { deserializeUser, requireUser } from "../middlewares/auth";

const router = Router();

router.get("/", deserializeUser, requireUser, getAllTweets);
router.get("/all/:userId", deserializeUser, requireUser, getAllTweetsById);
router.get("/:tweetId", deserializeUser, requireUser, getTweetById);
router.get("/media/:tweetId", deserializeUser, requireUser, getAllTweetsWithMediaById);
router.post("/", deserializeUser, requireUser, upload.single("image"), createTweet);
router.delete("/:tweetId", deserializeUser, requireUser, deleteTweet);
router.patch("/:tweetId", deserializeUser, requireUser, upload.single("image"), updateTweet);

export { router };

