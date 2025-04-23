import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  message: "terlalu banyak request, coba beberapa saat lagi.",
});
export default limiter;
