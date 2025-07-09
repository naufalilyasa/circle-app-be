import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";
import uploadOnCloudinary from "../utils/cloudinary";
import sharp from "sharp";

const getAllReplies = async (req: Request, res: Response) => {
  try {
    const result = await prisma.reply.findMany();
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const getReplyById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await prisma.reply.findUnique({ where: { id } });
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const createReply = async (req: Request, res: Response) => {
  try {
    const { content, authorId, tweetId } = req.body;

    let imageSecureUrl = null;
    if (req.file) {
      // Convert ke WebP
      const webpBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      imageSecureUrl = await uploadOnCloudinary(webpBuffer);
    }

    const result = await prisma.reply.create({
      data: {
        content,
        authorId,
        tweetId,
        imageUrl: imageSecureUrl,
      },
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const deleteReply = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await prisma.reply.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

const updateReply = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { content } = req.body;
    const result = await prisma.reply.update({
      where: { id },
      data: { content },
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "gagal mendapatkan tweets" });
  }
};

export { getAllReplies, getReplyById, createReply, deleteReply, updateReply };
