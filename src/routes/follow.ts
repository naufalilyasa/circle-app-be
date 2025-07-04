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

const router = Router();

router.get("/followers/:userId", getUserFollowers);
router.get("/suggested/:userId", getUserFollowersToSuggest);
router.get("/usersIsFollowing/:userId", getUserIsFollowFollowings);
router.get("/usersIsFollower/:userId", getUserIsFollowFollowers);
router.get("/followings/:userId", getUserFollowings);
router.post("/follow/:targetUserId", userFollow);
router.delete("/unfollow/:targetUserId", userUnfollow);

export { router };
