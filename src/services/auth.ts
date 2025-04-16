import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";

export const registerUser = async (
  name: string,
  username: string,
  email: string,
  password: string
) => {
  if (!email.match(/@/) || password.length < 6) {
    throw new Error("email dan password salah");
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  if (!hash) {
    throw new Error("Hashing password gagal");
  }

  const newDataUser = { name, username, email, password: hash };
  const user = await prisma.user.create({ data: newDataUser });

  return { id: user.id, email: user.email };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { _count: { select: { tweets: true } } },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user?.password);

  if (!match) {
    throw new Error("gagal login password salah");
  }

  const token = signToken({ id: user.id, role: "admin" });

  return token;
};
