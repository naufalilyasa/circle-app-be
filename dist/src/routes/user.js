"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
exports.router = router;
router.use(auth_1.deserializeUser, auth_1.requireUser);
router.get("/me", user_1.getMeHandler);
// router.get("/", getUsers);
router.get("/", user_1.searchUsers);
router.get("/:id/posts", user_1.getUserTweets);
router.get("/:id", user_1.getUserById);
router.delete("/:id", user_1.deleteUser);
router.patch("/:id", multer_1.default.fields([
    { name: "photoProfile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]), user_1.updateUserHandler);
//# sourceMappingURL=user.js.map