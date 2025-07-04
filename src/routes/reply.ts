import { Router } from "express";
import {
  createReply,
  deleteReply,
  getAllReplies,
  getReplyById,
  updateReply,
} from "../controllers/reply";
import upload from "../middlewares/multer";

const router = Router();

router.get("/", getAllReplies);
router.get("/:id", getReplyById);
router.post("/", upload.single("image"), createReply);
router.delete("/:id", deleteReply);
router.patch("/:id", updateReply);

export { router };
