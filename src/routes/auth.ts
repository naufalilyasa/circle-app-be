import { Router, Request, Response } from "express";
import { handleLogin, handleRegister } from "../controllers/auth";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";
import limiter from "../middlewares/rate-limiter";
import corsMiddleware from "../middlewares/cors";

const router = Router();

router.post("/login", handleLogin);
router.post("/register", upload.single("profile"), handleRegister);
router.get(
  "/profile",
  limiter,
  corsMiddleware,
  authenticate,
  (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome", user: (req as any).user });
  }
);

export { router };
