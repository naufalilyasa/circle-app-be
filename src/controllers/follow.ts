import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { verifyJwt } from "../utils/jwt";

const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const result = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          omit: {
            password: true,
            passwordResetAt: true,
            passwordResetToken: true,
            verificationCode: true,
            provider: true,
          },
        },
      },
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

const getUserFollowings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const result = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          omit: {
            password: true,
            passwordResetAt: true,
            passwordResetToken: true,
            verificationCode: true,
            provider: true,
          },
        },
      },
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

const userFollow = async (req: Request, res: Response) => {
  try {
    const targetUserId = req.params.targetUserId;
    const { userId } = req.body;

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      throw new Error("You already follow this user");
    }

    const result = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });

    res.status(200).json({ status: "success", message: "Follow success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

const userUnfollow = async (req: Request, res: Response) => {
  try {
    const targetUserId = req.params.targetUserId;
    const access_token = req.cookies.access_token;
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );
    if (!decoded) throw new Error("You are not logged in");

    const userId = decoded!.sub;

    const result = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Unfollow successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

const getUserIsFollowFollowings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Get the ids of login user followings
    const followingIds = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIdsArr = followingIds.map((d) => d.followingId);

    // Get all users without current user login
    const allUsers = await prisma.user.findMany({
      where: {
        id: { notIn: [userId], in: followingIdsArr },
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        photoProfile: true,
      },
    });

    if (!allUsers) throw new Error("Users not found");

    // Set login user following ids
    const followingId = new Set(followingIds.map((user) => user.followingId));

    // add isFollowing property to tell status of the user is following login user or not
    const usersIsFollowing = allUsers.map((user) => ({
      ...user,
      isFollowing: followingId.has(user.id) ?? false,
    }));

    res.status(200).json({ usersIsFollowing, followingIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

const getUserIsFollowFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Get the follower ids of login user followers
    const followerIds = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    const followerIdsArr = followerIds.map((d) => d.followerId);

    // Get the following ids of login user followings
    const followingIds = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    // Get all users without current user login
    const allUsers = await prisma.user.findMany({
      where: {
        id: { in: followerIdsArr, notIn: [userId] },
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        photoProfile: true,
      },
    });

    if (!allUsers) throw new Error("Users not found");

    // Set login user following ids
    const followingIdsSet = new Set(
      followingIds.map((user) => user.followingId)
    );

    // add isFollowing property to tell status of the user is following login user or not
    const usersIsFollower = allUsers.map((user) => ({
      ...user,
      isFollower: followingIdsSet.has(user.id) ?? false,
    }));

    res.status(200).json({ usersIsFollower });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

const getUserFollowersToSuggest = async (req: Request, res: Response) => {
  try {
    // Request params userId (login user id)
    const userId = req.params.userId;

    // Get following ids of the login user
    const followingsOfUser = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingsOfUserArr = followingsOfUser.map((d) => d.followingId);

    // Get followers id of the login user
    const followersOfUser = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    const followersOfUserArr = followersOfUser.map((d) => d.followerId);

    // Get all login user followers that:
    // 1. Users follow login user
    // 2. Login user not follow the followers
    // 3. filter suggested followers with the most count followers to the least
    const suggestedFollowers = await prisma.user.findMany({
      where: {
        id: {
          in: followersOfUserArr,
          notIn: [...followingsOfUserArr, userId],
        },
      },
      omit: {
        password: true,
        passwordResetAt: true,
        passwordResetToken: true,
        verificationCode: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
      include: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Set flag isFollow
    const followingIdsSet = new Set(followingsOfUser.map((d) => d.followingId));

    const suggestedFollowersIsFollow = suggestedFollowers.map((user) => ({
      ...user,
      isFollow: followingIdsSet.has(user.id),
    }));

    res.status(200).json({ suggestedFollowers, suggestedFollowersIsFollow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server internal error" });
  }
};

export {
  getUserFollowers,
  getUserFollowings,
  userFollow,
  userUnfollow,
  getUserIsFollowFollowings,
  getUserIsFollowFollowers,
  getUserFollowersToSuggest,
};
