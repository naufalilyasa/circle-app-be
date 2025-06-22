import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  const deleteTweets = await prisma.thread.deleteMany({});
  const deleteUsers = await prisma.user.deleteMany({});

  // Buat beberapa user
  // const user1 = await prisma.user.create({
  //   data: {
  //     name: "Alice",
  //     username: "alice123",
  //     email: "alice@example.com",
  //     password: "hashed_password_1", // ganti dengan password hasil hashing di production
  //   },
  // });

  // const user2 = await prisma.user.create({
  //   data: {
  //     name: "Bob",
  //     username: "bobby",
  //     email: "bob@example.com",
  //     password: "hashed_password_2",
  //   },
  // });

  // // Buat tweet dari masing-masing user
  // await prisma.tweet.createMany({
  //   data: [
  //     {
  //       content: "Hello world! Ini tweet pertama dari Alice.",
  //       authorId: user1.id,
  //     },
  //     {
  //       content: "Bob di sini, mencicipi dunia tweet.",
  //       authorId: user2.id,
  //     },
  //     {
  //       content: "Tweet kedua dari Alice. Hari ini menyenangkan!",
  //       authorId: user1.id,
  //     },
  //   ],
  // });

  console.log("✅ Seed berhasil dibuat.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
