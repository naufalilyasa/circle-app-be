import { Router } from "express";
import {
  getUserFollowers,
  getUserFollowersToSuggest,
  getUserFollowings,
  getUserIsFollowFollowers,
  getUserIsFollowFollowings,
  userFollow,
  userUnfollow,
} from "../controllers/follow";
import { deserializeUser, requireUser } from "../middlewares/auth";

const router = Router();

router.get("/followers/:userId", getUserFollowers);
router.get("/suggested/:userId", deserializeUser, requireUser, getUserFollowersToSuggest);
router.get("/usersIsFollowing/:userId", getUserIsFollowFollowings);
router.get("/usersIsFollower/:userId", getUserIsFollowFollowers);
router.get("/followings/:userId", getUserFollowings);
router.post("/follow/:targetUserId", deserializeUser, requireUser, userFollow);
router.delete("/unfollow/:targetUserId", deserializeUser, requireUser, userUnfollow);

export { router };
