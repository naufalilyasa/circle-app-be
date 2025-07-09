import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/client";
import uploadOnCloudinary from "../utils/cloudinary";
import { verifyJwt } from "../utils/jwt";
import sharp from "sharp";

const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      omit: {
        password: true,
        passwordResetAt: true,
        passwordResetToken: true,
        verificationCode: true,
        provider: true,
      },
      take: 3,
    });
    res.status(200).json({ allUsers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan users" });
  }
};

const searchUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    if (!search) {
      res.status(200).json({ data: [] });
      return;
    }

    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const authUserId = decoded!.sub;

    const allUsers = await prisma.user.findMany({
      where: {
        username: {
          startsWith: String(search),
          mode: "insensitive",
        },
        AND: {
          id: {
            not: authUserId,
          },
        },
      },
      omit: {
        password: true,
        passwordResetAt: true,
        passwordResetToken: true,
        verificationCode: true,
        provider: true,
      },
    });

    res.status(200).json({ data: allUsers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan users" });
  }
};

const getUserTweets = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const allUserTweets = await prisma.user.findUnique({
      where: { id },

      include: { tweets: true },
    });

    res.status(200).json(allUserTweets);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user threads" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const paramsId = req.params.id;

    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("Invalid token or session has expired");
    const currentUserId = decoded.sub;

    const user = await prisma.user.findUnique({
      where: { id: paramsId },
      omit: {
        password: true,
        passwordResetAt: true,
        passwordResetToken: true,
        verificationCode: true,
        provider: true,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    const isFollowed = await prisma.follow.findFirst({
      where: {
        followingId: paramsId,
        followerId: currentUserId,
      },
    });

    res.status(200).json({
      ...user,
      isFollowedByCurrentUser: !!isFollowed,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.user.delete({ where: { id: id } });
    res.status(201).json({ message: "Berhasil menghapus user" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user" });
  }
};

type UploadFields = {
  photoProfile?: Express.Multer.File[];
  banner?: Express.Multer.File[];
};

const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, username, bio } = req.body;

    const files = req.files as UploadFields;

    let imagePhotoProfileSecureUrl = null;
    if (files.photoProfile) {
      // Convert ke WebP
      const webpBuffer = await sharp(files.photoProfile?.[0]?.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      imagePhotoProfileSecureUrl = await uploadOnCloudinary(webpBuffer);
    }

    let imageBannerSecureUrl = null;
    if (files.banner) {
      const webpBuffer = await sharp(files.banner?.[0]?.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      imageBannerSecureUrl = await uploadOnCloudinary(webpBuffer);
    }

    const updateUserData = {
      name: String(name),
      username: String(username),
      bio: String(bio),
      ...(imagePhotoProfileSecureUrl !== null && {
        photoProfile: imagePhotoProfileSecureUrl,
      }),
      ...(imageBannerSecureUrl !== null && { banner: imageBannerSecureUrl }),
    };

    const user = await prisma.user.update({
      where: { id: id },
      data: updateUserData,
    });

    res.status(200).json({ user, message: "berhasil mengupdate user" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "gagal mendapatkan user" });
  }
};

export {
  getMeHandler,
  getUsers,
  getUserById,
  getUserTweets,
  deleteUser,
  updateUserHandler,
  searchUsers,
};
