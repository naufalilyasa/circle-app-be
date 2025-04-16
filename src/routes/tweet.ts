import { Router } from "express";
import {
  getTweets,
  getTweetById,
  createTweet,
  deleteTweet,
  updateTweet,
} from "../controllers/tweet";

const router = Router();

router.get("/tweets", getTweets);
router.get("/tweets/:id", getTweetById);
router.post("/tweets", createTweet);
router.delete("/tweets/:id", deleteTweet);
router.patch("/tweets/:id", updateTweet);

export { router };
