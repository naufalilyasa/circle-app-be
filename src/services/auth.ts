import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { Prisma, User } from "../generated/client";
import crypto from "crypto";
import redisClient from "../utils/connectRedis";
import config from "config";
import { signJwt } from "../utils/jwt";
import AppError from "../utils/appError";

export const excludedFields = [
  "createdAt",
  "updatedAt",
  "password",
  "confirmPassword",
  "verified",
  "verificationCode",
  "passwordResetAt",
  "passwordResetToken",
];

export const createUser = async (input: Prisma.UserCreateInput) => {
  // const { email, password, name, username, photoProfile } = input;
  const { email, password, name, username } = input;

  const verifyCode = crypto.randomBytes(32).toString("hex");
  const verificationCode = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(password, salt);

  const dataUser = {
    name,
    username,
    email,
    password: hashPassword,
    // photoProfile,
    verificationCode,
  };

  const user = (await prisma.user.create({ data: dataUser })) as User;

  return { user, verifyCode, verificationCode };

  // return { id: user.id, email: user.email };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ access_token: string; refresh_token: string }> => {
  const user = await findUniqueUser(
    {
      email: email.toLowerCase(),
    },
    {
      id: true,
      email: true,
      verified: true,
      password: true,
    }
  );

  // check if user verified
  if (!user.verified)
    throw new AppError(
      400,
      "You are not verified, please verify your email to login"
    );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(400, "Invalid email or password");
  }

  return await signTokens(user);
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.update({
    where,
    data,
    select,
  })) as User;
};

const signTokens = async (user: Prisma.UserCreateInput) => {
  // create session
  redisClient.set(`${user.id}`, JSON.stringify(user), {
    EX: config.get<number>("redisCacheExpiresIn") * 60,
  });

  // Create access and expires token
  const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  return { access_token, refresh_token };
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const findUser = async (
  where: Prisma.UserWhereInput,
  select?: Prisma.UserSelect
) => {
  return await prisma.user.findFirst({ where, select });
};
