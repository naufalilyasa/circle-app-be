import { Router } from "express";
import {
  createReply,
  deleteReply,
  getAllReplies,
  getReplyById,
  updateReply,
} from "../controllers/reply";
import upload from "../middlewares/multer";
import { deserializeUser, requireUser } from "../middlewares/auth";

const router = Router();

router.get("/", deserializeUser, requireUser, getAllReplies);
router.get("/:id", deserializeUser, requireUser, getReplyById);
router.post("/", deserializeUser, requireUser, upload.single("image"), createReply);
router.delete("/:id", deserializeUser, requireUser, deleteReply);
router.patch("/:id", deserializeUser, requireUser, updateReply);

export { router };

