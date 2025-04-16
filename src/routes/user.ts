import { Router } from "express";
import {
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  getUserTweets,
} from "../controllers/user";

const router = Router();

router.get("/users", getUsers);
router.get("/users/:id/posts", getUserTweets);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id", updateUser);

export { router };
