import { Router, Request, Response } from "express";
import { handleLogin, handleRegister } from "../controllers/auth";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.get("/profile", authenticate, (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome", user: (req as any).user });
});

export { router };
