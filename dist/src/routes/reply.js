"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const reply_1 = require("../controllers/reply");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", reply_1.getAllReplies);
router.get("/:id", reply_1.getReplyById);
router.post("/", multer_1.default.single("image"), reply_1.createReply);
router.delete("/:id", reply_1.deleteReply);
router.patch("/:id", reply_1.updateReply);
//# sourceMappingURL=reply.js.map