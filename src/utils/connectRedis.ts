import { createClient } from "redis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected successfully");
      await redisClient.set("try", "Hello welcome to my app");
    } else {
      console.log("ℹ️ Redis already connected");
    }
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
