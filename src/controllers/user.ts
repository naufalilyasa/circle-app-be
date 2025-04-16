import { Request, Response } from "express";
import { prisma } from "../prisma/client";

const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: { _count: { select: { tweets: true } } },
    });

    const allUsersCount = await prisma.user.count({
      select: {
        _all: true,
      },
    });

    const allTweetsCount = await prisma.tweet.count({
      select: {
        _all: true,
      },
    });

    res.status(200).json({ allUsers, allUsersCount, allTweetsCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan users" });
  }
};

const getUserTweets = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const allUserTweets = await prisma.user.findUnique({
      where: { id },

      include: { tweets: true },
    });

    res.status(200).json(allUserTweets);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user tweets" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const paramsId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: Number(paramsId) },
      include: { _count: { select: { tweets: true } } },
    });

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(201).json({ message: "Berhasil menghapus user" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, username, email, password } = req.body;
    const updateUserData = { name, username, email, password };

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateUserData,
    });
    res.status(200).json({ user, message: "berhasil mengupdate user" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user" });
  }
};

export { getUsers, getUserById, getUserTweets, deleteUser, updateUser };
