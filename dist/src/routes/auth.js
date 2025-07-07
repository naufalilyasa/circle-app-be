"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validate_1 = require("../middlewares/validate");
const auth_2 = require("../schemas/auth");
const auth_3 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.router = router;
router.post("/login", (0, validate_1.validate)(auth_2.loginUserSchema), auth_1.handleLogin);
router.post("/register", (0, validate_1.validate)(auth_2.createUserSchema), auth_1.handleRegister);
router.post("/logout", auth_3.deserializeUser, auth_3.requireUser, auth_1.handleLogout);
router.get("/verifyEmail/:verificationCode", (0, validate_1.validate)(auth_2.verifyEmailSchema), auth_1.verifyEmailHandler);
router.get("/refresh", auth_1.refreshAccessTokenHandler);
// router.get("/me", limiter, (req: Request, res: Response) => {
//   res.status(200).json({ user: (req as any).user });
// });
router.post("/forgotPassword", (0, validate_1.validate)(auth_2.forgotPasswordSchema), auth_1.forgotPasswordHandler);
router.patch("/resetPassword/:resetToken", (0, validate_1.validate)(auth_2.resetPasswordSchema), auth_1.resetPasswordHandler);
//# sourceMappingURL=auth.js.map