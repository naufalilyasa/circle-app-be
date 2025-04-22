import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/auth";
import { loginUser, registerUser } from "../services/auth";

const handleLogin = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "berhasil login" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server internal error" });
  }
};

const handleRegister = async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  }

  const { name, username, email, password } = req.body;

  try {
    const user = await registerUser(name, username, email, password);

    res.status(201).json({ user, message: "Berhasil register" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export { handleLogin, handleRegister };
