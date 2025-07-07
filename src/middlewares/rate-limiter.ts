import rateLimit from "express-rate-limit";

const limiter = ({ limit }: { limit: number }) => {
  return rateLimit({
    windowMs: 1 * 60 * 1000,
    limit,
    message: "Too many requests, please try again later.",
  });
};

export default limiter;
