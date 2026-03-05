import { createClient } from "redis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

export const connectRedis = async () => {
  if (redisClient.isOpen) return redisClient;

  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
    return redisClient;
  } catch (error) {
    console.error("Redis connection error:", error);
    // Don't loop infinitely in serverless, let the caller handle the throw
    throw error;
  }
};

export default redisClient;
