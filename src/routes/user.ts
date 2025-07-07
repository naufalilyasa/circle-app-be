import { NextFunction, Router } from "express";
import {
  deleteUser,
  getUsers,
  getUserById,
  getUserTweets,
  getMeHandler,
  updateUserHandler,
  searchUsers,
} from "../controllers/user";
import limiter from "../middlewares/rate-limiter";
import { deserializeUser, requireUser } from "../middlewares/auth";
import upload from "../middlewares/multer";

const router = Router();

router.use(deserializeUser, requireUser);
router.get("/me", limiter({ limit: 50 }), getMeHandler);

// router.get("/", getUsers);
router.get("/", searchUsers);
router.get("/:id/posts", getUserTweets);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.patch(
  "/:id",
  upload.fields([
    { name: "photoProfile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateUserHandler
);

export { router };
