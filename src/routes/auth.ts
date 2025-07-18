import {
  Router,
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import {
  forgotPasswordHandler,
  handleLogin,
  handleLogout,
  handleRegister,
  refreshAccessTokenHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/auth";
import { validate } from "../middlewares/validate";
import {
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schemas/auth";
import { deserializeUser, requireUser } from "../middlewares/auth";

const router = Router();

router.post("/login", validate(loginUserSchema), handleLogin as RequestHandler);

router.post(
  "/register",
  validate(createUserSchema),
  handleRegister as RequestHandler
);

router.post("/logout", deserializeUser, requireUser, handleLogout);

router.get(
  "/verifyEmail/:verificationCode",
  validate(verifyEmailSchema),
  verifyEmailHandler as RequestHandler
);

router.get("/refresh", refreshAccessTokenHandler);

router.post(
  "/forgotPassword",
  validate(forgotPasswordSchema),
  forgotPasswordHandler as RequestHandler
);

router.patch(
  "/resetPassword/:resetToken",
  validate(resetPasswordSchema),
  resetPasswordHandler as RequestHandler
);

export { router };
