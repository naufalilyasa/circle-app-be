import { CookieOptions, NextFunction, Request, Response } from "express";
import {
  loginUser,
  createUser,
  findUniqueUser,
  updateUser,
  findUser,
} from "../services/auth";
import "dotenv/config";
import config from "config";
import {
  CreateUserDTO,
  ForgotPasswordDTO,
  LoginUserDTO,
  ResetPasswordDTO,
} from "../schemas/auth";
import { Prisma } from "../generated/client";
import { signJwt, verifyJwt } from "../utils/jwt";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
import Email from "../utils/email";
import crypto from "crypto";
import bcrypt from "bcrypt";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

const handleLogin = async (
  req: Request<{}, {}, LoginUserDTO>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const { access_token, refresh_token } = await loginUser(email, password);

    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json({ status: "Success", access_token });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }
};

const handleRegister = async (
  req: Request<{}, {}, CreateUserDTO>,
  res: Response,
  next: NextFunction
) => {
  const { name, username, email, password } = req.body;

  // if (!req.file) {
  //   res.status(400).json({ message: "Error uploading file" });
  //   return;
  // }

  // const photoProfile = req.file.filename;

  try {
    const user = await createUser({
      name,
      username,
      email: email.toLowerCase(),
      password,
      // photoProfile,
    });

    const redirectUrl = `${config.get<string>(
      "origin"
    )}/api/v1/auth/verifyEmail/${user.verifyCode}`;

    try {
      await new Email(user.user, redirectUrl).sendVerificationCode();

      await updateUser(
        { id: user.user.id },
        { verificationCode: user.verificationCode }
      );

      return res.status(201).json({
        status: "success",
        message:
          "User registered successfully. please check your email with a verification code has been sent to your email",
      });
    } catch (err) {
      await updateUser({ id: user.user.id }, { verificationCode: null });

      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }

    // return res.status(201).json({
    //   message: "Registered user successfully",
    //   data: user.user,
    // });
  } catch (err: any) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message: "Email already exist, please use another email address",
        });
      }
    }
    next(err);
  }
};

const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const message = "Could not refresh access token";

    if (!refresh_token) return next(new AppError(401, message));

    // validate a refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      "refreshTokenPublicKey"
    );

    if (!decoded) return next(new AppError(401, message));

    // check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) return next(new AppError(401, message));

    // check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id });

    if (!user) return next(new AppError(401, message));

    // sign new access token
    const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    // add cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // send response
    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

const verifyEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.verificationCode)
      .digest("hex");

    const user = await updateUser(
      { verificationCode },
      { verified: true, verificationCode: null },
      { email: true }
    );

    if (!user) return next(new AppError(401, "Could not verify email"));

    res.render("emailVerificationSuccess");
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(403).json({
        status: "fail",
        message: "Verification code is invalid or user doesn't exist",
      });
    }
  }
};

const logout = (res: Response) => {
  res.cookie("access_token", "", { maxAge: -1 });
  res.cookie("refresh_token", "", { maxAge: -1 });
  res.cookie("logged_in", "", { maxAge: -1 });
};
const handleLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisClient.del(res.locals.user.id);
    logout(res);

    res.status(200).json({ status: "success" });
  } catch (err: any) {
    next(err);
  }
};

const forgotPasswordHandler = async (
  req: Request<Record<string, never>, Record<string, never>, ForgotPasswordDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from database
    const user = await findUser({ email: req.body.email.toLowerCase() });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        message: "You will receive a reset email if user with that email exist",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        status: "fail",
        message: "Account with that email not verified",
      });
    }

    if (user.provider) {
      return res.status(403).json({
        status: "fail",
        message:
          "We found your account. It looks like you registered with a social auth account. Try signing in with social auth.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await updateUser(
      { id: user.id },
      {
        passwordResetToken,
        passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { email: true }
    );

    try {
      const url = `http://localhost:5173/resetPassword/${resetToken}`;

      await new Email(user, url).sendPasswordResetToken();

      res.status(200).json({
        status: "success",
        message: "You will receive a reset email if user with that email exist",
      });
    } catch (err: any) {
      await updateUser(
        { id: user.id },
        { passwordResetToken: null, passwordResetAt: null },
        {}
      );
      return res.status(500).json({
        status: "error",
        message: "There was an error sending email",
      });
    }
  } catch (err: any) {
    next(err);
  }
};

const resetPasswordHandler = async (
  req: Request<
    ResetPasswordDTO["params"],
    Record<string, never>,
    ResetPasswordDTO["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await findUser({
      passwordResetToken,
      passwordResetAt: { gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token or token has expired",
      });
    }

    const password = req.body.password;
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await updateUser(
      { id: user.id },
      {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetAt: null,
      },
      { email: true }
    );

    logout(res);
    res.status(200).json({
      status: "success",
      message: "Password data updated successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

export {
  handleLogin,
  handleRegister,
  verifyEmailHandler,
  handleLogout,
  refreshAccessTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
};
