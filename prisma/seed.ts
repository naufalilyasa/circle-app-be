import { Prisma } from "@prisma/client";
import { PrismaClient } from "../src/generated/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  // const deleteTweets = await prisma.tweet.deleteMany({});
  // const deleteUsers = await prisma.user.deleteMany({});

  const naufalId = await prisma.user.findUnique({
    where: {
      id: "cd857921-2177-4002-82f5-dbd0055259ed",
    },
    omit: {
      password: true,
      passwordResetAt: true,
      passwordResetToken: true,
      verificationCode: true,
      provider: true,
    },
  });

  const koikoiId = await prisma.user.findUnique({
    where: {
      id: "87775920-4de2-423a-9f1a-79ad417be18d",
    },
    omit: {
      password: true,
      passwordResetAt: true,
      passwordResetToken: true,
      verificationCode: true,
      provider: true,
    },
  });

  const tweet1Id = randomUUID();
  const tweet2Id = randomUUID();
  // const reply1Id = randomUUID();
  const reply2Id = randomUUID();

  if (!naufalId) {
    throw new Error("tidak ditemukan user");
  }

  if (!koikoiId) {
    throw new Error("tidak ditemukan user");
  }

  // await prisma.tweet.createMany({
  //   data: [
  //     {
  //       id: tweet1Id,
  //       content:
  //         "Akhir-akhir ini mulai belajar TypeScript, ternyata enak juga ya dibanding JavaScript biasa.",
  //       authorId: naufalId.id,
  //     },
  //     {
  //       id: tweet2Id,
  //       content:
  //         "Mulai nerapin rutinitas pagi: bangun jam 5, journaling, dan olahraga ringan. Hidup terasa lebih terarah.",
  //       authorId: naufalId.id,
  //     },
  //   ],
  // });

  // await prisma.reply.createMany({
  //   data: [
  //     {
  //       content:
  //         "Setuju banget! Type safety-nya bantu ngurangin bug kecil yang sering luput.",
  //       tweetId: tweet1Id,
  //       authorId: koikoiId.id,
  //     },
  //     {
  //       content:
  //         "Keren! Gue juga lagi coba habit tracker, ternyata pengaruhnya ke produktivitas lumayan besar.",
  //       tweetId: tweet2Id,
  //       authorId: koikoiId.id,
  //     },
  //     {
  //       content:
  //         "Iya bener! Apalagi pas bikin function gede, auto-complete-nya lebih jelas.",
  //       tweetId: "b14ea479-9a92-478d-bec1-797e38daba6e",
  //       authorId: naufalId.id,
  //     },
  //     {
  //       content:
  //         "Dan enaknya lagi, kolaborasi tim jadi lebih gampang karena kontraknya udah jelas dari tipe datanya.",
  //       tweetId: "b14ea479-9a92-478d-bec1-797e38daba6e",
  //       authorId: naufalId.id,
  //     },
  //   ],
  // });

  await prisma.like.createMany({
    data: [
      {
        userId: naufalId.id,
        tweetId: null,
        replyId: "ed958a22-9131-4eb9-9ef3-1f8a6836259c",
      },
      {
        userId: koikoiId.id,
        tweetId: "b14ea479-9a92-478d-bec1-797e38daba6e",
        replyId: null,
      },
      {
        userId: koikoiId.id,
        tweetId: null,
        replyId: "69ea2bd0-6c48-46bf-b9b5-ec19c94b814d",
      },
    ],
    skipDuplicates: true,
  });
  await prisma.reply.update({
    where: {
      id: "76f5fc36-1184-4a8f-90a1-149ad6752b8c",
    },
    data: {
      createdAt: new Date(),
    },
  });

  console.log("✅ Seed selesai: users, tweets, replies, likes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
