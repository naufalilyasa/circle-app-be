import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../utils/appError";
import { verifyJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";
import { excludedFields, findUniqueUser } from "../services/auth";
import { omit } from "lodash";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("bearer")
    ) {
      access_token = req.headers.authorization.split("")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) return next(new AppError(401, "You're not logged in"));

    // validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );

    if (!decoded)
      return next(new AppError(401, "Invalid token or session has expired"));

    // check if user has valid session
    const session = await redisClient.get(decoded.sub);

    if (!session)
      return next(new AppError(401, "Invalid token or session has expired"));

    // check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id });

    if (!user)
      return next(new AppError(401, "Invalid token or session has expired"));

    // add user to res.locals
    res.locals.user = omit(user, excludedFields);

    next();
  } catch (err: any) {
    next(err);
  }
};

export const requireUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user)
      return next(
        new AppError(401, "Session has expired or user doesn't exist")
      );

    next();
  } catch (err: any) {
    next(err);
  }
};
