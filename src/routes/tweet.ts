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

const router = Router();

router.get("/", getAllTweets);
router.get("/all/:userId", getAllTweetsById);
router.get("/:tweetId", getTweetById);
router.get("/media/:tweetId", getAllTweetsWithMediaById);
router.post("/", upload.single("image"), createTweet);
router.delete("/:tweetId", deleteTweet);
router.patch("/:tweetId", upload.single("image"), updateTweet);

export { router };
