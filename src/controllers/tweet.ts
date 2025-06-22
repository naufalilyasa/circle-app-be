import { Request, Response } from "express";
import { prisma } from "../prisma/client";

const getTweets = async (req: Request, res: Response) => {
  const {
    userId,
    sortBy = "createdAt",
    order = "asc",
    limit = 10,
    offset = 0,
  } = req.query;
  let tweets = undefined;

  try {
    if (!userId) {
      tweets = await prisma.tweet.findMany({
        where: { authorId: userId },
        orderBy: { [sortBy as string]: order as "asc" | "desc" },
        skip: Number(offset),
        take: Number(limit),
      });
    } else {
      tweets = await prisma.tweet.findMany({
        orderBy: { [sortBy as string]: order as "asc" | "desc" },
        skip: Number(offset),
        take: Number(limit),
      });
    }
    res.status(200).json(tweets);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan tweets" });
  }
};

const getTweetById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tweet = await prisma.tweet.findUnique({
      where: { id },
      include: { author: true },
    });
    res.status(200).json(tweet);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan tweet" });
  }
};

const createTweet = async (req: Request, res: Response) => {
  try {
    const { content, authorId } = req.body;
    const newDataTweet = { content, authorId };
    const tweet = await prisma.tweet.create({ data: newDataTweet });
    res.status(201).json({ tweet, message: "Berhasil membuat tweet" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal membuat tweet" });
  }
};

const deleteTweet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.tweet.delete({ where: { id } });
    res.status(200).json({ message: "Berhasil menghapus tweet" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal menghapus tweet" });
  }
};
const updateTweet = async (req: Request, res: Response) => {
  const id = req.params.id;
  // const { content, authorId } = req.body;
  const { content } = req.body;
  const updateTweetData = { content };

  try {
    // const user = await prisma.user.findUnique({ where: authorId });

    // if (!user) {
    //   res.status(200).json({ message: "harus login" });
    // }

    const tweet = await prisma.tweet.update({
      where: { id },
      data: updateTweetData,
    });
    res.status(200).json({ tweet, message: "berhasil mengupdate tweet" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mengupdate tweet" });
  }
};

export { getTweets, getTweetById, createTweet, deleteTweet, updateTweet };
