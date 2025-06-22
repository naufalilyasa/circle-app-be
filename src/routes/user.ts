import { Router } from "express";
import {
  deleteUser,
  getUsers,
  getUserById,
  getUserTweets,
  getMeHandler,
  updateUserHandler,
} from "../controllers/user";
import limiter from "../middlewares/rate-limiter";
import { deserializeUser, requireUser } from "../middlewares/auth";

const router = Router();

router.use(limiter, deserializeUser, requireUser);
router.get("/me", getMeHandler);

router.get("/", getUsers);
router.get("/:id/posts", getUserTweets);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUserHandler);

export { router };
