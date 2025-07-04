import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import uploadOnCloudinary from "../utils/cloudinary";
import { verifyJwt } from "../utils/jwt";

const getAllTweets = async (req: Request, res: Response) => {
  const { sortBy = "createdAt", order = "desc" } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const access_token = req.cookies.access_token;
  const decoded = verifyJwt<{ sub: string }>(
    access_token,
    "accessTokenPublicKey"
  );
  if (!decoded) throw new Error("You are not logged in");

  const authUserId = decoded!.sub;

  try {
    const total = await prisma.tweet.count();
    const tweets = await prisma.tweet.findMany({
      orderBy: { [sortBy as string]: order as "asc" | "desc" },
      skip,
      take: limit,
      include: {
        author: {
          omit: {
            password: true,
            passwordResetAt: true,
            passwordResetToken: true,
            verificationCode: true,
            provider: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    const tweetIdsLiked = await prisma.like.findMany({
      where: {
        userId: authUserId,
        tweetId: { not: null },
      },
      select: {
        tweetId: true,
      },
    });

    const followingIdsOfCurrentUser = await prisma.follow.findMany({
      where: {
        followerId: authUserId,
      },
      select: {
        followingId: true,
      },
    });

    const setFollowingIdsOfCurrentUser = new Set(
      followingIdsOfCurrentUser.map((d) => d.followingId)
    );

    const setTweetIsLike = new Set(tweetIdsLiked.map((d) => d.tweetId));

    const tweetsIsLike = tweets.map((tweet) => ({
      ...tweet,
      isLike: setTweetIsLike.has(tweet.id),
      author: {
        ...tweet.author,
        isFollowedByCurrentUser: setFollowingIdsOfCurrentUser.has(
          tweet.authorId
        ),
      },
    }));

    res.status(200).json({
      status: "success",
      data: {
        tweetsIsLike,
        total,
        hasNext: skip + tweetsIsLike.length < total,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const getAllTweetsById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const authUserId = decoded!.sub;

    const result = await prisma.tweet.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
      skip,
      take: limit,
      include: {
        replies: true,
        likes: true,
        author: {
          omit: {
            password: true,
            passwordResetAt: true,
            passwordResetToken: true,
            verificationCode: true,
            provider: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });
    const total = await prisma.tweet.count();

    const tweetIds = await prisma.like.findMany({
      where: {
        userId: authUserId,
        tweetId: { not: null },
      },
      select: {
        tweetId: true,
      },
    });
    const setTweetIds = new Set(tweetIds.map((d) => d.tweetId));

    const tweetsByIdIsLike = result.map((tweet) => ({
      ...tweet,
      isLike: setTweetIds.has(tweet.id),
    }));

    res.status(200).json({
      data: {
        tweetsByIdIsLike,
        total,
        hasNext: skip + result.length < total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const getAllTweetsWithMediaById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const authUserId = decoded!.sub;

    const result = await prisma.tweet.findMany({
      where: {
        authorId: userId,
        AND: {
          imageUrl: {
            not: null,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      skip,
      take: limit,
      include: {
        replies: true,
        likes: true,
        author: {
          omit: {
            password: true,
            passwordResetAt: true,
            passwordResetToken: true,
            verificationCode: true,
            provider: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });
    const total = await prisma.tweet.count({
      where: {
        imageUrl: {
          not: null,
        },
      },
    });

    const tweetIds = await prisma.like.findMany({
      where: {
        userId: authUserId,
        tweetId: { not: null },
      },
      select: {
        tweetId: true,
      },
    });
    const setTweetIds = new Set(tweetIds.map((d) => d.tweetId));

    const tweetsWithMediaByIdIsLike = result.map((tweet) => ({
      ...tweet,
      isLike: setTweetIds.has(tweet.id),
    }));

    res.status(200).json({
      data: {
        tweetsWithMediaByIdIsLike,
        total,
        hasNext: skip + result.length < total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const getTweetById = async (req: Request, res: Response) => {
  try {
    const tweetId = req.params.tweetId;
    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const authUserId = decoded!.sub;

    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },

      include: {
        author: {
          omit: {
            password: true,
            passwordResetAt: true,
            passwordResetToken: true,
            verificationCode: true,
            provider: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              omit: {
                password: true,
                passwordResetAt: true,
                passwordResetToken: true,
                verificationCode: true,
                provider: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    const replyIdsLiked = await prisma.like.findMany({
      where: {
        userId: authUserId,
        replyId: { not: null },
      },
      select: {
        replyId: true,
      },
    });

    const setReplyIdsLiked = new Set(replyIdsLiked.map((d) => d.replyId));

    const tweetIdsLiked = await prisma.like.findMany({
      where: {
        userId: authUserId,
        tweetId: { not: null },
      },
      select: {
        tweetId: true,
      },
    });

    const setTweetIdsLiked = new Set(tweetIdsLiked.map((d) => d.tweetId));

    const repliesIsLike = tweet?.replies.map((reply) => ({
      ...reply,
      isLike: setReplyIdsLiked.has(reply.id),
    }));

    const tweetsIsLike = {
      ...tweet,
      replies: repliesIsLike,
      isLike: setTweetIdsLiked.has(tweetId),
    };

    res.status(200).json(tweetsIsLike);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan tweet" });
  }
};

const createTweet = async (req: Request, res: Response) => {
  try {
    const { content, authorId } = req.body;

    const imageTweetPath = req.file?.path;

    let image = null;

    if (imageTweetPath) {
      image = await uploadOnCloudinary(imageTweetPath);
    }

    const newDataTweet = { content, authorId, imageUrl: image };

    const tweet = await prisma.tweet.create({ data: newDataTweet });
    res.status(201).json({ tweet, message: "Berhasil membuat tweet" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal membuat tweet" });
  }
};

const deleteTweet = async (req: Request, res: Response) => {
  try {
    const tweetId = req.params.tweetId;
    await prisma.tweet.delete({ where: { id: tweetId } });

    res.status(200).json({ message: "Berhasil menghapus tweet" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal menghapus tweet" });
  }
};

const updateTweet = async (req: Request, res: Response) => {
  const tweetId = req.params.tweetId;
  // const { content, authorId } = req.body;
  const { content } = req.body;
  const imageTweetPath = req.file?.path;

  let image = null;

  if (imageTweetPath) {
    image = await uploadOnCloudinary(imageTweetPath);
  }

  const updateTweetData = { content, imageUrl: image };

  try {
    // const user = await prisma.user.findUnique({ where: authorId });

    // if (!user) {
    //   res.status(200).json({ message: "harus login" });
    // }

    const tweet = await prisma.tweet.update({
      where: { id: tweetId },
      data: updateTweetData,
    });
    res.status(200).json({ tweet, message: "berhasil mengupdate tweet" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mengupdate tweet" });
  }
};

export {
  getAllTweets,
  getAllTweetsById,
  getTweetById,
  createTweet,
  deleteTweet,
  updateTweet,
  getAllTweetsWithMediaById,
};
