import { NextFunction, Response, Request } from "express";
import { prisma } from "../prisma/client";
import { verifyJwt } from "../utils/jwt";

const getLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await prisma.like.findMany({
      include: {
        reply: true,
        tweet: true,
        user: true,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server internal error" });
  }
};

const getLikesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;

    const result = await prisma.like.findMany({
      where: {
        user: {
          id,
        },
      },
      include: {
        reply: true,
        tweet: true,
        user: true,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server internal error" });
  }
};

const userLikeTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetTweetId = req.params.targetTweetId as string;
    const userId = res.locals.user.id;

    const existing = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          tweetId: targetTweetId,
          userId,
        },
      },
    });

    if (existing) {
      res.status(409).json({ status: "fail", message: "You already like this tweet" });
      return;
    }

    const result = await prisma.like.create({
      data: {
        tweetId: targetTweetId,
        userId,
      },
    });

    res.status(201).json({ status: "success", message: "Like success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server internal error" });
  }
};

const userUnlikeTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetTweetId = req.params.targetTweetId as string;
    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const userId = decoded.sub;

    const result = await prisma.like.delete({
      where: {
        userId_tweetId: {
          tweetId: targetTweetId,
          userId,
        },
      },
    });

    res.status(200).json({ status: "success", message: "Unlike success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server internal error" });
  }
};

const userLikeReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetReplyId = req.params.targetReplyId as string;
    const userId = res.locals.user.id;

    const existing = await prisma.like.findUnique({
      where: {
        userId_replyId: {
          replyId: targetReplyId,
          userId,
        },
      },
    });

    if (existing) {
      res.status(409).json({ status: "fail", message: "You already like this reply" });
      return;
    }

    const result = await prisma.like.create({
      data: {
        replyId: targetReplyId,
        userId,
      },
    });

    res.status(201).json({ status: "success", message: "Like success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server internal error" });
  }
};

const userUnlikeReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetReplyId = req.params.targetReplyId as string;
    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const userId = decoded.sub;

    const result = await prisma.like.delete({
      where: {
        userId_replyId: {
          replyId: targetReplyId,
          userId,
        },
      },
    });

    res.status(200).json({ status: "success", message: "Unlike success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server internal error" });
  }
};

export {
  getLikes,
  getLikesByUserId,
  userLikeTweet,
  userUnlikeTweet,
  userLikeReply,
  userUnlikeReply,
};
